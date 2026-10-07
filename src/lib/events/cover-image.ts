// Event covers are hotlinked from partner sites at whatever size the partner
// uploaded (one was 359 KB for a 232px thumbnail). Cloudflare Image
// Transformations can resize and re-encode them at the edge:
//   /cdn-cgi/image/<options>/<source URL>
//
// Requirements in the Cloudflare dashboard (Images > Transformations, zone
// unifysocial.ca): transformations enabled, AND each host below listed under
// Sources > "Specified origins" (or "Any origin"). A host that is not allowed
// answers 403; the <img> then falls back to the original URL (see
// COVER_FALLBACK), so a missing setting costs speed, never the picture.

/** Only hosts the events feed actually uses. Anything else is served as is. */
export const COVER_TRANSFORM_HOSTS: ReadonlySet<string> = new Set([
  "images.pexels.com",
  "events.sfu.ca",
  "vpl.bibliocommons.com",
  "burnabynh.ca",
  "www.capilanou.ca",
]);

/** Where a cover is shown, with the widths worth generating and its `sizes`. */
export const COVER_SLOTS = {
  // Agenda row thumbnail: 68px, 104px or up to 232px wide.
  row: { widths: [160, 320, 480], sizes: "(max-width: 480px) 68px, (max-width: 700px) 104px, 232px" },
  // Featured card in the hero band: a third of an 80rem row, or most of a phone.
  feature: { widths: [400, 800], sizes: "(max-width: 700px) 85vw, 400px" },
  // Detail page cover: the main column.
  detail: { widths: [800, 1280], sizes: "(max-width: 900px) 100vw, 760px" },
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
 * `<img>` attributes for a cover. `transform` is off under `astro dev`, where
 * /cdn-cgi/image does not exist.
 */
export function coverImage(url: string, slot: CoverSlot, transform: boolean = import.meta.env.PROD): CoverImage {
  if (!transform) return { src: url };
  let host: string;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return { src: url };
    host = parsed.hostname;
  } catch {
    return { src: url };
  }
  if (!COVER_TRANSFORM_HOSTS.has(host)) return { src: url };

  const { widths, sizes } = COVER_SLOTS[slot];
  return {
    src: transformUrl(url, widths[widths.length - 1]),
    srcset: widths.map((w) => `${transformUrl(url, w)} ${w}w`).join(", "),
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
