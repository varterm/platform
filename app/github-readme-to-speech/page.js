import Link from 'next/link';
import Breadcrumbs from '../Breadcrumbs';
import styles from '../long-form-tts/page.module.css';

export const metadata = {
  title: 'Listen to GitHub READMEs',
  description:
    'Read GitHub READMEs aloud. Paste markdown, strip formatting, and listen with free neural voices — no signup.',
  alternates: { canonical: '/github-readme-to-speech' },
  openGraph: {
    title: 'Listen to GitHub READMEs',
    description: 'Turn README markdown into clean speech. Headers, links, and code blocks stripped.',
    url: '/github-readme-to-speech',
  },
};

export default function GithubReadmeToSpeechPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← Open the reader
        </Link>
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'GitHub READMEs', path: '/github-readme-to-speech' },
          ]}
        />
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Listen to GitHub READMEs</h1>
          <p className={styles.subtitle}>
            Copy a README, paste it into Varterm, and enable Strip Markdown. Badges, tables, and
            code fences drop out so you hear the actual project description.
          </p>
          <Link href="/" className={styles.ctaButton}>
            Read a README aloud →
          </Link>
        </section>

        <section className={styles.features}>
          <h2>How it fits</h2>
          <p>
            This is the same markdown cleanup as the{' '}
            <Link href="/markdown-to-speech">markdown to speech converter</Link>. Long contributing
            guides and RFCs use the <Link href="/long-form-tts">long-form TTS</Link> chunking path.
            In the editor, <Link href="/extensions/vscode">VS Code text to speech</Link> can read
            the file you already have open.
          </p>
        </section>
      </main>
    </div>
  );
}
