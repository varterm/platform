import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
  title: 'Long Form Text to Speech | Convert Documents to Audio Free',
  description: 'Convert long documents, articles, and ebooks to natural speech. Our long form TTS handles unlimited text length with automatic chunking. Free, no signup required.',
  keywords: ['long form tts', 'document to speech', 'ebook to audio', 'long text to speech', 'bulk text to speech', 'article to audio'],
  alternates: {
    canonical: '/long-form-tts',
  },
  openGraph: {
    title: 'Long Form Text to Speech | Convert Documents to Audio Free',
    description: 'Convert entire documents, articles, and ebooks to natural speech. No length limits, completely free.',
  },
};

// JSON-LD for this page
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Long Form Text to Speech Converter',
  description: 'Convert long documents, articles, and ebooks to natural speech with no length limits.',
  url: 'https://varterm.com/long-form-tts',
  mainEntity: {
    '@type': 'SoftwareApplication',
    name: 'Varterm Long Form TTS',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  },
};

export default function LongFormTTS() {
  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← Back to Varterm
        </Link>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Long Form Text to Speech Converter</h1>
          <p className={styles.subtitle}>
            Convert entire documents, articles, research papers, and ebooks to natural-sounding speech. 
            No length limits, completely free, no registration required.
          </p>
          <Link href="/" className={styles.ctaButton}>
            Try Free Long Form TTS →
          </Link>
        </section>

        <section className={styles.features}>
          <h2>Why Use Long Form TTS?</h2>
          
          <div className={styles.featureGrid}>
            <article className={styles.feature}>
              <h3>📚 Convert Entire Documents</h3>
              <p>
                Unlike other TTS tools that limit you to a few hundred characters, Varterm handles 
                documents of any length. Paste an entire article, whitepaper, or book chapter and 
                listen to it all.
              </p>
            </article>

            <article className={styles.feature}>
              <h3>🔄 Automatic Chunking</h3>
              <p>
                Our intelligent chunking system splits long texts at natural sentence boundaries, 
                ensuring smooth audio playback. Each chunk is processed and played sequentially 
                for a seamless listening experience.
              </p>
            </article>

            <article className={styles.feature}>
              <h3>📊 Progress Tracking</h3>
              <p>
                See exactly where you are in long documents with our visual progress indicator. 
                Know which part is being read and how much remains — perfect for following along 
                with lengthy content.
              </p>
            </article>

            <article className={styles.feature}>
              <h3>⏯️ Full Playback Control</h3>
              <p>
                Play, pause, and stop at any time. The audio picks up right where you left off, 
                making it easy to take breaks during long listening sessions without losing your place.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.useCases}>
          <h2>Perfect For</h2>
          <ul className={styles.useCaseList}>
            <li><strong>Research papers &amp; academic articles</strong> — Listen while commuting or exercising</li>
            <li><strong>Documentation &amp; technical docs</strong> — Learn by listening to programming guides</li>
            <li><strong>Blog posts &amp; news articles</strong> — Turn your reading list into a podcast</li>
            <li><strong>Ebooks &amp; book chapters</strong> — Convert any text to an audiobook</li>
            <li><strong>ChatGPT &amp; AI responses</strong> — Listen to long AI-generated content hands-free</li>
            <li><strong>Meeting notes &amp; transcripts</strong> — Review meetings while multitasking</li>
          </ul>
        </section>

        <section className={styles.howItWorks}>
          <h2>How It Works</h2>
          <ol className={styles.steps}>
            <li>
              <span className={styles.stepNumber}>1</span>
              <div>
                <strong>Paste Your Text</strong>
                <p>Copy and paste your entire document, article, or any long-form content into Varterm.</p>
              </div>
            </li>
            <li>
              <span className={styles.stepNumber}>2</span>
              <div>
                <strong>Choose Your Voice</strong>
                <p>Select from high-quality Microsoft neural voices, browser voices, or offline Piper AI voices.</p>
              </div>
            </li>
            <li>
              <span className={styles.stepNumber}>3</span>
              <div>
                <strong>Press Play</strong>
                <p>Click play and let Varterm handle the rest. Long texts are automatically chunked and streamed.</p>
              </div>
            </li>
          </ol>
        </section>

        <section className={styles.cta}>
          <h2>Ready to Convert Your Documents to Speech?</h2>
          <p>No signup required. Completely free. Start listening now.</p>
          <Link href="/" className={styles.ctaButton}>
            Start Converting Text to Speech →
          </Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>
          <Link href="/">Varterm</Link> — Varterm TTS for long-form listening.
        </p>
      </footer>
    </div>
  );
}
