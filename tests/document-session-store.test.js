import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createDocumentSession,
  getDocumentSession,
  getSessionTtlMs,
} from '../lib/document-session-store.js';

test('createDocumentSession returns session with id and ttl', async () => {
  const session = await createDocumentSession({
    chunks: [{ id: '1', path: 'a.txt', index: 0, startChar: 0, endChar: 10, text: 'hello' }],
    docSummaries: [{ path: 'a.txt', chunks: 1 }],
    totalChars: 5,
    options: { chunkSize: 1000, overlap: 100 },
  });

  assert.ok(session.sessionId);
  assert.ok(session.expiresAt > session.createdAt);
  assert.equal(getSessionTtlMs(), 1000 * 60 * 60);
});

test('getDocumentSession refreshes session expiration', async () => {
  const created = await createDocumentSession({
    chunks: [{ id: '2', path: 'b.txt', index: 0, startChar: 0, endChar: 10, text: 'world' }],
    docSummaries: [{ path: 'b.txt', chunks: 1 }],
    totalChars: 5,
    options: { chunkSize: 1000, overlap: 100 },
  });

  const firstRead = await getDocumentSession(created.sessionId);
  assert.ok(firstRead);
  assert.ok(firstRead.expiresAt >= created.expiresAt);
});
