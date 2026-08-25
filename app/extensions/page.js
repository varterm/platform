import Link from 'next/link';
import styles from './page.module.css';
import {
  EDITOR_EXTENSION_VERSION,
  GITHUB_EXTENSIONS_REPO,
  GITHUB_RELEASES_URL,
  OPEN_VSX_EXTENSION_URL,
  VSCODE_MARKETPLACE_URL,
  VSCODE_PACKAGE_README_URL,
  VSIX_DOWNLOAD_URL,
} from '../../lib/extension-links';

const CHROME_EXTENSION_LINK = 'https://chromewebstore.google.com/';

export const metadata = {
  title: 'Extensions | Varterm TTS',
  description:
    'Install Varterm TTS for Cursor, VS Code, and Chrome. Auto-read the agent window, then play, pause, stop, or jump from the status bar.',
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
            content and markdown-heavy text across web, Cursor, VS Code, and Chrome.
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
            Pick the surface you use most. Core behavior stays consistent across all installs.
          </p>
        </section>

        <section className={styles.grid}>
          <article className={styles.card} id="editors">
            <h2>Cursor / VS Code Extension</h2>
            <p>
              Search <strong>Varterm TTS</strong> in the Extensions panel. It reads the editor,
              selection, clipboard, and the agent window. Turn on status-bar{' '}
              <strong>Auto-read</strong> to hear finished replies, then play, pause, stop, or jump.
            </p>
            <p className={styles.note}>
              Cursor installs from{' '}
              <a href={OPEN_VSX_EXTENSION_URL} target="_blank" rel="noreferrer">
                Open VSX
              </a>
              . VS Code can use the same search or the Marketplace. The{' '}
              <code>.vsix</code> is optional — use it only if search is empty or you want a pinned
              GitHub build.
            </p>
            <div className={styles.ctaStack}>
              <a href={OPEN_VSX_EXTENSION_URL} target="_blank" rel="noreferrer" className={styles.cta}>
                Open VSX listing
              </a>
              <a
                href={VSCODE_MARKETPLACE_URL}
                target="_blank"
                rel="noreferrer"
                className={styles.ctaSecondary}
              >
                VS Code Marketplace
              </a>
              <a href={VSIX_DOWNLOAD_URL} target="_blank" rel="noreferrer" className={styles.ctaSecondary}>
                Download varterm-cursor-{EDITOR_EXTENSION_VERSION}.vsix
              </a>
              <a href={GITHUB_RELEASES_URL} target="_blank" rel="noreferrer" className={styles.ctaSecondary}>
                GitHub Releases
              </a>
            </div>
            <p className={styles.directVsixHint}>
              Manual file is{' '}
              <a href={VSIX_DOWNLOAD_URL} target="_blank" rel="noreferrer">
                v{EDITOR_EXTENSION_VERSION}
              </a>{' '}
              from{' '}
              <a href={GITHUB_RELEASES_URL} target="_blank" rel="noreferrer">
                GitHub Releases
              </a>
              . To rebuild, see the README{' '}
              <a href={VSCODE_PACKAGE_README_URL} target="_blank" rel="noreferrer">
                Development
              </a>{' '}
              section in{' '}
              <a href={GITHUB_EXTENSIONS_REPO} target="_blank" rel="noreferrer">
                varterm/extensions
              </a>
              .
            </p>
            <ol>
              <li>
                <strong>Install:</strong> Extensions view → search <strong>Varterm TTS</strong> →
                Install → reload if asked.
              </li>
              <li>
                <strong>Optional .vsix:</strong> Command Palette →{' '}
                <code>Extensions: Install from VSIX...</code> → choose the package from GitHub
                Releases.
              </li>
              <li>
                Run <code>Varterm: Connect</code> only if you use a custom server or token.
              </li>
              <li>
                Click <strong>Auto-read</strong> in the status bar to play the agent window when a
                reply finishes. Use play/pause, stop, and jump back or forward. Play reads an
                editor selection if you have one.
              </li>
              <li>
                Run <code>Varterm: Read Clipboard Aloud</code> or{' '}
                <code>Varterm: Read Editor/Selection Aloud</code> for long-form docs and markdown
                files.
              </li>
            </ol>
          </article>

          <article className={styles.card} id="chrome">
            <h2>Chrome Extension</h2>
            <p>Read selected text or entire pages directly in your browser, including long-form articles and markdown-style AI outputs.</p>
            <a href={CHROME_EXTENSION_LINK} target="_blank" rel="noreferrer" className={styles.cta}>
              Install on Chrome
            </a>
            <ol>
              <li>Install extension and pin it to toolbar.</li>
              <li>Select text and use the floating button or context menu for long passages and markdown blocks.</li>
              <li>If testing locally: open `chrome://extensions` and use Load unpacked.</li>
            </ol>
          </article>

          <article className={styles.card}>
            <h2>Web App</h2>
            <p>Use Varterm instantly with no setup for long-form docs, markdown cleanup, and ChatGPT-ready playback.</p>
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
              <Link href="/install-extensions">How to install each extension type</Link>
            </li>
            <li>
              <Link href="/long-form-tts">Long-form TTS guide</Link>
            </li>
            <li>
              <Link href="/markdown-to-speech">Markdown to speech guide</Link>
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
