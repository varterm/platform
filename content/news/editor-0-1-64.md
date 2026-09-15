---
title: Editor 0.1.64 — Linux plays without ffmpeg
slug: editor-0-1-64
date: 2026-09-15
tags:
  - extensions
  - vscode
  - cursor
description: >-
  Linux playback falls back to mpv, mpg123, VLC or SoX when ffmpeg is missing.
  66 voices across 29 languages, and a mismatched voice now explains itself.
excerpt: >-
  Two failures a user could do nothing about: a Linux machine with no ffmpeg,
  and a voice handed text in a script it cannot read.
---

**Varterm TTS 0.1.64** is the current editor build. Install from [Open VSX](https://open-vsx.org/extension/Varterm/varterm-cursor) or the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Varterm.varterm-cursor). The `.vsix` is on [GitHub Release v0.1.64](https://github.com/varterm/extensions/releases/tag/v0.1.64).

- **Linux no longer needs ffmpeg.** Playback looks for `ffplay`, `mpv`, `mpg123`, `mpg321`, `cvlc`, `gst-play-1.0` and `play`, and takes the first one installed. Earlier builds ran `ffplay` and nothing else, so a machine without it failed with `spawn ffplay ENOENT` and no hint of a remedy. The check now happens before audio is generated, and names the packages that would fix it.
- **66 voices across 29 languages** — Arabic, Bengali, Chinese, Hindi, Japanese, Korean, Russian, Swahili, Tamil, Ukrainian, Vietnamese and more. Varterm reads them as written; it does not translate.
- **A voice handed text it cannot read says so.** Microsoft's voices are locale specific, and a mismatched one returns silence rather than an error, which used to surface as "No audio generated. Please try different text." Give an English voice a page of Chinese and Varterm now names a voice that can read it.

Setup notes live on the [extensions page](/extensions#editors).
