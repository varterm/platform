import crypto from 'node:crypto';
import { getAuthSecret, getSessionMaxAgeMs } from './accounts-config.js';

const COOKIE_NAME = 'varterm_session';

function signBody(body, secret) {
  return crypto.createHmac('sha256', secret).update(body).digest('base64url');
}

export function createSessionToken(userId) {
  const secret = getAuthSecret();
  const now = Date.now();
  const payload = {
    sub: userId,
    iat: now,
    exp: now + getSessionMaxAgeMs(),
  };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = signBody(body, secret);
  return `${body}.${signature}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const secret = getAuthSecret();
  if (!secret) {
    return null;
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return null;
  }

  const [body, signature] = parts;
  const expected = signBody(body, secret);
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
    if (!payload.sub || !payload.exp || payload.exp <= Date.now()) {
      return null;
    }
    return { userId: payload.sub, expiresAt: payload.exp };
  } catch {
    return null;
  }
}

export function getSessionCookieName() {
  return COOKIE_NAME;
}

export function buildSessionCookie(token) {
  const maxAgeSec = Math.floor(getSessionMaxAgeMs() / 1000);
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSec}${secure}`;
}

export function buildClearSessionCookie() {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

export function getSessionFromRequest(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
  if (match) {
    return verifySessionToken(decodeURIComponent(match[1]));
  }

  const authHeader = request.headers.get('authorization') || '';
  if (authHeader.startsWith('Bearer ')) {
    return verifySessionToken(authHeader.slice(7).trim());
  }

  return null;
}
