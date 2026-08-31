import Link from 'next/link';
import Breadcrumbs from '../Breadcrumbs';
import styles from './page.module.css';

export const metadata = {
  title: 'Markdown to Speech | Strip Markdown TTS Converter Free',
  description: 'Convert markdown files to clean speech. Automatically strips headers, bold, links, code blocks for natural audio. Free markdown to speech converter online.',
  alternates: {
    canonical: '/markdown-to-speech',
  },
  openGraph: {
    title: 'Markdown to Speech | Strip Markdown TTS Converter Free',
    description: 'Convert markdown to clean speech. Automatically strips formatting for natural audio output.',
  },
};

// JSON-LD for this page
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Markdown to Speech Converter',
  description: 'Convert markdown files to clean speech by automatically stripping formatting.',
  url: 'https://varterm.com/markdown-to-speech',
  mainEntity: {
    '@type': 'SoftwareApplication',
    name: 'Varterm Markdown to Speech',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  },
};

export default function MarkdownToSpeech() {
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
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Markdown to speech', path: '/markdown-to-speech' },
          ]}
        />
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Markdown to Speech Converter</h1>
          <p className={styles.subtitle}>
            Convert markdown content to clean, natural-sounding speech. Automatically strips 
            headers, bold, links, code blocks, and all formatting for a seamless listening experience.
          </p>
          <Link href="/" className={styles.ctaButton}>
            Try Markdown to Speech Free →
          </Link>
        </section>

        <section className={styles.features}>
          <h2>What Gets Stripped?</h2>
          
          <div className={styles.strippingTable}>
            <div className={styles.strippingRow}>
              <div className={styles.before}>
                <span className={styles.label}>Markdown</span>
                <code># Heading 1</code>
              </div>
              <div className={styles.arrow}>→</div>
              <div className={styles.after}>
                <span className={styles.label}>Speech</span>
                <span>Heading 1</span>
              </div>
            </div>
            
            <div className={styles.strippingRow}>
              <div className={styles.before}>
                <span className={styles.label}>Markdown</span>
                <code>**bold text**</code>
              </div>
              <div className={styles.arrow}>→</div>
              <div className={styles.after}>
                <span className={styles.label}>Speech</span>
                <span>bold text</span>
              </div>
            </div>
            
            <div className={styles.strippingRow}>
              <div className={styles.before}>
                <span className={styles.label}>Markdown</span>
                <code>[link](url)</code>
              </div>
              <div className={styles.arrow}>→</div>
              <div className={styles.after}>
                <span className={styles.label}>Speech</span>
                <span>link</span>
              </div>
            </div>
            
            <div className={styles.strippingRow}>
              <div className={styles.before}>
                <span className={styles.label}>Markdown</span>
                <code>`inline code`</code>
              </div>
              <div className={styles.arrow}>→</div>
              <div className={styles.after}>
                <span className={styles.label}>Speech</span>
                <span>inline code</span>
              </div>
            </div>
            
            <div className={styles.strippingRow}>
              <div className={styles.before}>
                <span className={styles.label}>Markdown</span>
                <code>```code block```</code>
              </div>
              <div className={styles.arrow}>→</div>
              <div className={styles.after}>
                <span className={styles.label}>Speech</span>
                <span className={styles.removed}>(removed)</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.whyStrip}>
          <h2>Why Strip Markdown?</h2>
          
          <div className={styles.featureGrid}>
            <article className={styles.feature}>
              <h3>🎯 Clean Audio Output</h3>
              <p>
                Without stripping, TTS would read &quot;hashtag hashtag Introduction&quot; instead of 
                &quot;Introduction&quot;. Markdown syntax creates awkward, unnatural speech that&apos;s hard to follow.
              </p>
            </article>

            <article className={styles.feature}>
              <h3>💬 ChatGPT &amp; AI Content</h3>
              <p>
                AI assistants like ChatGPT and Claude output markdown-formatted responses. 
                Varterm strips the formatting so you can listen to AI content naturally.
              </p>
            </article>

            <article className={styles.feature}>
              <h3>📝 Documentation &amp; READMEs</h3>
              <p>
                GitHub READMEs, technical docs, and wikis use markdown extensively. 
                Convert them to audio without hearing formatting characters.
              </p>
            </article>

            <article className={styles.feature}>
              <h3>🚫 Skip Code Blocks</h3>
              <p>
                Code blocks are completely removed since listening to code syntax is rarely useful. 
                Focus on the explanatory text instead.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.supported}>
          <h2>Supported Markdown Elements</h2>
          <ul className={styles.elementList}>
            <li><code>#</code> Headers (h1-h6) — removed, text kept</li>
            <li><code>**bold**</code> and <code>__bold__</code> — markers removed</li>
            <li><code>*italic*</code> and <code>_italic_</code> — markers removed</li>
            <li><code>~~strikethrough~~</code> — markers removed</li>
            <li><code>[links](url)</code> — URL removed, link text kept</li>
            <li><code>![images](url)</code> — completely removed or alt text kept</li>
            <li><code>`inline code`</code> — backticks removed</li>
            <li><code>```code blocks```</code> — completely removed</li>
            <li><code>&gt;</code> Blockquotes — marker removed, text kept</li>
            <li><code>-</code> <code>*</code> <code>+</code> List markers — removed</li>
            <li><code>1.</code> Numbered lists — numbers removed</li>
            <li><code>---</code> Horizontal rules — removed</li>
            <li>HTML tags — removed</li>
          </ul>
        </section>

        <section className={styles.howTo}>
          <h2>How to Use</h2>
          <ol className={styles.steps}>
            <li>
              <span className={styles.stepNumber}>1</span>
              <div>
                <strong>Paste Markdown Content</strong>
                <p>Copy text from ChatGPT, GitHub, Notion, or any markdown source and paste it into Varterm.</p>
              </div>
            </li>
            <li>
              <span className={styles.stepNumber}>2</span>
              <div>
                <strong>Enable &quot;Strip Markdown&quot;</strong>
                <p>Check the &quot;Strip Markdown&quot; option below the voice selector to enable automatic formatting removal.</p>
              </div>
            </li>
            <li>
              <span className={styles.stepNumber}>3</span>
              <div>
                <strong>Listen to Clean Audio</strong>
                <p>Press play and enjoy natural-sounding speech without any markdown artifacts.</p>
              </div>
            </li>
          </ol>
        </section>

        <section className={styles.cta}>
          <h2>Ready to Convert Markdown to Speech?</h2>
          <p>No signup required. Completely free. Strip formatting automatically.</p>
          <Link href="/" className={styles.ctaButton}>
            Start Converting Markdown →
          </Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>
          <Link href="/">Varterm</Link> — Varterm TTS with markdown cleanup.
        </p>
      </footer>
    </div>
  );
}
