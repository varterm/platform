import { NextResponse } from 'next/server';
import { assertAccountsConfigured, isAccountsEnabled } from './accounts-config.js';
import { getSessionFromRequest } from './account-session.js';
import { getUserById } from './account-store.js';

export function accountsDisabledResponse() {
  return NextResponse.json(
    { error: 'Accounts are not enabled on this server' },
    { status: 503 }
  );
}

export function jsonError(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function requireAccountsEnabled() {
  if (!isAccountsEnabled()) {
    return accountsDisabledResponse();
  }
  try {
    assertAccountsConfigured();
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 503 });
  }
  return null;
}

export async function requireAuthenticatedUser(request) {
  const disabled = requireAccountsEnabled();
  if (disabled) {
    return { error: disabled };
  }

  const session = getSessionFromRequest(request);
  if (!session) {
    return { error: jsonError('Authentication required', 401) };
  }

  const user = await getUserById(session.userId);
  if (!user) {
    return { error: jsonError('Authentication required', 401) };
  }

  return { user, session };
}
