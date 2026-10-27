import { test, expect } from "@playwright/test";

// The platform band is an interactive island (scroll-reveal wired via
// astro:page-load, guarded by data-platform-bound). Guards both the render
// contract and the View-Transition re-binding bug class.
test.describe("WEB + MOBILE platform band", () => {
  test("renders on the homepage with heading, both CTAs, and the device cluster", async ({
    page,
  }) => {
    await page.goto("/");
    const band = page.locator("section.platform");
    await expect(band).toBeVisible();
    await expect(band).toHaveAttribute("data-platform-bound", "true");
    await expect(band.locator(".platform-heading")).toContainText("One platform");

    // Web app badge -> app.unifysocial.ca, then the App Store and Google Play badges.
    await expect(band.locator("a.webapp-badge")).toHaveAttribute(
      "href",
      "https://app.unifysocial.ca",
    );

    // Bring the band into view so the reveal adds .visible (opacity:1) before
    // asserting descendant image visibility.
    await band.scrollIntoViewIfNeeded();
    await expect(band.locator('.store-badge-link[data-store="ios"]')).toBeVisible();
    await expect(band.locator('.store-badge-link[data-store="android"]')).toBeVisible();
    await expect(band.locator(".browser-shot")).toBeVisible();
    await expect(band.locator(".platform-phone")).toBeVisible();
  });

  test("the same Housing card lights up on the phone, then in the browser", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const stage = page.locator("section.platform [data-sync]");
    await stage.scrollIntoViewIfNeeded();
    await expect(stage).toHaveClass(/p-on/);
    await expect(stage).toHaveClass(/w-on/, { timeout: 4000 });
  });

  test("with reduced motion it shows both outlines and does not move", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const stage = page.locator("section.platform [data-sync]");
    await expect(stage).toHaveClass(/p-on/);
    await expect(stage).toHaveClass(/w-on/);
    await expect(page.locator("section.platform")).not.toHaveClass(/animate/);
  });

  test("no horizontal scroll from 320 to 1920", async ({ page }) => {
    for (const width of [320, 375, 700, 810, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await page.locator("section.platform").scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => document.documentElement.scrollWidth), `${width}px`).toBeLessThanOrEqual(width);
    }
  });

  test("re-binds after a View Transition navigation back to home", async ({ page }) => {
    await page.goto("/about");
    await page.locator("a.nav-link", { hasText: "Home" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("section.platform")).toHaveAttribute(
      "data-platform-bound",
      "true",
    );
  });
});
