import { test, expect } from "@playwright/test";

// Phone viewport — the hamburger nav replaces the inline desktop nav below the
// 1400px `desktop` breakpoint.
test.use({ viewport: { width: 375, height: 812 } });

test.describe("mobile navigation", () => {
  test("hamburger opens and closes the menu", async ({ page }) => {
    await page.goto("/");

    const toggle = page.locator("#nav-toggle");
    const menu = page.locator("#mobile-nav");

    await expect(page.locator("#nav-pill")).toHaveAttribute("data-nav-bound", "true");
    await expect(menu).not.toHaveClass(/is-open/);

    await toggle.click();
    await expect(menu).toHaveClass(/is-open/);
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect
      .poll(() => page.evaluate(() => document.body.style.overflow))
      .toBe("hidden");

    await page.locator("#nav-close").click();
    await expect(menu).not.toHaveClass(/is-open/);
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect
      .poll(() => page.evaluate(() => document.body.style.overflow))
      .toBe("");
  });

  test("a menu link navigates and closes the menu", async ({ page }) => {
    await page.goto("/");

    await page.locator("#nav-toggle").click();
    await expect(page.locator("#mobile-nav")).toHaveClass(/is-open/);

    await page
      .locator("#mobile-nav a.mobile-nav-link", { hasText: "About" })
      .click();

    await expect(page).toHaveURL(/\/about$/);
    await expect(page.locator("#mobile-nav")).not.toHaveClass(/is-open/);
  });
});
