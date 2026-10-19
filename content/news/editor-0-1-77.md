---
title: Editor 0.1.77 — Windows, Linux, and a steadier voice
slug: editor-0-1-77
date: 2026-10-19
tags:
  - extensions
  - vscode
  - cursor
description: >-
  Cursor is on editor 0.1.77. Windows playback from 0.1.71 is the current
  behavior, Linux without ffmpeg gets an install hint, and the speech service
  retries a failed voice request.
excerpt: >-
  Open VSX is on 0.1.77. Windows plays, a missing Linux player is an install
  hint, and the speech service retries before a read fails.
---

**Varterm TTS 0.1.77** is the current editor build on [Open VSX](https://open-vsx.org/extension/Varterm/varterm-cursor), which is what Cursor installs. The `.vsix` is on [GitHub Release v0.1.77](https://github.com/varterm/extensions/releases/tag/v0.1.77). The [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Varterm.varterm-cursor) is still on **0.1.76**. This note covers what changed after [0.1.72](/news/editor-0-1-72).

- **Windows plays.** Builds through 0.1.62 refused to play and showed `Background playback currently uses macOS afplay`. Builds 0.1.63 through 0.1.70 started a player that produced no sound, because it waited for a duration that only arrives while the player's message loop is running. From **0.1.71** the loop runs until the clip ends, and a failed clip says why. Nothing extra to install.
- **Linux needs one MP3 player.** Varterm looks for `ffplay` (from ffmpeg), `mpv`, `mpg123`, VLC, or SoX on the machine where the extension is running. On a Cursor SSH or WSL host, that is the Linux machine, not the Mac in front of you. **0.1.77** tells you to install ffmpeg as an information message. Older builds showed the same sentence as a red error.
- **Pressing last reply too early explains itself.** If the chat has no finished reply yet, the editor says to stay on the tab until it finishes.
- **The speech service retries.** When Microsoft rejects the voice token or the socket closes before any audio, the request is tried again before the read fails. Cursor, Chrome, and the [web reader](/) all use this route, so no extension update is required for that retry.

Setup notes live on the [extensions page](/extensions#editors).
