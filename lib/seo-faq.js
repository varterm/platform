/** Shared homepage FAQ copy — keep in sync with layout.js JSON-LD. */
export const HOMEPAGE_FAQ = [
  {
    question: 'Is this text to speech tool really free?',
    answer:
      'Yes, Varterm is completely free to use with no hidden charges or registration required. You get unlimited access to high-quality Microsoft neural voices and browser voices.',
  },
  {
    question: 'Can I convert long documents to speech?',
    answer:
      'Varterm supports long form text to speech conversion for documents of any length. Large texts are automatically split into chunks and played sequentially for seamless listening. There are no character limits.',
  },
  {
    question: 'Does it strip markdown formatting?',
    answer:
      'Yes. Enable the Strip Markdown option to remove headers, bold, links, code blocks, and other formatting for cleaner speech output. It works well for ChatGPT answers, GitHub READMEs, and docs.',
  },
  {
    question: 'Do I need to create an account?',
    answer:
      'No account or registration is needed. Paste your text and click play. Text is processed to generate audio, and we use basic analytics to improve site reliability.',
  },
  {
    question: 'What voices are available?',
    answer:
      'Varterm offers cloud voices (Microsoft neural voices with natural quality), browser voices (your device built-in voices), and offline Piper voices that run locally in your browser.',
  },
  {
    question: 'Can I use this for bulk text to speech conversion?',
    answer:
      'Yes. Paste articles, documentation, or ebooks of any length. Varterm chunks long text automatically for smooth playback without character limits.',
  },
];

export function faqSchemaFromEntries(entries) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
}
