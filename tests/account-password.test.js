import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hashPassword,
  isValidEmail,
  normalizeEmail,
  validatePassword,
  verifyPassword,
} from '../lib/account-password.js';

test('normalizeEmail lowercases and trims', () => {
  assert.equal(normalizeEmail('  User@Example.COM '), 'user@example.com');
});

test('validatePassword enforces minimum length', () => {
  assert.equal(validatePassword('short'), 'Password must be at least 8 characters');
  assert.equal(validatePassword('long-enough'), null);
});

test('isValidEmail checks basic format', () => {
  assert.equal(isValidEmail('a@b.co'), true);
  assert.equal(isValidEmail('not-an-email'), false);
});

test('hashPassword and verifyPassword round trip', async () => {
  const stored = await hashPassword('test-password-123');
  assert.equal(await verifyPassword('test-password-123', stored), true);
  assert.equal(await verifyPassword('wrong-password', stored), false);
});
