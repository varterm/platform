import test from 'node:test';
import assert from 'node:assert/strict';
import { HOMEPAGE_FAQ, faqSchemaFromEntries } from '../lib/seo-faq.js';
import {
  breadcrumbSchema,
  newsArticleSchema,
  organizationSchema,
  webApplicationSchema,
} from '../lib/seo-schema.js';
import { CANONICAL_SITE_URL, getSiteUrl } from '../lib/site-url.js';
import { TTS_SEO_SLUGS, getTtsSlugEntry, ttsRedirects } from '../lib/tts-seo-slugs.js';

test('HOMEPAGE_FAQ entries have question and answer', () => {
  assert.ok(HOMEPAGE_FAQ.length >= 5);
  for (const item of HOMEPAGE_FAQ) {
    assert.ok(item.question.length > 10);
    assert.ok(item.answer.length > 20);
  }
});

test('faqSchemaFromEntries mirrors homepage FAQ text', () => {
  const schema = faqSchemaFromEntries(HOMEPAGE_FAQ.slice(0, 2));
  assert.equal(schema.mainEntity.length, 2);
  assert.equal(schema.mainEntity[0].name, HOMEPAGE_FAQ[0].question);
  assert.equal(schema.mainEntity[0].acceptedAnswer.text, HOMEPAGE_FAQ[0].answer);
});

test('getSiteUrl keeps public metadata on varterm.com', () => {
  assert.equal(CANONICAL_SITE_URL, 'https://varterm.com');
  assert.equal(getSiteUrl(undefined), 'https://varterm.com');
  assert.equal(getSiteUrl(''), 'https://varterm.com');
  assert.equal(getSiteUrl('https://varterm.com'), 'https://varterm.com');
  assert.equal(getSiteUrl('https://www.varterm.com'), 'https://varterm.com');
  assert.equal(getSiteUrl('https://varterm.vercel.app'), 'https://varterm.com');
  assert.equal(getSiteUrl('https://varterm-git-main.vercel.app'), 'https://varterm.com');
  assert.equal(getSiteUrl('http://localhost:3000'), 'https://varterm.com');
});

test('getTtsSlugEntry resolves curated slugs only', () => {
  assert.ok(getTtsSlugEntry('chatgpt-to-speech'));
  assert.equal(getTtsSlugEntry('random-slug'), null);
  assert.equal(TTS_SEO_SLUGS.length, 8);
});

test('tts slugs redirect to real landing pages, not self-canonical homepage stubs', () => {
  const redirects = ttsRedirects();
  assert.equal(redirects.length, TTS_SEO_SLUGS.length);
  assert.equal(
    getTtsSlugEntry('chatgpt-to-speech').canonicalPath,
    '/chatgpt-to-speech',
  );
  assert.equal(
    getTtsSlugEntry('cursor-text-to-speech').canonicalPath,
    '/extensions/cursor',
  );
  assert.ok(redirects.every((rule) => rule.destination !== '/tts/' + rule.source.replace('/tts/', '')));
});

test('organization schema points at GitHub', () => {
  const schema = organizationSchema();
  assert.equal(schema['@type'], 'Organization');
  assert.ok(schema.sameAs.includes('https://github.com/varterm'));
});

test('web application schema stays free', () => {
  const schema = webApplicationSchema();
  assert.equal(schema['@type'], 'WebApplication');
  assert.equal(schema.offers.price, '0');
});

test('breadcrumb and news article schemas use varterm.com', () => {
  const crumbs = breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'News', path: '/news' },
  ]);
  assert.equal(crumbs.itemListElement[1].item, 'https://varterm.com/news');
  const article = newsArticleSchema({
    title: 'Ship note',
    description: 'What shipped',
    url: 'https://varterm.com/news/ship-note',
    date: '2026-08-25',
  });
  assert.equal(article['@type'], 'NewsArticle');
  assert.equal(article.author.name, 'Varterm');
  assert.ok(article.datePublished.startsWith('2026-08-25'));
});
