#!/usr/bin/env node
/**
 * HTTP smoke checks against a deployed or local app.
 *
 * Base URL resolution (first match wins):
 *   VARTERM_SMOKE_URL  — explicit target (best for CI: pass deployment URL)
 *   NEXT_PUBLIC_BASE_URL — same as Vercel env for Production / Preview (per environment)
 *   VARTERM_URL        — used by mcp-server.js for the platform API base
 *   VERCEL_URL         — Vercel sets this on deployments (hostname only → https://…)
 *   http://localhost:3000 — local `npm run dev`
 *
 * Optional: VARTERM_EXTENSION_API_TOKEN — if set, sends Bearer on ingest smoke (must match
 * the value configured on the server you are probing).
 *
 * Vercel reference:
 *   https://vercel.com/docs/projects/environment-variables#system-environment-variables
 */

import { existsSync, readFileSync } from 'node:fs';

function loadEnvLocal() {
  for (const name of ['.env.local', '.env']) {
    if (!existsSync(name)) continue;
    const text = readFileSync(name, 'utf8');
    for (const raw of text.split('\n')) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      let val = line.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = val;
    }
  }
}

loadEnvLocal();

function normalizeBase(url) {
  if (!url) return null;
  const trimmed = url.trim().replace(/\/+$/, '');
  return trimmed || null;
}

function resolveBaseUrl() {
  const fromSmoke = normalizeBase(process.env.VARTERM_SMOKE_URL);
  if (fromSmoke) return fromSmoke;

  const fromNext = normalizeBase(process.env.NEXT_PUBLIC_BASE_URL);
  if (fromNext) return fromNext;

  const fromVarterm = normalizeBase(process.env.VARTERM_URL);
  if (fromVarterm) return fromVarterm;

  const v = process.env.VERCEL_URL?.trim();
  if (v) {
    const host = v.replace(/^https?:\/\//, '');
    return `https://${host}`;
  }

  return 'http://localhost:3000';
}

async function expectOk(label, url, init = {}) {
  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`${label}: ${res.status} ${res.statusText} (${url})`);
  }
  return res;
}

const base = resolveBaseUrl();
const vercelEnv = process.env.VERCEL_ENV ?? '(not set)';
const token = process.env.VARTERM_EXTENSION_API_TOKEN?.trim();

console.error(`Smoke target: ${base}`);
console.error(`VERCEL_ENV (local shell): ${vercelEnv}`);

const headers = token ? { Authorization: `Bearer ${token}` } : {};

await expectOk('GET /', `${base}/`);

const ttsRes = await expectOk('GET /api/tts', `${base}/api/tts`);
const ttsJson = await ttsRes.json();
if (ttsJson.success !== true) {
  throw new Error(`GET /api/tts: expected success: true, got ${JSON.stringify(ttsJson)}`);
}

await expectOk('OPTIONS /api/ingest', `${base}/api/ingest`, {
  method: 'OPTIONS',
  headers,
});

const tinyDoc = {
  documents: [{ path: 'smoke.txt', content: 'Smoke test document content for chunking.' }],
};

if (process.env.SMOKE_SKIP_INGEST === '1') {
  console.error('SMOKE_SKIP_INGEST=1 — skipping POST /api/ingest.');
} else {
  const ingestRes = await fetch(`${base}/api/ingest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(tinyDoc),
  });

  const ingestBody = await ingestRes.json().catch(() => ({}));
  if (!ingestRes.ok) {
    if (ingestRes.status === 401 && !token) {
      console.error(
        'POST /api/ingest: 401 — server uses VARTERM_EXTENSION_API_TOKEN. Export the same token here, or set SMOKE_SKIP_INGEST=1 for GET-only smoke.'
      );
    } else {
      throw new Error(
        `POST /api/ingest: ${ingestRes.status} ${JSON.stringify(ingestBody)}`
      );
    }
  } else if (ingestBody?.success !== true) {
    throw new Error(`POST /api/ingest: expected success, got ${JSON.stringify(ingestBody)}`);
  }
}

console.error('Smoke passed.');
