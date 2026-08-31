import Link from 'next/link';
import Breadcrumbs from '../Breadcrumbs';
import styles from './page.module.css';

export const metadata = {
  title: 'Privacy Policy',
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
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Privacy', path: '/privacy' },
          ]}
        />
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
            <li>Basic analytics data about visits and feature usage trends.</li>
            <li>Optional feedback details you submit (message, optional email).</li>
            <li>Operational request data needed to deliver audio responses.</li>
          </ul>
        </section>

        <section>
          <h2>Offline Voices</h2>
          <p>
            The web reader offers an offline voice option. When you select it, speech is
            synthesized by Piper inside your browser and the text you paste never leaves your
            device. The first time you use a given offline voice, the browser downloads that
            voice model (about 63MB) from Hugging Face and caches it locally; the download
            request reveals your IP address and which voice you chose to Hugging Face, but not
            your text. The speech runtime itself is served from varterm.com. You can delete
            cached voice models at any time with the &quot;Remove downloaded&quot; control next
            to the voice list.
          </p>
        </section>

        <section>
          <h2>Third Parties</h2>
          <ul>
            <li>
              <strong>Microsoft:</strong> cloud voices are synthesized by the Microsoft Edge
              neural speech service, so the text you submit is sent there to produce audio.
            </li>
            <li>
              <strong>Google Analytics and Google Fonts:</strong> page-visit measurement and web
              fonts. These receive request metadata such as IP address and user agent. They do
              not receive the text you submit.
            </li>
            <li>
              <strong>Vercel:</strong> hosting, so all requests to this site transit their
              infrastructure.
            </li>
            <li>
              <strong>Hugging Face:</strong> only when you download an offline voice model.
            </li>
            <li>
              <strong>Formspree:</strong> only if you submit the feedback or support form.
            </li>
            <li>
              <strong>Stripe:</strong> only if you choose to donate; payment happens on their
              site.
            </li>
            <li>
              <strong>ElevenLabs and Anthropic:</strong> used by the premium API and the
              extension document question feature, not by the web reader.
            </li>
          </ul>
        </section>

        <section>
          <h2>How Data Is Used</h2>
          <ul>
            <li>To generate audio output for text-to-speech playback.</li>
            <li>To apply your saved settings consistently across sessions.</li>
            <li>To understand aggregate product usage and improve reliability.</li>
            <li>To operate and troubleshoot service reliability.</li>
          </ul>
          <p>
            We do not sell personal data, do not use your content for unrelated advertising
            purposes, and do not use the text you submit to train models.
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
            For privacy questions, use the <Link href="/support">support form</Link>.
          </p>
        </section>
      </main>
    </div>
  );
}
