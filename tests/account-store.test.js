import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

test('createUser, authenticateUser, and createRecording', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'varterm-accounts-'));
  process.env.VARTERM_ACCOUNT_DIR = dir;

  const store = await import(`../lib/account-store.js?ts=${Date.now()}`);
  const user = await store.createUser({ email: 'listener@example.com', password: 'password-123' });
  assert.ok(user.id);

  const authed = await store.authenticateUser({
    email: 'listener@example.com',
    password: 'password-123',
  });
  assert.equal(authed.id, user.id);

  const recording = await store.createRecording(user.id, {
    title: 'Chapter 1',
    visibility: 'unlisted',
    mimeType: 'audio/mpeg',
    audioBuffer: Buffer.from('fake-audio-bytes'),
    voiceLabel: 'Aria',
    sourceTextPreview: 'Hello world',
  });

  assert.equal(recording.title, 'Chapter 1');
  const listed = await store.listRecordingsForUser(user.id);
  assert.equal(listed.length, 1);

  const audio = await store.readRecordingAudio(recording.id);
  assert.equal(audio.toString(), 'fake-audio-bytes');

  const deleted = await store.deleteRecording(user.id, recording.id);
  assert.equal(deleted, true);
  assert.equal((await store.listRecordingsForUser(user.id)).length, 0);
});
