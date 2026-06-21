# Homepage "WEB + MOBILE" platform band — design spec

**Date:** 2026-06-20
**Status:** Approved direction, pending spec review
**Author:** Claude (brainstormed with Savar)

## Problem

Unify just launched a public web app at `app.unifysocial.ca`, alongside the existing
iOS app. The homepage still frames Unify as a **mobile-only app**: the hero reads
"The all-in-one newcomer settlement app", its only CTA is the App Store badge, and the
SEO/JSON-LD declares a single iOS `MobileApplication`. New visitors can't tell there's a
web app they can use instantly in the browser — no download required.

## Goal

Reposition the homepage as **one platform across web + mobile** without a full redesign.
The centerpiece is a new dedicated band — "One platform. Every device." — placed directly
above the Core Features section, carrying the platform story with a device-cluster visual
and two equal CTAs (web app + App Store). Supporting copy/meta tweaks make the hero and
SEO honest about web+mobile.

Out of scope (deliberately deferred): reworking the hero visual, swapping the
feature-section videos, and any change to About/FAQ/other pages. The feature section's
structure and copy are fine as-is.

## Decisions (locked with user)

- **CTA model:** two equal CTAs (web app button + App Store badge), no hierarchy.
- **Scope:** new band + light hero copy retune + homepage meta/JSON-LD. Feature videos untouched.
- **Device cluster screens:** browser frame shows the **Social feed** (web); phone shows the
  **Learn** screen (reusing the existing clean framed phone asset). Two different surfaces =
  breadth, and avoids needing a new mobile screenshot.

## Architecture

Three focused changes, each independently understandable and testable:

### 1. New component — `src/components/sections/PlatformBand.astro`

A self-contained section. No props. Server-rendered HTML + scoped `<style>` + one small
`<script>` for the scroll-reveal (wired via `astro:page-load`, the project's required
pattern). Imported in `src/pages/index.astro` **between `<Partners />` and `<Journey />`**.

**Structure**

```
section.platform
  └─ div.platform-card               (cream rounded card, max-width container)
       ├─ div.platform-text
       │    ├─ span.platform-eyebrow   "WEB + MOBILE"   (brand-red, uppercase, tracked)
       │    ├─ h2.platform-heading      "One platform. Every device."
       │    ├─ p.platform-desc          (body copy, below)
       │    └─ div.platform-cta-row
       │         ├─ a.platform-btn       "Launch web app →"  → app.unifysocial.ca
       │         └─ a.platform-badge-link <App Store badge img>
       └─ div.platform-visual          (device cluster)
            ├─ div.platform-browser     (chrome bar + web Social screenshot)
            │    ├─ div.browser-bar  (3 traffic-light dots + URL pill "🔒 app.unifysocial.ca")
            │    └─ img.browser-shot (Social feed web screenshot, object-fit cover, top)
            └─ img.platform-phone       (clean framed Learn phone, overlapping bottom-right)
```

**Copy (final):**
- Eyebrow: `WEB + MOBILE`
- Heading: `One platform. Every device.`
- Body: `Start on your laptop, continue on your phone. Your checklist, lessons, and community circle stay in sync wherever you are — one free account across web and mobile.`
- Primary CTA label: `Launch web app` + `→`
- Secondary CTA: App Store badge image (existing `/assets/app-store-badge-en.svg`)

**Styling (design-system aligned — no arbitrary Tailwind values, scoped CSS like sibling sections):**
- Card background: warm cream in the existing family (`#f3ecd9` / `#f5eeda`); radius ~30px
  (sibling `feature-card` uses 28px); fluid padding via `clamp()`; soft elevation + faint top
  inset highlight. The card is the only colored element on an otherwise white stretch
  (Partners marquee above, white Journey below) — good rhythm.
- Eyebrow: `var(--color-brand)`, `var(--tracking-label)`, uppercase, Aileron 600, small.
- Heading: `var(--font-display)`, 700, `clamp(2rem, 4.6vw, 3rem)`, `var(--tracking-tight)`,
  `var(--color-text)`. Two sentences with periods, per mockup.
- Body: `var(--font-display)`, 400, ~1.0625rem, `var(--color-muted)`, max-width ~40ch.
- `.platform-btn`: solid `var(--color-ink)` (#171616), white text, `font-ui` (Figtree) per the
  "CTA buttons use Figtree" rule, radius `var(--radius-cta)` (12px), height matched to the
  badge (~52px), arrow nudges on hover, background → `var(--color-brand)` on hover (mirrors the
  navbar "Download Unify" CTA). Opens `https://app.unifysocial.ca` in the **same tab**
  (app-like primary conversion). `rel="noopener"` not required for same-tab, but harmless.
- `.platform-badge-link`: identical treatment to the hero badge link (hover lift + drop-shadow),
  badge height ~52px so both CTAs read as equal weight. Opens App Store in a new tab.

**Device cluster mechanics (the fiddly part — get it right at every width):**
- `.platform-card` keeps `overflow: visible` so the phone can overhang its bottom edge.
  The cream background + radius live on the card; only the **browser window** clips its own
  screenshot (`overflow: hidden`, radius ~12–14px).
- `.platform-browser`: a rounded panel; top `.browser-bar` (~36px) holds three 11px traffic
  dots (`#ff5f57 / #febc2e / #28c840`) left-aligned and a centered URL pill (hairline border,
  small lock glyph + `app.unifysocial.ca` in muted Aileron). Below it, `.browser-shot` fills
  the content area, `object-fit: cover; object-position: top left` so the feed + sidebar read
  well after edge-cropping the screenshot's whitespace margins. Soft shadow under the window.
- `.platform-phone`: `position: absolute`, anchored bottom-right of the visual, ~38–42% of the
  browser width, `z-index` above the browser, drop-shadow matching the hero phone. Overhangs
  the card's bottom edge slightly for depth (as mocked).
- **Responsive:**
  - Desktop (≥1400) / tablet (≥810): 2-col grid `text | visual`; cluster as above.
  - Mobile (≤809): single column, text then visual; the browser window scales to full card
    width; the phone shrinks and tucks to the bottom-right with reduced/removed overhang so
    nothing overflows the viewport. Verify continuously 320–1920px (per the responsive rule):
    no overflow, no awkward overlap, URL pill never wraps, CTAs wrap gracefully.
  - `prefers-reduced-motion`: no reveal transform; static render.

**Scroll-reveal (interactive island — follows the View-Transition re-binding rules):**
- CSS: elements start hidden only under a JS-gated class (`body.js-ready .platform ...`),
  reveal on `.visible` — same progressive-enhancement pattern as `Journey.astro`, so static/
  no-JS render shows full content.
- JS: `initPlatformBand()` registered with `document.addEventListener("astro:page-load", …)`;
  guard with `data-platform-bound` on the section root so it doesn't double-bind on initial
  load or re-bind stale DOM on View-Transition nav. Single IntersectionObserver,
  `unobserve` after reveal.

### 2. Hero copy retune — `src/components/sections/Hero.astro`

- H1: `The all-in-one newcomer settlement app` → `The all-in-one newcomer settlement platform`.
  Stays a single plain-string H1 (no styled spans), per the Hero rules. Verify the longer word
  still balances at the `clamp()` sizes across widths.
- Add a secondary text link in/after `.hero-cta-row`: `or open the web app →` →
  `https://app.unifysocial.ca` (same tab). Small, muted, sits with the existing
  "No credit card required" note. The App Store badge stays the hero's primary CTA — the band
  owns the strong dual-CTA, so the hero only needs a lightweight web pointer.
- Hero phone visual unchanged.

### 3. SEO / structured data — `src/pages/index.astro` + `src/lib/seo/`

- **Read `docs/seo-retro.md` first** (required by CLAUDE.md before touching SEO).
- `index.astro` `description`: remove "app"-only framing; state web + iOS. Draft:
  `The all-in-one platform for settling in Canada — on web and iOS. Personalized checklists,
  AI guidance, lessons, and a community of 250+ newcomers.` (keep ≤ ~160 chars).
- JSON-LD: keep the existing `mobileAppLd()` (iOS `MobileApplication`) and **add** a new
  `webAppLd()` → `src/lib/seo/webAppLd.ts`: a `WebApplication` with
  `applicationCategory: 'EducationApplication'`, `browserRequirements: 'Requires JavaScript.'`,
  `url`/`installUrl` = `https://app.unifysocial.ca`, free `offers`. Export from
  `src/lib/seo/index.ts`; emit its serialized block in `index.astro`'s `head` slot next to the
  existing two. This declares both surfaces accurately rather than mangling `operatingSystem`.

## Assets

- **Browser screenshot:** `.design-staging/web-screens/social-feed.png` (1247×1091) → crop the
  outer whitespace margins, resize to a tidy width (~1200px), AVIF-encode via `sharp`
  (`quality 55`, matching `scripts/convert-images.mjs`) → `public/assets/screenshots/web/social-feed.avif`.
  Referenced directly as `<img src=".avif">` (consistent with the hero's direct-AVIF usage).
- **Phone:** reuse existing `public/assets/screenshots/learn-hero.avif` (clean framed Learn
  phone, already on the homepage + preloaded). No new asset.
- The other staged web screenshots (`learn-dashboard`, `checklist`, `ai-companion`) are kept in
  `.design-staging/` for a possible later feature-section pass; not used now.
- `.design-staging/` is scratch — add to `.gitignore` (or delete after the social AVIF is
  committed) so raw clipboard PNGs and thumbnails don't land in the repo.

## Testing

Per the project rule (new interactive island ⇒ add/update a spec). Add a lean Playwright case
(in `tests/`, alongside the existing smoke specs):
- Homepage renders `section.platform` with the heading, both CTAs (web link href =
  `app.unifysocial.ca`, App Store badge present), and the device-cluster images.
- Binding guard: after load, the section root carries `data-platform-bound`; after a
  View-Transition nav away and back, it's still present exactly once (the re-binding bug class).
- No network (Turnstile/Resend untouched).

Plus the standard gates: `npm run build` clean; continuous resize check 320–1920px; existing
e2e suite still green.

## Verification per step

1. `PlatformBand.astro` built + imported → verify: `npm run build` clean; band renders between
   Partners and Journey; matches mockup at desktop/tablet/mobile; resize 320–1920 shows no
   overflow/overlap; reveal fires once and survives a View-Transition nav.
2. Hero copy retune → verify: H1 reads "…platform" and balances at all widths; "open the web
   app →" link works; hero visual/animations unchanged.
3. SEO/meta → verify: description updated; three JSON-LD blocks present and valid
   (Rich Results / schema validator); no console errors.
4. Asset pipeline → verify: `social-feed.avif` exists, is reasonably sized (≪ source), renders
   crisp in the browser frame; `.design-staging` not committed.
5. Test → verify: new Playwright case passes; `npm run test:e2e` green.

## Risks / notes

- **Overhang clipping:** the phone overhang requires `overflow: visible` on the card while the
  browser window clips its own screenshot — the one structural subtlety; get the layering/z-index
  right so the cream radius still clips its background but the phone escapes.
- **Backdrop-filter cost:** do NOT add blur/backdrop-filter to the cluster — the navbar already
  owns the page's blur budget (documented lag history). Drop-shadows only.
- **Same-tab web CTA** is a deliberate choice (primary conversion, app-like). Easy to flip to
  new-tab if preferred.
