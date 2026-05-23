import test from 'node:test';
import assert from 'node:assert/strict';
import { HOMEPAGE_FAQ, faqSchemaFromEntries } from '../lib/seo-faq.js';
import { TTS_SEO_SLUGS, getTtsSlugEntry } from '../lib/tts-seo-slugs.js';

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

test('getTtsSlugEntry resolves curated slugs only', () => {
  assert.ok(getTtsSlugEntry('chatgpt-to-speech'));
  assert.equal(getTtsSlugEntry('random-slug'), null);
  assert.equal(TTS_SEO_SLUGS.length, 8);
});
