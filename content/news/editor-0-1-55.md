---
title: Editor 0.1.55 — listen queue and Auto-read stays in its window
slug: editor-0-1-55
date: 2026-09-10
tags:
  - extensions
  - vscode
  - cursor
description: >-
  A new agent reply waits in the status-bar queue. Auto-read no longer steals
  another window’s speaker. Plans read from the file behind the view.
excerpt: >-
  Finished replies queue instead of cutting you off. Auto-read waits if another
  Cursor window is already talking. Only Play takes the speaker.
---

**Varterm TTS 0.1.55** is the current editor build. Install from [Open VSX](https://open-vsx.org/extension/Varterm/varterm-cursor) or the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Varterm.varterm-cursor). The `.vsix` is on [GitHub Release v0.1.55](https://github.com/varterm/extensions/releases/tag/v0.1.55).

- **Listen queue.** A finished reply waits instead of cutting off what you are hearing. A list icon shows how many are waiting; click it to play the next item or resume the previous one.
- **Auto-read stays in its window.** If another Cursor window is already playing, Auto-read queues. Only **Play** takes the speaker.
- **Plans.** The selection button reads the markdown file behind a Cursor plan view (`~/.cursor/plans` or `.cursor/plans`). Markdown markup is stripped before speech.
- **Chat and agent panels** are still not editor text. Copy, then use the clipboard icon — or turn on Auto-read for a finished reply.

Setup notes live on the [extensions page](/extensions#editors).
