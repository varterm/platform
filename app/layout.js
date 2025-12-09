import './globals.css';
import Script from 'next/script';

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://varterm.com';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Varterm — Free Text to Speech Reader',
    template: '%s | Varterm',
  },
  description: 'Convert any text to natural-sounding speech with premium AI voices. Free to use, with optional upgrades for HD quality. Works with ChatGPT and Claude.',
  keywords: [
    'text to speech',
    'TTS',
    'AI voices',
    'speech synthesis',
    'read aloud',
    'accessibility',
    'ElevenLabs',
    'voice generator',
    'audio reader',
    'screen reader',
    'text reader online',
    'free TTS',
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
    description: 'Convert any text to natural-sounding speech with premium AI voices. Free to use, with optional upgrades for HD quality.',
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
  name: 'Varterm',
  description: 'Convert any text to natural-sounding speech with premium AI voices.',
  url: siteUrl,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: '0',
    highPrice: '29',
    offerCount: '4',
    offers: [
      {
        '@type': 'Offer',
        name: 'Free',
        price: '0',
        priceCurrency: 'USD',
        description: 'Unlimited browser voices',
      },
      {
        '@type': 'Offer',
        name: 'Starter',
        price: '5',
        priceCurrency: 'USD',
        description: '50,000 characters/month with 10 premium voices',
      },
      {
        '@type': 'Offer',
        name: 'Pro',
        price: '15',
        priceCurrency: 'USD',
        description: '200,000 characters/month with 30+ premium voices',
      },
      {
        '@type': 'Offer',
        name: 'Unlimited',
        price: '29',
        priceCurrency: 'USD',
        description: 'Unlimited characters with all 50+ Ultra HD voices',
      },
    ],
  },
  featureList: [
    'Free browser-native voices',
    'Premium AI voices via ElevenLabs',
    'ChatGPT integration',
    'Claude MCP integration',
    'Adjustable speed and pitch',
    'Multiple voice options',
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
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Fraunces:wght@600;700&display=swap" 
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
