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

- Match Framer visually on desktop and mobile
- Preserve layout, spacing, typography
- Maintain mobile + desktop behavior
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
│   │   ├── Partners.astro
│   │   ├── Journey.astro
│   │   ├── ProductOverview.astro
│   │   ├── FAQ.astro
│   │   └── CTABand.astro
│   └── common/
│       ├── Navbar.astro
│       └── Footer.astro
├── lib/
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

Design Tokens (extracted from Framer)

Colors:

* Brand/CTA: #D84A29
* Text/Ink: #181818
* White: #FFFFFF
* Ink dark: #171616
* Cream: #FFFCF3
* Muted: #575757

Fonts:

* Aileron: self-hosted woff2 in public/fonts/ — Regular (400), SemiBold (600), Bold (700), Light (300)
* Figtree: Google Fonts — CTA button and UI elements only

Nav links: Aileron SemiBold 16px, color #181818

CTA button: bg #171616, hover bg #D84A29 (transition 0.2s), Figtree Medium 15px, radius 12px

Breakpoints:

* Mobile: ≤809px — hamburger nav
* Tablet: 810px–1399px — hamburger nav
* Desktop: ≥1400px — full inline nav

Container: max-width 1600px

Type scale:

* H1: 80px / 80px
* H2: 60px / 68px
* H3: 44px / 52px
* H4: 32px / 40px
* H5: 24px / 32px
* Body: 24/20/16/14px

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
Nav links: Home, About, Community, Blog, Resources
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

Milestone 2 — Homepage (A+C structure)

The homepage uses an emotional/narrative + journey-based structure. This is NOT a copy of Savar’s reference or the Framer site. It is original.

Each section is a standalone component in src/components/sections/, imported into src/pages/index.astro in this order:

Status:

* ✅ Hero — Hero.astro
* ✅ Problem — Problem.astro
* ✅ Partners — Partners.astro
* ✅ Journey — Journey.astro
* ✅ ProductOverview — ProductOverview.astro
* ✅ FAQ — FAQ.astro
* ✅ CTABand — CTABand.astro

⸻

Hero section

Copy (confirmed, do not change until Savar meeting Friday):

* H1: “The all-in-one newcomer settlement app”
* Subtext: “Unify makes settling in Canada simpler, clearer, and more connected”
* “No credit card required” below App Store badge

App Store badge: /assets/app-store-badge-en.svg → https://apps.apple.com/ca/app/unify-newcomer-support/id6754875762 new tab, height 52px

Creative direction — DO NOT copy Savar’s layout:

* The hero layout, animation, and visual treatment must be original
* The hero must feel premium and human — not generic SaaS
* CSS animations only — no Framer Motion, no motion/react, no JS animation libraries
* Phone mockup: /assets/screenshots/learn-hero.avif

Current implementation notes:

* Left-aligned headline with asymmetric composition
* Phone mockup breaks subtly into the Problem section on desktop
* Eyebrow removed
* Decorative blobs removed
* The goal is subtle breakout, not dramatic overlap
* Do NOT reintroduce earlier exploratory hero ideas unless explicitly requested

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

Native HTML <details>/<summary> — zero JS required.
Background: var(--color-cream). Full-width bordered rows, +/× icon on right (CSS only via details[open]), expands inline.

Questions and answer wording sourced from Framer (exact copy — do not rewrite):

1. What is Unify Social?
2. Who is Unify Social best for?
3. How do I connect with other immigrants on Unify Social?
4. What workshops does Unify Social offer, and how can I join one?
5. Is Unify Social free to use?

Answers use rich HTML (multi-paragraph, <ul> lists, <strong> sub-headings) rendered via set:html.
List items use * prefix via CSS ::before — do not use actual <ul> bullets.
Answer copy is verbatim from Framer screenshots — do not paraphrase or shorten.

⸻

CTA band section

* Background: #ffffff (white) — NOT dark ink
* Headline: “Take the guesswork out of your newcomer journey with the full Unify experience.”
  — First part (“Take the guesswork…journey with”) in var(--color-text) dark
  — “the full Unify experience.” wrapped in <span class=”cta-emphasis”> in var(--color-muted) grey, with “Unify” in <em> italic
* Subtext: “Be the first to experience Unify and shape the future of newcomer support in Canada” — muted grey, centered
* Large brand-red full-width button: “Download the App Now” → https://apps.apple.com/ca/app/unify-newcomer-support/id6754875762
* Fade-up on scroll via IntersectionObserver (same pattern as Problem.astro)

⸻

Rules for all sections

* No React, no animation libraries, no Framer Motion
* CSS animations only — Intersection Observer inline script where scroll-triggered fade is needed
* No arbitrary Tailwind values — add tokens to @theme
* Semantic HTML throughout (<section>, <h2>, etc.)
* Build one section at a time, verify with npm run build before moving to next
* Use Playwright to screenshot after each section is built
```
