import Link from 'next/link';

function toTitleCase(input) {
  return input
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function normalizeSlug(rawSlug) {
  const safe = (rawSlug || '').toString().toLowerCase().trim();
  return safe.replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function phraseFromSlug(slug) {
  if (!slug) {
    return 'Text to Speech';
  }
  return toTitleCase(slug.replace(/-/g, ' '));
}

export async function generateMetadata({ params }) {
  const slug = normalizeSlug(params?.slug);
  const phrase = phraseFromSlug(slug);
  const canonicalSlug = slug || 'text-to-speech';

  return {
    title: `${phrase} | Free Text to Speech`,
    description: `Free ${phrase.toLowerCase()} with no signup and unlimited usage. Paste text and listen instantly.`,
    alternates: {
      canonical: `/tts/${canonicalSlug}`,
    },
  };
}

export default function TtsSlugPage({ params }) {
  const slug = normalizeSlug(params?.slug);
  const phrase = phraseFromSlug(slug);

  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '56px 20px' }}>
      <h1>{phrase}</h1>
      <p>
        Free text to speech with no signup and unlimited usage. Paste text, press play, and listen
        in seconds.
      </p>
      <p>
        Works well for long-form docs, notes, and markdown with cloud, browser, and offline voice
        options.
      </p>
      <p>
        <Link href="/">Open the reader</Link> or <Link href="/tts">view all text-to-speech options</Link>.
      </p>
    </main>
  );
}
