import Link from 'next/link';

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://varterm.com';

export const metadata = {
  title: 'More Text to Speech Options',
  description:
    'Supporting pages for Varterm free text to speech. Use the main online reader for the fastest experience.',
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TtsPage() {
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '56px 20px' }}>
      <h1>Free Text to Speech Options</h1>
      <p>
        The primary free text to speech reader lives on the{' '}
        <Link href="/">Varterm homepage</Link>. Paste text there for instant playback — no signup,
        unlimited use, long-form chunking, and markdown cleanup.
      </p>
      <p>
        For deeper guides, see our{' '}
        <Link href="/long-form-tts">long-form text to speech guide</Link> and{' '}
        <Link href="/markdown-to-speech">markdown to speech guide</Link>, or{' '}
        <Link href="/extensions">install extensions</Link> for Cursor, VS Code, and Chrome.
      </p>
      <p>
        <Link href="/">Open the free text to speech reader →</Link>
      </p>
    </main>
  );
}
