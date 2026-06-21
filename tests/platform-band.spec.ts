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

    // Two equal CTAs: brand-red web-app badge → app.unifysocial.ca, + App Store badge.
    await expect(band.locator("a.webapp-badge")).toHaveAttribute(
      "href",
      "https://app.unifysocial.ca",
    );

    // Bring the band into view so the reveal adds .visible (opacity:1) before
    // asserting descendant image visibility.
    await band.scrollIntoViewIfNeeded();
    await expect(band.locator(".platform-badge")).toBeVisible();
    await expect(band.locator(".browser-shot")).toBeVisible();
    await expect(band.locator(".platform-phone")).toBeVisible();
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
