import { test, expect, type Page } from "@playwright/test";

// The home hero (Hero.astro): H1, web app button, both store badges, and the
// web plus phone image. The badge clicks are answered by a stub so the test
// never leaves for the real stores; it checks that each click opens the right
// store in a new tab.
const APP_STORE = "https://apps.apple.com/ca/app/unify-canada-newcomer-guide/id6754875762";
const PLAY_STORE = "https://play.google.com/store/apps/details?id=com.anonymous.unifyfrontend";
const PLAY_HERO = `${PLAY_STORE}&referrer=utm_source%3Dunifysocial.ca%26utm_medium%3Dwebsite%26utm_campaign%3Dlanding%26utm_content%3Dhero`;

const hero = (page: Page) => page.locator("section.hero");
const badge = (page: Page, store: "ios" | "android") =>
  hero(page).locator(`a.store-badge-link[data-store="${store}"]`);

for (const width of [375, 1440]) {
  test(`hero renders with the App Store and Google Play buttons at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(hero(page).locator("h1")).toHaveText("The all-in-one newcomer settlement platform");
    await expect(hero(page).locator("a.webapp-badge")).toBeVisible();
    const devices = hero(page).locator("img.hero-devices");
    await expect(devices).toBeVisible();
    await expect.poll(() => devices.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth)).toBeGreaterThan(0);
    for (const [store, href] of [["ios", APP_STORE], ["android", PLAY_HERO]] as const) {
      const link = badge(page, store);
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", href);
      await expect(link).toHaveAttribute("target", "_blank");
      const img = link.locator("img");
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth)).toBeGreaterThan(0);
    }
  });
}

test("each hero store badge opens its store in a new tab", async ({ page, context }) => {
  await context.route(/^https:\/\/(apps\.apple\.com|play\.google\.com)\//, (route) =>
    route.fulfill({ status: 200, contentType: "text/html", body: "<title>store</title>" }),
  );
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  for (const [store, href] of [["ios", APP_STORE], ["android", PLAY_HERO]] as const) {
    const [tab] = await Promise.all([context.waitForEvent("page"), badge(page, store).click()]);
    await tab.waitForLoadState("domcontentloaded");
    expect(tab.url()).toBe(href);
    await tab.close();
  }
});
