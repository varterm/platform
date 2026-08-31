/**
 * Long-tail /tts/[slug] routes. Each slug either keeps its own URL or
 * 301s to a real landing page — never to the homepage as a fake target.
 */
export const TTS_SEO_SLUGS = [
  {
    slug: 'chatgpt-to-speech',
    phrase: 'ChatGPT to Speech',
    description:
      'Listen to ChatGPT answers aloud. Paste AI output, strip markdown, and play natural speech instantly — free, no signup.',
    canonicalPath: '/chatgpt-to-speech',
  },
  {
    slug: 'markdown-to-speech-online',
    phrase: 'Markdown to Speech Online',
    description:
      'Convert markdown notes and READMEs to clean audio. Headers, links, and code blocks are stripped for natural read-aloud.',
    canonicalPath: '/markdown-to-speech',
  },
  {
    slug: 'long-form-text-to-speech',
    phrase: 'Long Form Text to Speech',
    description:
      'Convert long documents, articles, and ebooks to speech with automatic chunking and unlimited length support.',
    canonicalPath: '/long-form-tts',
  },
  {
    slug: 'document-to-speech',
    phrase: 'Document to Speech',
    description:
      'Turn documents into audio in your browser. Free text to speech with no account required.',
    canonicalPath: '/long-form-tts',
  },
  {
    slug: 'read-aloud-online',
    phrase: 'Read Aloud Online',
    description:
      'Free online read-aloud tool for web text, docs, and selections. Paste, play, and listen in seconds.',
    canonicalPath: '/',
  },
  {
    slug: 'text-to-speech-no-signup',
    phrase: 'Text to Speech No Signup',
    description:
      'Free text to speech with no signup and unlimited usage. Open the reader and start listening immediately.',
    canonicalPath: '/',
  },
  {
    slug: 'cursor-text-to-speech',
    phrase: 'Cursor Text to Speech',
    description:
      'Read editor selections and agent output aloud in Cursor with the Varterm extension, or paste text in the web reader.',
    canonicalPath: '/extensions/cursor',
  },
  {
    slug: 'vscode-read-aloud',
    phrase: 'VS Code Read Aloud',
    description:
      'Listen to code comments, docs, and selections in VS Code with Varterm, or use the free web reader.',
    canonicalPath: '/extensions/vscode',
  },
];

export function getTtsSlugEntry(slug) {
  const normalized = String(slug || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return TTS_SEO_SLUGS.find((entry) => entry.slug === normalized) || null;
}

export function ttsRedirects() {
  return TTS_SEO_SLUGS.filter((entry) => entry.canonicalPath !== `/tts/${entry.slug}`).map(
    (entry) => ({
      source: `/tts/${entry.slug}`,
      destination: entry.canonicalPath,
      permanent: true,
    }),
  );
}
