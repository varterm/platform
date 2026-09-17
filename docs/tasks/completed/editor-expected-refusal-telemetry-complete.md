# editor-expected-refusal-telemetry — complete

Date: 2026-09-17
Owner: cntrlne

## What triggered it

Sentry issue `3c7144f8fba841df9a0bfb91fa211642`, "That text has nothing to read
aloud.", from a Windows Cursor user on **0.1.62**.

Not a new defect. The message is the 422 pre-check added to
`app/api/edge-tts/route.js` during the 0.1.64 work, and it replaced the
misleading "No audio generated. Please try different text." that started that
work. 0.1.64 filters unspeakable text client-side, so the request is never made
— verified against the shipped build, where `---`, `***`, ` ``` `, `|---|---|`,
`...` and emoji-only strings all produce zero chunks and no API call. The report
came from a client too old to have that filter, and reports of this kind stop as
users update rather than as a result of any change here.

## What shipped

Two gaps found while confirming the above, neither of them the alert itself.

- Expected refusals no longer file error reports. `HttpError` from
  `@varterm/tts-client` carries the response status, so the decision is made on
  422 and 429 rather than by matching message strings. A voice that cannot read
  the script is a setting the user can change, and it was landing as an
  `error`-level event on current builds.
- Other 4xx still report, deliberately. The extension chunks to 450 characters
  and builds its own payloads, so a 400 means this code sent a bad request —
  the sort of defect the reports exist to catch. This narrows the original
  400/422/429 sketch to 422/429.
- Text that filters down to nothing now says so. Previously the loop ran zero
  times and the function returned normally: no audio, no message, no error, just
  a cleared spinner. Auto-read stays silent, since a reply that reduces to
  nothing is not worth interrupting anyone over.
- Added a `notice` message to the player view so an expected outcome clears the
  spinner without the error styling that `error` applies.

The filter moved to `src/telemetry-filter.ts` so it can be tested without an
editor, matching `host-player.ts` and `agent-drop.ts`.

## How to verify

- `npm test` in `extensions/vscode` — 10 assertions in
  `tests/telemetry-filter.test.mjs` cover refusals, the 400 carve-out, auth and
  routing codes, 5xx, messages with no status, substring matching, non-`Error`
  values, and a string `"422"` that must not be mistaken for the number.
- Live check: `POST https://www.varterm.com/api/edge-tts` with `{"text":"---"}`
  returns `422 {"success":false,"error":"That text has nothing to read aloud."}`.
  Constructing the real `HttpError` from that response and passing it to
  `shouldReportError` returns `false`, while a 500 returns `true`.
- Select a line of only punctuation and press read: an information message
  appears rather than silence.

## Follow-ups

- The zero-chunk notice was not verified in a running editor, only by type
  checking and reading. Worth an eyeball before release.
- A second event on the same issue arrived on 17 Sept, again from release
  0.1.62. No code change reaches an already-installed old build, so the issue
  should be marked resolved in 0.1.64 in Sentry; it will then only reopen if it
  recurs in a newer release, which would be a real regression.
- Shipping in 0.1.65.
