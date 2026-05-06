#!/bin/bash
# Package Chrome extension for Web Store submission

cd "$(dirname "$0")"

# Create dist directory
rm -rf dist
mkdir -p dist

# Copy all required files
cp manifest.json dist/
cp background.js dist/
cp content.js dist/
cp content.css dist/
cp popup.html dist/
cp popup.js dist/
cp -r icons dist/

# Create zip
cd dist
zip -r ../varterm-tts-chrome.zip .
cd ..

echo ""
echo "✅ Chrome extension packaged: varterm-tts-chrome.zip"
echo ""
echo "Next steps:"
echo "1. Go to https://chrome.google.com/webstore/devconsole"
echo "2. Click 'New Item'"
echo "3. Upload varterm-tts-chrome.zip"
echo "4. Fill in store listing details"
echo "5. Submit for review"
