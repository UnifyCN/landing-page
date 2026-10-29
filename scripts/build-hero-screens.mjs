// The Learn phone screen shown in the home web app section (PlatformBand.astro).
// It is cut out of the frame-0 poster of the Learn demo video in
// public/assets/demos/posters/, so it shows the same real app screen as the
// core features section, without the phone frame (the section draws its own).
// (Written for the #37 hero, which cycled four screens; that hero was taken
// off the site, and only the Learn screen is still used.)
//
// Outputs: public/assets/screenshots/hero/learn-{360,720}.{avif,webp}, all
// 9:19.2. Served as AVIF through <picture> with the WebP as the <img>
// fallback (Safari 15 and older).
//
// Run after re-recording the Learn demo or regenerating its poster:
//   node scripts/build-hero-screens.mjs
// Sources are never modified. Outputs are committed.
import sharp from "sharp";
import { mkdirSync, statSync } from "node:fs";

const NAMES = ["learn"];
const WIDTHS = [360, 720];
const RATIO = 19.2 / 9;
const OUT = "public/assets/screenshots/hero";
mkdirSync(OUT, { recursive: true });
const kb = (p) => `${(statSync(p).size / 1024).toFixed(1)} KB`;

for (const name of NAMES) {
  const src = `public/assets/demos/posters/${name}-tab-demo.avif`;
  const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
  // The phone's black frame is the darkest thing in the poster: its bounding
  // box locates the screen.
  let x0 = info.width, y0 = info.height, x1 = 0, y1 = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * info.channels;
      if (data[i] < 45 && data[i + 1] < 45 && data[i + 2] < 45) {
        x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      }
    }
  }
  // Step inside the frame's bezel, then crop to the screen ratio from the top.
  const inset = Math.round((x1 - x0) * 0.045);
  const left = x0 + inset, top = y0 + inset;
  const width = x1 - x0 - 2 * inset;
  const height = Math.min(Math.round(width * RATIO), y1 - y0 - 2 * inset);
  for (const w of WIDTHS) {
    const base = `${OUT}/${name}-${w}`;
    const cut = () => sharp(src).extract({ left, top, width, height }).resize({ width: w, height: Math.round(w * RATIO), fit: "cover", position: "top" });
    await cut().avif({ quality: 60, effort: 9 }).toFile(`${base}.avif`);
    await cut().webp({ quality: 80, effort: 6 }).toFile(`${base}.webp`);
    console.log(`${name}-${w}  avif ${kb(`${base}.avif`)}  webp ${kb(`${base}.webp`)}`);
  }
}
