import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '../../Breadcrumbs';
import JsonLd from '../../JsonLd';
import {
  getAllSlugs,
  getPostBySlug,
  markdownBodyToHtml,
} from '@/lib/news';
import { NEWS_AUTHOR, newsArticleSchema } from '@/lib/seo-schema';
import { getSiteUrl } from '@/lib/site-url';
import styles from './page.module.css';

const siteUrl = getSiteUrl();

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
    authors: [{ name: post.author || NEWS_AUTHOR }],
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
  const url = `${siteUrl}/news/${post.slug}`;
  const author = post.author || NEWS_AUTHOR;

  return (
    <div className={styles.page}>
      <JsonLd
        data={newsArticleSchema({
          title: post.title,
          description: post.description,
          url,
          date: post.date,
          author,
        })}
      />
      <header className={styles.header}>
        <Link href="/news" className={styles.backLink}>
          ← News
        </Link>
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'News', path: '/news' },
            { name: post.title, path: `/news/${post.slug}` },
          ]}
        />
      </header>
      <article className={styles.article}>
        <p className={styles.meta}>
          <time dateTime={post.date}>{formatNewsDate(post.date)}</time>
          {' · '}
          <span>{author}</span>
        </p>
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
        <Link href="/about">About</Link>
      </footer>
    </div>
  );
}
