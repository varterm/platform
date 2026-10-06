---
title: Editor 0.1.66 — one queue across every window
slug: editor-0-1-66
date: 2026-09-18
tags:
  - extensions
  - vscode
  - cursor
description: >-
  Open projects now share one reading queue, so replies are read in the order
  they arrived and the status bar says which window is next.
excerpt: >-
  With several projects open, a reply queued behind another window could wait
  indefinitely, and nothing told you which window was about to speak.
---

**Varterm TTS 0.1.66** is the current editor build. Install from [Open VSX](https://open-vsx.org/extension/Varterm/varterm-cursor) or the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Varterm.varterm-cursor). The `.vsix` is on [GitHub Release v0.1.66](https://github.com/varterm/extensions/releases/tag/v0.1.66).

- **One queue across every window.** Each window used to keep its own, coordinated only by who held the speaker, so replies came out in whatever order the windows happened to notice it was free rather than the order they arrived. Now they share one line, whichever window is idle reads the next item, and the queue shows which project each one came from. Set `vartermCursor.sharedListenQueue` to false to go back to a queue per window.
- **The status bar says who is next.** Green moving bars mean the reading is happening in that window, amber means it has a reply waiting and hovering gives its place in the line, and a dim static mark means another window is talking. Before this, a window waiting its turn looked the same as one that simply had a neighbour speaking.
- **A queued reply could wait forever.** Everything that moved the queue along ran when a window finished reading something of its own, so a window that was only ever waiting its turn had nothing to finish and was never told the speaker had freed up.
- **Two windows could start reading at once.** The speaker is not claimed until audio actually begins, which leaves the whole synthesis step looking idle to everyone else. Taking an item from the queue now claims the queue in the same write.
- **Replaying the last reply could play the one before it.** A window only caches audio for replies it actually played, and it does not play them all, so holding audio was never proof of holding the newest reply. It is reused only while it still matches.

Anything still waiting after ten minutes is dropped rather than read out late; `vartermCursor.queueItemExpiryMinutes` changes that, and `0` turns it off.

Setup notes live on the [extensions page](/extensions#editors).
