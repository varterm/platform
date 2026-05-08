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

// Brand colors
const BRAND_BG = '#0a0a0b';
const BRAND_PRIMARY = '#10b981';
const BRAND_SECONDARY = '#14b8a6';
const BRAND_TERTIARY = '#06b6d4';

function buildBrandMarkSvg({ size = 512, withBackground = true } = {}) {
  const rx = Math.round(size * 0.2);
  const barW = Math.round(size * 0.08);
  const gap = Math.round(size * 0.04);
  const totalBarsWidth = 5 * barW + 4 * gap;
  const startX = Math.round((size - totalBarsWidth) / 2);
  const x1 = startX;
  const x2 = startX + barW + gap;
  const x3 = startX + (barW + gap) * 2;
  const x4 = startX + (barW + gap) * 3;
  const x5 = startX + (barW + gap) * 4;

  const h1 = Math.round(size * 0.28);
  const h2 = Math.round(size * 0.44);
  const h3 = Math.round(size * 0.62);
  const y1 = Math.round((size - h1) / 2);
  const y2 = Math.round((size - h2) / 2);
  const y3 = Math.round((size - h3) / 2);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
    ${withBackground ? `<rect width="${size}" height="${size}" rx="${rx}" fill="${BRAND_BG}"/>` : ''}
    <rect x="${x1}" y="${y1}" width="${barW}" height="${h1}" rx="${Math.round(barW / 2)}" fill="${BRAND_PRIMARY}" opacity="0.65"/>
    <rect x="${x2}" y="${y2}" width="${barW}" height="${h2}" rx="${Math.round(barW / 2)}" fill="${BRAND_SECONDARY}" opacity="0.85"/>
    <rect x="${x3}" y="${y3}" width="${barW}" height="${h3}" rx="${Math.round(barW / 2)}" fill="${BRAND_PRIMARY}"/>
    <rect x="${x4}" y="${y2}" width="${barW}" height="${h2}" rx="${Math.round(barW / 2)}" fill="${BRAND_SECONDARY}" opacity="0.85"/>
    <rect x="${x5}" y="${y1}" width="${barW}" height="${h1}" rx="${Math.round(barW / 2)}" fill="${BRAND_TERTIARY}" opacity="0.65"/>
  </svg>`;
}

async function generateIcons() {
  console.log('🎨 Generating image assets from Varterm brand mark...\n');

  const brandMarkSvg = buildBrandMarkSvg({ size: 1024, withBackground: true });
  const brandMarkBuffer = Buffer.from(brandMarkSvg);

  // 1. Generate OG Image (1200x630) - with padding and background
  console.log('→ Generating og-image.png (1200x630)...');
  const logoForOG = await sharp(brandMarkBuffer)
    .resize(420, 420, { fit: 'inside' })
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
  await sharp(brandMarkBuffer)
    .resize(180, 180, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('   ✓ public/apple-touch-icon.png');

  // 3. Generate PWA icons
  console.log('→ Generating icon-192.png (192x192)...');
  await sharp(brandMarkBuffer)
    .resize(192, 192, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));
  console.log('   ✓ public/icon-192.png');

  console.log('→ Generating icon-512.png (512x512)...');
  await sharp(brandMarkBuffer)
    .resize(512, 512, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));
  console.log('   ✓ public/icon-512.png');

  // 4. Generate favicon.ico (32x32 PNG, browsers accept PNG favicons)
  console.log('→ Generating favicon.ico (32x32)...');
  await sharp(brandMarkBuffer)
    .resize(32, 32, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('   ✓ public/favicon.ico');

  // 5. Generate SVG icon
  console.log('→ Generating icon.svg...');
  const svgContent = buildBrandMarkSvg({ size: 512, withBackground: true });
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
