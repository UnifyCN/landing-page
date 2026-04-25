# Unify Landing Page — CLAUDE.md

Marketing + content site for **Unify Social** — a newcomer settlement app for Canada (unifysocial.ca). This is a content-heavy, interaction-light Astro site. Not a full web app.

---

## Persona

You are an incredibly talented, experienced polyglot with decades of practice in software architecture, systems design, development, UI/UX, and copywriting. Bring that lens to every change here — structure, typography, copy, and micro-interactions all matter on a landing page.

---

## Stack

- **Astro 6** — `output: 'server'` with View Transitions (`ClientRouter` in BaseLayout)
- **Tailwind CSS v4** — via `@tailwindcss/vite`. Design tokens live in `@theme` inside `src/styles/global.css`. No JS config file.
- **Cloudflare Workers** — `@astrojs/cloudflare` adapter, deployed via Wrangler. CI in `.github/workflows/deploy.yml` (push to `main`).
- **Resend** — transactional email for forms.
- **Cloudflare Turnstile** — spam protection on forms.
- **Zod** — input validation in API routes.
- **Sanity CMS** — fully wired. Project `j4gu2dbr`, dataset `production`. Studio scaffold lives in `studio/` (deployed at `unify-landing.sanity.studio`). Frontend client in `src/lib/sanity/`. Body content rendered via `@portabletext/to-html`.
- **Playwright** — dev dependency for visual QA (MCP server configured in `.mcp.json`).
- **PostHog** — analytics (MCP available, not yet instrumented in code).
- **Node >= 22.12.0** (see `package.json`).

---

## Commands

| Command                 | Purpose                                   |
| ----------------------- | ----------------------------------------- |
| `npm run dev`           | Dev server at http://localhost:4321       |
| `npm run build`         | Production build                          |
| `npm run preview`       | Preview prod build locally                |
| `npm run generate-types`| Wrangler types for Cloudflare env         |
| `npx wrangler deploy`   | Deploy to Cloudflare Workers              |
| `cd studio && npx sanity dev`    | Local Studio at http://localhost:3333    |
| `cd studio && npx sanity deploy` | Deploy Studio to unify-landing.sanity.studio |
| `npx playwright screenshot http://localhost:4321 /tmp/out.png --viewport-size="1440,900" --full-page` | Visual QA snapshot |

---

## Project Structure

```text
src/
├── pages/
│   ├── index.astro              # Homepage — imports sections in order
│   ├── about.astro
│   ├── community.astro
│   ├── contact.astro
│   ├── partners.astro
│   ├── partners/[slug].astro    # Static detail pages from src/lib/partners.ts
│   ├── resources.astro
│   ├── resources/               # Resource detail pages
│   ├── privacy.astro
│   ├── terms.astro
│   ├── api/
│   │   ├── contact.ts           # POST /api/contact
│   │   └── partner-inquiry.ts   # POST /api/partner-inquiry
│   └── blog/
│       ├── index.astro          # Blog index — fetches from Sanity, sorts by publishedAt desc
│       └── [slug].astro         # Blog detail — renders Portable Text + dual-format tables
├── layouts/
│   └── BaseLayout.astro         # html shell, fonts, Navbar/Footer, View Transitions
├── components/
│   ├── sections/                # Page sections (Hero, Problem, FAQ, CTABand, etc.)
│   ├── common/                  # Navbar, Footer
│   ├── blog/                    # PostCard, PostNav
│   └── ui/                      # shadcn-style primitives (empty for now)
├── content.config.ts            # Empty — content collections deprecated, blog moved to Sanity
├── lib/
│   ├── partners.ts              # Typed Partner[] (17 partners)
│   ├── resources.ts             # Typed resources list
│   ├── sanity/                  # createClient + urlFor + GROQ queries + typed results
│   └── utils.ts
└── styles/
    ├── global.css               # Tailwind v4 + @theme tokens + grain overlay + fonts
    └── prose.css                # Blog post typography (incl. table styles)
studio/                          # Sanity Studio v3 (deployed at unify-landing.sanity.studio)
├── sanity.config.ts             # Plugins: structureTool, visionTool, table, media
├── structure.ts                 # Custom desk structure with iframe preview pane
└── schemaTypes/
    ├── index.ts
    └── post.ts                  # Blog post schema (title, slug, body w/ table support, etc.)
scripts/
└── migrate-blog-to-sanity.mjs   # One-time migration (markdown → Sanity); kept for reference
public/
├── fonts/                       # Self-hosted Aileron (300/400/600/700)
├── assets/logo, screenshots, demos, blobs, illustrations, images/partners, images/about, images/blog
└── app-store-badge-en.svg
```

---

## UI / UX — Skill Stacking (READ THIS)

For **any** frontend or UI design work on this project, ALWAYS invoke BOTH skills together:

- `frontend-design`
- `ui-ux-pro-max`

This is non-negotiable. No UI work happens without both skills active. Stack them up front, then apply.

### Supporting Skills Worth Knowing

- `design-review` — designer's eye QA on implemented UI
- `plan-design-review` — review design plans before coding
- `web-design-guidelines` — audit against Web Interface Guidelines
- `qa` / `qa-only` / `gstack` / `browse` — headless browser QA against the dev server
- `investigate` / `systematic-debugging` — bug root-cause work
- `simplify` — post-implementation dead-code / duplication sweep
- `review` — pre-landing PR review (use before opening a PR)
- `posthog-analytics` / `posthog-instrumentation` — when wiring analytics events or dashboards
- `ship` / `land-and-deploy` — for merge + Cloudflare deploy workflows

### Design Direction (do NOT drift)

- Editorial and bold. Asymmetric composition, strong typographic hierarchy, fluid type via `clamp()`, physical micro-interactions.
- Warm and human — not cold minimal, not flashy. Nothing should feel sharp, mechanical, or corporate.
- Avoid generic AI-looking UI.
- The homepage has been deliberately redesigned beyond the Framer original — do NOT revert to Framer's layout or copy without explicit request.
- Dark mode: out of scope. Never in scope.
- Match Framer (unifysocial.ca) closely on desktop and mobile for pages that came from Framer; flag ambiguous mobile layouts, don't approximate silently.

---

## Core Rules

### Astro

- Default to server-rendered HTML. Avoid unnecessary client JS.
- Use islands ONLY when interactivity is needed (FAQ accordion, form handler, mobile menu, product overview tabs).
- View Transitions are wired globally — preserve them. Navbar uses `transition:persist`; body bg swap is handled via `astro:before-swap` in BaseLayout.

### Tailwind v4

- All tokens live in `@theme` inside `src/styles/global.css`. Never introduce a `tailwind.config.js`.
- Never use arbitrary values (`mt-[96px]`, `text-[13.5px]`). If a value is missing from the scale, add it to `@theme` first.
- Use `@layer` only for custom component/utility classes. Don't redeclare tokens there.
- One global stylesheet imported via `BaseLayout`. Don't add per-component `@import "tailwindcss"`.

### CMS — Sanity (live)

- **Blog is fully on Sanity.** Project `j4gu2dbr`, dataset `production`. Editors author posts at `unify-landing.sanity.studio`.
- **Studio code** lives in `studio/` inside this repo. Redeploy with `cd studio && npx sanity deploy`.
- **Frontend** uses `@sanity/client` (read-only, `useCdn: true`) + `@sanity/image-url` + `@portabletext/to-html`.
- **All GROQ queries** belong in `src/lib/sanity/queries.ts` — never inline them in pages/components.
- **All query result types** in `src/lib/sanity/types.ts`. No `any` in shared code.
- **Sorting**: posts sort by `publishedAt desc` so the newest published post is always the featured slot. The `order` field is unused (kept in schema for backwards compat with migrated docs).
- **Body field** allows `block`, `image`, and `table` types. Tables use `@sanity/table` plugin (cells = plain strings, first row = header).
- **Migrated tables** (from the original markdown) use `@portabletext/markdown` shape (cells with nested Portable Text + `headerRows` count). The renderer in `src/pages/blog/[slug].astro` detects format via `typeof rows[0].cells[0] === 'string'` and handles both.
- **Studio plugins installed**: `@sanity/table` (table editor), `sanity-plugin-media` (media library), `sanity-plugin-iframe-pane` (live preview pane). Live preview shows the **published** version — drafts won't render until published. Full draft preview = future task.
- **Empty-state safety**: `src/pages/blog/index.astro` guards against 0 / 1 posts (empty message + conditional grid).
- **MCP for Sanity work**: use `list_sanity_rules`, then `astro` + `groq` rules, then `get_schema`. Don't guess GROQ.

### Forms / API

- Two endpoints only: `POST /api/contact`, `POST /api/partner-inquiry`.
- Flow: Zod validate → Turnstile siteverify → Resend send.
- Graceful degradation: if `TURNSTILE_SECRET_KEY` or `RESEND_API_KEY` are absent, the endpoint skips that step and returns success. Safe for local dev without keys.
- Do NOT introduce auth, a database, or new API routes unless explicitly requested.
- `from` address must be `contact@noreply.unifysocial.ca` — the verified subdomain in Resend. `@unifysocial.ca` root is NOT verified and will 403.
- Turnstile tokens are one-time use. After any non-success response, client JS must call `window.turnstile.reset()`. Both `ContactForm.astro` and `BecomePartner.astro` already do this.

### SEO

- Every page: proper `<title>`, meta description, semantic HTML (`<section>`, `<article>`, `<nav>`), correct heading hierarchy (one `<h1>`), clean URLs.
- Optimize for newcomer / immigrant / settlement keywords. Do NOT keyword-stuff or harm readability.

### Cloudflare Workers gotchas

- Use Web standards (`fetch`, `crypto.subtle`) — avoid Node-only APIs.
- Secrets via Wrangler (`wrangler secret put`) or `.dev.vars` locally. Access via `env` from `cloudflare:workers` (see `src/pages/api/contact.ts`).
- Watch bundle size. Prerender static routes with `export const prerender = true` where SSR isn't needed.

---

## Task Planning

Before coding:

1. Understand the architecture, identify files to touch, and propose a plan.
2. Get the plan approved before writing a single line of code.
3. State assumptions explicitly. Surface ambiguity — don't resolve silently.
4. If the task is large or vague, push back — break it down into smaller subtasks.

For multi-step work, state plan + verification per step:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
```

## Implementation

- No placeholder implementations. Build the thing.
- When using any external library you're not 100% sure about, web-search the latest syntax first (Astro 6, Tailwind v4, Sanity, Wrangler all move fast).
- Commit early and often. Break large tasks into logical milestones; commit after each is confirmed.
- Keep diffs focused. Avoid unrelated refactors.
- Build one section at a time. Verify with `npm run build` before moving on.

## Problem Solving

- Figure out the root cause instead of throwing random things at the wall.
- When stuck, use the `investigate` or `systematic-debugging` skill.

## Push Back

Say no if you see:

- Unnecessary complexity / over-engineering
- Unclear requirements
- CMS misuse or inline GROQ
- Breaking visual fidelity
- Bad SEO practices
- Silent mobile layout decisions

---

## Do NOT Implement

- React components or animation libraries (Framer Motion, motion/react, embla, carousel)
- `next/*` anything
- Dark mode
- Arbitrary Tailwind values — add tokens to `@theme`
- Inline GROQ queries in components/pages
- Dummy/placeholder logic

---

## Design System (extracted from Framer + extended for editorial redesign)

### Colors

- Brand/CTA: `#D84A29` → `var(--color-brand-red)` / `var(--color-brand)`
- Text/Ink: `#181818` → `var(--color-text)`
- Ink dark: `#171616` → `var(--color-ink)` (dark section backgrounds)
- Cream: `#ffffff` → `var(--color-cream)` (token kept for compatibility, value is now white — was previously `#FFFCF3`)
- Muted: `#575757` → `var(--color-muted)`
- White: `#FFFFFF`

### Fonts

- **Aileron** — self-hosted woff2 in `public/fonts/`. Light (300), Regular (400), SemiBold (600), Bold (700). Body + display.
- **Figtree** — Google Fonts. CTA buttons and UI elements only.

### Breakpoints

- Mobile: ≤809px — hamburger nav
- Tablet: 810–1399px — hamburger nav
- Desktop: ≥1400px — full inline nav
- Container max-width: 1600px

### Type scale (sections use fluid `clamp()` — do not override with fixed px)

- H1: 80px / 80px
- H2: 60px / 68px
- H3: 44px / 52px
- H4: 32px / 40px
- H5: 24px / 32px
- Body: 24 / 20 / 16 / 14px

### Tokens in `@theme`

- Tracking: `--tracking-display: -0.05em`, `--tracking-tight: -0.04em`, `--tracking-label: 0.08em`
- Easing: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` (enter/reveal), `--ease-in-out`, `--ease-drawer`
- Nav: `--spacing-navbar: 67px`
- Radii: `--radius-btn: 6px`, `--radius-pill: 18px`, `--radius-cta: 12px`

### Global grain

`body::after` with SVG `fractalNoise` at opacity 0.028 — physical texture layer. Do not remove.

### Scroll animation pattern (use for all new sections)

Progressive enhancement — never set `opacity: 0` globally without a JS-gated class:

```css
.my-element { transition: opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out); }
.my-section.animate .my-element { opacity: 0; transform: translateY(24px); }
.my-section.animate.visible .my-element { opacity: 1; transform: translateY(0); }
```

```js
section.classList.add('animate');
// observer fires → section.classList.add('visible');
```

Do NOT use `animation-fill-mode: both` with a delay on scroll-triggered elements — it causes `opacity: 0` to persist before the animation starts, breaking static renders and slow-JS contexts.

---

## Navbar — Critical Design Notes

The navbar pill must feel light and unobtrusive. The user's eye should go TO the content inside the pill (logo, links, CTA) — not to the pill container itself.

- Border: 1px solid `rgba(0,0,0,0.08)` — very subtle, never dark
- Box shadow: `0 10px 28px -14px rgba(23,22,22,0.18)` — soft and low
- On scroll (`.is-scrolled`): shadow deepens slightly, never becomes prominent
- Background: solid `#ffffff` — no frosted glass, no blur
- Logo height: `h-7` (28px), generous left padding inside the pill
- Logo is a plain `<div>`, NOT a link. Clicking does nothing. Asset: `/assets/logo/logo-with-name.png`
- Logo and "Download Unify" CTA must NOT feel cramped — if anything feels tight, increase padding first
- CTA: `bg #171616`, `hover #D84A29`, transition `0.2s`, label "Download Unify" + `→`, links to App Store in a new tab
- Nav links (order): Home | About | Community | Partners | Blog | Contact
- Mobile: hamburger at ≤1399px, full overlay with stacked links + CTA

---

## Footer

- White background. Bold heading with 3px `var(--color-brand)` left border: "Unify," / "Your journey to Canada, simplified."
- Two-column body: left = brand description, right = Pages + Socials
- Bottom bar: `© 2026 – Unify Social` (plain text, NOT a link)
- No logo in footer

Socials:
- Instagram: https://www.instagram.com/unifysocial.ca/
- Facebook: https://www.facebook.com/p/Unify-Social-61570879043328/
- LinkedIn: https://www.linkedin.com/company/unify-social/posts/?feedView=all
- Twitter/X: https://x.com/unifysocialca

Legal (open new tab):
- Privacy: https://www.notion.so/Unify-s-Privacy-Policy-2e15af89dddb80b0b37ee497e6d4e38c?source=copy_link
- Terms: https://www.notion.so/Unify-s-End-User-License-Agreement-Terms-of-Service-3185af89dddb80a68410fa8d65d615c7?source=copy_link

---

## Section Notes (homepage) — load-bearing, do not revert

### Hero

- Two-column grid at tablet+: `1fr 480px`, gap `1rem`, padding `0 5rem` desktop
- `align-items: flex-start` — text and phone both pin to top
- Decorative `blob-3.svg` top-right, opacity 0.28
- Phone: `/assets/screenshots/learn-hero.avif`, `max-height: 680px` desktop, `loading="eager"`
- Overline: "Newcomer settlement app" (brand-red, uppercase, `tracking-label`)
- H1: "The all-in-one" (light, muted) / "newcomer" (bold display, `clamp(3.5rem, 10.5vw, 9rem)`) / "settlement app" (bold, italic brand-red "app")
- Staggered `hero-fade-up` CSS animations with delays 0.1s–0.52s, `animation-fill-mode: forwards`
- Phone: `hero-phone-in` (translate X/Y → 0), 0.8s delay 0.2s
- App Store badge → https://apps.apple.com/ca/app/unify-newcomer-support/id6754875762 (new tab, height 52px)

### Problem

- Background: `#171616`. Large italic white text: "You just arrived. There's too much information, too many opinions, and no clear first step." / "That's the gap Unify fills." (brand-red, smaller)
- Pure typography, no images
- Uses CSS transitions (NOT keyframes) for scroll reveal — JS adds `.animate` immediately, then `.visible` when observed. Default (no JS): text visible.

### Partners

- "Our Partners" label. CSS scroll animation only — no JS, no libs.
- Mask-gradient fade edges. Logo pause-on-hover, grayscale-to-color.

### Journey

- Vertical timeline, 4 stages with stage labels in brand-red pills. Spine: `linear-gradient(transparent → brand-red → transparent)`.
- Images: `loading="eager"` (lazy breaks above-fold screenshots)
- Progressive enhancement animation (body `.js-ready` → hidden, observer → `.visible` → transition reveal)
- Stages: Day 1 (`checklist.png`), Week 1 (`companion.png`), Month 1 (`learn.png`), Month 3 (`community.png`)

### ProductOverview

- Split editorial layout: left = feature list, right = video stage
- NO white card around video — phone floats on white bg
- `filter: drop-shadow()` on `.po-video` only — traces phone bezel
- All panels share `grid-column: 1; grid-row: 1` — no height reflow on tab switch
- Desktop stage: `transform: translateY(-1.5rem)`
- Source `.mp4` files have baked-in light padding around the phone — do NOT crop/scale aggressively
- Stage max-widths: mobile 365px, tablet 415px, desktop 480px
- Features: Checklist | AI Companion | Learn | Community

### FAQ

- Native `<details>/<summary>` with JS-driven `max-height` animation (CSS alone can't transition native details)
- Background: `var(--color-cream)` (white). SVG chevron rotates 180° on open.
- Summary + answer: `padding: 1rem` left/right so text breathes away from hover border
- Questions (exact copy):
  1. What is Unify Social?
  2. Who is Unify Social best for?
  3. How do I connect with other immigrants on Unify Social?
  4. What workshops does Unify Social offer, and how can I join one?
  5. Is Unify Social free to use?

### CTABand

- Background: `var(--color-ink)` (dark, NOT white)
- Two-column flex at tablet+. Headline: "Stop guessing." / "Start settling." (white, italic brand-red "Start settling.")
- Eyebrow: "Ready to get started?" (brand-red, uppercase)
- Button: "Download the App Now" → App Store URL, brand-red bg with red-glow on hover
- Decorative `blob-8.svg` bottom-right, low opacity
- Scroll fade-up via IntersectionObserver + `.js-ready` progressive enhancement

---

## MCP / External Tooling

- **Playwright MCP** (`.mcp.json`) — headless visual QA. Restart Claude Code after changes to `.mcp.json`.
- **Sanity MCP** — use `list_sanity_rules`, `get_schema`, `search_docs` before writing any Sanity code. `astro` rule + `groq` rule are the ones to load here.
- **PostHog MCP** — scoped to "Default project" in org "Unify Social" (id `019a94a4-9861-0000-3b1e-bd4e8d515177`). Project timezone: America/Vancouver. Person-on-events mode is on.

---

## Environment Variables

Form endpoints gracefully skip steps when keys are absent — local dev works without any of these.

`.dev.vars` (never commit):

```
RESEND_API_KEY=re_...
TURNSTILE_SECRET_KEY=...
CONTACT_TO_EMAIL=contact@unifysocial.ca
```

For production: `wrangler secret put <NAME>` or Cloudflare dashboard.

Current site keys in forms still use placeholder (`0x4AAAAAAA_PLACEHOLDER_KEY`) in `ContactForm.astro` and `BecomePartner.astro` — replace at deploy time.

**Pre-launch checklist:**
1. Replace Turnstile placeholder site key in `ContactForm.astro` and `BecomePartner.astro`.
2. Add DMARC DNS record to `unifysocial.ca` — **Savar's job** (he manages the DNS):
   - Type: `TXT` | Name: `_dmarc` | Value: `v=DMARC1; p=none; rua=mailto:contact@unifysocial.ca`
   - Without this, Google silently drops emails from `noreply.unifysocial.ca`.
3. Optional: verify `unifysocial.ca` root domain in Resend to send `from: @unifysocial.ca` instead of `@noreply.unifysocial.ca`.

---

## Section Notes — other pages

### Contact (`src/pages/contact.astro`)
- `bodyBg="#171616"`. Sections: ContactHero → ContactForm → CTABand.
- Form posts to `/api/contact`. Success state hides form and shows `.cf-success`.

### Partners (`src/pages/partners.astro`)
- `bodyBg="#171616"`. Sections: PartnersHero → PartnerTestimonials → PartnersGrid → BecomePartner → CTABand.
- Static detail pages at `/partners/[slug].astro` generated from `src/lib/partners.ts` (typed `Partner` interface, 17 partners).
- BecomePartner form posts to `/api/partner-inquiry`.

### Community (`src/pages/community.astro`)
- `bodyBg="#171616"`. Sections: CommunityHero → CommunityStats → CommunityGallery → CommunityEventCTA → CTABand.

### About (`src/pages/about.astro`)
- `bodyBg="#171616"`. Sections: AboutHero → AboutFounders → AboutProblem → AboutValues → CTABand.
- Image assets: `/assets/images/about/founders-portrait.jpg` (AboutHero), `/assets/images/about/founders-photo-2.jpg` (AboutFounders).

---

## Key Principle

Content-heavy, interaction-light. Preserve low JS, fast load, strong SEO. Don't code against Astro's strengths.
