// Emails the outcome of the weekly blog automation via Resend.
// Reads a JSON payload (default /tmp/notify.json). Use --dry to print, not send.
//
//   NOTIFY_TO_EMAIL=you@example.com RESEND_API_KEY=re_... node scripts/notify-run.mjs
//   node scripts/notify-run.mjs --dry
//
// Run from repo root.

import { Resend } from 'resend';
import { readFileSync } from 'node:fs';

const DRY = process.argv.includes('--dry');
const payloadPath = process.env.NOTIFY_PAYLOAD || '/tmp/notify.json';
const from = process.env.NOTIFY_FROM_EMAIL || 'Unify Blog Bot <contact@noreply.unifysocial.ca>';
const to = process.env.NOTIFY_TO_EMAIL;

let p;
try { p = JSON.parse(readFileSync(payloadPath, 'utf8')); }
catch { console.error(`ERROR: cannot read payload at ${payloadPath}`); process.exit(1); }

const esc = (s) => String(s ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
const studioUrl = p.slug ? `https://unify-landing.sanity.studio/intent/edit/id=${encodeURIComponent(p.slug)};type=post` : '';
const fc = Array.isArray(p.factCheck) && p.factCheck.length
  ? `<ul>${p.factCheck.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>` : '<p>(none recorded)</p>';

let subject, html;
if (p.status === 'published') {
  subject = `Weekly blog published: ${p.title}`;
  html = `
    <div style="font-family: sans-serif; max-width: 640px; margin: 0 auto; color:#181818;">
      <h2 style="color:#171616;">Published a new blog post</h2>
      <p><strong>${esc(p.title)}</strong></p>
      <p><strong>Why this topic:</strong> ${esc(p.topicReason)}</p>
      <p><strong>Live:</strong> <a href="${esc(p.url)}">${esc(p.url)}</a></p>
      <p><strong>Unpublish / edit in Studio:</strong> <a href="${esc(studioUrl)}">open in Sanity</a> (then use the document menu to Unpublish)</p>
      <hr style="border:none;border-top:1px solid #eee;margin:1.5rem 0;" />
      <p><strong>Advisory fact-check (not a gate):</strong></p>
      ${fc}
    </div>`;
} else {
  subject = 'Weekly blog automation FAILED (no post published)';
  html = `
    <div style="font-family: sans-serif; max-width: 640px; margin: 0 auto; color:#181818;">
      <h2 style="color:#D84A29;">Weekly blog automation failed</h2>
      <p>No post was published this run. Nothing was overwritten.</p>
      <p><strong>Error:</strong></p>
      <pre style="white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:6px;">${esc(p.error)}</pre>
    </div>`;
}

if (DRY) {
  console.log(`--- DRY RUN ---\nfrom: ${from}\nto: ${to}\nsubject: ${subject}\n\n${html}`);
  process.exit(0);
}

const key = process.env.RESEND_API_KEY;
if (!key) { console.error('ERROR: set RESEND_API_KEY (or use --dry).'); process.exit(1); }
if (!to) { console.error('ERROR: set NOTIFY_TO_EMAIL (or use --dry).'); process.exit(1); }

const resend = new Resend(key);
const { error } = await resend.emails.send({ from, to, subject, html });
if (error) { console.error('ERROR: Resend send failed:', error); process.exit(1); }
console.log(`Sent "${subject}" to ${to}`);
