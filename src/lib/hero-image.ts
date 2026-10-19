// Shared by the hero picture and head preload to avoid duplicate downloads.
const BASE = "/assets/images/hero-web-mobile-c";

export const HERO_SRCSET = `${BASE}-724.avif 724w, ${BASE}.avif 1448w`;

// Match the equal hero columns, container padding, and mobile image width cap.
export const HERO_SIZES = "(min-width: 1440px) 624px, (min-width: 1400px) calc((100vw - 12rem) / 2), (min-width: 810px) calc((100vw - 7.5rem) / 2), (min-width: 720px) 672px, calc(100vw - 3rem)";
