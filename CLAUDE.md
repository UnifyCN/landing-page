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
- **Responsive at every width — non-negotiable.** Every page, section, and component must look and work correctly across mobile (≤809px), tablet (810–1399px), desktop (≥1400px), AND every in-between width. No layout breaks, awkward wraps, overflow, cropped content, or unreadable type at *any* viewport in the 320px–1920px range. Test by resizing the browser continuously, not just at the three named breakpoints. Prefer fluid type (`clamp()`), fluid spacing, and intrinsic layouts (`auto-fit` / `minmax` / `flex-wrap`) over fixed pixel jumps. When you ship a UI change, the verification step must include a continuous resize check, not just three discrete screenshots.

---

## Core Rules

### Astro

- Default to server-rendered HTML. Avoid unnecessary client JS.
- Use islands ONLY when interactivity is needed (FAQ accordion, form handler, mobile menu, product overview tabs).
- View Transitions are wired globally — preserve them. Navbar uses `transition:persist`; body bg swap is handled via `astro:before-swap` in BaseLayout.
- **All static pages must `export const prerender = true`** so they bake to HTML at build time and are served from the Cloudflare CDN edge. The repo had every page hitting the worker on every request before this — TTFB on every navigation. Currently prerendered: `/`, `/about`, `/community`, `/contact`, `/partners` (+ all `/partners/[slug]` via `getStaticPaths`), `/resources` (+ all `/resources/[slug]`), `/privacy`, `/terms`. SSR retained for `/blog/*` (live Sanity fetch) and `/api/*`.
- **Scroll-reveal observers must wrap in `astro:page-load`**, not run at module top-level. With ClientRouter, module scripts only execute once on initial load — on subsequent View Transition navigations the new DOM exists but the old observer is still attached to the detached previous DOM, leaving the section stuck invisible. This is exactly what bit CTABand. Pattern: wrap observer setup in a function, register it with `document.addEventListener("astro:page-load", initFn)`, and add a class-based guard at the top of the function to prevent duplicate registration when the script re-runs.

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

The navbar pill is a **liquid-glass** element — translucent white pill with real backdrop-blur, gradient sheen, gloss highlight, and layered shadows. The user's eye should still go TO the content inside the pill (logo, links, CTA) — the pill itself is depth, not focus.

- Background: `linear-gradient(180deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5))` — translucent so blur reads through
- **Backdrop blur: `blur(14px) saturate(160%)`** — DO NOT raise to 22/180. Was originally `blur(22px) saturate(180%)` and that made the entire site lag on macOS/HiDPI because the GPU re-blurred the underlying viewport every scroll frame at 2× pixel density. Cost scales roughly with blur radius squared. After the AVIF image conversion (commit `ad885e5`) reduced competing main-thread work, we bumped from 8/140 → 14/160 — closer to the original feel, still ~50% cheaper than 22/180. If lag returns on lower-end Macs, drop back to 8/140.
- Border: `1px solid rgba(255,255,255,0.55)` — light edge, lifts the pill off the page
- Inset highlights: `inset 0 1px 0 0 rgba(255,255,255,0.8)` (top), `inset 0 -1px 0 0 rgba(255,255,255,0.2)` (bottom) — simulates light refraction through the glass
- Box shadow: layered `0 8px 24px -8px rgba(23,22,22,0.14), 0 2px 6px -2px rgba(23,22,22,0.08)` — soft elevation
- Top-gloss highlight via `::before` with `mix-blend-mode: overlay` and a 35%→0% white gradient — the "wet" look
- On scroll (`.is-scrolled`): background opacity bumps to 0.85→0.65 and shadows deepen slightly. Never becomes opaque.
- Logo height: `h-10` (40px), generous left padding inside the pill
- Logo is a plain `<div>`, NOT a link. Clicking does nothing. Asset: `/assets/logo/logo-with-name.png`
- Logo and "Download Unify" CTA must NOT feel cramped — if anything feels tight, increase padding first
- CTA: `bg #171616`, `hover #D84A29`, transition `0.2s`, label "Download Unify" + `→`, links to App Store in a new tab
- Nav links (order): Home | About | Community | Partners | Blog | Resources | Contact
- Mobile: hamburger at ≤1399px, full overlay with stacked links + CTA

---

## Footer

White background, top + bottom hairline borders. Three-column grid at tablet+ (`2fr 1fr 1fr`).

- **Brand column:** `/assets/logo/logo-with-name.avif` at `h-14`, links to `/`. Tagline: "An all-in-one mobile companion for newcomers in Canada. Built in Vancouver, with newcomers, for newcomers." Below: row of 38px round social pills with hairline border that fill brand-red on hover.
- **Navigate column:** Home | About | Blog | Contact (4 links — narrower than the 7-link navbar).
- **Legal column:** Privacy Policy → `/privacy`, Terms of Service → `/terms`. **Internal Astro routes**, not Notion. Open in same tab.
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
