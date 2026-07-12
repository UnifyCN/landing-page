# Weekly SEO Blog Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A durable weekly cloud routine that pulls Google Search Console demand via API, writes a new blog post, and hard-publishes it to Sanity every Sunday, then emails a summary.

**Architecture:** A set of standalone Node scripts (`scripts/*.mjs`) plus a non-interactive runbook (`docs/weekly-blog-automation.md`) that a Claude Code cloud routine executes each Sunday. The routine clones the repo, runs the scripts with credentials supplied as routine environment variables, and publishes to Sanity via the existing `create-post.mjs`. No local machine involvement.

**Tech Stack:** Node.js (ESM `.mjs`), `google-auth-library` (new dep), `@sanity/client` (existing dev dep), `sharp` (existing dev dep), `resend` (existing dep), Google Search Analytics API, Sanity CMS (`j4gu2dbr`/`production`), Resend email.

## Global Constraints

- **No em dashes** anywhere (code, comments, docs, email copy, commit messages). Use a single hyphen.
- **No placeholder/dummy logic.** Build the real thing.
- **Node >= 22.12.0.** All scripts run from **repo root**.
- **Sanity:** projectId `j4gu2dbr`, dataset `production`, apiVersion `2024-01-01`.
- **Resend `from` must be** `contact@noreply.unifysocial.ca` (the only verified subdomain; the apex 403s).
- **GSC:** domain property, `GSC_SITE_URL=sc-domain:unifysocial.ca`, scope `https://www.googleapis.com/auth/webmasters.readonly`.
- **Publish mode:** hard auto-publish (`--commit --publish`); the advisory fact-check never blocks.
- **Cron:** `31 8 * * 0` (Sunday ~8:30am America/Vancouver).
- **Testing convention:** this repo has **no JS unit-test runner** (only a Playwright e2e smoke layer). Every `scripts/*.mjs` is verified by dry-run/smoke execution with expected stdout, matching `create-post.mjs`'s existing `--commit` gating. Follow that convention; do **not** add vitest/jest.
- **Do not commit secrets.** Credentials live only in the routine's environment config. Post JSON + generated PNG go to `/tmp` (never committed).

---

### Task 1: GSC fetch script

**Files:**
- Modify: `package.json` (add `google-auth-library` to `devDependencies`)
- Create: `scripts/gsc-fetch.mjs`

**Interfaces:**
- Consumes: env `GCP_SA_KEY_B64` (base64 of the service-account JSON key), `GSC_SITE_URL` (default `sc-domain:unifysocial.ca`), optional `GSC_OUT` (default `/tmp/gsc-latest.json`).
- Produces: a JSON file at `GSC_OUT` shaped `{ fetchedAt, range:{startDate,endDate}, siteUrl, queries:[{query,clicks,impressions,ctr,position}], pages:[{page,clicks,impressions,ctr,position}] }`. Consumed by the runbook (Task 6).

- [ ] **Step 1: Add the dependency**

Run from repo root:
```bash
npm install --save-dev google-auth-library
```
Expected: `package.json` gains `"google-auth-library"` under `devDependencies` and `package-lock.json` updates.

- [ ] **Step 2: Write `scripts/gsc-fetch.mjs`**

```javascript
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
  const res = await client.request({ url, method: 'POST', data: { startDate, endDate, dimensions, rowLimit: 250 } });
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
```

- [ ] **Step 3: Verify it fails cleanly with no credentials**

Run: `node scripts/gsc-fetch.mjs`
Expected: exits non-zero, prints `ERROR: set GCP_SA_KEY_B64 ...`. (Confirms the guard; full live smoke happens in Task 7 once the SA key exists.)

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json scripts/gsc-fetch.mjs
git commit -m "feat(seo): add GSC Search Analytics fetch script for blog automation"
```

---

### Task 2: List existing post slugs (dedup input)

**Files:**
- Create: `scripts/list-post-slugs.mjs`

**Interfaces:**
- Consumes: nothing (read-only, public CDN client, no token needed).
- Produces: prints a JSON array `[{slug, title}]` of published posts to stdout, and writes it to `/tmp/existing-posts.json`. Consumed by the runbook (dedup + slug-collision avoidance) and by anyone checking coverage.

- [ ] **Step 1: Write `scripts/list-post-slugs.mjs`**

```javascript
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

const posts = await client.fetch(query);
const OUT = process.env.SLUGS_OUT || '/tmp/existing-posts.json';
writeFileSync(OUT, JSON.stringify(posts, null, 2));
console.log(JSON.stringify(posts, null, 2));
console.error(`\n(${posts.length} published posts; also wrote ${OUT})`);
```

- [ ] **Step 2: Verify against live data**

Run: `node scripts/list-post-slugs.mjs`
Expected: prints a JSON array of the current published posts (slug + title), and stderr reports the count. This is a safe read.

- [ ] **Step 3: Commit**

```bash
git add scripts/list-post-slugs.mjs
git commit -m "feat(seo): add read-only post-slug lister for blog dedup"
```

---

### Task 3: Harden create-post against slug overwrite

**Files:**
- Modify: `scripts/create-post.mjs`

**Interfaces:**
- Consumes: the same JSON + env `SANITY_WRITE_TOKEN` as today; adds a `--force` flag.
- Produces: unchanged CLI, but `--publish` now refuses (exit 1) if a **published** post already exists at that slug, unless `--force` is passed. This is the last-line guard against `createOrReplace` silently overwriting an unrelated post.

- [ ] **Step 1: Add the `--force` flag near the other flag parsing**

In `scripts/create-post.mjs`, find:
```javascript
const COMMIT = args.includes('--commit');
const PUBLISH = args.includes('--publish');
```
Change to:
```javascript
const COMMIT = args.includes('--commit');
const PUBLISH = args.includes('--publish');
const FORCE = args.includes('--force');
```

- [ ] **Step 2: Insert the slug-collision guard inside `commit()`**

In `commit()`, find:
```javascript
  const client = createClient({ projectId: 'j4gu2dbr', dataset: 'production', apiVersion: '2024-01-01', token, useCdn: false });

  console.log('Uploading thumbnail...');
```
Insert the guard between them so it fails **before** uploading the thumbnail:
```javascript
  const client = createClient({ projectId: 'j4gu2dbr', dataset: 'production', apiVersion: '2024-01-01', token, useCdn: false });

  if (PUBLISH && !FORCE) {
    const existing = await client.fetch(
      `*[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0]{_id}`,
      { slug: post.slug },
    );
    if (existing?._id) {
      console.error(`ERROR: a published post already exists at slug "${post.slug}" (${existing._id}). Refusing to overwrite. Pass --force to override.`);
      process.exit(1);
    }
  }

  console.log('Uploading thumbnail...');
```

- [ ] **Step 3: Update the usage header comment**

Find the top usage block and add the `--force` note under the existing publish line:
```javascript
//   SANITY_WRITE_TOKEN=sk... node scripts/create-post.mjs <post.json> --commit --publish  # publishes
//   ... add --force to overwrite an existing published post at the same slug (guarded by default)
```

- [ ] **Step 4: Verify the guard refuses on a real existing slug**

Pick any slug printed by Task 2 (an existing published post), e.g. `<existing-slug>`. Create a minimal probe JSON at `/tmp/guard-probe.json`:
```json
{ "slug": "<existing-slug>", "title": "probe", "description": "x", "body": [{"p":"x"}], "thumbnail": "public/assets/logo/new-unify-logo-256.png" }
```
Run: `SANITY_WRITE_TOKEN="$(tr -d '[:space:]' < /tmp/stok)" node scripts/create-post.mjs /tmp/guard-probe.json --commit --publish`
Expected: exits 1 with `ERROR: a published post already exists at slug "<existing-slug>" ... Refusing to overwrite.` and **no** thumbnail upload line before it. (Requires a Sanity token in `/tmp/stok`; if none is handy, skip this live check and rely on the code review of Steps 1-2.)

- [ ] **Step 5: Commit**

```bash
git add scripts/create-post.mjs
git commit -m "fix(seo): refuse publishing over an existing slug in create-post (--force to override)"
```

---

### Task 4: Parameterize the thumbnail script

**Files:**
- Modify: `scripts/generate-post-thumbnail.mjs`

**Interfaces:**
- Consumes: env `THUMB_EYEBROW`, `THUMB_HEADLINE` (max 2 lines, `\n`-separated), `THUMB_OUT`. Each falls back to the current hardcoded default so manual runs are unchanged.
- Produces: an on-brand 1600x900 PNG at `THUMB_OUT`. Consumed by the runbook and passed as `thumbnail` in the post JSON.

- [ ] **Step 1: Replace the hardcoded per-post block with env-driven values**

Find (lines ~12-16):
```javascript
// ---- per-post content ----
const EYEBROW = 'Newcomer Tax Guide';
const HEADLINE_LINES = ['How Foreign Income', 'Is Taxed in Canada'];
const OUT = '.design-staging/foreign-income-tax-thumb.png';
// --------------------------
```
Replace with:
```javascript
// ---- per-post content (env-overridable for automation; falls back to defaults) ----
// THUMB_HEADLINE must be 1-2 lines, newline-separated. A 3rd line collides with the logo.
const EYEBROW = process.env.THUMB_EYEBROW || 'Newcomer Tax Guide';
const HEADLINE_LINES = (process.env.THUMB_HEADLINE || 'How Foreign Income\nIs Taxed in Canada')
  .split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 2);
const OUT = process.env.THUMB_OUT || '.design-staging/foreign-income-tax-thumb.png';
// ----------------------------------------------------------------------------------
```

- [ ] **Step 2: Verify the default path is unchanged**

Run: `node scripts/generate-post-thumbnail.mjs`
Expected: writes `.design-staging/foreign-income-tax-thumb.png (1600x900)` exactly as before (default values). Open the PNG and confirm the eyebrow/headline match the old output.

- [ ] **Step 3: Verify env override works**

Run:
```bash
THUMB_EYEBROW="Banking Guide" THUMB_HEADLINE=$'Best Bank for\nNewcomers in Canada' THUMB_OUT="/tmp/thumb-test.png" node scripts/generate-post-thumbnail.mjs
```
Expected: writes `/tmp/thumb-test.png (1600x900)`. Open it; confirm the eyebrow reads "Banking Guide" and the two headline lines render.

- [ ] **Step 4: Commit**

```bash
git add scripts/generate-post-thumbnail.mjs
git commit -m "feat(seo): make thumbnail eyebrow/headline/out env-overridable for automation"
```

---

### Task 5: Notification email script

**Files:**
- Create: `scripts/notify-run.mjs`

**Interfaces:**
- Consumes: env `RESEND_API_KEY`, `NOTIFY_TO_EMAIL`, optional `NOTIFY_FROM_EMAIL` (default `Unify Blog Bot <contact@noreply.unifysocial.ca>`), and a payload file at `NOTIFY_PAYLOAD` (default `/tmp/notify.json`). Supports `--dry` to print the email instead of sending.
- Payload shape (written by the runbook):
  ```json
  { "status": "published" | "failed", "title": "", "slug": "", "url": "", "topicReason": "",
    "factCheck": ["claim - source", "..."], "error": "" }
  ```
- Produces: sends (or with `--dry`, prints) a summary email. The Studio unpublish link is a Sanity intent link.

- [ ] **Step 1: Write `scripts/notify-run.mjs`**

```javascript
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

const esc = (s) => String(s ?? '').replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c]));
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
```

- [ ] **Step 2: Verify `--dry` renders both states**

Write a published-state payload:
```bash
cat > /tmp/notify.json <<'JSON'
{ "status":"published","title":"Best Bank for Newcomers in Canada","slug":"best-bank-for-newcomers-in-canada","url":"https://unifysocial.ca/blog/best-bank-for-newcomers-in-canada","topicReason":"1.2k impressions, position 11, no dedicated post","factCheck":["Newcomers can open a chequing account without credit history - RBC/Scotiabank newcomer program pages","No SIN required to open some accounts - canada.ca"] }
JSON
node scripts/notify-run.mjs --dry
```
Expected: prints from/to/subject and the published HTML including the live link and the `intent/edit/id=...;type=post` Studio link.

Then a failure payload:
```bash
echo '{ "status":"failed","error":"GSC fetch failed: 403 insufficient permissions" }' > /tmp/notify.json
node scripts/notify-run.mjs --dry
```
Expected: prints the failure HTML with the error block.

- [ ] **Step 3: Commit**

```bash
git add scripts/notify-run.mjs
git commit -m "feat(seo): add Resend notification script for blog automation runs"
```

---

### Task 6: The weekly runbook

**Files:**
- Create: `docs/weekly-blog-automation.md`

**Interfaces:**
- Consumes: all Task 1-5 scripts and the routine env vars.
- Produces: the ordered, non-interactive procedure the cloud routine executes. This IS the routine's instruction set.

- [ ] **Step 1: Write `docs/weekly-blog-automation.md`**

````markdown
# Weekly Blog Automation - Runbook (executed by the Sunday cloud routine)

You are running unattended in a Claude Code cloud routine. There is NO human to
ask. Do NOT use AskUserQuestion. Follow every step in order. If a hard step
fails, jump to "On failure" and stop. The design rationale is in
`docs/superpowers/specs/2026-07-11-weekly-seo-blog-automation-design.md`.

Credentials arrive as environment variables (already set on the routine):
`SANITY_WRITE_TOKEN`, `GCP_SA_KEY_B64`, `GSC_SITE_URL`, `RESEND_API_KEY`,
`NOTIFY_TO_EMAIL`. All commands run from the repo root.

## Steps

0. **Install deps:** `npm ci`

1. **Fetch GSC demand:** `node scripts/gsc-fetch.mjs`
   - Verify `/tmp/gsc-latest.json` exists and its `queries` array is non-empty.
   - If it fails or is empty: go to "On failure" with that error. Do NOT publish blind.

2. **List existing posts:** `node scripts/list-post-slugs.mjs` (writes `/tmp/existing-posts.json`).

3. **Pick ONE topic.** Read `/tmp/gsc-latest.json` and apply the opportunity logic
   from `.claude/skills/creating-seo-blog-posts/SKILL.md`:
   - **Expand:** clusters ranking near page 1 (position ~8-20) with impressions but no dedicated post.
   - **Gap:** a strong adjacent theme we have NOT covered. A real gap will not appear in GSC,
     so do a quick web search to confirm real demand and a winnable SERP
     (NOT canada.ca/CRA/IRCC head-term dominated).
   - Dedup against `/tmp/existing-posts.json` and the `/teer` cluster. Cross-link, do not cannibalize.
   - Choose a keyword-first, hyphenated `slug`. It MUST NOT match any slug in `/tmp/existing-posts.json`.

4. **Write the post JSON** to `/tmp/<slug>.json` in the shape documented in the skill,
   hitting the field targets: `title`, `seoTitle` (<=60 chars), `description` (140-160),
   `keyTakeaway` (40-60 words), 3-4 `faqs`, H2 `body` with short paragraphs, bullets, and a
   comparison table where useful. Ground every factual claim in a primary source
   (canada.ca / CRA / IRCC / reputable survey) and name the source in-copy. No em dashes.
   Set `"thumbnail": "/tmp/<slug>-thumb.png"` (generated next).

5. **Advisory fact-check (does NOT block publishing).** Re-read each factual claim in the
   draft and confirm it traces to the cited primary source. Build a `factCheck` list of
   `"<claim> - <source>"` strings for the email. If a claim cannot be verified, soften or
   cut it in the JSON, but still proceed to publish.

6. **Generate the thumbnail** (headline max 2 lines):
   ```bash
   THUMB_EYEBROW="<short category, e.g. Banking Guide>" \
   THUMB_HEADLINE=$'<Line one>\n<Line two>' \
   THUMB_OUT="/tmp/<slug>-thumb.png" \
   node scripts/generate-post-thumbnail.mjs
   ```

7. **Dry-run the post, then publish:**
   ```bash
   node scripts/create-post.mjs /tmp/<slug>.json                       # dry run, review warnings
   node scripts/create-post.mjs /tmp/<slug>.json --commit --publish    # go live
   ```
   - If the dry run shows a `missing required` warning, fix the JSON before publishing.
   - If publish exits non-zero (e.g. slug guard fires), go to "On failure".

8. **Verify live:** `curl -s https://unifysocial.ca/blog/<slug>` and confirm the `<title>`
   is the `seoTitle` and the page contains the key-takeaway callout and `FAQPage` JSON-LD.

9. **Notify success:** write `/tmp/notify.json`:
   ```json
   { "status":"published","title":"<title>","slug":"<slug>",
     "url":"https://unifysocial.ca/blog/<slug>","topicReason":"<one line: the GSC/search signal>",
     "factCheck":["<claim> - <source>", "..."] }
   ```
   then `node scripts/notify-run.mjs`.

## On failure

Write `/tmp/notify.json`:
```json
{ "status":"failed","error":"<what failed and the error text>" }
```
then run `node scripts/notify-run.mjs` and STOP. Never leave a half-written or
overwritten post. Publishing is all-or-nothing.
````

- [ ] **Step 2: Verify the runbook references only real script paths/flags**

Run: `grep -oE 'scripts/[a-z-]+\.mjs' docs/weekly-blog-automation.md | sort -u`
Expected: `scripts/create-post.mjs`, `scripts/generate-post-thumbnail.mjs`, `scripts/gsc-fetch.mjs`, `scripts/list-post-slugs.mjs`, `scripts/notify-run.mjs` - each of which now exists (`ls` them to confirm).

- [ ] **Step 3: Commit**

```bash
git add docs/weekly-blog-automation.md
git commit -m "docs(seo): add non-interactive weekly blog automation runbook"
```

---

### Task 7: One-time setup guide + routine creation

**Files:**
- Create: `docs/weekly-blog-automation-setup.md`

**Interfaces:**
- Consumes: the runbook (Task 6) and all scripts.
- Produces: the human-followed guide to provision Google, Sanity, and the cloud routine. Some steps are user actions in external UIs (GCP console, Sanity manage, Claude Code web) and cannot be run by the agent; the guide is the deliverable, and a manual routine trigger is the acceptance test.

- [ ] **Step 1: Write `docs/weekly-blog-automation-setup.md`**

````markdown
# Weekly Blog Automation - One-Time Setup

Do this once. After it, the routine runs every Sunday with no further action.

## 1. Google Search Console API (service account)

1. Go to console.cloud.google.com → create a project (e.g. `unify-gsc`).
2. APIs & Services → Library → enable **Google Search Console API**.
3. APIs & Services → Credentials → Create credentials → **Service account**
   (e.g. `blog-automation`). No project roles needed.
4. Open the service account → Keys → Add key → **JSON** → download it.
5. Base64-encode it for the routine env var:
   ```bash
   base64 -i /path/to/key.json | tr -d '\n' | pbcopy   # now on your clipboard
   ```
6. In Search Console (search.google.com/search-console) for the `unifysocial.ca`
   **domain property** → Settings → Users and permissions → Add user →
   paste the service account's email (`...@<project>.iam.gserviceaccount.com`) →
   permission **Restricted** (read-only is enough).

## 2. Sanity Editor token

manage.sanity.io → project `j4gu2dbr` → API → Tokens → Add token →
name `blog-automation`, role **Editor** → copy it.

## 3. Create the cloud routine (Claude Code on the web)

1. Open Claude Code on the web → Routines → New routine.
2. Add this repository. Default branch (`main`) is used - make sure the automation
   code (this branch) is merged to `main` first, or the cloud clone will not see it.
3. **Schedule:** cron `31 8 * * 0`, timezone **America/Vancouver**.
4. **Prompt:** `Execute docs/weekly-blog-automation.md end to end.`
5. **Environment variables** (Environment settings → add in `.env` form):
   ```
   SANITY_WRITE_TOKEN=<the Editor token>
   GCP_SA_KEY_B64=<the base64 from step 1.5>
   GSC_SITE_URL=sc-domain:unifysocial.ca
   RESEND_API_KEY=<the same key used by the worker>
   NOTIFY_TO_EMAIL=savar.gupta1922@gmail.com
   ```
   Note: env vars here are visible to anyone who can edit this environment. The
   Google key is read-only. Rotate the Sanity token if you add teammates.
6. **Allowed domains** (network settings) → add `api.sanity.io` and `api.resend.com`
   (`*.googleapis.com` is allowed by default). If asset upload later 403s, also add
   `j4gu2dbr.api.sanity.io`.

## 4. Acceptance test

Trigger the routine manually (Run now). Expect within a few minutes:
- a new post live at `https://unifysocial.ca/blog/<slug>`, and
- a "Weekly blog published: ..." email at `NOTIFY_TO_EMAIL`.

If you instead get a "FAILED" email, it named the error and published nothing -
fix and re-run. The most common first-run issues: the SA email not added to the
GSC property (403), or `api.sanity.io` missing from allowed domains.
````

- [ ] **Step 2: Verify the guide's cron + site values match the code defaults**

Run:
```bash
grep -n "31 8 \* \* 0" docs/weekly-blog-automation-setup.md
grep -n "sc-domain:unifysocial.ca" docs/weekly-blog-automation-setup.md scripts/gsc-fetch.mjs
```
Expected: the cron matches the Global Constraints, and the default `GSC_SITE_URL` in the setup guide equals the fallback in `gsc-fetch.mjs`.

- [ ] **Step 3: Commit**

```bash
git add docs/weekly-blog-automation-setup.md
git commit -m "docs(seo): add one-time setup guide for the weekly blog routine"
```

---

## Post-implementation (human-gated, not agent steps)

1. Open a PR for this branch, review, and **merge to `main`** (the routine clones `main`).
2. Follow `docs/weekly-blog-automation-setup.md` to provision Google + Sanity + the routine.
3. Run the routine manually once (acceptance test above) before trusting the Sunday schedule.

## Self-Review (completed by plan author)

- **Spec coverage:** gsc-fetch (Task 1) ✓, dedup/list-slugs (Task 2) ✓, slug-collision guard (Task 3) ✓, thumbnail param (Task 4) ✓, notify + advisory fact-check surfaced in email (Task 5) ✓, non-interactive runbook (Task 6) ✓, env/secrets + allowed domains + Google/Sanity setup + routine cron (Task 7) ✓. Reused create-post/thumbnail ✓. Failure handling (GSC abort, slug refusal, failure email) ✓.
- **Placeholder scan:** every code step contains full file/edit content; the `<slug>` / `<title>` tokens in the runbook and setup guide are intentional runtime substitutions, not plan placeholders.
- **Type/name consistency:** env var names (`GCP_SA_KEY_B64`, `GSC_SITE_URL`, `SANITY_WRITE_TOKEN`, `RESEND_API_KEY`, `NOTIFY_TO_EMAIL`, `THUMB_*`), the notify payload keys (`status/title/slug/url/topicReason/factCheck/error`), the `/tmp/gsc-latest.json` / `/tmp/existing-posts.json` / `/tmp/notify.json` paths, and the `--force`/`--dry` flags are used identically across Tasks 1-7.
