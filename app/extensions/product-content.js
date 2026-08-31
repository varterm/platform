import {
  EDITOR_EXTENSION_VERSION,
  GITHUB_RELEASES_URL,
  OPEN_VSX_EXTENSION_URL,
  VSCODE_MARKETPLACE_URL,
  VSIX_DOWNLOAD_URL,
} from '../../lib/extension-links';

const CHROME_WEBSTORE_URL = 'https://chromewebstore.google.com/';

export const EXTENSION_PRODUCTS = {
  cursor: {
    path: '/extensions/cursor',
    title: 'Cursor Text to Speech',
    description:
      'Cursor text to speech with Agent Auto-read. Finished agent replies play while you keep working — one install, every window, zero echo.',
    h1: 'Cursor Text to Speech',
    lede:
      'Install Varterm TTS in Cursor and flip on Agent Auto-read. Send a prompt, go back to your file, and the reply reads itself when it lands.',
    storeLabel: 'Open VSX listing',
    storeHref: OPEN_VSX_EXTENSION_URL,
    secondary: [
      { href: VSIX_DOWNLOAD_URL, label: `Download varterm-cursor-${EDITOR_EXTENSION_VERSION}.vsix` },
      { href: GITHUB_RELEASES_URL, label: 'GitHub Releases' },
    ],
    steps: [
      'Extensions view → search Varterm TTS → Install (user), then reload other Cursor windows.',
      'Click Agent Auto-read in the status bar. A finished reply plays in the focused window only.',
      'Use play, pause, stop, and jump. Play reads an editor selection if you have one.',
      'Optional .vsix from GitHub Releases if search is empty or you want a pinned build.',
    ],
  },
  vscode: {
    path: '/extensions/vscode',
    title: 'VS Code Text to Speech',
    description:
      'VS Code text to speech and read aloud. Listen to selections, docs, and long files with Varterm TTS — free, MIT licensed.',
    h1: 'VS Code Text to Speech',
    lede:
      'Search Varterm TTS in the VS Code Marketplace or Open VSX. Read the editor, a selection, or the clipboard aloud without leaving the file.',
    storeLabel: 'VS Code Marketplace',
    storeHref: VSCODE_MARKETPLACE_URL,
    secondary: [
      { href: OPEN_VSX_EXTENSION_URL, label: 'Open VSX listing' },
      { href: VSIX_DOWNLOAD_URL, label: `Download varterm-cursor-${EDITOR_EXTENSION_VERSION}.vsix` },
    ],
    steps: [
      'Extensions view → search Varterm TTS → Install.',
      'Run Varterm: Read Editor/Selection Aloud or Varterm: Read Clipboard Aloud.',
      'Long files split into parts so playback starts on part one while the rest generates.',
    ],
  },
  chrome: {
    path: '/extensions/chrome',
    title: 'Chrome Text to Speech Extension',
    description:
      'Chrome read aloud extension for selected text and long pages. Varterm TTS strips markdown and plays naturally — no signup.',
    h1: 'Chrome Text to Speech Extension',
    lede:
      'Read selected text or entire pages in Chrome, including long-form articles and markdown-style AI output.',
    storeLabel: 'Install on Chrome',
    storeHref: CHROME_WEBSTORE_URL,
    secondary: [],
    steps: [
      'Install the extension and pin it to the toolbar.',
      'Select text and use the floating button or context menu.',
      'For local testing, open chrome://extensions and use Load unpacked.',
    ],
  },
};
