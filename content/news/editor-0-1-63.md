---
title: Editor 0.1.63 — Windows can hear playback
slug: editor-0-1-63
date: 2026-09-12
tags:
  - extensions
  - vscode
  - cursor
description: >-
  Selection, Auto-read, and voice preview now play on Windows. Linux uses
  ffplay when it is installed.
excerpt: >-
  A Windows user could generate audio but not hear it. Playback no longer
  depends on macOS afplay.
---

**Varterm TTS 0.1.63** is the current editor build. Install from [Open VSX](https://open-vsx.org/extension/Varterm/varterm-cursor) or the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Varterm.varterm-cursor). The `.vsix` is on [GitHub Release v0.1.63](https://github.com/varterm/extensions/releases/tag/v0.1.63).

- **Windows hears the read.** Highlight, Auto-read, and voice preview play in the background.
- **Linux** uses `ffplay` when it is on PATH.
- macOS still uses `afplay`.

Setup notes live on the [extensions page](/extensions#editors).
