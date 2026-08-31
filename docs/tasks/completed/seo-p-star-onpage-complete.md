# SEO P1–P4 on-page optimizations — complete

Date: 2026-08-31

## What shipped

- Homepage-only WebApplication + FAQ JSON-LD; Organization schema in the root layout.
- NewsArticle JSON-LD, author + date on `/news/[slug]`, BreadcrumbList on subpages.
- Deleted `meta keywords`. Unified title suffix to `Varterm TTS`.
- Contextual homepage links and descriptive news anchors.
- `/tts/[slug]` 301s to real URLs. New pages for About, Cursor, VS Code, Chrome, ChatGPT, GitHub READMEs.

## Deployed

- 2026-08-31 production deploy to `jc-jcios-projects/varterm`.
- Inspect: https://vercel.com/jc-jcios-projects/varterm/81TJqhu8siaWXsZBFsYViUJHzGtM
- Live checks: new landing pages 200, canonicals on `varterm.com`, `varterm.vercel.app` 308 + `noindex`.

## Left for later (not code)

- Google Search Console / Bing verification and sitemap submit.
- Apex↔www 301 (Vercel primary domain).
- Marketplace listing copy and directory launches.
- Core Web Vitals measurement.
