#!/usr/bin/env node
/**
 * Rewrite "/assets/.../<file>.(png|jpg)" → ".avif" wherever an AVIF sibling exists.
 * Operates only on .astro / .ts / .tsx files under src/, and on src/lib/.
 * Leaves <link rel="icon">, og:image meta, and any reference whose .avif sibling
 * is missing untouched.
 */
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from "node:fs";
import { join, parse } from "node:path";

const ROOT = new URL("../", import.meta.url).pathname;
const SRC = join(ROOT, "src");
const PUBLIC = join(ROOT, "public");

const files = [];
function walk(dir) {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    const st = statSync(full);
    if (st.isDirectory()) walk(full);
    else if (/\.(astro|ts|tsx|js|mjs)$/.test(e)) files.push(full);
  }
}
walk(SRC);

const PATTERN = /(["'`])(\/assets\/[^"'`]+?)\.(png|jpg|jpeg)\1/g;

let totalChanged = 0;
let totalRefs = 0;
for (const f of files) {
  let src = readFileSync(f, "utf8");
  let changed = false;
  const newSrc = src.replace(PATTERN, (match, q, path, ext) => {
    totalRefs++;
    const avifSibling = join(PUBLIC, path + ".avif");
    if (existsSync(avifSibling)) {
      changed = true;
      return `${q}${path}.avif${q}`;
    }
    return match;
  });
  if (changed) {
    writeFileSync(f, newSrc);
    const rel = f.replace(ROOT, "");
    const before = src.match(PATTERN)?.length ?? 0;
    const after = newSrc.match(PATTERN)?.length ?? 0;
    console.log(`✓ ${rel}  (${before - after} ref(s) migrated)`);
    totalChanged += before - after;
  }
}
console.log(`\nMigrated ${totalChanged} of ${totalRefs} image references to .avif.`);
