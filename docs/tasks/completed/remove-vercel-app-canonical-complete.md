# Remove vercel.app from public SEO — complete

Date: 2026-08-31

## What shipped

- Live `NEXT_PUBLIC_BASE_URL` on the `varterm` Vercel project is now `https://varterm.com` (production, preview, development).
- Production was redeployed. Homepage, subpages, robots.txt, and sitemap no longer mention `vercel.app`.
- Canonical / `og:url` / `og:image` / Twitter image now use `https://varterm.com`.
- Code hardening (not in this redeploy): `lib/site-url.js` ignores `*.vercel.app`; `next.config.js` + `vercel.json` 301 `varterm.vercel.app` → `varterm.com` and send `X-Robots-Tag: noindex` on `*.vercel.app`.

## How to verify

- `curl -sL https://www.varterm.com/` — canonical and og URLs are `https://varterm.com`, zero `vercel.app` strings.
- `curl -sL https://www.varterm.com/robots.txt` — sitemap is `https://varterm.com/sitemap.xml`.
- `curl -sL https://www.varterm.com/sitemap.xml` — every `<loc>` is `varterm.com`.

## Follow-ups

- Deploy the working-tree 301 / noindex so `varterm.vercel.app` stops returning 200 (it already canonicalizes to `varterm.com`).
- Remaining SEO audit items are in `docs/tasks/current.md`.
