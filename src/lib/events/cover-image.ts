// Event covers are hotlinked from partner sites at whatever size the partner
// uploaded (one was 359 KB for a 232px thumbnail). Cloudflare Image
// Transformations can resize and re-encode them at the edge:
//   /cdn-cgi/image/<options>/<source URL>
//
// Requirements in the Cloudflare dashboard (Images > Transformations, zone
// unifysocial.ca): transformations enabled, AND each host below listed under
// Sources > "Specified origins". Keep that list specific: "Any origin" would
// let anyone resize any image on the internet through this zone, and the
// dashboard list, not the one in this file, is what stops that. A host that
// is not allowed answers 403; the <img> then falls back to the original URL
// (see COVER_FALLBACK), so a missing setting costs speed, never the picture.

/** Only hosts the events feed actually uses. Anything else is served as is. */
export const COVER_TRANSFORM_HOSTS: ReadonlySet<string> = new Set([
  "images.pexels.com",
  "events.sfu.ca",
  "vpl.bibliocommons.com",
  "burnabynh.ca",
  "www.capilanou.ca",
]);

/**
 * Where a cover is shown: the widths worth generating and the `sizes` to pick
 * between them.
 *
 * `sizes` is NOT the box width. Covers are about 2:1 (491x246, 760x380,
 * 1200x627) and are shown with `object-fit: cover` in taller boxes, so the
 * image is scaled to the box HEIGHT and cropped at the sides. The source width
 * the browser needs is box height x 2:
 *   row      16:10 box up to 232px wide (145 tall)  -> 290px
 *            1:1 box 104px (<=640px), 68px (<=480px) -> 208px, 136px
 *   feature  4:3 box, ~387px wide on desktop          -> 580px; 85vw on phones -> 128vw
 *   detail   16:9 box, ~760px main column             -> 860px; full width below 900px -> 113vw
 * Using the box width instead picked files about 1.4x too small (soft covers).
 * Breakpoints mirror EventCard.astro (.ec--row .ec-media) and [event].astro.
 */
export const COVER_SLOTS = {
  row: { widths: [160, 320, 480, 640], sizes: "(max-width: 480px) 136px, (max-width: 640px) 208px, 290px" },
  feature: { widths: [600, 1200], sizes: "(max-width: 700px) 128vw, 580px" },
  detail: { widths: [800, 1280], sizes: "(max-width: 900px) 113vw, 860px" },
} as const;

export type CoverSlot = keyof typeof COVER_SLOTS;

export interface CoverImage {
  src: string;
  srcset?: string;
  sizes?: string;
  /** Set only when `src` is a transformation: the untouched URL to fall back to. */
  original?: string;
}

const transformUrl = (source: string, width: number) =>
  // The source goes in unencoded, query string included: Cloudflare accepts
  // that form (and a fully encoded one), but not a half-encoded URL.
  `/cdn-cgi/image/width=${width},quality=75,format=auto,fit=scale-down/${source}`;

/**
 * Transformations only exist on the production zone: not under `astro dev`,
 * `astro preview`, or the workers.dev URL, where every cover would fail once
 * and fall back.
 */
export function coverTransformsEnabled(hostname: string, isProd: boolean): boolean {
  return isProd && hostname === "unifysocial.ca";
}

/** `<img>` attributes for a cover. Pass `coverTransformsEnabled(...)` as `transform`. */
export function coverImage(url: string, slot: CoverSlot, transform: boolean): CoverImage {
  if (!transform) return { src: url };
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { src: url };
  }
  // Cover URLs come from a crawler, so only plain https URLs on a listed host
  // qualify: no credentials, no odd port.
  if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.port) return { src: url };
  if (!COVER_TRANSFORM_HOSTS.has(parsed.hostname)) return { src: url };
  // The normalised URL goes into the path (spaces become %20, "/../" is
  // resolved). srcset splits candidates on whitespace and drops a trailing
  // comma, so a URL that still has either cannot be listed safely. Commas
  // inside the URL are fine (SFU's ".../src_region/0,0,2160,1080/...").
  const source = parsed.href;
  if (/\s/.test(source) || source.endsWith(",")) return { src: url };

  const { widths, sizes } = COVER_SLOTS[slot];
  return {
    src: transformUrl(source, widths[widths.length - 1]),
    srcset: widths.map((w) => `${transformUrl(source, w)} ${w}w`).join(", "),
    sizes,
    original: url,
  };
}

/**
 * Inline `onerror` for a transformed cover: if Cloudflare refuses (host not in
 * the allowed sources, source too large, upstream error), load the original
 * once. Removing srcset first matters, or the browser retries the same file.
 */
export const COVER_FALLBACK =
  "this.onerror=null;this.removeAttribute('srcset');this.removeAttribute('sizes');this.src=this.dataset.original";
