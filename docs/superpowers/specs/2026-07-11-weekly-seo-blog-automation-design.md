# Weekly SEO Blog Automation - Design Spec

- **Date:** 2026-07-11
- **Status:** Approved for implementation
- **Owner:** Savar
- **Related:** `.claude/skills/creating-seo-blog-posts/SKILL.md`, `docs/seo-retro.md`, `docs/seo-audit-2026-06.md`

## Goal

Every Sunday, autonomously produce and **publish** a new Unify blog post, using Google Search Console demand data - with no per-run human involvement and no per-run token handling. Set the credentials once; it runs itself.

## Decisions (locked, with the pushback recorded)

| Decision | Choice | Notes |
|---|---|---|
| Autonomy | **Hard auto-publish** | User was warned (below) and chose to always go live, gate or no gate. |
| Cadence | **Weekly (every Sunday)** | ~52 posts/year. |
| GSC data source | **Search Console API (zero-touch)** | Service-account auth, no CSV, no browser. |
| Runtime | **Claude Code cloud routine** | Durable, unattended, holds env vars, clones the repo each run. |
| Sanity token | **One persistent Editor token** | Set once as a routine env var. |
| Notification | **Email via Resend** | Summary + live URL + Studio unpublish link + advisory fact-check. |

### Pushback on record (informed-consent trail)

Fully autonomous, unreviewed weekly publishing carries two risks the user accepted:

1. **Factual liability.** An LLM writing about IRCC/CRA rules weekly, unreviewed, will eventually publish something wrong on a site whose value is being trustworthy to newcomers.
2. **Google "scaled content abuse"** (March 2024 spam policy). ~52 bot-written posts/year with no human gate fits the pattern; the penalty is **site-wide** ranking loss.

Mitigation retained despite hard-publish: an **advisory** fact-check pass (non-blocking) whose findings are emailed, plus an unpublish link, so a bad post is reversible quickly. This is a safety net, not the quality gate the user declined.

## Runtime (verified against official docs)

Claude Code cloud routines: clone the repo on every run, provide Node 20-22 + bash, and allow `*.googleapis.com` egress by default. They support environment variables (stored in the environment config). Because the routine *is* Claude running in Anthropic's cloud, there is **no separate Anthropic API key** to manage - the agent itself writes the post.

Two constraints designed around:

- **Env vars are not encrypted** - "visible to anyone who can edit that environment." Acceptable for a solo owner. The Google key is scoped **read-only** (low blast radius). Rotate the Sanity token if teammates are ever added to the environment.
- **`api.sanity.io` and `api.resend.com` are NOT on the default network allowlist** - must be added as custom allowed domains in the routine's environment config.

## Architecture

```
Sunday cron (routine)
        │
        ▼
 docs/weekly-blog-automation.md   ← the non-interactive runbook the agent executes
        │
        ├─ scripts/gsc-fetch.mjs          (SA auth → Search Analytics API → JSON)
        ├─ scripts/list-post-slugs.mjs    (read existing Sanity slugs → dedup/collision input)
        ├─ [agent judgment]               (pick topic, write post JSON, cite sources)
        ├─ scripts/generate-post-thumbnail.mjs   (parameterized: EYEBROW/HEADLINE/OUT via env)
        ├─ scripts/create-post.mjs --commit --publish   (hardened: refuses slug overwrite)
        └─ scripts/notify-run.mjs         (Resend email: summary + links + fact-check)
```

The **interactive** skill (`creating-seo-blog-posts`) is left untouched - it uses `AskUserQuestion`, which cannot run unattended. The runbook is a separate, non-interactive expression of the same pipeline.

## Components

### 1. `scripts/gsc-fetch.mjs` (new)
- **Purpose:** Pull Search Console demand data via API and write a normalized JSON the agent reads.
- **Auth:** service-account JWT → OAuth token, scope `https://www.googleapis.com/auth/webmasters.readonly`, via `google-auth-library` (new dev dependency).
- **Query:** two `searchAnalytics.query` calls against `{GSC_SITE_URL}` (default `sc-domain:unifysocial.ca`) - one `dimensions:['query']`, one `dimensions:['page']`, `rowLimit` ~250, date range `endDate = today-3` (GSC lag) back 90 days.
- **Input:** `GCP_SA_KEY_B64` (base64 of the SA JSON key), `GSC_SITE_URL`.
- **Output:** `/tmp/gsc-latest.json` `{ fetchedAt, range, queries[], pages[] }` with impressions/clicks/ctr/position.
- **Depends on:** `google-auth-library`, network to `*.googleapis.com` (default-allowed).

### 2. `scripts/list-post-slugs.mjs` (new)
- **Purpose:** Read-only GROQ pull of every existing published post `{slug, title}` so the agent can dedup topics and the collision guard has ground truth.
- **Auth:** read-only; can use the public CDN client (no token) or the write token if present.
- **Output:** JSON array to stdout / `/tmp/existing-posts.json`.

### 3. `docs/weekly-blog-automation.md` (new) - the runbook
Ordered, non-interactive steps the routine executes (detailed in "Sunday pipeline" below). This is the prompt/procedure the routine points at. No `AskUserQuestion`, no clipboard, no draft default.

### 4. `scripts/generate-post-thumbnail.mjs` (modify)
- **Change:** read `EYEBROW`, `HEADLINE_LINES` (newline- or `|`-separated), and `OUT` from env vars (or CLI args), falling back to the current hardcoded defaults so manual use is unchanged. The file header already anticipates this ("wire these to args for the future GSC → post skill").
- **Depends on:** `sharp` (already a dev dep), fonts + logo in `public/` (present in the repo clone).

### 5. `scripts/create-post.mjs` (modify - harden)
- **Change:** before an `--publish` `createOrReplace`, check whether a **published** doc already exists at that slug (`*[_type=="post" && slug.current==$slug && !(_id in path("drafts.**"))][0]`). If it exists, **refuse** (exit non-zero) unless `--force` is passed. `createOrReplace` is otherwise silently destructive on a slug collision - this is the single most dangerous failure mode of unattended publishing.
- Everything else (Portable Text build, thumbnail upload, field validation, DRAFT default) stays as-is.

### 6. `scripts/notify-run.mjs` (new)
- **Purpose:** Email the outcome via the `resend` package (already a dep).
- **From:** `contact@noreply.unifysocial.ca` (the Resend-verified subdomain). **To:** `NOTIFY_TO_EMAIL`.
- **Body:** topic chosen + why (the GSC signal), live URL, a Sanity Studio deep-link to unpublish/edit in ~2 clicks, and the advisory fact-check notes (claims + sources the agent relied on). On failure, sends a failure notice instead.
- **Depends on:** `RESEND_API_KEY`, network to `api.resend.com` (custom-allowed).

### 7. The routine (new, created in Claude Code on the web)
- **Cron:** `31 8 * * 0` - Sunday ~8:30am **Pacific** (nudged 1 min off the `:30` mark to dodge the global cron pileup). Set the routine's timezone to America/Vancouver.
- **Repo:** this repo.
- **Prompt:** "Execute `docs/weekly-blog-automation.md` end to end."

## Sunday pipeline (data flow)

1. `npm ci` (routine bootstrap) → `node scripts/gsc-fetch.mjs` → `/tmp/gsc-latest.json`. **Verify:** file exists, non-empty `queries`. On failure → email failure notice, **abort** (never publish blind).
2. `node scripts/list-post-slugs.mjs` → existing slugs/titles.
3. **Agent analyzes** GSC for fix/expand/gap opportunities; picks ONE topic. For a genuine gap (absent from GSC), do a quick web search to confirm real demand and a winnable SERP (not canada.ca/CRA/IRCC head-term dominated). Dedup against existing posts and the `/teer` cluster - cross-link, don't cannibalize.
4. **Slug check:** chosen slug must not collide with an existing published slug. If it does, pick a distinct angle/slug.
5. **Write** the post JSON to the field targets (title, seoTitle ≤60, description 140-160, keyTakeaway 40-60 words, 3-4 faqs, H2 body, table where useful). Ground every claim in a primary source and cite it.
6. **Advisory fact-check** (non-blocking): re-verify each factual claim against its cited source; record notes for the email. Does NOT hold publishing.
7. **Thumbnail:** set env vars → `node scripts/generate-post-thumbnail.mjs` → PNG in `.design-staging/`.
8. **Publish:** `node scripts/create-post.mjs <slug>.json` (dry run) → `... --commit --publish`. The hardened slug guard is the last-line protection. **Verify:** script exits 0 and prints the live URL.
9. **Verify live:** `curl` the live URL; confirm `<title>` is the seoTitle and the key-takeaway callout / FAQ / FAQPage JSON-LD render.
10. `node scripts/notify-run.mjs` → email summary.
11. **Any hard failure** (GSC down, missing required fields, slug collision, publish error) → email a failure notice; do not leave a half-written or overwritten post.

## Secrets & environment config (routine env)

| Var | Purpose |
|---|---|
| `SANITY_WRITE_TOKEN` | Sanity Editor token (write/publish). |
| `GCP_SA_KEY_B64` | Base64 of the service-account JSON key (base64 avoids newline/quote issues in `.env`). |
| `GSC_SITE_URL` | GSC property id, e.g. `sc-domain:unifysocial.ca`. |
| `RESEND_API_KEY` | Notification email. |
| `NOTIFY_TO_EMAIL` | `savar.gupta1922@gmail.com`. |
| `NOTIFY_FROM_EMAIL` | Optional; defaults to `contact@noreply.unifysocial.ca`. |

**Custom allowed domains to add:** `api.sanity.io`, `api.resend.com` (and `j4gu2dbr.api.sanity.io` if asset upload 403s on the exact-host allowlist). `*.googleapis.com` is default-allowed.

## One-time setup (user, guided during implementation)

1. **Google Cloud:** create a project → enable the **Search Console API** → create a **service account** → download its JSON key → base64 it for `GCP_SA_KEY_B64`.
2. **GSC:** add the service account's email as a **read-only** user on the `unifysocial.ca` property. Confirmed a **domain property** → `GSC_SITE_URL=sc-domain:unifysocial.ca`.
3. **Sanity:** mint one Editor token at manage.sanity.io → project `j4gu2dbr` → API → Tokens.
4. **Routine:** in Claude Code on the web, create the routine, add this repo, paste the env vars, add the custom allowed domains, set the Sunday cron, and point the prompt at the runbook.

## Failure handling & idempotency

- **Missing required fields** → `create-post.mjs` exits non-zero → failure email, no partial write.
- **Slug collision** → hardened guard refuses overwrite → agent re-slugs or aborts with a failure email.
- **GSC fetch fails** → abort + failure email (do not publish without data).
- **`publishedAt`** defaults to run-time `new Date().toISOString()` → unique featured slot each week.

## Non-goals / out of scope

- No draft-review gate (explicitly declined).
- No changes to the interactive `creating-seo-blog-posts` skill.
- No new worker API routes, no database, no dark mode.
- No computer-use / browser scraping of GSC.

## Known limitations (accepted)

- Hard-publish keeps the factual + scaled-content risks live; the advisory email + unpublish link is the only catch.
- Env vars are unencrypted in the routine config (solo-owner-acceptable; read-only Google key limits exposure).
- Weekly forever will eventually thin the topic well; the dedup guard prevents overwrites but cannot manufacture fresh demand.

## Verification plan (per component)

1. `gsc-fetch.mjs` → run locally with the SA key → **verify:** non-empty normalized JSON with real queries.
2. `list-post-slugs.mjs` → **verify:** returns the current published slugs.
3. `create-post.mjs` guard → attempt a publish onto an existing slug → **verify:** refuses without `--force`.
4. Thumbnail params → run with env vars → **verify:** PNG reflects the passed headline.
5. `notify-run.mjs` → dry send → **verify:** email arrives with correct links.
6. End-to-end dry run of the runbook (publish to a throwaway slug, then unpublish) → **verify:** live URL renders title + key-takeaway + FAQ JSON-LD; email received.
7. Create the routine, trigger a manual run → **verify:** full unattended pass in the cloud env.

## Addendum (2026-07-11): photo thumbnails

The thumbnail step evolved from the text-only white card to a **photo + brand overlay**: a
topic-relevant Pexels photo, cover-cropped, under a bottom gradient scrim, with the logo / red
rule / eyebrow / white headline stacked bottom-left (the white card remains the fallback when no
photo is supplied).

- `scripts/fetch-pexels.mjs` (new) - queries Pexels by topic, downloads landscape candidates to
  `/tmp/pexels`, writes a `candidates.json` manifest. The routine agent then **looks at** the
  candidates and picks the most relevant / on-brand one (rejecting cheesy or wrong-country images).
- `scripts/generate-post-thumbnail.mjs` gains a photo mode via `THUMB_BG` (the picked photo).
- `scripts/update-thumbnail.mjs` (new) - swaps only the thumbnail on an existing published post
  (upload asset + patch), used to backfill better thumbnails.
- New env var `PEXELS_API_KEY`; new allowed domains `api.pexels.com` + `images.pexels.com`.
- Runbook step 6 now: fetch candidates → agent picks → composite with `THUMB_BG`.
