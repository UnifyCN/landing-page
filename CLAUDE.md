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
- **Responsive at every width — non-negotiable.** Every page, section, and component must look and work correctly across mobile (≤809px), tablet (810–1399px), desktop (≥1400px), AND every in-between width. No layout breaks, awkward wraps, overflow, cropped content, or unreadable type at *any* viewport in the 320px–1920px range. Test by resizing the browser continuously, not just at the three named breakpoints. Prefer fluid type (`clamp()`), fluid spacing, and intrinsic layouts (`auto-fit` / `minmax` / `flex-wrap`) over fixed pixel jumps. When you ship a UI change, the verification step must include a continuous resize check, not just three discrete screenshots.

---

## Core Rules

### Astro

- Default to server-rendered HTML. Avoid unnecessary client JS.
- Use islands ONLY when interactivity is needed (FAQ accordion, form handler, mobile menu, product overview tabs).
- View Transitions are wired globally — preserve them. Navbar uses `transition:persist`; body bg swap is handled via `astro:before-swap` in BaseLayout.
- **All static pages must `export const prerender = true`** so they bake to HTML at build time and are served from the Cloudflare CDN edge. The repo had every page hitting the worker on every request before this — TTFB on every navigation. Currently prerendered: `/`, `/about`, `/community`, `/contact`, `/partners` (+ all `/partners/[slug]` via `getStaticPaths`), `/resources` (+ all `/resources/[slug]`). SSR retained for `/blog/*` (live Sanity fetch) and `/api/*`. There are no local `/privacy` or `/terms` routes — the Footer links those to external Notion pages, see the Footer section below.
- **Anything that binds to the DOM at load time must wrap in `astro:page-load`**, not run at module top-level. With ClientRouter, module scripts only execute once on initial load — on subsequent View Transition navigations the new DOM exists but the old handler/observer is still attached to the detached previous DOM, leaving the feature dead. Pattern: wrap the setup in a function, register with `document.addEventListener("astro:page-load", initFn)`, and add a data-attribute guard on the root element (e.g. `el.dataset.fooBound === 'true'`) so it doesn't double-bind on the initial load (where both the inline script body and the page-load event fire). This trap has bit, in order: scroll-reveal observers (CTABand), the FAQ accordion click handler (`FAQ.astro`), and **Turnstile widget rendering on both forms** — Turnstile's `api.js` auto-renders `.cf-turnstile` divs only on initial DOM-ready, so `ContactForm.astro` and `BecomePartner.astro` explicitly call `window.turnstile.render()` from inside their `astro:page-load` init function whenever the widget div has no rendered `<iframe>` child yet.

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
- Turnstile widget config (site key `0x4AAAAAADBIS8MIXH2FQDoH`) is shared by both forms. Allowed hostnames live in CF dashboard → Turnstile → "Unify Landing Page" widget: currently `unifysocial.ca` and `unify-landing-page.wild-recipe-8e20.workers.dev`. If www starts showing "Unable to connect to website", add `www.unifysocial.ca` there.

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

The navbar pill is a **liquid-glass** element — translucent white pill with real backdrop-blur, gradient sheen, gloss highlight, and layered shadows. The user's eye should still go TO the content inside the pill (logo, links, CTA) — the pill itself is depth, not focus.

- Background: `linear-gradient(180deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5))` — translucent so blur reads through
- **Backdrop blur: `blur(14px) saturate(160%)`** — DO NOT raise to 22/180. Was originally `blur(22px) saturate(180%)` and that made the entire site lag on macOS/HiDPI because the GPU re-blurred the underlying viewport every scroll frame at 2× pixel density. Cost scales roughly with blur radius squared. After the AVIF image conversion (commit `ad885e5`) reduced competing main-thread work, we bumped from 8/140 → 14/160 — closer to the original feel, still ~50% cheaper than 22/180. If lag returns on lower-end Macs, drop back to 8/140.
- Border: `1px solid rgba(255,255,255,0.55)` — light edge, lifts the pill off the page
- Inset highlights: `inset 0 1px 0 0 rgba(255,255,255,0.8)` (top), `inset 0 -1px 0 0 rgba(255,255,255,0.2)` (bottom) — simulates light refraction through the glass
- Box shadow: layered `0 8px 24px -8px rgba(23,22,22,0.14), 0 2px 6px -2px rgba(23,22,22,0.08)` — soft elevation
- Top-gloss highlight via `::before` with `mix-blend-mode: overlay` and a 35%→0% white gradient — the "wet" look
- On scroll (`.is-scrolled`): background opacity bumps to 0.85→0.65 and shadows deepen slightly. Never becomes opaque.
- Logo height: `h-10` (40px), generous left padding inside the pill
- Logo is a plain `<div>`, NOT a link. Clicking does nothing. Asset: `/assets/logo/new-unify-logo-256.png` (the new starburst, regenerated from the trimmed master — see the Favicon set section for the regeneration workflow). The old `logo-with-name.{png,avif}` files in the same folder are vestigial.
- Logo and "Download Unify" CTA must NOT feel cramped — if anything feels tight, increase padding first
- CTA: `bg #171616`, `hover #D84A29`, transition `0.2s`, label "Download Unify" + `→`, links to App Store in a new tab
- Nav links (order): Home | About | Community | Partners | Blog | Resources | Contact
- Mobile: hamburger at ≤1399px, full overlay with stacked links + CTA

---

## Footer

White background, top + bottom hairline borders. Three-column grid at tablet+ (`2fr 1fr 1fr`).

- **Brand column:** `/assets/logo/new-unify-logo-256.png` (the new starburst, same asset the navbar uses) at `h-14`, links to `/`. Tagline: "An all-in-one mobile companion for newcomers in Canada. Built in Vancouver, with newcomers, for newcomers." Below: row of 38px round social pills with hairline border that fill brand-red on hover.
- **Navigate column:** Home | About | Community | Blog | Contact (5 links — still narrower than the 7-link navbar; Community added on Day 3 of the SEO sprint to give the orphaned `/community` page an inbound link from every page on the site).
- **Legal column:** Privacy Policy and Terms of Service redirect to **Notion-hosted canonical pages** (URLs hardcoded in `src/components/common/Footer.astro` `legal[]`). They open in a new tab via `target="_blank" rel="noopener noreferrer"`. Don't re-add local `/privacy` or `/terms` routes — Notion is the single source of truth so legal copy doesn't drift across surfaces.
- **Bottom bar:** `© 2026 Unify Social` — plain text, no dash, NOT a link.

Socials:
- Instagram: https://www.instagram.com/unifysocial.ca/
- Facebook: https://www.facebook.com/p/Unify-Social-61570879043328/
- LinkedIn: https://www.linkedin.com/company/unify-social/posts/?feedView=all
- Twitter/X: https://x.com/unifysocialca

---

## Section Notes (homepage) — load-bearing, do not revert

Homepage section flow today: `Hero → Partners → Journey → FAQ`. No `Problem`, no `ProductOverview`, no `CTABand` on the homepage.

`src/components/sections/Problem.astro` and `ProductOverview.astro` still exist on disk but are **intentionally retired** — not imported by any page. Safe to delete in a cleanup pass; do NOT pull them back into the homepage. The dead vertical-timeline CSS still living inside `Journey.astro` is in the same bucket.

### Hero

- White section bg. Two-column at tablet+ (`1fr 1fr`); desktop becomes `1fr 480px` with `gap: 1rem` and `padding: 0 5rem`.
- **Rating pill** above the H1: white pill with hairline border, 5 amber stars (`#F5A623`), copy "Rated **4.9** by **2,700+** newcomers".
- **H1:** single plain string "The all-in-one newcomer settlement app". Weight 700, `clamp(2.5rem, 7.5vw, 5.5rem)`, `line-height: 1.02`, `letter-spacing: var(--tracking-display)`, `text-wrap: balance`. No styled spans, no italic brand-red word. (The legacy three-line styled headline is gone — do not re-introduce it.)
- **Sub:** "Unify makes settling in Canada simpler, clearer, and more connected." (`color-muted`, `max-width: 44ch`).
- **CTA row:** App Store badge `/assets/app-store-badge-en.svg` (height 52px, opens new tab) + "No credit card required" note.
- **Social proof row:** five overlapping circular avatars with initials (JP, MA, LO, RN, +) on solid color discs, followed by "Join 2,700+ newcomers settling in from 84 countries". 32px on mobile, 36px tablet+.
- **Phone:** `/assets/screenshots/learn-hero.avif`, `loading="eager"`. `max-height` 360px mobile / 540px tablet / 680px desktop (with `max-width: 380px` desktop).
- **Animations:** scripted CSS keyframes with staggered delays — rating 0.1s, h1 0.22s, sub 0.36s, CTA 0.46s, social 0.56s; phone 0.2s via `hero-phone-in`.
- App Store badge → https://apps.apple.com/ca/app/unify-newcomer-support/id6754875762 (new tab).
- **No glow gradient behind the phone.** Removed entirely — even static, the radial gradient sat under the navbar's `backdrop-filter` sample zone, forcing the GPU to re-blur a complex 4-stop semi-transparent gradient on every scroll frame in the hero region. Cause of the "scrolling around the hero is laggy → smooth once past" report. Drop-shadow alone (`0 18px 28px rgba(23,22,22,0.2)`, radius reduced from 48 → 28) is the focal effect now. Do NOT re-add a glow under the navbar's blur zone.

### Partners

- White bg. Centered "Our Partners" label, then a CSS-only horizontal marquee.
- 17 partner logos doubled in markup so the loop seams. `animation: marquee 40s linear infinite` translating `0 → -50%`.
- Mask-gradient fade edges (transparent → black 10% → black 90% → transparent). Track pauses on `:hover`. Logos: 56/64/72px (mobile/tablet/desktop), `opacity: 0.85` default, lifts to 1 + `translateY(-2px)` on hover. `prefers-reduced-motion: reduce` stops the animation.

### Journey — "Key Benefits"

- White bg. Centered eyebrow pill "Core Features" + H2 "Key Benefits" (centered, `font-size: 2.25rem` mobile / 3.25rem desktop).
- Three feature blocks (default text-left / visual-right; `feature-block--reverse` swaps for the middle one):
  1. **Checklist** — warm cream card (`#f5eeda`) with cream/peach decorative blobs, dark dot in pill, "Your Canadian checklist, personalised to you." H3, three bulleted benefits with dark-circle check icons, "See a sample checklist →" link. Image: `/assets/screenshots/checklist.avif`.
  2. **AI Companion** (reversed) — blue-grey card (`#e9ecf6`) at `aspect-ratio: 447 / 558`, `padding: 0`, no decorative blobs (image is self-contained composition). Blue accents (`#5a6fbf`). Image: `/assets/phone-ai.avif`, `object-fit: cover`.
  3. **Community** — warm peach card (`#f5e6d2`) with peach decorative blobs, brand-red pill + dot + link. Image: `/assets/screenshots/community.avif`.
- Reveal pattern: `body.js-ready .feature-block { opacity:0; translateY(32px) }` → `.visible` flips on at threshold 0.12. Observer wired through `astro:page-load`.

### FAQ

- White bg. Centered "FAQ" eyebrow pill + "Frequently Asked Questions" headline.
- Card: white, `border: 1px solid rgba(23,22,22,0.10)`, `border-radius: 18px`. Open state deepens border + adds soft shadow.
- Toggle: dark square (`bg-text`, `border-radius: 10px`) with a `+` icon. Rotates **45° to an X** and switches to brand-red when open. (Not a chevron.)
- Native `<details>/<summary>` with `e.preventDefault()` and JS-driven `max-height` between `0` and `scrollHeight`; sets `max-height: none` after the open transition so dynamic content reflows.
- Answer rendered via `set:html`. Custom prose: 0.9375rem body, 1.7 line-height, brand-red `–` bullet markers.
- Questions (exact copy — no "Social" suffix):
  1. What is Unify?
  2. Who is Unify best for?
  3. How do I connect with other newcomers on Unify?
  4. What workshops does Unify offer, and how can I join one?
  5. Is Unify free to use?

### CTABand (used on About / Community / Contact / Partners — NOT on the homepage)

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

For production: `wrangler secret put <NAME>` or Cloudflare dashboard. As of 2026-05-13, `RESEND_API_KEY` and `TURNSTILE_SECRET_KEY` are set on the production worker; `CONTACT_TO_EMAIL` is unset and falls back to the `contact@unifysocial.ca` default in `src/pages/api/contact.ts:63`.

---

## Infrastructure (live state as of 2026-05-13)

- **Domain**: `unifysocial.ca` + `www.unifysocial.ca`, both proxied to the worker.
- **Registrar**: CanSpace (where the domain is paid for / WHOIS lives). Domain renews yearly — keep auto-renew on. Registrar Lock should stay ON except during nameserver changes.
- **DNS host**: Cloudflare (zone `unifysocial.ca`, ID `31461b6bd38fc1ea002477339c8df953`). Assigned nameservers: `graham.ns.cloudflare.com`, `ulla.ns.cloudflare.com`. These must remain set at CanSpace; if anyone reverts to `dns1/dns2.canspace.ca` the site goes back to Framer-style nothingness.
- **Hosting**: Cloudflare Worker `unify-landing-page` (account ID `22bb47be0cdff02d2c32a4a203e10f20`). Bound to apex + www via Custom Domains on the worker. Workers.dev URL `https://unify-landing-page.wild-recipe-8e20.workers.dev` still resolves to the same deploy — useful for testing isolated from DNS.
- **Email DNS** (all in the Cloudflare zone, all DNS-only / grey cloud — proxying breaks email auth):
  - `unifysocial.ca` MX → `SMTP.GOOGLE.COM` priority 1 — receives mail at `@unifysocial.ca` via Google Workspace. Critical, do not delete.
  - `resend._domainkey.noreply` TXT — Resend DKIM.
  - `send.noreply` MX → `feedback-smtp.us-east-1.amazonses.com` priority 10 — Resend bounce handler.
  - `send.noreply` TXT — Resend SPF (`v=spf1 include:amazonses.com ~all`).
  - `_dmarc` TXT — `v=DMARC1; p=none; rua=mailto:contact@unifysocial.ca`.
  - Verified end-to-end 2026-05-13: SPF / DKIM / DMARC all PASS on Resend → Gmail.
- **Google Search Console**: domain property verified via TXT (`google-site-verification=...` on the apex). Use this property to request indexing after any SEO or favicon change — Google's cache TTL for favicons/snippets is days-to-weeks otherwise.
- **Sanity Studio**: separate hosted UI at `unify-landing.sanity.studio` (project `j4gu2dbr`, dataset `production`). Editors author blog posts there; the frontend fetches at request time on `/blog/*` SSR routes.

If the site ever goes down: first check (1) CF zone status is "Active", (2) the two CF nameservers are still at CanSpace, (3) the worker has both Custom Domains bound (`unifysocial.ca` + `www.unifysocial.ca`), (4) `wrangler tail` is clean.

---

## Favicon set

All favicons are regenerated from one master: `public/assets/logo/new-unify-logo.png` (1024×1024 starburst, transparent background, content-trimmed via `public/assets/logo/new-unify-logo-tight.png` — petals fill ~90% of the canvas so they show up larger inside Google's circle crop).

Outputs in `public/`:
- `favicon-32.png` — browser tab.
- `favicon-96.png` — desktop hi-DPI.
- `favicon-192.png` — Google search card (multiple of 48 per Google's docs).
- `apple-touch-icon.png` — 180×180, iOS home-screen.
- `favicon.ico` — multi-resolution (16/32/48/256) ICO built with `npx png-to-ico`.
- `site.webmanifest` — references the PNG set + `theme_color: #D84A29`.

`<link rel="icon">` tags + `<link rel="manifest">` + `<meta name="theme-color">` all declared in `src/layouts/BaseLayout.astro:21-28`. Do NOT add a `favicon.svg` back — Google's favicon cache prefers the ICO/PNG set and an extra SVG only adds noise.

**To swap the logo**: replace `new-unify-logo.png`, re-trim with the Sharp script from the favicon commit (`712a5f8`), then regenerate every size with `sips -Z <n>` and the ICO with `png-to-ico`. After deploy, request indexing in Google Search Console — otherwise the search-result favicon stays stale for days.

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

### Resources (`src/pages/resources.astro` + `src/pages/resources/[slug].astro`)
- All resources are typed objects in `src/lib/resources.ts` (6 entries today). Each carries a `youtubeId` — the **11-character video ID only**, never a full URL.
- `resources.astro` derives card thumbnails (`img.youtube.com/vi/{id}/maxresdefault.jpg`, only when no local `thumbnail` is set — all 6 currently have one). `[slug].astro` derives the embed iframe. Change an ID in `resources.ts` and both update.
- **Embed iframe `src` (`[slug].astro`):** `https://www.youtube-nocookie.com/embed/{youtubeId}?rel=0&modestbranding=1&enablejsapi=1`. Three deliberate choices, do NOT drop any:
  - `youtube-nocookie.com` — privacy-enhanced domain. Don't downgrade to plain `youtube.com`.
  - `rel=0&modestbranding=1` — no suggested videos, minimal branding.
  - `enablejsapi=1` — added 2026-05-16 at the content/product team's request (Vy) so the YouTube IFrame Player API *can* be driven by JS later. It only **enables** the API; nothing uses it yet (no IFrame API script loaded). Keep the param present; actual JS control is a future task.
- Updating videos: when given `youtube.com/watch?v=…` or `youtu.be/…` URLs, the ID is the part after `v=` / the last path segment. IDs are case-sensitive with confusable glyphs (`l`/`I`/`1`, `O`/`0`) — transcribe carefully and verify each page renders the player, don't trust an OCR'd ID.

### About (`src/pages/about.astro`)
- `bodyBg="#FFFFFF"` (white — was previously ink/dark; flipped during the Framer-style rebuild).
- Five sections: **AboutHero → AboutProblem → AboutValues → AboutOutro → CTABand.** No `AboutFounders` — the standalone founders section was retired and rolled into AboutHero.
- **AboutHero** — split layout: 2-photo crossfade carousel left (`founders-portrait.avif` + `founders-portrait2.avif` with BACK / NEXT controls), text right with eyebrow "Our journey", H1 "Hi, we're Cedric and Savar 👋", and the founders body copy.
- **AboutHero top padding is intentionally tight** — `calc(67px + 1rem/1.5rem/2rem)` for mobile/tablet/desktop. Earlier it was `+4rem/+5rem/+6rem` and the photo+headline floated below ~100px of dead whitespace. Don't re-inflate.
- **AboutProblem** — three-card "Settling in Canada feels harder than it should" with letter-by-letter SSR-split headline reveal. Cards: Scattered information, Doing it alone, No clear roadmap (third card has `span: "full"`).
- **AboutValues** — pill "Our Promises" + headline "You can trust *Unify.*" with letter-reveal sweep, then three promise cards. **Letter reveal is opacity-only.** Per-letter structure preserved for the staggered sweep, but no `transform` on the letters — opacity-only animation removes the ~30 simultaneous transform-layer cost. `.done` class also drops the transitions after settle.
- **AboutOutro** — final headline "Take the guesswork out of your newcomer journey with the full *Unify* experience." with per-word reveal, plus sub "Be the first to experience Unify and shape the future of newcomer support in Canada".
- **AboutOutro animation is per-word slide-up, not per-letter.** 13 word spans, 90ms stagger, `transform: translateY(14px)` on px (not em — em forces font-size resolution per frame). Section adds `.done` class 2500ms after intersection so the browser releases the per-word compositor layers. Per-letter (78 spans) caused mid-animation jank around "with the full…" — do NOT revert.

---

## Key Principle

Content-heavy, interaction-light. Preserve low JS, fast load, strong SEO. Don't code against Astro's strengths.

---

## SEO Sprint v2 — Retro (landed 2026-05-13 → 2026-05-15)

Five-day sprint per `~/.claude/plans/seo-sprint-v2.md`. Goal: get every page discoverable, indexable, and machine-readable. Off-page work (backlinks, PR) explicitly out of scope.

### Sprint timeline

| Day | Date | Workstreams shipped | Commits |
|---|---|---|---|
| **Day 0** | 2026-05-13 → 14 | Keyword research locked, SERP scan with gov-dominance stop-rule, content-depth audit, link-graph audit. Output: `~/.claude/plans/seo-research.md` (sign-off doc, not committed) | — |
| **Day 1** | 2026-05-14 | Sitemap, robots, canonical/og/twitter meta tags, OG card, edge redirects | `5faf1ec`, `fa9f51f` |
| **Day 2** | 2026-05-14 | JSON-LD: Organization site-wide, MobileApplication + FAQPage on `/`, BlogPosting + BreadcrumbList on `/blog/[slug]`, BreadcrumbList on `/resources/[slug]`, BreadcrumbList + LocalBusiness on `/partners/[slug]` | `9f81e67`, plus redirect hotfix landed as `1f36aa6` (Cloudflare `html_handling: "drop-trailing-slash"` after `b6d1be3` narrow-rule attempt also failed to fully solve the loop) |
| **Day 3** | 2026-05-15 | Page title + description rewrites against §1 keywords; image audit (alt enrichment, `decoding="async"`, descriptive community filenames, asset cleanup); internal link graph fixes (`/community` in footer + `/about` CTA, "Related Resources" on partner detail pages) | `ad9ac30`, `6fcf84a`, `0b40020` |
| **Day 4** | 2026-05-15 | Production health verification; Lighthouse mobile pass; Bing site verification file; LCP performance fix (`fetchpriority="high"` + `<link rel="preload">` on hero images); GSC + Bing sitemap submission (user-driven); schema validation via Rich Results Test; this retro | `b894af8`, `3ffba6f` |

### Architecture (where the SEO machinery lives)

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

### Schema map (which page emits which JSON-LD)

| Page | Schemas |
|---|---|
| All pages (via BaseLayout) | `Organization` |
| `/` | + `MobileApplication`, `FAQPage` |
| `/blog/[slug]` | + `BlogPosting`, `BreadcrumbList` |
| `/partners/[slug]` | + `BreadcrumbList`, `LocalBusiness` |
| `/resources/[slug]` | + `BreadcrumbList` |

### Cloudflare AI Crawl Control (configured to Option 3)

Cloudflare's AI Crawl Control panel (Security → AI Crawl Control) is enabled at the zone level. Current config:
- **Allowed (AI search/inference):** Googlebot, Bingbot, Applebot, OAI-SearchBot, ChatGPT-User, Claude-SearchBot, DuckAssistBot, PerplexityBot
- **Blocked (AI training):** GPTBot, Google-Extended, ClaudeBot, CCBot, Applebot-Extended, Bytespider, meta-externalagent, Amazonbot, CloudflareBrowserRenderingCrawler

This preserves AI-Search visibility (Gemini grounding, ChatGPT search, DuckAssist) while keeping the content out of training corpora. **Don't flip GPTBot or Google-Extended to Allow** without an explicit brand-strategy decision — they're training-only crawlers, not search.

### Day 15 + Day 30 check-in triggers (calendar-driven)

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

### Final Lighthouse state (mobile, post-perf-fix)

| URL | Perf | A11y | Best Practices | SEO | LCP |
|---|---|---|---|---|---|
| `/` | 88 | 96 | 100 | 100 | 3.0s |
| `/about` | 81 | 96 | 100 | 100 | 4.0s |
| `/partners/rbc` | 92 | 96 | 100 | 100 | 2.9s |
| `/blog/how-to-immigrate-to-canada-in-2026` | 95 | 96 | 100 | 100 | 2.7s |

SEO 100 across the board. Performance hit the 95 target on `/blog/[slug]` but not on the other three. The Day 4 sprint gate was "SEO ≥ 95" — that passes.

### Performance follow-ups (deferred to a separate perf sprint)

1. **`/about` Perf 81** — the page is bottlenecked NOT by the hero image (preload + fetchpriority helped marginally; LCP only dropped 0.1s) but by the **`AboutProblem` letter-reveal animation + `AboutValues` letter-reveal sweep + `AboutOutro` per-word reveal + `AboutHero` photo carousel JS** all running early in the page lifecycle. Fix path: gate the reveal animations behind `requestIdleCallback` so they don't compete with LCP and TBT. Estimated +5 to +8 Perf points. Needs careful animation testing — the current reveal timing is finely tuned per the AboutHero/AboutOutro notes above.

2. **Explicit `width` + `height` on raster images** — currently absent from every `<img>` in the codebase. CLS is 0 today because of CSS sizing, but explicit intrinsic dimensions are best practice for Core Web Vitals stability. Needs a Sharp-driven script to extract intrinsic dimensions per image; ~half-day workstream.

3. **`/` and `/about` LCP still > 2.5s** — Mobile LCP "Good" threshold is ≤2.5s. We're between 2.5s and 4s ("Needs Improvement"). Further gains require either reducing image bytes further (we're already AVIF) or rethinking the hero composition for mobile (smaller image, lighter font payload above the fold).

### Out of scope / deferred to follow-up sprints

- **PostHog event instrumentation** (`app_store_click`, `contact_form_submit`, `partner_form_submit`, `download_app_click`, `faq_open`). Product analytics, not SEO — runs cleanly as an independent workstream.
- **AggregateRating schema** on `MobileApplication`. Blocked on rendering the 21 supporting reviews on the homepage. Google's structured-data spam policy explicitly disallows ratings without visible supporting reviews; do not add until reviews are on the page.
- **Sanity blog SEO fields** (`seoTitle`, `seoDescription`, `ogImage` on the Post schema). Requires schema edit → Studio redeploy → GROQ + types update → blog detail rendering update → content backfill on every existing post. ~1.5 days. Defer.
- **Per-page OG image overrides** — BaseLayout already accepts `ogImage` as a prop; `/blog/[slug]` and `/partners/[slug]` could pass post thumbnails / partner logos. Trivial 1-line additions but deferred to the perf or content sprint.
- **MobileApplication `softwareVersion`** — ships without it (field is optional). Add when Savar provides the current App Store build number; one-line follow-up.
- **French-Canadian localization** (`hreflang`, `fr-CA` URLs). Bilingual app translations are Vietnamese/Hindi per launch meeting; FR is not on the roadmap.
- **Programmatic SEO** (city × program landing pages). High effort, separate strategy decision.
- **`claude-seo` plugin** — evaluated and rejected at sprint start (every check it does is already covered by `/audit`, GSC, Rich Results Test, Schema Markup Validator, and Lighthouse).

### Tax-cluster Sanity cross-links — owned by the content team

`seo-research.md` §3 identified a 5-post tax cluster on the blog:
- `key-tax-refund-forms-for-newcomers-in-canada-a-guide`
- `reporting-foreign-income-as-a-canadian-newcomer-what-must-you-declare`
- `how-to-file-taxes-when-you-moved-to-canada-mid-year-split-year-residency`
- `when-newcomers-can-claim-full-non-refundable-tax-credits-in-canada-the-90-rule-explained`
- `how-do-newcomers-file-their-first-tax-return-in-canada-step-by-step-guide`

Day 3 workstream-3 punch list called for hub-and-spoke inline cross-links between these posts with varied anchor text. **This is Sanity content, not code** — the content team applies the cross-links manually in Sanity Studio. The cross-link matrix + insertion guidance are in the Day 3 workstream-3 plan that was approved. Do NOT try to edit Sanity content from code.

### What to do when CMS / page structure changes

Anything that adds a new prerendered route under `src/pages/` automatically picks up:
- Sitemap inclusion (via `@astrojs/sitemap`)
- Organization JSON-LD (via BaseLayout)
- Full og:/twitter:/canonical meta tag set (via BaseLayout)
- Trailing-slash handling (via Cloudflare `html_handling`)

What you must do per new route:
- Pass a unique `title` (50–60 chars) and `description` (140–160 chars) keyed against a Day 0 keyword
- If detail page: add a `BreadcrumbList` via `<Fragment slot="head">` using `breadcrumbLd()` from `src/lib/seo/`
- If above-fold hero image: add `fetchpriority="high"` to the `<img>` and a `<link rel="preload">` in the head slot

### Critical caveats — footguns to avoid

1. **`MobileApplication.name` must match the App Store listing exactly: `"Unify - Canada Newcomer Guide"`** (hyphen-minus, NOT an em dash). Typographically it might look "wrong" against the rest of the brand which prefers em dashes — leave it. Google cross-references the schema name with the App Store listing for app-pack rich results; an em dash here would mismatch the canonical store record. Same applies to `applicationCategory: "EducationApplication"` (not "LifestyleApplication" despite intuition — the App Store category was the source of truth).

2. **`BlogPosting.author` is hardcoded to `Organization { name: "Unify Social" }`** because `studio/schemaTypes/post.ts` has no `author` field. If/when an `author` field is added to the Post schema (Sanity Studio), update `src/lib/seo/blogPostingLd.ts` to pull the actual author name; otherwise leave the Organization fallback. Google accepts Organization-as-author for company-published blogs.

3. **The blog detail page hero image uses a `heroImageUrl` variable that MUST match the preload `<link>` byte-for-byte** (`src/pages/blog/[slug].astro`). If you add a transform to one without adding it to the other, the preload fires a second request and you get a double-fetch instead of a cache warm. Both currently use `urlFor(post.thumbnail).width(1200).url()`. The separate `thumbnailUrl` variable (1200×630 with explicit height) is for JSON-LD only — don't merge them.

4. **`public/_redirects` must NOT contain trailing-slash rules** (`/about/ /about 301`, `/*/  /:splat 301`, etc.). Cloudflare's `html_handling: "drop-trailing-slash"` in `wrangler.jsonc` does that canonicalization at the edge. Adding a `_redirects` rule re-creates the redirect loop that took two attempts to fix (`b6d1be3` narrowing didn't work; `1f36aa6` html_handling did). Only `/privacy` and `/terms` belong in `_redirects`.

5. **Day 0 keyword list lives at `~/.claude/plans/seo-research.md`** — NOT committed to this repo. The doc is the canonical source for which keyword each page is tuned against (see §1 for the locked keyword set). When rewriting any page title or description, check the §1 mapping for that page's target. The doc also holds the Day 15 SERP re-scan baseline and the Day 0 link-graph audit findings. If the file is missing on a fresh machine, ask Luis — he has the source-of-truth copy.

6. **GSC has a ~10–12 URLs/day Request Indexing quota per property.** When inspecting URLs in batches, prioritize the homepage + 4 section landing pages first; detail pages can wait for natural sitemap-driven discovery (usually 1–7 days). Hitting the quota isn't a problem — the sitemap covers everything anyway.
