# no-audio-generated-fix — complete

Date: 2026-09-13
Owner: agent

## What shipped

Sentry `b01c769db81e44a6b060995d1d5425d3` (editor 0.1.63, Windows) reported
"No audio generated. Please try different text." The message comes from
`/api/edge-tts`, not the extension. Two causes were reproduced against the live
endpoint; Microsoft returns zero bytes and no error for both.

- **Voice cannot speak the script.** `en-US-AriaNeural` given Chinese, Cyrillic,
  Arabic, Devanagari, Japanese, Korean, Hebrew, Thai or Greek returns nothing.
  French and accented Latin are fine, as is English with a few foreign words.
- **Chunk with nothing to say.** The editor chunker could emit `"---"` alone: a
  markdown rule between two paragraphs each over ~178 chars is too long to merge
  with either neighbour, so it was sent by itself.

Changes:

- `extensions/vscode/src/speech-text.ts` (new): `splitTextIntoChunks` now drops
  chunks with no letter or digit. `voiceCannotSpeak` and `dominantScript` added.
  Moved out of `extension.ts` so it can be tested without the editor.
- `extensions/vscode`: a script mismatch now reports the script, a working
  voice, and the `vartermCursor.readAloudVoice` setting instead of the dead-end
  message.
- Sentry events from a failed read now carry `voice` and `script` tags. The
  original report had neither, which is why the cause had to be reproduced from
  scratch.
- `/api/edge-tts` POST returns **422** rather than 500 for both causes, with a
  message naming the voice and script. The shared client retries on `>= 500`, so
  users were also sitting through pointless retries before the useless error.
- `/api/edge-tts` GET now lists 66 voices across 31 locales, reusing
  `lib/cloud-languages.js` instead of the 10 English-only entries. This is what
  the editor voice picker is built from, so non-English users had no usable
  voice at all.
- `extensions/vscode/tests/speech-text.test.mjs` (new): 48 assertions, the first
  tests in that extension. `npm test` added.

## How to verify

- `cd extensions/vscode && npm test` — 48 pass.
- Chinese text with an English voice returns 422 and names `zh-CN-XiaoxiaoNeural`.
- `---` between two long paragraphs produces two chunks, neither silent.
- `GET /api/edge-tts` returns 66 voices, no duplicates; all 66 synthesised audio
  when audited.
- Chrome extension suites still pass (`chats-dom`, `chunking`, `claude-dom`,
  `isolation`, `wiring`).

## Follow-ups

- Shipping as editor 0.1.64. The `/api/edge-tts` change must deploy before the
  editor picker shows the new voices, since the picker is built from that
  endpoint.
- Sentry's "more setup for tracing" prompt was declined. Telemetry is a
  hand-rolled envelope sender with no SDK, and tracing would not have diagnosed
  this. The `voice`/`script` tags were the useful part.
- The reader panel in the Chrome extension still has its own voice list; it was
  not touched here.
