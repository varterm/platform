---
title: Cursor & VS Code read-aloud extensions — editor-native TTS
slug: cursor-vscode-tts-extensions
date: 2026-03-12
tags:
  - cursor
  - vscode
  - extensions
description: >-
  Announcing Cursor and VS Code installers for selection, clipboard, and long-file read aloud workflows.
excerpt: >-
  Install Varterm where you ship code — read selections or the whole editor aloud with Markdown cleanup and chunked playback.
---

**Cursor** and **Visual Studio Code** now have first-class installers on our [extensions page](/extensions#editors). The editor pack targets:

1. Long files and pasted agent output (`Varterm: Read Editor/Selection Aloud`).
2. Clipboard captures from chat UX (`Varterm: Read Clipboard Aloud`).
3. Voice selection synced with `/api/edge-tts`-style backends so **web parity** survives context switches.

Manual **`.vsix` flows remain documented** alongside marketplace links because Cursor often needs local packaging before store listings converge.

If anything regresses mid-release, skim **GitHub Releases** on [`varterm/extensions`](https://github.com/varterm/extensions) for deterministic artifacts tied to semver tags.
