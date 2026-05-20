import Link from 'next/link';
import styles from './page.module.css';
import {
  EDITOR_EXTENSION_VERSION,
  GITHUB_RELEASES_URL,
  VSCODE_PACKAGE_README_URL,
  VSIX_DOWNLOAD_URL,
} from '../../lib/extension-links';

const VSCODE_EXTENSION_LINK = 'https://marketplace.visualstudio.com/items?itemName=varterm.varterm-cursor';
const CHROME_EXTENSION_LINK = 'https://chromewebstore.google.com/';

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
          <article className={styles.card}>
            <h2>Cursor / VS Code Extension</h2>
            <p>
              Read editor selection, clipboard, and agent output aloud. Great for long files,
              docs, and markdown-heavy responses.
            </p>
            <p className={styles.note}>
              Cursor often cannot pull from the VS Code Marketplace while the listing is still
              pending. The extensions repo{' '}
              <a href={GITHUB_RELEASES_URL} target="_blank" rel="noreferrer">
                GitHub Releases
              </a>{' '}
              page will host pre-built <code>.vsix</code> files ({EDITOR_EXTENSION_VERSION}) as soon
              as the first release is published. Until then, package a <code>.vsix</code> locally (
              <a href={VSCODE_PACKAGE_README_URL} target="_blank" rel="noreferrer">
                build steps
              </a>
              ).
            </p>
            <div className={styles.ctaStack}>
              <a href={VSCODE_PACKAGE_README_URL} target="_blank" rel="noreferrer" className={styles.cta}>
                Build .vsix from source ({EDITOR_EXTENSION_VERSION})
              </a>
              <a href={GITHUB_RELEASES_URL} target="_blank" rel="noreferrer" className={styles.ctaSecondary}>
                GitHub Releases
              </a>
              <a
                href={VSCODE_EXTENSION_LINK}
                target="_blank"
                rel="noreferrer"
                className={styles.ctaSecondary}
              >
                VS Code Marketplace
              </a>
            </div>
            <p className={styles.directVsixHint}>
              After Release <code>v{EDITOR_EXTENSION_VERSION}</code> ships with attachable assets,{' '}
              <a href={VSIX_DOWNLOAD_URL} target="_blank" rel="noreferrer">
                direct .vsix download
              </a>{' '}
              will resolve here instead of returning 404.
            </p>
            <ol>
              <li>
                <strong>Get a .vsix:</strong>{' '}
                <a href={VSCODE_PACKAGE_README_URL} target="_blank" rel="noreferrer">
                  Open the README “Development” section
                </a>
                : from the cloned repo run <code>npm install</code> and{' '}
                <code>npm run package</code>
                {' '}inside <code>extensions/vscode</code> to emit the packaged file. Published{' '}
                <code>.vsix</code> downloads will eventually live on{' '}
                <a href={GITHUB_RELEASES_URL} target="_blank" rel="noreferrer">
                  GitHub Releases
                </a>
                .
              </li>
              <li>
                <strong>Install in Cursor:</strong> Command Palette (<kbd>Cmd+Shift+P</kbd> /{' '}
                <kbd>Ctrl+Shift+P</kbd>) →{' '}
                <code>Extensions: Install from VSIX...</code> → choose the package → reload if
                prompted.
              </li>
              <li>
                <strong>VS Code:</strong> Prefer the Marketplace when the listing is live;{' '}
                <code>.vsix</code> install uses the same command as Cursor.
              </li>
              <li>
                Run <code>Varterm: Connect</code> only if you use a custom server or token.
              </li>
              <li>
                Run <code>Varterm: Read Clipboard Aloud</code> or{' '}
                <code>Varterm: Read Editor/Selection Aloud</code> for long-form docs and markdown
                files.
              </li>
            </ol>
          </article>

          <article className={styles.card}>
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
