'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { HOMEPAGE_FAQ } from '@/lib/seo-faq';
import {
  flushVoices,
  isOfflineSupported,
  prepareVoice,
  storedVoices,
  synthesizeOffline,
} from '@/lib/piper-client';
import styles from './page.module.css';

// Donation link
const DONATION_LINK = 'https://buy.stripe.com/00w6oG2Zq23a8al1PB3VC00';
const FORMSPREE_FEEDBACK_ENDPOINT = 'https://formspree.io/f/mojrpewv';

/** Session-only; separate key per slug so newer posts surface after deploy. */
const NEWS_PREVIEW_DISMISS_PREFIX = 'varterm.news.preview.dismiss';

function newsPreviewDismissStorageKey(slug) {
  return `${NEWS_PREVIEW_DISMISS_PREFIX}:${slug}`;
}

function formatNewsDate(isoDate) {
  if (!isoDate || typeof isoDate !== 'string') return '';
  const trimmed = isoDate.trim();
  const d = /^\d{4}-\d{2}-\d{2}$/.test(trimmed)
    ? new Date(`${trimmed}T12:00:00Z`)
    : new Date(trimmed);
  if (Number.isNaN(d.getTime())) return trimmed;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

// Microsoft Edge neural voices (FREE)
// Piper voices (Offline - synthesized in the browser, model cached after first download)
const PIPER_VOICES = [
  { id: 'en_US-amy-medium', name: 'Amy', desc: 'Female, clear', sizeMb: 63 },
  { id: 'en_US-ryan-medium', name: 'Ryan', desc: 'Male, natural', sizeMb: 63 },
  { id: 'en_US-lessac-medium', name: 'Lessac', desc: 'Female, expressive', sizeMb: 63 },
  { id: 'en_GB-cori-medium', name: 'Cori', desc: 'British female', sizeMb: 63 },
  { id: 'en_GB-alan-medium', name: 'Alan', desc: 'British male', sizeMb: 63 },
];

/** Piper synthesizes locally, so smaller chunks keep the first words coming quickly. */
const PIPER_CHUNK_SIZE = 1200;

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

/** Shape matches `getVoices()` when tier is cloud; keeps UI selection in sync with playback default. */
const DEFAULT_CLOUD_VOICE = { ...MICROSOFT_VOICES[0], tier: 'cloud' };

export default function HomeClient({ featuredNews = null }) {
  // State
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState(DEFAULT_CLOUD_VOICE);
  const [selectedTier, setSelectedTier] = useState('cloud');
  const [browserVoices, setBrowserVoices] = useState([]);
  const [piperLoading, setPiperLoading] = useState(false);
  const [offlineSupported, setOfflineSupported] = useState(false);
  const [downloadedVoices, setDownloadedVoices] = useState([]);
  const [pendingDownload, setPendingDownload] = useState(null);
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
  const [newsPreviewHiddenForSession, setNewsPreviewHiddenForSession] = useState(false);

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

  useEffect(() => {
    if (!featuredNews?.slug) return;
    try {
      if (
        typeof sessionStorage !== 'undefined' &&
        sessionStorage.getItem(newsPreviewDismissStorageKey(featuredNews.slug)) === '1'
      ) {
        setNewsPreviewHiddenForSession(true);
      }
    } catch {
      // Private mode / storage blocked
    }
  }, [featuredNews?.slug]);

  useEffect(() => {
    setOfflineSupported(isOfflineSupported());
  }, []);

  const refreshDownloadedVoices = async () => {
    try {
      setDownloadedVoices(await storedVoices());
    } catch {
      setDownloadedVoices([]);
    }
  };

  useEffect(() => {
    if (selectedTier !== 'offline' || !offlineSupported) return;
    let active = true;
    storedVoices()
      .then((voices) => {
        if (active) setDownloadedVoices(voices);
      })
      .catch(() => {
        if (active) setDownloadedVoices([]);
      });
    return () => {
      active = false;
    };
  }, [selectedTier, offlineSupported]);

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
      const response = await fetch(FORMSPREE_FEEDBACK_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          ...feedbackForm,
          source: 'varterm-web-feedback-modal',
        }),
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

  function dismissNewsPreviewForSession() {
    if (!featuredNews?.slug) return;
    try {
      sessionStorage.setItem(newsPreviewDismissStorageKey(featuredNews.slug), '1');
    } catch {
      // ignore (private browsing, quotas, etc.)
    }
    setNewsPreviewHiddenForSession(true);
  }

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
      return;
    }

    if (selectedTier === 'offline') {
      const voice = selectedVoice || PIPER_VOICES[0];
      // Never spend 60MB of someone's data plan without asking first.
      if (!downloadedVoices.includes(voice.id)) {
        setPendingDownload(voice);
        return;
      }
      await speakWithPiper();
      return;
    }

    await speakWithMicrosoft();
  };

  const confirmOfflineDownload = async () => {
    setPendingDownload(null);
    await speakWithPiper();
  };

  const changeTier = (tier) => {
    if (tier === selectedTier) return;
    stop();
    setSelectedTier(tier);
    setSelectedVoice(
      tier === 'offline' ? { ...PIPER_VOICES[0], tier: 'offline' } : DEFAULT_CLOUD_VOICE
    );
  };

  const removeOfflineVoices = async () => {
    try {
      stop();
      await flushVoices();
      await refreshDownloadedVoices();
      showToast('Offline voices removed', 'success');
    } catch {
      showToast('Could not remove offline voices', 'error');
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

  const playAudioUrl = (url) =>
    new Promise((resolve, reject) => {
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.playbackRate = rate;
      audio.onended = () => {
        setReadingProgress(100);
        resolve();
      };
      audio.onerror = () => reject(new Error('Playback failed'));
      audio.ontimeupdate = () => {
        if (audio.duration) {
          setReadingProgress(Math.min((audio.currentTime / audio.duration) * 100, 100));
        }
      };
      setReadingProgress(0);
      audio.play().catch(reject);
    });

  // Piper TTS (offline, synthesized in a worker via WASM)
  const speakWithPiper = async () => {
    if (!offlineSupported) {
      showToast('This browser cannot store offline voices', 'error');
      return;
    }

    stopRequestedRef.current = false;
    const voiceId = selectedVoice?.id || PIPER_VOICES[0].id;
    const chunks = splitTextIntoChunks(getTextToSpeak(), PIPER_CHUNK_SIZE);
    const totalChunks = chunks.length;

    setStatus('speaking');
    setPiperLoading(true);
    setChunkProgress({
      current: 0,
      total: totalChunks,
      status: 'generating',
      chunks,
      currentText: 'Warming up the offline voice...',
    });

    try {
      await prepareVoice(voiceId, ({ loaded, total }) => {
        if (!total) return;
        const percent = Math.round((loaded / total) * 100);
        setChunkProgress((prev) =>
          prev ? { ...prev, currentText: `Downloading voice model... ${percent}%` } : prev
        );
      });

      if (stopRequestedRef.current) return;
      setPiperLoading(false);
      await refreshDownloadedVoices();

      // Synthesize the next part while the current one plays.
      let nextAudio = synthesizeOffline(voiceId, chunks[0]);
      nextAudio.catch(() => {});

      for (let i = 0; i < totalChunks; i += 1) {
        if (stopRequestedRef.current) return;

        setChunkProgress({
          current: i + 1,
          total: totalChunks,
          status: 'generating',
          chunks,
          currentText: chunks[i],
        });

        const blob = await nextAudio;
        if (stopRequestedRef.current) return;

        if (i + 1 < totalChunks) {
          nextAudio = synthesizeOffline(voiceId, chunks[i + 1]);
          nextAudio.catch(() => {});
        }

        const url = URL.createObjectURL(blob);
        setChunkProgress({
          current: i + 1,
          total: totalChunks,
          status: 'playing',
          chunks,
          currentText: chunks[i],
        });

        try {
          await playAudioUrl(url);
        } finally {
          URL.revokeObjectURL(url);
        }
      }

      setChunkProgress(null);
      setStatus('ready');
    } catch (error) {
      console.error('Piper TTS Error:', error);
      if (!stopRequestedRef.current) {
        showToast(error.message || 'Offline voice failed. Try cloud voices.', 'error');
      }
      setChunkProgress(null);
      setReadingProgress(0);
      setStatus('ready');
    } finally {
      setPiperLoading(false);
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
            <span className={styles.logoSubheading}>Long-Form Text to Speech Everywhere</span>
            <span className={styles.logoSubSubheading}>Web · Cursor · VS Code · Chrome</span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <a
            className={styles.githubLink}
            href="https://github.com/varterm"
            target="_blank"
            rel="noreferrer"
            aria-label="Varterm GitHub organization"
            title="Varterm on GitHub"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.59 2 12.26c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.22-3.37-1.22-.46-1.2-1.11-1.52-1.11-1.52-.91-.64.07-.63.07-.63 1 .08 1.54 1.06 1.54 1.06.9 1.58 2.35 1.13 2.92.86.09-.67.35-1.13.63-1.39-2.22-.26-4.56-1.15-4.56-5.11 0-1.13.39-2.05 1.03-2.77-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.06A9.35 9.35 0 0 1 12 6.82c.85 0 1.7.12 2.5.35 1.9-1.34 2.74-1.06 2.74-1.06.55 1.42.2 2.47.1 2.73.64.72 1.03 1.64 1.03 2.77 0 3.97-2.34 4.85-4.57 5.1.36.32.67.95.67 1.92 0 1.39-.01 2.5-.01 2.85 0 .27.18.6.69.49A10.22 10.22 0 0 0 22 12.26C22 6.59 17.52 2 12 2Z"
              />
            </svg>
          </a>
          <Link className={styles.headerLink} href="/extensions">
            Extensions
          </Link>
          <Link className={styles.headerLink} href="/news">
            News
          </Link>
          <Link className={styles.headerLink} href="/privacy">
            Privacy
          </Link>
          <Link className={styles.headerLink} href="/support">
            Support
          </Link>
          <button className={styles.feedbackBtn} onClick={() => setShowFeedbackModal(true)}>
            <span>Feedback</span>
          </button>
          <button className={styles.upgradeBtn} onClick={() => setShowModal(true)} type="button">
            <span>Donate</span>
          </button>
        </div>
      </header>

      {/* Hero Section with H1 for SEO */}
      <section className={styles.heroSection} aria-labelledby="hero-heading">
        <h1 id="hero-heading" className={styles.heroTitle}>
          Free Text to Speech Converter
        </h1>
        <p className={styles.heroSubtitle}>
          Paste a paragraph or a 50-page doc. Long text is <strong>split into parts</strong> and
          starts playing while the rest generates. Markdown stripped automatically. No signup.
          Pick a realistic cloud voice, or one that runs <strong>entirely on your machine</strong>.
        </p>
        <p className={styles.heroMeta}>
          Also a Cursor &amp; VS Code extension: <strong>Agent Auto-read</strong> speaks your
          agent&apos;s replies. One install, every window, zero echo. MIT on{' '}
          <a href="https://github.com/varterm/extensions" target="_blank" rel="noreferrer">
            GitHub
          </a>
          .
        </p>
      </section>

      {featuredNews && !newsPreviewHiddenForSession ? (
        <aside className={styles.newsPreview} aria-labelledby="news-preview-heading">
          <button
            type="button"
            className={styles.newsPreviewClose}
            onClick={dismissNewsPreviewForSession}
            aria-label="Dismiss announcement for this visit"
          >
            ×
          </button>
          <Link href={`/news/${featuredNews.slug}`} className={styles.newsPreviewCard}>
            <span className={styles.newsPreviewEyebrow}>Latest</span>
            <p id="news-preview-heading" className={styles.newsPreviewTitle}>
              {featuredNews.title}
            </p>
            <p className={styles.newsPreviewExcerpt}>{featuredNews.excerpt}</p>
            <span className={styles.newsPreviewMeta}>
              <time dateTime={featuredNews.date}>{formatNewsDate(featuredNews.date)}</time>
              <span className={styles.newsPreviewCta}>Read update →</span>
            </span>
          </Link>
          <div className={styles.newsPreviewFooter}>
            <Link href="/news" className={styles.newsPreviewArchive}>
              All news →
            </Link>
          </div>
        </aside>
      ) : null}

      <section className={`${styles.section} ${styles.editorSection}`}>
        <div className={styles.editorHeader}>
          <nav className={styles.extensionQuickLinks} aria-label="Extension installs">
            <Link href="/extensions#editors" className={styles.extensionQuickLink}>
              Cursor &amp; VS Code
            </Link>
            <span className={styles.extensionQuickSep} aria-hidden>
              ·
            </span>
            <Link href="/extensions#chrome" className={styles.extensionQuickLink}>
              Chrome
            </Link>
          </nav>
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
          className={`${styles.controlBtn} ${styles.controlBtnPause}`}
          onClick={togglePause}
          disabled={!isPlaying}
          aria-label={isPaused ? 'Resume' : 'Pause'}
        >
          {isPaused ? '▶' : '⏸'}
        </button>
        <button
          className={`${styles.controlBtn} ${styles.controlBtnStop}`}
          onClick={stop}
          disabled={!isPlaying}
          aria-label="Stop"
        >
          ⏹
        </button>
      </div>

      <div className={styles.privacyNote}>
        <span className={styles.privacyChips}>
          <span className={styles.privacyChip}>Free forever</span>
          <span className={styles.privacyChip}>No account</span>
          <span className={styles.privacyChip}>Nothing you paste is stored</span>
          <span className={styles.privacyChip}>No ads, no data sales</span>
        </span>
        <p className={styles.privacyLine}>
          Cloud voices send your text to Microsoft neural TTS to make the audio, then drop it. We
          never save it, sell it, or train on it. Want nothing to leave the machine at all? Switch
          to offline voices below. Page-visit analytics only — never your content.{' '}
          <Link href="/privacy" className={styles.privacyLink}>
            Privacy
          </Link>
        </p>
      </div>

      {/* Voice Selection */}
      <section className={styles.section}>
        {offlineSupported && (
          <div className={styles.tierRow}>
            <div className={styles.tierSwitch} role="tablist" aria-label="Voice engine">
              <button
                type="button"
                role="tab"
                aria-selected={selectedTier === 'cloud'}
                className={`${styles.tierBtn} ${selectedTier === 'cloud' ? styles.tierBtnActive : ''}`}
                onClick={() => changeTier('cloud')}
              >
                Cloud voices
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={selectedTier === 'offline'}
                className={`${styles.tierBtn} ${selectedTier === 'offline' ? styles.tierBtnActive : ''}`}
                onClick={() => changeTier('offline')}
              >
                Offline voices
              </button>
            </div>
            {selectedTier === 'cloud' && (
              <span className={styles.tierHint}>
                Free Microsoft neural voices, nothing to download.
              </span>
            )}
            {selectedTier === 'offline' && (
              <span className={styles.tierHint}>
                Runs in your browser. Your text never leaves this device.
                {downloadedVoices.length > 0 && (
                  <>
                    {' '}
                    <button type="button" className={styles.tierManage} onClick={removeOfflineVoices}>
                      Remove downloaded ({downloadedVoices.length})
                    </button>
                  </>
                )}
              </span>
            )}
          </div>
        )}

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
              {voice.tier === 'offline' && (
                <div
                  className={`${styles.voiceBadge} ${
                    downloadedVoices.includes(voice.id) ? styles.voiceBadgeReady : ''
                  }`}
                >
                  {downloadedVoices.includes(voice.id) ? 'Downloaded' : `${voice.sizeMb} MB`}
                </div>
              )}
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
                disabled={selectedTier === 'offline'}
                title={
                  selectedTier === 'offline' ? 'Offline voices use a fixed pitch' : undefined
                }
                onChange={(e) => setPitch(parseFloat(e.target.value))}
              />
              <span className={styles.sliderValue}>
                {selectedTier === 'offline' ? 'n/a' : `${pitch}x`}
              </span>
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

      <section className={styles.enginesSection} aria-labelledby="engines-heading">
        <h2 id="engines-heading" className={styles.sectionHeading}>
          Three engines, one player
        </h2>
        <p className={styles.sectionLede}>
          Varterm is not a single voice. Different text wants a different trade-off — keeping it
          secret, getting it read now, or sounding convincingly human for an hour — so the same
          controls drive more than one engine.
        </p>
        <div className={styles.engineGrid}>
          <article className={styles.engineCard}>
            <span className={`${styles.engineBadge} ${styles.engineBadgeLocal}`}>On device</span>
            <h3>Local and private</h3>
            <p>
              Piper voices synthesise inside the tab. One model download of about 63MB is cached on
              the device, and after that there is no network call at all — read an unreleased spec
              or a contract and nothing leaves your machine. No round trip also means it starts
              fast, and keeps working on a plane.
            </p>
          </article>
          <article className={styles.engineCard}>
            <span className={`${styles.engineBadge} ${styles.engineBadgeFree}`}>Free · default</span>
            <h3>Cloud neural</h3>
            <p>
              Microsoft neural voices, unmetered and with no account. Genuinely realistic across
              American, British, and Australian accents, with nothing to download first. Your text
              goes out only to be turned into audio and is dropped immediately — never stored, never
              sold, never trained on.
            </p>
          </article>
          <article className={`${styles.engineCard} ${styles.engineCardSoon}`}>
            <span className={`${styles.engineBadge} ${styles.engineBadgeSoon}`}>Coming · paid</span>
            <h3>Studio voices</h3>
            <p>
              An ElevenLabs integration for the most lifelike delivery we can offer, for the times a
              voice has to hold your attention through a long document rather than just get the
              words out. It bills per character upstream, so it will be a paid add-on. The two
              engines above stay free.
            </p>
          </article>
        </div>
      </section>

      <section className={styles.platformSection} aria-labelledby="platform-heading">
        <h2 id="platform-heading" className={styles.sectionHeading}>
          Use Varterm anywhere
        </h2>
        <div className={styles.platformGrid}>
          <article className={styles.platformCard}>
            <div className={styles.platformCardBody}>
              <h3>Web reader</h3>
              <p>
                Drop in long articles, RFCs, and full chapters. Free cloud neural voices, chunked
                playback, live part progress.
              </p>
            </div>
            <span className={styles.platformBadge}>You are here</span>
          </article>
          <article className={styles.platformCard}>
            <div className={styles.platformCardBody}>
              <h3>Cursor &amp; VS Code</h3>
              <p>
                <strong>Agent Auto-read</strong> speaks finished replies while you keep coding.
                Long answers split into parts you can jump through. One install, every window,
                zero echo.
              </p>
            </div>
            <Link href="/extensions#editors" className={styles.platformCta}>
              Install extension
            </Link>
          </article>
          <article className={styles.platformCard}>
            <div className={styles.platformCardBody}>
              <h3>Chrome</h3>
              <p>
                Read a selection or an entire long-form page without leaving the tab you are on.
              </p>
            </div>
            <Link href="/extensions#chrome" className={styles.platformCta}>
              Get Chrome extension
            </Link>
          </article>
        </div>
      </section>

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
                Varterm is free — no accounts and no paywalls.
                We do use basic analytics to understand visits and improve reliability. If this tool saves you time, consider throwing us a coffee.
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

      {/* Offline voice download confirmation */}
      {pendingDownload && (
        <div className={styles.modalOverlay} onClick={() => setPendingDownload(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={() => setPendingDownload(null)}>
              ×
            </button>
            <div className={styles.donationSection} style={{ borderTop: 'none', paddingTop: 0, marginTop: 0 }}>
              <div className={styles.donationEmoji}>⬇️</div>
              <h3>Download {pendingDownload.name}?</h3>
              <p>
                Offline voices run entirely in your browser, so the {pendingDownload.sizeMb} MB
                voice model has to come down once. After that it is cached on this device and your
                text never leaves it — no network needed.
              </p>
              <button className={styles.donationBtn} onClick={confirmOfflineDownload}>
                Download and play
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

      {/* Cursor workflow Section */}
      <section className={styles.featuresSection} aria-labelledby="flow-heading">
        <h2 id="flow-heading" className={styles.sectionHeading}>Your Cursor Loop, Hands-Free</h2>
        <div className={styles.featuresGrid}>
          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>⌨️</div>
            <h3>Ask, then keep typing</h3>
            <p>
              Send the prompt and go back to your file. When the agent finishes, the reply reads
              itself — you stop parking on the chat panel watching tokens stream in.
            </p>
          </article>
          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>⏭️</div>
            <h3>Skim with your ears</h3>
            <p>
              Long replies split into parts. Jump forward past the preamble, jump back to re-hear
              the one line that mattered. No scrolling up through the chat to find it again.
            </p>
          </article>
          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>🪟</div>
            <h3>Ten windows, one voice</h3>
            <p>
              Run a fleet of Cursor windows across repos. One user install covers all of them and
              only the focused window speaks, so parallel agents never talk over each other.
            </p>
          </article>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection} aria-labelledby="features-heading">
        <h2 id="features-heading" className={styles.sectionHeading}>Why Developers Pick Varterm TTS</h2>
        <div className={styles.featuresGrid}>
          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>🎧</div>
            <h3>Agent Auto-read</h3>
            <p>
              Flip it on in Cursor and finished agent replies just play. One install covers every
              window and only the focused one speaks, so ten windows never echo. Play, pause, stop,
              and jump live in the status bar.
            </p>
          </article>
          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>📄</div>
            <h3>Built For Long Form</h3>
            <p>
              Long articles, RFCs, and 40-page agent dumps. Varterm splits text into parts, plays
              part one while the rest still generates, and keeps going — no single-request timeout
              wall. Watch it track part 3 of 12 as it reads.
            </p>
          </article>
          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>✨</div>
            <h3>Strip Markdown Automatically</h3>
            <p>
              Paste content from ChatGPT, GitHub, or any markdown source. Our TTS strips headers, links,
              code blocks, and formatting for clean, natural-sounding audio output.
            </p>
          </article>
          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>🔓</div>
            <h3>Free, No Login, MIT Source</h3>
            <p>
              No account, no paywall, no trial. The editor extension is MIT licensed and the source
              is on GitHub — read it, fork it, build the VSIX yourself.
            </p>
          </article>
          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>🛡️</div>
            <h3>Private By Default</h3>
            <p>
              There is no account, so there is nothing to profile. What you paste goes to the voice
              engine, comes back as audio, and is gone — no database, no history, no training set.
              We count page visits, never your words.
            </p>
          </article>
          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>🎙️</div>
            <h3>Realistic Neural Voices</h3>
            <p>
              Microsoft neural voices that sound natural and expressive, in American, British, and
              Australian accents with adjustable speed — free and unmetered. Studio-grade ElevenLabs
              voices are coming as a paid add-on for when you need more.
            </p>
          </article>
          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>📡</div>
            <h3>Secure, Fast, Local Voices</h3>
            <p>
              Switch the web reader to Piper voices and synthesis happens on your machine. One 63MB
              model download, cached on the device, and after that your text never leaves the tab —
              no server, no network, nothing to leak.
            </p>
          </article>
          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3>Fast &amp; Reliable</h3>
            <p>No waiting in queues. Audio generates instantly and starts playing immediately with reliable long-form playback.</p>
          </article>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection} aria-labelledby="faq-heading">
        <h2 id="faq-heading" className={styles.sectionHeading}>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {HOMEPAGE_FAQ.map((item) => (
            <details key={item.question} className={styles.faqItem}>
              <summary className={styles.faqQuestion}>{item.question}</summary>
              <p className={styles.faqAnswer}>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          {toast.message}
        </div>
      )}

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <h2>Varterm TTS</h2>
          <p>
            Built for long-form docs and markdown-heavy content across web,
            editor, and browser workflows.
          </p>
        </div>
        <div className={styles.footerLinks}>
          <Link href="/extensions">Extensions</Link>
          <Link href="/news">News</Link>
          <Link href="/long-form-tts">Long-form guide</Link>
          <Link href="/markdown-to-speech">Markdown guide</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/support">Support</Link>
        </div>
      </footer>
    </div>
  );
}
