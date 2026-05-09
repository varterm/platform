# Changelog

## 1.0.0 - 2026-05-08

### Added
- **First public Varterm 1.0.0 release** across:
  - Web app (`varterm.com`)
  - Chrome Extension (now maintained in `varterm/extensions`)
  - VS Code / Cursor Extension (now maintained in `varterm/extensions`)
- **Cross-platform long-form and markdown-focused experience**:
  - Long-form playback support for large content
  - Markdown-friendly reading cleanup
  - Shared messaging and setup flow across web and extensions
- **Store and compliance foundations for Chrome launch**:
  - Privacy policy page (`/privacy`)
  - Extensions setup page (`/extensions`)
  - Support page (`/support`)

## 2026-05-06

### Added
- **Offline TTS with Piper AI**: New "Offline" tab using Piper TTS that runs entirely in the browser via WebAssembly. Downloads ~20MB voice model on first use, then works without internet.
- **Browser-native TTS tab**: Re-added built-in browser voices (Web Speech API) as a dedicated "Browser" tab for quick, no-download playback.
- **Three-tier voice system**: Cloud (Microsoft Edge neural), Browser (built-in), and Offline (Piper AI local).
- **Reading progress indicator**: Visual progress bar showing playback position within current audio chunk.
- **Loading state for audio generation**: Shows "Generating audio..." with animated loading bar during initial TTS processing.
- **Toggle to show/hide reading text**: Collapsible "Now Reading" panel with current chunk text.
- **FAQ schema markup**: Added structured data for rich snippets in search results.
- **Feedback system**: New feedback modal and `/api/feedback` endpoint for user bug reports and feature requests.
- **VSCode/Cursor Extension** (maintained in `varterm/extensions`):
  - Read selected text aloud (`Cmd/Ctrl+Shift+R`)
  - Read current line (`Cmd/Ctrl+Shift+L`)
  - Read errors and warnings (`Cmd/Ctrl+Shift+E`)
  - Read entire document
  - Context menu integration
  - Configurable voice tier, voice, rate, and markdown stripping
  - Auto-read errors option
- **Chrome Extension** (maintained in `varterm/extensions`):
  - Floating 🔊 button on text selection
  - Context menu "Read with Varterm"
  - Keyboard shortcut `Ctrl/Cmd+Shift+R`
  - Read entire page option
  - Popup with voice settings
  - Cloud and browser voice tiers

### Changed
- Simplified pricing model to donation-only (removed paid tiers).
- Updated SEO metadata and descriptions to emphasize "free", "long form", "no login required".
- Piper TTS loads from esm.sh CDN at runtime instead of bundling (fixes webpack/Terser build errors with onnxruntime-web).
- Improved error handling for Edge TTS API with specific error messages.
- Styled scrollbar on textarea to be minimal and dark.

### Fixed
- Build errors caused by onnxruntime-web ES module bundling issues.
- Race condition errors during voice tier switching.

## 2026-05-04

### Added
- New document workflow APIs:
  - `POST /api/ingest` for chunked ingestion sessions with limits.
  - `POST /api/ask` for question answering over ingested sessions.
- New backend libraries:
  - `lib/document-ingestion.js` for chunking and relevance selection.
  - `lib/document-session-store.js` for short-lived session storage.
  - `lib/extension-auth.js` for optional bearer-token protection.
- Automated tests using Node test runner:
  - `tests/document-ingestion.test.js`
  - `tests/document-session-store.test.js`
  - `tests/extension-auth.test.js`
  - `tests/ingest-ask-flow.test.js` (end-to-end ingest/chunk/session/retrieval flow)

### Changed
- Updated `README.md` with new environment variables (`ANTHROPIC_API_KEY`, `VARTERM_EXTENSION_API_TOKEN`) and API request examples for ingest/ask.
- Added `npm test` script to run backend unit tests.

### Fixed
- Replaced in-memory ingest session storage with file-backed sessions (`/tmp/varterm-sessions` by default) so `POST /api/ask` can reliably read sessions created by `POST /api/ingest` across route invocations.
- `POST /api/tts` now logs a backend warning and returns a clear premium-key-missing response instead of opaque failures when ElevenLabs is unavailable; also accepts `X-ElevenLabs-Api-Key` override header.
