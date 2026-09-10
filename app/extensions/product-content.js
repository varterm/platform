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
      'Cursor text to speech: highlight to listen, Agent Auto-read, and a status-bar speed and voice menu. One install, every window, zero echo.',
    h1: 'Cursor Text to Speech',
    lede:
      'Install Varterm TTS in Cursor. Highlight text to hear it — nothing is copied. Flip on Agent Auto-read and finished replies play while you keep working. Change speed or voice from the status bar.',
    storeLabel: 'Open VSX listing',
    storeHref: OPEN_VSX_EXTENSION_URL,
    secondary: [
      { href: VSIX_DOWNLOAD_URL, label: `Download varterm-cursor-${EDITOR_EXTENSION_VERSION}.vsix` },
      { href: GITHUB_RELEASES_URL, label: 'GitHub Releases' },
    ],
    steps: [
      'Extensions view → search Varterm TTS → Install (user), then reload other Cursor windows.',
      'Highlight text and click the status bar icon, or right-click Read Selection Aloud. Nothing is copied.',
      'Click Agent Auto-read in the status bar. A finished reply plays in the focused window only.',
      'Use play, pause, stop, and jump. The 1× chip opens speed (0.75×–2×) and voice. Click the speaker on a voice to preview.',
      'Optional .vsix from GitHub Releases if search is empty or you want a pinned build.',
    ],
  },
  vscode: {
    path: '/extensions/vscode',
    title: 'VS Code Text to Speech',
    description:
      'VS Code text to speech: highlight to listen, jump through long files, and change speed or voice from the status bar — free, MIT licensed.',
    h1: 'VS Code Text to Speech',
    lede:
      'Search Varterm TTS in the VS Code Marketplace or Open VSX. Highlight text to hear it. Read the editor, a selection, or the clipboard without leaving the file.',
    storeLabel: 'VS Code Marketplace',
    storeHref: VSCODE_MARKETPLACE_URL,
    secondary: [
      { href: OPEN_VSX_EXTENSION_URL, label: 'Open VSX listing' },
      { href: VSIX_DOWNLOAD_URL, label: `Download varterm-cursor-${EDITOR_EXTENSION_VERSION}.vsix` },
    ],
    steps: [
      'Extensions view → search Varterm TTS → Install.',
      'Highlight text and click the status bar icon, or run Varterm: Read Selection Aloud. Nothing is copied.',
      'Use the 1× chip for speed (0.75×–2×) and voice. Long files split into parts so playback starts on part one.',
    ],
  },
  chrome: {
    path: '/extensions/chrome',
    title: 'Chrome Text to Speech Extension',
    description:
      'Read pages, video transcripts, and AI chats aloud in Chrome. Search a transcript, jump, change speed, and hear new replies as they arrive — no signup.',
    h1: 'Chrome Text to Speech Extension',
    lede:
      'Read a selection, a long page, or a video transcript in Chrome. Search the words, jump to a line, change speed, and optionally hear new AI chat replies as they finish.',
    storeLabel: 'Install on Chrome',
    storeHref: CHROME_WEBSTORE_URL,
    secondary: [],
    features: [
      'Read a selection or the whole page. Markdown is stripped so headings and code fences do not get spoken as punctuation.',
      'On a YouTube video with captions, open the transcript and listen. Search the whole transcript, click a line to hear from there, or click a timestamp to jump the video.',
      'Jump back and ahead from the popup or the reader panel. Speed chips run from 0.75× to 2×; changing speed re-reads the current part.',
      'Optionally auto-read assistant replies on the AI chats you grant. Off until you turn a site on; Chrome asks then, not at install. Existing replies stay quiet.',
      'Read a selection with Alt+Shift+R. Chrome uses Ctrl+Shift+R to reload the page.',
    ],
    steps: [
      'Install the extension and pin it to the toolbar.',
      'Select text and use the floating button, the context menu, or Alt+Shift+R.',
      'On a video with captions, press Read Video Transcript. Type in the panel to search, then click a timestamp to move the video.',
      'To hear new chat replies as they land, tick that site under Read AI replies and approve Chrome’s prompt. Reload the tab once.',
      'For local testing, open chrome://extensions and use Load unpacked.',
    ],
  },
};
