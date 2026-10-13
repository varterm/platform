# editor-0-1-77-release-links — complete

Date: 2026-10-13
Owner: agent

## What shipped

- Editor **0.1.77**: expected empty states (no reply yet, Linux with no MP3
  player) show as information, not a red error, and are not filed to Sentry.
- GitHub release `v0.1.77` with `varterm-cursor-0.1.77.vsix`.
- Open VSX published.
- Site download links track 0.1.77.

## How to verify

- https://github.com/varterm/extensions/releases/download/v0.1.77/varterm-cursor-0.1.77.vsix
- Press last-reply on an empty chat: information toast, no Sentry event.
- Linux without ffplay/mpv/VLC/SoX: information toast naming ffmpeg, no Sentry.

## Follow-ups

- Upload the same VSIX to the VS Code Marketplace (still needs a hand upload).
- Speech synthesis failed / afplay -66681 / fetch failed stay in Sentry on purpose.
