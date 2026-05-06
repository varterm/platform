import test from 'node:test';
import assert from 'node:assert/strict';
import { chunkDocuments, pickRelevantChunks } from '../lib/document-ingestion.js';
import { createDocumentSession, getDocumentSession } from '../lib/document-session-store.js';

test('ingest to ask flow returns relevant source from chunked content', async () => {
  const documents = [
    {
      path: 'src/auth/session.ts',
      content:
        'Session auth validates bearer tokens with strict expiry checks. '.repeat(60) +
        'Refresh token handling is done in auth/session.ts.',
    },
    {
      path: 'src/ui/theme.ts',
      content: 'Theme tokens and palette settings for buttons and cards. '.repeat(60),
    },
  ];

  const ingestion = chunkDocuments(documents, {
    chunkSize: 900,
    overlap: 120,
    maxChunks: 200,
    maxTotalChars: 100000,
  });

  assert.ok(ingestion.chunks.length > 0);
  const session = await createDocumentSession({
    chunks: ingestion.chunks,
    docSummaries: ingestion.docSummaries,
    totalChars: ingestion.totalChars,
    options: { chunkSize: ingestion.chunkSize, overlap: ingestion.overlap },
  });

  const restored = await getDocumentSession(session.sessionId);
  assert.ok(restored);

  const relevant = pickRelevantChunks(
    'Where is bearer token auth validated and session expiry enforced?',
    restored.chunks,
    { maxChunks: 5, maxContextChars: 10000 }
  );

  assert.ok(relevant.length > 0);
  assert.equal(relevant[0].path, 'src/auth/session.ts');
  assert.ok(relevant.every((item) => typeof item.startChar === 'number'));
});
