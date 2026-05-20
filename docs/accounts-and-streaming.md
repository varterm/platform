# Optional accounts and online listening

Varterm stays usable without login. When enabled on the server, users can optionally create an account to save TTS recordings and open them on other devices via a listen URL.

## Phases

| Phase | Status | Scope |
|-------|--------|--------|
| 1 | Implemented (feature-flagged) | Email/password accounts, save recordings API, `/listen/[id]` streaming page |
| 2 | Implemented | Save from web player and VS Code; homepage + account flow diagram |
| 3 | Later | Podcast/RSS export, third-party listening apps, durable cloud storage (Vercel Blob + Postgres) |

## Enable on a deployment

```env
VARTERM_ACCOUNTS_ENABLED=true
VARTERM_AUTH_SECRET=use-a-random-string-at-least-32-characters-long
# Optional persistent data directory (default: /tmp/varterm-accounts)
VARTERM_ACCOUNT_DIR=/var/data/varterm-accounts
```

On Vercel, use a mounted volume or migrate to **Postgres + Blob** before relying on accounts in production (serverless instances do not share `/tmp` reliably).

## API overview

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/auth/register` | — | Create account, set session cookie |
| POST | `/api/auth/login` | — | Sign in |
| POST | `/api/auth/logout` | — | Sign out |
| GET | `/api/auth/me` | optional cookie | `{ enabled, user }` |
| GET | `/api/recordings` | session | List your recordings |
| POST | `/api/recordings` | session | Save audio (`audioBase64`, `title`, `visibility`) |
| GET | `/api/recordings/:id` | owner or unlisted | Metadata |
| GET | `/api/recordings/:id/audio` | owner or unlisted | Stream audio (supports `Range`) |
| DELETE | `/api/recordings/:id` | session | Delete your recording |

`visibility`: `unlisted` (shareable `/listen/:id` link) or `private` (owner only).

Extensions can send the session token as `Authorization: Bearer <token>` once login is wired in the client.

## Save a recording (example)

```bash
# After login (cookie jar) or with Bearer token
curl -X POST https://varterm.com/api/recordings \
  -H 'Content-Type: application/json' \
  -b cookies.txt \
  -d '{
    "title": "Morning reading",
    "visibility": "unlisted",
    "mimeType": "audio/mpeg",
    "audioBase64": "'$(base64 -i clip.mp3 | tr -d '\n')'",
    "voiceLabel": "Aria",
    "sourceTextPreview": "First paragraph..."
  }'
```

Listen at: `https://varterm.com/listen/<recording-id>`

## Production storage migration

Current store is file-based (same pattern as document ingest sessions). For production accounts:

1. **Users + recording metadata** → Vercel Postgres (or Supabase)
2. **Audio blobs** → Vercel Blob / S3 with signed URLs
3. Keep the same API shapes so web and extensions do not need large changes
