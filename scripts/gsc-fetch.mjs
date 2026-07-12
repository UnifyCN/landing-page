// Pulls Google Search Console demand data via the Search Analytics API using a
// service-account key, and writes a normalized JSON the weekly blog runbook reads.
//
//   GCP_SA_KEY_B64=<base64 of SA json> GSC_SITE_URL=sc-domain:unifysocial.ca \
//     node scripts/gsc-fetch.mjs
//
// Output: /tmp/gsc-latest.json (override with GSC_OUT). Run from repo root.

import { JWT } from 'google-auth-library';
import { writeFileSync } from 'node:fs';

const b64 = process.env.GCP_SA_KEY_B64;
if (!b64) { console.error('ERROR: set GCP_SA_KEY_B64 (base64 of the service-account JSON key).'); process.exit(1); }

let creds;
try {
  creds = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
} catch {
  console.error('ERROR: GCP_SA_KEY_B64 is not valid base64-encoded JSON.'); process.exit(1);
}

const siteUrl = process.env.GSC_SITE_URL || 'sc-domain:unifysocial.ca';
const OUT = process.env.GSC_OUT || '/tmp/gsc-latest.json';

// GSC data lags ~2-3 days; window = last 90 days ending 3 days ago.
function dstr(daysAgo) { const d = new Date(); d.setDate(d.getDate() - daysAgo); return d.toISOString().slice(0, 10); }
const endDate = dstr(3);
const startDate = dstr(93);

const client = new JWT({
  email: creds.client_email,
  key: creds.private_key,
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
});

async function query(dimensions) {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
  const res = await client.request({ url, method: 'POST', data: { startDate, endDate, dimensions, rowLimit: 250 }, signal: AbortSignal.timeout(20000) });
  return (res.data && res.data.rows) || [];
}

function norm(rows) {
  return rows.map((r) => ({ key: r.keys[0], clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position }));
}

try {
  const [q, p] = await Promise.all([query(['query']), query(['page'])]);
  const out = {
    fetchedAt: new Date().toISOString(),
    range: { startDate, endDate },
    siteUrl,
    queries: norm(q).map(({ key, ...rest }) => ({ query: key, ...rest })),
    pages: norm(p).map(({ key, ...rest }) => ({ page: key, ...rest })),
  };
  writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log(`wrote ${OUT}: ${out.queries.length} queries, ${out.pages.length} pages (${startDate}..${endDate})`);
} catch (err) {
  console.error('ERROR: GSC fetch failed:', err?.response?.data || err?.message || err);
  process.exit(1);
}
