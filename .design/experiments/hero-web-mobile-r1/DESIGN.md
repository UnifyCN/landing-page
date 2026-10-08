# Unify homepage hero image

Status: Option C selected by Savar on 2026-10-07. Implemented locally.

## Job

Show a new visitor that Unify has both a web app and an iPhone app.

## Selected direction

Use the generated browser window + phone composition. Both screens show Learn content. Source: October 2 meeting with Luis. Savar selected C after reviewing three image options.

## Constraints

- Use the current hero text and both existing buttons.
- Use a transparent background on the white hero.
- Show both complete devices without distortion.
- Use responsive AVIF sources and matching WebP fallbacks with explicit dimensions.
- Share the image source settings with the head preload.
- Keep the tablet and desktop columns from 810px.
- Reduce fluid heading size from 810px so all-in-one stays on one line.
- Use the shadows in the image. Add no glow or extra filter.
- Honor reduced motion.

## Implementation

Component: `src/components/sections/Hero.astro`.

Assets: `public/assets/images/hero-web-mobile-c.avif` at 1448 x 1086 and `hero-web-mobile-c-724.avif` at 724 x 543. Both sizes have matching `.webp` fallbacks. Shared source settings: `src/lib/hero-image.ts`.

## Acceptance evidence

- Production build passes.
- Homepage and platform-band regression tests pass.
- Resize checks at 85 widths from 320px through 1920px find no horizontal overflow, image distortion, missing image, clipped button, or split inside all-in-one.
- Desktop, tablet and mobile screenshots show both devices.

Evidence: `.design/evidence/hero-web-mobile-c/`.

Review: `.design/reviews/hero-web-mobile-2026-10-07-r1.md`.

## Limits

The image generator used existing app screenshots as references. The generated screen text is not guaranteed to match the screenshots pixel for pixel. Hosted deployment is outside this change.
