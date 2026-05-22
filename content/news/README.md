Add a `.md` file here with YAML frontmatter, then redeploy:

```yaml
---
title: Readable headline for humans + SEO
slug: url-safe-slug-or-omit-it # defaults to filename without .md
date: YYYY-MM-DD
description: Meta description (~160 chars recommended)
excerpt: Optional card text; stripped from Markdown when omitted.
tags:
  - optional-topic
---

Your Markdown body...
```

YAML may coerce bare dates — this is handled in `lib/news.js`.
