import { test, expect } from "@playwright/test";
import { partners } from "../src/lib/partners";

// Home page partners: one grid of every partner logo with its kind shown on
// hover, focus or touch, and a one-time load-in from the Unify logo shape.

test.describe("home partners", () => {
  test("lists every partner from the data, each linking to its page", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#partners-heading")).toContainText(`Built with ${partners.length} partners.`);
    const tiles = page.locator(".pw-tile");
    await expect(tiles).toHaveCount(partners.length);
    for (const [i, p] of partners.entries()) {
      await expect(tiles.nth(i)).toHaveAttribute("href", `/partners/${p.slug}`);
    }
  });

  test("keyboard focus shows what kind of partner it is", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const tile = page.locator(".pw-tile").first();
    await tile.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(tile.locator(".pw-kind")).toHaveCSS("opacity", "1");
    expect(await tile.evaluate((el) => getComputedStyle(el).outlineStyle)).not.toBe("none");
  });

  test("the load-in plays once when the section scrolls into view", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");
    const section = page.locator("[data-partners]");
    await expect(section).toHaveAttribute("data-partners-bound", "true");
    await expect(section).toHaveClass(/pw-armed/);
    await page.locator(".pw-grid").scrollIntoViewIfNeeded();
    await expect(section).toHaveClass(/pw-in/);
    // When it has settled the classes are removed and do not come back.
    await expect(section).not.toHaveClass(/pw-armed/, { timeout: 5000 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator(".pw-grid").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await expect(section).not.toHaveClass(/pw-armed|pw-in/);
  });

  test("with reduced motion the grid is simply there", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("[data-partners]")).not.toHaveClass(/pw-armed/);
    await page.locator(".pw-grid").scrollIntoViewIfNeeded();
    await expect(page.locator(".pw-cell").first()).toHaveCSS("opacity", "1");
  });

  test("no horizontal scroll from 320 to 1920", async ({ page }) => {
    for (const width of [320, 375, 810, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await page.locator(".pw-grid").scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => document.documentElement.scrollWidth), `${width}px`).toBeLessThanOrEqual(width);
    }
  });
});
