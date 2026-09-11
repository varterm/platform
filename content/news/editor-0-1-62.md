---
title: Editor 0.1.62 — Auto-read Off stays off
slug: editor-0-1-62
date: 2026-09-11
tags:
  - extensions
  - vscode
  - cursor
description: >-
  Auto-read Off survives reload and stops this window. Failed reads can report
  to Sentry without sending the text you listen to.
excerpt: >-
  Turning Auto-read off now stays off after an update or restart. Failed reads
  can report to Sentry. Spoken text is never sent.
---

**Varterm TTS 0.1.62** is the current editor build. Install from [Open VSX](https://open-vsx.org/extension/Varterm/varterm-cursor) or the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Varterm.varterm-cursor). The `.vsix` is on [GitHub Release v0.1.62](https://github.com/varterm/extensions/releases/tag/v0.1.62).

- **Off stays off.** Auto-read no longer turns back on after a VSIX update or reload. Off stops this window’s current listen.
- **Failed reads** can report to Sentry so we can fix issues. The text you listen to is not sent. Turn this off with `vartermCursor.telemetry` or the editor telemetry setting.
- **0.1.55 features remain:** listen queue, plan-file read, markdown stripped before speech.

Setup notes live on the [extensions page](/extensions#editors).
