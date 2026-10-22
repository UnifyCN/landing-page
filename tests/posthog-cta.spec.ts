import { gunzipSync } from "node:zlib";
import { test, expect, type Page } from "@playwright/test";

// PostHog tracking on the landing page (spec UnifyCN/mobile-app#314, ticket
// #320). The dev server runs on localhost, which is not on the PostHog host
// allowlist, so most tests read the analytics sink: src/scripts/analytics.ts
// dispatches every event it tracks as an `unify:analytics` DOM event on
// document, whether or not PostHog is loaded. The "PostHog" block at the end
// runs the real posthog-js (allowlist widened to localhost, network stubbed)
// and asserts on what it sends, and checks that nothing loads otherwise.
type Tracked = { event: string; properties: Record<string, string> };
type SinkWindow = Window & { __tracked: Tracked[] };

const ANDROID_UA =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36";
const IPHONE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1";

/** Collect tracked events, and keep CTA clicks on the page (no navigation, no popups). */
async function recordAnalytics(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as SinkWindow).__tracked = [];
    document.addEventListener("unify:analytics", (e) => {
      (window as unknown as SinkWindow).__tracked.push((e as CustomEvent<Tracked>).detail);
    });
    // Bubble phase on window runs after the tracker's capture-phase listener.
    window.addEventListener("click", (e) => {
      if ((e.target as Element | null)?.closest?.("a[href^='http']")) e.preventDefault();
    });
  });
}

const tracked = (page: Page, event: string) =>
  page.evaluate((name) => (window as unknown as SinkWindow).__tracked.filter((t) => t.event === name), event);
const ctaClicks = (page: Page) => tracked(page, "cta_clicked").then((list) => list.map((t) => t.properties));

const playReferrer = (placement: string) =>
  `utm_source=unifysocial.ca&utm_medium=website&utm_campaign=landing&utm_content=${placement}`;

test.describe("cta_clicked on desktop", () => {
  test.beforeEach(async ({ page }) => recordAnalytics(page));

  test("hero: web app, App Store, and Google Play each fire once with placement hero", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator(".hero-cta-row");
    await hero.locator("a.webapp-badge").click();
    await hero.locator('a.store-badge-link[data-store="ios"]').click();
    await hero.locator('a.store-badge-link[data-store="android"]').click();
    expect(await ctaClicks(page)).toEqual([
      { target: "web_app", placement: "hero", page: "/" },
      { target: "app_store", placement: "hero", page: "/" },
      { target: "google_play", placement: "hero", page: "/" },
    ]);
  });

  test("platform band and the navbar panel have their own placements", async ({ page }) => {
    await page.goto("/");
    const band = page.locator(".platform-cta-row");
    await band.scrollIntoViewIfNeeded();
    await band.locator("a.webapp-badge").click();
    await band.locator('a.store-badge-link[data-store="android"]').click();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator('#nav-pill a.app-cta[data-app-cta="web"]').click();
    await page.locator("#get-app-trigger").click();
    await page.locator('#get-app-panel a.store-badge-link[data-store="ios"]').click();
    expect(await ctaClicks(page)).toEqual([
      { target: "web_app", placement: "platform_band", page: "/" },
      { target: "google_play", placement: "platform_band", page: "/" },
      { target: "web_app", placement: "navbar", page: "/" },
      { target: "app_store", placement: "navbar_panel", page: "/" },
    ]);
  });

  test("the desktop Get the app disclosure and the /download link are not store clicks", async ({ page }) => {
    await page.goto("/about");
    // Positive control: the tracker is live on this page, so an empty
    // cta_clicked list below means "not a CTA", not "nothing is listening".
    await expect.poll(() => tracked(page, "$pageview").then((l) => l.length)).toBe(1);

    await page.locator("#get-app-trigger").click();
    await page.keyboard.press("Escape");
    const bandDownload = page.locator('section.cta-wrap a.cta-btn[data-app-cta="store"]');
    await bandDownload.scrollIntoViewIfNeeded();
    await expect(bandDownload).toHaveAttribute("href", "/download");
    await bandDownload.click();
    await expect(page).toHaveURL(/\/download$/);
    expect(await ctaClicks(page)).toEqual([]);

    // Same page, same listener: a real CTA still fires.
    await page.locator('#nav-pill a.app-cta[data-app-cta="web"]').click();
    expect(await ctaClicks(page)).toEqual([{ target: "web_app", placement: "navbar", page: "/download" }]);
  });

  test("CTA band web button, after a View Transition navigation, fires exactly once", async ({ page }) => {
    await page.goto("/");
    await page.locator("a.nav-link", { hasText: "About" }).click();
    await expect(page).toHaveURL(/\/about$/);
    const band = page.locator("section.cta-wrap");
    await band.scrollIntoViewIfNeeded();
    await band.locator('a.cta-btn[data-app-cta="web"]').click();
    expect(await ctaClicks(page)).toEqual([{ target: "web_app", placement: "cta_band", page: "/about" }]);
  });

  test("search CTA, guide tool links, What's new, and /download", async ({ page }) => {
    await page.goto("/teer");
    await page.locator('[data-search-cta][data-placement="intro"] a[data-cta-platform="web"]').click();
    await page.locator('[data-search-cta][data-placement="end"] a[data-cta-platform="android"]').click();
    expect(await ctaClicks(page)).toEqual([
      { target: "web_app", placement: "search_cta_intro", page: "/teer" },
      { target: "google_play", placement: "search_cta_end", page: "/teer" },
    ]);
    await expect(page.locator('[data-search-cta][data-placement="end"] a[data-cta-platform="android"]')).toHaveAttribute(
      "href",
      /referrer=/,
    );

    await page.goto("/canadian-resume");
    await page.locator("a.cl-tool").first().click();
    expect(await ctaClicks(page)).toEqual([{ target: "web_app", placement: "canadian_resume", page: "/canadian-resume" }]);

    await page.goto("/whats-new");
    await page.locator("a.wn-link").first().click();
    expect(await ctaClicks(page)).toEqual([{ target: "web_app", placement: "whats_new", page: "/whats-new" }]);

    await page.goto("/download");
    await page.locator('main a.store-badge-link[data-store="android"]').click();
    await page.locator("main a.webapp-badge").click();
    expect(await ctaClicks(page)).toEqual([
      { target: "google_play", placement: "download_page", page: "/download" },
      { target: "web_app", placement: "download_page", page: "/download" },
    ]);
  });

  test("every Google Play link on the page carries the referrer for its placement", async ({ page }) => {
    for (const [path, placements] of [
      ["/", ["hero", "platform_band", "navbar_panel"]],
      ["/download", ["download_page", "navbar_panel"]],
      ["/teer", ["search_cta_intro", "search_cta_end", "navbar_panel"]],
    ] as const) {
      await page.goto(path);
      const referrers = await page
        .locator('a[href^="https://play.google.com/"]')
        .evaluateAll((links) => links.map((a) => new URL((a as HTMLAnchorElement).href).searchParams.get("referrer")));
      expect(referrers.sort(), path).toEqual(placements.map(playReferrer).sort());
    }
  });
});

test.describe("cta_clicked on Android", () => {
  test.use({ userAgent: ANDROID_UA, viewport: { width: 412, height: 915 } });
  test.beforeEach(async ({ page }) => recordAnalytics(page));

  test("store links pointed at Google Play keep their placement's referrer and fire google_play", async ({ page }) => {
    await page.goto("/about");
    const band = page.locator('section.cta-wrap a.cta-btn[data-app-cta="store"]');
    await band.scrollIntoViewIfNeeded();
    await expect(band).toHaveAttribute("href", /^https:\/\/play\.google\.com\//);
    expect(new URL((await band.getAttribute("href"))!).searchParams.get("referrer")).toBe(playReferrer("cta_band"));
    await band.click();

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator("#nav-toggle").click();
    const menuStore = page.locator('#mobile-nav a.app-cta[data-app-cta="store"]');
    expect(new URL((await menuStore.getAttribute("href"))!).searchParams.get("referrer")).toBe(playReferrer("mobile_nav"));
    await menuStore.click();

    expect(await ctaClicks(page)).toEqual([
      { target: "google_play", placement: "cta_band", page: "/about" },
      { target: "google_play", placement: "mobile_nav", page: "/about" },
    ]);
  });
});

test.describe("cta_clicked on iPhone", () => {
  test.use({ userAgent: IPHONE_UA, viewport: { width: 390, height: 844 } });
  test.beforeEach(async ({ page }) => recordAnalytics(page));

  test("the CTA band store button fires app_store", async ({ page }) => {
    await page.goto("/about");
    const band = page.locator('section.cta-wrap a.cta-btn[data-app-cta="store"]');
    await band.scrollIntoViewIfNeeded();
    await band.click();
    expect(await ctaClicks(page)).toEqual([{ target: "app_store", placement: "cta_band", page: "/about" }]);
  });
});

test.describe("$pageview", () => {
  test.beforeEach(async ({ page }) => recordAnalytics(page));

  test("one per page, including View Transition navigations", async ({ page }) => {
    await page.goto("/");
    await expect.poll(() => tracked(page, "$pageview").then((l) => l.length)).toBe(1);
    await page.locator("a.nav-link", { hasText: "About" }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect.poll(() => tracked(page, "$pageview").then((l) => l.map((t) => new URL(t.properties.$current_url).pathname))).toEqual(["/", "/about"]);
  });
});

// --- PostHog itself -------------------------------------------------------

type Sent = { event: string; properties: Record<string, unknown> };

/** A posthog-js request body as text: gzip-js, base64 form (data=...), or plain. */
function decodeBody(url: string, body: Buffer): string {
  const gzip = body[0] === 0x1f && body[1] === 0x8b;
  if (gzip || new URL(url).searchParams.get("compression") === "gzip-js") return gunzipSync(body).toString("utf8");
  const raw = body.toString("utf8");
  if (raw.startsWith("data=")) {
    const data = new URLSearchParams(raw).get("data") ?? "";
    return Buffer.from(data, "base64").toString("utf8");
  }
  return raw;
}

/** The events in a decoded request body (none for /flags/ and the like). */
function decodeEvents(text: string): Sent[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return [];
  }
  const list = Array.isArray(parsed) ? parsed : (parsed as { batch?: unknown[] }).batch ?? [parsed];
  return (list as Sent[]).filter((e) => typeof e?.event === "string");
}

// What the stubbed project settings ask for: session replay, autocapture,
// heatmaps, dead clicks, web vitals, exception capture and surveys all on.
// The tests show the landing page's own config keeps every one of them off.
const REMOTE_CONFIG = {
  sessionRecording: { endpoint: "/s/" },
  autocapture_opt_out: false,
  heatmaps: true,
  captureDeadClicks: true,
  capturePerformance: { web_vitals: true, network_timing: true },
  autocaptureExceptions: true,
  surveys: true,
  supportedCompression: ["gzip-js", "base64"],
};

/**
 * Answer every request to PostHog's hosts locally, so nothing reaches the
 * production project, and record everything posthog-js sends.
 */
async function stubPostHogNetwork(page: Page) {
  const sent: Sent[] = [];
  /** Every request to a PostHog host: its URL and decoded body. */
  const traffic: { url: string; body: string }[] = [];
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.route(/^https:\/\/([a-z0-9-]+\.)*posthog\.com\//, async (route) => {
    const request = route.request();
    const raw = request.postDataBuffer();
    const body = raw ? decodeBody(request.url(), raw) : "";
    traffic.push({ url: request.url(), body });
    sent.push(...decodeEvents(body));
    const isScript = new URL(request.url()).pathname.endsWith(".js");
    await route.fulfill({
      status: 200,
      contentType: isScript ? "text/javascript" : "application/json",
      body: isScript ? "" : JSON.stringify(REMOTE_CONFIG),
    });
  });
  return {
    sent,
    traffic,
    /** posthog-js itself (the Vite dep chunk) or any request to a PostHog host. */
    posthogRequests: () => requests.filter((u) => /posthog-js|posthog\.com/.test(u)),
    /** Everything sent to PostHog, URLs and decoded bodies, as one string. */
    everything: () => traffic.map((t) => `${t.url}\n${t.body}`).join("\n"),
  };
}

/**
 * Wait until posthog-js has initialized (it sets its cookie). On a cold dev
 * server Vite pre-bundles posthog-js on first request and reloads the page,
 * which would drop a click made before it.
 */
async function waitForPostHog(page: Page) {
  await expect
    .poll(() => page.evaluate(() => /ph_phc_[^=]+_posthog=/.test(document.cookie)), { timeout: 20_000 })
    .toBe(true);
}

/** The email and every encoding of it a request could carry. */
const EMAIL_FORMS = ["alice", "example.test", "%40example"];

/** Test-only allowlist (dev server only), read by src/scripts/analytics.ts. */
async function allowAnalyticsHosts(page: Page, hosts: string[]) {
  await page.addInitScript((list) => {
    (window as unknown as { __unifyAnalyticsHosts: string[] }).__unifyAnalyticsHosts = list;
  }, hosts);
}

const DESKTOP_CHROME_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36";

/**
 * posthog-js drops every event from a likely bot: a HeadlessChrome user agent
 * or brand, or navigator.webdriver. Playwright's Chromium is all three, so hide
 * them here (the UA via test.use) rather than loosen the production config.
 */
async function looksLikeAPerson(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, "webdriver", { get: () => false });
    Object.defineProperty(Navigator.prototype, "userAgentData", { get: () => undefined });
  });
}

test.describe("PostHog", () => {
  test.use({ userAgent: DESKTOP_CHROME_UA });
  test.beforeEach(async ({ page }) => looksLikeAPerson(page));

  test("on an allowed host, posthog-js loads and sends $pageview and cta_clicked with platform=landing", async ({
    page,
  }) => {
    const posthog = await stubPostHogNetwork(page);
    await allowAnalyticsHosts(page, ["localhost"]);
    await recordAnalytics(page);
    await page.goto("/");
    await waitForPostHog(page);
    await page.locator('.hero-cta-row a.store-badge-link[data-store="android"]').click();

    // These come from posthog-js's own requests, so this fails if posthog-js
    // is missing, never loads, or never captures.
    const sentEvent = (name: string) => posthog.sent.find((e) => e.event === name)?.properties;
    await expect.poll(() => sentEvent("cta_clicked")).toMatchObject({
      target: "google_play",
      placement: "hero",
      page: "/",
      platform: "landing",
      token: expect.stringMatching(/^phc_/),
    });
    await expect.poll(() => sentEvent("$pageview")).toMatchObject({ $pathname: "/", platform: "landing" });
    // Session recording is off: the recorder is never fetched, nothing is sent to /s/.
    await page.waitForTimeout(1000);
    expect(posthog.posthogRequests().filter((u) => /recorder|\/s\//.test(u))).toEqual([]);
  });

  test("URLs are scrubbed before sending: only utm_*, ref, gclid, fbclid survive, no fragments", async ({ page }) => {
    const posthog = await stubPostHogNetwork(page);
    await allowAnalyticsHosts(page, ["localhost"]);
    await recordAnalytics(page);
    await page.goto("/?email=alice%40example.test&utm_source=x&gclid=y&name=Alice#frag", {
      referer: "https://www.google.com/search?q=alice%40example.test#top",
    });
    await waitForPostHog(page);
    await page.locator('.hero-cta-row a.store-badge-link[data-store="android"]').click();

    const sentEvent = (name: string) => posthog.sent.find((e) => e.event === name) as Sent;
    await expect.poll(() => sentEvent("cta_clicked")?.properties).toBeTruthy();
    await expect.poll(() => sentEvent("$pageview")?.properties).toBeTruthy();

    const url = new URL("/?utm_source=x&gclid=y", page.url()).href;
    const google = "https://www.google.com/search";
    for (const name of ["$pageview", "cta_clicked"]) {
      expect(sentEvent(name).properties, name).toMatchObject({
        $current_url: url,
        $referrer: google,
        $session_entry_url: url,
        $session_entry_referrer: google,
        utm_source: "x",
        gclid: "y",
      });
    }
    expect(sentEvent("cta_clicked").properties.page).toBe("/");

    // The visitor's first page as posthog-js stores it on .unifysocial.ca, and
    // as the web app later sends it ($initial_current_url, $initial_referrer,
    // $initial_utm_source, $initial_gclid) when the visitor signs up.
    const stored = await page.evaluate(() => {
      const key = Object.keys(localStorage).find((k) => /^ph_phc_.+_posthog$/.test(k));
      return { local: key ? localStorage.getItem(key) : null, cookie: document.cookie };
    });
    const persisted = JSON.parse(stored.local ?? "{}");
    expect(persisted.$initial_person_info).toEqual({ r: google, u: url });

    // Nothing sent to PostHog, and nothing in the cookie the web app reads,
    // carries the email, the name, the search query or a fragment. (The raw
    // URL stays only in this origin's localStorage, on the visitor's device.)
    expect(decodeURIComponent(stored.cookie)).toContain("$initial_person_info");
    const everything = JSON.stringify(posthog.sent) + decodeURIComponent(stored.cookie);
    for (const leak of ["alice", "Alice", "example.test", "#frag", "#top"]) expect(everything, leak).not.toContain(leak);
  });

  test("no feature flag request: a search query in the referrer never leaves the page", async ({ page }) => {
    const posthog = await stubPostHogNetwork(page);
    await allowAnalyticsHosts(page, ["localhost"]);
    await recordAnalytics(page);
    await page.goto("/?utm_source=x", { referer: "https://www.google.com/search?q=alice%40example.test" });
    await waitForPostHog(page);
    await page.locator('.hero-cta-row a.store-badge-link[data-store="android"]').click();
    await expect.poll(() => posthog.sent.map((e) => e.event)).toEqual(expect.arrayContaining(["$pageview", "cta_clicked"]));
    await page.waitForTimeout(1500);

    const paths = posthog.traffic.map((t) => new URL(t.url).pathname);
    expect(paths.filter((p) => /\/(flags|decide)\b/.test(p))).toEqual([]);
    // Nor remote config or any other PostHog script: only event batches go out.
    expect(paths.filter((p) => !/^\/(e|i\/v0\/e|batch)\/$/.test(p))).toEqual([]);
    const everything = posthog.everything();
    for (const leak of EMAIL_FORMS) expect(everything, leak).not.toContain(leak);
  });

  test("no autocapture: clicking a link with an email in its href sends nothing that carries it", async ({ page }) => {
    const posthog = await stubPostHogNetwork(page);
    await allowAnalyticsHosts(page, ["localhost"]);
    await recordAnalytics(page);
    await page.goto("/");
    await waitForPostHog(page);
    await page.evaluate(() => {
      const link = document.createElement("a");
      link.id = "leaky-link";
      link.href = "/?email=alice%40example.test&utm_source=x";
      link.textContent = "Continue";
      document.querySelector("main")!.prepend(link);
    });
    await page.locator("#leaky-link").click();
    // The next page view still arrives, scrubbed, with its UTM.
    await expect
      .poll(() => posthog.sent.filter((e) => e.event === "$pageview").map((e) => e.properties.$current_url))
      .toContainEqual(new URL("/?utm_source=x", page.url()).href);
    // Past a batch flush, so a queued $autocapture would have gone out.
    await page.waitForTimeout(3500);

    const events = posthog.sent.map((e) => e.event);
    for (const off of ["$autocapture", "$rageclick", "$dead_click", "$$heatmap", "$web_vitals", "$exception"]) {
      expect(events, off).not.toContain(off);
    }
    const everything = posthog.everything();
    for (const leak of EMAIL_FORMS) expect(everything, leak).not.toContain(leak);
  });

  for (const [label, hosts] of [
    ["no override", null],
    ["the production allowlist", ["unifysocial.ca", "www.unifysocial.ca"]],
  ] as const) {
    test(`a non-production host (localhost, ${label}) never loads PostHog`, async ({ page }) => {
      const posthog = await stubPostHogNetwork(page);
      if (hosts) await allowAnalyticsHosts(page, [...hosts]);
      await recordAnalytics(page);
      await page.goto("/");
      await page.locator('.hero-cta-row a.store-badge-link[data-store="android"]').click();
      // The tracker ran (the sink saw the click)...
      expect(await ctaClicks(page)).toEqual([{ target: "google_play", placement: "hero", page: "/" }]);
      // ...and past the 3 s load fallback, posthog-js was never requested and nothing was sent.
      await page.waitForTimeout(4000);
      expect(posthog.posthogRequests()).toEqual([]);
      expect(posthog.sent).toEqual([]);
    });
  }
});
