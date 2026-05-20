import test from 'node:test';
import assert from 'node:assert/strict';

test('session token round trip', async () => {
  process.env.VARTERM_ACCOUNTS_ENABLED = 'true';
  process.env.VARTERM_AUTH_SECRET = 'test-secret-with-enough-length-32chars';
  const sessionModule = await import(`../lib/account-session.js?ts=${Date.now()}`);
  const token = sessionModule.createSessionToken('user-123');
  const verified = sessionModule.verifySessionToken(token);
  assert.ok(verified);
  assert.equal(verified.userId, 'user-123');
});

test('session token rejects tampered signature', async () => {
  process.env.VARTERM_AUTH_SECRET = 'test-secret-with-enough-length-32chars';
  const sessionModule = await import(`../lib/account-session.js?ts=${Date.now()}`);
  const token = sessionModule.createSessionToken('user-123');
  const tampered = `${token.slice(0, -1)}x`;
  assert.equal(sessionModule.verifySessionToken(tampered), null);
});
