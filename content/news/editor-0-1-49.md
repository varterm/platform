---
title: Editor 0.1.49 — per-window Auto-read and Play keeps the highlight
slug: editor-0-1-49
date: 2026-09-10
tags:
  - extensions
  - vscode
  - cursor
description: >-
  Auto-read stays on the window you toggle. Play reads the last file highlight. Chat still needs copy or Auto-read.
excerpt: >-
  Turning Auto-read on no longer flips every Cursor window. Play remembers the last file highlight. Agent chat still cannot be read from a selection.
---

**Varterm TTS 0.1.49** is the current editor build. Install from [Open VSX](https://open-vsx.org/extension/Varterm/varterm-cursor) or the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Varterm.varterm-cursor). The `.vsix` is on [GitHub Release v0.1.49](https://github.com/varterm/extensions/releases/tag/v0.1.49).

- **Auto-read is per window.** The status bar no longer writes a user setting, so other windows keep their own on/off.
- **Play keeps the last file highlight.** Clicking the status bar still reads the text you marked in a file.
- **Chat and agent panels** are not editor text. Copy, then use the clipboard icon — or turn on Auto-read for a finished reply.

Setup notes live on the [extensions page](/extensions#editors).
