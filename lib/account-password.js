import crypto from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(crypto.scrypt);

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LEN = 64;

export function normalizeEmail(email) {
  return String(email || '')
    .trim()
    .toLowerCase();
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password) {
  const value = String(password || '');
  if (value.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (value.length > 128) {
    return 'Password must be at most 128 characters';
  }
  return null;
}

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('base64url');
  const derived = await scryptAsync(password, salt, KEY_LEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  });
  return {
    salt,
    hash: Buffer.from(derived).toString('base64url'),
    params: { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P },
  };
}

export async function verifyPassword(password, stored) {
  const derived = await scryptAsync(password, stored.salt, KEY_LEN, stored.params);
  const actual = Buffer.from(derived);
  const expected = Buffer.from(stored.hash, 'base64url');
  if (actual.length !== expected.length) {
    return false;
  }
  return crypto.timingSafeEqual(actual, expected);
}
