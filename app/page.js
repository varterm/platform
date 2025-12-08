'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';

// Stripe payment links - UPDATE THESE WITH YOUR LINKS
const STRIPE_LINKS = {
  starter: 'https://buy.stripe.com/YOUR_STARTER_LINK',
  pro: 'https://buy.stripe.com/YOUR_PRO_LINK',
  unlimited: 'https://buy.stripe.com/YOUR_UNLIMITED_LINK',
};

// Premium voice configurations
const PREMIUM_VOICES = {
  premium: [
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', desc: 'Warm, conversational' },
    { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura', desc: 'Clear, professional' },
    { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie', desc: 'Natural, friendly' },
    { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', desc: 'British, refined' },
    { id: 'N2lVS1w4EtoT3dr4eOWO', name: 'Callum', desc: 'Energetic, young' },
    { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam', desc: 'Deep, authoritative' },
  ],
  ultra: [
    { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', desc: 'Ultra realistic' },
    { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', desc: 'Strong, confident' },
    { id: 'GBv7mTt0atIp3Br8iCZE', name: 'Thomas', desc: 'Calm, American' },
    { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli', desc: 'Emotional range' },
  ],
};

export default function Home() {
  // State
  const [text, setText] = useState('');
  const [currentPlan, setCurrentPlan] = useState('free');
  const [apiKey, setApiKey] = useState('');
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [selectedTier, setSelectedTier] = useState('free');
  const [browserVoices, setBrowserVoices] = useState([]);
  const [status, setStatus] = useState('ready');
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [usedChars, setUsedChars] = useState(0);
  
  // Refs
  const audioRef = useRef(null);
  const synthRef = useRef(null);

  // Load browser voices and saved state
  useEffect(() => {
    if (typeof window !== 'undefined') {
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
      
      // Load saved state
      const savedKey = localStorage.getItem('elevenLabsKey');
      const savedChars = parseInt(localStorage.getItem('usedChars') || '0');
      
      if (savedKey) {
        setApiKey(savedKey);
        setCurrentPlan('pro');
      }
      setUsedChars(savedChars);
    }
  }, []);

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Generate speech
  const speak = async () => {
    if (!text.trim()) {
      showToast('Please enter some text to read', 'error');
      return;
    }
    
    stop();
    
    if (selectedVoice?.tier === 'premium' || selectedVoice?.tier === 'ultra') {
      await speakWithAPI();
    } else {
      speakWithBrowser();
    }
  };

  const speakWithBrowser = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (selectedVoice?.browserVoice) {
      utterance.voice = selectedVoice.browserVoice;
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    utterance.onstart = () => setStatus('speaking');
    utterance.onend = () => setStatus('ready');
    utterance.onerror = () => setStatus('ready');
    
    synthRef.current.speak(utterance);
  };

  const speakWithAPI = async () => {
    if (!apiKey) {
      showToast('Please add your API key first', 'error');
      setShowModal(true);
      return;
    }
    
    setStatus('speaking');
    
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceId: selectedVoice?.id,
          speed: rate,
        }),
      });
      
      if (!response.ok) throw new Error('API request failed');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      audioRef.current = new Audio(url);
      audioRef.current.onended = () => setStatus('ready');
      audioRef.current.play();
      
      // Track usage
      const newUsed = usedChars + text.length;
      setUsedChars(newUsed);
      localStorage.setItem('usedChars', newUsed.toString());
      
    } catch (error) {
      showToast('Error generating audio', 'error');
      setStatus('ready');
    }
  };

  const togglePause = () => {
    if (selectedVoice?.tier === 'premium' || selectedVoice?.tier === 'ultra') {
      if (audioRef.current) {
        if (isPaused) {
          audioRef.current.play();
          setStatus('speaking');
        } else {
          audioRef.current.pause();
          setStatus('paused');
        }
        setIsPaused(!isPaused);
      }
    } else {
      if (isPaused) {
        synthRef.current.resume();
        setStatus('speaking');
      } else {
        synthRef.current.pause();
        setStatus('paused');
      }
      setIsPaused(!isPaused);
    }
  };

  const stop = () => {
    synthRef.current?.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPaused(false);
    setStatus('ready');
  };

  const saveApiKey = () => {
    if (!apiKey.trim()) {
      showToast('Please enter an API key', 'error');
      return;
    }
    localStorage.setItem('elevenLabsKey', apiKey);
    setCurrentPlan('pro');
    setShowModal(false);
    showToast('API key saved! Premium voices unlocked.', 'success');
  };

  const checkout = (plan) => {
    const url = STRIPE_LINKS[plan];
    if (url.includes('YOUR_')) {
      showToast('Configure Stripe links in the code', 'error');
      return;
    }
    window.open(url, '_blank');
  };

  // Get voices for current tier
  const getVoicesForTier = () => {
    if (selectedTier === 'free') {
      return browserVoices.map((v, i) => ({
        id: `browser-${i}`,
        name: v.name.split(' ')[0],
        desc: v.lang,
        tier: 'free',
        browserVoice: v,
      }));
    }
    
    const voices = selectedTier === 'ultra' ? PREMIUM_VOICES.ultra : PREMIUM_VOICES.premium;
    return voices.map(v => ({
      ...v,
      tier: selectedTier,
      locked: !apiKey,
    }));
  };

  const isPlaying = status === 'speaking' || status === 'paused';

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>▸</div>
          <div className={styles.logoWords}>
            <span className={styles.logoText}>Varterm</span>
            <span className={styles.logoTagline}>Free Text Reader</span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={`${styles.planBadge} ${currentPlan !== 'free' ? styles.premium : ''}`}>
            {currentPlan === 'free' ? 'Free Plan' : '💎 Pro'}
          </div>
          <button className={styles.upgradeBtn} onClick={() => setShowModal(true)}>
            ✨ Upgrade
          </button>
        </div>
      </header>

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
      </section>

      {/* Voice Selection */}
      <section className={styles.section}>
        <div className={styles.voiceTabs}>
          {['free', 'premium', 'ultra'].map((tier) => (
            <button
              key={tier}
              className={`${styles.voiceTab} ${selectedTier === tier ? styles.active : ''} ${
                tier !== 'free' && !apiKey ? styles.locked : ''
              }`}
              onClick={() => {
                if (tier !== 'free' && !apiKey) {
                  setShowModal(true);
                } else {
                  setSelectedTier(tier);
                }
              }}
            >
              {tier.charAt(0).toUpperCase() + tier.slice(1)}
              {tier !== 'free' && !apiKey && ' 🔒'}
            </button>
          ))}
        </div>

        <div className={styles.voiceGrid}>
          {getVoicesForTier().map((voice) => (
            <div
              key={voice.id}
              className={`${styles.voiceCard} ${
                selectedVoice?.id === voice.id ? styles.selected : ''
              } ${voice.locked ? styles.locked : ''}`}
              onClick={() => {
                if (voice.locked) {
                  setShowModal(true);
                } else {
                  setSelectedVoice(voice);
                }
              }}
            >
              <div className={styles.voiceName}>
                {voice.name}
                {voice.tier !== 'free' && (
                  <span className={styles.premiumBadge}>
                    {voice.tier === 'ultra' ? 'ULTRA' : 'PRO'}
                  </span>
                )}
              </div>
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
            {status === 'speaking' ? 'Speaking...' : status === 'paused' ? 'Paused' : 'Ready to read'}
          </span>
        </div>
        <div className={styles.usageInfo}>
          <span>{usedChars.toLocaleString()}</span> / {currentPlan === 'unlimited' ? '∞' : currentPlan === 'pro' ? '200,000' : '∞'} chars
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={() => setShowModal(false)}>
              ×
            </button>

            <div className={styles.modalHeader}>
              <h2>Upgrade Your Experience</h2>
              <p>Unlock premium AI voices that sound remarkably human</p>
            </div>

            <div className={styles.pricingGrid}>
              {[
                {
                  name: 'Starter',
                  price: '$5',
                  desc: 'Perfect for casual use',
                  features: ['50,000 characters/month', '10 premium voices', 'Standard quality', 'Email support'],
                  plan: 'starter',
                },
                {
                  name: 'Pro',
                  price: '$15',
                  desc: 'Best for regular readers',
                  features: ['200,000 characters/month', '30+ premium voices', 'HD quality', 'Priority support'],
                  plan: 'pro',
                  featured: true,
                },
                {
                  name: 'Unlimited',
                  price: '$29',
                  desc: 'For power users',
                  features: ['Unlimited characters', 'All 50+ Ultra HD voices', 'Ultra HD quality', 'API access'],
                  plan: 'unlimited',
                },
              ].map((tier) => (
                <div
                  key={tier.plan}
                  className={`${styles.pricingCard} ${tier.featured ? styles.featured : ''}`}
                >
                  {tier.featured && <div className={styles.popularBadge}>Most Popular</div>}
                  <div className={styles.planName}>{tier.name}</div>
                  <div className={styles.planPrice}>
                    <span className={styles.priceAmount}>{tier.price}</span>
                    <span className={styles.pricePeriod}>/month</span>
                  </div>
                  <p className={styles.planDesc}>{tier.desc}</p>
                  <ul className={styles.planFeatures}>
                    {tier.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                  <button
                    className={styles.planBtn}
                    onClick={() => checkout(tier.plan)}
                  >
                    Get {tier.name}
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.apiSection}>
              <p>Already have an ElevenLabs API key?</p>
              <div className={styles.apiInputGroup}>
                <input
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className={styles.apiInput}
                />
                <button className={styles.apiSaveBtn} onClick={saveApiKey}>
                  Save Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
