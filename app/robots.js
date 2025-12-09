// app/robots.js
// Dynamic robots.txt generation for SEO

export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://varterm.com';
  
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

