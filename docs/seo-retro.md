# SEO Sprint v2 — Retro (landed 2026-05-13 → 2026-05-15)

> Moved out of `CLAUDE.md` to keep that file lean. This is the historical record + ongoing check-in triggers for the May 2026 SEO sprint.

Five-day sprint per `~/.claude/plans/seo-sprint-v2.md`. Goal: get every page discoverable, indexable, and machine-readable. Off-page work (backlinks, PR) explicitly out of scope.

## Sprint timeline

| Day | Date | Workstreams shipped | Commits |
|---|---|---|---|
| **Day 0** | 2026-05-13 → 14 | Keyword research locked, SERP scan with gov-dominance stop-rule, content-depth audit, link-graph audit. Output: `~/.claude/plans/seo-research.md` (sign-off doc, not committed) | — |
| **Day 1** | 2026-05-14 | Sitemap, robots, canonical/og/twitter meta tags, OG card, edge redirects | `5faf1ec`, `fa9f51f` |
| **Day 2** | 2026-05-14 | JSON-LD: Organization site-wide, MobileApplication + FAQPage on `/`, BlogPosting + BreadcrumbList on `/blog/[slug]`, BreadcrumbList on `/resources/[slug]`, BreadcrumbList + LocalBusiness on `/partners/[slug]` | `9f81e67`, plus redirect hotfix landed as `1f36aa6` (Cloudflare `html_handling: "drop-trailing-slash"` after `b6d1be3` narrow-rule attempt also failed to fully solve the loop) |
| **Day 3** | 2026-05-15 | Page title + description rewrites against §1 keywords; image audit (alt enrichment, `decoding="async"`, descriptive community filenames, asset cleanup); internal link graph fixes (`/community` in footer + `/about` CTA, "Related Resources" on partner detail pages) | `ad9ac30`, `6fcf84a`, `0b40020` |
| **Day 4** | 2026-05-15 | Production health verification; Lighthouse mobile pass; Bing site verification file; LCP performance fix (`fetchpriority="high"` + `<link rel="preload">` on hero images); GSC + Bing sitemap submission (user-driven); schema validation via Rich Results Test; this retro | `b894af8`, `3ffba6f` |

## Architecture (where the SEO machinery lives)

- **`@astrojs/sitemap`** auto-generates `/sitemap-index.xml` from prerendered routes. Configured in `astro.config.mjs` (`site: 'https://unifysocial.ca'`, `trailingSlash: 'never'`). **Blog post URLs are NOT in the sitemap** (SSR via Sanity; the integration only sees build-time routes). Acceptable for now — `/blog` index is in sitemap and Google discovers posts via its crawl.
- **`public/robots.txt`** — minimal `User-agent: * Allow: / Disallow: /api/` + sitemap directive. Cloudflare auto-injects an additional managed block at deployment time (the AI Crawl Control config) — see "Cloudflare AI Crawl Control" below.
- **`public/_redirects`** — `/privacy` and `/terms` 301 to Notion. **No trailing-slash rule** — Cloudflare's `html_handling` does canonicalization.
- **`wrangler.jsonc`** has `assets.html_handling: "drop-trailing-slash"` — Cloudflare itself serves no-slash URLs and 301s slash variants. This is what unblocked the `/partners`, `/about`, etc. redirect loop in `1f36aa6`. **Do not re-add a `_redirects` trailing-slash rule** — it loops with this setting.
- **`src/layouts/BaseLayout.astro`** emits, in `<head>`: canonical, robots, full `og:*` set, full `twitter:*` set, plus a global Organization JSON-LD block. Exposes a named `<slot name="head" />` so per-page schemas, preloads, and other head content inject from page files via `<Fragment slot="head">`. Optional props: `ogImage`, `ogType`, `noindex`, `canonicalPath`.
- **`src/lib/seo/`** — JSON-LD helper library (one schema function per file). Pages compose schemas by calling these and emitting via `<script type="application/ld+json" set:html={serializeLd(ld)} />`. `serializeLd` escapes `</script` defensively.
  - `serialize.ts` — the helper
  - `organizationLd.ts`, `mobileAppLd.ts`, `faqLd.ts`, `blogPostingLd.ts`, `breadcrumbLd.ts`, `localBusinessLd.ts`
  - `index.ts` — barrel exports
- **`src/components/sections/faqs-data.ts`** — FAQ Q&A array, extracted from `FAQ.astro` so both the component and the homepage's `faqLd()` import the same source. (Astro frontmatter doesn't reliably support typed named exports.)
- **`public/og-default.png`** — 1200×630 OG card. Editorial layout: multicolor starburst + "unify" wordmark top-left, brand-red eyebrow rule, headline "The Canada Newcomer Guide", subtext "Settle in Canada with confidence.", "unifysocial.ca" watermark bottom-left.
- **`scripts/generate-og-default.mjs`** — re-runnable Sharp-based generator for the OG card. Aileron font embedded via base64 `@font-face` in the SVG composite layer. Re-run when the Day 0 keyword or copy changes.
- **`public/BingSiteAuth.xml`** — Bing Webmaster Tools ownership proof. Serves at `/BingSiteAuth.xml`.

## Schema map (which page emits which JSON-LD)

| Page | Schemas |
|---|---|
| All pages (via BaseLayout) | `Organization` |
| `/` | + `MobileApplication`, `FAQPage` |
| `/blog/[slug]` | + `BlogPosting`, `BreadcrumbList` |
| `/partners/[slug]` | + `BreadcrumbList`, `LocalBusiness` |
| `/resources/[slug]` | + `BreadcrumbList` |

## Cloudflare AI Crawl Control (configured to Option 3)

Cloudflare's AI Crawl Control panel (Security → AI Crawl Control) is enabled at the zone level. Current config:
- **Allowed (AI search/inference):** Googlebot, Bingbot, Applebot, OAI-SearchBot, ChatGPT-User, Claude-SearchBot, DuckAssistBot, PerplexityBot
- **Blocked (AI training):** GPTBot, Google-Extended, ClaudeBot, CCBot, Applebot-Extended, Bytespider, meta-externalagent, Amazonbot, CloudflareBrowserRenderingCrawler

This preserves AI-Search visibility (Gemini grounding, ChatGPT search, DuckAssist) while keeping the content out of training corpora. **Don't flip GPTBot or Google-Extended to Allow** without an explicit brand-strategy decision — they're training-only crawlers, not search.

## Day 15 + Day 30 check-in triggers (calendar-driven)

**Day 15 — 2026-05-30 — SERP re-scan (~30 min)**

Re-run the Day 0 SERP scan on the 6 keywords using the same DuckDuckGo-HTML method + gov-dominance stop-rule. Compare top-5 domains against the Day 0 snapshot in `seo-research.md` §2.

Trigger fires (any one) → schedule a 30-min review with Luis + Day 5+ patch:
- ≥2 new domains entered top 5 on any keyword
- Gov-dominance count shifted by ≥1 on any keyword
- New AI Overview appeared on a keyword that didn't have one before

Expected outcome on most queries: stable, no triggers. That's a useful signal on its own.

**Day 30 — 2026-06-14 — GSC query overlap check (~45 min, decision point)**

Pull GSC Performance → Queries report (any position). Calculate the % of surfaced queries that overlap (exact or near-exact) with Day 0 target keywords:
- **<20% overlap** → course-correct in a Day 5+ follow-up. Rewrite page titles + descriptions against the actual surfacing queries.
- **20–50% overlap** → hold steady, not actionable yet.
- **≥50% overlap** → Day 0 targeting validated; double down with content investment.

**Sandbox effect:** if total impressions are <30/day at Day 30, the query data isn't yet statistically meaningful. Defer the overlap calc to Day 45 and re-check.

The GSC baseline export is in `gsc-baseline-2026-05/` locally (not committed; private measurement anchor).

## Final Lighthouse state (mobile, post-perf-fix)

| URL | Perf | A11y | Best Practices | SEO | LCP |
|---|---|---|---|---|---|
| `/` | 88 | 96 | 100 | 100 | 3.0s |
| `/about` | 81 | 96 | 100 | 100 | 4.0s |
| `/partners/rbc` | 92 | 96 | 100 | 100 | 2.9s |
| `/blog/how-to-immigrate-to-canada-in-2026` | 95 | 96 | 100 | 100 | 2.7s |

SEO 100 across the board. Performance hit the 95 target on `/blog/[slug]` but not on the other three. The Day 4 sprint gate was "SEO ≥ 95" — that passes.

## Performance follow-ups (deferred to a separate perf sprint)

1. **`/about` Perf 81** — the page is bottlenecked NOT by the hero image (preload + fetchpriority helped marginally; LCP only dropped 0.1s) but by the **`AboutProblem` letter-reveal animation + `AboutValues` letter-reveal sweep + `AboutOutro` per-word reveal + `AboutHero` photo carousel JS** all running early in the page lifecycle. Fix path: gate the reveal animations behind `requestIdleCallback` so they don't compete with LCP and TBT. Estimated +5 to +8 Perf points. Needs careful animation testing — the current reveal timing is finely tuned per the AboutHero/AboutOutro notes above.

2. **Explicit `width` + `height` on raster images** — currently absent from every `<img>` in the codebase. CLS is 0 today because of CSS sizing, but explicit intrinsic dimensions are best practice for Core Web Vitals stability. Needs a Sharp-driven script to extract intrinsic dimensions per image; ~half-day workstream.

3. **`/` and `/about` LCP still > 2.5s** — Mobile LCP "Good" threshold is ≤2.5s. We're between 2.5s and 4s ("Needs Improvement"). Further gains require either reducing image bytes further (we're already AVIF) or rethinking the hero composition for mobile (smaller image, lighter font payload above the fold).

## Out of scope / deferred to follow-up sprints

- **PostHog event instrumentation** (`app_store_click`, `contact_form_submit`, `partner_form_submit`, `download_app_click`, `faq_open`). Product analytics, not SEO — runs cleanly as an independent workstream.
- **AggregateRating schema** on `MobileApplication`. Blocked on rendering the 21 supporting reviews on the homepage. Google's structured-data spam policy explicitly disallows ratings without visible supporting reviews; do not add until reviews are on the page.
- **Sanity blog SEO fields** (`seoTitle`, `seoDescription`, `ogImage` on the Post schema). Requires schema edit → Studio redeploy → GROQ + types update → blog detail rendering update → content backfill on every existing post. ~1.5 days. Defer.
- **Per-page OG image overrides** — BaseLayout already accepts `ogImage` as a prop; `/blog/[slug]` and `/partners/[slug]` could pass post thumbnails / partner logos. Trivial 1-line additions but deferred to the perf or content sprint.
- **MobileApplication `softwareVersion`** — ships without it (field is optional). Add when Savar provides the current App Store build number; one-line follow-up.
- **French-Canadian localization** (`hreflang`, `fr-CA` URLs). Bilingual app translations are Vietnamese/Hindi per launch meeting; FR is not on the roadmap.
- **Programmatic SEO** (city × program landing pages). High effort, separate strategy decision.
- **`claude-seo` plugin** — evaluated and rejected at sprint start (every check it does is already covered by `/audit`, GSC, Rich Results Test, Schema Markup Validator, and Lighthouse).

## Tax-cluster Sanity cross-links — owned by the content team

`seo-research.md` §3 identified a 5-post tax cluster on the blog:
- `key-tax-refund-forms-for-newcomers-in-canada-a-guide`
- `reporting-foreign-income-as-a-canadian-newcomer-what-must-you-declare`
- `how-to-file-taxes-when-you-moved-to-canada-mid-year-split-year-residency`
- `when-newcomers-can-claim-full-non-refundable-tax-credits-in-canada-the-90-rule-explained`
- `how-do-newcomers-file-their-first-tax-return-in-canada-step-by-step-guide`

Day 3 workstream-3 punch list called for hub-and-spoke inline cross-links between these posts with varied anchor text. **This is Sanity content, not code** — the content team applies the cross-links manually in Sanity Studio. The cross-link matrix + insertion guidance are in the Day 3 workstream-3 plan that was approved. Do NOT try to edit Sanity content from code.

## What to do when CMS / page structure changes

Anything that adds a new prerendered route under `src/pages/` automatically picks up:
- Sitemap inclusion (via `@astrojs/sitemap`)
- Organization JSON-LD (via BaseLayout)
- Full og:/twitter:/canonical meta tag set (via BaseLayout)
- Trailing-slash handling (via Cloudflare `html_handling`)

What you must do per new route:
- Pass a unique `title` (50–60 chars) and `description` (140–160 chars) keyed against a Day 0 keyword
- If detail page: add a `BreadcrumbList` via `<Fragment slot="head">` using `breadcrumbLd()` from `src/lib/seo/`
- If above-fold hero image: add `fetchpriority="high"` to the `<img>` and a `<link rel="preload">` in the head slot

## Critical caveats — footguns to avoid

1. **`MobileApplication.name` must match the App Store listing exactly: `"Unify - Canada Newcomer Guide"`** (hyphen-minus, NOT an em dash). Typographically it might look "wrong" against the rest of the brand which prefers em dashes — leave it. Google cross-references the schema name with the App Store listing for app-pack rich results; an em dash here would mismatch the canonical store record. Same applies to `applicationCategory: "EducationApplication"` (not "LifestyleApplication" despite intuition — the App Store category was the source of truth).

2. **`BlogPosting.author` is hardcoded to `Organization { name: "Unify Social" }`** because `studio/schemaTypes/post.ts` has no `author` field. If/when an `author` field is added to the Post schema (Sanity Studio), update `src/lib/seo/blogPostingLd.ts` to pull the actual author name; otherwise leave the Organization fallback. Google accepts Organization-as-author for company-published blogs.

3. **The blog detail page hero image uses a `heroImageUrl` variable that MUST match the preload `<link>` byte-for-byte** (`src/pages/blog/[slug].astro`). If you add a transform to one without adding it to the other, the preload fires a second request and you get a double-fetch instead of a cache warm. Both currently use `urlFor(post.thumbnail).width(1200).url()`. The separate `thumbnailUrl` variable (1200×630 with explicit height) is for JSON-LD only — don't merge them.

4. **`public/_redirects` must NOT contain trailing-slash rules** (`/about/ /about 301`, `/*/  /:splat 301`, etc.). Cloudflare's `html_handling: "drop-trailing-slash"` in `wrangler.jsonc` does that canonicalization at the edge. Adding a `_redirects` rule re-creates the redirect loop that took two attempts to fix (`b6d1be3` narrowing didn't work; `1f36aa6` html_handling did). Only `/privacy` and `/terms` belong in `_redirects`.

5. **Day 0 keyword list lives at `~/.claude/plans/seo-research.md`** — NOT committed to this repo. The doc is the canonical source for which keyword each page is tuned against (see §1 for the locked keyword set). When rewriting any page title or description, check the §1 mapping for that page's target. The doc also holds the Day 15 SERP re-scan baseline and the Day 0 link-graph audit findings. If the file is missing on a fresh machine, ask Luis — he has the source-of-truth copy.

6. **GSC has a ~10–12 URLs/day Request Indexing quota per property.** When inspecting URLs in batches, prioritize the homepage + 4 section landing pages first; detail pages can wait for natural sitemap-driven discovery (usually 1–7 days). Hitting the quota isn't a problem — the sitemap covers everything anyway.
