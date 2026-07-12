// Query Pexels for landscape photo candidates for a topic and download them, so
// the weekly automation (or a human) can pick the most on-brand one to use as a
// blog thumbnail background (THUMB_BG for generate-post-thumbnail.mjs).
//
//   PEXELS_API_KEY=... node scripts/fetch-pexels.mjs "<query>" [count] [outdir]
//
// Writes <outdir>/cand-N.jpg for each candidate and <outdir>/candidates.json
// (a manifest: [{ file, photographer, alt, url }]). Default outdir /tmp/pexels.
// Run from repo root.

import { mkdirSync, writeFileSync } from 'node:fs';

const KEY = process.env.PEXELS_API_KEY;
if (!KEY) { console.error('ERROR: set PEXELS_API_KEY.'); process.exit(1); }

const query = process.argv[2];
if (!query) { console.error('Usage: node scripts/fetch-pexels.mjs "<query>" [count] [outdir]'); process.exit(1); }
const count = Math.min(Math.max(Number(process.argv[3] || 8), 1), 15);
const outdir = process.argv[4] || '/tmp/pexels';
mkdirSync(outdir, { recursive: true });

const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=landscape&per_page=${count}&size=large`;

try {
  const res = await fetch(url, { headers: { Authorization: KEY }, signal: AbortSignal.timeout(20000) });
  if (!res.ok) { console.error(`ERROR: Pexels ${res.status}: ${(await res.text()).slice(0, 200)}`); process.exit(1); }
  const data = await res.json();
  const photos = data.photos || [];
  if (!photos.length) { console.error(`ERROR: no Pexels results for "${query}".`); process.exit(1); }

  const manifest = [];
  let i = 0;
  for (const ph of photos) {
    const src = ph.src.large2x || ph.src.original;
    const buf = Buffer.from(await (await fetch(src, { signal: AbortSignal.timeout(20000) })).arrayBuffer());
    const file = `${outdir}/cand-${i}.jpg`;
    writeFileSync(file, buf);
    manifest.push({ file, photographer: ph.photographer, alt: ph.alt || '', url: ph.url });
    i++;
  }
  writeFileSync(`${outdir}/candidates.json`, JSON.stringify(manifest, null, 2));
  console.log(`wrote ${manifest.length} candidates to ${outdir} (manifest: ${outdir}/candidates.json)`);
  for (const m of manifest) console.log(`  ${m.file}  <- ${m.photographer}: ${m.alt.slice(0, 64)}`);
} catch (err) {
  console.error('ERROR: Pexels fetch failed:', err?.message || err);
  process.exit(1);
}
