# editor-0-1-76-release-links — complete

Date: 2026-10-13
Owner: agent

## What shipped

- Editor **0.1.76**: pressing last-reply before a chat has finished is no
  longer filed as a Sentry error. The toast still explains to wait.
  Sentry `b03370ea1c5d47f5b716f89d77b7c351` was that toast.
- GitHub release `v0.1.76` with `varterm-cursor-0.1.76.vsix`.
- Open VSX published (scan may hold it inactive for a few minutes).
- Site download links track 0.1.76 (`lib/extension-links.js`).

## How to verify

- `https://github.com/varterm/extensions/releases/download/v0.1.76/varterm-cursor-0.1.76.vsix` is 200.
- Open VSX `/api/Varterm/varterm-cursor` reports `0.1.76` after the scan.
- The last-reply toast still appears; it should not create a new Sentry issue
  from this build.

## Follow-ups

- VS Code Marketplace is still on 0.1.66 (`VSCE_PAT` missing). Upload
  `varterm-cursor-0.1.76.vsix` by hand at
  https://marketplace.visualstudio.com/manage/publishers/varterm
- Uncommitted speaker-sharing work in the extensions repo was stashed as
  `wip around 0.1.76` and was not part of this release.
