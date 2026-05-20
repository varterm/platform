/** Keep in sync with extensions/vscode/package.json version in varterm/extensions. */
export const EDITOR_EXTENSION_VERSION = '0.1.13';

export const OPEN_VSX_EXTENSION_URL =
  'https://open-vsx.org/extension/varterm/varterm-cursor';

export const VSCODE_MARKETPLACE_URL =
  'https://marketplace.visualstudio.com/items?itemName=varterm.varterm-cursor';

export const GITHUB_EXTENSIONS_REPO = 'https://github.com/varterm/extensions';

export const GITHUB_RELEASES_URL = `${GITHUB_EXTENSIONS_REPO}/releases`;

export const VSIX_DOWNLOAD_URL = `${GITHUB_RELEASES_URL}/download/v${EDITOR_EXTENSION_VERSION}/varterm-cursor-${EDITOR_EXTENSION_VERSION}.vsix`;

export const CHROME_ZIP_DOWNLOAD_URL = `${GITHUB_RELEASES_URL}/download/v${EDITOR_EXTENSION_VERSION}/varterm-tts-chrome.zip`;

/** Replace when Chrome Web Store listing is live. */
export const CHROME_WEB_STORE_URL = 'https://chromewebstore.google.com/';
