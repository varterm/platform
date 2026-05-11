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
          Need help with Varterm TTS? Send a message using the support form below.
        </p>

        <section>
          <h2>Contact Form</h2>
          <form
            className={styles.contactForm}
            action="https://formspree.io/f/mojrpewv"
            method="POST"
          >
            <label>
              Type
              <select name="type" defaultValue="general">
                <option value="general">General</option>
                <option value="bug">Bug report</option>
                <option value="feature">Feature request</option>
              </select>
            </label>
            <label>
              Email (optional)
              <input type="email" name="email" placeholder="you@example.com" />
            </label>
            <label>
              Message
              <textarea name="message" rows={5} required placeholder="How can we help?" />
            </label>
            <input type="hidden" name="source" value="varterm-support-page" />
            <button type="submit">Send</button>
          </form>
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
              <a href="https://github.com/varterm/extensions/issues" target="_blank" rel="noreferrer">
                Report an issue on GitHub
              </a>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
