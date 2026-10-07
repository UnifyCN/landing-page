// The home hero's phone screenshot, in three widths (the two small ones come
// from scripts/build-brand-images.mjs). Shared by Hero.astro's <img> and the
// <link rel="preload"> in src/pages/index.astro: if the two disagree, the
// browser downloads one file for the preload and another for the image.
const BASE = "/assets/screenshots/learn-hero";

export const HERO_SRCSET = `${BASE}-380.avif 380w, ${BASE}-760.avif 760w, ${BASE}.avif 1030w`;

// .hero-phone is capped by max-height (360px, 540px from 810px, 680px from
// 1400px); at the screenshot's 1030:2048 ratio that is 181, 272 and 342px wide.
export const HERO_SIZES = "(min-width: 1400px) 342px, (min-width: 810px) 272px, 181px";
