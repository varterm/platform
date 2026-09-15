# editor-0-1-64-release-links — complete

Date: 2026-09-15
Owner: agent

## What shipped

- Site download links track editor **0.1.64** (`lib/extension-links.js`).
- News post: `/news/editor-0-1-64`.
- `/api/edge-tts` answers 422 with a reason for text it cannot voice, and lists
  66 voices across 31 locales rather than 10 English ones.
- Store long description (`extensions/vscode/README.md`) names the 29 languages
  and moves the Linux player requirement into Install, where a Linux user looks.

## How to verify

- `/extensions` download is `varterm-cursor-0.1.64.vsix`, and the URL resolves
  because GitHub Release `v0.1.64` exists.
- `GET /api/edge-tts` returns 66 voices across 31 locales, no duplicates.
- `POST /api/edge-tts` with `---` returns 422, not 500.
- `POST /api/edge-tts` with Chinese text and `en-US-AriaNeural` returns 422
  naming `zh-CN-XiaoxiaoNeural`; the same text with that voice returns audio.

## Still open

- VS Code Marketplace is on 0.1.62 and needs a real `VSCE_PAT`; see
  `~/varterm-marketplace-publish.md`. Open VSX is on 0.1.64.
- The news post links to the Marketplace listing, so it reads as current only
  once that publish lands.
- The store long description was improved after 0.1.64 was packaged, so it is
  not in the shipped VSIX and rides 0.1.65. Publish the existing artifact to the
  Marketplace rather than repackaging, or 0.1.64 exists as three different
  builds.
- Greek is detected as a script but has no catalog voice, so that mismatch names
  `el-GR-AthinaNeural`, which synthesises but is reachable only through
  `vartermCursor.readAloudVoice` rather than the picker. Arabic had the same
  problem and now suggests `ar-EG-SalmaNeural`, which is in the catalog.
