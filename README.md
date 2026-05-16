# Unify Landing Page

Marketing + content website for **[Unify Social](https://unifysocial.ca)** — a newcomer settlement app for Canada.

A content-heavy, interaction-light site built with **Astro 6**, **Tailwind CSS v4**, and **Sanity CMS**, deployed on **Cloudflare Workers**. Not a full web app.

> For agent/contributor conventions, design system details, and section-level rules, see [`CLAUDE.md`](./CLAUDE.md).

---

## Stack

- [Astro 6](https://astro.build) — `output: 'server'` with View Transitions. Static pages `export const prerender = true` and bake to the Cloudflare CDN edge; only `/blog/*` (live Sanity fetch) and `/api/*` stay server-rendered.
- [Tailwind CSS v4](https://tailwindcss.com) — tokens in `@theme` inside `src/styles/global.css`, no JS config file.
- [Sanity CMS](https://www.sanity.io) — blog content (project `j4gu2dbr`, dataset `production`).
- [Cloudflare Workers](https://workers.cloudflare.com) — deployment target, via the `@astrojs/cloudflare` adapter.
- [Resend](https://resend.com) — transactional email for forms.
- [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) — form spam protection.
- [Zod](https://zod.dev) — runtime validation in API routes.
- [`@astrojs/sitemap`](https://docs.astro.build/en/guides/integrations-guide/sitemap/) — auto-generated sitemap.
- [Playwright](https://playwright.dev) — dev-only visual QA.

---

## Prerequisites

- **Node.js** ≥ 22.12.0 — [nodejs.org](https://nodejs.org)
- **npm** (bundled with Node)

---

## Setup

```bash
git clone https://github.com/UnifyCN/landing-page.git
cd landing-page

npm install
npm run dev
```

The site runs at `http://localhost:4321`.

### Sanity Studio

The blog CMS Studio lives in `studio/` and is a separate package:

```bash
cd studio
npm install
npx sanity dev        # local Studio at http://localhost:3333
```

---

## Commands

| Command                          | Description                                      |
| -------------------------------- | ------------------------------------------------ |
| `npm run dev`                    | Start local dev server (port 4321)               |
| `npm run build`                  | Build for production                             |
| `npm run preview`                | Preview the production build locally             |
| `npm run generate-types`         | Generate Cloudflare env types via Wrangler       |
| `npx wrangler deploy`            | Deploy the built output to Cloudflare Workers    |
| `cd studio && npx sanity dev`    | Run the Sanity Studio locally (port 3333)        |
| `cd studio && npx sanity deploy` | Deploy the Studio to `unify-landing.sanity.studio` |

---

## Environment Variables

The contact and partner-inquiry forms use Resend for email and Cloudflare Turnstile for spam protection. All keys are **optional for local dev** — the forms gracefully skip verification/sending and still show a success state when keys are absent.

Create a `.dev.vars` file at the project root (gitignored):

```
RESEND_API_KEY=re_...
TURNSTILE_SECRET_KEY=...
CONTACT_TO_EMAIL=contact@unifysocial.ca
```

`CONTACT_TO_EMAIL` is optional — it falls back to `contact@unifysocial.ca` when unset.

For production, add these as Cloudflare Workers secrets via the dashboard or:

```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put TURNSTILE_SECRET_KEY
```

The Turnstile **site key** (public) is already committed in `ContactForm.astro` and `BecomePartner.astro`; only the **secret key** above needs configuring.

---

## Deployment

Pushes to `main` auto-deploy via GitHub Actions (`.github/workflows/deploy.yml`). The workflow runs `npm ci`, `npm run build`, and `npx wrangler deploy` using the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repo secrets.

Manual deploy:

```bash
npm run build
npx wrangler login          # first time only
npx wrangler deploy
```

The Sanity Studio deploys separately:

```bash
cd studio && npx sanity deploy
```

---

## Project Structure

```
src/
├── pages/            # Routes — index, about, community, contact, partners, resources
│   ├── api/          # POST /api/contact, POST /api/partner-inquiry
│   └── blog/         # Blog index + [slug] — SSR, renders Portable Text from Sanity
├── layouts/          # BaseLayout (fonts, Navbar/Footer, View Transitions, SEO meta)
├── components/
│   ├── sections/     # Page sections (Hero, FAQ, CTABand, forms, etc.)
│   ├── common/       # Navbar, Footer
│   └── blog/         # PostCard, PostNav
├── content.config.ts # Empty — content collections deprecated, blog moved to Sanity
├── lib/
│   ├── partners.ts   # Typed partners data
│   ├── resources.ts  # Typed resources data
│   ├── sanity/       # Sanity client + GROQ queries + typed results (live)
│   └── seo/          # JSON-LD schema helpers
└── styles/           # global.css (Tailwind v4 + @theme tokens), prose.css
studio/               # Sanity Studio v3 (deployed at unify-landing.sanity.studio)
scripts/              # One-off content migration + asset generation scripts
public/               # Fonts, images, assets, robots.txt, sitemap, OG card
```

---

## Content (Sanity CMS)

The blog runs entirely on Sanity (project `j4gu2dbr`, dataset `production`). Editors author posts at [`unify-landing.sanity.studio`](https://unify-landing.sanity.studio); the Studio source lives in `studio/` in this repo.

The frontend fetches posts at request time via `@sanity/client` (read-only, CDN-cached) and renders the body as Portable Text with `@portabletext/to-html`. All GROQ queries belong in `src/lib/sanity/queries.ts` and result types in `src/lib/sanity/types.ts` — never inline queries in pages or components.

The blog post schema is defined in `studio/schemaTypes/post.ts`. Redeploy the Studio after schema changes with `cd studio && npx sanity deploy`.

---

## SEO Infrastructure (May 2026)

A dedicated SEO sprint added a full discoverability layer:

- **Sitemap** — `@astrojs/sitemap` auto-generates `/sitemap-index.xml` from prerendered routes.
- **`robots.txt`** and **edge redirects** (`public/_redirects`) — `/privacy` + `/terms` 301 to canonical Notion pages.
- **Meta tags** — canonical, OpenGraph, and Twitter Card tags emitted site-wide via `BaseLayout`, plus a 1200×630 OG card.
- **JSON-LD structured data** — helper library in `src/lib/seo/` (Organization, MobileApplication, FAQPage, BlogPosting, BreadcrumbList, LocalBusiness), composed per page.

See the **"SEO Sprint v2 — Retro"** section of [`CLAUDE.md`](./CLAUDE.md) for the full breakdown, schema map, and footguns to avoid.

---

## Agent Tooling (Claude Code)

- MCP config at `.mcp.json` — Playwright MCP is available after restart.
- This repo also uses Sanity MCP (live CMS — query schema/docs before writing GROQ) and PostHog MCP (analytics).
- See `CLAUDE.md` for agent conventions, UI/UX skill stacking (`frontend-design` + `ui-ux-pro-max`), and section-level design rules.
