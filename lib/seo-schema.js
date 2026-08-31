import { GITHUB_EXTENSIONS_REPO } from './extension-links.js';
import { CANONICAL_SITE_URL } from './site-url.js';

export const BRAND = 'Varterm TTS';
export const NEWS_AUTHOR = 'Varterm';

export function absoluteUrl(path = '/') {
  if (!path || path === '/') return CANONICAL_SITE_URL;
  if (path.startsWith('http')) return path;
  return `${CANONICAL_SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Varterm',
    url: CANONICAL_SITE_URL,
    sameAs: ['https://github.com/varterm', GITHUB_EXTENSIONS_REPO],
  };
}

export function webApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Varterm - Free Text to Speech Converter',
    description:
      'Free text to speech converter with long-form document support, markdown stripping, and natural neural voices. No signup required.',
    url: CANONICAL_SITE_URL,
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
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function newsArticleSchema({ title, description, url, date, author = NEWS_AUTHOR }) {
  const isoDate = /^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T12:00:00Z` : date;
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description,
    url,
    datePublished: isoDate,
    dateModified: isoDate,
    author: { '@type': 'Organization', name: author },
    publisher: {
      '@type': 'Organization',
      name: 'Varterm',
      url: CANONICAL_SITE_URL,
    },
    mainEntityOfPage: url,
  };
}
