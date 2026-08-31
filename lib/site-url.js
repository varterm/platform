/** Public origin for canonical, sitemap, robots, and Open Graph URLs. */
export const CANONICAL_SITE_URL = 'https://varterm.com';

/**
 * Resolve the public site origin.
 * Preview hosts (*.vercel.app) and localhost are ignored so ranking
 * signals stay on varterm.com instead of splitting across deploy URLs.
 */
export function getSiteUrl(raw = process.env.NEXT_PUBLIC_BASE_URL) {
  const value = typeof raw === 'string' ? raw.trim() : '';
  if (!value) return CANONICAL_SITE_URL;

  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    if (
      host.endsWith('.vercel.app') ||
      host === 'localhost' ||
      host === '127.0.0.1'
    ) {
      return CANONICAL_SITE_URL;
    }
    if (host === 'www.varterm.com' || host === 'varterm.com') {
      return CANONICAL_SITE_URL;
    }
    return url.origin;
  } catch {
    return CANONICAL_SITE_URL;
  }
}
