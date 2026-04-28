#!/usr/bin/env node
/**
 * One-off: convert heavy PNG/JPG assets to AVIF.
 * Run: `node scripts/convert-images.mjs`
 * Outputs alongside originals (e.g. group-photo.jpg → group-photo.avif).
 * Originals are kept so callers can be migrated incrementally.
 */
import sharp from "sharp";
import { readdirSync, statSync, existsSync } from "node:fs";
import { join, parse, relative } from "node:path";

const ROOT = new URL("../public/assets/", import.meta.url).pathname;
const MIN_BYTES = 60 * 1024; // skip anything under 60 KB

const targets = [];
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full);
    else if (/\.(png|jpe?g)$/i.test(entry) && st.size >= MIN_BYTES) {
      targets.push({ full, size: st.size });
    }
  }
}
walk(ROOT);

let total = 0;
let saved = 0;
for (const { full, size } of targets) {
  const { dir, name } = parse(full);
  const out = join(dir, `${name}.avif`);
  if (existsSync(out)) {
    console.log(`skip (exists)   ${relative(ROOT, full)}`);
    continue;
  }
  const start = Date.now();
  await sharp(full)
    .avif({ quality: 55, effort: 4 })
    .toFile(out);
  const newSize = statSync(out).size;
  const delta = size - newSize;
  total += size;
  saved += delta;
  console.log(
    `${(size / 1024).toFixed(0).padStart(5)} KB → ${(newSize / 1024)
      .toFixed(0)
      .padStart(4)} KB  (${((1 - newSize / size) * 100).toFixed(0)}% smaller, ${(
      Date.now() - start
    )}ms)  ${relative(ROOT, full)}`,
  );
}
console.log(
  `\nTOTAL  ${(total / 1024 / 1024).toFixed(1)} MB → ${((total - saved) / 1024 / 1024).toFixed(1)} MB  (${(
    (saved / total) *
    100
  ).toFixed(0)}% reduction, saved ${(saved / 1024 / 1024).toFixed(1)} MB)`,
);
