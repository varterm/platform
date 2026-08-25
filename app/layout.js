import './globals.css';
import { HOMEPAGE_FAQ, faqSchemaFromEntries } from '@/lib/seo-faq.js';

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://varterm.com';
const GA_MEASUREMENT_ID = 'G-REDTPLJXE9';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Free Text to Speech Converter | Varterm TTS',
    template: '%s | Varterm',
  },
  description:
    'Free text to speech converter with long-form support and markdown cleanup. In Cursor or VS Code, Auto-read plays the agent window; play, pause, stop, and jump from the status bar.',
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
    'cursor text to speech',
    'vscode text to speech',
    'chrome read aloud extension',
    'agent readout tts',
    'auto-read agent window',
    'cursor auto read tts',
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
    title: 'Free Text to Speech Converter | Varterm',
    description:
      'Convert long-form text and markdown to natural speech. Free, no signup, unlimited usage. Extensions for Cursor, VS Code, and Chrome.',
    url: siteUrl,
    siteName: 'Varterm',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Varterm TTS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Text to Speech Converter | Varterm',
    description:
      'Free text to speech with long-form support, markdown cleanup, and no signup. Web reader plus Cursor, VS Code, and Chrome extensions.',
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
  name: 'Varterm - Free Text to Speech Converter',
  description:
    'Free text to speech converter with long-form document support, markdown stripping, and natural neural voices. No signup required.',
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
    'No signup required',
    'Unlimited usage',
    'Multiple voice options',
    'No registration required',
    'Adjustable speed and pitch',
    'Cloud and offline voices',
    'ChatGPT and markdown to speech',
    'Cursor and VS Code extension support',
    'Auto-read the agent window with play, pause, stop, and jump',
  ],
};

const faqSchema = faqSchemaFromEntries(HOMEPAGE_FAQ);

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        {/* Google tag (gtag.js) — native head scripts so the ID is in the initial HTML */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `,
          }}
        />
        
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
      </body>
    </html>
  );
}
