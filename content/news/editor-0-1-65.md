---
title: Editor 0.1.65 — hear the last reply again
slug: editor-0-1-65
date: 2026-09-17
tags:
  - extensions
  - vscode
  - cursor
description: >-
  A status bar button and a shortcut to replay the last agent reply, with every
  window keeping its own. Text with nothing speakable now says so.
excerpt: >-
  Replaying the last reply meant copying it and pressing the clipboard button,
  which silently refused, because re-reading is the one thing it ignored.
---

**Varterm TTS 0.1.65** is the current editor build. Install from [Open VSX](https://open-vsx.org/extension/Varterm/varterm-cursor) or the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Varterm.varterm-cursor). The `.vsix` is on [GitHub Release v0.1.65](https://github.com/varterm/extensions/releases/tag/v0.1.65).

- **Hear the last agent reply again**, from the speech bubble in the status bar or `⌘⇧⌥A` / `Ctrl+Shift+Alt+A`. No copying. Where there is cached audio it replays that, so nothing is synthesised twice. The command existed before but only in the command palette, so the natural move was to copy the reply and press the clipboard button — which does nothing, because that button ignores clipboard text it has already read, and re-reading is a repeat by definition.
- **Every window keeps its own last reply.** Replies used to go to a single file shared by the whole machine, so a window lost its reply the moment any other window got an answer, and the button was usually missing with several projects open. A window also never reads out an answer to a question a different project asked.
- **Text with nothing to say now says so.** A selection that is only punctuation, a horizontal rule or a row of emoji used to end in silence with no explanation, which reads as a failure. Auto-read stays quiet in the same case, since a reply that reduces to nothing is not worth interrupting anyone over.
- **Fewer false alarms.** When the speech service declines on purpose — nothing speakable in the text, a voice that cannot read that script, too many requests — that is an answer to act on rather than a fault, and it no longer files an error report.

Coming from **0.1.62**, which is what the VS Code Marketplace has been serving: 0.1.65 also brings everything in [0.1.64](/news/editor-0-1-64) — Linux playback without ffmpeg installed, 66 voices across 29 languages, and a mismatched voice naming one that can read your text.

Setup notes live on the [extensions page](/extensions#editors).
