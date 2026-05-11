import Link from 'next/link';

export const metadata = {
  title: 'Free Text to Speech | No Signup, Unlimited Usage',
  description:
    'Free text to speech with no signup and unlimited usage. Read long-form text, docs, and markdown aloud in your browser.',
  alternates: {
    canonical: '/tts',
  },
};

export default function TtsPage() {
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '56px 20px' }}>
      <h1>Free Text to Speech</h1>
      <p>
        No signup. Unlimited usage. Paste text and listen instantly with cloud, browser, or offline
        voices.
      </p>
      <p>
        Built for long-form docs and markdown-heavy content, with playback controls and fast
        generation.
      </p>
      <p>
        <Link href="/">Open the reader</Link> or <Link href="/extensions">install extensions</Link>.
      </p>
    </main>
  );
}
