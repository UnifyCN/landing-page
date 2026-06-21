# SEO + AI-Search Audit (June 2026)

> Data-grounded audit run 2026-06-20 against live `unifysocial.ca` + GSC export (last 3 months, 2026-03-20 to 2026-06-19). Anchored on real Search Console data, not guesses. Builds on SEO Sprint v2 (see [`seo-retro.md`](seo-retro.md)). Skills used: `seo-audit`, `ai-seo` (coreyhaines31/marketingskills).

---

## Executive summary

**Overall health: technically excellent, commercially concentrated, and presentation-bottlenecked.**

The Sprint v2 technical foundation is genuinely strong: Lighthouse SEO 100, valid schema rendering site-wide, clean canonical/OG/robots, and an AI-crawler policy that correctly allows search/citation bots while blocking training crawlers. That work is done and should not be redone.

The organic engine is almost entirely **the blog**, and it is concentrated in two clusters:

| Cluster | Clicks (3mo) | Impressions | Avg position | Diagnosis |
|---|---|---|---|---|
| **TEER 3 / skilled jobs** | ~240 (44% of all clicks) | ~15.6K | 5.5 | Breakout winner. Underexploited. |
| **Tax / foreign income** | ~56 | ~31K+ | 4.5-23 | Ranks but **0.1-0.3% CTR**. Broken SERP presentation. |
| Homepage (mostly branded) | 188 | 8.5K | 6.4 | Brand term diluted ("Unify" is generic). |
| Students / PR / work-permit | ~4 total | <150 | - | **Near-zero visibility.** The aspiration gap. |

True site totals: **546 clicks / 68,196 impressions / avg position ~7-8**, trending up (Mar 43 -> Apr 168 -> May 274 clicks). Traffic is 80% Canada, and mobile converts 3x better than desktop.

**Top 5 priorities (by ROI on existing traffic):**

1. **Fix blog title tags (P1).** Every blog title tag is 80-119 chars and truncates in SERP. There is no dedicated SEO-title field in Sanity, so the title tag is forced to be the full editorial sentence + " | Unify Social". This is the direct cause of the tax cluster's 0.2% CTR at page-1 positions.
2. **Rescue the tax cluster (P1).** 31K+ impressions, near-zero clicks. Rewrite titles/descriptions for the SERP, deepen thin posts (one ranks at 698 words), add answer-first lead blocks.
3. **Expand the TEER winner into a programmatic cluster (P2).** 198 related queries already surfacing. Textbook programmatic-SEO opportunity that directly serves "skilled workers."
4. **Build topical clusters for the zero-visibility audiences (P2):** international students, PR / Express Entry, work permits.
5. **Quick technical wins (P3):** blog posts are missing from the sitemap (0 of 30 URLs), no `llms.txt`, and the #1 page has literal parentheses in its URL slug.

**Reality check on the goal.** "Newcomers in Canada / immigration Canada / international students" as head terms are dominated by government (canada.ca, immigration.ca, ircc) and are effectively unwinnable, confirmed by both the SERP landscape and the GSC data (we have ~zero visibility there despite trying). The winnable game, proven by the TEER win, is **specific long-tail intent + AI-citation + a programmatic long-tail engine**, not head terms. AI search is built on traditional ranking (92% of AI-Overview citations come from top-10 results), so the P1/P2 ranking + CTR work is also the foundation for getting cited.

---

## The data picture (GSC, last 3 months)

- **Totals:** 546 clicks, 68,196 impressions, ~0.8% CTR, avg position 7-8. Positive click trend; position drifting deeper as more long-tail impressions enter (normal).
- **Geography:** Canada 436 clicks / 36.5K impr (the real market). US 14 clicks / 17.5K impr (0.08% CTR - noise, likely deep positions + brand confusion). India 18, Nigeria 11, Pakistan 4.
- **Devices:** Mobile 299 clicks @ pos 5.9 (CTR 1.49%); Desktop 241 clicks @ pos 8.7 (CTR 0.5%). The huge low-CTR desktop impression base is the tax cluster sitting on page 2-3.
- **Branded vs non-branded (query-level):** ~113 vs ~100 clicks. Brand term "Unify" is heavily diluted - `what is unify` shows **1,298 impressions, 0 clicks at position 3.34** (other "Unify" products + no compelling result).
- **Top pages:** every top organic page is a blog post. `/blog/...(teer-3)...` (240 clicks), homepage (188), `/blog/...reporting-foreign-income...` (28 clicks / 16K impr / 0.17% CTR), `/blog/...90-rule...` (21 clicks / 10K impr / 0.21% CTR).

GSC artifacts saved locally (not committed): `/tmp/gsc-unify/` extracted from the user's export.

---

## Findings

Format: **Issue / Impact / Evidence / Fix / Priority.**

### Technical SEO

**T1. Blog posts absent from the XML sitemap.**
- Impact: Medium. Slower discovery of new/updated posts and no `lastmod` freshness signal - and freshness is a heavy AI-citation weight for the tax/commercial queries.
- Evidence: `sitemap-0.xml` has 30 URLs, **0** under `/blog/`. The blog is the entire organic engine, yet no post is in the sitemap. (`blog/[slug].astro` uses `getStaticPaths` but the routes are not landing in the sitemap.)
- Fix: emit a Sanity-driven blog sitemap (or include the prerendered blog routes) with `<lastmod>` from `updatedAt`. Resubmit in GSC.
- Priority: P3.

**T2. #1 page has literal parentheses in its URL slug.**
- Impact: Low-Medium, but it is our single most valuable URL. Parentheses are legal but fragile: the percent-encoded form `%28teer-3%29` 301s to `/blog`, breaking shares/citations that encode the URL.
- Evidence: `/blog/the-easiest-skilled-jobs-to-transition-into-(teer-3)-for-pr-purposes-in-canada`. Encoded variant redirects away.
- Fix: mint a clean slug (e.g. `easiest-teer-3-jobs-for-pr-in-canada`), 301 the old URL, update internal links. Handle carefully - it is the top page; preserve equity with a permanent redirect.
- Priority: P3 (high care).

**T3. AI-crawler policy is sound; one deliberate tradeoff to confirm.**
- Impact: Informational. Search/citation bots (OAI-SearchBot, ChatGPT-User, Claude-SearchBot, PerplexityBot, Bingbot, Applebot) are allowed; training bots blocked. Correct for "allow citation, block training."
- Evidence: live robots.txt Cloudflare managed block. `Google-Extended` is **disallowed** - this blocks Gemini-app grounding (it does NOT block Google AI Overviews, which use Googlebot).
- Fix: decision only. If Gemini-app citation matters, allow `Google-Extended`. Otherwise leave as a deliberate brand choice (per retro).
- Priority: P4 (decision).

**T4. Technical foundation verified clean** (no action): canonical self-referencing, full OG/Twitter, HTTPS, mobile, Lighthouse SEO 100, JSON-LD rendering server-side (verified: Organization + MobileApplication + FAQPage on `/`; BlogPosting + BreadcrumbList on posts).

### On-Page SEO

**O1. Blog title tags are 80-119 characters - all truncate in SERP. (ROOT CAUSE)**
- Impact: **Critical.** Title is the single biggest CTR lever, and ours bury the keyword/value past the truncation point on the exact pages that have page-1 rankings but failing CTR.
- Evidence: title tag is hardcoded `${post.title} | Unify Social` (`src/pages/blog/[slug].astro:106`); the Sanity `post` schema has **no `seoTitle` field** (`studio/schemaTypes/post.ts`). Measured live: 90-rule post 119 chars, credential-recognition 111, first-tax-return 89, split-year 88, foreign-income 86. The 90-rule post ranks **position 4.48 with 0.21% CTR**.
- Fix: add `seoTitle` (and `seoDescription`) to the Sanity post schema; render `seoTitle || title` in the `<title>` and `seoDescription || description` in the meta. Backfill short, keyword-front-loaded titles (50-60 chars) on the ~15 posts that earn impressions. Keep the long editorial `title` as the on-page H1.
- Priority: **P1.**

**O2. Meta descriptions not optimized for the surfacing query.**
- Impact: High (compounds O1 on CTR).
- Evidence: descriptions are decent length (~145-150 chars) but written as article summaries, not SERP hooks keyed to the query (e.g. tax posts should lead with the answer + a reason to click vs the CRA result above them).
- Fix: rewrite descriptions for the top ~15 posts against their actual GSC query, answer-first, with a click reason.
- Priority: P1 (same workstream as O1).

**O3. Blog index H1 is "The Blog"; title uses em dashes.**
- Impact: Low. Weak H1 keyword signal; em dashes violate the project copy rule.
- Evidence: `/blog` H1 = "The Blog"; title "Canada Newcomer Blog — Immigration, Jobs, Taxes & PR Guides".
- Fix: H1 -> keyword-aligned ("Canada Newcomer Guides" or similar); replace em dashes with hyphens in title/description.
- Priority: P3.

**O4. Static page titles/descriptions: spot-clean, full table pending.**
- Impact: Low. Homepage verified clean (title 60 chars, good). Section pages were tuned in Sprint v2.
- Fix: produce a full per-page title/description table and re-check targets against the GSC queries that actually surface (deliverable below).
- Priority: P3.

### Content Quality + AEO/GEO

**C1. Tax cluster is thin for its competitiveness.**
- Impact: High. Thin content caps both ranking ceiling and AI-citation probability against canada.ca/CRA.
- Evidence: 90-rule post = 698 words, 6 H2s, 1 table. Definitive guides that win these queries and get AI-cited typically run 1,500+ words with data, examples, and FAQs.
- Fix: deepen the 5-post tax cluster: worked examples, the actual forms (NR74/NR73 - both appear in our queries), edge cases, a "last updated [date]" stamp, and an FAQ block. Add `FAQPage`/`HowTo` schema where it fits.
- Priority: P1-P2.

**C2. Missing answer-first extraction blocks (AEO).**
- Impact: High for AI citation (ChatGPT/Perplexity/Claude) and featured snippets.
- Evidence: posts open with prose, not a 40-60 word direct-answer block. AEO research: answer-first blocks + stats (+37%) + citations (+40%) + quotes (+30%) are the highest-leverage citation signals.
- Fix: open every key post and section with a self-contained 40-60 word answer; add cited statistics with dates; cite primary sources (canada.ca/CRA/IRCC) inline; add a visible "Last updated" date.
- Priority: P2 (bundles with C1).

**C3. No `llms.txt` / machine-readable AI context file.**
- Impact: Low-Medium. Helps non-Google AI engines and agents understand the entity and find key pages. (Google does not require it.)
- Evidence: `/llms.txt` returns 403/404.
- Fix: add `/llms.txt` (entity overview + links to top guides + app). Optional: a lightweight `/pricing.md`-style "the app is free" fact file for buying-agent queries.
- Priority: P3.

**C4. Brand entity is diluted / ambiguous.**
- Impact: Medium (brand capture). "Unify" collides with other products; `what is unify` = 1,298 impr / 0 clicks.
- Evidence: GSC branded queries; weak entity disambiguation.
- Fix: strengthen Organization entity (sameAs to socials/app stores/Crunchbase), a clear "What is Unify Social" answer block on `/` or `/about`, and pursue a knowledge panel over time.
- Priority: P3-P4.

### Authority / Off-Page (out of code scope, flagged)

**A1. Citation density is the real ceiling on competitive terms.**
- Impact: High but off-code. Rankings and AI citations on contested queries are gated by independent third-party corroboration (Wikipedia, Reddit, gov/settlement directories, news, review sites).
- Fix: a parallel non-code workstream - settlement-org directory listings, guest content, authentic community presence, digital PR. Brands are ~6.5x more likely to be cited via third-party sources than their own domain.
- Priority: P4 (program, not a code task).

---

## Growth opportunities (the offense)

### G1. Programmatic TEER / NOC cluster (the centerpiece)

The data hands us a winner: 198 TEER-related queries already surfacing, 240 clicks, position 5.5. The intent is "which skilled jobs make me PR-eligible" - exactly the user's "skilled workers" goal. Query tail shows the demand shape: `teer 3 jobs for pr`, `which teer is eligible for pr`, `is teer 3 eligible for express entry`, `teer 3 jobs in nova scotia`, `noc teer 3 jobs`.

Programmatic build (scoped after approval, using the `programmatic-seo` skill):
- A TEER hub + per-TEER pages (TEER 0/1/2/3/4/5: definition, eligibility, example jobs, PR/Express-Entry pathways).
- Eligibility answer pages ("Is TEER X eligible for PR / Express Entry?") - direct answers to live queries.
- Optional deeper tier: NOC-code lookup pages or TEER x province pages (data permitting).
- Each page: answer-first block + table + internal links to the hub and the app. This both defends the win and captures the fan-out.

### G2. Topical clusters for the zero-visibility audiences

We have almost no footprint for international students, PR/Express Entry, and work permits despite them being core to the mission. Build pillar + spoke clusters (not head-term pages) targeting specific long-tail intent, structured for query fan-out and AI citation. Prioritize by winnability (avoid gov-saturated queries; target the practical "how do I actually do X as a newcomer" gaps that government pages handle poorly).

### G3. Tax cluster CTR rescue = fastest ROI

31K+ impressions already earned at page-1/2 positions. Just fixing titles/descriptions (O1/O2) and deepening content (C1/C2) could multiply tax-cluster clicks several-fold with zero new ranking work. This is the single highest-ROI move on the board.

---

## Prioritized action plan

**P1 - Critical, highest ROI on existing traffic**
1. Add `seoTitle` + `seoDescription` to the Sanity `post` schema; render `seoTitle || title` / `seoDescription || description`. (Schema edit -> Studio redeploy -> GROQ + types -> blog detail render.)
2. Backfill short, keyword-front-loaded titles + answer-first descriptions on the ~15 posts that earn impressions (tax cluster first).

**P2 - High-impact growth**
3. Deepen + AEO-restructure the 5-post tax cluster (answer-first blocks, stats with sources/dates, FAQ schema, last-updated stamp).
4. Design + build the programmatic TEER/NOC cluster (G1).
5. Build student / PR / work-permit topical clusters (G2).

**P3 - Quick technical wins**
6. Add blog posts to the sitemap with `lastmod`.
7. Clean the TEER post slug + 301 (high care).
8. Add `llms.txt`.
9. Blog index H1 + em-dash cleanup; full static-page title/description table.

**P4 - Long-term / decisions / non-code**
10. Off-page authority + citation-density program (A1).
11. Brand entity disambiguation + knowledge panel (C4).
12. Google-Extended allow/block decision (T3).
13. Revisit AggregateRating once visible reviews exist (per retro).

---

## Measurement baseline (re-check at Day 30 / Day 60)

- Clicks 546 / impressions 68,196 / avg pos ~7-8 (2026-03-20 to 06-19).
- Tax-cluster CTR: 0.1-0.3% (target: >1.5%).
- TEER post position: 5.5 (target: top 3).
- Student/PR/work-permit clicks: ~4 (target: establish a footprint).
- Add monthly AI-citation spot-checks (ChatGPT/Perplexity/Google AIO) for ~15 target prompts - the only way to measure AI visibility (no GSC equivalent).

## Out of scope / do not redo
Technical SEO foundation (Sprint v2), French localization (not on roadmap), AggregateRating (blocked on visible reviews), AI-training crawler access (deliberate block).
