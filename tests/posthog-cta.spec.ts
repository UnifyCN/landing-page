import { test, expect, type Page } from "@playwright/test";

// PostHog tracking on the landing page (spec UnifyCN/mobile-app#314, ticket
// #320). The dev server runs on localhost, where PostHog is never loaded, so
// these tests read the analytics sink instead: src/scripts/analytics.ts
// dispatches every event it tracks as an `unify:analytics` DOM event on
// document, whether or not PostHog is loaded. The real network payload on a
// production build is checked separately (see the PR).
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
    await page.locator("#get-app-trigger").click();
    await page.keyboard.press("Escape");
    expect(await ctaClicks(page)).toEqual([]);
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
