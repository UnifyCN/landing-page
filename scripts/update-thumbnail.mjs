// Replace only the thumbnail of an existing PUBLISHED post (upload asset + patch
// the thumbnail field). Does not touch body/SEO/other fields. Use for backfilling
// better thumbnails onto already-published posts.
//
//   SANITY_WRITE_TOKEN=sk... node scripts/update-thumbnail.mjs <slug> <image-path>
//
// Run from repo root.

import { createClient } from '@sanity/client';
import { readFileSync } from 'node:fs';

const [slug, img] = process.argv.slice(2);
if (!slug || !img) { console.error('Usage: node scripts/update-thumbnail.mjs <slug> <image-path>'); process.exit(1); }

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) { console.error('ERROR: set SANITY_WRITE_TOKEN.'); process.exit(1); }

const client = createClient({ projectId: 'j4gu2dbr', dataset: 'production', apiVersion: '2024-01-01', token, useCdn: false });

const existing = await client.fetch(`*[_type == "post" && _id == $id][0]{ _id, title }`, { id: slug });
if (!existing?._id) { console.error(`ERROR: no published post with _id "${slug}". Nothing updated.`); process.exit(1); }

console.log(`Uploading thumbnail for "${existing.title}"...`);
const asset = await client.assets.upload('image', readFileSync(img), { filename: `${slug}.png` });

const res = await client
  .patch(slug)
  .set({
    thumbnail: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
    updatedAt: new Date().toISOString(),
  })
  .commit();

console.log(`Updated thumbnail on ${res._id}`);
console.log(`Live: https://unifysocial.ca/blog/${slug}`);
