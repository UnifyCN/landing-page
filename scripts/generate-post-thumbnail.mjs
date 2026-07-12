// Generates an on-brand 1600x900 blog thumbnail. Two modes:
//   - Photo overlay (preferred): set THUMB_BG to a background photo; the script
//     covers the canvas with it, lays a bottom gradient scrim, and stacks the
//     logo + red rule + eyebrow + white headline bottom-left.
//   - White card (fallback): no THUMB_BG -> the original white-bg text card.
// Content is env-overridable (THUMB_EYEBROW / THUMB_HEADLINE / THUMB_OUT) for the
// weekly "GSC -> post" automation; all fall back to the in-file defaults.
//
//   node scripts/generate-post-thumbnail.mjs                      # white card
//   THUMB_BG=/tmp/photo.jpg node scripts/generate-post-thumbnail.mjs   # photo overlay
//
// Run from repo root.

import sharp from 'sharp';
import { existsSync, readFileSync } from 'node:fs';

// ---- per-post content (env-overridable for automation; falls back to defaults) ----
// THUMB_HEADLINE must be 1-2 lines, newline-separated. A 3rd line collides with the logo.
const EYEBROW = process.env.THUMB_EYEBROW || 'Newcomer Tax Guide';
const HEADLINE_LINES = (process.env.THUMB_HEADLINE || 'How Foreign Income\nIs Taxed in Canada')
  .split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 2);
const OUT = process.env.THUMB_OUT || '.design-staging/foreign-income-tax-thumb.png';
const BG = process.env.THUMB_BG || '';   // set -> photo overlay mode; unset -> white card
// ----------------------------------------------------------------------------------

const WIDTH = 1600;
const HEIGHT = 900;
const RED = '#D84A29';
const LOGO_SRC = 'public/assets/logo/new-unify-logo-256.png';

const aileronBold = readFileSync('public/fonts/Aileron-Bold.woff2').toString('base64');
const aileronSemi = readFileSync('public/fonts/Aileron-SemiBold.woff2').toString('base64');
const fontFaces = `
      @font-face { font-family: 'Aileron'; font-weight: 700; src: url(data:font/woff2;base64,${aileronBold}) format('woff2'); }
      @font-face { font-family: 'AileronSemi'; font-weight: 600; src: url(data:font/woff2;base64,${aileronSemi}) format('woff2'); }`;

// Escape XML-significant chars so automation-supplied text (e.g. "Rent & Utilities")
// cannot break the SVG markup. Text nodes only need <, >, and &.
const xmlEsc = (s) => String(s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));

if (BG) await renderPhoto();
else await renderCard();

// Photo + brand overlay. Gradient scrim keeps text readable over any image;
// the logo/rule/eyebrow/headline sit in an evenly spaced bottom-left stack.
async function renderPhoto() {
  if (!existsSync(BG)) { console.error(`ERROR: THUMB_BG not found: ${BG}`); process.exit(1); }
  const PAD = 104, LOGO_H = 42, HL_SIZE = 104, HL_LH = 116, GAP = 24, EYEBROW_CAP = 20;
  const logoBuf = await sharp(LOGO_SRC).resize({ height: LOGO_H, fit: 'inside' }).png().toBuffer();

  const baseLast = 812;                                    // baseline of the last headline line
  const baseFirst = baseLast - (HEADLINE_LINES.length - 1) * HL_LH;
  const eyebrowY = baseFirst - HL_SIZE - 40;               // eyebrow above the headline
  const barY = eyebrowY - EYEBROW_CAP - GAP - 6;           // red rule, one even gap above the eyebrow
  const logoTop = barY - GAP - LOGO_H;                     // logo, one even gap above the rule
  const headlineSvg = HEADLINE_LINES.map((line, i) =>
    `<text class="hl" x="${PAD}" y="${baseFirst + i * HL_LH}">${xmlEsc(line)}</text>`).join('\n  ');

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style type="text/css"><![CDATA[${fontFaces}
      .eyebrow { font-family: 'AileronSemi', Arial, sans-serif; font-weight: 600; fill: ${RED}; letter-spacing: 5px; text-transform: uppercase; }
      .hl      { font-family: 'Aileron', Arial, sans-serif; font-weight: 700; fill: #ffffff; letter-spacing: -3px; font-size: ${HL_SIZE}px; }
      .url     { font-family: 'AileronSemi', Arial, sans-serif; font-weight: 600; fill: rgba(255,255,255,0.82); letter-spacing: 0.5px; }
    ]]></style>
    <linearGradient id="scrim" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%"  stop-color="#0d0b0a" stop-opacity="0.92"/>
      <stop offset="38%" stop-color="#0d0b0a" stop-opacity="0.66"/>
      <stop offset="62%" stop-color="#0d0b0a" stop-opacity="0.18"/>
      <stop offset="82%" stop-color="#0d0b0a" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="#000000" opacity="0.14"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#scrim)"/>
  <rect x="${PAD}" y="${barY}" width="76" height="6" fill="${RED}"/>
  <text class="eyebrow" x="${PAD}" y="${eyebrowY}" font-size="28">${xmlEsc(EYEBROW)}</text>
  ${headlineSvg}
  <text class="url" x="${WIDTH - PAD}" y="852" font-size="28" text-anchor="end">unifysocial.ca</text>
</svg>`;

  await sharp(BG)
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: sharp.strategy.attention })
    .composite([
      { input: Buffer.from(svg), top: 0, left: 0 },
      { input: logoBuf, top: logoTop, left: PAD },
    ])
    .png({ compressionLevel: 9 })
    .toFile(OUT);
  console.log(`wrote ${OUT} (${WIDTH}x${HEIGHT}, photo overlay)`);
}

// Original white-bg text card (fallback when no THUMB_BG is provided).
async function renderCard() {
  const PAD = 120;
  const logoBuf = await sharp(LOGO_SRC).resize({ height: 66, fit: 'inside' }).png().toBuffer();
  const headlineSvg = HEADLINE_LINES.map(
    (line, i) => `<text class="headline" x="${PAD}" y="${470 + i * 140}" font-size="118">${xmlEsc(line)}</text>`
  ).join('\n  ');

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style type="text/css"><![CDATA[${fontFaces}
      .eyebrow  { font-family: 'AileronSemi', Arial, sans-serif; font-weight: 600; fill: ${RED}; letter-spacing: 6px; text-transform: uppercase; }
      .headline { font-family: 'Aileron', Arial, sans-serif; font-weight: 700; fill: #181818; letter-spacing: -4px; }
      .url      { font-family: 'AileronSemi', Arial, sans-serif; font-weight: 600; fill: #575757; letter-spacing: 0.5px; }
    ]]></style>
  </defs>

  <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="#ffffff" />
  <rect x="${PAD}" y="300" width="84" height="6" fill="${RED}" />
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
}
