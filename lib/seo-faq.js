/** Shared homepage FAQ copy — keep in sync with layout.js JSON-LD. */
export const HOMEPAGE_FAQ = [
  {
    question: 'Is this text to speech tool really free?',
    answer:
      'Yes. Varterm is free to use with no hidden charges and no registration. You get unlimited access to Microsoft neural cloud voices, offline Piper voices that run on your own machine, and your browser voices. A studio-grade ElevenLabs tier is planned as an optional paid add-on, and the existing voices stay free.',
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
      'Varterm runs more than one engine behind the same player. Cloud voices use Microsoft neural voices for realistic speech with nothing to download. Offline Piper voices run locally in your browser, so your text never leaves the device. Your device built-in browser voices are also available. Studio-grade ElevenLabs voices are planned as a paid add-on.',
  },
  {
    question: 'Which voice engine should I choose?',
    answer:
      'Choose offline Piper voices when the text is confidential or you are working without a network, since synthesis happens entirely on your device. Choose cloud neural voices for the most natural free quality with no model download. Both are free; a paid studio tier using ElevenLabs is planned for the most lifelike delivery.',
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
