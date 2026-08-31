import './globals.css';
import JsonLd from './JsonLd';
import { organizationSchema } from '@/lib/seo-schema.js';
import { getSiteUrl } from '@/lib/site-url.js';

const siteUrl = getSiteUrl();
const GA_MEASUREMENT_ID = 'G-REDTPLJXE9';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Free Text to Speech Converter | Varterm TTS',
    template: '%s | Varterm TTS',
  },
  description:
    'Free text to speech with long-form support and markdown cleanup. Agent Auto-read speaks your Cursor agent replies — one install, every window, zero echo.',
  authors: [{ name: 'Varterm' }],
  creator: 'Varterm',
  publisher: 'Varterm',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Free Text to Speech Converter | Varterm TTS',
    description:
      'Convert long-form text and markdown to natural speech. Free, no signup, unlimited usage. Extensions for Cursor, VS Code, and Chrome.',
    url: siteUrl,
    siteName: 'Varterm TTS',
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
    title: 'Free Text to Speech Converter | Varterm TTS',
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />

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

        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Fraunces:wght@600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />

        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        <JsonLd data={organizationSchema()} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
