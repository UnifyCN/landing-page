---
name: creating-seo-blog-posts
description: Use when writing, creating, or publishing a Unify blog post in Sanity, or turning Google Search Console data into blog ideas. Triggers - "write a blog post", "new blog post", "blog idea", "what should we write about", "GSC blog ideas", SEO content for the blog, publish to Sanity.
---

# Creating SEO Blog Posts (Unify)

## Overview

End-to-end pipeline for shipping a high-performing Unify blog post: mine Search Console for demand, pick a topic, write an SEO + AEO optimized post, generate an on-brand thumbnail, and create it in Sanity. **Default to creating a DRAFT for human review; publish only on explicit approval.**

Blog content lives in Sanity (project `j4gu2dbr`, dataset `production`), rendered by an SSR Astro route. Posts sort by `publishedAt desc`, so the newest published post is the featured slot.

## The pipeline

1. **Get GSC data.** Ask the user to export Search Console → Performance → Queries + Pages (CSV/zip). Analyze for three things:
   - **Fix opportunities:** pages with high impressions + low CTR (snippet/title problem).
   - **Expand opportunities:** clusters where we rank near page 1 but lack a dedicated post.
   - **Gap opportunities (new posts):** strong themes adjacent to ours that we have NOT covered. A genuine gap will NOT appear in GSC (no content = no impressions), so validate its demand with a web search and check the SERP is winnable (NOT government-dominated head terms).
2. **Propose + pick a topic.** Offer 2-3 data-backed ideas (AskUserQuestion). State the demand evidence and winnability for each.
3. **Write the post.** Match the existing blog voice: warm, human, editorial, practical. No em dashes (use hyphens). Ground claims in primary sources (canada.ca/CRA/IRCC, reputable surveys) and cite them. Hit the field targets below.
4. **Generate a thumbnail.** Edit `EYEBROW` / `HEADLINE_LINES` / `OUT` in `scripts/generate-post-thumbnail.mjs` and run it. Review the PNG. (Or use a supplied photo.)
5. **Create in Sanity.** Copy `scripts/create-post-build-credit.mjs` as a template, swap the content, dry-run, then `--commit` with a token. Create as a **draft** unless the user said publish.
6. **Verify + index.** After publish, curl the live URL for the title, key-takeaway, FAQ, and FAQPage schema. Tell the user to Request Indexing in GSC.

## Field targets (Sanity `post` schema)

| Field | Target |
|---|---|
| `title` | Full editorial headline (the on-page H1). |
| `seoTitle` | The `<title>` tag. Keyword-first, <=60 chars. |
| `description` / `seoDescription` | Answer-first meta, 140-160 chars, with a reason to click. |
| `keyTakeaway` | Answer-first summary, 40-60 words (renders as a callout; prime for snippets/AI). |
| `faqs[]` | 3-4 `{question, answer}` pairs (renders a visible FAQ + **FAQPage JSON-LD**). |
| `body` | Portable Text: H2 sections, short paragraphs, bullet lists, a comparison `table` where useful. |
| `thumbnail` | REQUIRED image (post won't render without it). |
| `publishedAt` / `updatedAt` | ISO dates. Newest `publishedAt` becomes the featured post. |
| `order` | Required number; legacy (sorting is by `publishedAt`). Set to 0. |

AEO wins that get cited by AI: open with the answer, use stats with sources, comparison tables, and the FAQ. See the `ai-seo` and `seo-audit` skills for depth.

## Applying a Sanity write (token flow)

Writes need a fresh **Editor** token (manage.sanity.io → `j4gu2dbr` → API → Tokens). Keep it out of the chat:

```
# user copies the token, then in their own terminal / via the ! prefix:
! pbpaste > /tmp/stok
# then I run:
SANITY_WRITE_TOKEN="$(tr -d '[:space:]' < /tmp/stok)" node scripts/<create-script>.mjs --commit
# then: rm /tmp/stok ; user revokes the token
```

Every write script must be **dry-run by default** (print a summary, write nothing) and only mutate with `--commit`. Use `createOrReplace` with a slug-based `_id` (idempotent). Exclude drafts from any slug lookup: `!(_id in path("drafts.**"))`.

## Building the body (Portable Text)

`create-post-build-credit.mjs` has helpers - reuse them:
- `para(text)`, `h2(text)` - blocks
- `li(lead, rest)` - bullet with a bold lead phrase
- `table(rows)` - first row is the header; cells are plain strings (renders via the blog's `table` handler)
- `faqs` - array of `{_type:'faq', _key, question, answer}`

Every block/span needs a unique `_key`. The blog post page already renders `<CTABand/>` at the bottom, so don't add a hard app CTA in the body - keep the closing soft.

## Common mistakes

- Publishing without review (default is a draft; publish only when asked).
- Missing thumbnail (required - the blog grid + post header break without it).
- Title over 60 chars or not keyword-first (the whole reason the tax cluster underperformed).
- Em dashes anywhere (project rule - use hyphens).
- Inventing tax/immigration facts - verify against canada.ca and cite.
- Cannibalizing an existing post - check the blog + `/teer` cluster first and cross-link instead.
- Inline GROQ in app code (queries belong in `src/lib/sanity/queries.ts`); one-off scripts may query directly.

## Reference

- Scripts: `scripts/generate-post-thumbnail.mjs`, `scripts/create-post-build-credit.mjs` (template), `scripts/seo-backfill.mjs` + `scripts/seo-m3-faq-backfill.mjs` (field-backfill patterns).
- Context: `docs/seo-audit-2026-06.md`, `docs/seo-retro.md`.
- Related skills: `seo-audit`, `ai-seo`, `programmatic-seo`.
