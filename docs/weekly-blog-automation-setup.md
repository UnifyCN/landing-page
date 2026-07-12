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

## 3. Pexels API key (thumbnail photos)

pexels.com/api → sign up (free) → "Your API Key" → copy it. Free tier is fine and
no attribution is required for our use. This is what the automation searches for a
topic-relevant photo to use as each post's thumbnail background.

## 4. Create the cloud routine (Claude Code on the web)

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
   PEXELS_API_KEY=<the Pexels key from step 3>
   RESEND_API_KEY=<the same key used by the worker>
   NOTIFY_TO_EMAIL=savar.gupta1922@gmail.com
   ```
   Note: env vars here are visible to anyone who can edit this environment. The
   Google key is read-only. Rotate the Sanity token if you add teammates.
6. **Allowed domains** (network settings) → add `api.sanity.io`, `api.resend.com`,
   `api.pexels.com`, and `images.pexels.com` (`*.googleapis.com` is allowed by
   default). If asset upload later 403s, also add `j4gu2dbr.api.sanity.io`.
7. **Setup script:** leave it **empty**. Dependencies are installed by the runbook
   (step 0) from inside the cloned repo. Do NOT put `npm ci`/`npm install` in the
   setup script - it runs outside the repo checkout (no `package-lock.json` there),
   so `npm ci` fails with "can only install with an existing package-lock.json".

## 5. Acceptance test

Trigger the routine manually (Run now). Expect within a few minutes:
- a new post live at `https://unifysocial.ca/blog/<slug>`, and
- a "Weekly blog published: ..." email at `NOTIFY_TO_EMAIL`.

If you instead get a "FAILED" email, it named the error and published nothing -
fix and re-run. The most common first-run issues: the SA email not added to the
GSC property (403), or `api.sanity.io` missing from allowed domains.
