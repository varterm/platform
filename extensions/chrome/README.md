# Varterm TTS Chrome Extension

Read any web page aloud with natural AI voices. Select text and listen instantly.

## Features

- **Floating Button** - Select text and click the 🔊 button to read
- **Context Menu** - Right-click to "Read with Varterm"
- **Keyboard Shortcuts** - `Ctrl+Shift+R` to read selection
- **Read Entire Page** - Right-click on page → "Read entire page"

## Installation

### From Chrome Web Store
*Coming soon*

### Manual Installation (Developer Mode)

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `extensions/chrome` folder

## Keyboard Shortcuts

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Read selection | `Ctrl+Shift+R` | `Cmd+Shift+R` |
| Stop speaking | `Ctrl+Shift+S` | `Cmd+Shift+S` |

## Settings

Click the extension icon to access settings:

- **Voice Tier** - Cloud (best quality) or Browser (offline)
- **Voice** - Choose from multiple neural voices
- **Speed** - 0.5x to 2x playback speed
- **Strip Markdown** - Remove formatting for cleaner speech

## Voice Options

| Voice | Accent | Style |
|-------|--------|-------|
| Aria | US | Friendly, natural |
| Jenny | US | Warm, clear |
| Guy | US | Casual |
| Davis | US | Calm, professional |
| Sonia | UK | Warm |
| Ryan | UK | Professional |
| Natasha | AU | Friendly |

## Privacy

- No data stored on servers
- Text sent to Varterm API for TTS only
- Browser tier works completely offline
- No tracking or analytics

## Building for Store

```bash
cd extensions/chrome
zip -r varterm-tts-chrome.zip . -x "*.md" -x ".git*"
```

## Links

- [Varterm Web App](https://varterm.com)
- [GitHub](https://github.com/varterm/varterm)

## License

MIT
