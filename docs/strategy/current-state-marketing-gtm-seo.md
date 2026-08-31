# Varterm Current-State Marketing, GTM, and SEO

Last updated: 2026-08-31  
Scope: current live messaging and repo-backed strategy before additional copy/site changes.

Companion docs:
- `README.md`
- `marketing-strategy-canonical.md`
- `marketing-sync-matrix.md`
- `outreach-playbook.md`

## 1) Source of truth (repo inventory)

### Core positioning and homepage messaging
- `app/HomeClient.js`
- `app/layout.js`
- `README.md`

### SEO pages and search intent capture
- `app/long-form-tts/page.js`
- `app/markdown-to-speech/page.js`
- `app/tts/page.js`
- `app/tts/[slug]/page.js`
- `lib/tts-seo-slugs.js`
- `lib/seo-faq.js`
- `app/sitemap.js`
- `app/robots.js`
- `tests/seo-recovery.test.js`

### GTM/distribution pages (platform expansion)
- `app/extensions/page.js`
- `app/install-extensions/page.js`
- `app/privacy/page.js`
- `app/support/page.js`

### Update cadence and launch narrative
- `CHANGELOG.md`
- `content/news/*.md`
- `app/news/page.js`
- `app/news/[slug]/page.js`

### LLM-discoverability positioning
- `public/llms.txt`
- `public/llms-full.txt`

## 2) Current site messaging (what we already communicate)

Primary live claims:
- Free, no signup, unlimited usage.
- Long-form TTS with chunking/progress.
- Markdown cleanup for ChatGPT/GitHub/docs.
- Multi-platform support (Web, Cursor, VS Code, Chrome).
- Editor **Auto-read** for the agent window, plus play / pause / stop / jump on the status bar.
- Multiple voice modes (cloud neural, browser, offline/local via Piper in browser).
- 29 languages on the cloud tier (English plus 28), 56 voices. Reading only — Varterm does not translate.

Current tone:
- Practical, tool-first, developer-friendly.
- Strong utility framing; lighter mission framing.

## 3) Current GTM strategy (as implemented)

### Acquisition channels
- **SEO-led inbound**: homepage + long-tail pages (`/long-form-tts`, `/markdown-to-speech`, `/tts/*`).
- **Extension-led distribution**: Cursor/VS Code/Chrome install funnels.
- **News/changelog content**: markdown posts for shareable updates and crawlable release history.
- **AI/tool ecosystem hooks**: OpenAPI + MCP references in `README.md`, `llms` files.

### Conversion flow
- Land on web app or intent page.
- See immediate value proposition (free/no login + long-form/markdown).
- Convert to usage instantly on homepage reader.
- Secondary conversion to extension install pages.
- Trust reinforcement via privacy/support pages.

### Retention levers
- Cross-platform continuity: same behavior across web/editor/browser.
- Sticky use cases: long docs, AI output, markdown-heavy workflows.
- Feature depth: chunking, progress, playback controls, voice options.

## 4) Current SEO strategy (as implemented)

### Technical SEO
- Metadata + OG/Twitter configured in `app/layout.js`.
- FAQ schema JSON-LD (`lib/seo-faq.js` + layout script injection).
- Dynamic sitemap with key routes + news + long-tail slugs (`app/sitemap.js`).
- Robots allow-all except restricted API route (`app/robots.js`).
- Canonical consolidation from `/tts` and `/tts/[slug]` to homepage.

### Content SEO
- Dedicated intent pages:
  - Long-form conversion.
  - Markdown-to-speech conversion.
  - Extension install/use pages.
- Curated long-tail slugs (ChatGPT to speech, Cursor TTS, VS Code read aloud, etc.).
- News posts as crawlable markdown release narrative.

### Keyword posture
- Strong on: free/no signup, long-form, markdown, read aloud, editor/browser extension terms.
- Present but underemphasized in copy: privacy-first for hackers, special-character robustness, mission narrative.
- Shipped but not yet targeted at all: non-English reading. 29 languages are live with no page, slug, or metadata pointing at them.

## 5) Gap analysis vs desired direction

Desired emphasis from latest guidance:
1. Free + private for hackers.
2. All supported platforms.
3. Mission: enable long-form TTS everywhere.
4. Better handling of special characters.
5. Improved listener experience.
6. Outreach tone for mission-aligned partners (archives/libraries).

Current gaps:
- **Mission language is implicit, not explicit.** Product utility is clear, mission statement is not central.
- **Privacy-for-hackers value is partial.** Privacy page exists, but homepage hero does not lead with this promise.
- **Special-character handling is functionally present but not named as a first-class benefit.**
- **Listener experience language is diffuse.** Features exist (chunking/progress/controls), but not grouped into one narrative.
- **Partner-facing GTM copy is not formalized.** No dedicated “for publishers/archives/libraries” messaging block yet.
- **Language reach is invisible.** The reader speaks 29 languages, but every page still reads as English-only. No landing page, long-tail slug, or `hreflang` signal exists for “text to speech in \<language\>”, which is high-volume search we currently forfeit.

## 6) Recommended unified messaging architecture (before more edits)

Use this order consistently across homepage, extension pages, and outreach:

1. **Free + private by default**  
   “No login, no paywall, local/offline options available.”

2. **Built for long-form listening**  
   “Articles, books, docs, and AI output with seamless chunked playback.”

3. **Handles messy real-world text**  
   “Markdown and special-character cleanup for cleaner audio.”

4. **Works where users already are**  
   “Web + Cursor + VS Code + Chrome with shared workflow.”

5. **Listener experience first**  
   “Natural voices, progress visibility, and controls that keep context.”

Suggested mission line:
> “Varterm exists to make long-form text listenable everywhere, with private-by-default workflows and clean speech from messy modern content.”

## 7) Partner/customer segment framing (including archive-style outreach)

### A) Hackers and developer power users
- Need: private, fast, no-friction read-aloud for docs/AI/code-adjacent text.
- Message: free/no login, local voice options, editor integration, markdown cleanup.

### B) Knowledge workers and heavy readers
- Need: convert long reading queues into audio.
- Message: long-form chunking, progress tracking, smooth playback.

### C) Mission-driven content institutions (archives, libraries, publishers)
- Need: accessibility + fidelity for long texts and historical/special-character content.
- Message: long-form reliability, text cleanup, and respectful mission alignment.

## 8) Outreach copy direction (modeled from archive email intent)

Partner pitch skeleton:
- Lead with appreciation for their mission/content.
- Identify accessibility/listening pain point for long texts.
- Offer concrete value: long-form TTS, special-character resilience, better listener fidelity.
- Keep it collaborative and mission-aligned (not salesy).

Example short blurb:
> “We help readers listen to long, complex texts in higher fidelity through long-form TTS that handles markdown/special-character noise and preserves reading flow. Varterm is free and privacy-conscious, and we support web, browser, and editor workflows. We would love to explore a lightweight collaboration to improve listening accessibility for your audience.”

## 9) GTM + SEO next-step checklist (before copy changes)

1. Freeze and align on the 5-message hierarchy in section 6.
2. Add explicit “private for hackers” + mission sentence to homepage hero/supporting copy.
3. Add a “special characters + cleaner listening” proof section (homepage and markdown page).
4. Add a “For archives/publishers/libraries” mini-block or page.
5. Expand long-tail slugs around privacy + special-character and long-form accessibility intent.
6. Track traffic split to ChatGPT-related intents vs broader long-form/extension intents to reduce dependence on one acquisition pattern.

## 10) Notes on “local API/chat client support”

Current repo already includes developer-facing integration surfaces (`README.md`, OpenAPI, MCP references), but the partner-facing marketing narrative underplays this.

Position this as:
- API/MCP-compatible for local/private workflows.
- Useful for teams integrating read-aloud into their own tools.

If product scope includes restoring previously removed local client behaviors, capture that as a dedicated roadmap item and market it as “private local mode for advanced users.”
