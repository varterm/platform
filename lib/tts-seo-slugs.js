/** Curated long-tail TTS landing slugs — indexed with canonical consolidation to homepage. */
export const TTS_SEO_SLUGS = [
  {
    slug: 'chatgpt-to-speech',
    phrase: 'ChatGPT to Speech',
    description:
      'Listen to ChatGPT answers aloud. Paste AI output, strip markdown, and play natural speech instantly — free, no signup.',
  },
  {
    slug: 'markdown-to-speech-online',
    phrase: 'Markdown to Speech Online',
    description:
      'Convert markdown notes and READMEs to clean audio. Headers, links, and code blocks are stripped for natural read-aloud.',
  },
  {
    slug: 'long-form-text-to-speech',
    phrase: 'Long Form Text to Speech',
    description:
      'Convert long documents, articles, and ebooks to speech with automatic chunking and unlimited length support.',
  },
  {
    slug: 'document-to-speech',
    phrase: 'Document to Speech',
    description:
      'Turn documents into audio in your browser. Free text to speech with no account required.',
  },
  {
    slug: 'read-aloud-online',
    phrase: 'Read Aloud Online',
    description:
      'Free online read-aloud tool for web text, docs, and selections. Paste, play, and listen in seconds.',
  },
  {
    slug: 'text-to-speech-no-signup',
    phrase: 'Text to Speech No Signup',
    description:
      'Free text to speech with no signup and unlimited usage. Open the reader and start listening immediately.',
  },
  {
    slug: 'cursor-text-to-speech',
    phrase: 'Cursor Text to Speech',
    description:
      'Read editor selections and agent output aloud in Cursor with the Varterm extension, or paste text in the web reader.',
  },
  {
    slug: 'vscode-read-aloud',
    phrase: 'VS Code Read Aloud',
    description:
      'Listen to code comments, docs, and selections in VS Code with Varterm, or use the free web reader.',
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
