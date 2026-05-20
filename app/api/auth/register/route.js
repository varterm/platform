import { NextResponse } from 'next/server';
import {
  buildSessionCookie,
  createSessionToken,
} from '@/lib/account-session.js';
import { isValidEmail, normalizeEmail, validatePassword } from '@/lib/account-password.js';
import { createUser } from '@/lib/account-store.js';
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

    if (!isValidEmail(email)) {
      return jsonError('A valid email address is required');
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return jsonError(passwordError);
    }

    const user = await createUser({ email, password });
    const token = createSessionToken(user.id);
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email },
      token,
    });
    response.headers.set('Set-Cookie', buildSessionCookie(token));
    return response;
  } catch (error) {
    if (error.code === 'EMAIL_EXISTS') {
      return jsonError('An account with this email already exists', 409);
    }
    console.error('Register error:', error);
    return jsonError(error.message || 'Registration failed', 500);
  }
}
