import { NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/account-api.js';
import { isAccountsEnabled } from '@/lib/accounts-config.js';

export async function GET(request) {
  if (!isAccountsEnabled()) {
    return NextResponse.json({ enabled: false, user: null });
  }

  const auth = await requireAuthenticatedUser(request);
  if (auth.error) {
    return NextResponse.json({ enabled: true, user: null });
  }

  return NextResponse.json({
    enabled: true,
    user: { id: auth.user.id, email: auth.user.email },
  });
}
