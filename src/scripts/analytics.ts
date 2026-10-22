// PostHog on the landing page (spec UnifyCN/mobile-app#314). GA4 stays; this
// runs beside it (see BaseLayout).
// - Same PostHog project as the mobile and web apps. The project key is a
//   public client token (it ships in every page anyway), kept here as GA_ID is
//   kept in BaseLayout.
// - posthog-js is about 110 KB gzipped, so, like gtag.js, it is requested
//   only after the first paint. Events tracked before it arrives wait in
//   `pending`.
// - Loaded only on unifysocial.ca and www.unifysocial.ca (isAnalyticsHost in
//   src/lib/analytics/cta.ts), so localhost, LAN and preview hosts send
//   nothing to the production project.
// - Every tracked event is also dispatched as an `unify:analytics` DOM event
//   on document. The e2e tests read it (tests/posthog-cta.spec.ts); nothing
//   else listens.
import type { PostHog } from "posthog-js";
import { ctaClickedProperties, isAnalyticsHost } from "../lib/analytics/cta";
import { sanitizeEvent, sanitizeProperties } from "../lib/analytics/privacy";

const POSTHOG_KEY = "phc_HhWBzt38eOkq5sAAKdp8kKypQEHkXojKvqM2gpu8EJw";
const POSTHOG_HOST = "https://us.i.posthog.com";
// The platform filter for the Landing Page dashboard. The landing page never
// calls reset(), so the super property is registered once.
const SUPER_PROPERTIES = { platform: "landing" } as const;
// posthog-js's persisted { r: referrer, u: url } of the visitor's first page.
const INITIAL_PERSON_INFO = "$initial_person_info";

// The e2e tests run on the dev server at localhost. To exercise the real
// posthog-js path they set `window.__unifyAnalyticsHosts` (an init script) to
// an allowlist that includes localhost, and stub PostHog's network. Only the
// dev server reads it: in a production build `import.meta.env.DEV` is false and
// the override is compiled out, so no page can widen the allowlist.
type TestWindow = Window & { __unifyAnalyticsHosts?: readonly string[] };
const testHosts = import.meta.env.DEV ? (window as TestWindow).__unifyAnalyticsHosts : undefined;
const enabled = isAnalyticsHost(location.hostname, testHosts);

type Properties = Record<string, string>;
interface Tracked {
  event: string;
  properties: Properties;
  /** Send at once instead of batching: the click may be leaving the page. */
  sendInstantly: boolean;
}

let client: PostHog | undefined;
let loading = false;
const pending: Tracked[] = [];

function send(posthog: PostHog, { event, properties, sendInstantly }: Tracked) {
  try {
    posthog.capture(event, properties, sendInstantly ? { send_instantly: true } : undefined);
  } catch {
    // Measurement must never interrupt navigation.
  }
}

function track(event: string, properties: Properties, sendInstantly = false) {
  document.dispatchEvent(new CustomEvent("unify:analytics", { detail: { event, properties } }));
  if (!enabled) return;
  const item = { event, properties, sendInstantly };
  if (client) send(client, item);
  else pending.push(item);
}

function loadPostHog() {
  if (loading) return;
  loading = true;
  import("posthog-js")
    .then(({ default: posthog }) => {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        // The same cookie settings as app.unifysocial.ca (Unify-Web-App
        // lib/posthog.ts, which uses posthog-js's defaults): the identity
        // cookie is set on .unifysocial.ca, so a landing visitor who opens the
        // web app stays the same PostHog person.
        persistence: "localStorage+cookie",
        cross_subdomain_cookie: true,
        // ClientRouter navigations are client-side, so page views are captured
        // by hand on astro:page-load (below), as for GA4.
        capture_pageview: false,
        capture_pageleave: true,
        disable_session_recording: true,
        // Every event, autocapture included, has its URLs scrubbed before it
        // is sent: only utm_*, ref, gclid and fbclid survive, no fragments
        // (src/lib/analytics/privacy.ts). A visitor's /?email=... never
        // reaches PostHog.
        before_send: (event) => (event ? sanitizeEvent(event, location.hostname) : event),
      });
      posthog.register(SUPER_PROPERTIES);
      // posthog-js stores the entry URL and referrer once, unscrubbed, in its
      // cookie, and the web app sends them as person properties on sign-up.
      // Store a scrubbed copy first (posthog-js never overwrites it), and
      // scrub one left by an earlier visit.
      const entry = (posthog.get_property(INITIAL_PERSON_INFO) as Record<string, unknown> | undefined) ?? {
        r: document.referrer || "$direct",
        u: location.href,
      };
      posthog.register({ [INITIAL_PERSON_INFO]: sanitizeProperties(entry, location.hostname) });
      client = posthog;
      for (const item of pending.splice(0)) send(posthog, item);
    })
    .catch(() => {
      // Blocked or offline: the page works the same without analytics.
    });
}

if (enabled) {
  // Wait for the browser's first contentful paint. (Two animation frames, as
  // gtag uses, measured a few ms before it.) Without paint timing, fall back
  // to two frames. A tab opened in the background gets no paint until it is
  // shown, hence the timeout.
  if (PerformanceObserver.supportedEntryTypes?.includes("paint")) {
    const observer = new PerformanceObserver((list) => {
      if (list.getEntriesByName("first-contentful-paint").length === 0) return;
      observer.disconnect();
      loadPostHog();
    });
    observer.observe({ type: "paint", buffered: true });
  } else {
    requestAnimationFrame(() => requestAnimationFrame(loadPostHog));
  }
  setTimeout(loadPostHog, 3000);
}

// Page views. The URL is taken when the view happens, not when a queued event
// is finally sent. This module runs once per full page load; ClientRouter
// swaps are counted on astro:page-load, which also fires for the first page,
// so that one is skipped unless a swap came before it.
function pageview() {
  track("$pageview", { $current_url: location.href, $pathname: location.pathname });
}
let swapped = false;
pageview();
document.addEventListener("astro:after-swap", () => {
  swapped = true;
});
document.addEventListener("astro:page-load", () => {
  if (!swapped) return;
  swapped = false;
  pageview();
});

// CTA clicks: any link to the App Store, Google Play, or the web app. The
// placement is the nearest [data-cta-placement]. Capture phase on document,
// so it survives ClientRouter swaps and runs before any handler that stops
// the event.
function onLinkClick(e: MouseEvent) {
  if (e.type === "auxclick" && e.button !== 1) return;
  if (!(e.target instanceof Element)) return;
  const link = e.target.closest("a[href]");
  if (!(link instanceof HTMLAnchorElement)) return;
  const placement = link.closest<HTMLElement>("[data-cta-placement]")?.dataset.ctaPlacement;
  const properties = ctaClickedProperties(link.href, placement, location.pathname);
  if (properties) track("cta_clicked", { ...properties }, true);
}
document.addEventListener("click", onLinkClick, { capture: true });
document.addEventListener("auxclick", onLinkClick, { capture: true });
