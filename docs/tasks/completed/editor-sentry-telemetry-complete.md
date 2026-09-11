# editor-sentry-telemetry — complete

Date: 2026-09-11
Owner: agent

## What shipped

- Editor 0.1.59 sends failed-read / command errors to Sentry.
- No spoken text, clipboard, or file contents.
- Honors `vscode.env.isTelemetryEnabled` and `vartermCursor.telemetry`.
- Privacy page mentions Sentry.

## How to verify

- Install `varterm-cursor-0.1.59.vsix`, trigger a failed TTS request, confirm an event in Sentry.
- Disable Cursor telemetry or `vartermCursor.telemetry` and confirm no event.

## Follow-ups

- Publish 0.1.59 when ready.
- Restrict the Sentry DSN in the project settings if desired.
