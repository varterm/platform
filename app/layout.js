import './globals.css';
import Script from 'next/script';

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://varterm.com';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Varterm — Free Text to Speech Reader',
    template: '%s | Varterm',
  },
  description: 'Free online text to speech converter. Convert long form text to natural speech, strip markdown automatically. No login required, unlimited use. Premium AI voices available.',
  keywords: [
    'free tts',
    'text to speech online',
    'free text to speech',
    'long form tts',
    'strip markdown tts',
    'markdown to speech',
    'bulk text to speech',
    'online tts converter',
    'tts without login',
    'unlimited tts',
    'AI voices',
    'speech synthesis',
    'read aloud',
    'accessibility',
    'voice generator',
    'audio reader',
    'text reader online',
  ],
  authors: [{ name: 'Varterm' }],
  creator: 'Varterm',
  publisher: 'Varterm',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Varterm — Free Text to Speech Reader',
    description: 'Free online text to speech converter. Convert long form text to natural speech, strip markdown automatically. No login required.',
    url: siteUrl,
    siteName: 'Varterm',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Varterm - Free Text to Speech Reader',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Varterm — Free Text to Speech Reader',
    description: 'Convert any text to natural-sounding speech with premium AI voices.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when you have them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: siteUrl,
  },
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Varterm - Free Text to Speech Online',
  description: 'Free online text to speech converter. Convert long form text to natural speech, strip markdown automatically. No login required.',
  url: siteUrl,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free text to speech conversion with no limits',
  },
  featureList: [
    'Free text to speech conversion',
    'Long form document support',
    'Markdown stripping',
    'Multiple voice options',
    'No registration required',
    'Adjustable speed and pitch',
    'Cloud and offline voices',
  ],
};

// FAQ Schema for rich snippets
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is this text to speech tool free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Varterm is completely free to use with no hidden charges or registration required. You get unlimited access to browser voices and high-quality Microsoft neural voices.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I convert long documents to speech?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Varterm supports long form text to speech conversion for documents of any length. Large texts are automatically split into chunks and played sequentially for seamless listening.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it strip markdown formatting?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Varterm can automatically strip markdown formatting (headers, bold, links, code blocks, etc.) for clean, natural-sounding speech output. Just enable the "Strip Markdown" option.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to create an account?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, Varterm works without any login or registration. Just paste your text and click play. Your privacy is protected - we don\'t store your text or track your usage.',
      },
    },
    {
      '@type': 'Question',
      name: 'What voices are available?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Varterm offers three tiers of voices: Cloud voices (Microsoft neural voices with natural quality), Browser voices (your device\'s built-in voices), and Offline voices (Piper AI that runs locally in your browser).',
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://beamanalytics.b-cdn.net" />
        
        {/* Google Fonts */}
        <link 
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Fraunces:wght@600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" 
          rel="stylesheet" 
        />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body>
        {children}
        
        {/* Beam Analytics */}
        <Script
          src="https://beamanalytics.b-cdn.net/beam.min.js"
          data-token="37539b5e-edb0-4294-b209-742917e4c6b4"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
