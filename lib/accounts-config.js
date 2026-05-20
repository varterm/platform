const ACCOUNT_DIR = process.env.VARTERM_ACCOUNT_DIR || '/tmp/varterm-accounts';
const MAX_RECORDING_BYTES = Number(process.env.VARTERM_MAX_RECORDING_BYTES || 25 * 1024 * 1024);
const MAX_RECORDINGS_PER_USER = Number(process.env.VARTERM_MAX_RECORDINGS_PER_USER || 50);
const SESSION_MAX_AGE_MS = Number(process.env.VARTERM_SESSION_MAX_AGE_MS || 1000 * 60 * 60 * 24 * 30);

export function isAccountsEnabled() {
  return process.env.VARTERM_ACCOUNTS_ENABLED === 'true';
}

export function getAccountDir() {
  return ACCOUNT_DIR;
}

export function getRecordingsAudioDir() {
  return `${ACCOUNT_DIR}/audio`;
}

export function getAuthSecret() {
  return process.env.VARTERM_AUTH_SECRET || '';
}

export function assertAccountsConfigured() {
  if (!isAccountsEnabled()) {
    const error = new Error('Accounts are not enabled on this server');
    error.code = 'ACCOUNTS_DISABLED';
    throw error;
  }
  const secret = getAuthSecret();
  if (!secret || secret.length < 32) {
    const error = new Error('VARTERM_AUTH_SECRET must be at least 32 characters when accounts are enabled');
    error.code = 'AUTH_MISCONFIGURED';
    throw error;
  }
}

export function getMaxRecordingBytes() {
  return MAX_RECORDING_BYTES;
}

export function getMaxRecordingsPerUser() {
  return MAX_RECORDINGS_PER_USER;
}

export function getSessionMaxAgeMs() {
  return SESSION_MAX_AGE_MS;
}
