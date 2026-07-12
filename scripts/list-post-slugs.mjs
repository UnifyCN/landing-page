// Read-only list of published blog post slugs + titles, for dedup during the
// weekly blog automation. No token required (published docs are public via CDN).
//
//   node scripts/list-post-slugs.mjs        # prints JSON, writes /tmp/existing-posts.json
//
// Run from repo root.

import { createClient } from '@sanity/client';
import { writeFileSync } from 'node:fs';

const client = createClient({ projectId: 'j4gu2dbr', dataset: 'production', apiVersion: '2024-01-01', useCdn: false });

const query = `*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]{
  "slug": slug.current, title
} | order(title asc)`;

try {
  const posts = await client.fetch(query);
  const OUT = process.env.SLUGS_OUT || '/tmp/existing-posts.json';
  writeFileSync(OUT, JSON.stringify(posts, null, 2));
  console.log(JSON.stringify(posts, null, 2));
  console.error(`\n(${posts.length} published posts; also wrote ${OUT})`);
} catch (err) {
  console.error('ERROR: failed to fetch post slugs from Sanity:', err?.message || err);
  process.exit(1);
}
