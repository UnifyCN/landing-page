// Generates responsive widths of the /events header photo from the 4096px
// master, so phones and laptops don't download and decode the full image.
// Run: node scripts/build-events-hero-images.mjs
import sharp from "sharp";
import { statSync } from "node:fs";

const dir = "public/assets/images/community";
const master = `${dir}/newcomer-community-vancouver.jpg`;
const widths = [800, 1280, 1920, 2560];

for (const w of widths) {
  const base = `${dir}/newcomer-community-vancouver-${w}`;
  await sharp(master).resize({ width: w }).avif({ quality: 55 }).toFile(`${base}.avif`);
  await sharp(master).resize({ width: w }).jpeg({ quality: 78, mozjpeg: true }).toFile(`${base}.jpg`);
  const kb = (p) => Math.round(statSync(p).size / 1024);
  console.log(`${w}px  avif ${kb(`${base}.avif`)} KB  jpg ${kb(`${base}.jpg`)} KB`);
}
