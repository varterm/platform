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

/** Same baseline as `/extensions`; replace with listing URL when finalized. */
const CHROME_WEBSTORE_URL = 'https://chromewebstore.google.com/';

export const metadata = {
  title: 'How to install Varterm extensions',
  description:
    'Install Varterm in Cursor or VS Code, then Auto-read the agent window. Play, pause, stop, and jump from the status bar.',
  keywords: [
    'install cursor extension vsix',
    'vscode extension install vsix',
    'varterm chrome extension install',
    'varterm extensions',
  ],
  alternates: {
    canonical: '/install-extensions',
  },
  openGraph: {
    title: 'How to install Varterm extensions',
    description:
      'Install Cursor/VS Code and Chrome editions of Varterm with clear paths for packaged releases and local development.',
    url: 'https://varterm.com/install-extensions',
    type: 'article',
  },
};

export default function InstallExtensionsGuide() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/extensions" className={styles.backLink}>
          ← Extensions overview
        </Link>
      </header>

      <main>
        <section className={styles.hero}>
          <h1>How to install each Varterm extension</h1>
          <p>
            Varterm ships as editor extensions (same package targets Cursor and VS Code) and as a Chrome
            extension. Follow the surface you use—the commands and listening behavior align across installs.
          </p>
        </section>

        <nav className={styles.toc} aria-label="On this page">
          <h2>On this page</h2>
          <ul>
            <li>
              <a href="#cursor-vsix">Cursor — Extensions panel or .vsix</a>
            </li>
            <li>
              <a href="#vscode-marketplace-vsix">VS Code — Marketplace or .vsix</a>
            </li>
            <li>
              <a href="#chrome-web-store">Chrome — Web Store or unpacked (developers)</a>
            </li>
          </ul>
        </nav>

        <article className={styles.block} id="cursor-vsix">
          <h2>Cursor — Extensions panel or .vsix</h2>
          <p>
            Search <strong>Varterm TTS</strong> in Cursor Extensions. That listing comes from{' '}
            <a href={OPEN_VSX_EXTENSION_URL} target="_blank" rel="noreferrer">
              Open VSX
            </a>
            . Use a <code>.vsix</code> only if search misses it; the current file is{' '}
            <code>{EDITOR_EXTENSION_VERSION}</code> on{' '}
            <a href={GITHUB_RELEASES_URL} target="_blank" rel="noreferrer">
              GitHub Releases
            </a>
            .
          </p>
          <p className={styles.note}>
            If the hosted <code>.vsix</code> link returns <strong>404</strong>,{' '}
            <a href={VSCODE_PACKAGE_README_URL} target="_blank" rel="noreferrer">
              build from source
            </a>{' '}
            in <code>varterm/extensions</code> (Development section → <code>npm run package</code> inside{' '}
            <code>extensions/vscode</code>).
          </p>
          <div className={styles.inlineList}>
            <a
              href={OPEN_VSX_EXTENSION_URL}
              target="_blank"
              rel="noreferrer"
              className={styles.ctaPrimary}
            >
              Open VSX listing
            </a>
            <a href={VSIX_DOWNLOAD_URL} target="_blank" rel="noreferrer" className={styles.ctaSecondary}>
              Download varterm-cursor-{EDITOR_EXTENSION_VERSION}.vsix
            </a>
          </div>
          <h3>From Extensions</h3>
          <ol className={styles.steps}>
            <li>
              Open <strong>Extensions</strong> (<kbd className={styles.kbd}>Cmd+Shift+X</kbd> /{' '}
              <kbd className={styles.kbd}>Ctrl+Shift+X</kbd>).
            </li>
            <li>
              Search <strong>Varterm TTS</strong> and click <strong>Install</strong>.
            </li>
            <li>
              <strong>Reload</strong> if Cursor asks.
            </li>
            <li>
              Click <strong>Install</strong> (user), not Install Workspace Extension. Flip on{' '}
              <strong>Agent Auto-read</strong> — one install, every window, zero echo. Play, pause,
              stop, jump. Or run{' '}
              <code>Varterm: Read Clipboard Aloud</code> /{' '}
              <code>Varterm: Read Editor/Selection Aloud</code>.
            </li>
          </ol>
          <h3>From a .vsix file</h3>
          <ol className={styles.steps}>
            <li>
              Download the <code>.vsix</code> from the button above or from{' '}
              <a href={GITHUB_RELEASES_URL} target="_blank" rel="noreferrer">
                Releases
              </a>
              .
            </li>
            <li>
              Command Palette (<kbd className={styles.kbd}>Cmd+Shift+P</kbd> /{' '}
              <kbd className={styles.kbd}>Ctrl+Shift+P</kbd>) →{' '}
              <code>Extensions: Install from VSIX...</code> → choose the file → reload if asked.
            </li>
          </ol>
          <p>
            Store updates come through Extensions. A newer <code>.vsix</code> can be installed the same
            way if you pin a GitHub build.
          </p>
        </article>

        <article className={styles.block} id="vscode-marketplace-vsix">
          <h2>VS Code — Marketplace install or manual .vsix</h2>
          <p>
            On VS Code you can usually install straight from the Visual Studio Marketplace when the listing
            is available. Manual <code>.vsix</code> follows the identical steps as Cursor and is handy for
            betas or air-gapped machines.
          </p>
          <div className={styles.inlineList}>
            <a
              href={VSCODE_MARKETPLACE_URL}
              target="_blank"
              rel="noreferrer"
              className={styles.ctaPrimary}
            >
              VS Code Marketplace
            </a>
            <a href={VSIX_DOWNLOAD_URL} target="_blank" rel="noreferrer" className={styles.ctaSecondary}>
              Download .vsix
            </a>
            <a
              href={VSCODE_PACKAGE_README_URL}
              target="_blank"
              rel="noreferrer"
              className={styles.ctaSecondary}
            >
              Build .vsix from source
            </a>
          </div>
          <h3>From Marketplace</h3>
          <ol className={styles.steps}>
            <li>
              Open the listing (button above). Click <strong>Install</strong> and approve opening VS Code when
              the browser asks.
            </li>
            <li>
              After installation, reload if prompted.
            </li>
          </ol>
          <h3>From a .vsix file</h3>
          <ol className={styles.steps}>
            <li>
              Command Palette → <code>Extensions: Install from VSIX...</code> → pick the file → reload if
              needed.
            </li>
          </ol>
          <p>
            Troubleshooting overlaps with Cursor: confirmed package names and tags live in{' '}
            <a href={GITHUB_EXTENSIONS_REPO} target="_blank" rel="noreferrer">
              varterm/extensions
            </a>
            .
          </p>
        </article>

        <article className={styles.block} id="chrome-web-store">
          <h2>Chrome extension — Chrome Web Store (or unpacked)</h2>
          <p>
            The browser extension reads selection and pages in Chrome. Prefer the packaged listing unless you
            are developing or QA&apos;ing a local build. Until a single stable listing URL is finalized,{' '}
            use the Chrome Web Store home and search <strong>Varterm</strong>, or{' '}
            <Link href="/extensions#chrome">extensions hub → Chrome</Link> when we publish the direct listing
            link there.
          </p>
          <div className={styles.inlineList}>
            <a href={CHROME_WEBSTORE_URL} target="_blank" rel="noreferrer" className={styles.ctaPrimary}>
              Chrome Web Store
            </a>
            <Link href="/extensions#chrome" className={styles.ctaSecondary}>
              Extensions overview (Chrome)
            </Link>
          </div>
          <h3>Install from the Web Store</h3>
          <ol className={styles.steps}>
            <li>
              Open the <strong>Chrome Web Store</strong> listing and click <strong>Add to Chrome</strong>.
            </li>
            <li>
              Pin the extension (puzzle icon → pin) so the toolbar control is visible.
            </li>
            <li>
              On a page, <strong>select text</strong> and use the in-page controls or context menu commands
              (wording varies by version) for passages and markdown-heavy blocks.
            </li>
            <li>
              Grant any permission prompts Chrome shows for the sites where you want read-aloud—extensions can
              only act where the browser allows.
            </li>
          </ol>
          <h3>Unpacked install (contributors / QA)</h3>
          <p>
            Clone and build the Chrome target from{' '}
            <a href={GITHUB_EXTENSIONS_REPO} target="_blank" rel="noreferrer">
              varterm/extensions
            </a>{' '}
            per that repo&apos;s README, then load the folder that contains a valid{' '}
            <code>manifest.json</code> (often a <code>dist</code> or release output—not the whole monorepo
            root).
          </p>
          <ol className={styles.steps}>
            <li>
              In Chrome go to <code>chrome://extensions</code>.
            </li>
            <li>
              Turn on <strong>Developer mode</strong> (top right).
            </li>
            <li>
              Click <strong>Load unpacked</strong> and choose the built extension directory.
            </li>
            <li>
              After code changes, use <strong>Reload</strong> on the extension card to pick up new assets.
            </li>
          </ol>
          <p className={styles.note}>
            Unpacked installs are tied to your local folder; switching machines or wiping the checkout
            removes the loaded extension unless you repeat the steps or reinstall from the Web Store.
          </p>
        </article>

        <footer className={styles.footerLinks}>
          <p>
            <Link href="/extensions">All extension links and quick setup</Link>
            {' · '}
            <Link href="/">Open web app</Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
