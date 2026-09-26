import { defineMiddleware } from "astro:middleware";

// Edge cache for the SSR pages (/events*, /blog*).
//
// Cloudflare does not cache responses a Worker generates, so the pages'
// `s-maxage` header alone did nothing: every view waited on Supabase or Sanity
// (150–600 ms TTFB, measured 2026-09-26). This stores 200 responses in the
// data-centre cache (Workers Cache API) for the page's `s-maxage`; prerendered
// pages never reach here — they are static assets.
//
// Bypassed for the Sanity Studio preview pane, which loads the post in an
// iframe (`Sec-Fetch-Dest: iframe`) and must show the just-published version.

const CACHEABLE = [/^\/events(\/|$)/, /^\/blog(\/|$)/];

type EdgeCache = { match(req: Request): Promise<Response | undefined>; put(req: Request, res: Response): Promise<void> };

export const onRequest = defineMiddleware(async ({ request, url }, next) => {
  const edge = (globalThis as { caches?: { default?: EdgeCache } }).caches?.default;
  if (
    !edge ||
    request.method !== "GET" ||
    request.headers.get("Sec-Fetch-Dest") === "iframe" ||
    !CACHEABLE.some((re) => re.test(url.pathname))
  ) {
    return next();
  }

  const key = new Request(url.toString(), { method: "GET" });
  const hit = await edge.match(key);
  if (hit) {
    const res = new Response(hit.body, hit);
    res.headers.set("X-Edge-Cache", "HIT");
    return res;
  }

  const res = await next();
  const cacheControl = res.headers.get("Cache-Control") ?? "";
  if (res.status === 200 && /s-maxage=\d+/.test(cacheControl) && !res.headers.has("Set-Cookie")) {
    await edge.put(key, res.clone());
  }
  res.headers.set("X-Edge-Cache", "MISS");
  return res;
});
