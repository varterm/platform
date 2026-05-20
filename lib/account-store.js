import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  getAccountDir,
  getMaxRecordingBytes,
  getMaxRecordingsPerUser,
  getRecordingsAudioDir,
} from './accounts-config.js';
import { hashPassword, normalizeEmail, verifyPassword } from './account-password.js';

function usersDir() {
  return path.join(getAccountDir(), 'users');
}

function emailIndexDir() {
  return path.join(getAccountDir(), 'email-index');
}

function recordingsDir() {
  return path.join(getAccountDir(), 'recordings');
}

function userRecordingsIndexPath(userId) {
  return path.join(getAccountDir(), 'user-recordings', `${userId}.json`);
}

function emailKey(email) {
  return crypto.createHash('sha256').update(normalizeEmail(email)).digest('hex');
}

async function ensureDirs() {
  await Promise.all([
    fs.mkdir(usersDir(), { recursive: true }),
    fs.mkdir(emailIndexDir(), { recursive: true }),
    fs.mkdir(recordingsDir(), { recursive: true }),
    fs.mkdir(path.join(getAccountDir(), 'user-recordings'), { recursive: true }),
    fs.mkdir(getRecordingsAudioDir(), { recursive: true }),
  ]);
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data), 'utf-8');
}

export async function createUser({ email, password }) {
  await ensureDirs();
  const normalized = normalizeEmail(email);
  const indexPath = path.join(emailIndexDir(), `${emailKey(normalized)}.json`);

  try {
    await fs.access(indexPath);
    const error = new Error('An account with this email already exists');
    error.code = 'EMAIL_EXISTS';
    throw error;
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }

  const userId = crypto.randomUUID();
  const passwordRecord = await hashPassword(password);
  const now = Date.now();
  const user = {
    id: userId,
    email: normalized,
    password: passwordRecord,
    createdAt: now,
  };

  await writeJson(path.join(usersDir(), `${userId}.json`), user);
  await writeJson(indexPath, { userId });
  return { id: userId, email: normalized, createdAt: now };
}

export async function authenticateUser({ email, password }) {
  await ensureDirs();
  const normalized = normalizeEmail(email);
  const indexPath = path.join(emailIndexDir(), `${emailKey(normalized)}.json`);

  let index;
  try {
    index = await readJson(indexPath);
  } catch {
    return null;
  }

  let user;
  try {
    user = await readJson(path.join(usersDir(), `${index.userId}.json`));
  } catch {
    return null;
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return null;
  }

  return { id: user.id, email: user.email, createdAt: user.createdAt };
}

export async function getUserById(userId) {
  try {
    const user = await readJson(path.join(usersDir(), `${userId}.json`));
    return { id: user.id, email: user.email, createdAt: user.createdAt };
  } catch {
    return null;
  }
}

async function readUserRecordingIds(userId) {
  try {
    const data = await readJson(userRecordingsIndexPath(userId));
    return Array.isArray(data.ids) ? data.ids : [];
  } catch {
    return [];
  }
}

async function writeUserRecordingIds(userId, ids) {
  await writeJson(userRecordingsIndexPath(userId), { ids });
}

export async function createRecording(userId, { title, visibility, mimeType, audioBuffer, voiceLabel, sourceTextPreview }) {
  await ensureDirs();

  const bytes = audioBuffer?.byteLength || 0;
  if (!bytes) {
    const error = new Error('Audio data is required');
    error.code = 'MISSING_AUDIO';
    throw error;
  }
  if (bytes > getMaxRecordingBytes()) {
    const error = new Error(`Recording exceeds max size of ${getMaxRecordingBytes()} bytes`);
    error.code = 'RECORDING_TOO_LARGE';
    throw error;
  }

  const ids = await readUserRecordingIds(userId);
  if (ids.length >= getMaxRecordingsPerUser()) {
    const error = new Error(`Recording limit reached (${getMaxRecordingsPerUser()})`);
    error.code = 'RECORDING_LIMIT';
    throw error;
  }

  const recordingId = crypto.randomUUID();
  const now = Date.now();
  const recording = {
    id: recordingId,
    userId,
    title: String(title || 'Untitled recording').slice(0, 200),
    visibility: visibility === 'private' ? 'private' : 'unlisted',
    mimeType: mimeType || 'audio/mpeg',
    bytes,
    voiceLabel: voiceLabel ? String(voiceLabel).slice(0, 120) : null,
    sourceTextPreview: sourceTextPreview ? String(sourceTextPreview).slice(0, 500) : null,
    createdAt: now,
  };

  await fs.writeFile(path.join(getRecordingsAudioDir(), `${recordingId}.bin`), audioBuffer);
  await writeJson(path.join(recordingsDir(), `${recordingId}.json`), recording);
  await writeUserRecordingIds(userId, [recordingId, ...ids]);

  return recording;
}

export async function getRecording(recordingId) {
  try {
    return await readJson(path.join(recordingsDir(), `${recordingId}.json`));
  } catch {
    return null;
  }
}

export async function listRecordingsForUser(userId) {
  const ids = await readUserRecordingIds(userId);
  const recordings = await Promise.all(ids.map((id) => getRecording(id)));
  return recordings.filter(Boolean).sort((a, b) => b.createdAt - a.createdAt);
}

export async function deleteRecording(userId, recordingId) {
  const recording = await getRecording(recordingId);
  if (!recording || recording.userId !== userId) {
    return false;
  }

  await Promise.all([
    fs.unlink(path.join(recordingsDir(), `${recordingId}.json`)).catch(() => {}),
    fs.unlink(path.join(getRecordingsAudioDir(), `${recordingId}.bin`)).catch(() => {}),
  ]);

  const ids = await readUserRecordingIds(userId);
  await writeUserRecordingIds(
    userId,
    ids.filter((id) => id !== recordingId)
  );
  return true;
}

export function getRecordingAudioPath(recordingId) {
  return path.join(getRecordingsAudioDir(), `${recordingId}.bin`);
}

export async function readRecordingAudio(recordingId) {
  return fs.readFile(getRecordingAudioPath(recordingId));
}
