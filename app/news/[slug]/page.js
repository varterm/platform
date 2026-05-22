import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAllSlugs,
  getPostBySlug,
  markdownBodyToHtml,
} from '@/lib/news';
import styles from './page.module.css';

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://varterm.com';

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return { title: 'Post not found' };
  }

  const url = `${siteUrl}/news/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      url,
    },
  };
}

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

export default async function NewsPostPage({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  const html = await markdownBodyToHtml(post.body);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/news" className={styles.backLink}>
          ← News
        </Link>
      </header>
      <article className={styles.article}>
        <time dateTime={post.date} className={styles.meta}>
          {formatNewsDate(post.date)}
        </time>
        <h1>{post.title}</h1>
        {post.tags.length > 0 && (
          <ul className={styles.tags} aria-label="Topics">
            {post.tags.map((tag) => (
              <li key={tag} className={styles.tag}>
                #{tag}
              </li>
            ))}
          </ul>
        )}
        <div className={`${styles.prose}`} dangerouslySetInnerHTML={{ __html: html }} />
      </article>
      <footer className={styles.footer}>
        <Link href="/">Web app</Link>
        <Link href="/extensions">Extensions</Link>
      </footer>
    </div>
  );
}
