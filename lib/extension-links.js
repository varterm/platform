/**
 * Keep EDITOR_EXTENSION_VERSION aligned with extensions/vscode/package.json in varterm/extensions.
 * Used only for downloadable artifacts (GitHub Releases) linked from the marketing site.
 */
export const EDITOR_EXTENSION_VERSION = '0.1.13';

export const GITHUB_EXTENSIONS_REPO = 'https://github.com/varterm/extensions';

export const GITHUB_RELEASES_URL = `${GITHUB_EXTENSIONS_REPO}/releases`;

export const VSIX_DOWNLOAD_URL = `${GITHUB_RELEASES_URL}/download/v${EDITOR_EXTENSION_VERSION}/varterm-cursor-${EDITOR_EXTENSION_VERSION}.vsix`;
