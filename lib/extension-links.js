/**
 * Keep EDITOR_EXTENSION_VERSION aligned with extensions/vscode/package.json in varterm/extensions.
 */
export const EDITOR_EXTENSION_VERSION = '0.1.14';

export const GITHUB_EXTENSIONS_REPO = 'https://github.com/varterm/extensions';

export const GITHUB_RELEASES_URL = `${GITHUB_EXTENSIONS_REPO}/releases`;

/**
 * Stable URL pattern once maintainers attach `varterm-cursor-{{version}}.vsix`
 * to a GitHub Release tagged `v{{version}}` in varterm/extensions.
 * Today that repo often has tags/source only — Releases may still be empty; see README package flow.
 */
export const VSIX_DOWNLOAD_URL = `${GITHUB_RELEASES_URL}/download/v${EDITOR_EXTENSION_VERSION}/varterm-cursor-${EDITOR_EXTENSION_VERSION}.vsix`;

/** Works today: README “Development” explains `npm run package` → local .vsix. */
export const VSCODE_PACKAGE_README_URL = `${GITHUB_EXTENSIONS_REPO}/blob/main/extensions/vscode/README.md#development`;
