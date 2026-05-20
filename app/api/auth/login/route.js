import { NextResponse } from 'next/server';
import {
  buildSessionCookie,
  createSessionToken,
} from '@/lib/account-session.js';
import { authenticateUser } from '@/lib/account-store.js';
import { normalizeEmail } from '@/lib/account-password.js';
import { jsonError, requireAccountsEnabled } from '@/lib/account-api.js';

export async function POST(request) {
  const disabled = requireAccountsEnabled();
  if (disabled) {
    return disabled;
  }

  try {
    const payload = await request.json();
    const email = normalizeEmail(payload.email);
    const password = String(payload.password || '');

    const user = await authenticateUser({ email, password });
    if (!user) {
      return jsonError('Invalid email or password', 401);
    }

    const token = createSessionToken(user.id);
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email },
      token,
    });
    response.headers.set('Set-Cookie', buildSessionCookie(token));
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return jsonError(error.message || 'Login failed', 500);
  }
}
