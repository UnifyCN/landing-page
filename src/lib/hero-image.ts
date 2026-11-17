// The hero phone's screens (scripts/build-hero-screens.mjs) and the size they
// are shown at. Shared by the hero <picture>s and the head preload of the first
// screen, so the browser downloads one file, not two.
const BASE = "/assets/screenshots/hero";

/** AVIF candidates for one hero screen ("checklist", "ai", "social", "learn"). */
export const heroScreenSrcset = (name: string) => `${BASE}/${name}-360.avif 360w, ${BASE}/${name}-720.avif 720w`;

/** The first screen, the one visible on load (preloaded). */
export const HERO_SRCSET = heroScreenSrcset("checklist");

// The phone is 33% of a ring at most 540px wide (desktop), 42% of one at most
// 420px wide under 810px; the screen is the phone minus its 7px frame.
export const HERO_SIZES = "(min-width: 810px) 172px, 162px";
