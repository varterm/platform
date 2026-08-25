# Marketing Sync Matrix

Last updated: 2026-08-25  
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

## Pages and assets

| Surface | P1 | P2 | P3 | P4 | P5 | P6 | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `app/HomeClient.js` | Partial | Aligned | Partial | Aligned | Aligned | Gap | Strong utility; mission/partner framing still light. |
| `app/layout.js` | Aligned | Aligned | Partial | Aligned | Partial | Gap | Metadata good; limited mission language. |
| `app/long-form-tts/page.js` | Aligned | Aligned | Partial | Partial | Aligned | Gap | Great long-form messaging; partner framing absent. |
| `app/markdown-to-speech/page.js` | Aligned | Partial | Aligned | Partial | Aligned | Gap | Strong markdown positioning; special-character story can be stronger. |
| `app/extensions/page.js` | Partial | Aligned | Partial | Aligned | Partial | Gap | Platform story strong; privacy mission underemphasized. |
| `app/install-extensions/page.js` | Partial | Partial | Partial | Aligned | Partial | Gap | Procedural install content; strategic framing minimal. |
| `app/privacy/page.js` | Aligned | Partial | Partial | Partial | Partial | Gap | Policy support is solid; could connect to mission language elsewhere. |
| `app/support/page.js` | Partial | Gap | Gap | Partial | Partial | Gap | Primarily functional support contact page. |
| `app/tts/page.js` + `app/tts/[slug]/page.js` | Aligned | Aligned | Aligned | Aligned | Partial | Gap | Good SEO bridge; mission line not explicit. |
| `content/news/*.md` + `app/news/*` | Partial | Aligned | Partial | Aligned | Partial | Partial | Good launch narrative; add more mission/partner stories. |
| `README.md` | Partial | Partial | Partial | Aligned | Partial | Gap | Developer-focused docs; not a full messaging source. |
| `public/llms.txt` + `public/llms-full.txt` | Partial | Aligned | Partial | Aligned | Partial | Gap | Useful machine-readable summary, but mission can be clearer. |

## Immediate sync actions

1. Add explicit mission sentence on homepage and extension landing content.
2. Add concrete “special characters” benefit copy where markdown cleanup is already discussed.
3. Add a partner-facing block/page for archives, libraries, and publishers.
4. Update metadata snippets to include privacy-conscious and listener-quality framing where accurate.
5. Refresh this matrix after each content release.
