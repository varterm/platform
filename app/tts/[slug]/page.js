import { notFound, redirect } from 'next/navigation';
import { getTtsSlugEntry, TTS_SEO_SLUGS } from '@/lib/tts-seo-slugs';

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
      canonical: entry.canonicalPath,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function TtsSlugPage({ params }) {
  const entry = getTtsSlugEntry(params?.slug);
  if (!entry) {
    notFound();
  }

  redirect(entry.canonicalPath);
}
