// The `cta_clicked` event contract (spec UnifyCN/mobile-app#314):
//   cta_clicked { target: app_store | google_play | web_app, placement, page }
// Pure helpers, shared by the components (server-rendered hrefs) and the
// client tracker (src/scripts/analytics.ts).
import { APP_STORE_URL, PLAY_STORE_URL, WEB_APP_URL } from "../app-links";

export type CtaTarget = "app_store" | "google_play" | "web_app";

export interface CtaClickedProperties {
  target: CtaTarget;
  placement: string;
  page: string;
}

/** Placement for a qualifying link outside any [data-cta-placement] block (e.g. a link in a blog body). */
export const INLINE_PLACEMENT = "inline";

const appStore = new URL(APP_STORE_URL);
const playStore = new URL(PLAY_STORE_URL);
const webApp = new URL(WEB_APP_URL);

function ctaTarget(href: string): CtaTarget | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (url.host === webApp.host) return "web_app";
  // Store links must point at Unify's own listing; the slug may change, the id does not.
  if (url.host === appStore.host && url.pathname.endsWith(appStore.pathname.slice(appStore.pathname.lastIndexOf("/")))) {
    return "app_store";
  }
  if (url.host === playStore.host && url.searchParams.get("id") === playStore.searchParams.get("id")) {
    return "google_play";
  }
  return null;
}

/**
 * Properties for `cta_clicked`, or null when the link is not a store or web-app
 * CTA. `href` must be absolute (an anchor's resolved `.href`).
 */
export function ctaClickedProperties(
  href: string,
  placement: string | undefined,
  page: string,
): CtaClickedProperties | null {
  const target = ctaTarget(href);
  if (!target) return null;
  return { target, placement: placement || INLINE_PLACEMENT, page };
}

/**
 * The Google Play listing with an install referrer, so Play Console attributes
 * installs to the landing page and to the placement that sent them.
 */
export function playStoreUrl(placement: string): string {
  const referrer = new URLSearchParams({
    utm_source: "unifysocial.ca",
    utm_medium: "website",
    utm_campaign: "landing",
    utm_content: placement,
  }).toString();
  return `${PLAY_STORE_URL}&referrer=${encodeURIComponent(referrer)}`;
}

/** The production site. PostHog loads on these hosts and nowhere else. */
export const ANALYTICS_HOSTS: readonly string[] = ["unifysocial.ca", "www.unifysocial.ca"];

/**
 * Whether PostHog may load on `hostname`. An exact-match allowlist, so
 * localhost, LAN addresses, Vercel / Cloudflare previews and look-alike hosts
 * can never send platform=landing events into the production project.
 * `allowed` exists for tests only (see src/scripts/analytics.ts).
 */
export function isAnalyticsHost(hostname: string, allowed: readonly string[] = ANALYTICS_HOSTS): boolean {
  return allowed.includes(hostname);
}
