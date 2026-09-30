# Desktop search → relevant web learning sections

Selection source: live Google Search Console Search Analytics API, property
`https://unifysocial.ca/`, search type **web**, dimensions **page/device**, filter
**device equals DESKTOP**. Inclusive period **2026-09-01 through 2026-09-28**,
with `America/Los_Angeles` date boundaries. September 28 is the last settled date;
September 29 is the first incomplete date. Retrieved September 30, 2026 through
the connected GSC integration. All 65 returned rows were inspected: six pages
had clicks; the other 59 had zero. These are desktop counts, not the separate
all-device page ranking or August email summary.

| Page | Desktop clicks | Impressions | CTA destination |
| --- | ---: | ---: | --- |
| `/` | 22 | 602 | Existing Hero and PlatformBand web-app links retained; labeled “Launch web app”, they open the app entry flow |
| `/teer` | 10 | 4,911 | PR → Pathways at a Glance |
| `/teer/teer-3` | 6 | 720 | PR → Pathways at a Glance |
| `/blog/how-is-foreign-income-taxed-in-canada` | 2 | 327 | Finance → Understanding Taxes in Canada |
| `/blog/how-to-find-a-family-doctor-in-bc-as-a-newcomer` | 1 | 51 | Healthcare → Getting Care in BC’s Healthcare System |
| `/blog/the-easiest-skilled-jobs-to-transition-into-teer-3-for-pr-purposes-in-canada` | 1 | 253 | PR → Pathways at a Glance |

The five content pages include the tie at one click. Together they received 20
of the period's 42 desktop clicks; the homepage received the other 22. This is a
small baseline, so it supports a focused experiment, not a promised uplift.
Zero-click pages receive no new contextual CTA. Legacy blog URLs continue to
redirect to their existing canonical page before its CTA renders.

## Verified destinations

The web app's `app/(main)/learn/[moduleId]/[submoduleId]/page.tsx` resolves both
IDs against the module's published hierarchy. On September 30 we read the public
Sanity dataset used by `web-app/lib/sanity.ts`: project `fercgabp`, dataset
`production`, API `2024-01-01`, perspective `published`, base English documents.
We verified the parent/child relationship and lesson titles, rather than
inventing slugs or routing to a generic learning index.

- PR / Pathways at a Glance (includes “Skilled Worker & Provincial Pathways”):
  `https://app.unifysocial.ca/learn/9717e260-bdeb-4ee4-8d39-4159a48eb627/3d5abe49-8616-48f8-a857-b80317ddeb35`
- Finance / Understanding Taxes in Canada (includes “Filing Your Return”):
  `https://app.unifysocial.ca/learn/4c79ebb5-b03a-47aa-862e-6d0853eba7d4/b7988f8b-6105-4a26-ade1-6df5864f8ee6`
- Healthcare / Getting Care in BC’s Healthcare System (includes “Types of Care”):
  `https://app.unifysocial.ca/learn/1f43061d-0062-4ea5-bd82-6b25e8ee5a55/9882f55c-6191-4c4f-85f3-8cf4e1873355`

The copy describes these broader lessons accurately: it does not promise a TEER
eligibility assessment, a foreign-income calculator, or a family-doctor finder.

## Delivery and measurement

Each selected page gets a callout before the main reading content and at the end,
with a primary same-tab web link, an App Store choice, visible keyboard focus,
and account/setup guidance. Existing article copy, government links, SEO,
ClientRouter and App Store CTAs are retained. Styling uses the site's typography,
warm cream surface, dark buttons, fluid padding/type and wrapping controls.

The existing GA4 `gtag` receives `search_cta_view` once per visible placement per
page visit and `search_cta_click` for activation. Event parameters:
`source_path`, `topic`, `destination_path`, `placement`, plus `platform` on clicks
(`web` or `ios`). They contain only fixed content metadata; no account state,
query strings, identifiers or user input. Clicks use beacon transport and do not
wait for analytics. The handler survives Astro navigation without duplicate
listeners; observers disconnect before swaps. Configure GA4 custom dimensions
for these parameters to compare view→click rates by page/placement/platform.
The app's existing learning analytics remain available; this PR does not add
cross-domain identity tracking or claim that a CTA click equals registration.

## Authentication dependency and rollout

The current production app redirects signed-out section requests to `/welcome`
and finishes login, consent and onboarding at `/home`, losing the requested
section. The [companion web-app draft PR #163](https://github.com/UnifyCN/web-app/pull/163) retains exactly these three destinations
in a 30-minute httpOnly SameSite=Lax cookie. It resumes only after the existing
auth/consent/onboarding gates pass and consumes state once. Unsupported/unsafe or
expired paths are rejected; a new app entry or another feature cancels intent.
Back within auth retains it, a new CTA replaces it, and prefetch/API calls do not
consume or overwrite it. No auth permissions change.

**Deploy the companion web-app change before the marketing change.** Neither PR
is an instruction to merge or deploy. Without the companion, logged-in and fully
set-up readers still reach the relevant section; signed-out readers finish at
Home and must find the section manually. Local tests simulate auth/gate state
using real NextRequest/NextResponse objects; no live user account is created or
signed in to verify OAuth/email delivery. State expires after 30 minutes, so a
longer setup intentionally falls back to Home.

## Validation results

- Marketing production build passed. No lint/typecheck command is configured in
  this repository; the Astro/Vite build compiles the new TypeScript/client script.
- All seven focused CTA Playwright tests passed using local headless Chromium,
  including width sweeps from 320–1920px (20px steps plus 375/809/810/1399/1400),
  exact links, 44px targets, keyboard focus, Astro swaps and analytics failures.
  Desktop/mobile screenshots were inspected for the new callouts.
- The full 62-test browser suite passed 59 tests, including all CTA tests. Three
  existing `tests/events.spec.ts` calendar cases failed: day filtering, arrow-key
  movement and the folded mobile calendar. All three reproduced on unchanged
  main `b533d01185119f162be1f87b9f55c0c042accce5` in a separate checkout/port.
  Event code and tests are outside this change.
- Companion web app: lint, TypeScript, all 308 unit tests (35 new destination-flow
  cases), and production build passed. Remote draft head
  `cc130e36dcaee610dda5304bbe3fe8693dbf71f8`: Vercel, Vercel Preview Comments and
  CodeRabbit checks all succeeded.
