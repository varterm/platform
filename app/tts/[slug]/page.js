import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TTS_SEO_SLUGS, getTtsSlugEntry } from '@/lib/tts-seo-slugs';

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://varterm.com';

export function generateStaticParams() {
  return TTS_SEO_SLUGS.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }) {
  const entry = getTtsSlugEntry(params?.slug);
  if (!entry) {
    return {
      title: 'Text to Speech',
      robots: { index: false, follow: true },
    };
  }

  return {
    title: `${entry.phrase} — Free Online Reader`,
    description: entry.description,
    alternates: {
      canonical: siteUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function TtsSlugPage({ params }) {
  const entry = getTtsSlugEntry(params?.slug);
  if (!entry) {
    notFound();
  }

  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '56px 20px' }}>
      <h1>{entry.phrase}</h1>
      <p>{entry.description}</p>
      <p>
        Varterm&apos;s main <Link href="/">free text to speech reader</Link> handles long documents,
        markdown cleanup, and natural neural voices with no signup required.
      </p>
      <p>
        Related: <Link href="/markdown-to-speech">markdown to speech guide</Link>
        {' · '}
        <Link href="/long-form-tts">long-form TTS guide</Link>
        {' · '}
        <Link href="/extensions">editor extensions</Link>
      </p>
      <p>
        <Link href="/">Open the free text to speech reader →</Link>
      </p>
    </main>
  );
}
