import Link from 'next/link';
import Breadcrumbs from '../Breadcrumbs';
import styles from '../long-form-tts/page.module.css';

export const metadata = {
  title: 'ChatGPT to Speech',
  description:
    'Listen to ChatGPT answers aloud. Paste AI output, strip markdown, and play natural speech — free, no signup.',
  alternates: { canonical: '/chatgpt-to-speech' },
  openGraph: {
    title: 'ChatGPT to Speech',
    description:
      'Turn ChatGPT and other AI answers into clean audio. Markdown stripped, long replies chunked.',
    url: '/chatgpt-to-speech',
  },
};

export default function ChatGptToSpeechPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← Open the reader
        </Link>
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'ChatGPT to speech', path: '/chatgpt-to-speech' },
          ]}
        />
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>ChatGPT to Speech</h1>
          <p className={styles.subtitle}>
            Paste a ChatGPT answer, strip the markdown, and listen. Long replies split into parts so
            playback starts while the rest generates.
          </p>
          <Link href="/" className={styles.ctaButton}>
            Listen to a ChatGPT answer →
          </Link>
        </section>

        <section className={styles.features}>
          <h2>Why paste AI output here</h2>
          <div className={styles.featureGrid}>
            <article className={styles.feature}>
              <h3>Markdown cleanup</h3>
              <p>
                Headings, bold, links, and code fences do not belong in a voice. Enable Strip
                Markdown — see the{' '}
                <Link href="/markdown-to-speech">markdown to speech guide</Link>.
              </p>
            </article>
            <article className={styles.feature}>
              <h3>Long answers</h3>
              <p>
                Multi-page replies are chunked. That is the same pipeline as the{' '}
                <Link href="/long-form-tts">long-form TTS guide</Link>.
              </p>
            </article>
            <article className={styles.feature}>
              <h3>In Cursor</h3>
              <p>
                Skip the paste step: Agent Auto-read speaks finished replies in the editor.{' '}
                <Link href="/extensions/cursor">Cursor text to speech extension</Link>.
              </p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
