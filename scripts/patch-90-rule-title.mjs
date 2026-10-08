// One-off CTR fix: retitle the 90% rule post. GSC (last 3 mo): 10,616 impressions,
// pos ~4.5, but 0.24% CTR - it ranks well and almost nobody clicks. The old title led
// with jargon; the new one mirrors the top query "what is the 90% rule in canada".
// Patches ONLY seoTitle + seoDescription on the published doc - title/body/faqs untouched.
//
//   node scripts/patch-90-rule-title.mjs                          # dry run
//   SANITY_WRITE_TOKEN=sk... node scripts/patch-90-rule-title.mjs --commit

import { createClient } from '@sanity/client';

const SLUG = 'when-newcomers-can-claim-full-non-refundable-tax-credits-in-canada-the-90-rule-explained';
const seoTitle = 'What Is the 90% Rule in Canada? Newcomer Tax Guide';
const seoDescription =
  "In your first year in Canada, the 90% rule decides whether you claim the full Basic Personal Amount or only a prorated share. Here's how to pass it.";

const tLen = seoTitle.length;
const dLen = seoDescription.length;
console.log(`seoTitle  (${tLen}): ${seoTitle}${tLen > 60 ? '  !! > 60' : ''}`);
console.log(`seoDesc   (${dLen}): ${seoDescription}${dLen < 140 || dLen > 160 ? `  !! ${dLen} out of 140-160` : ''}`);

if (!process.argv.includes('--commit')) {
  console.log('\nDry run only. Re-run with --commit and SANITY_WRITE_TOKEN to apply.');
  process.exit(0);
}
if (tLen > 60 || dLen < 140 || dLen > 160) {
  console.error('\nRefusing to commit: length out of target.');
  process.exit(1);
}
const token = process.env.SANITY_WRITE_TOKEN;
if (!token) { console.error('ERROR: set SANITY_WRITE_TOKEN to commit.'); process.exit(1); }

const client = createClient({ projectId: 'j4gu2dbr', dataset: 'production', apiVersion: '2024-01-01', token, useCdn: false });
const id = await client.fetch(`*[_type=="post" && !(_id in path("drafts.**")) && slug.current==$slug][0]._id`, { slug: SLUG });
if (!id) { console.error(`No published post for slug: ${SLUG}`); process.exit(1); }
await client.patch(id).set({ seoTitle, seoDescription }).commit();
console.log(`\nPatched ${id}. Live at https://unifysocial.ca/blog/${SLUG}`);
