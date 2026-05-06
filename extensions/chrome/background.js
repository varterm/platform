// Varterm TTS Chrome Extension - Background Service Worker

const API_ENDPOINT = 'https://www.varterm.com';

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'varterm-read-selection',
    title: 'Read with Varterm',
    contexts: ['selection']
  });
  
  chrome.contextMenus.create({
    id: 'varterm-read-page',
    title: 'Read entire page',
    contexts: ['page']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'varterm-read-selection') {
    chrome.tabs.sendMessage(tab.id, {
      action: 'speak',
      text: info.selectionText
    });
  } else if (info.menuItemId === 'varterm-read-page') {
    chrome.tabs.sendMessage(tab.id, { action: 'speakPage' });
  }
});

// Handle keyboard commands
chrome.commands.onCommand.addListener((command, tab) => {
  if (command === 'read-selection') {
    chrome.tabs.sendMessage(tab.id, { action: 'speakSelection' });
  } else if (command === 'stop-speaking') {
    chrome.tabs.sendMessage(tab.id, { action: 'stop' });
  }
});

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getAudio') {
    fetchAudio(request.text, request.voice, request.rate)
      .then(audioUrl => sendResponse({ success: true, audioUrl }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  }
  
  if (request.action === 'getSettings') {
    chrome.storage.sync.get({
      voiceTier: 'cloud',
      voice: 'en-US-AriaNeural',
      rate: 1.0,
      stripMarkdown: true
    }, sendResponse);
    return true;
  }
  
  if (request.action === 'saveSettings') {
    chrome.storage.sync.set(request.settings, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

async function fetchAudio(text, voice, rate) {
  let response;
  try {
    response = await fetch(`${API_ENDPOINT}/api/edge-tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, voice, rate })
    });
  } catch (error) {
    throw new Error('Network error while contacting Varterm TTS');
  }
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to generate audio');
  }
  
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
