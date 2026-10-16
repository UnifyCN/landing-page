import { test, expect, type Page } from "@playwright/test";

// Store badges (StoreBadges.astro) and /download. Desktop shows the web app
// button and both store badges; a phone shows only its own store, on one line
// with the web app button. /download forwards phones to their store and shows
// both stores + a QR code everywhere else.
const APP_STORE = "https://apps.apple.com/ca/app/unify-newcomer-support/id6754875762";
const PLAY_STORE = "https://play.google.com/store/apps/details?id=com.anonymous.unifyfrontend";
const IPHONE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1";
const ANDROID_UA =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36";

const hero = (page: Page) => page.locator(".hero-cta-row");
const ios = (page: Page) => hero(page).locator('a.store-badge-link[data-store="ios"]');
const android = (page: Page) => hero(page).locator('a.store-badge-link[data-store="android"]');
const web = (page: Page) => hero(page).locator("a.webapp-badge");

/** Top edges of the visible hero CTAs; one value means one line. */
async function heroLines(page: Page) {
  const tops = await hero(page)
    .locator("a.webapp-badge, a.store-badge-link")
    .evaluateAll((els) =>
      els.filter((el) => getComputedStyle(el).display !== "none").map((el) => Math.round(el.getBoundingClientRect().top)),
    );
  return new Set(tops).size;
}

test.describe("hero store badges on desktop", () => {
  test("web app, App Store, and Google Play sit on one line at 1440px", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await expect(ios(page)).toHaveAttribute("href", APP_STORE);
    await expect(android(page)).toHaveAttribute("href", PLAY_STORE);
    for (const badge of [web(page), ios(page), android(page)]) {
      await expect(badge).toBeVisible();
      expect((await badge.boundingBox())!.height).toBeCloseTo(52, 0);
    }
    expect(await heroLines(page)).toBe(1);
  });
});

for (const [label, ua, mine, other, href] of [
  ["iPhone", IPHONE_UA, "ios", "android", APP_STORE],
  ["Android", ANDROID_UA, "android", "ios", PLAY_STORE],
] as const) {
  test.describe(`hero store badges on ${label}`, () => {
    test.use({ userAgent: ua });

    for (const width of [320, 360, 390, 430]) {
      test(`only the ${mine} badge shows, on one line with the web app, at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto("/");
        const badge = hero(page).locator(`a.store-badge-link[data-store="${mine}"]`);
        await expect(badge).toBeVisible();
        await expect(badge).toHaveAttribute("href", href);
        await expect(hero(page).locator(`a.store-badge-link[data-store="${other}"]`)).toBeHidden();
        expect(await heroLines(page)).toBe(1);
        // Never below Apple's 40px minimum badge height.
        expect((await badge.boundingBox())!.height).toBeGreaterThanOrEqual(40);
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      });
    }
  });
}

test.describe("/download", () => {
  test("shows both stores, a QR code, and the web app on desktop, and is noindex", async ({ page }) => {
    await page.goto("/download");
    await expect(page).toHaveURL(/\/download$/);
    await expect(page.locator("main h1")).toHaveText("Get Unify");
    await expect(page.locator(".dl-qr img")).toBeVisible();
    await expect(page.locator('main a.store-badge-link[data-store="ios"]')).toHaveAttribute("href", APP_STORE);
    await expect(page.locator('main a.store-badge-link[data-store="android"]')).toHaveAttribute("href", PLAY_STORE);
    await expect(page.locator("main a.webapp-badge")).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  for (const [label, ua, store] of [
    ["iPhone", IPHONE_UA, APP_STORE],
    ["Android", ANDROID_UA, PLAY_STORE],
  ] as const) {
    test.describe(label, () => {
      test.use({ userAgent: ua });
      test(`forwards ${label} to its store`, async ({ page }) => {
        // Answer the store request locally so the test never leaves the machine.
        await page.route(/apps\.apple\.com|play\.google\.com/, (route) =>
          route.fulfill({ status: 200, contentType: "text/html", body: "store" }),
        );
        await page.goto("/download");
        await expect(page).toHaveURL(store);
      });
    });
  }
});
