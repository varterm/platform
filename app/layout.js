import './globals.css';

export const metadata = {
  title: 'Varterm — Free Text to Speech Reader',
  description: 'Convert any text to natural-sounding speech with premium AI voices. Free to use, with optional upgrades for HD quality.',
  keywords: 'text to speech, TTS, AI voices, speech synthesis, read aloud, accessibility',
  openGraph: {
    title: 'Varterm — Free Text to Speech Reader',
    description: 'Convert any text to natural-sounding speech with premium AI voices.',
    url: 'https://varterm.com',
    siteName: 'Varterm',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Varterm — Free Text to Speech Reader',
    description: 'Convert any text to natural-sounding speech with premium AI voices.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Fraunces:wght@600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
