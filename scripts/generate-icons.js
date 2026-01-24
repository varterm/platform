/**
 * Generate all required image assets for SEO and PWA
 * 
 * Usage: npm run generate-icons
 * 
 * Generates from varterm-logo.png:
 * - public/og-image.png (1200x630) - Social sharing
 * - public/favicon.ico (32x32) - Browser tab
 * - public/icon.svg - Modern browsers
 * - public/apple-touch-icon.png (180x180) - iOS
 * - public/icon-192.png (192x192) - PWA
 * - public/icon-512.png (512x512) - PWA
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const sourceLogo = path.join(rootDir, 'varterm-logo.png');

// Brand colors
const BRAND_BG = '#0a0a0b';
const BRAND_ACCENT = '#14b8a6';

async function generateIcons() {
  console.log('🎨 Generating image assets from varterm-logo.png...\n');

  // Check if source exists
  try {
    await fs.access(sourceLogo);
  } catch {
    console.error('❌ Error: varterm-logo.png not found in project root');
    console.log('   Please add your logo file first.');
    process.exit(1);
  }

  // Get source image info
  const sourceInfo = await sharp(sourceLogo).metadata();
  console.log(`📷 Source: ${sourceInfo.width}x${sourceInfo.height} ${sourceInfo.format}\n`);

  // 1. Generate OG Image (1200x630) - with padding and background
  console.log('→ Generating og-image.png (1200x630)...');
  const logoForOG = await sharp(sourceLogo)
    .resize(400, 400, { fit: 'inside' })
    .toBuffer();
  
  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: BRAND_BG
    }
  })
    .composite([
      {
        input: logoForOG,
        gravity: 'center'
      }
    ])
    .png()
    .toFile(path.join(publicDir, 'og-image.png'));
  console.log('   ✓ public/og-image.png');

  // 2. Generate Apple Touch Icon (180x180)
  console.log('→ Generating apple-touch-icon.png (180x180)...');
  await sharp(sourceLogo)
    .resize(180, 180, { fit: 'contain', background: BRAND_BG })
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('   ✓ public/apple-touch-icon.png');

  // 3. Generate PWA icons
  console.log('→ Generating icon-192.png (192x192)...');
  await sharp(sourceLogo)
    .resize(192, 192, { fit: 'contain', background: BRAND_BG })
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));
  console.log('   ✓ public/icon-192.png');

  console.log('→ Generating icon-512.png (512x512)...');
  await sharp(sourceLogo)
    .resize(512, 512, { fit: 'contain', background: BRAND_BG })
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));
  console.log('   ✓ public/icon-512.png');

  // 4. Generate favicon.ico (32x32 PNG, browsers accept PNG favicons)
  console.log('→ Generating favicon.ico (32x32)...');
  await sharp(sourceLogo)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('   ✓ public/favicon.ico');

  // 5. Generate SVG icon (simple wrapper if source is PNG)
  console.log('→ Generating icon.svg...');
  const icon64 = await sharp(sourceLogo)
    .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const base64Icon = icon64.toString('base64');
  
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <image width="64" height="64" href="data:image/png;base64,${base64Icon}"/>
</svg>`;
  
  await fs.writeFile(path.join(publicDir, 'icon.svg'), svgContent);
  console.log('   ✓ public/icon.svg');

  console.log('\n✅ All icons generated successfully!');
  console.log('\nGenerated files:');
  console.log('  • og-image.png (1200x630) - Social sharing preview');
  console.log('  • apple-touch-icon.png (180x180) - iOS home screen');
  console.log('  • icon-192.png (192x192) - PWA small icon');
  console.log('  • icon-512.png (512x512) - PWA large icon');
  console.log('  • favicon.ico (32x32) - Browser tab');
  console.log('  • icon.svg - Modern browsers');
}

generateIcons().catch(err => {
  console.error('❌ Error generating icons:', err);
  process.exit(1);
});
