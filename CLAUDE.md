# Project: Unify Website (Framer → Code)

Astro-based rebuild of the Unify marketing + content website.

## Goal

Rebuild the current Framer site into a clean, maintainable Astro codebase.

Stack:

- Astro 6
- Tailwind CSS v4 + shadcn/ui
- Sanity CMS (existing instance)
- Cloudflare Workers (deployment)
- PostHog (analytics)

The new site must:

- match the existing design closely on desktop and mobile
- be easy to maintain
- support CMS-driven content
- be SEO optimized
- remain fast (low JS)

---

## Core Priorities

1. Visual fidelity (match Framer on desktop and mobile)
2. Maintainable structure
3. Clean CMS integration
4. Strong SEO
5. Performance (Astro advantages preserved)

---

## Source of Truth

- Framer project = design source (unifysocial.ca)
- Savar's static branch = visual reference only (not the target structure)
- Do NOT guess spacing/typography/colors if Framer values exist
- Use exact assets and copy when possible
- If unsure → ask, do not approximate silently
- If Framer has no mobile design for a section → use judgment, flag it, document the decision

---

## Responsive Scope

- Target: desktop, tablet, and mobile
- Framer designs are the source of truth where available
- Where Framer has no explicit mobile design: apply reasonable responsive judgment using the desktop design as reference
- Do NOT silently approximate — flag any section where mobile layout is ambiguous
- Dark mode: out of scope. Do not implement or plan for it.

---

## Stack Rules

### Astro

- Default to server-rendered HTML
- Avoid unnecessary client-side JS
- Use islands ONLY when interactivity is needed
- Do not turn static pages into React-heavy apps

### Tailwind

- Use Tailwind v4 for styling
- Configure design tokens in `@theme` inside `global.css` — not in a JS config file
- Extract all repeating values (spacing, colors, radii, type scale) as tokens before building components
- Never use arbitrary values (e.g. `mt-[96px]`) — if a value isn't in the scale, add it to `@theme`
- Extract reusable components for repeated patterns
- Maintain consistent spacing and typography

### shadcn/ui

- Allowed for accessible UI primitives
- Prefer copy-paste components over heavy dependencies

---

## CMS (Sanity)

- Sanity is the content database
- Extend the existing instance — do not create a parallel CMS
- Blog/articles/videos must come from Sanity
- Do NOT hardcode CMS-managed content into pages
- All GROQ queries live in `src/lib/sanity/queries.ts` — no inline queries in pages or components
- Components receive Sanity data as props — they never import the Sanity client directly
- Type all query results in `src/lib/sanity/types.ts` — no `any`

---

## Backend Scope

There is NO full backend.

Only 2 API routes:

- POST /api/contact
- POST /api/waitlist

Each should:

- validate input (Zod)
- send email (Resend)
- optionally store data (Sanity or Cloudflare KV)
- use Turnstile for spam protection

Do NOT introduce:

- auth systems
- databases
- servers

unless explicitly requested

---

## SEO Rules

SEO is a core requirement.

For every page:

- proper `<title>`
- meta description
- correct heading hierarchy (h1, h2, etc.)
- semantic HTML (`<section>`, `<nav>`, `<article>`, etc.)
- clean URLs
- fast load times

Optimize for:

- newcomer / immigrant / settlement keywords

DO NOT:

- keyword stuff
- harm readability

---

## UI / UX Rules

- The homepage has been deliberately redesigned beyond the Framer original — do NOT revert to Framer's layout or copy without explicit request
- The visual direction is editorial and bold: asymmetric composition, strong typographic hierarchy, fluid type via clamp(), physical micro-interactions
- Preserve layout, spacing, typography as implemented
- Avoid generic AI-looking UI
- Do not redesign unless explicitly requested
- Enforce proper HTML semantics — Framer output often lacks heading hierarchy and semantic structure. The Astro rebuild must fix this, not replicate it.

---

## Implementation Rules

- No placeholder implementations
- No guessing APIs
- Keep solutions simple and maintainable
- Avoid over-engineering
- Build real features, not mockups

---

## Planning Rules

Before coding:

1. Understand task
2. Identify files/components affected
3. Propose plan
4. State assumptions explicitly
5. Surface ambiguity — do not resolve it silently

For multi-step work:

1. [Step] → verify: [check]
2. [Step] → verify: [check]

---

## Fidelity Workflow

When rebuilding a UI section:

1. Inspect Framer (exact values — spacing, type, color, radii)
2. Extract values → add to `@theme` if not already present
3. Build section as a standalone component with static props first
4. Wire Sanity data only after layout is confirmed correct
5. Compare visually against live Framer site (unifysocial.ca)
6. Flag any mobile layout gaps where Framer has no design

Goal = visually indistinguishable from Framer output

---

## Project Structure

```text
src/
├── pages/
│   ├── index.astro           # Homepage — imports all section components in order
│   ├── about.astro
│   ├── community.astro
│   ├── contact.astro
│   ├── partners.astro
│   ├── partners/
│   │   └── [slug].astro
│   ├── api/
│   │   ├── contact.ts
│   │   └── partner-inquiry.ts
│   └── blog/
│       ├── index.astro
│       └── [slug].astro
├── layouts/
│   └── BaseLayout.astro
├── components/
│   ├── ui/
│   ├── sections/
│   │   ├── Hero.astro
│   │   ├── Problem.astro
│   │   ├── Partners.astro          # Homepage logo marquee
│   │   ├── Journey.astro
│   │   ├── ProductOverview.astro
│   │   ├── FAQ.astro
│   │   ├── CTABand.astro
│   │   ├── AboutHero.astro
│   │   ├── AboutFounders.astro
│   │   ├── AboutProblem.astro
│   │   ├── AboutValues.astro
│   │   ├── ContactHero.astro
│   │   ├── ContactForm.astro
│   │   ├── PartnersHero.astro
│   │   ├── PartnerTestimonials.astro
│   │   ├── PartnersGrid.astro
│   │   └── BecomePartner.astro
│   ├── blog/
│   │   └── PostNav.astro
│   └── common/
│       ├── Navbar.astro
│       └── Footer.astro
├── lib/
│   ├── partners.ts
│   ├── sanity/
│   │   ├── client.ts
│   │   ├── queries.ts
│   │   └── types.ts
│   └── utils.ts
├── styles/
│   └── global.css
└── public/
    ├── fonts/
    ├── images/
    └── assets/
        ├── logo/
        ├── screenshots/
        ├── demos/
        ├── blobs/
        ├── illustrations/
        ├── images/
        │   └── partners/
        ├── app-store-badge.svg
        ├── app-store-badge-en.svg
        └── phone-learn.avif

All homepage sections live in src/components/sections/ and are imported into src/pages/index.astro in order. One page, multiple focused components — do not build everything into a single file.

⸻

Code Quality

* Keep diffs focused
* Only modify relevant files
* Avoid unrelated refactors
* Keep components readable
* Keep naming clean

⸻

Default Workflow

1. Explain understanding
2. Propose plan
3. Implement
4. Verify
5. Summarize changes

⸻

When to Push Back

Push back if:

* unnecessary complexity
* unclear requirements
* CMS misuse
* breaking visual fidelity
* over-engineering
* bad SEO practices
* mobile layout decisions are being made silently without flagging

⸻

Key Principle

This is a content-heavy, interaction-light site.

Preserve:

* low JS
* fast load
* strong SEO

Do not code against Astro’s strengths.

⸻

Do NOT implement

* React components
* Framer Motion or motion/react
* Any animation libraries (embla, carousel, etc.)
* next/image or Next.js specific code
* Dark mode
* Arbitrary Tailwind values — add tokens to @theme instead

⸻

Decisions Log

Design Tokens (extracted from Framer + extended for editorial redesign)

Colors:

* Brand/CTA: #D84A29 — var(--color-brand-red)
* Text/Ink: #181818 — var(--color-text)
* Ink dark: #171616 — var(--color-ink)
* White: #FFFFFF
* Cream: #FFFCF3 — var(--color-cream) — also set as html/body background
* Muted: #575757 — var(--color-muted)

Fonts:

* Aileron: self-hosted woff2 in public/fonts/ — Light (300), Regular (400), SemiBold (600), Bold (700)
* Figtree: Google Fonts — CTA button and UI elements only

Nav links: Aileron SemiBold 16px, color #181818

CTA button: bg #171616, hover bg #D84A29 (transition 0.2s), Figtree Medium 15px, radius 12px

Breakpoints:

* Mobile: ≤809px — hamburger nav
* Tablet: 810px–1399px — hamburger nav
* Desktop: ≥1400px — full inline nav

Container: max-width 1600px

Type scale (sections use fluid clamp() — do not override with fixed px):

* H1: 80px / 80px
* H2: 60px / 68px
* H3: 44px / 52px
* H4: 32px / 40px
* H5: 24px / 32px
* Body: 24/20/16/14px

Letter-spacing tokens (in @theme):

* --tracking-display: -0.05em — use on hero H1 big word
* --tracking-tight: -0.04em — use on large headings
* --tracking-label: 0.08em — use on eyebrows/overlines (uppercase)

Easing tokens (in @theme, Emil Kowalski principles):

* --ease-out: cubic-bezier(0.23, 1, 0.32, 1) — all enter/reveal transitions
* --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)
* --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)

Global grain texture: body::after with SVG fractalNoise at opacity 0.028 — do not remove

⸻

Navbar — Critical Design Notes

The navbar pill must feel light and unobtrusive. The goal is for the user’s eye to go TO the content inside the pill (logo, links, CTA) — not to the pill container itself.

Shadow and border — keep subtle:

* Border: 1px solid rgba(0,0,0,0.08) — very subtle, never dark
* Box shadow: 0 10px 28px -14px rgba(23,22,22,0.18) — soft and low
* On scroll (.is-scrolled): shadow deepens slightly, never becomes prominent
* Background: solid #ffffff — no frosted glass, no blur
* The pill floats gently — it does not stamp itself onto the page
* If shadow or border ever draws more attention than the logo or links, reduce them

Logo and spacing — HIGH PRIORITY:

* Logo (logo-with-name.png) must have generous left padding inside the pill
* Logo and “Download Unify” button must NOT feel cramped against each other or the pill edges
* Logo height: h-7 (28px)
* Pill internal padding: generous — if anything feels tight, increase padding first before anything else
* Nav links: evenly spaced, not crowded
* The logo should feel like the visual anchor of the navbar, not an afterthought

CTA button:

* Label: “Download Unify” with small arrow icon (→)
* Background: #171616, hover: #D84A29, transition 0.2s
* Must not appear oversized relative to nav links

Logo behavior: Plain <div>, NOT a link. Clicking does nothing.
Logo asset: /assets/logo/logo-with-name.png
CTA URL: https://apps.apple.com/ca/app/unify-newcomer-support/id6754875762 — new tab
Nav links: Home, About, Community, Blog
Mobile: hamburger at ≤1399px, full overlay with stacked links + CTA

⸻

Footer

Structure:

* White background throughout
* Bold heading with 3px brand-red left border: “Unify,” / “Your journey to Canada, simplified.”
* Two-column body: left = full brand description, right = Pages + Socials
* Bottom bar: © 2026 – Unify Social
* No logo in footer

Section labels: “Pages” and “Socials”

Social URLs:

* Instagram: https://www.instagram.com/unifysocial.ca/
* Facebook: https://www.facebook.com/p/Unify-Social-61570879043328/
* LinkedIn: https://www.linkedin.com/company/unify-social/posts/?feedView=all
* Twitter: https://x.com/unifysocialca

Legal URLs (open new tab):

* Privacy Policy: https://www.notion.so/Unify-s-Privacy-Policy-2e15af89dddb80b0b37ee497e6d4e38c?source=copy_link
* Terms of Service: https://www.notion.so/Unify-s-End-User-License-Agreement-Terms-of-Service-3185af89dddb80a68410fa8d65d615c7?source=copy_link

⸻

Assets

Logo:

* With wordmark: /assets/logo/logo-with-name.png
* SVG mark only: /assets/logo/unify-logo.svg

Screenshots:

* /assets/screenshots/checklist.png — Checklist feature
* /assets/screenshots/learn.png — Learn feature
* /assets/screenshots/learn-mockup.png — Learn alternate
* /assets/screenshots/companion.png — AI Companion
* /assets/screenshots/community.png — Community feature
* /assets/screenshots/community-feed.png — Community feed
* /assets/screenshots/learn-hero.avif — Hero phone mockup

Demo videos:

* /assets/demos/checklist.mp4
* /assets/demos/ai-companion.mp4
* /assets/demos/learn.mp4
* /assets/demos/community.mp4
* /assets/demos/community-events.mp4
* /assets/demos/community-events2.mp4

These demo videos came from Framer and should be used for the product overview / guided demo section.

App Store:

* /assets/app-store-badge-en.svg — EN/US badge

Partner logos in /assets/images/partners/:

* RBC Foundation
* Newcomer Jobs Canada
* Global Connect Immigration
* SFU
* EY

Decorative:

* /assets/blobs/ — SVG blob shapes for section backgrounds

⸻

Completed — Milestone 1

* ✅ Astro 6 + Cloudflare Workers adapter
* ✅ Tailwind v4 + full @theme token set
* ✅ Aileron self-hosted, Figtree via Google Fonts
* ✅ BaseLayout.astro with head, fonts, Navbar, Footer
* ✅ Navbar — floating white pill, sticky, scroll behavior, hamburger mobile
* ✅ Footer — full rebuild with exact copy and correct styling
* ✅ Pages: index, about, community, contact, blog/index, blog/[slug]
* ✅ Sanity lib stubs
* ✅ Build clean on Cloudflare Workers

⸻

Completed — Milestone 2 — Homepage sections

* ✅ Hero — Hero.astro
* ✅ Problem — Problem.astro
* ✅ Partners — Partners.astro
* ✅ Journey — Journey.astro
* ✅ ProductOverview — ProductOverview.astro
* ✅ FAQ — FAQ.astro
* ✅ CTABand — CTABand.astro

⸻

Completed — Milestone 3 — Visual revamp (editorial redesign)

Goal: escape generic AI-slop aesthetics. All sections redesigned with editorial character. Build remains shippable — same brand identity, no new dependencies.

* ✅ Global: html/body background set to cream (#FFFCF3) — no white flash at top
* ✅ Global: grain texture overlay (body::after, SVG fractalNoise, opacity 0.028)
* ✅ Global: easing + tracking tokens added to @theme
* ✅ Hero: fluid clamp() type hierarchy (newcomer at clamp(3.5rem,10.5vw,9rem)), staggered CSS entrance animations, blob-3.svg decoration, tight padding under navbar, phone top-aligned
* ✅ Problem: progressive-enhancement scroll reveal using CSS transitions (not keyframe animations)
* ✅ Partners: pause-on-hover, grayscale-to-color on logo hover
* ✅ Journey: loading="eager" on images, progressive enhancement animation (js-ready pattern), brand-red pill stage labels, spine gradient
* ✅ ProductOverview: faint background numerals via ::before, deeper video drop-shadow with warm red tint
* ✅ FAQ: SVG chevron (rotates 180°), JS-driven max-height animation, hover warmth, 1rem left/right padding on summary + answer
* ✅ Navbar: hamburger morphs to X via CSS transforms, mobile overlay uses opacity/visibility transition, link stagger via CSS --i variable
* ✅ CTABand: redesigned to dark ink background, editorial split layout, "Stop guessing. / Start settling." headline, blob decoration

⸻

Completed — Milestone 4 — About page

* ✅ AboutHero: dark ink background, asymmetric 2-col grid (text + photo), editorial "We've been there." headline, staggered hero-fade-up animations
* ✅ AboutFounders: cream background, brand-red left border on headline column, offset box-shadow on founders photo-2, founders story copy
* ✅ AboutProblem: dark ink background, typographic problem entries with large brand-red 01/02/03 numbers, statistics + sources
* ✅ AboutValues: cream background, editorial "Built differently." headline, 2-col values grid with brand-red — prefix
* ✅ about.astro: wires all 4 sections + reuses CTABand; Footer auto-included via BaseLayout

About page image assets (user-supplied):

* /assets/images/about/founders-portrait.jpg — used in AboutHero (right column, full height)
* /assets/images/about/founders-photo-2.jpg — used in AboutFounders (left column, offset red shadow)

⸻

Completed — Milestone 5 — Blog

* ✅ Astro Content Collections — `src/content/blog/` with Zod schema (title, description, publishedAt, updatedAt, thumbnail, order, craReference)
* ✅ `src/pages/blog/index.astro` — blog listing page, cards sorted by `order` desc, cream background
* ✅ `src/pages/blog/[slug].astro` — individual post page, hero image, metadata bar, prose body, prev/next nav
* ✅ `src/components/blog/PostNav.astro` — previous/next post navigation
* ✅ `src/styles/prose.css` — full prose typography: headings, body, tables, blockquotes, lists, code
* ✅ 15 blog posts in `src/content/blog/` — Canadian immigration, tax, career, newcomer topics
* ✅ Prose link styling: always underlined with brand-red, partial opacity strengthens on hover

⸻

Completed — Milestone 6 — Blog content polish

* ✅ Added markdown hyperlinks throughout all 15 blog posts (NOC codes, CRA references, IRCC, Express Entry, PNP, App Store, etc.)
* ✅ Converted plain-text URLs to proper `[text](url)` hyperlinks
* ✅ Fixed `accesemployment.ca` plain text → `[accesemployment.ca/pre-arrival](http://accesemployment.ca/pre-arrival)`
* ✅ Reduced excessive spacing above blog post titles — padding tightened to `calc(67px + 0.75rem)` across all breakpoints
* ✅ `.post-back` margin-bottom reduced (2.5rem → 1.25rem); `.post-title` bottom margin reduced (2.5rem → 1.5rem)

⸻

Completed — Milestone 4.5 — Community page

* ✅ `src/pages/community.astro` — page shell with `bodyBg="#171616"`, wires CommunityHero + CommunityFeatures + CommunityEvents + CTABand
* ✅ `src/components/sections/CommunityHero.astro` — dark ink hero, margin-top: -67px, editorial headline, staggered hero-fade-up animations
* ✅ `src/components/sections/CommunityFeatures.astro` — cream section, feature highlights
* ✅ `src/components/sections/CommunityEvents.astro` — events listings section

⸻

Completed — Milestone 7 — Contact page

* ✅ `src/pages/contact.astro` — page shell with `bodyBg="#171616"`, wires ContactHero + ContactForm + CTABand
* ✅ `src/components/sections/ContactHero.astro` — dark ink hero, margin-top: -67px, "Get in touch." headline at clamp(3rem,8vw,5.5rem), staggered hero-fade-up animations, blob decoration
* ✅ `src/components/sections/ContactForm.astro` — cream section, 2-col layout at desktop (form left, contact sidebar right), name+email side-by-side, Turnstile widget slot, loading spinner, inline field errors, success state, vanilla JS fetch handler
* ✅ `src/pages/api/contact.ts` — POST route: Zod validation → Turnstile siteverify → Resend email delivery. Gracefully skips steps when keys are absent (safe for local dev without keys).

⸻

Completed — Milestone 8 — Partners page

* ✅ `src/lib/partners.ts` — typed Partner interface, 17 partners with full copy from PDF, getPartnerBySlug() helper, exported categories array
* ✅ `src/pages/partners.astro` — page shell with bodyBg="#171616", wires PartnersHero + PartnerTestimonials + PartnersGrid + BecomePartner + CTABand
* ✅ `src/pages/partners/[slug].astro` — static detail pages: back link, logo box, name/city/badge, divider, partnership description, org description, live "Visit website →" button
* ✅ `src/pages/api/partner-inquiry.ts` — POST: Zod validation → Turnstile → Resend, same graceful degradation as contact.ts
* ✅ `src/components/sections/PartnersHero.astro` — dark ink, "Together, we unify newcomers" H1, stats row (15+ partners | 5+ cities | 1,000s served), staggered animations
* ✅ `src/components/sections/PartnerTestimonials.astro` — 3 placeholder testimonials (SFU/RBC/VPL), prev/next arrows + dot nav, desktop shows all 3 side-by-side, editorial left-border quote style
* ✅ `src/components/sections/PartnersGrid.astro` — 17-partner grid, filter tabs (All/Education/Community/Libraries/Financial/Nonprofit), vanilla JS classList filter, cards link to /partners/[slug]
* ✅ `src/components/sections/BecomePartner.astro` — dark ink split layout, headline + 4 benefits left, form right, POST to /api/partner-inquiry
* ✅ `src/components/sections/Partners.astro` — updated homepage marquee with 5 new partners (YMCA BC, Capilano University, Burnaby Public Library, Promise Vancouver, Big Brothers Big Sisters)
* ✅ `src/components/common/Navbar.astro` — added Partners + Contact links (order: Home | About | Community | Partners | Blog | Contact)

Note: 5 new logo images must be placed in public/assets/images/partners/:
  ymca_bc.png, capilano_university.png, burnaby_public_library.png, promise_vancouver.png, big_brothers_big_sisters.png

Note: BecomePartner.astro Turnstile placeholder key (0x4AAAAAAA_PLACEHOLDER_KEY) must be replaced at deploy time (same as ContactForm).

⸻

Pending — Contact form: deploy-time setup

These steps are NOT needed for local development. The form works locally without any keys (skips email send, skips Turnstile verification, shows success state). Come back to this when deploying to Cloudflare Workers.

1. **Resend API key**
   - Sign up at resend.com → API Keys → Create API Key
   - Verify domain `unifysocial.ca` in Resend (add SPF/DKIM/DMARC DNS records at registrar)
   - Add `RESEND_API_KEY=re_...` to `.dev.vars` (local) and Cloudflare Workers secrets (production)

2. **Cloudflare Turnstile**
   - Cloudflare dashboard → Turnstile → Add site → get **Site Key** (public) + **Secret Key** (private)
   - Replace `0x4AAAAAAA_PLACEHOLDER_KEY` in `src/components/sections/ContactForm.astro` with the real site key
   - Replace `0x4AAAAAAA_PLACEHOLDER_KEY` in `src/components/sections/BecomePartner.astro` with the real site key
   - Add `TURNSTILE_SECRET_KEY=...` to `.dev.vars` (local) and Cloudflare Workers secrets (production)

3. **Optional**
   - Add `CONTACT_TO_EMAIL=contact@unifysocial.ca` if you want submissions going to a different inbox (defaults to `contact@unifysocial.ca` if unset)

⸻

Hero section

Copy:

* Overline: “Newcomer settlement app” (brand-red, uppercase, tracking-label)
* H1 structure: “The all-in-one” (light, muted) / “newcomer” (bold display, clamp 3.5rem→9rem) / “settlement app” (bold, italic brand-red “app”)
* Subtext: “Unify makes settling in Canada simpler, clearer, and more connected”
* App Store badge → https://apps.apple.com/ca/app/unify-newcomer-support/id6754875762 new tab, height 52px
* “No credit card required” below badge

Layout (do not revert):

* Two-column grid at tablet+: `1fr 480px`, gap 1rem, padding 0 5rem desktop
* `align-items: flex-start` on the grid — text and phone both pin to the top
* Phone: `align-items: flex-start` on .hero-visual (top-aligned, not bottom)
* Phone: `justify-content: center` on .hero-visual (centered in column, not flush-right)
* padding-top: 4.5rem mobile / 5rem tablet / 5.5rem desktop (tight under navbar)
* Decorative blob-3.svg top-right at opacity 0.28
* Phone: /assets/screenshots/learn-hero.avif, max-height 680px desktop, loading=”eager”

Animations (CSS only, animation-fill-mode: forwards):

* Overline, h1-small, h1-big, h1-sub, desc, cta-row: staggered hero-fade-up (translateY 20px → 0), delays 0.1s–0.52s
* Phone: hero-phone-in (translateX 32px + translateY 12px → 0), 0.8s delay 0.2s
* All use --ease-out easing

⸻

Problem section

* Background: #171616
* Large italic white text: “You just arrived. There’s too much information, too many opinions, and no clear first step.”
* Below: “That’s the gap Unify fills.” — brand red #D84A29, centered, smaller
* No images. Pure typography.
* Manual line breaks are allowed if needed to make the quote feel intentional and editorial.
* The contrast does the work.

⸻

Partners section

* Label: “Our Partners”
* CSS scroll animation only — no JS, no libraries
* Logos from /assets/images/partners/
* Fade edges with CSS mask gradient
* Greyscale / opacity treatment is allowed only if it still feels visible and premium

⸻

Journey section

Vertical timeline, 4 stages. Each stage: human emotional moment (large type) + phone screenshot. Alternates left/right on desktop, stacks on mobile. A vertical line connects the stages. Stage labels (Day 1, Week 1, etc.) in brand red.

* Day 1: “You don’t know where to start.” → /assets/screenshots/checklist.png
* Week 1: “You need answers you can trust.” → /assets/screenshots/companion.png
* Month 1: “You want to understand how life in Canada works.” → /assets/screenshots/learn.png
* Month 3: “You’re ready to find belonging.” → /assets/screenshots/community.png

The timeline idea is strong and should be preserved unless explicitly changed.

⸻

ProductOverview section

This is the next section after Journey.

Purpose:

* Explain what Unify actually helps users do
* Feel like a guided product demo, not a feature grid

Structure:

* section intro
* compact row of feature buttons / tabs
* one large showcase area
* active demo video swaps when user clicks a tab
* concise supporting copy per active feature

Features to include:

* Checklist
* AI Companion
* Learn
* Community

Behavior:

* click tab → switch active demo
* active video autoplay muted loop playsinline
* inactive demos should not visibly keep playing in layout
* JS should stay minimal

Design notes:

* the demo/video should be the hero of the section
* copy and tabs support the demo, not the other way around
* warm, polished, product-led
* avoid another alternating feature row
* avoid giant empty containers
* avoid harsh black monitor-like shells unless there is a very strong reason

Implementation notes (do not revert):

* Split editorial layout: left column (feature list) + right column (video stage)
* NO white card or box around the video — phone floats on the cream background
* filter: drop-shadow() on .po-video only — traces the phone bezel, not a rectangular box
* All panels share the same CSS grid cell (grid-column:1; grid-row:1) — no height reflow on tab switch
* Desktop stage gets transform: translateY(-1.5rem) to feel intentionally placed, not default-centered
* Source .mp4 files have baked-in cream padding around the phone — do NOT attempt to crop or scale aggressively
* Stage max-widths: mobile 365px, tablet 415px, desktop 480px

⸻

FAQ section

Native HTML <details>/<summary> with JS-driven max-height animation (not CSS-only — native details can't CSS-transition).
Background: var(--color-cream). SVG chevron rotates 180° on open. Rows have hover background + brand-red question color on hover.
Summary and answer both have padding: 1rem left/right so text breathes away from the hover border.

Questions (exact copy — do not rewrite):

1. What is Unify Social?
2. Who is Unify Social best for?
3. How do I connect with other immigrants on Unify Social?
4. What workshops does Unify Social offer, and how can I join one?
5. Is Unify Social free to use?

Answers use rich HTML rendered via set:html. List bullets are brand-red “–“ via CSS ::before.

⸻

CTA band section

* Background: var(--color-ink) #171616 — dark, NOT white
* Layout: two-column flex at tablet+ (left: headline, right: sub + button)
* Headline: “Stop guessing.” / “Start settling.” — white, italic brand-red “Start settling.”
* Eyebrow: “Ready to get started?” — brand-red, uppercase
* Sub: “Join thousands of newcomers who use Unify to navigate life in Canada — from day one to finding home.”
* Button: “Download the App Now” → App Store URL, brand-red bg with red glow shadow on hover
* Decorative blob-8.svg bottom-right at low opacity
* Scroll fade-up via IntersectionObserver + js-ready progressive enhancement pattern

⸻

Journey section (do not revert)

* Section images use loading="eager" — NOT lazy (lazy breaks screenshots and above-fold rendering)
* Stage labels (Day 1, Week 1, etc.) are brand-red pills: white text, border-radius 99px
* Timeline spine: linear-gradient transparent → brand-red → transparent
* Scroll animation uses progressive enhancement: JS adds body.js-ready → stages hidden; observer adds .visible → CSS transition reveals them
* Pattern ensures stages are visible when JS hasn't run (SSR/screenshot context)

⸻

Problem section (do not revert)

* Uses CSS transitions (NOT keyframe animations) for scroll reveal — avoids animation-fill-mode: both opacity bug
* JS adds .animate class to section immediately, then .visible when observed
* Default (no JS): text is visible. With JS: hidden until in view, then transitions in.

⸻

Scroll animation pattern (use this for all new sections)

Progressive enhancement — never set opacity: 0 globally without a JS-gated class:

```css
/* Default: visible */
.my-element { transition: opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out); }

/* JS-gated: hidden until observed */
.my-section.animate .my-element { opacity: 0; transform: translateY(24px); }
.my-section.animate.visible .my-element { opacity: 1; transform: translateY(0); }
```

```js
section.classList.add('animate');
observer fires → section.classList.add('visible');
```

Do NOT use `animation-fill-mode: both` with a delay on scroll-triggered elements — it causes opacity: 0 to persist before the animation starts, breaking static renders and slow JS contexts.

⸻

Rules for all sections

* No React, no animation libraries, no Framer Motion
* CSS animations on page-load elements (hero), CSS transitions on scroll-reveal elements
* No arbitrary Tailwind values — add tokens to @theme
* Semantic HTML throughout (<section>, <h2>, etc.)
* Build one section at a time, verify with npm run build before moving to next
* Playwright installed as dev dependency — use for visual QA: `npx playwright screenshot http://localhost:4321 /tmp/out.png --viewport-size="1440,900" --full-page`
* MCP config at .mcp.json — Playwright MCP server available after Claude Code restart
```
