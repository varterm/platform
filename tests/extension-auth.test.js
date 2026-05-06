import test from 'node:test';
import assert from 'node:assert/strict';

test('checkExtensionAuth passes when token requirement is not set', async () => {
  delete process.env.VARTERM_EXTENSION_API_TOKEN;
  const module = await import(`../lib/extension-auth.js?ts=${Date.now()}`);
  const result = module.checkExtensionAuth(new Request('https://example.com/api/ingest'));
  assert.equal(result.ok, true);
});

test('checkExtensionAuth rejects missing bearer token when configured', async () => {
  process.env.VARTERM_EXTENSION_API_TOKEN = 'secret-token';
  const module = await import(`../lib/extension-auth.js?ts=${Date.now()}`);
  const result = module.checkExtensionAuth(new Request('https://example.com/api/ingest'));
  assert.equal(result.ok, false);
  assert.equal(result.status, 401);
});

test('checkExtensionAuth accepts matching bearer token when configured', async () => {
  process.env.VARTERM_EXTENSION_API_TOKEN = 'secret-token';
  const module = await import(`../lib/extension-auth.js?ts=${Date.now()}`);
  const request = new Request('https://example.com/api/ingest', {
    headers: {
      Authorization: 'Bearer secret-token',
    },
  });
  const result = module.checkExtensionAuth(request);
  assert.equal(result.ok, true);
});
