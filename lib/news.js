/**
 * Loads markdown posts from `/content/news`. Each `.md` file uses YAML frontmatter:
 *
 * ---
 * title: string (required)
 * date: ISO date string YYYY-MM-DD (required)
 * slug: url-safe slug (recommended; fallback: basename without extension)
 * excerpt: short plain text for cards (optional — derived from body)
 * description: meta description SEO (optional)
 * tags: string[] optional
 * ---
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

const NEWS_DIR = path.join(process.cwd(), 'content', 'news');

marked.use({ gfm: true });

function plainExcerpt(markdownBody, limit = 200) {
  const text = markdownBody.replace(/[#*_`>-]/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= limit) return text;
  return `${text.slice(0, limit - 1).trim()}…`;
}

function parseDate(d) {
  const t = Date.parse(d);
  if (Number.isNaN(t)) return 0;
  return t;
}

function sortPostsDesc(posts) {
  return [...posts].sort((a, b) => parseDate(b.date) - parseDate(a.date));
}

async function parseFile(filePath, basename) {
  const raw = await fs.readFile(filePath, 'utf8');
  const { data, content } = matter(raw);
  const title = typeof data.title === 'string' ? data.title.trim() : '';
  let date = '';
  if (data.date instanceof Date && !Number.isNaN(data.date.getTime())) {
    date = data.date.toISOString().slice(0, 10);
  } else if (typeof data.date === 'string') {
    date = data.date.trim();
  }
  const slug =
    typeof data.slug === 'string' && data.slug.trim()
      ? data.slug.trim()
      : basename.replace(/\.md$/i, '');
  if (!title || !date || !slug) {
    console.warn('[news] Skipping file with missing title/date/slug:', basename);
    return null;
  }
  const excerpt =
    typeof data.excerpt === 'string' && data.excerpt.trim()
      ? data.excerpt.trim()
      : plainExcerpt(content);
  const description =
    typeof data.description === 'string' && data.description.trim()
      ? data.description.trim()
      : excerpt.slice(0, 160);

  /** @type {string[]} */
  const tags =
    Array.isArray(data.tags) && data.tags.length
      ? data.tags.map(String)
      : typeof data.tags === 'string'
        ? data.tags.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

  return {
    slug,
    title,
    date,
    excerpt,
    description,
    tags,
    body: content.trim(),
    sourceFilename: basename,
  };
}

export async function getAllNewsPostsMeta() {
  let names = [];
  try {
    names = await fs.readdir(NEWS_DIR);
  } catch {
    return [];
  }
  const md = names.filter((f) => f.endsWith('.md'));
  const parsed = [];
  for (const name of md) {
    const row = await parseFile(path.join(NEWS_DIR, name), name);
    if (row) parsed.push(row);
  }
  return sortPostsDesc(parsed);
}

export async function getLatestPosts(limit = 10) {
  const all = await getAllNewsPostsMeta();
  return all.slice(0, Math.max(0, limit)).map(({ slug, title, date, excerpt, description }) => ({
    slug,
    title,
    date,
    excerpt,
    description,
  }));
}

export async function getPostBySlug(slug) {
  const all = await getAllNewsPostsMeta();
  const found = all.find((p) => p.slug === slug);
  return found ?? null;
}

export async function markdownBodyToHtml(markdownBody) {
  return marked.parse(markdownBody ?? '', { async: false });
}

export async function getAllSlugs() {
  const meta = await getAllNewsPostsMeta();
  return meta.map((m) => m.slug);
}
