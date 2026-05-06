# Varterm TTS for VS Code & Cursor

Read code, documentation, and errors aloud with natural AI voices. Perfect for accessibility, learning, and code review.

## Features

- **Read Selection** (`Cmd/Ctrl+Shift+R`) - Read highlighted text aloud
- **Read Line** (`Cmd/Ctrl+Shift+L`) - Read the current line
- **Read Errors** (`Cmd/Ctrl+Shift+E`) - Read all errors and warnings
- **Read Document** - Read the entire file
- **Stop** (`Cmd/Ctrl+Shift+S`) - Stop speaking

## Voice Options

| Tier | Description | Internet Required |
|------|-------------|-------------------|
| **Cloud** | Microsoft neural voices (best quality) | Yes |
| **Browser** | System TTS (macOS `say`, Linux `espeak`) | No |
| **Offline** | Piper AI voices (coming soon) | No |

## Configuration

Open Settings (`Cmd/Ctrl+,`) and search for "Varterm":

- `varterm.voiceTier` - Voice tier (cloud, browser, offline)
- `varterm.voice` - Voice ID (e.g., `en-US-AriaNeural`)
- `varterm.rate` - Speech rate (0.5 to 2.0)
- `varterm.stripMarkdown` - Strip markdown formatting
- `varterm.autoReadErrors` - Auto-read new errors

## Available Voices (Cloud Tier)

| Voice | Description |
|-------|-------------|
| `en-US-AriaNeural` | Aria - Friendly, natural |
| `en-US-JennyNeural` | Jenny - Warm, clear |
| `en-US-GuyNeural` | Guy - Casual, natural |
| `en-US-DavisNeural` | Davis - Calm, professional |
| `en-GB-SoniaNeural` | Sonia - British, warm |
| `en-GB-RyanNeural` | Ryan - British, professional |
| `en-AU-NatashaNeural` | Natasha - Australian |

## Context Menu

Right-click in the editor to access:
- "Varterm: Read Selection Aloud" (when text is selected)
- "Varterm: Read Current Line" (when no selection)

## Self-Hosted

To use your own Varterm instance:

```json
{
  "varterm.apiEndpoint": "https://your-instance.com"
}
```

## Requirements

- VS Code 1.74.0 or later
- For Browser tier on Linux: `espeak` installed
- For Cloud tier: Internet connection

## Links

- [Varterm Web App](https://varterm.com)
- [GitHub](https://github.com/varterm/varterm)
- [Report Issues](https://github.com/varterm/varterm/issues)

## License

MIT
