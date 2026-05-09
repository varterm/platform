import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
  title: 'Privacy Policy | Varterm TTS',
  description:
    'Privacy policy for Varterm TTS web app and Chrome extension, including data handling and permissions usage.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Varterm Privacy Policy',
    description:
      'How Varterm handles text, settings, and audio generation for web and extension text-to-speech workflows.',
  },
};

export default function PrivacyPage() {
  const effectiveDate = 'May 8, 2026';

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← Back to Varterm
        </Link>
      </header>

      <main className={styles.main}>
        <h1>Privacy Policy</h1>
        <p className={styles.effectiveDate}>Effective date: {effectiveDate}</p>

        <section>
          <h2>Overview</h2>
          <p>
            Varterm provides text-to-speech features across our web app and browser/editor
            extensions. This policy explains what data is processed, why it is used, and
            what choices you have.
          </p>
        </section>

        <section>
          <h2>What We Process</h2>
          <ul>
            <li>Text you choose to read aloud (selected text, pasted text, or page content).</li>
            <li>Basic extension/app settings (voice, speed, and markdown preference).</li>
            <li>Operational request data needed to deliver audio responses.</li>
          </ul>
        </section>

        <section>
          <h2>How Data Is Used</h2>
          <ul>
            <li>To generate audio output for text-to-speech playback.</li>
            <li>To apply your saved settings consistently across sessions.</li>
            <li>To operate and troubleshoot service reliability.</li>
          </ul>
          <p>
            We do not sell personal data and do not use your content for unrelated advertising
            purposes.
          </p>
        </section>

        <section>
          <h2>Chrome Extension Permissions</h2>
          <ul>
            <li>
              <strong>activeTab:</strong> Used after user action to access the current tab text
              for read-aloud.
            </li>
            <li>
              <strong>contextMenus:</strong> Adds right-click actions for reading selection or
              page content.
            </li>
            <li>
              <strong>scripting:</strong> Injects local extension scripts to read selected/page
              text and show controls.
            </li>
            <li>
              <strong>storage:</strong> Saves preferences like voice, speed, and markdown mode.
            </li>
            <li>
              <strong>Host permissions:</strong> Allows requests to Varterm API endpoints for
              speech generation.
            </li>
          </ul>
        </section>

        <section>
          <h2>Remote Code Statement</h2>
          <p>
            The Chrome extension does not execute remotely hosted code. Network requests are used
            only to send text for speech generation and receive audio output.
          </p>
        </section>

        <section>
          <h2>Data Retention</h2>
          <p>
            We retain data only as long as needed to provide the service, secure operations, and
            comply with legal obligations.
          </p>
        </section>

        <section>
          <h2>Your Choices</h2>
          <ul>
            <li>You can disable or uninstall the extension at any time.</li>
            <li>You can clear browser extension data and stored settings in Chrome.</li>
            <li>You can choose browser voice mode for local playback when available.</li>
          </ul>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            For privacy questions, contact us at{' '}
            <a href="mailto:support@varterm.com">support@varterm.com</a>.
          </p>
        </section>
      </main>
    </div>
  );
}
