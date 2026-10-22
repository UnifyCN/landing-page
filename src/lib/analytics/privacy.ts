// URL scrubbing for everything the landing page sends to PostHog. A visitor
// can arrive on any URL, e.g. /?email=..., and posthog-js copies the URL into
// many properties ($current_url, $referrer, the $initial_* person properties,
// session entry URLs). src/scripts/analytics.ts runs sanitizeEvent as
// posthog-js's before_send, so every event, autocapture included, passes
// through here before it leaves the browser.
//
// Rules:
// - Query parameters are dropped except the attribution ones the Landing Page
//   dashboard reads: utm_*, ref, gclid, fbclid.
// - Fragments are dropped.
// - A referrer from another site keeps its origin and path but loses its whole
//   query (a search engine's q=, for one), and ph_keyword (posthog-js's copy
//   of that q=) is removed.
// - posthog-js also stores the entry URL and referrer ($initial_person_info)
//   in its cookie on .unifysocial.ca, and the web app sends them as the
//   person's $initial_current_url / $initial_referrer when the visitor signs
//   up. analytics.ts scrubs that stored copy with sanitizeProperties as well.

const KEPT_PARAM = /^(utm_[a-z0-9_]+|ref|gclid|fbclid)$/i;

/** Hosts that count as this site for referrers: the current host and all of unifysocial.ca. */
export function isSameSite(host: string, siteHost: string): boolean {
  return host === siteHost || host === "unifysocial.ca" || host.endsWith(".unifysocial.ca");
}

/**
 * `value` with its fragment removed and only attribution parameters kept
 * (none at all when `dropQuery`). Absolute http(s) URLs and site paths
 * ("/about?x=1") are scrubbed; any other string is returned as is.
 */
export function sanitizeUrl(value: string, { dropQuery = false } = {}): string {
  const isPath = value.startsWith("/") && !value.startsWith("//");
  if (!isPath && !/^https?:\/\//i.test(value)) return value;
  let url: URL;
  try {
    url = new URL(value, "https://unifysocial.ca");
  } catch {
    return value;
  }
  const kept = new URLSearchParams();
  if (!dropQuery) {
    for (const [key, val] of url.searchParams) if (KEPT_PARAM.test(key)) kept.append(key, val);
  }
  url.search = kept.toString();
  url.hash = "";
  return isPath ? url.pathname + url.search : url.href;
}

// Keys whose value is a referrer. `r` is the referrer inside posthog-js's
// $initial_person_info ({ r, u }).
const REFERRER_KEY = /referrer$/i;
// Keys whose value may be a bare path rather than an absolute URL.
const PATH_KEY = /(^page$|pathname$)/i;

function sanitizeValue(key: string, value: unknown, siteHost: string): unknown {
  if (typeof value === "string") {
    if (/^https?:\/\//i.test(value)) {
      let external = false;
      try {
        external = !isSameSite(new URL(value).hostname, siteHost);
      } catch {
        // Unparseable: sanitizeUrl returns it unchanged.
      }
      const isReferrer = REFERRER_KEY.test(key) || key === "r";
      return sanitizeUrl(value, { dropQuery: isReferrer && external });
    }
    return PATH_KEY.test(key) ? sanitizeUrl(value) : value;
  }
  if (Array.isArray(value)) return value.map((item) => sanitizeValue(key, item, siteHost));
  if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    return sanitizeProperties(value as Record<string, unknown>, siteHost);
  }
  return value;
}

// posthog-js copies a search engine referrer's query (q=) into ph_keyword
// and $session_entry_ph_keyword. That query is dropped with the referrer's.
const DROPPED_KEY = /ph_keyword$/i;

/**
 * A copy of `properties` with every URL in it (nested objects included)
 * scrubbed, and the search-keyword properties removed.
 */
export function sanitizeProperties(properties: Record<string, unknown>, siteHost: string): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(properties)) {
    if (!DROPPED_KEY.test(key)) out[key] = sanitizeValue(key, value, siteHost);
  }
  return out;
}

interface EventLike {
  properties?: Record<string, unknown>;
  $set?: Record<string, unknown>;
  $set_once?: Record<string, unknown>;
}

/** Scrub an event's properties and its $set / $set_once person properties. */
export function sanitizeEvent<T extends EventLike>(event: T, siteHost: string): T {
  const out = { ...event };
  for (const field of ["properties", "$set", "$set_once"] as const) {
    const value = event[field];
    if (value) out[field] = sanitizeProperties(value, siteHost);
  }
  return out;
}
