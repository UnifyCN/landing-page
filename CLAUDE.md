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

```
src/
├── pages/
│   ├── index.astro
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
    ├── fonts/          # Aileron woff2 files
    ├── images/
    └── assets/         # Copied from Savar's branch
        ├── logo/
        ├── screenshots/
        ├── blobs/
        ├── illustrations/
        ├── images/
        ├── app-store-badge.svg
        └── phone-learn.avif
```

---

## Code Quality

- Keep diffs focused
- Only modify relevant files
- Avoid unrelated refactors
- Keep components readable
- Keep naming clean

---

## Default Workflow

1. Explain understanding
2. Propose plan
3. Implement
4. Verify
5. Summarize changes

---

## When to Push Back

Push back if:

- unnecessary complexity
- unclear requirements
- CMS misuse
- breaking visual fidelity
- over-engineering
- bad SEO practices
- mobile layout decisions are being made silently without flagging

---

## Key Principle

This is a **content-heavy, interaction-light site**.

Preserve:

- low JS
- fast load
- strong SEO

Do not code against Astro's strengths.

---

## Decisions Log

### Design Tokens (extracted from Framer)

**Colors:**

- Brand/CTA: `#D84A29`
- Text/Ink: `#181818`
- White: `#FFFFFF`
- Ink dark: `#171616`
- Cream: `#FFFCF3`

**Fonts:**

- Aileron: self-hosted woff2 in `public/fonts/` — Regular (400), SemiBold (600), Bold (700), Light (300)
- Figtree: Google Fonts — CTA button and UI elements only

**Nav links:** Aileron SemiBold 24px, line-height 40px, letter-spacing -0.02em, color #181818

**CTA button:** bg #D84A29 (navbar) / #171616 (pill CTA), Figtree Medium 24px, letter-spacing -0.04em, radius 6px, padding 9px 13px

**Breakpoints:**

- Mobile: ≤809px — hamburger nav
- Tablet: 810px–1399px — hamburger nav
- Desktop: ≥1400px — full inline nav

**Container:** max-width 1600px, no horizontal padding on outer wrapper

**Type scale:**

- H1: 80px / 80px
- H2: 60px / 68px
- H3: 44px / 52px
- H4: 32px / 40px
- H5: 24px / 32px
- Body sizes: 24/20/16/14px with matching line heights

### Site Shell Decisions

**Logo behavior:** Logo is NOT a link. Plain `<div>`. Do not wrap in `<a>`.

**Logo asset:** `/assets/logo/logo-with-name.png` — used in Navbar pill and mobile overlay

**CTA button URL:** "Download Unify" → `https://apps.apple.com/ca/app/unify-newcomer-support/id6754875762` — opens new tab

**Navbar style:** Floating white pill, `position: sticky`, `top: 20px`, solid `#ffffff` background (no frosted glass), border `1px solid rgba(0,0,0,0.08)`, border-radius 18px. On scroll: shadow deepens via `.is-scrolled` class toggled by inline script.

**Nav links:** Home, About, Community, Blog, Resources. Hover = red underline grows from center.

**Footer dark band:** Removed entirely. No marquee, no animation, no dark section.

**Footer structure:**

- White background throughout
- Bold heading with 3px brand-red left border: "Unify," / "Your journey to Canada, _simplified._"
- Two-column body: left = full brand description, right = Pages + Socials
- Bottom bar: `© 2026 – Unify Social` as blue link to unifysocial.ca

**Footer section labels:** "Pages" and "Socials"

**Footer social URLs:**

- Instagram: https://www.instagram.com/unifysocial.ca/
- Facebook: https://www.facebook.com/p/Unify-Social-61570879043328/
- LinkedIn: https://www.linkedin.com/company/unify-social/posts/?feedView=all
- Twitter: https://x.com/unifysocialca

**All links styling:** `text-blue-600 hover:underline` for both Pages and Socials

**Dark mode:** Out of scope.

### Assets

- All assets copied from Savar's static branch into `public/assets/`
- Logo with wordmark: `/assets/logo/logo-with-name.png`
- Logo SVG mark only: `/assets/logo/unify-logo.svg`
- Phone mockup: `/assets/phone-learn.avif`
- App Store badge: `/assets/app-store-badge.svg`
- App screenshots: `/assets/screenshots/`
- Decorative blobs: `/assets/blobs/`

### Completed — Milestone 1 (Site Shell)

- ✅ Astro 6 + Cloudflare Workers adapter configured
- ✅ Tailwind v4 with full `@theme` token set in `global.css`
- ✅ Aileron self-hosted, Figtree via Google Fonts
- ✅ `BaseLayout.astro` with head, fonts, Navbar, Footer
- ✅ `Navbar.astro` — floating pill, sticky, scroll behavior, hamburger mobile
- ✅ `Footer.astro` — full rebuild with exact copy and correct styling
- ✅ Pages: index, about, community, contact, blog/index, blog/[slug]
- ✅ Sanity lib stubs created
- ✅ Build clean on Cloudflare Workers adapter

### Next — Milestone 2 (Homepage Sections)

Build `src/pages/index.astro` section by section, each as a component in `src/components/sections/`.

Order:

1. Hero — headline, subtext, App Store button, phone mockup image
2. Features — Checklist, Learn, AI Companion, Community (from Framer)
3. FAQ — accordion (needs small JS island)
4. CTA band — "Download the App Now"

For each section:

1. Inspect unifysocial.ca for exact values
2. Extract tokens → add to `@theme`
3. Build as static component first
4. Compare visually
5. Flag mobile gaps
