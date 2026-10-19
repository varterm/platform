---
title: What happened to the Chrome extension
slug: chrome-extension-store-update
date: 2026-10-19
tags:
  - chrome
  - extension
  - announcements
description: >-
  The Chrome Web Store rejected the 1.4.0 update for listing other products
  by name. Version 1.4.5 is the package going back, without that list.
excerpt: >-
  Chrome rejected the last update because the public description named other
  chat products. The extension still reads pages, transcripts, and chats you
  turn on. 1.4.5 is the resubmission.
---

The Chrome Web Store rejected **Varterm TTS 1.4.0**. The review was Yellow Argon, under spam and placement: the public description listed other companies' chat products as keywords. The extension was not rejected for reading a page. The listing could not move forward until those names came out of the public text.

**1.4.5** is the package prepared to send back.

- The public description no longer names those products. It says "AI chat replies."
- At install, Chrome is asked only for `https://www.varterm.com/api/*`, the speech service.
- Reading a chat stays off until you turn that site on. Chrome asks for the site at that moment, not at install. Revoking access turns the site off.
- Two Chrome windows on the same page share one playback, so they no longer read over each other.
- Closing the text window stays closed. Coming back to a tab does not start that read again.
- **Show text window** in the menu turns the panel off and leaves reading as audio only.
- The toolbar icon moves while audio is playing, so a read is visible with the text window closed.

Transcripts, search, jump, and speed are unchanged. Select text and press `Alt+Shift+R`. Chrome uses Ctrl+Shift+R to reload the page.

Until that review finishes, the store page can still show the older build. Install notes are on the [extensions hub](/extensions#chrome).
