# Marketing Sync Matrix

Last updated: 2026-09-15  
Reference strategy: `marketing-strategy-canonical.md`

Status legend:
- `Aligned`: matches strategy direction.
- `Partial`: present but underemphasized.
- `Gap`: missing and should be added in future updates.

## Pillars

- `P1` Free + privacy-conscious
- `P2` Long-form first
- `P3` Messy text cleanup (markdown + special characters)
- `P4` Cross-platform support
- `P5` Listener experience quality
- `P6` Mission and partner alignment
- `P7` Language reach (29 languages on the cloud tier; reading, not translation)

## Pages and assets

| Surface | P1 | P2 | P3 | P4 | P5 | P6 | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `app/HomeClient.js` | Partial | Aligned | Partial | Aligned | Aligned | Gap | Strong utility; mission/partner framing still light. |
| `app/layout.js` | Aligned | Aligned | Partial | Aligned | Partial | Gap | Metadata good; limited mission language. |
| `app/long-form-tts/page.js` | Aligned | Aligned | Partial | Partial | Aligned | Gap | Great long-form messaging; partner framing absent. |
| `app/markdown-to-speech/page.js` | Aligned | Partial | Aligned | Partial | Aligned | Gap | Strong markdown positioning; special-character story can be stronger. |
| `app/extensions/page.js` | Partial | Aligned | Partial | Aligned | Aligned | Gap | Chrome now names transcript search, jump/speed, and optional chat auto-read. |
| `app/install-extensions/page.js` | Partial | Partial | Partial | Aligned | Aligned | Gap | Chrome install steps cover transcripts, Alt+Shift+R, and per-site auto-read. |
| `app/privacy/page.js` | Aligned | Partial | Partial | Partial | Partial | Gap | Policy support is solid; could connect to mission language elsewhere. |
| `app/support/page.js` | Partial | Gap | Gap | Partial | Partial | Gap | Primarily functional support contact page. |
| `app/tts/page.js` + `app/tts/[slug]/page.js` | Aligned | Aligned | Aligned | Aligned | Partial | Gap | Good SEO bridge; mission line not explicit. |
| `content/news/*.md` + `app/news/*` | Partial | Aligned | Partial | Aligned | Partial | Partial | Good launch narrative; add more mission/partner stories. |
| `README.md` | Partial | Partial | Partial | Aligned | Partial | Gap | Developer-focused docs; not a full messaging source. |
| `public/llms.txt` + `public/llms-full.txt` | Partial | Aligned | Partial | Aligned | Partial | Gap | Useful machine-readable summary, but mission can be clearer. |
| Editor store listing (`extensions/vscode/README.md`) | Aligned | Aligned | Partial | Aligned | Aligned | Gap | Names all 29 languages and the 66 voices as of 0.1.64. The only surface that does. |

`P7` is now claimed on the editor store listing and nowhere else. Every site surface still omits it, so the search demand for "text to speech in \<language\>" is still unclaimed on pages we control and rank with. The editor picker is served from `/api/edge-tts`, so the language set is the same 29 everywhere and the site can make the claim without any further build work.

## Immediate sync actions

1. Add explicit mission sentence on homepage and extension landing content.
2. Add concrete “special characters” benefit copy where markdown cleanup is already discussed.
3. Add a partner-facing block/page for archives, libraries, and publishers.
4. Update metadata snippets to include privacy-conscious and listener-quality framing where accurate.
5. Refresh this matrix after each content release.
6. Give language reach a site surface. The editor store listing now names the 29 languages and 66 voices; the homepage, `/extensions`, and `/tts/*` still do not, so the search demand for "text to speech in \<language\>" goes unclaimed where we rank. Keep the claim to reading, not translation.
