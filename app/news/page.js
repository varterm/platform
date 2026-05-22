import Link from 'next/link';
import { getAllNewsPostsMeta } from '@/lib/news';
import styles from './page.module.css';

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://varterm.com';

export const metadata = {
  title: 'News',
  description:
    'Product updates for Varterm TTS: Chrome extension, Cursor, VS Code installs, roadmap notes, and shareable changelog entries.',
  alternates: { canonical: `${siteUrl}/news` },
  openGraph: {
    title: 'Varterm News',
    description: 'Ship notes and announcements for extensions, web playback, and TTS tooling.',
    url: `${siteUrl}/news`,
  },
};

function formatNewsDate(isoDate) {
  if (!isoDate || typeof isoDate !== 'string') return '';
  const trimmed = isoDate.trim();
  const d = /^\d{4}-\d{2}-\d{2}$/.test(trimmed)
    ? new Date(`${trimmed}T12:00:00Z`)
    : new Date(trimmed);
  if (Number.isNaN(d.getTime())) return trimmed;
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function NewsIndexPage() {
  const posts = await getAllNewsPostsMeta();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← Varterm TTS
        </Link>
      </header>
      <main className={styles.main}>
        <header className={styles.intro}>
          <h1 id="feed-heading">News</h1>
          <p>
            Markdown-backed updates meant for newsletters, Reddit developer subs, SEO, or anyone
            auditing what shipped when.
          </p>
        </header>
        <nav className={styles.feed} aria-labelledby="feed-heading">
          <ul className={styles.list}>
            {posts.map((post) => (
              <li key={post.slug} className={styles.item}>
                <Link href={`/news/${post.slug}`} className={styles.itemLink}>
                  <time dateTime={post.date} className={styles.meta}>
                    {formatNewsDate(post.date)}
                  </time>
                  <span className={styles.itemTitle}>{post.title}</span>
                  <span className={styles.excerpt}>{post.excerpt}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {posts.length === 0 && (
          <p className={styles.empty}>
            Posts live in{' '}
            <code className={styles.mono}>content/news/*.md</code>
            {' — '}add Markdown with frontmatter to populate this archive.
          </p>
        )}
      </main>
      <footer className={styles.footer}>
        <Link href="/support">Support</Link>
        <Link href="/extensions">Extensions</Link>
      </footer>
    </div>
  );
}
