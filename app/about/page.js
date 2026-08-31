import Link from 'next/link';
import Breadcrumbs from '../Breadcrumbs';
import styles from '../long-form-tts/page.module.css';

export const metadata = {
  title: 'About',
  description:
    'Varterm TTS is a free, privacy-conscious text to speech reader for long-form docs, markdown, and editor workflows. No signup.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Varterm TTS',
    description:
      'Who builds Varterm TTS and why the reader stays free, local-optional, and open on GitHub.',
    url: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← Back to Varterm TTS
        </Link>
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]}
        />
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>About Varterm TTS</h1>
          <p className={styles.subtitle}>
            Varterm is a free text to speech reader for long documents, markdown-heavy AI output,
            and editor workflows. No account. No paywall on the voices that already work.
          </p>
        </section>

        <section className={styles.features}>
          <h2>What we build</h2>
          <p>
            The web reader at{' '}
            <Link href="/">varterm.com</Link> splits long text into parts and starts playback while
            the rest generates. The same engine powers{' '}
            <Link href="/extensions/cursor">Cursor</Link>,{' '}
            <Link href="/extensions/vscode">VS Code</Link>, and{' '}
            <Link href="/extensions/chrome">Chrome</Link> extensions — including Agent Auto-read for
            finished Cursor replies.
          </p>
          <p>
            Source for the editor and browser extensions is MIT licensed on{' '}
            <a href="https://github.com/varterm/extensions">github.com/varterm/extensions</a>.
          </p>
        </section>

        <section className={styles.features}>
          <h2>Privacy</h2>
          <p>
            There is no user account. What you paste is sent to the voice engine you pick, comes
            back as audio, and is not stored as a reading history. Offline Piper voices run in the
            browser after an explicit model download. Details are on the{' '}
            <Link href="/privacy">privacy policy</Link>.
          </p>
        </section>

        <section className={styles.cta}>
          <h2>Get in touch</h2>
          <p>
            Product questions go through <Link href="/support">support</Link>. Shipping notes live
            on the <Link href="/news">news</Link> page.
          </p>
        </section>
      </main>
    </div>
  );
}
