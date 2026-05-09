import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
  title: 'Support | Varterm TTS',
  description: 'Get help for Varterm TTS web app and Chrome extension.',
  alternates: {
    canonical: '/support',
  },
};

export default function SupportPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← Back to Varterm
        </Link>
      </header>

      <main className={styles.main}>
        <h1>Support</h1>
        <p className={styles.intro}>
          Need help with Varterm TTS? Use the links below or contact us directly.
        </p>

        <section>
          <h2>Contact</h2>
          <p>
            Email: <a href="mailto:support@varterm.com">support@varterm.com</a>
          </p>
        </section>

        <section>
          <h2>Helpful Links</h2>
          <ul>
            <li>
              <Link href="/extensions">Extension setup guide</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy policy</Link>
            </li>
            <li>
              <a href="https://github.com/cntrlne/varterm-vscode/issues" target="_blank" rel="noreferrer">
                Report an issue on GitHub
              </a>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
