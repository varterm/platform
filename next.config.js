/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Allow CORS for API routes (needed for GPT Actions)
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, Cookie, X-ElevenLabs-Api-Key',
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
