# editor-0-1-55-release-links — complete

Date: 2026-09-10
Owner: agent

## What shipped

- Site download links and copy now track editor **0.1.55** (`lib/extension-links.js`).
- News post: `/news/editor-0-1-55`.
- `llms.txt` / `llms-full.txt` mention the listen queue and current build.

## How to verify

- `/extensions` download button is `varterm-cursor-0.1.55.vsix`.
- URL resolves after GitHub Release `v0.1.55` exists.

## Follow-ups

- Deploy varterm-plat.
- Confirm https://github.com/varterm/extensions/releases/tag/v0.1.55 has the VSIX.
- Marketplace still needs a manual VSIX upload if `VSCE_PAT` is unset.
