'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';

// Donation link
const DONATION_LINK = 'https://buy.stripe.com/00w6oG2Zq23a8al1PB3VC00';
const VSCODE_EXTENSION_LINK = 'https://marketplace.visualstudio.com/items?itemName=varterm.varterm-cursor';
const CHROME_EXTENSION_INFO_LINK = 'https://github.com/cntrlne/varterm';

// Microsoft Edge neural voices (FREE)
// Piper voices (Offline - runs locally in browser)
const PIPER_VOICES = [
  { id: 'en_US-amy-medium', name: 'Amy', desc: 'Female, clear' },
  { id: 'en_US-ryan-medium', name: 'Ryan', desc: 'Male, natural' },
  { id: 'en_US-lessac-medium', name: 'Lessac', desc: 'Female, expressive' },
  { id: 'en_US-libritts-high', name: 'LibriTTS', desc: 'High quality' },
  { id: 'en_GB-cori-medium', name: 'Cori', desc: 'British female' },
  { id: 'en_GB-alan-medium', name: 'Alan', desc: 'British male' },
];

// Microsoft Edge voices (Cloud - requires internet)
const MICROSOFT_VOICES = [
  { id: 'en-US-AriaNeural', name: 'Aria', desc: 'Friendly, natural' },
  { id: 'en-US-JennyNeural', name: 'Jenny', desc: 'Warm, clear' },
  { id: 'en-US-GuyNeural', name: 'Guy', desc: 'Casual, natural' },
  { id: 'en-US-DavisNeural', name: 'Davis', desc: 'Calm, professional' },
  { id: 'en-US-TonyNeural', name: 'Tony', desc: 'Friendly, upbeat' },
  { id: 'en-US-SaraNeural', name: 'Sara', desc: 'Cheerful, expressive' },
  { id: 'en-GB-SoniaNeural', name: 'Sonia', desc: 'British, warm' },
  { id: 'en-GB-RyanNeural', name: 'Ryan', desc: 'British, professional' },
  { id: 'en-AU-NatashaNeural', name: 'Natasha', desc: 'Australian, friendly' },
  { id: 'en-AU-WilliamNeural', name: 'William', desc: 'Australian, clear' },
];


export default function Home() {
  // State
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [selectedTier, setSelectedTier] = useState('cloud'); // 'browser', 'cloud', 'offline'
  const [browserVoices, setBrowserVoices] = useState([]);
  const [piperLoading, setPiperLoading] = useState(false);
  const [status, setStatus] = useState('ready');
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [stripMarkdown, setStripMarkdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({ type: 'general', message: '', email: '' });
  const [feedbackStatus, setFeedbackStatus] = useState('idle'); // 'idle', 'sending', 'sent', 'error'
  const [chunkProgress, setChunkProgress] = useState(null); // { current: 1, total: 5, chunks: [], currentText: '' }
  const [readingProgress, setReadingProgress] = useState(0); // 0-100 percentage of current chunk read
  const [showReadingText, setShowReadingText] = useState(false); // toggle for showing reading text
  
  // Refs
  const audioRef = useRef(null);
  const synthRef = useRef(null);
  const stopRequestedRef = useRef(false);
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Load browser voices
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
      
      const loadVoices = () => {
        const voices = synthRef.current.getVoices();
        const english = voices.filter(v => v.lang.startsWith('en')).slice(0, 12);
        setBrowserVoices(english);
      };
      
      loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  // Submit feedback
  const submitFeedback = async () => {
    if (!feedbackForm.message.trim()) {
      showToast('Please enter your feedback', 'error');
      return;
    }
    
    setFeedbackStatus('sending');
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackForm),
      });
      
      if (response.ok) {
        setFeedbackStatus('sent');
        setFeedbackForm({ type: 'general', message: '', email: '' });
        setTimeout(() => {
          setShowFeedbackModal(false);
          setFeedbackStatus('idle');
        }, 2000);
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      setFeedbackStatus('error');
      showToast('Failed to send feedback. Try again later.', 'error');
      setTimeout(() => setFeedbackStatus('idle'), 2000);
    }
  };

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Sanitize markdown for better speech output
  const sanitizeMarkdown = (input) => {
    if (!stripMarkdown) return input;
    
    let result = input;
    
    // Remove code blocks (```code```)
    result = result.replace(/```[\s\S]*?```/g, '');
    
    // Remove inline code (`code`)
    result = result.replace(/`([^`]+)`/g, '$1');
    
    // Remove images ![alt](url)
    result = result.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');
    
    // Convert links [text](url) to just text
    result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    
    // Remove headers (# ## ### etc) but keep the text
    result = result.replace(/^#{1,6}\s+/gm, '');
    
    // Remove bold/italic markers
    result = result.replace(/\*\*\*([^*]+)\*\*\*/g, '$1'); // ***bold italic***
    result = result.replace(/\*\*([^*]+)\*\*/g, '$1');     // **bold**
    result = result.replace(/\*([^*]+)\*/g, '$1');         // *italic*
    result = result.replace(/___([^_]+)___/g, '$1');       // ___bold italic___
    result = result.replace(/__([^_]+)__/g, '$1');         // __bold__
    result = result.replace(/_([^_]+)_/g, '$1');           // _italic_
    
    // Remove strikethrough
    result = result.replace(/~~([^~]+)~~/g, '$1');
    
    // Remove blockquotes (> ) but keep text
    result = result.replace(/^>\s+/gm, '');
    
    // Remove horizontal rules
    result = result.replace(/^[-*_]{3,}\s*$/gm, '');
    
    // Remove list markers (-, *, +, 1., 2., etc)
    result = result.replace(/^[\s]*[-*+]\s+/gm, '');
    result = result.replace(/^[\s]*\d+\.\s+/gm, '');
    
    // Remove HTML tags
    result = result.replace(/<[^>]+>/g, '');
    
    // Clean up multiple newlines
    result = result.replace(/\n{3,}/g, '\n\n');
    
    // Clean up extra whitespace
    result = result.replace(/[ \t]+/g, ' ');
    
    return result.trim();
  };

  // Get text to speak (with optional markdown sanitization)
  const getTextToSpeak = () => sanitizeMarkdown(text);

  // Generate speech
  const speak = async () => {
    if (!text.trim()) {
      showToast('Please enter some text to read', 'error');
      return;
    }
    
    stop();
    
    if (selectedTier === 'browser') {
      speakWithBrowser();
    } else if (selectedTier === 'offline') {
      await speakWithPiper();
    } else {
      await speakWithMicrosoft();
    }
  };

  // Browser TTS (Web Speech API)
  const speakWithBrowser = () => {
    if (!synthRef.current) {
      showToast('Browser speech not available', 'error');
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(getTextToSpeak());
    
    if (selectedVoice?.browserVoice) {
      utterance.voice = selectedVoice.browserVoice;
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    utterance.onstart = () => setStatus('speaking');
    utterance.onend = () => setStatus('ready');
    utterance.onerror = (e) => {
      if (e.error !== 'interrupted') {
        showToast('Speech error', 'error');
      }
      setStatus('ready');
    };
    
    synthRef.current.speak(utterance);
  };

  // Piper TTS (Offline, runs in browser via WASM)
  const speakWithPiper = async () => {
    if (typeof window === 'undefined') {
      showToast('Offline voices only work in browser', 'error');
      return;
    }
    
    try {
      setPiperLoading(true);
      setStatus('speaking');
      
      setChunkProgress({ 
        current: 1, 
        total: 1, 
        status: 'generating',
        chunks: [getTextToSpeak()],
        currentText: 'Loading Piper voice model (first time may take a moment)...'
      });
      
      // Load piper-tts-web from esm.sh CDN (not bundled to avoid webpack issues)
      const piperModule = await import(/* webpackIgnore: true */ 'https://esm.sh/@mintplex-labs/piper-tts-web@1.0.4');
      const predict = piperModule.predict;
      
      const voiceId = selectedVoice?.id || 'en_US-amy-medium';
      const textToSpeak = getTextToSpeak();
      
      const wav = await predict(
        { text: textToSpeak, voiceId: voiceId },
        (progress) => {
          if (progress.total > 0) {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setChunkProgress(prev => prev ? {
              ...prev,
              currentText: `Downloading voice model... ${percent}%`
            } : prev);
          }
        }
      );
      
      if (!wav) {
        throw new Error('No audio generated');
      }
      
      setPiperLoading(false);
      
      setChunkProgress({ 
        current: 1, 
        total: 1, 
        status: 'playing',
        chunks: [textToSpeak],
        currentText: textToSpeak
      });
      
      audioRef.current = new Audio();
      audioRef.current.src = URL.createObjectURL(wav);
      
      audioRef.current.onended = () => {
        setStatus('ready');
        setChunkProgress(null);
        setReadingProgress(0);
      };
      
      audioRef.current.ontimeupdate = () => {
        if (audioRef.current && audioRef.current.duration) {
          const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setReadingProgress(Math.min(progress, 100));
        }
      };
      
      setReadingProgress(0);
      await audioRef.current.play();
      
    } catch (error) {
      console.error('Piper TTS Error:', error);
      showToast('Offline TTS failed. Try Cloud voices instead.', 'error');
      setPiperLoading(false);
      setStatus('ready');
      setChunkProgress(null);
      setReadingProgress(0);
    }
  };

  // Split text into chunks at sentence boundaries
  const splitTextIntoChunks = (inputText, maxChunkSize = 10000) => {
    if (inputText.length <= maxChunkSize) {
      return [inputText];
    }
    
    const chunks = [];
    let remaining = inputText;
    
    while (remaining.length > 0) {
      if (remaining.length <= maxChunkSize) {
        chunks.push(remaining);
        break;
      }
      
      // Find a good break point (end of sentence) within the chunk size
      let breakPoint = maxChunkSize;
      const searchStart = Math.max(0, maxChunkSize - 500);
      const searchArea = remaining.substring(searchStart, maxChunkSize);
      
      // Look for sentence endings: . ! ? followed by space or end
      const sentenceEnd = searchArea.search(/[.!?]\s/);
      if (sentenceEnd !== -1) {
        breakPoint = searchStart + sentenceEnd + 2; // Include the punctuation and space
      } else {
        // Fallback: look for any space near the end
        const lastSpace = remaining.lastIndexOf(' ', maxChunkSize);
        if (lastSpace > searchStart) {
          breakPoint = lastSpace + 1;
        }
      }
      
      chunks.push(remaining.substring(0, breakPoint).trim());
      remaining = remaining.substring(breakPoint).trim();
    }
    
    return chunks;
  };

  const speakWithMicrosoft = async () => {
    stopRequestedRef.current = false;
    const chunks = splitTextIntoChunks(getTextToSpeak());
    const totalChunks = chunks.length;
    
    // Always set chunk progress to show current reading position
    setChunkProgress({ 
      current: 0, 
      total: totalChunks, 
      status: 'generating',
      chunks: chunks,
      currentText: chunks[0] || ''
    });
    
    setStatus('speaking');
    
    try {
      for (let i = 0; i < chunks.length; i++) {
        // Check if stop was requested
        if (stopRequestedRef.current) {
          setChunkProgress(null);
          setStatus('ready');
          return;
        }
        
        const chunk = chunks[i];
        
        setChunkProgress({ 
          current: i + 1, 
          total: totalChunks, 
          status: 'generating',
          chunks: chunks,
          currentText: chunk
        });
        
        const response = await fetch('/api/edge-tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: chunk,
            voice: selectedVoice?.id || 'en-US-AriaNeural',
            rate,
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'API request failed');
        }
        
        // Check again after fetch
        if (stopRequestedRef.current) {
          setChunkProgress(null);
          setStatus('ready');
          return;
        }
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        setChunkProgress({ 
          current: i + 1, 
          total: totalChunks, 
          status: 'playing',
          chunks: chunks,
          currentText: chunk
        });
        
        // Play this chunk and wait for it to finish
        await new Promise((resolve, reject) => {
          audioRef.current = new Audio(url);
          audioRef.current.onended = () => {
            setReadingProgress(100);
            resolve();
          };
          audioRef.current.onerror = reject;
          audioRef.current.ontimeupdate = () => {
            if (audioRef.current && audioRef.current.duration) {
              const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
              setReadingProgress(Math.min(progress, 100));
            }
          };
          setReadingProgress(0);
          audioRef.current.play();
        });
        
        // Clean up the URL
        URL.revokeObjectURL(url);
      }
      
      setChunkProgress(null);
      setStatus('ready');
      
    } catch (error) {
      console.error('TTS Error:', error);
      if (!stopRequestedRef.current) {
        showToast(error.message || 'Error generating audio', 'error');
      }
      setChunkProgress(null);
      setReadingProgress(0);
      setStatus('ready');
    }
  };

  const togglePause = () => {
    // Handle browser TTS
    if (selectedTier === 'browser' && synthRef.current) {
      if (isPaused) {
        synthRef.current.resume();
        setStatus('speaking');
      } else {
        synthRef.current.pause();
        setStatus('paused');
      }
      setIsPaused(!isPaused);
      return;
    }
    
    // Handle audio playback (cloud/offline)
    if (!audioRef.current) return;
    
    if (isPaused) {
      audioRef.current.play();
      setStatus('speaking');
    } else {
      audioRef.current.pause();
      setStatus('paused');
    }
    setIsPaused(!isPaused);
  };

  const stop = () => {
    stopRequestedRef.current = true;
    // Stop browser TTS
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    // Stop audio playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPaused(false);
    setChunkProgress(null);
    setReadingProgress(0);
    setPiperLoading(false);
    setStatus('ready');
  };

  // Get all available voices
  const getVoices = () => {
    if (selectedTier === 'browser') {
      return browserVoices.map((v, i) => ({
        id: `browser-${i}`,
        name: v.name.split(' ')[0],
        desc: v.lang,
        tier: 'browser',
        browserVoice: v,
      }));
    }
    
    if (selectedTier === 'offline') {
      return PIPER_VOICES.map(v => ({
        ...v,
        tier: 'offline',
      }));
    }
    
    // Default: cloud (Microsoft Edge)
    return MICROSOFT_VOICES.map(v => ({
      ...v,
      tier: 'cloud',
    }));
  };

  const isPlaying = status === 'speaking' || status === 'paused';

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="12" width="4" height="8" rx="2" fill="currentColor" opacity="0.6"/>
              <rect x="8" y="8" width="4" height="16" rx="2" fill="currentColor" opacity="0.8"/>
              <rect x="14" y="4" width="4" height="24" rx="2" fill="currentColor"/>
              <rect x="20" y="8" width="4" height="16" rx="2" fill="currentColor" opacity="0.8"/>
              <rect x="26" y="12" width="4" height="8" rx="2" fill="currentColor" opacity="0.6"/>
            </svg>
          </div>
          <div className={styles.logoWords}>
            <span className={styles.logoText}>varterm</span>
            <span className={styles.logoTagline}>varterm tts for web, cursor, vscode, and chrome</span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.feedbackBtn} onClick={() => setShowFeedbackModal(true)}>
            <span>💬 Feedback</span>
          </button>
          <button className={styles.upgradeBtn} onClick={() => setShowModal(true)}>
            <span>☕ Support</span>
          </button>
        </div>
      </header>

      {/* Hero Section with H1 for SEO */}
      <section className={styles.heroSection} aria-labelledby="hero-heading">
        <h1 id="hero-heading" className={styles.heroTitle}>
          Varterm TTS - Read Anything Aloud
        </h1>
        <p className={styles.heroSubtitle}>
          Turn web pages, docs, markdown, and AI output into natural speech. Fast, long-form friendly, and ready for web and editor workflows.
        </p>
      </section>

      <section className={styles.platformSection} aria-labelledby="platform-heading">
        <h2 id="platform-heading" className={styles.sectionHeading}>Use Varterm Anywhere</h2>
        <div className={styles.platformGrid}>
          <article className={styles.platformCard}>
            <h3>Web App</h3>
            <p>Paste text and listen instantly with cloud, browser, or offline voices.</p>
            <span className={styles.platformBadge}>You are here</span>
          </article>
          <article className={styles.platformCard}>
            <h3>Cursor &amp; VS Code</h3>
            <p>Read editor selection, clipboard, and agent output with Varterm TTS.</p>
            <a
              className={styles.platformCta}
              href={VSCODE_EXTENSION_LINK}
              target="_blank"
              rel="noreferrer"
            >
              Install Extension
            </a>
          </article>
          <article className={styles.platformCard}>
            <h3>Chrome Extension</h3>
            <p>Read selected text and pages aloud from your browser workflow.</p>
            <a
              className={styles.platformCta}
              href={CHROME_EXTENSION_INFO_LINK}
              target="_blank"
              rel="noreferrer"
            >
              Get Chrome Info
            </a>
          </article>
        </div>
      </section>

      {/* Editor */}
      <section className={styles.section}>
        <div className={styles.editorHeader}>
          <span className={styles.sectionTitle}>Your Text</span>
          <span className={styles.charCount}>
            <span>{text.length.toLocaleString()}</span> characters
          </span>
        </div>
        <textarea
          className={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type the text you want to hear read aloud..."
        />
        
        {/* Now Reading / Loading indicator */}
        {chunkProgress && status === 'speaking' && (
          <div className={`${styles.nowReading} ${chunkProgress.status === 'generating' ? styles.generating : ''}`}>
            <div className={styles.nowReadingHeader}>
              <span className={styles.nowReadingLabel}>
                {chunkProgress.status === 'generating' ? (
                  <>
                    <span className={styles.loadingSpinner}></span>
                    Generating Audio...
                  </>
                ) : (
                  <>
                    <span className={styles.nowReadingPulse}></span>
                    Playing
                  </>
                )}
              </span>
              <div className={styles.nowReadingControls}>
                {chunkProgress.total > 1 && (
                  <span className={styles.nowReadingProgress}>
                    {chunkProgress.current} / {chunkProgress.total}
                  </span>
                )}
                {chunkProgress.status === 'playing' && (
                  <button 
                    className={styles.textToggle}
                    onClick={() => setShowReadingText(!showReadingText)}
                    title={showReadingText ? 'Hide text' : 'Show text'}
                  >
                    {showReadingText ? '▲' : '▼'}
                  </button>
                )}
              </div>
            </div>
            {chunkProgress.status === 'generating' ? (
              <div className={styles.loadingBar}>
                <div className={styles.loadingBarInner}></div>
              </div>
            ) : (
              <>
                <div className={styles.chunkProgressBar}>
                  <div 
                    className={styles.chunkProgressFill} 
                    style={{ width: `${readingProgress}%` }}
                  ></div>
                </div>
                {showReadingText && (
                  <div className={styles.nowReadingText}>
                    {chunkProgress.currentText}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </section>

      {/* Voice Selection */}
      <section className={styles.section}>
        <div className={styles.voiceTabs}>
          {[
            { id: 'cloud', label: 'Cloud', desc: 'Best Quality' },
            { id: 'browser', label: 'Browser', desc: 'Built-in' },
            { id: 'offline', label: 'Offline', desc: 'Local AI' },
          ].map((tier) => (
            <button
              key={tier.id}
              className={`${styles.voiceTab} ${selectedTier === tier.id ? styles.active : ''}`}
              onClick={() => {
                // Stop any playing audio before switching tiers
                if (status !== 'ready') {
                  stop();
                }
                setSelectedTier(tier.id);
                setSelectedVoice(null);
              }}
            >
              <span className={styles.tabLabel}>{tier.label}</span>
              <span className={styles.tabDesc}>{tier.desc}</span>
            </button>
          ))}
        </div>
        
        <div className={styles.tierInfo}>
          {selectedTier === 'cloud' && (
            <span>✓ Microsoft neural voices. Natural sounding, great for long content.</span>
          )}
          {selectedTier === 'browser' && (
            <span>Your browser&apos;s built-in voices. Fast, works offline, basic quality.</span>
          )}
          {selectedTier === 'offline' && (
            <span>Piper AI runs locally in your browser. Downloads ~20MB model on first use.</span>
          )}
        </div>

        <div className={styles.voiceGrid}>
          {getVoices().map((voice) => (
            <div
              key={voice.id}
              className={`${styles.voiceCard} ${
                selectedVoice?.id === voice.id ? styles.selected : ''
              }`}
              onClick={() => setSelectedVoice(voice)}
            >
              <div className={styles.voiceName}>{voice.name}</div>
              <div className={styles.voiceMeta}>{voice.desc}</div>
            </div>
          ))}
        </div>

        <div className={styles.settingsRow}>
          <div className={styles.settingGroup}>
            <label>Speed</label>
            <div className={styles.sliderContainer}>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
              />
              <span className={styles.sliderValue}>{rate}x</span>
            </div>
          </div>
          <div className={styles.settingGroup}>
            <label>Pitch</label>
            <div className={styles.sliderContainer}>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
              />
              <span className={styles.sliderValue}>{pitch}x</span>
            </div>
          </div>
        </div>

        <div className={styles.optionsRow}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={stripMarkdown}
              onChange={(e) => setStripMarkdown(e.target.checked)}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>
              Strip Markdown
              <span className={styles.checkboxHint}>Remove #, **, [], etc. for cleaner reading</span>
            </span>
          </label>
        </div>
      </section>

      {/* Controls */}
      <div className={styles.controls}>
        <button
          className={styles.playBtn}
          onClick={speak}
          disabled={isPlaying && status !== 'paused'}
        >
          ▶ Play
        </button>
        <button
          className={styles.controlBtn}
          onClick={togglePause}
          disabled={!isPlaying}
        >
          {isPaused ? '▶' : '⏸'}
        </button>
        <button
          className={styles.controlBtn}
          onClick={stop}
          disabled={!isPlaying}
        >
          ⏹
        </button>
      </div>

      {/* Status */}
      <div className={styles.statusBar}>
        <div className={styles.statusLeft}>
          <div className={`${styles.statusDot} ${styles[status]}`} />
          <span>
            {chunkProgress ? (
              chunkProgress.status === 'generating' 
                ? `Generating part ${chunkProgress.current} of ${chunkProgress.total}...`
                : `Playing part ${chunkProgress.current} of ${chunkProgress.total}...`
            ) : (
              status === 'speaking' ? 'Speaking...' : status === 'paused' ? 'Paused' : 'Ready to read'
            )}
          </span>
          {status === 'ready' && !chunkProgress && (
            <button 
              className={styles.helpLink}
              onClick={() => setShowHelpModal(true)}
            >
              No audio?
            </button>
          )}
        </div>
        <div className={styles.usageInfo}>
          <span>{text.length.toLocaleString()}</span> characters
          {text.length > 10000 && status === 'ready' && (
            <span className={styles.chunkWarning}> • Will process in {Math.ceil(text.length / 10000)} parts</span>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={() => setShowModal(false)}>
              ×
            </button>

            <div className={styles.donationSection} style={{ borderTop: 'none', paddingTop: 0, marginTop: 0 }}>
              <div className={styles.donationEmoji}>☕</div>
              <h3>Keep Varterm Free</h3>
              <p>
                Varterm is free — no accounts, no tracking, no paywalls. 
                Servers and bandwidth cost money though. If this tool saves you time, consider throwing us a coffee.
              </p>
              <button 
                className={styles.donationBtn}
                onClick={() => window.open(DONATION_LINK, '_blank')}
              >
                ☕ Buy Us a Coffee ($5)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className={styles.modalOverlay} onClick={() => setShowHelpModal(false)}>
          <div className={styles.helpModal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={() => setShowHelpModal(false)}>
              ×
            </button>
            
            <h2>Audio Troubleshooting</h2>
            <p className={styles.helpSubtitle}>If you&apos;re not hearing any audio, try these fixes:</p>
            
            <div className={styles.helpSteps}>
              <div className={styles.helpStep}>
                <div className={styles.helpStepNumber}>1</div>
                <div>
                  <strong>Check your volume</strong>
                  <p>Make sure your device volume is turned up and not muted.</p>
                </div>
              </div>
              
              <div className={styles.helpStep}>
                <div className={styles.helpStepNumber}>2</div>
                <div>
                  <strong>Try a different browser</strong>
                  <p>Safari and Firefox often work better than Chrome for speech synthesis.</p>
                </div>
              </div>
              
              <div className={styles.helpStep}>
                <div className={styles.helpStepNumber}>3</div>
                <div>
                  <strong>Chrome users: Reset flags</strong>
                  <p>Go to <code>chrome://flags</code>, click &quot;Reset all&quot; at the top, then restart Chrome.</p>
                </div>
              </div>
              
              <div className={styles.helpStep}>
                <div className={styles.helpStepNumber}>4</div>
                <div>
                  <strong>Disable browser extensions</strong>
                  <p>Ad blockers and privacy extensions can block audio. Try disabling them temporarily.</p>
                </div>
              </div>
              
              <div className={styles.helpStep}>
                <div className={styles.helpStepNumber}>5</div>
                <div>
                  <strong>Check site permissions</strong>
                  <p>Click the lock icon in your browser&apos;s address bar and make sure &quot;Sound&quot; is set to &quot;Allow&quot;.</p>
                </div>
              </div>
            </div>
            
            <button 
              className={styles.helpCloseBtn}
              onClick={() => setShowHelpModal(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className={styles.modalOverlay} onClick={() => setShowFeedbackModal(false)}>
          <div className={styles.feedbackModal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={() => setShowFeedbackModal(false)}>
              ×
            </button>
            
            <h2>💬 Send Feedback</h2>
            <p className={styles.feedbackSubtitle}>Help us improve Varterm. Bug reports, feature requests, and general feedback welcome.</p>
            
            {feedbackStatus === 'sent' ? (
              <div className={styles.feedbackSuccess}>
                <span className={styles.successIcon}>✓</span>
                <p>Thanks for your feedback!</p>
              </div>
            ) : (
              <form className={styles.feedbackForm} onSubmit={(e) => { e.preventDefault(); submitFeedback(); }}>
                <div className={styles.feedbackField}>
                  <label>Type</label>
                  <select 
                    value={feedbackForm.type}
                    onChange={(e) => setFeedbackForm(f => ({ ...f, type: e.target.value }))}
                  >
                    <option value="general">General Feedback</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                  </select>
                </div>
                
                <div className={styles.feedbackField}>
                  <label>Message *</label>
                  <textarea
                    value={feedbackForm.message}
                    onChange={(e) => setFeedbackForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us what's on your mind..."
                    rows={4}
                    required
                  />
                </div>
                
                <div className={styles.feedbackField}>
                  <label>Email (optional)</label>
                  <input
                    type="email"
                    value={feedbackForm.email}
                    onChange={(e) => setFeedbackForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="For follow-up (won't be shared)"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className={styles.feedbackSubmitBtn}
                  disabled={feedbackStatus === 'sending'}
                >
                  {feedbackStatus === 'sending' ? 'Sending...' : 'Send Feedback'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Features Section */}
      <section className={styles.featuresSection} aria-labelledby="features-heading">
        <h2 id="features-heading" className={styles.sectionHeading}>Why Teams Choose Varterm TTS</h2>
        <div className={styles.featuresGrid}>
          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>📄</div>
            <h3>Long Form TTS Support</h3>
            <p>Convert entire documents, articles, and ebooks to speech. No character limits — our tool handles texts of any length by intelligently chunking and streaming audio.</p>
          </article>
          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>✨</div>
            <h3>Strip Markdown Automatically</h3>
            <p>Paste content from ChatGPT, GitHub, or any markdown source. Our TTS strips headers, links, code blocks, and formatting for clean, natural-sounding audio output.</p>
          </article>
          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>🔓</div>
            <h3>100% Free, No Login Required</h3>
            <p>Use our text to speech converter without creating an account. No registration, no tracking, no hidden charges. Your privacy is protected — we never store your text.</p>
          </article>
          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>🎙️</div>
            <h3>Premium Neural Voices</h3>
            <p>Access high-quality Microsoft neural voices that sound natural and expressive. Choose from American, British, and Australian accents with adjustable speed.</p>
          </article>
          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>📡</div>
            <h3>Works Offline Too</h3>
            <p>Use Piper AI voices that run entirely in your browser — no internet needed after initial download. Perfect for privacy-conscious users and offline reading.</p>
          </article>
          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3>Fast &amp; Reliable</h3>
            <p>No waiting in queues. Audio generates instantly and starts playing immediately. Built for hackers and power users who value speed and efficiency.</p>
          </article>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection} aria-labelledby="faq-heading">
        <h2 id="faq-heading" className={styles.sectionHeading}>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>Is this text to speech tool really free?</summary>
            <p className={styles.faqAnswer}>Yes, Varterm is completely free to use with no hidden charges or registration required. You get unlimited access to browser voices and high-quality Microsoft neural voices. We sustain the service through optional donations.</p>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>Can I convert long documents to speech?</summary>
            <p className={styles.faqAnswer}>Varterm supports long form text to speech conversion for documents of any length. Large texts are automatically split into chunks and played sequentially for seamless listening. There are no character limits.</p>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>Does it strip markdown formatting?</summary>
            <p className={styles.faqAnswer}>Yes! Enable the &quot;Strip Markdown&quot; option to automatically remove headers (#), bold/italic markers (**), links, code blocks, and other formatting for clean, natural-sounding speech output. Perfect for content from ChatGPT, GitHub, or any markdown source.</p>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>Do I need to create an account?</summary>
            <p className={styles.faqAnswer}>No account or registration needed. Just paste your text and click play. Your privacy is protected — we don&apos;t store your text, track your usage, or require any personal information.</p>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>What voices are available?</summary>
            <p className={styles.faqAnswer}>Varterm offers three tiers of voices: Cloud voices (Microsoft neural voices with natural quality and multiple accents), Browser voices (your device&apos;s built-in voices for maximum speed), and Offline voices (Piper AI that runs locally in your browser for complete privacy).</p>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>Can I use this for bulk text to speech conversion?</summary>
            <p className={styles.faqAnswer}>Yes! Varterm handles bulk text conversion efficiently. Paste any amount of text — articles, documentation, ebooks — and it will be converted to speech. The chunking system ensures smooth playback even for very long content.</p>
          </details>
        </div>
      </section>

      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
