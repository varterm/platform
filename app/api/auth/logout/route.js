import { NextResponse } from 'next/server';
import { buildClearSessionCookie } from '@/lib/account-session.js';
import { requireAccountsEnabled } from '@/lib/account-api.js';

export async function POST() {
  const disabled = requireAccountsEnabled();
  if (disabled) {
    return disabled;
  }

  const response = NextResponse.json({ success: true });
  response.headers.set('Set-Cookie', buildClearSessionCookie());
  return response;
}
