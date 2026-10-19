# Review: Unify web and mobile hero

Independence: local verification plus a fresh reviewer for source, assets, screenshots, measurements, and the Hero instructions.

Result: local implementation passes. Deployment requires a separate request.

## Evidence

- Selected direction: `.design/experiments/hero-web-mobile-r1/DESIGN.md`.
- Desktop, tablet and mobile screenshots: `.design/evidence/hero-web-mobile-c/`.
- Resize data: `.design/evidence/hero-web-mobile-c/resize.json`.
- `npm run build`: passed in the PR worktree on the latest `origin/main` base.
- Full browser suite: 155 of 165 tests passed on the first run with four workers. Ten tests failed, mostly from page-loading and navigation timeouts. All ten passed on the repeated run with one worker.
- A fresh reviewer confirmed the image dimensions, transparency, responsive sizes, screenshots, and the revised Hero guidance. The reviewer did not run a build or tests.
- The first review found an old phone preload. The newer base uses responsive preload settings shared with the hero. The PR keeps that mechanism and changes the shared settings to C. The prerendered HTML and browser inspection confirm that the preload matches the C source and sizes.

## Checks and limits

- Hero image: loads and retains its 4:3 ratio at all 85 sampled widths from 320px through 1920px, at 20px steps and the breakpoint edges. Both buttons fit within the viewport. The page has no horizontal overflow. This sweep samples the range; it does not check every integer width.
- Heading: all-in-one occupies one line at all sampled widths. At 810px the original heading size split this phrase. The tablet fluid size is now 6vw.
- Asset: AVIF files retain transparency at 1448 x 1086 (95,227 bytes) and 724 x 543 (39,375 bytes). Matching WebP files retain transparency at the same dimensions (156,236 and 58,546 bytes). Explicit dimensions reserve the image space. Screenshots show both complete devices.
- Image delivery: existing tests prove that modern browsers choose the 724px AVIF at 1440px and 1x, the preload uses the same responsive settings, and browsers with AVIF disabled decode the WebP fallback. The page image tests also check reserved dimensions and layout shift. They do not measure production network speed.
- Page: the smoke test proves the homepage responds and has one main H1 and the navbar. It does not verify the generated screen text.
- Platform band: the tests prove its buttons and device images render and that the reveal binds after a View Transition navigation. The tests use reduced motion. They pass through the hero but do not assert its media query.
- Reduced motion: source inspection confirms animation:none and opacity:1 for the six animated hero elements. This was not a separate runtime motion test.
- Content: the PR keeps the latest hero text, 35+ reviews, 450+ newcomers, and button destinations. The generated screenshots are not guaranteed to match the source pixels.

## Rubric

| Dimension | Score | Weight | Evidence |
| --- | --- | --- | --- |
| Task fit | 9 | 15 | C shows the browser and iPhone together. |
| Content and hierarchy | 8 | 20 | Existing headline and two buttons remain visible. |
| System coherence | 9 | 10 | Existing fonts, white background, and page structure remain. |
| Interaction and states | 8 | 5 | No new interaction; existing navigation and platform controls pass. |
| Accessibility and responsiveness | 8 | 10 | Descriptive alt text, dimensions, reduced-motion rule, and resize evidence. |
| Visual expression | 8 | 20 | The selected C composition matches the approved preview. |
| Craft | 8 | 15 | Proportions, image fit, and heading wrapping pass. |
| Evidence and fidelity | 9 | 5 | Three captures and saved measurements support the implementation. |

Weighted score: 83/100.

Blockers: none for local implementation.

Weakest dimension: small text inside the device images remains small at phone widths. The alt text describes the image content.
