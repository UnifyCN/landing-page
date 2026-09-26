# DESIGN.md - Unify landing page: Events (/events, /events/[id])

> Status: approved (direction B, building)
> Last updated: 2026-09-25

## Job

**User:** A newcomer in Metro Vancouver (often weeks or months after arrival, often on a phone, often reading in a second language) who wants to learn something practical or meet people.

**Situation:** They arrive from the nav, the footer, search ("free events for newcomers vancouver"), or a link from the app. They do not know which organizations run what.

**Job to be done:** Find one upcoming, free, relevant event and get to its registration page with enough confidence to show up.

**Success evidence:** From page load, a user can (a) see a featured event above the fold on desktop and within one scroll on mobile, (b) narrow partner events by topic or partner in one tap, (c) open an event and reach the source registration link in two clicks. Measured later with PostHog (card click-through, register-CTA clicks).

## Scope

**In:** `/events` hub (header, featured, partner events + filters, sidebar calendar + partners), `/events/[id]` detail, empty/loading-free SSR states, past-event detail state.

**Out:** RSVP, accounts, add-to-calendar (later), event search box, pagination by page number, the archived `/community` page, Find Services.

## Source constraints

- Brand: `CLAUDE.md` "Design System" + `src/styles/global.css` `@theme` — Aileron (display/body), Figtree (CTA/UI), brand red `#D84A29`, ink `#171616`, white page, global grain, `--ease-out`. Web-app orange `#f68b26` is excluded (Savar, 2026-09-25).
- House patterns to extend: dark hero with eyebrow + oversized display H1 + brand-red accent (`PartnersHero`, `resources.astro` hero); red pill chip filters (`/resources`, `/blog`); stats row with dividers (`PartnersHero`).
- Card anatomy from the web app `components/community/EventCard.tsx`: 16:9 cover, date badge on the image, title, badges (type, genre), host / date / location rows with icons. Styled in landing brand, not copied.
- Data: Supabase `public.events` (public read). `is_featured` (team-picked, any host), `partner_slug` (landing partner slug; only these rows appear in Partner events). Times in `America/Vancouver`. Genres: Language, Employment, Socials, Education, Finance, Housing, Health, Documentation, Family (+ Uncategorized, never shown as a tag).
- Tailwind v4 rules: no arbitrary values; add tokens to `@theme`. Islands only for filters + calendar, bound via `astro:page-load` with a `data-*-bound` guard.
- Responsive 320–1920 continuously; no dark mode.

## Current decisions

- Header uses photo 1 (`public/assets/images/community/newcomer-community-vancouver`) as the background.
- Copy from the Web Design Proposal doc: H1 "Free Events for Newcomers in Canada"; the description; section intros.
- Stats: 35+ events hosted, 450+ newcomers joined, 18 community partners, Free (confirmed by Savar).
- Featured = `is_featured`, shown first with a distinct featured treatment. Partner events = `partner_slug is not null`.
- Filters: genre + partner. Sidebar: month calendar (dots on event days; a day click filters) + partner list linking to `/partners/[slug]`.
- Card click opens `/events/[id]`; the detail page CTA opens the source registration link in a new tab.
- Host line reads "Department · Partner" (e.g. "International Services for Students · SFU"), collapsed to one name when they match.

## Content and hierarchy

1. What this is and that it is free (H1, description, stats).
2. The team's picks (featured).
3. The full partner list, filterable, with the calendar as a date lens.
4. Which organizations run these (partner list) — trust.

## Visual language

**Direction:** Agenda (D-001 in `.design/decisions.md`). The header photo fades into an ink band that carries the featured picks as three tall cards with a red top edge and a "Featured" pill. Below, on white, partner events read as an agenda: group headings (This week / Next week / month) that stick under the navbar, a large day numeral + red weekday column, and horizontal cards (cover left, details right). The sticky sidebar calendar marks event days and filters to one day. Editorial, warm, human; photography over illustration; red used for accent and state, never as a large fill behind text blocks.

**Typography:** Aileron display for H1/H2/card titles with `--tracking-display`/`--tracking-tight`; Figtree for chips, badges, buttons.

**Color:** White content surface; ink hero; brand red for eyebrow, active chip, featured marker, calendar selection. Genre tags neutral (ink on warm grey) — no per-genre rainbow.

**Spacing and density:** Balanced. Cards breathe; list stays scannable at ~50 events.

**Imagery and iconography:** Event cover photos (source, Pexels or Unsplash) at 16:9 with a neutral placeholder when missing. Inline 1.5-stroke line icons matching the navbar SVGs.

**Motion:** Card hover lift of 3px, chip press, dropdown fade. No scroll reveals on this page (content is the list; nothing should hide it). All off under `prefers-reduced-motion`, including the smooth scroll after a calendar pick.

## Behavior and states

- Filters and calendar combine (AND). Active filters are reflected in the URL query (`?genre=&partner=&day=`) so links are shareable; canonical stays `/events`. Chips that would lead to zero results are dimmed.
- Empty filtered result: plain message + "Clear filters".
- No featured events: the featured section is hidden, not shown empty.
- Past event on `/events/[id]`: stays reachable, "This event has ended" state, `noindex`, links to upcoming events.
- Missing cover image: branded neutral placeholder.

## Responsive and accessibility

- Below 1100px the sidebar stacks **above** the list (DOM order = visual order). At ≤700px the calendar folds to a one-line "Pick a date" disclosure and the partner list is hidden, so events start within the first screen; chips become one swipeable row per filter. Touch targets ≥44px for calendar nav and phone chips; navbar caret ≥24px.
- Calendar: labelled day buttons for event days only, one Tab stop per month (roving tabindex); Left/Right = previous/next event day, Up/Down = nearest event day a week away, Home/End = first/last in month, crossing months flips the grid.
- Every card is one link with a single accessible name; badges are text.
- Contrast AA: small grey text uses `--color-events-faint` (#6b6763, 5.6:1 on white); hero text ≥4.5:1 per glyph at 320–1920 (phone scrim is a flat top-down gradient).

## Tokens and components

- Tokens: `src/styles/global.css` `@theme`. New tokens (if any) are added there.
- Reuse: `BaseLayout`, `CTABand`, chip pattern from `/resources`.

## What this is not

- Not the reference HTML's look: no cream page background, no four-colour category system, no dropdown-select filter bar, no Poppins/Inter.
- Not the web app: no orange, no app chrome.
- Not a dense directory table.

## Acceptance criteria

- [ ] Featured and partner events render from live Supabase data with correct Pacific times.
- [ ] Genre, partner and calendar filters combine and survive a View Transition navigation (binding guard + spec).
- [ ] `/events/[id]` shows full info and a working register CTA; past-event state renders.
- [ ] No layout break or horizontal scroll at any width 320–1920 (continuous resize evidence).
- [ ] One H1 per page; `Event` JSON-LD on detail pages; title/description set.

## Open decisions

- None.
