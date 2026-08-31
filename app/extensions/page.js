import Link from 'next/link';
import Breadcrumbs from '../Breadcrumbs';
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
  title: 'Extensions',
  description:
    'Install Varterm TTS for Cursor, VS Code, and Chrome. Agent Auto-read speaks finished replies — one install, every window, zero echo.',
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
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Extensions', path: '/extensions' },
          ]}
        />
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1>Varterm Extensions</h1>
          <p>
            One install. Every window. Zero echo. <strong>Agent Auto-read</strong> speaks your
            agent&apos;s replies while you keep working.
          </p>
          <div className={styles.heroBadges}>
            <span className={styles.badge}>Agent Auto-read</span>
            <span className={styles.badge}>MIT licensed</span>
            <span className={styles.badge}>Editor + Browser + Web</span>
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
              Search <strong>Varterm TTS</strong> in Extensions and flip on{' '}
              <strong>Agent Auto-read</strong>. Send a prompt, go back to your file, and the reply
              reads itself when it lands — no parking on the chat panel. One install, every window,
              zero echo.
            </p>
            <p>
              Long answers split into parts, so you jump forward past the preamble or back to the
              line that mattered instead of scrolling the chat. Same engine handles whole files,
              RFCs, and multi-page docs — playback starts on part one while the rest generates.
              Editor, selection, and clipboard work the same way.
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
                click <strong>Install</strong> (user), not Install Workspace Extension → reload
                other Cursor windows.
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
                Click <strong>Agent Auto-read</strong> in the status bar. A finished reply plays in
                the focused window only — extra Cursor windows stay quiet. Use play/pause, stop,
                and jump. Play reads an editor selection if you have one.
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
              <Link href="/extensions/cursor">Cursor text to speech</Link>
            </li>
            <li>
              <Link href="/extensions/vscode">VS Code text to speech</Link>
            </li>
            <li>
              <Link href="/extensions/chrome">Chrome text to speech extension</Link>
            </li>
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
