import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSynthesisUrl,
  EDGE_TTS_WSS_URL,
  isRetryableSynthesisError,
  secMsGecToken,
  synthesizeWithRetries,
} from '../lib/edge-tts-client.js';

test('synthesis URL uses the new host and Ocp-Apim-Subscription-Key', () => {
  const url = buildSynthesisUrl({
    token: '6A5AA1D4EAFF4E9FB37E23D68491D6F4',
    secMsGEC: 'ABC123',
    version: '1-143.0.3650',
    connectionId: 'req-1',
  });

  const parsed = new URL(url);
  assert.equal(parsed.protocol, 'wss:');
  assert.equal(parsed.host, 'api.msedgeservices.com');
  assert.equal(parsed.pathname, '/tts/cognitiveservices/websocket/v1');
  assert.equal(parsed.searchParams.get('Ocp-Apim-Subscription-Key'), '6A5AA1D4EAFF4E9FB37E23D68491D6F4');
  assert.equal(parsed.searchParams.get('Sec-MS-GEC'), 'ABC123');
  assert.equal(parsed.searchParams.get('Sec-MS-GEC-Version'), '1-143.0.3650');
  assert.equal(parsed.searchParams.get('ConnectionId'), 'req-1');
  assert.equal(parsed.searchParams.has('TrustedClientToken'), false);
  assert.equal(EDGE_TTS_WSS_URL, `${parsed.protocol}//${parsed.host}${parsed.pathname}`);
});

test('token is a 5-minute-window hash and the next window differs', async () => {
  const first = await secMsGecToken(new Date('2026-10-19T17:00:00Z'));
  const sameWindow = await secMsGecToken(new Date('2026-10-19T17:04:59Z'));
  const nextWindow = await secMsGecToken(new Date('2026-10-19T17:05:00Z'));
  assert.match(first, /^[0-9A-F]{64}$/);
  assert.equal(first, sameWindow);
  assert.notEqual(first, nextWindow);
});

test('a dropped socket is retried and a hung socket is not', async () => {
  let calls = 0;
  const audio = await synthesizeWithRetries(async () => {
    calls += 1;
    if (calls < 3) {
      throw new Error('Unexpected server response: 403');
    }
    return Buffer.from('mp3');
  }, { delayMs: 0 });
  assert.equal(calls, 3);
  assert.equal(audio.toString(), 'mp3');

  await assert.rejects(
    () => synthesizeWithRetries(async () => Buffer.alloc(0), { delayMs: 0, tries: 2 }),
    /closed before any audio/
  );

  let hung = 0;
  await assert.rejects(
    () => synthesizeWithRetries(async () => {
      hung += 1;
      throw new Error('WebSocket inactivity timeout - no response from server');
    }, { delayMs: 0 }),
    /inactivity timeout/
  );
  assert.equal(hung, 1);
  assert.equal(isRetryableSynthesisError(new Error('Unexpected server response: 403')), true);
});
