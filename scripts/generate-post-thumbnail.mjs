// Generates an on-brand 1600x900 blog thumbnail (white bg, brand-red accent,
// Aileron type, starburst logo). Reusable: edit EYEBROW / HEADLINE_LINES / OUT,
// or override via env THUMB_EYEBROW / THUMB_HEADLINE / THUMB_OUT (falls back
// to the in-file defaults) - used by the weekly "GSC -> post" automation.
//
//   node scripts/generate-post-thumbnail.mjs
//
// Run from repo root.

import sharp from 'sharp';
import { readFileSync } from 'node:fs';

// ---- per-post content (env-overridable for automation; falls back to defaults) ----
// THUMB_HEADLINE must be 1-2 lines, newline-separated. A 3rd line collides with the logo.
const EYEBROW = process.env.THUMB_EYEBROW || 'Newcomer Tax Guide';
const HEADLINE_LINES = (process.env.THUMB_HEADLINE || 'How Foreign Income\nIs Taxed in Canada')
  .split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 2);
const OUT = process.env.THUMB_OUT || '.design-staging/foreign-income-tax-thumb.png';
// ----------------------------------------------------------------------------------

const WIDTH = 1600;
const HEIGHT = 900;
const PAD = 120;
const LOGO_SRC = 'public/assets/logo/new-unify-logo-256.png';

const aileronBold = readFileSync('public/fonts/Aileron-Bold.woff2').toString('base64');
const aileronSemi = readFileSync('public/fonts/Aileron-SemiBold.woff2').toString('base64');

const logoBuf = await sharp(LOGO_SRC).resize({ height: 66, fit: 'inside' }).png().toBuffer();

// Escape XML-significant chars so automation-supplied text (e.g. "Rent & Utilities")
// cannot break the SVG markup. Text nodes only need <, >, and &.
const xmlEsc = (s) => String(s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));

const headlineSvg = HEADLINE_LINES.map(
  (line, i) => `<text class="headline" x="${PAD}" y="${470 + i * 140}" font-size="118">${xmlEsc(line)}</text>`
).join('\n  ');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style type="text/css"><![CDATA[
      @font-face { font-family: 'Aileron'; font-weight: 700; src: url(data:font/woff2;base64,${aileronBold}) format('woff2'); }
      @font-face { font-family: 'AileronSemi'; font-weight: 600; src: url(data:font/woff2;base64,${aileronSemi}) format('woff2'); }
      .eyebrow  { font-family: 'AileronSemi', Arial, sans-serif; font-weight: 600; fill: #D84A29; letter-spacing: 6px; text-transform: uppercase; }
      .headline { font-family: 'Aileron', Arial, sans-serif; font-weight: 700; fill: #181818; letter-spacing: -4px; }
      .url      { font-family: 'AileronSemi', Arial, sans-serif; font-weight: 600; fill: #575757; letter-spacing: 0.5px; }
    ]]></style>
  </defs>

  <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="#ffffff" />
  <rect x="${PAD}" y="300" width="84" height="6" fill="#D84A29" />
  <text class="eyebrow" x="${PAD}" y="278" font-size="30">${xmlEsc(EYEBROW)}</text>
  ${headlineSvg}
  <text class="url" x="${PAD + 86}" y="812" font-size="30">unifysocial.ca</text>
</svg>`;

await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 4, background: '#ffffff' } })
  .composite([
    { input: Buffer.from(svg), top: 0, left: 0 },
    { input: logoBuf, top: 770, left: PAD },
  ])
  .png({ compressionLevel: 9 })
  .toFile(OUT);

console.log(`wrote ${OUT} (${WIDTH}x${HEIGHT})`);
