import Link from 'next/link';
import Breadcrumbs from '../Breadcrumbs';

export const metadata = {
  title: 'More Text to Speech Options',
  description:
    'Guides and landing pages for Varterm TTS: long-form reading, markdown cleanup, ChatGPT answers, and editor extensions.',
  alternates: {
    canonical: '/tts',
  },
};

export default function TtsPage() {
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '56px 20px' }}>
      <Breadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'TTS options', path: '/tts' },
        ]}
      />
      <h1>Free Text to Speech Options</h1>
      <p>
        The primary reader is the <Link href="/">Varterm homepage</Link>. These pages target a
        single job each:
      </p>
      <ul>
        <li>
          <Link href="/long-form-tts">Long-form text to speech</Link>
        </li>
        <li>
          <Link href="/markdown-to-speech">Markdown to speech</Link>
        </li>
        <li>
          <Link href="/chatgpt-to-speech">ChatGPT to speech</Link>
        </li>
        <li>
          <Link href="/github-readme-to-speech">Listen to GitHub READMEs</Link>
        </li>
        <li>
          <Link href="/extensions/cursor">Cursor text to speech</Link>
        </li>
        <li>
          <Link href="/extensions/vscode">VS Code text to speech</Link>
        </li>
        <li>
          <Link href="/extensions/chrome">Chrome text to speech extension</Link>
        </li>
      </ul>
    </main>
  );
}
