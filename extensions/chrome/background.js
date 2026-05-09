// Varterm TTS Chrome Extension - Background Service Worker

const API_ENDPOINT = 'https://www.varterm.com';
const RESTRICTED_PREFIXES = [
  'chrome://',
  'chrome-extension://',
  'edge://',
  'about:',
  'devtools://',
  'view-source:',
  'https://chromewebstore.google.com/'
];

function isRestrictedUrl(url = '') {
  return RESTRICTED_PREFIXES.some((prefix) => url.startsWith(prefix));
}

function ensureContentScript(tabId, callback) {
  chrome.scripting.insertCSS(
    {
      target: { tabId },
      files: ['content.css']
    },
    () => {
      if (chrome.runtime.lastError) {
        callback(false);
        return;
      }
      chrome.scripting.executeScript(
        {
          target: { tabId },
          files: ['content.js']
        },
        () => {
          if (chrome.runtime.lastError) {
            callback(false);
            return;
          }
          callback(true);
        }
      );
    }
  );
}

function sendToTab(tabId, message, retried = false, tabUrl = '') {
  if (!tabId) return;
  if (tabUrl && isRestrictedUrl(tabUrl)) return;

  chrome.tabs.sendMessage(tabId, message, () => {
    if (chrome.runtime.lastError) {
      const err = chrome.runtime.lastError.message || '';
      const missingReceiver = err.includes('Receiving end does not exist');

      // Self-heal on regular pages by injecting content script once and retrying.
      if (missingReceiver && !retried) {
        const tryInjectAndRetry = (resolvedUrl = '') => {
          if (isRestrictedUrl(resolvedUrl)) return;
          ensureContentScript(tabId, (ok) => {
            if (ok) {
              sendToTab(tabId, message, true, resolvedUrl);
            }
          });
        };

        if (tabUrl) {
          tryInjectAndRetry(tabUrl);
        } else {
          chrome.tabs.get(tabId, (tab) => {
            if (chrome.runtime.lastError) return;
            tryInjectAndRetry(tab?.url || '');
          });
        }
        return;
      }

      // Only log actionable non-restricted errors.
      if (!missingReceiver) {
        chrome.tabs.get(tabId, (tab) => {
          if (!chrome.runtime.lastError && !isRestrictedUrl(tab?.url || '')) {
            console.warn('Varterm tab message failed:', err);
          }
        });
      }
    }
  });
}

function performTabAction(tabAction, sendResponse) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab?.id) {
      sendResponse({ success: false, error: 'No active tab' });
      return;
    }

    if (isRestrictedUrl(tab.url || '')) {
      sendResponse({ success: false, error: 'Cannot access this page' });
      return;
    }

    ensureContentScript(tab.id, (ok) => {
      if (!ok) {
        sendResponse({ success: false, error: 'Cannot access this page' });
        return;
      }

      chrome.tabs.sendMessage(tab.id, { action: tabAction }, (response) => {
        if (chrome.runtime.lastError) {
          sendResponse({ success: false, error: 'Cannot access this page' });
          return;
        }
        sendResponse(response?.success ? response : { success: true });
      });
    });
  });
}

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
    sendToTab(tab?.id, {
      action: 'speak',
      text: info.selectionText
    }, false, tab?.url);
  } else if (info.menuItemId === 'varterm-read-page') {
    sendToTab(tab?.id, { action: 'speakPage' }, false, tab?.url);
  }
});

// Handle keyboard commands
chrome.commands.onCommand.addListener((command, tab) => {
  const action = command === 'read-selection'
    ? { action: 'speakSelection' }
    : command === 'stop-speaking'
    ? { action: 'stop' }
    : null;
  if (!action) return;

  if (tab?.id) {
    sendToTab(tab.id, action, false, tab?.url);
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      sendToTab(tabs[0].id, action, false, tabs[0]?.url);
    }
  });
});

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getAudio') {
    fetchAudio(request.text, request.voice, request.rate)
      .then(({ audioBytes, mimeType }) => sendResponse({ success: true, audioBytes, mimeType }))
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

  if (request.action === 'performTabAction') {
    performTabAction(request.tabAction, sendResponse);
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

  const contentType = response.headers.get('content-type') || '';
  const arrayBuffer = await response.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  // Guard against HTML/JSON responses masquerading as audio.
  if (!contentType.includes('audio') || bytes.length < 128) {
    let preview = '';
    try {
      preview = new TextDecoder().decode(bytes.slice(0, 200));
    } catch {
      preview = '';
    }
    throw new Error(`Invalid audio response (${contentType || 'unknown type'}) ${preview}`.trim());
  }

  return {
    audioBytes: Array.from(bytes),
    mimeType: contentType,
  };
}
