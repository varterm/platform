import test from 'node:test';
import assert from 'node:assert/strict';
import { chunkDocuments, pickRelevantChunks } from '../lib/document-ingestion.js';

test('chunkDocuments splits content and preserves path metadata', () => {
  const longText = 'alpha beta gamma '.repeat(300);
  const result = chunkDocuments(
    [{ path: 'src/file-a.ts', content: longText }],
    { chunkSize: 300, overlap: 50, maxChunks: 50, maxTotalChars: 20000 }
  );

  assert.ok(result.chunks.length > 1);
  assert.equal(result.docSummaries.length, 1);
  assert.equal(result.docSummaries[0].path, 'src/file-a.ts');
  assert.equal(result.truncated, false);
  assert.ok(result.totalChars > 0);
  assert.ok(result.chunks.every((chunk) => chunk.path === 'src/file-a.ts'));
});

test('chunkDocuments truncates when maxTotalChars is reached', () => {
  const result = chunkDocuments(
    [{ path: 'docs/huge.md', content: 'x'.repeat(5000) }],
    { chunkSize: 1000, overlap: 100, maxChunks: 50, maxTotalChars: 1200 }
  );

  assert.equal(result.truncated, true);
  assert.ok(result.totalChars <= 2000);
  assert.ok(result.chunks.length >= 1);
});

test('pickRelevantChunks prefers matching chunks', () => {
  const chunked = chunkDocuments(
    [
      { path: 'src/auth.ts', content: 'token auth bearer header validation'.repeat(40) },
      { path: 'src/ui.ts', content: 'button theme spacing typography'.repeat(40) },
    ],
    { chunkSize: 500, overlap: 50, maxChunks: 20, maxTotalChars: 10000 }
  );

  const selected = pickRelevantChunks('where is bearer token auth validated', chunked.chunks, {
    maxChunks: 4,
    maxContextChars: 3000,
  });

  assert.ok(selected.length > 0);
  assert.equal(selected[0].path, 'src/auth.ts');
});
