# edge-tts-msedgeservices-host — complete

Date: 2026-10-12
Owner: agent

## What shipped

Chrome users reported "Speech synthesis failed. Please try again." Cloud voices
failed; browser/offline still worked. The message is from `/api/edge-tts` when
`synthesize()` throws. The throw was `Unexpected server response: 403`.

Microsoft closed the old Edge Read Aloud socket
(`speech.platform.bing.com/.../edge/v1`) around 2026-10-10, and in the US on
2026-10-12. Edge 155 speaks through
`api.msedgeservices.com/tts/cognitiveservices/websocket/v1`. That host still
accepts the existing v1 `Sec-MS-GEC` token if the key is sent as
`Ocp-Apim-Subscription-Key`. Sending `TrustedClientToken` on the new host 403s.

`@andresaya/edge-tts` 1.8.0/1.8.1 still builds the old URL. `/api/edge-tts` now
uses `CloudEdgeTTS` in `lib/edge-tts-client.js`, which only changes the
handshake. Chrome, Cursor, and the CLI all hit this route, so no client
release.

This is a stopgap. Edge 155 already uses a v2 token format. When Microsoft
requires that here, this will 403 again.

## How to verify

- `node --test tests/edge-tts-client.test.js` — URL uses the new host and
  `Ocp-Apim-Subscription-Key`, not `TrustedClientToken`.
- Local `CloudEdgeTTS.synthesize('Hello from the new host.', 'en-US-AriaNeural')`
  returned 13968 bytes of MP3.
- After deploy: `POST https://www.varterm.com/api/edge-tts` with
  `{"text":"Hello from a quick check.","voice":"en-US-AriaNeural","rate":1}`
  returns `audio/mpeg`, not the 500 JSON error.

## Follow-ups

- Watch [rany2/edge-tts#490](https://github.com/rany2/edge-tts/issues/490) and
  [PR #491](https://github.com/rany2/edge-tts/pull/491). If they publish a v2
  token, drop this wrapper and bump `@andresaya/edge-tts`.
- Tell the Chrome reporter Browser/offline is no longer needed once prod is
  serving audio.
