#!/bin/bash
# Package VSCode extension for Marketplace submission

cd "$(dirname "$0")"

# Check if vsce is installed
if ! command -v vsce &> /dev/null; then
    echo "Installing vsce..."
    npm install -g @vscode/vsce
fi

# Package extension
vsce package

echo ""
echo "✅ VSCode extension packaged: varterm-tts-*.vsix"
echo ""
echo "Next steps:"
echo "1. Go to https://marketplace.visualstudio.com/manage"
echo "2. Create publisher if needed (one-time)"
echo "3. Click 'New Extension' > 'Visual Studio Code'"
echo "4. Upload the .vsix file"
echo "5. Fill in details and submit"
echo ""
echo "Or publish directly:"
echo "  vsce publish -p <YOUR_PERSONAL_ACCESS_TOKEN>"
