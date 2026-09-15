# linux-audio-player-fallback — complete

Date: 2026-09-14
Owner: agent

## What shipped

Sentry `02484e4252164706994b3e899d925a04` (editor 0.1.63, Linux, Antigravity
IDE) reported `spawn ffplay ENOENT`. The extension hardcoded `ffplay` on Linux
with no availability check and no fallback, so any machine without ffmpeg — most
default installs — got a raw ENOENT and no sound.

- `extensions/vscode/src/host-player.ts` (new): searches `PATH` for `ffplay`,
  `mpv`, `mpg123`, `mpg321`, `cvlc`, `gst-play-1.0`, then `play` (SoX), checking
  the executable bit rather than mere existence. Resolved once per session.
- If none is present the read fails with a message naming what to install,
  raised **before** synthesis so the user is not made to wait for audio that
  cannot be played. Voice previews stay silent and log instead of interrupting.
- Both `spawnHostPlayer` call sites now catch, so a missing player cannot throw
  out of an event listener as an unhandled rejection.
- `plugins/claude-code/scripts/lib/speech.mjs`: same class of bug. `aplay` and
  `paplay` were in the list but neither reliably decodes MP3 — `aplay` handles
  WAV and raw only, `paplay` only gained MP3 in libsndfile 1.1.0. On a machine
  with neither ffplay nor mpv they were selected and then failed. Both removed,
  and the MP3-capable players added.
- `extensions/vscode/tests/host-player.test.mjs` (new): 33 assertions built on
  real temp directories of fake executables, so the `PATH` walk and the
  executable-bit check are exercised rather than mocked.
- Extension README now states the Linux requirement and the alternatives.

## How to verify

- `cd extensions/vscode && npm test` — 82 assertions pass across both suites.
- A non-executable `ffplay` on `PATH` is skipped in favour of `mpv`.
- With no player on `PATH`, the read reports what to install and never spawns.
- `ffplay -nodisp -autoexit -loglevel quiet` on a real 3.1s clip exits in 3.5s,
  matching `afplay`, so chunked playback has no gap between parts.
- Claude Code plugin and the five Chrome suites still pass.

## Follow-ups

- Shipping as editor 0.1.64, alongside the `no-audio-generated-fix` work.
- The report came from **Antigravity IDE 1.107.0**, not Cursor. The extension is
  being installed on other VS Code forks, so the Cursor-specific agent auto-read
  hook probably does nothing there while manual reads work. Worth deciding
  whether to support that surface or say plainly that it is Cursor-only.
- `telemetry.ts` still skips 'Background playback currently uses macOS afplay',
  a message no longer produced anywhere. Harmless, but stale.
- Linux users with no player still generate a Sentry event per attempt. Left
  reported on purpose: it is the only signal of how many are blocked.
