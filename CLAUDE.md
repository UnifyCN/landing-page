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

- Framer project = design source
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
5. Compare visually against live Framer site
6. Flag any mobile layout gaps where Framer has no design

Goal = visually indistinguishable from Framer output

---

## Project Structure

```
src/
├── pages/
│   ├── index.astro
│   ├── about.astro
│   └── [...slug].astro
├── layouts/
│   └── BaseLayout.astro        # <head>, nav, footer, global styles
├── components/
│   ├── ui/                     # shadcn primitives
│   ├── sections/               # page sections (Hero, Features, CTA…)
│   └── common/                 # Navbar, Footer, SEO
├── lib/
│   ├── sanity/
│   │   ├── client.ts
│   │   ├── queries.ts
│   │   └── types.ts
│   └── utils.ts
├── styles/
│   └── global.css              # Tailwind v4 @theme block
└── public/
```

Keep it simple. Do not add directories speculatively.

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

## Milestone 1 (Setup — Before Any Pages)

- [ ] Astro 6 project initialised with Cloudflare Workers adapter
- [ ] Tailwind v4 configured, `@theme` populated from Framer design audit
- [ ] `BaseLayout.astro` with correct `<head>`, meta, font loading
- [ ] `Navbar` and `Footer` built (appear on every page)
- [ ] Sanity client connected, one test query working
- [ ] Deployed to Cloudflare Workers (even if page is empty)

Deploy on day one. Discovering adapter incompatibilities late is expensive.

---

## Key Principle

This is a **content-heavy, interaction-light site**.

Preserve:

- low JS
- fast load
- strong SEO

Do not code against Astro's strengths.
