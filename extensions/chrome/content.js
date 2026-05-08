// Varterm TTS Chrome Extension - Content Script

let audio = null;
let isPaused = false;
let floatingButton = null;
let currentAudioUrl = null;
let webAudioContext = null;
let webAudioSource = null;

// Settings
let settings = {
  voiceTier: 'cloud',
  voice: 'en-US-AriaNeural',
  rate: 1.0,
  stripMarkdown: true
};

// Load settings
chrome.runtime.sendMessage({ action: 'getSettings' }, (response) => {
  if (response) settings = { ...settings, ...response };
});

// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'speak':
      speakText(request.text);
      break;
    case 'speakSelection':
      speakSelection();
      break;
    case 'speakPage':
      speakPage();
      break;
    case 'stop':
      stopSpeaking();
      break;
    case 'pause':
      togglePause();
      break;
    case 'updateSettings':
      settings = { ...settings, ...request.settings };
      break;
  }
});

// Show floating button on text selection
document.addEventListener('mouseup', (e) => {
  const selection = window.getSelection();
  const text = selection.toString().trim();
  
  if (text.length > 0 && text.length < 50000) {
    showFloatingButton(e.clientX, e.clientY, text);
  } else {
    hideFloatingButton();
  }
});

document.addEventListener('mousedown', (e) => {
  if (floatingButton && !floatingButton.contains(e.target)) {
    hideFloatingButton();
  }
});

function showFloatingButton(x, y, text) {
  hideFloatingButton();
  
  floatingButton = document.createElement('div');
  floatingButton.className = 'varterm-floating-btn';
  floatingButton.innerHTML = '🔊';
  floatingButton.title = 'Read with Varterm';
  
  // Position near cursor
  floatingButton.style.left = `${Math.min(x + 10, window.innerWidth - 50)}px`;
  floatingButton.style.top = `${Math.min(y - 40, window.innerHeight - 50)}px`;
  
  floatingButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    speakText(text);
    hideFloatingButton();
  });
  
  document.body.appendChild(floatingButton);
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    if (floatingButton) hideFloatingButton();
  }, 3000);
}

function hideFloatingButton() {
  if (floatingButton) {
    floatingButton.remove();
    floatingButton = null;
  }
}

function sanitizeMarkdown(text) {
  if (!settings.stripMarkdown) return text;
  
  let result = text;
  result = result.replace(/```[\s\S]*?```/g, ' code block ');
  result = result.replace(/`([^`]+)`/g, '$1');
  result = result.replace(/^#{1,6}\s+/gm, '');
  result = result.replace(/\*\*([^*]+)\*\*/g, '$1');
  result = result.replace(/\*([^*]+)\*/g, '$1');
  result = result.replace(/__([^_]+)__/g, '$1');
  result = result.replace(/_([^_]+)_/g, '$1');
  result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  result = result.replace(/^\s*[-*+]\s+/gm, '');
  result = result.replace(/^\s*\d+\.\s+/gm, '');
  result = result.replace(/^\s*>\s+/gm, '');
  result = result.replace(/^---+$/gm, '');
  result = result.replace(/\n{3,}/g, '\n\n');
  
  return result.trim();
}

function showStatus(message, isError = false) {
  // Remove existing status
  const existing = document.querySelector('.varterm-status');
  if (existing) existing.remove();
  
  const status = document.createElement('div');
  status.className = `varterm-status ${isError ? 'varterm-error' : ''}`;
  status.textContent = message;
  document.body.appendChild(status);
  
  setTimeout(() => status.remove(), 3000);
}

async function speakText(text) {
  if (!text || !text.trim()) {
    showStatus('No text to read', true);
    return;
  }
  
  stopSpeaking();
  
  const sanitizedText = sanitizeMarkdown(text);
  showStatus('Generating audio...');
  
  try {
    if (settings.voiceTier === 'browser') {
      await speakWithBrowser(sanitizedText);
    } else {
      await speakWithCloud(sanitizedText);
    }
  } catch (error) {
    console.error('Varterm TTS Error:', error);
    showStatus(error.message || 'Failed to generate audio', true);
  }
}

function speakWithBrowser(text) {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error('Browser TTS not supported'));
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.rate;
    
    utterance.onstart = () => showStatus('Speaking...');
    utterance.onend = () => {
      showStatus('Done');
      resolve();
    };
    utterance.onerror = (e) => {
      if (e.error !== 'interrupted') {
        reject(new Error('Speech synthesis failed'));
      }
    };
    
    window.speechSynthesis.speak(utterance);
  });
}

async function speakWithCloud(text) {
  const response = await new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      action: 'getAudio',
      text: text,
      voice: settings.voice,
      rate: settings.rate
    }, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else if (!response.success) {
        reject(new Error(response.error));
      } else {
        resolve(response);
      }
    });
  });

  const audioBytes = response.audioBytes;
  if (!audioBytes || !audioBytes.length) {
    throw new Error('No audio data returned');
  }

  const rawMimeType = response.mimeType || 'audio/mpeg';
  const mimeType = rawMimeType.split(';')[0].trim() || 'audio/mpeg';
  const byteArray = new Uint8Array(audioBytes);

  if (byteArray.length < 128) {
    throw new Error('Received invalid audio payload');
  }

  const blob = new Blob([byteArray], { type: mimeType });
  currentAudioUrl = URL.createObjectURL(blob);

  audio = new Audio(currentAudioUrl);
  audio.preload = 'auto';
  
  audio.onplay = () => showStatus('Speaking...');
  audio.onended = () => {
    showStatus('Done');
    if (currentAudioUrl) {
      URL.revokeObjectURL(currentAudioUrl);
      currentAudioUrl = null;
    }
    audio = null;
    isPaused = false;
  };
  audio.onerror = () => {
    if (currentAudioUrl) {
      URL.revokeObjectURL(currentAudioUrl);
      currentAudioUrl = null;
    }
    audio = null;
  };
  
  try {
    audio.load();
    await audio.play();
  } catch (playError) {
    const errName = playError?.name || '';
    if (errName === 'NotAllowedError') {
      throw new Error('Playback blocked on this page. Click anywhere, then try again.');
    }

    // Fallback mime in case browser rejects provider mime parameters.
    if (mimeType !== 'audio/mpeg') {
      if (currentAudioUrl) URL.revokeObjectURL(currentAudioUrl);
      const fallbackBlob = new Blob([byteArray], { type: 'audio/mpeg' });
      currentAudioUrl = URL.createObjectURL(fallbackBlob);
      audio.src = currentAudioUrl;
      audio.load();
      await audio.play();
      return;
    }
    await playWithWebAudio(byteArray);
  }
}

async function playWithWebAudio(byteArray) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    throw new Error('Audio format not supported on this page.');
  }

  if (!webAudioContext) {
    webAudioContext = new AudioCtx();
  }

  if (webAudioContext.state === 'suspended') {
    await webAudioContext.resume();
  }

  if (webAudioSource) {
    try {
      webAudioSource.stop();
    } catch {}
    webAudioSource = null;
  }

  const decodeBuffer = byteArray.slice().buffer;
  const audioBuffer = await webAudioContext.decodeAudioData(decodeBuffer);
  const source = webAudioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(webAudioContext.destination);
  source.onended = () => {
    if (webAudioSource === source) {
      webAudioSource = null;
      showStatus('Done');
    }
  };

  webAudioSource = source;
  showStatus('Speaking...');
  source.start(0);
}

function speakSelection() {
  const selection = window.getSelection();
  const text = selection.toString().trim();
  
  if (text) {
    speakText(text);
  } else {
    showStatus('No text selected', true);
  }
}

function speakPage() {
  // Get main content, avoiding nav, footer, etc.
  const selectors = [
    'article',
    'main',
    '[role="main"]',
    '.content',
    '.post-content',
    '.article-content',
    '#content'
  ];
  
  let content = null;
  for (const selector of selectors) {
    content = document.querySelector(selector);
    if (content) break;
  }
  
  if (!content) {
    content = document.body;
  }
  
  // Extract text, skipping scripts, styles, and hidden elements
  const text = getVisibleText(content);
  
  if (text.length > 100000) {
    showStatus('Page too long. Select specific text instead.', true);
    return;
  }
  
  speakText(text);
}

function getVisibleText(element) {
  const skipTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'NAV', 'FOOTER', 'HEADER'];
  
  let text = '';
  
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (skipTags.includes(node.tagName)) continue;
      if (getComputedStyle(node).display === 'none') continue;
      if (getComputedStyle(node).visibility === 'hidden') continue;
      
      text += getVisibleText(node);
      
      // Add spacing for block elements
      if (['P', 'DIV', 'BR', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI'].includes(node.tagName)) {
        text += '\n';
      }
    }
  }
  
  return text.replace(/\s+/g, ' ').trim();
}

function stopSpeaking() {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    audio = null;
  }
  if (currentAudioUrl) {
    URL.revokeObjectURL(currentAudioUrl);
    currentAudioUrl = null;
  }
  if (webAudioSource) {
    try {
      webAudioSource.stop();
    } catch {}
    webAudioSource = null;
  }
  
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  
  isPaused = false;
}

function togglePause() {
  if (audio) {
    if (isPaused) {
      audio.play();
      isPaused = false;
      showStatus('Resumed');
    } else {
      audio.pause();
      isPaused = true;
      showStatus('Paused');
    }
  } else if (webAudioSource) {
    showStatus('Pause unavailable for this page', true);
  } else if (window.speechSynthesis) {
    if (isPaused) {
      window.speechSynthesis.resume();
      isPaused = false;
      showStatus('Resumed');
    } else {
      window.speechSynthesis.pause();
      isPaused = true;
      showStatus('Paused');
    }
  }
}
