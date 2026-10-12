import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSynthesisUrl, EDGE_TTS_WSS_URL } from '../lib/edge-tts-client.js';

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
