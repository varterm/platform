// Varterm TTS Chrome Extension - Popup Script

document.addEventListener('DOMContentLoaded', () => {
  const voiceTierSelect = document.getElementById('voiceTier');
  const voiceSelect = document.getElementById('voice');
  const voiceGroup = document.getElementById('voiceGroup');
  const rateSlider = document.getElementById('rate');
  const rateValue = document.getElementById('rateValue');
  const stripMarkdown = document.getElementById('stripMarkdown');
  const readSelectionBtn = document.getElementById('readSelection');
  const stopBtn = document.getElementById('stop');
  const status = document.getElementById('status');
  
  // Load saved settings
  chrome.runtime.sendMessage({ action: 'getSettings' }, (settings) => {
    voiceTierSelect.value = settings.voiceTier || 'cloud';
    voiceSelect.value = settings.voice || 'en-US-AriaNeural';
    rateSlider.value = settings.rate || 1.0;
    rateValue.textContent = settings.rate?.toFixed(1) || '1.0';
    stripMarkdown.checked = settings.stripMarkdown !== false;
    
    updateVoiceGroupVisibility();
  });
  
  // Voice tier change
  voiceTierSelect.addEventListener('change', () => {
    updateVoiceGroupVisibility();
    saveSettings();
  });
  
  function updateVoiceGroupVisibility() {
    voiceGroup.style.display = voiceTierSelect.value === 'cloud' ? 'block' : 'none';
  }
  
  // Voice change
  voiceSelect.addEventListener('change', saveSettings);
  
  // Rate change
  rateSlider.addEventListener('input', () => {
    rateValue.textContent = parseFloat(rateSlider.value).toFixed(1);
  });
  
  rateSlider.addEventListener('change', saveSettings);
  
  // Strip markdown change
  stripMarkdown.addEventListener('change', saveSettings);
  
  function saveSettings() {
    const settings = {
      voiceTier: voiceTierSelect.value,
      voice: voiceSelect.value,
      rate: parseFloat(rateSlider.value),
      stripMarkdown: stripMarkdown.checked
    };
    
    chrome.runtime.sendMessage({ action: 'saveSettings', settings }, () => {
      showStatus('Settings saved', 'success');
      
      // Notify content script of settings update
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'updateSettings',
            settings
          }, () => {
            // Ignore pages where content script is unavailable.
            void chrome.runtime.lastError;
          });
        }
      });
    });
  }
  
  // Read selection button
  readSelectionBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'speakSelection' }, (response) => {
          if (chrome.runtime.lastError) {
            showStatus('Cannot access this page', 'error');
          }
        });
      }
    });
  });
  
  // Stop button
  stopBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'stop' }, () => {
          // Ignore pages where content script is unavailable.
          void chrome.runtime.lastError;
        });
      }
    });
  });
  
  function showStatus(message, type) {
    status.textContent = message;
    status.className = `status ${type}`;
    setTimeout(() => {
      status.className = 'status';
    }, 2000);
  }
});
