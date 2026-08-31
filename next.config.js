import { ttsRedirects } from './lib/tts-seo-slugs.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        has: [{ type: 'host', value: 'varterm.vercel.app' }],
        destination: 'https://varterm.com/',
        permanent: true,
      },
      {
        source: '/:path+',
        has: [{ type: 'host', value: 'varterm.vercel.app' }],
        destination: 'https://varterm.com/:path+',
        permanent: true,
      },
      ...ttsRedirects(),
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: '(?<host>.+\\.vercel\\.app)' }],
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        // Allow CORS for API routes (needed for GPT Actions)
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-ElevenLabs-Api-Key',
          },
        ],
      },
    ];
  },
  // Fix for ws WebSocket library compatibility with Next.js
  experimental: {
    serverComponentsExternalPackages: ['ws', 'bufferutil', 'utf-8-validate', '@andresaya/edge-tts'],
  },
};

export default nextConfig;
