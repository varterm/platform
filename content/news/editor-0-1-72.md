---
title: Editor 0.1.72 — Windows plays, long reads finish, Agents window on
slug: editor-0-1-72
date: 2026-10-06
tags:
  - extensions
  - vscode
  - cursor
description: >-
  Windows playback works, long selections no longer fail part-way through, and
  an editor can read every finished reply from Cursor's Agents window.
excerpt: >-
  Windows users heard nothing since 0.1.63, a long selection could die writing
  part 24, and Cursor's Agents window had no way to be read. All three fixed.
---

**Varterm TTS 0.1.72** is the current editor build. Install from [Open VSX](https://open-vsx.org/extension/Varterm/varterm-cursor) or the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Varterm.varterm-cursor). The `.vsix` is on [GitHub Release v0.1.72](https://github.com/varterm/extensions/releases/tag/v0.1.72). This post covers 0.1.70 through 0.1.72.

- **Windows plays.** 0.1.63 replaced the `Background playback currently uses macOS afplay` error with a Windows player, but that player waited for the clip's duration without running the message loop that delivers it, so it timed out after eight seconds and nothing was heard. The loop now runs until the clip ends, and a failed clip reports why instead of only an exit code. Nothing to install.
- **Long reads finish.** Each part was written through Cursor's `vscode-userdata` filesystem into a folder shared by every window, and that write could fail part-way through a long selection. Playback files now go to the OS temp directory through Node's filesystem, one folder per window, and prune leaves files that are still playing alone.
- **Agents window on.** Cursor does not run extensions inside its Agents window, so there was no status bar there and no way to hear those replies. An editor now has an **Agents window on** switch (`Varterm: Toggle Agents Window Reading`). On, that editor reads every finished reply from the Agents window. An editor's own Auto-read still never picks up a reply from another project.
- **Listing matches the build.** Three commands that were listed but did nothing (`Sign In`, `Sign Out`, `Save to Library`) are gone, along with five settings left over from a document-ingest feature that had no entry point. The store description now says what ships: one shared reading queue across windows, markdown stripped before speech, and ElevenLabs with your own key available today.

Setup notes live on the [extensions page](/extensions#editors).
