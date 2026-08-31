import { getSiteUrl } from '../lib/site-url.js';

// app/robots.js
// Dynamic robots.txt generation for SEO

export default function robots() {
  const baseUrl = getSiteUrl();
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/mcp'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

