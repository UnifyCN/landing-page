// Generates public/og-default.png — the 1200x630 Open Graph card referenced
// by BaseLayout.astro's `og:image` default. Re-runnable; rewrite the strings
// or layout below and re-run when the Day 0 keyword changes or copy is edited.
//
// Usage:
//   node scripts/generate-og-default.mjs
//
// Run from the repo root.

import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const OUT = 'public/og-default.png';
const WIDTH = 1200;
const HEIGHT = 630;

const LOGO_SRC = 'public/assets/logo/logo-with-name.png';
const FONT_BOLD = 'public/fonts/Aileron-Bold.woff2';
const FONT_REG = 'public/fonts/Aileron-Regular.woff2';

const LOGO_HEIGHT = 100;
const PAD_X = 80;
const LOGO_Y = 80;

const logoBuf = await sharp(LOGO_SRC)
  .resize({ height: LOGO_HEIGHT, fit: 'inside' })
  .png()
  .toBuffer();

const aileronBold = readFileSync(FONT_BOLD).toString('base64');
const aileronRegular = readFileSync(FONT_REG).toString('base64');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style type="text/css"><![CDATA[
      @font-face {
        font-family: 'Aileron';
        font-weight: 700;
        font-style: normal;
        src: url(data:font/woff2;base64,${aileronBold}) format('woff2');
      }
      @font-face {
        font-family: 'Aileron';
        font-weight: 400;
        font-style: normal;
        src: url(data:font/woff2;base64,${aileronRegular}) format('woff2');
      }
      .headline { font-family: 'Aileron', 'Helvetica Neue', Arial, sans-serif; font-weight: 700; fill: #181818; letter-spacing: -3px; }
      .subtext  { font-family: 'Aileron', 'Helvetica Neue', Arial, sans-serif; font-weight: 400; fill: #575757; }
      .url      { font-family: 'Aileron', 'Helvetica Neue', Arial, sans-serif; font-weight: 400; fill: #8a8a8a; letter-spacing: 0.5px; }
    ]]></style>
  </defs>

  <rect x="${PAD_X}" y="240" width="60" height="4" fill="#D84A29" />

  <text class="headline" x="${PAD_X}" y="340" font-size="88">The Canada</text>
  <text class="headline" x="${PAD_X}" y="440" font-size="88">Newcomer Guide</text>

  <text class="subtext" x="${PAD_X}" y="510" font-size="30">Settle in Canada with confidence.</text>

  <text class="url" x="${PAD_X}" y="590" font-size="22">unifysocial.ca</text>
</svg>`;

await sharp({
  create: { width: WIDTH, height: HEIGHT, channels: 4, background: '#ffffff' },
})
  .composite([
    { input: logoBuf, top: LOGO_Y, left: PAD_X },
    { input: Buffer.from(svg), top: 0, left: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(OUT);

console.log(`✓ wrote ${OUT} (${WIDTH}×${HEIGHT})`);
