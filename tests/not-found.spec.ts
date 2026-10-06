import { test, expect } from "@playwright/test";

// src/pages/404.astro: the branded 404 that unknown paths, unknown blog slugs
// and unknown event ids all resolve to (the last two via Astro.rewrite).
const HUBS = [
  "/new-to-canada",
  "/newcomer-benefits",
  "/banking",
  "/health-card",
  "/drivers-licence",
  "/teer",
  "/credentials",
  "/canadian-resume",
  "/who-is-a-newcomer",
];

test.describe("404 page", () => {
  test("an unknown path returns 404 with the normal layout and every guide hub", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist-xyz");
    expect(response!.status()).toBe(404);

    await expect(page).toHaveTitle("Page Not Found | Unify Social");
    // Canonical names the URL that was asked for, never /404.
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://unifysocial.ca/this-page-does-not-exist-xyz",
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator("#nav-pill")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator("main h1")).toHaveText("We can't find that page.");

    for (const href of HUBS) {
      await expect(page.locator(`main a.cl-card[href="${href}"]`)).toBeVisible();
    }
    // The sitewide CTA band (and its web app button) is on the 404 too.
    await expect(page.locator('section.cta-wrap a[data-app-cta="web"]')).toHaveAttribute(
      "href",
      /^https:\/\/app\.unifysocial\.ca\//,
    );
  });

  test("a hub card leaves the 404 by client-side navigation", async ({ page }) => {
    await page.goto("/this-page-does-not-exist-xyz");
    await page.locator('main a.cl-card[href="/banking"]').click();
    await expect(page).toHaveURL(/\/banking$/);
    await expect(page.locator("main h1")).toHaveCount(1);
  });

  test("fits a 320px phone without horizontal scroll", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto("/this-page-does-not-exist-xyz");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  });
});
