import Link from 'next/link';
import styles from './page.module.css';
import {
  CHROME_WEB_STORE_URL,
  CHROME_ZIP_DOWNLOAD_URL,
  EDITOR_EXTENSION_VERSION,
  GITHUB_RELEASES_URL,
  OPEN_VSX_EXTENSION_URL,
  VSIX_DOWNLOAD_URL,
  VSCODE_MARKETPLACE_URL,
} from '../../lib/extension-links';

export const metadata = {
  title: 'Extensions | Varterm TTS',
  description:
    'Install Varterm TTS for Cursor, VS Code, and Chrome. Built for long-form content and markdown-friendly read aloud workflows.',
  keywords: [
    'varterm extension',
    'chrome text to speech extension',
    'vscode text to speech extension',
    'cursor text to speech extension',
    'long form text to speech',
    'markdown text to speech',
  ],
  alternates: {
    canonical: '/extensions',
  },
  openGraph: {
    title: 'Varterm Extensions',
    description:
      'Install Varterm TTS across Cursor, VS Code, and Chrome with long-form and markdown-friendly playback.',
  },
};

function CtaRow({ primaryHref, primaryLabel, secondaryHref, secondaryLabel }) {
  return (
    <div className={styles.ctaRow}>
      <a href={primaryHref} target="_blank" rel="noreferrer" className={styles.cta}>
        {primaryLabel}
      </a>
      <a href={secondaryHref} target="_blank" rel="noreferrer" className={styles.ctaSecondary}>
        {secondaryLabel}
      </a>
    </div>
  );
}

export default function ExtensionsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← Back to Varterm TTS
        </Link>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1>Varterm Extensions</h1>
          <p>
            Install once, keep the same workflow everywhere. Varterm is built for long-form
            content and markdown-heavy text across web, Cursor, VS Code, and Chrome. No signup
            required for free Edge voices.
          </p>
          <div className={styles.heroBadges}>
            <span className={styles.badge}>Long-form ready</span>
            <span className={styles.badge}>Markdown-friendly</span>
            <span className={styles.badge}>Web + Editor + Browser</span>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Choose Your Setup</h2>
          <p className={styles.sectionIntro}>
            Editor extension v{EDITOR_EXTENSION_VERSION}. Pick your editor or browser below.
          </p>
        </section>

        <section className={styles.grid}>
          <article className={styles.card}>
            <h2>Cursor</h2>
            <p>
              Cursor uses the Open VSX registry. Search for <strong>Varterm TTS</strong> in the
              Extensions panel, or open the listing once published.
            </p>
            <CtaRow
              primaryHref={OPEN_VSX_EXTENSION_URL}
              primaryLabel="Open in Open VSX"
              secondaryHref={VSIX_DOWNLOAD_URL}
              secondaryLabel="Download .vsix"
            />
            <ol>
              <li>
                Open Extensions: <kbd>Cmd+Shift+X</kbd> (Mac) or <kbd>Ctrl+Shift+X</kbd>{' '}
                (Windows/Linux).
              </li>
              <li>
                Search <strong>Varterm TTS</strong> and click <strong>Install</strong>.
              </li>
              <li>
                Open Command Palette (<kbd>Cmd+Shift+P</kbd> / <kbd>Ctrl+Shift+P</kbd>) and run{' '}
                <code>Varterm: Select Read-Aloud Voice</code>.
              </li>
              <li>
                Select text, then run <code>Varterm: Read Editor/Selection Aloud</code>. For
                agent output, copy to clipboard and run{' '}
                <code>Varterm: Read Clipboard Aloud</code>.
              </li>
            </ol>
            <p className={styles.note}>
              Default API: <code>https://www.varterm.com</code>. Run{' '}
              <code>Varterm: Connect</code> only if you use a custom server or token.
            </p>
          </article>

          <article className={styles.card}>
            <h2>VS Code</h2>
            <p>
              Install from the Visual Studio Marketplace, or use the same Open VSX listing as
              Cursor.
            </p>
            <CtaRow
              primaryHref={VSCODE_MARKETPLACE_URL}
              primaryLabel="Install from Marketplace"
              secondaryHref={OPEN_VSX_EXTENSION_URL}
              secondaryLabel="Open VSX listing"
            />
            <ol>
              <li>
                Click <strong>Install from Marketplace</strong> above, or search{' '}
                <strong>Varterm TTS</strong> in the Extensions view.
              </li>
              <li>Reload VS Code if prompted.</li>
              <li>
                Run <code>Varterm: Select Read-Aloud Voice</code>, then read selection or
                clipboard with the Varterm commands.
              </li>
            </ol>
          </article>

          <article className={styles.card}>
            <h2>Manual install (.vsix)</h2>
            <p>
              Use this if the store is not available yet, you are on an air-gapped machine, or
              you need a specific build from GitHub Releases.
            </p>
            <a href={VSIX_DOWNLOAD_URL} className={styles.cta}>
              Download varterm-cursor-{EDITOR_EXTENSION_VERSION}.vsix
            </a>
            <ol>
              <li>
                Download the <code>.vsix</code> file (requires a{' '}
                <a href={GITHUB_RELEASES_URL}>GitHub release</a> for v{EDITOR_EXTENSION_VERSION}
                ).
              </li>
              <li>
                In Cursor or VS Code: Command Palette →{' '}
                <code>Extensions: Install from VSIX...</code>
              </li>
              <li>Select the downloaded file and reload the window.</li>
              <li>Continue with voice selection and read-aloud commands above.</li>
            </ol>
          </article>

          <article className={styles.card} id="chrome">
            <h2>Chrome Extension</h2>
            <p>
              Read selected text or entire pages in the browser, including long articles and
              markdown-style AI output.
            </p>
            <CtaRow
              primaryHref={CHROME_WEB_STORE_URL}
              primaryLabel="Chrome Web Store"
              secondaryHref={CHROME_ZIP_DOWNLOAD_URL}
              secondaryLabel="Download .zip"
            />
            <ol>
              <li>Install from the Chrome Web Store when the listing is live.</li>
              <li>Pin the extension and select text to use the floating read button or context menu.</li>
              <li>
                For local testing: download the <code>.zip</code> from{' '}
                <a href={GITHUB_RELEASES_URL}>GitHub Releases</a>, then at{' '}
                <code>chrome://extensions</code> enable Developer mode →{' '}
                <strong>Load unpacked</strong> (extract the zip first).
              </li>
            </ol>
          </article>

          <article className={styles.card}>
            <h2>Web App</h2>
            <p>
              Use Varterm in the browser with no extension install—long-form docs, markdown
              cleanup, and multi-mode voices.
            </p>
            <Link href="/" className={styles.cta}>
              Open Web App
            </Link>
            <ol>
              <li>Paste text into the editor.</li>
              <li>Pick Cloud, Browser, or Offline voice mode.</li>
              <li>Press play and follow chunk progress for long text.</li>
            </ol>
          </article>
        </section>

        <section className={styles.links}>
          <h3>More Guides</h3>
          <ul>
            <li>
              <Link href="/long-form-tts">Long-form TTS guide</Link>
            </li>
            <li>
              <Link href="/markdown-to-speech">Markdown to speech guide</Link>
            </li>
            <li>
              <a href={GITHUB_RELEASES_URL}>Extension releases on GitHub</a>
            </li>
            <li>
              <Link href="/">Open the web app</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy policy</Link>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
