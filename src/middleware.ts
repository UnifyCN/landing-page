import { defineMiddleware } from "astro:middleware";
import { isEventsFixtureRequest } from "./lib/events/fixtures";

// Edge cache for the SSR pages (/events*, /blog*).
//
// Cloudflare does not cache responses a Worker generates, so the pages'
// `s-maxage` header alone did nothing: every view waited on Supabase or Sanity
// (150–600 ms TTFB, measured 2026-09-26). This stores 200 responses in the
// data-centre cache (Workers Cache API) for the page's `s-maxage`; prerendered
// pages never reach here — they are static assets.
//
// Bypassed for the Sanity Studio preview pane, which loads the post in an
// iframe (`Sec-Fetch-Dest: iframe`) and must show the just-published version,
// and for the e2e suite's fixture requests (dev only), which render the same
// URL against different clocks.

const CACHEABLE = [/^\/events(\/|$)/, /^\/blog(\/|$)/];

// The page's own Cache-Control, kept on the stored copy (see the HIT branch).
const ORIGINAL_CACHE_CONTROL = "X-Origin-Cache-Control";

type EdgeCache = { match(req: Request): Promise<Response | undefined>; put(req: Request, res: Response): Promise<void> };

export const onRequest = defineMiddleware(async ({ request, url }, next) => {
  const edge = (globalThis as { caches?: { default?: EdgeCache } }).caches?.default;
  if (
    !edge ||
    request.method !== "GET" ||
    request.headers.get("Sec-Fetch-Dest") === "iframe" ||
    isEventsFixtureRequest(request) ||
    !CACHEABLE.some((re) => re.test(url.pathname))
  ) {
    return next();
  }

  const key = new Request(url.toString(), { method: "GET" });
  const hit = await edge.match(key);
  if (hit) {
    const res = new Response(hit.body, hit);
    // A stored copy comes back with Cloudflare's zone Browser Cache TTL
    // (`max-age=14400`), not the page's `max-age=0`, so browsers kept /events for
    // 4 hours and an un-featured event stayed visible. Restore the page's header.
    const original = res.headers.get(ORIGINAL_CACHE_CONTROL);
    if (original) res.headers.set("Cache-Control", original);
    res.headers.delete(ORIGINAL_CACHE_CONTROL);
    res.headers.set("X-Edge-Cache", "HIT");
    return res;
  }

  const res = await next();
  const cacheControl = res.headers.get("Cache-Control") ?? "";
  if (res.status === 200 && /s-maxage=\d+/.test(cacheControl) && !res.headers.has("Set-Cookie")) {
    const stored = res.clone();
    stored.headers.set(ORIGINAL_CACHE_CONTROL, cacheControl);
    await edge.put(key, stored);
  }
  res.headers.set("X-Edge-Cache", "MISS");
  return res;
});
