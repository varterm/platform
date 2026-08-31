import { getAllNewsPostsMeta } from '../lib/news.js';
import { getSiteUrl } from '../lib/site-url.js';

// Dynamic sitemap generation for SEO

export default async function sitemap() {
  const baseUrl = getSiteUrl();

  const entries = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/long-form-tts`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/markdown-to-speech`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/extensions`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/install-extensions`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/extensions/cursor`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/extensions/vscode`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/extensions/chrome`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/chatgpt-to-speech`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/github-readme-to-speech`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    {
      url: `${baseUrl}/tts`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.65,
    },
  ];

  let postsMeta = [];
  try {
    postsMeta = await getAllNewsPostsMeta();
  } catch {
    postsMeta = [];
  }

  for (const post of postsMeta) {
    entries.push({
      url: `${baseUrl}/news/${post.slug}`,
      lastModified: new Date(parseDateFallback(post.date)),
      changeFrequency: 'monthly',
      priority: 0.72,
    });
  }

  return entries;
}

function parseDateFallback(isoShort) {
  if (!isoShort || typeof isoShort !== 'string') return Date.now();
  const trimmed = isoShort.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const t = Date.parse(`${trimmed}T12:00:00Z`);
    return Number.isNaN(t) ? Date.now() : t;
  }
  const t = Date.parse(trimmed);
  return Number.isNaN(t) ? Date.now() : t;
}
