import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs/promises';

const SESSION_TTL_MS = 1000 * 60 * 60; // 1 hour
const SESSION_DIR = process.env.VARTERM_SESSION_DIR || '/tmp/varterm-sessions';

function sessionFilePath(sessionId) {
  return path.join(SESSION_DIR, `${sessionId}.json`);
}

async function ensureSessionDir() {
  await fs.mkdir(SESSION_DIR, { recursive: true });
}

async function pruneExpiredFiles() {
  await ensureSessionDir();
  const entries = await fs.readdir(SESSION_DIR);
  const now = Date.now();

  await Promise.all(
    entries
      .filter((entry) => entry.endsWith('.json'))
      .map(async (entry) => {
        const fullPath = path.join(SESSION_DIR, entry);
        try {
          const raw = await fs.readFile(fullPath, 'utf-8');
          const parsed = JSON.parse(raw);
          if (!parsed.expiresAt || parsed.expiresAt <= now) {
            await fs.unlink(fullPath);
          }
        } catch {
          // Ignore malformed files and continue cleanup.
        }
      })
  );
}

export async function createDocumentSession(payload) {
  await pruneExpiredFiles();

  const sessionId = crypto.randomUUID();
  const now = Date.now();
  const session = {
    ...payload,
    createdAt: now,
    updatedAt: now,
    expiresAt: now + SESSION_TTL_MS,
  };

  await fs.writeFile(sessionFilePath(sessionId), JSON.stringify(session), 'utf-8');
  return {
    sessionId,
    ...session,
  };
}

export async function getDocumentSession(sessionId) {
  await ensureSessionDir();
  const fullPath = sessionFilePath(sessionId);

  try {
    const raw = await fs.readFile(fullPath, 'utf-8');
    const session = JSON.parse(raw);

    if (!session.expiresAt || session.expiresAt <= Date.now()) {
      await fs.unlink(fullPath).catch(() => {});
      return null;
    }

    const now = Date.now();
    session.updatedAt = now;
    session.expiresAt = now + SESSION_TTL_MS;
    await fs.writeFile(fullPath, JSON.stringify(session), 'utf-8');
    return session;
  } catch {
    return null;
  }
}

export function getSessionTtlMs() {
  return SESSION_TTL_MS;
}
