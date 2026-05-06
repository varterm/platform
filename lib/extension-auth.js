const REQUIRED_TOKEN = process.env.VARTERM_EXTENSION_API_TOKEN;

function unauthorized(message = 'Unauthorized') {
  return {
    ok: false,
    status: 401,
    body: { error: message },
  };
}

export function checkExtensionAuth(request) {
  if (!REQUIRED_TOKEN) {
    return { ok: true };
  }

  const header = request.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';

  if (!token) {
    return unauthorized('Missing bearer token');
  }

  if (token !== REQUIRED_TOKEN) {
    return unauthorized('Invalid bearer token');
  }

  return { ok: true };
}
