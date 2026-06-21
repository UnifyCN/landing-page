# Homepage WEB + MOBILE Platform Band — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition the homepage from "a mobile app" to "one platform across web + mobile" by adding a dedicated "One platform. Every device." band above Core Features, plus light hero-copy and SEO retunes.

**Architecture:** One new self-contained Astro section component (`PlatformBand.astro`) imported into the homepage between `<Partners />` and `<Journey />`; a one-line hero headline change + a small web-app link in `Hero.astro`; and an additive `WebApplication` JSON-LD block + meta-description tweak in `index.astro` / `src/lib/seo/`. No new dependencies, no framework JS — server-rendered HTML + scoped CSS + one tiny `astro:page-load` island for the scroll-reveal.

**Tech Stack:** Astro 6 (`output: 'server'`, prerendered homepage, ClientRouter View Transitions), Tailwind v4 design tokens in `@theme` (used via scoped `<style>`), `sharp` for AVIF asset generation, Playwright for the smoke test.

## Global Constraints

Copied from the spec and `CLAUDE.md`. Every task implicitly includes these.

- **Branch:** work on `feat/homepage-web-mobile-band` (already checked out). Commit per task.
- **No arbitrary Tailwind values.** The band uses scoped `<style>` (like `Hero.astro` / `Journey.astro`) referencing existing `@theme` tokens. Do NOT add a `tailwind.config.js`.
- **Design tokens (verbatim):** brand-red `var(--color-brand)` = `#D84A29`; ink `var(--color-ink)` = `#171616`; text `var(--color-text)` = `#181818`; muted `var(--color-muted)` = `#575757`; `var(--radius-cta)` = `12px`; `var(--tracking-label)` = `0.08em`; `var(--tracking-tight)` = `-0.04em`; `var(--tracking-cta)` = `-0.04em`; `var(--ease-out)` = `cubic-bezier(0.23, 1, 0.32, 1)`.
- **Fonts:** display/body = `var(--font-display)` (Aileron); CTA buttons/UI = `var(--font-ui)` (Figtree). The "Launch web app" button MUST use `var(--font-ui)`.
- **DOM binding rule:** any code that binds at load MUST register via `document.addEventListener("astro:page-load", fn)` (NOT module top-level) and guard with a data-attribute (`data-platform-bound`) so it never double-binds on initial load or stale-binds after a View Transition.
- **Scroll-reveal rule:** never set `opacity: 0` without a JS-gated selector. Hidden state is gated behind `.platform[data-platform-bound="true"]` so the static/no-JS render shows full content. Do NOT use `animation-fill-mode: both` with delay.
- **No backdrop-filter / blur** anywhere in the band — the navbar owns the page's blur budget (documented lag history). Drop-shadows only.
- **Responsive 320–1920px, non-negotiable:** no overflow, awkward wraps, cropped content, or unreadable type at any width. Verify by continuous resize, not just 3 breakpoints.
- **Homepage stays prerendered** (`export const prerender = true` already in `index.astro` — do not remove).
- **New interactive island ⇒ add/update its spec.** The band's guard attribute is `data-platform-bound`; add `tests/platform-band.spec.ts`.
- **Before any SEO edit:** read `docs/seo-retro.md` (required by `CLAUDE.md`).
- **AVIF generation:** use `sharp` (the repo's tool, see `scripts/convert-images.mjs`), quality ~55–60.
- **Build gate:** `npm run build` must pass clean after each task.

### Canonical constants (reused across tasks — copy verbatim)

- Web app URL: `https://app.unifysocial.ca`
- App Store URL: `https://apps.apple.com/ca/app/unify-newcomer-support/id6754875762`
- App Store badge asset: `/assets/app-store-badge-en.svg`
- Reused phone asset (clean framed Learn screen): `/assets/screenshots/learn-hero.avif`
- New browser screenshot asset: `/assets/screenshots/web/social-feed.avif`

---

## Task 1: Generate the Social-feed browser screenshot asset

**Files:**
- Create: `public/assets/screenshots/web/social-feed.png` (trimmed/resized source original)
- Create: `public/assets/screenshots/web/social-feed.avif` (delivered asset)
- Source (gitignored scratch, already present): `.design-staging/web-screens/social-feed.png` (1247×1091)

**Interfaces:**
- Produces: `public/assets/screenshots/web/social-feed.avif`, referenced by the `PlatformBand.astro` browser frame in Task 2.

- [ ] **Step 1: Create the output directory**

Run:
```bash
mkdir -p public/assets/screenshots/web
```

- [ ] **Step 2: Write the one-off generation script (scratch, not committed)**

Create `.design-staging/gen-band-asset.mjs`:
```js
import sharp from "sharp";

const SRC = ".design-staging/web-screens/social-feed.png";
const OUT_DIR = "public/assets/screenshots/web";

// .trim() removes the uniform white margin around the screenshot, cropping to
// the content bounding box (feed + sidebar). Then downscale to a tidy 1200px
// width and emit a PNG original + an AVIF sibling (matches scripts/convert-images.mjs).
const trimmed = sharp(SRC).trim().resize({ width: 1200, withoutEnlargement: true });

await trimmed.clone().png().toFile(`${OUT_DIR}/social-feed.png`);
await sharp(`${OUT_DIR}/social-feed.png`)
  .avif({ quality: 60, effort: 4 })
  .toFile(`${OUT_DIR}/social-feed.avif`);

console.log("Wrote social-feed.png + social-feed.avif to", OUT_DIR);
```

- [ ] **Step 3: Run it**

Run:
```bash
node .design-staging/gen-band-asset.mjs
```
Expected: `Wrote social-feed.png + social-feed.avif to public/assets/screenshots/web`

- [ ] **Step 4: Verify the outputs exist and are reasonably sized**

Run:
```bash
ls -la public/assets/screenshots/web/
sips -g pixelWidth -g pixelHeight public/assets/screenshots/web/social-feed.avif
```
Expected: both files present; AVIF width 1200px (or source width if smaller); AVIF noticeably smaller than the PNG.

- [ ] **Step 5: Eyeball the AVIF**

Run:
```bash
sips -s format png -Z 700 public/assets/screenshots/web/social-feed.avif --out /tmp/social-check.png
open /tmp/social-check.png
```
Verify: the Social feed (posts + right sidebar with the green card and National News) reads clearly, no over-aggressive crop from `.trim()`, no obvious compression mush. If `.trim()` cropped too tightly or left a wide white band, adjust by replacing `.trim()` with `.trim({ threshold: 20 })` (more aggressive) and re-run Step 3.

- [ ] **Step 6: Commit**

```bash
git add public/assets/screenshots/web/social-feed.png public/assets/screenshots/web/social-feed.avif
git commit -m "assets: add Social-feed web screenshot for platform band (png + avif)"
```

---

## Task 2: Build `PlatformBand.astro` and wire it into the homepage

**Files:**
- Create: `src/components/sections/PlatformBand.astro`
- Modify: `src/pages/index.astro` (add import + place `<PlatformBand />` between `<Partners />` and `<Journey />`)
- Create (test): `tests/platform-band.spec.ts`

**Interfaces:**
- Consumes: `/assets/screenshots/web/social-feed.avif` (Task 1); `/assets/screenshots/learn-hero.avif` (existing); `/assets/app-store-badge-en.svg` (existing).
- Produces: `<section class="platform" data-platform-bound="true">` containing `a.platform-btn` (href `https://app.unifysocial.ca`), `.platform-badge`, `.browser-shot`, `.platform-phone`, `.platform-heading`. These selectors are relied on by the spec in this task.

- [ ] **Step 1: Write the failing Playwright spec**

Create `tests/platform-band.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

// The platform band is an interactive island (scroll-reveal wired via
// astro:page-load, guarded by data-platform-bound). Guards both the render
// contract and the View-Transition re-binding bug class.
test.describe("WEB + MOBILE platform band", () => {
  test("renders on the homepage with heading, both CTAs, and the device cluster", async ({
    page,
  }) => {
    await page.goto("/");
    const band = page.locator("section.platform");
    await expect(band).toBeVisible();
    await expect(band).toHaveAttribute("data-platform-bound", "true");
    await expect(band.locator(".platform-heading")).toContainText("One platform");

    // Two equal CTAs: web app link → app.unifysocial.ca, + App Store badge.
    await expect(band.locator("a.platform-btn")).toHaveAttribute(
      "href",
      "https://app.unifysocial.ca",
    );

    // Bring the band into view so the reveal adds .visible (opacity:1) before
    // asserting descendant image visibility.
    await band.scrollIntoViewIfNeeded();
    await expect(band.locator(".platform-badge")).toBeVisible();
    await expect(band.locator(".browser-shot")).toBeVisible();
    await expect(band.locator(".platform-phone")).toBeVisible();
  });

  test("re-binds after a View Transition navigation back to home", async ({ page }) => {
    await page.goto("/about");
    await page.locator("a.nav-link", { hasText: "Home" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("section.platform")).toHaveAttribute(
      "data-platform-bound",
      "true",
    );
  });
});
```

- [ ] **Step 2: Run the spec to verify it fails**

Run:
```bash
npm run test:e2e -- platform-band
```
Expected: FAIL — `section.platform` not found (the component doesn't exist yet).

- [ ] **Step 3: Create the component**

Create `src/components/sections/PlatformBand.astro`:
```astro
---
const WEB_APP_URL = "https://app.unifysocial.ca";
const APP_STORE_URL =
  "https://apps.apple.com/ca/app/unify-newcomer-support/id6754875762";
---

<section class="platform">
  <div class="platform-inner">
    <div class="platform-card">
      <div class="platform-text">
        <span class="platform-eyebrow">Web + Mobile</span>
        <h2 class="platform-heading">One platform.<br />Every device.</h2>
        <p class="platform-desc">
          Start on your laptop, continue on your phone. Your checklist, lessons,
          and community circle stay in sync wherever you are &mdash; one free
          account across web and mobile.
        </p>
        <div class="platform-cta-row">
          <a href={WEB_APP_URL} class="platform-btn">
            Launch web app
            <span aria-hidden="true">&rarr;</span>
          </a>
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            class="platform-badge-link"
            aria-label="Download Unify on the App Store"
          >
            <img
              src="/assets/app-store-badge-en.svg"
              alt="Download on the App Store"
              class="platform-badge"
            />
          </a>
        </div>
      </div>

      <div class="platform-visual">
        <div class="platform-browser" aria-hidden="true">
          <div class="browser-bar">
            <span class="browser-dot" style="background:#ff5f57"></span>
            <span class="browser-dot" style="background:#febc2e"></span>
            <span class="browser-dot" style="background:#28c840"></span>
            <span class="browser-url">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm3 8H9V6a3 3 0 016 0v3z" />
              </svg>
              app.unifysocial.ca
            </span>
          </div>
          <div class="browser-shot-wrap">
            <img
              src="/assets/screenshots/web/social-feed.avif"
              alt="Unify web app — community Social feed at app.unifysocial.ca"
              class="browser-shot"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
        <img
          src="/assets/screenshots/learn-hero.avif"
          alt="Unify mobile app — Learn screen"
          class="platform-phone"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  </div>
</section>

<style>
  .platform {
    background-color: #ffffff;
    padding: 3rem 0;
  }

  .platform-inner {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  .platform-card {
    position: relative;
    background-color: #f3ecd9;
    border-radius: 30px;
    padding: clamp(1.75rem, 5vw, 3.5rem);
    display: grid;
    grid-template-columns: 1fr;
    gap: 2.5rem;
    align-items: center;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.7),
      0 20px 48px -24px rgba(23, 22, 22, 0.28);
    overflow: visible;
  }

  /* Scroll-reveal — hidden state gated behind the JS-set data attribute so the
     static / no-JS render shows the full card. */
  .platform[data-platform-bound="true"] .platform-card {
    opacity: 0;
    transform: translateY(28px);
    transition:
      opacity 0.8s var(--ease-out),
      transform 0.8s var(--ease-out);
  }
  .platform[data-platform-bound="true"].visible .platform-card {
    opacity: 1;
    transform: translateY(0);
  }

  .platform-eyebrow {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.8125rem;
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
    color: var(--color-brand);
  }

  .platform-heading {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(2rem, 4.6vw, 3rem);
    line-height: 1.02;
    letter-spacing: var(--tracking-tight);
    color: var(--color-ink);
    margin: 0.6rem 0 0;
    text-wrap: balance;
  }

  .platform-desc {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: 1.0625rem;
    line-height: 1.55;
    color: var(--color-muted);
    margin: 1rem 0 0;
    max-width: 40ch;
  }

  .platform-cta-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem;
    margin-top: 1.75rem;
  }

  .platform-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--font-ui);
    font-weight: 500;
    font-size: 1rem;
    letter-spacing: var(--tracking-cta);
    color: #ffffff;
    background-color: var(--color-ink);
    padding: 0.875rem 1.375rem;
    border-radius: var(--radius-cta);
    text-decoration: none;
    transition:
      background-color 0.2s var(--ease-out),
      transform 0.2s var(--ease-out);
  }
  .platform-btn span {
    transition: transform 0.2s var(--ease-out);
  }
  @media (hover: hover) and (pointer: fine) {
    .platform-btn:hover {
      background-color: var(--color-brand);
    }
    .platform-btn:hover span {
      transform: translateX(3px);
    }
  }
  .platform-btn:active {
    transform: scale(0.98);
  }

  .platform-badge-link {
    display: inline-block;
    transition:
      transform 0.2s var(--ease-out),
      filter 0.2s ease;
  }
  @media (hover: hover) and (pointer: fine) {
    .platform-badge-link:hover {
      transform: translateY(-2px) scale(1.03);
      filter: drop-shadow(0 6px 16px rgba(23, 22, 22, 0.15));
    }
  }
  .platform-badge {
    height: 52px;
    width: auto;
    display: block;
  }

  /* ── Device cluster ── */
  .platform-visual {
    position: relative;
    width: 100%;
  }

  .platform-browser {
    position: relative;
    z-index: 1;
    width: 100%;
    background-color: #ffffff;
    border: 1px solid rgba(23, 22, 22, 0.08);
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 28px 56px -22px rgba(23, 22, 22, 0.4);
  }

  .browser-bar {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    height: 38px;
    padding: 0 0.85rem;
    background-color: #f1f1f1;
    border-bottom: 1px solid #e4e4e4;
  }

  .browser-dot {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .browser-url {
    flex: 1;
    margin-left: 0.5rem;
    max-width: 280px;
    height: 23px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    background-color: #ffffff;
    border: 1px solid #e4e4e4;
    border-radius: 7px;
    font-family: var(--font-display);
    font-size: 0.75rem;
    color: var(--color-muted);
    white-space: nowrap;
  }
  .browser-url svg {
    width: 10px;
    height: 10px;
    opacity: 0.5;
  }

  .browser-shot-wrap {
    aspect-ratio: 16 / 10;
    overflow: hidden;
  }
  .browser-shot {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    display: block;
  }

  .platform-phone {
    position: absolute;
    right: 0;
    bottom: -2rem;
    width: 30%;
    max-width: 150px;
    height: auto;
    z-index: 2;
    filter: drop-shadow(0 18px 28px rgba(23, 22, 22, 0.28));
  }

  @media (prefers-reduced-motion: reduce) {
    .platform[data-platform-bound="true"] .platform-card {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }

  /* ── Tablet+ ── */
  @media (min-width: 810px) {
    .platform {
      padding: 4rem 0;
    }
    .platform-inner {
      padding: 0 3rem;
    }
    .platform-card {
      grid-template-columns: 1.05fr 1fr;
      gap: 3rem;
    }
    .platform-phone {
      bottom: -2.5rem;
      width: 28%;
      max-width: 170px;
    }
  }

  /* ── Desktop ── */
  @media (min-width: 1400px) {
    .platform-inner {
      padding: 0 5rem;
    }
    .platform-card {
      gap: 4rem;
      padding: 3.5rem 4rem;
    }
    .platform-phone {
      max-width: 185px;
      bottom: -3rem;
    }
  }
</style>

<script>
  function initPlatformBand() {
    const section = document.querySelector<HTMLElement>(".platform");
    if (!section || section.dataset.platformBound === "true") return;
    section.dataset.platformBound = "true";

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      section.classList.add("visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    observer.observe(section);
  }

  document.addEventListener("astro:page-load", initPlatformBand);
</script>
```

- [ ] **Step 4: Wire the component into `index.astro`**

In `src/pages/index.astro`, add the import after the `Partners` import:
```astro
import Partners from '../components/sections/Partners.astro';
import PlatformBand from '../components/sections/PlatformBand.astro';
```

And place it between `<Partners />` and `<Journey />` in `<main>`:
```astro
  <main>
    <Hero />
    <Partners />
    <PlatformBand />
    <Journey />
    <FAQ />
  </main>
```

- [ ] **Step 5: Run the spec to verify it passes**

Run:
```bash
npm run test:e2e -- platform-band
```
Expected: PASS (both tests).

- [ ] **Step 6: Build**

Run:
```bash
npm run build
```
Expected: clean build, no errors.

- [ ] **Step 7: Visual + responsive verification**

Run:
```bash
npm run dev
```
Then capture and review at three widths:
```bash
npx playwright screenshot http://localhost:4321 /tmp/band-1440.png --viewport-size="1440,2400" --full-page
npx playwright screenshot http://localhost:4321 /tmp/band-834.png  --viewport-size="834,2600" --full-page
npx playwright screenshot http://localhost:4321 /tmp/band-390.png  --viewport-size="390,3400" --full-page
open /tmp/band-1440.png /tmp/band-834.png /tmp/band-390.png
```
Verify on each: the band sits directly above "Core Features / Key Benefits"; cream card with brand-red `WEB + MOBILE` eyebrow, "One platform. Every device." heading, body copy, the dark "Launch web app →" button + App Store badge at matched height; browser frame (traffic dots + `app.unifysocial.ca` URL pill) showing the Social feed; the Learn phone overlapping the bottom-right with a slight overhang. **Then resize the dev browser continuously 320→1920px** and confirm: no horizontal overflow, the URL pill never wraps, the phone never overflows the viewport or detaches awkwardly, CTAs wrap gracefully, type stays readable. If the phone overhang clips at narrow widths, reduce `.platform-phone` width / `bottom` in the base (mobile) rule.

- [ ] **Step 8: Commit**

```bash
git add src/components/sections/PlatformBand.astro src/pages/index.astro tests/platform-band.spec.ts
git commit -m "feat(home): add WEB+MOBILE platform band above Core Features

New PlatformBand.astro — 'One platform. Every device.' with two equal CTAs
(Launch web app + App Store) and a browser/phone device cluster (Social feed
on web, Learn on mobile). Scroll-reveal wired via astro:page-load + the
data-platform-bound guard; covered by tests/platform-band.spec.ts."
```

---

## Task 3: Retune the hero copy for web + mobile

**Files:**
- Modify: `src/components/sections/Hero.astro` (H1 text at lines ~30–32; `.hero-cta-row` at lines ~38–53; add `.hero-web-link` style)

**Interfaces:**
- Consumes: web app URL constant.
- Produces: `a.hero-web-link` (href `https://app.unifysocial.ca`) inside `.hero-cta-row`. No other task depends on it.

- [ ] **Step 1: Add the web app URL constant**

In the frontmatter of `src/components/sections/Hero.astro`, below the existing `APP_STORE_URL`:
```astro
const APP_STORE_URL =
  "https://apps.apple.com/ca/app/unify-newcomer-support/id6754875762";
const WEB_APP_URL = "https://app.unifysocial.ca";
```

- [ ] **Step 2: Change the H1 from "app" to "platform"**

Replace:
```astro
      <h1 class="hero-h1">
        The all-in-one newcomer settlement app
      </h1>
```
with:
```astro
      <h1 class="hero-h1">
        The all-in-one newcomer settlement platform
      </h1>
```

- [ ] **Step 3: Add the secondary web-app link in the CTA row**

Replace the existing `.hero-cta-row` block:
```astro
      <div class="hero-cta-row">
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          class="hero-badge-link"
          aria-label="Download Unify on the App Store"
        >
          <img
            src="/assets/app-store-badge-en.svg"
            alt="Download on the App Store"
            class="hero-badge"
          />
        </a>
        <p class="hero-note">No credit card required</p>
      </div>
```
with:
```astro
      <div class="hero-cta-row">
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          class="hero-badge-link"
          aria-label="Download Unify on the App Store"
        >
          <img
            src="/assets/app-store-badge-en.svg"
            alt="Download on the App Store"
            class="hero-badge"
          />
        </a>
        <a href={WEB_APP_URL} class="hero-web-link">
          or open the web app
          <span aria-hidden="true">&rarr;</span>
        </a>
        <p class="hero-note">No credit card required</p>
      </div>
```

- [ ] **Step 4: Add the `.hero-web-link` style**

In the `<style>` block of `Hero.astro`, immediately after the `.hero-note { … }` rule, add:
```css
  .hero-web-link {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--color-text);
    text-decoration: none;
    transition:
      color 0.2s var(--ease-out),
      gap 0.25s var(--ease-out);
  }
  .hero-web-link:hover {
    color: var(--color-brand);
    gap: 0.6rem;
  }
```

- [ ] **Step 5: Build**

Run:
```bash
npm run build
```
Expected: clean build.

- [ ] **Step 6: Verify visually + smoke test still green**

Run:
```bash
npm run dev
npx playwright screenshot http://localhost:4321 /tmp/hero-check.png --viewport-size="1440,900"
open /tmp/hero-check.png
```
Verify: H1 reads "The all-in-one newcomer settlement platform" and still balances (no awkward orphan) at the `clamp()` sizes; the "or open the web app →" link sits cleanly with the badge and note; hover nudges the arrow + turns brand-red. Resize 320–1920px — the CTA row wraps without overflow.

Run the existing smoke + re-binding specs to confirm nothing regressed:
```bash
npm run test:e2e -- smoke view-transitions platform-band
```
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/Hero.astro
git commit -m "content(home): hero headline app→platform, add web-app link"
```

---

## Task 4: SEO — meta description + additive WebApplication JSON-LD

**Files:**
- Read first: `docs/seo-retro.md`
- Create: `src/lib/seo/webAppLd.ts`
- Modify: `src/lib/seo/index.ts` (add export)
- Modify: `src/pages/index.astro` (import `webAppLd`, serialize it, emit the `<script>`, update `description`)

**Interfaces:**
- Consumes: `serializeLd` from `src/lib/seo`.
- Produces: `webAppLd()` returning a `WebApplication` JSON-LD object; a third `application/ld+json` block in the homepage `<head>` slot.

- [ ] **Step 1: Read the SEO retro (required before touching SEO)**

Run:
```bash
sed -n '1,120p' docs/seo-retro.md
```
Confirm there is no rule against adding a second software-application schema, and note the JSON-LD conventions before proceeding.

- [ ] **Step 2: Create `webAppLd.ts`**

Create `src/lib/seo/webAppLd.ts` (mirrors `mobileAppLd.ts`):
```ts
const WEB_APP_URL = 'https://app.unifysocial.ca';

export function webAppLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Unify - Canada Newcomer Guide',
    applicationCategory: 'EducationApplication',
    operatingSystem: 'Web',
    browserRequirements: 'Requires JavaScript. Requires a modern web browser.',
    url: WEB_APP_URL,
    installUrl: WEB_APP_URL,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CAD' },
  };
}
```

- [ ] **Step 3: Export it from the seo barrel**

In `src/lib/seo/index.ts`, add after the `mobileAppLd` export line:
```ts
export { mobileAppLd } from './mobileAppLd';
export { webAppLd } from './webAppLd';
```

- [ ] **Step 4: Wire it into `index.astro` + update the description**

In `src/pages/index.astro`:

(a) Update the seo import to include `webAppLd`:
```astro
import { mobileAppLd, webAppLd, faqLd, serializeLd } from '../lib/seo';
```

(b) Add the serialized string next to the existing ones:
```astro
const mobileAppLdStr = serializeLd(mobileAppLd());
const webAppLdStr = serializeLd(webAppLd());
const faqLdStr = serializeLd(faqLd(faqs));
```

(c) Update the `description` prop on `<BaseLayout>`:
```astro
  description="The all-in-one platform for settling in Canada — on web and iOS. Personalized checklists, AI guidance, lessons, and a community of 250+ newcomers."
```

(d) Add the JSON-LD `<script>` in the `head` slot, after the mobileApp block:
```astro
    <script type="application/ld+json" set:html={mobileAppLdStr} />
    <script type="application/ld+json" set:html={webAppLdStr} />
    <script type="application/ld+json" set:html={faqLdStr} />
```

- [ ] **Step 5: Build**

Run:
```bash
npm run build
```
Expected: clean build.

- [ ] **Step 6: Verify the emitted markup**

Run:
```bash
npm run dev
```
Then:
```bash
curl -s http://localhost:4321/ | grep -o '"@type":"[A-Za-z]*"'
curl -s http://localhost:4321/ | grep -c 'app.unifysocial.ca'
```
Expected: `"@type":"MobileApplication"`, `"@type":"WebApplication"`, and `"@type":"FAQPage"` all present; `app.unifysocial.ca` appears (web-app LD + hero link). Confirm the new `<meta name="description">` reflects the web + iOS copy:
```bash
curl -s http://localhost:4321/ | grep -i 'name="description"'
```
Optionally paste the page source into the Google Rich Results test / schema.org validator to confirm both app schemas parse with no errors.

- [ ] **Step 7: Commit**

```bash
git add src/lib/seo/webAppLd.ts src/lib/seo/index.ts src/pages/index.astro
git commit -m "seo(home): add WebApplication JSON-LD + de-app-ify meta description"
```

---

## Final verification (after all tasks)

- [ ] **Full build:** `npm run build` — clean.
- [ ] **Full e2e:** `npm run test:e2e` — all specs green (smoke, faq, forms, mobile-nav, view-transitions, platform-band).
- [ ] **Continuous resize 320–1920px** on `/` — band + hero have no overflow/overlap/cropping at any width; the device-cluster phone overhang behaves; URL pill never wraps.
- [ ] **View Transition spot-check:** navigate Home → About → Home in the dev browser; the band reveals correctly on return and `data-platform-bound` is present exactly once (no stale/double bind).
- [ ] Confirm `.design-staging/` is still gitignored and uncommitted (`git status` shows nothing under it).

## Self-review (done while writing — recorded for the executor)

- **Spec coverage:** band component (Task 2) · placement above Core Features (Task 2, Step 4) · cream card + copy + two equal CTAs (Task 2) · device cluster Social-in-browser + Learn-phone (Tasks 1+2) · scroll-reveal + guard + test (Task 2) · hero app→platform + web link (Task 3) · meta description + WebApplication LD (Task 4) · asset pipeline via sharp (Task 1) · `.design-staging` gitignored (already done). All spec sections map to a task.
- **Placeholder scan:** none — all code blocks are complete and concrete.
- **Type/selector consistency:** `data-platform-bound`, `section.platform`, `a.platform-btn`, `.platform-badge`, `.browser-shot`, `.platform-phone`, `.platform-heading` are identical across the component (Task 2 Step 3) and its spec (Task 2 Step 1). `webAppLd` name matches across `webAppLd.ts`, `index.ts`, and `index.astro`.
