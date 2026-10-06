# editor-0-1-72-listing-alignment — complete

Date: 2026-10-06
Owner: jc

## What shipped

Store listing, site copy, marketing doc, and the extension itself brought into
agreement, and 0.1.72 packaged (not yet published or committed).

Extension repo (`varterm/extensions`):

- `package.json`: removed three commands that were declared but never
  registered (`signInAccount`, `signOutAccount`, `saveToLibrary`) and five
  settings for a document-ingest feature with no entry point (`chunkSize`,
  `chunkOverlap`, `askMaxChunks`, `askMaxContextChars`, `autoReadAnswersAloud`).
  Declared `toggleAgentsWindowReading` so it shows in the Command Palette.
- `src/extension.ts`: deleted the unreachable `ingestDocuments` /
  `ingestActiveEditor` / `askAI` code and helpers (~230 lines). `tsc` clean.
- `README.md` (store long description): shared reading queue replaces "only the
  focused window speaks"; markdown stripping, Agents window switch,
  bring-your-own-key ElevenLabs, 29 languages / 31 locales, Windows works out
  of the box; command and setting lists match `package.json`.
- Both `CHANGELOG.md` files: 0.1.72 entry covers the write fix, the Windows
  fix (0.1.71), the removals, and the listing change.
- `docs/marketing.md`: current pitch, "things not to claim" list, posting gate
  lifted, Open VSX as the Cursor destination.
- `varterm-cursor-0.1.72.vsix` built and verified: version, command list, no
  dead settings, no tests/.env/src, README and `play-mp3.ps1` current.

Platform repo (this one):

- `lib/extension-links.js`: `EDITOR_EXTENSION_VERSION` 0.1.66 → 0.1.72.
- `app/extensions/page.js`, `app/HomeClient.js`,
  `app/extensions/product-content.js`: focused-window claims replaced with
  shared-queue wording; markdown stripping and BYO ElevenLabs added to editor
  copy; "Coming · paid" kept for the hosted studio tier only.
- `content/news/editor-0-1-72.md` added (covers 0.1.70–0.1.72).
  `editor-0-1-66.md` dated 2026-09-18 so it no longer ties with 0.1.65 and the
  home page "Latest" sorts correctly.

## How to verify

- `cd extensions/vscode && npm test` passes; `npx tsc --noEmit -p .` clean.
- `unzip -p varterm-cursor-0.1.72.vsix extension/package.json` shows 0.1.72 and
  no `signIn*` / `saveToLibrary` / `chunkSize` entries.
- After publish: `npm run stores:status` shows 0.1.72 on both stores.
- After site deploy: `curl -sI -L -o /dev/null -w "%{http_code}\n"
  https://github.com/varterm/extensions/releases/download/v0.1.72/varterm-cursor-0.1.72.vsix`
  returns 200, and the home page "Latest" is the 0.1.72 post.

## Follow-ups

- Publish order matters: tag `v0.1.72` in the extension repo first (GitHub
  release workflow builds the asset), then `npm run publish:stores`, then push
  this repo. The site download link 404s until the release exists.
- Daily downloads were inflated by a release every 1–3 days (each one
  re-downloads to the installed base). Expect a one-day spike on publish, then
  the organic rate. Judge growth by the installed base, not daily downloads.
- Search ranking is weak for "text to speech" (strong for "tts" and "read
  aloud"). Consider adding "text to speech" to the display name or first line of
  the short description.
