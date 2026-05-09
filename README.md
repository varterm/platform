# Varterm — Free Text to Speech Reader

Convert any text to natural-sounding speech with premium AI voices. Free to use, with optional upgrades for HD quality.

![Varterm](https://varterm.com/og-image.png)

## Features

- 🆓 **Free tier** with browser-native voices
- 🎙️ **Premium voices** via ElevenLabs integration
- 💳 **Stripe billing** for subscriptions
- 🤖 **ChatGPT integration** via Custom GPT Actions
- 🔧 **Claude integration** via MCP (Model Context Protocol)
- ⚡ **Vercel-ready** for instant deployment

## Quick Start

```bash
# Clone the repo
git clone https://github.com/varterm/platform.git
cd varterm

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Open Source Project Setup

- `LICENSE` uses MIT for permissive reuse.
- `CONTRIBUTING.md` explains setup, checks, and PR expectations.
- `CODE_OF_CONDUCT.md` sets collaboration standards.
- `SECURITY.md` explains private vulnerability reporting.
- `.github/ISSUE_TEMPLATE` includes structured bug and feature forms.
- `.github/pull_request_template.md` standardizes PR quality.
- `.github/workflows/ci.yml` runs lint and tests on PRs/pushes.
- Extension release automation lives in the `varterm/extensions` repository.

Binary build artifacts are intentionally not committed to git.

## Environment Variables

Create a `.env.local` file with:

```env
# Required for premium voices
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Optional: AI answers for /api/ask
ANTHROPIC_API_KEY=your_anthropic_api_key

# Optional: protect /api/ingest and /api/ask with bearer auth
VARTERM_EXTENSION_API_TOKEN=your_private_token

# Optional: Stripe for billing
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Your domain
NEXT_PUBLIC_BASE_URL=https://varterm.com
```

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/varterm/platform)

Or via CLI:

```bash
npm i -g vercel
vercel
```

## Set Up Stripe Billing

1. Go to [Stripe Dashboard → Payment Links](https://dashboard.stripe.com/payment-links)
2. Create 3 recurring products:
   - **Starter**: $5/month
   - **Pro**: $15/month  
   - **Unlimited**: $29/month
3. Copy each payment link URL
4. Update `STRIPE_LINKS` in `app/page.js`:

```javascript
const STRIPE_LINKS = {
  starter: 'https://buy.stripe.com/your_starter_link',
  pro: 'https://buy.stripe.com/your_pro_link',
  unlimited: 'https://buy.stripe.com/your_unlimited_link',
};
```

## API Endpoints

### `GET /api/tts`
List available voices.

### `POST /api/tts`
Convert text to speech.

**Request:**
```json
{
  "text": "Hello world",
  "voice": "Sarah",
  "speed": 1.0
}
```

**Response:** `audio/mpeg` binary data

### `GET /api/mcp`
MCP server info and capabilities.

### `POST /api/mcp`
Handle MCP tool calls for Claude integration.

### `POST /api/ingest`
Create a temporary document session for long text/script ingestion with chunking limits.

**Request:**
```json
{
  "documents": [
    {
      "path": "src/app.ts",
      "content": "very long file text..."
    }
  ],
  "options": {
    "chunkSize": 1800,
    "overlap": 250,
    "maxChunks": 2000,
    "maxTotalChars": 1000000
  }
}
```

### `POST /api/ask`
Ask a question against an ingest session.

**Request:**
```json
{
  "sessionId": "uuid",
  "question": "Where is auth validated?",
  "maxChunks": 8,
  "maxContextChars": 15000
}
```

---

## ChatGPT Integration (Custom GPT with Actions)

1. Go to [chat.openai.com/gpts/editor](https://chat.openai.com/gpts/editor)
2. Create a new GPT
3. Add these instructions:

```
You have access to Varterm, a text-to-speech service. When users want to hear text read aloud, use the textToSpeech action. You can also list available voices with listVoices.

Always ask what voice they prefer if they don't specify one. Popular choices are Sarah (warm), Charlie (friendly), and Rachel (ultra realistic).
```

4. In the **Actions** section, click "Create new action"
5. Import the OpenAPI schema from: `https://varterm.com/openapi.json`
6. Save and publish your GPT

### Example GPT Conversation

> **User:** Read this paragraph aloud using a British voice
> 
> **GPT:** I'll use George's British voice for this. *[calls textToSpeech]*
> 
> Here's the audio: [plays audio]

---

## Claude Integration (MCP Server)

### Option 1: HTTP-based MCP (Recommended)

Add this to your Claude Desktop config (`~/.config/claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "varterm": {
      "transport": {
        "type": "http",
        "url": "https://varterm.com/api/mcp"
      }
    }
  }
}
```

### Option 2: Local MCP Server

For local development or if you have your own ElevenLabs key:

1. Install MCP SDK:
```bash
npm install @modelcontextprotocol/sdk
```

2. Add to Claude Desktop config:
```json
{
  "mcpServers": {
    "varterm": {
      "command": "node",
      "args": ["/path/to/varterm/mcp-server.js"],
      "env": {
        "ELEVENLABS_API_KEY": "your_key_here"
      }
    }
  }
}
```

3. Restart Claude Desktop

### Available MCP Tools

| Tool | Description |
|------|-------------|
| `text_to_speech` | Convert text to audio with optional voice and speed |
| `list_voices` | List all available voices |

### Example Claude Conversation

> **User:** Can you read this article summary aloud?
> 
> **Claude:** I'll convert that to speech for you. *[uses text_to_speech tool]*
> 
> Done! I've generated audio using Sarah's voice. The audio file is ready.

---

## Project Structure

```
varterm/
├── app/
│   ├── api/
│   │   ├── tts/
│   │   │   └── route.js      # TTS API endpoint
│   │   └── mcp/
│   │       └── route.js      # MCP endpoint for Claude
│   ├── globals.css
│   ├── layout.js
│   ├── page.js               # Main app
│   └── page.module.css
├── lib/
│   └── elevenlabs.js         # ElevenLabs integration
├── public/
│   └── openapi.json          # OpenAPI spec for GPT Actions
├── mcp-server.js             # Standalone MCP server
├── package.json
└── README.md
```

## Pricing Tiers

| Plan | Price | Characters | Voices |
|------|-------|------------|--------|
| Free | $0 | Unlimited | Browser voices |
| Starter | $5/mo | 50,000 | 10 premium |
| Pro | $15/mo | 200,000 | 30+ premium |
| Unlimited | $29/mo | Unlimited | All 50+ Ultra HD |

## Tech Stack

- **Framework:** Next.js 14
- **TTS Provider:** ElevenLabs
- **Payments:** Stripe Payment Links
- **Deployment:** Vercel
- **AI Integrations:** OpenAI GPT Actions, Claude MCP

## License

MIT © Varterm

---

Built with ❤️ for readers everywhere.
