import { test, expect } from "@playwright/test";

// About page, "The Problem": each problem leads with the figure it cites.
test.describe("about problem stats", () => {
  test("the figures match the text they come from, with sources", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/about");
    const rows = page.locator(".ap .ap-card");
    await expect(rows).toHaveCount(3);
    for (const [i, stat] of ["62%", "70%"].entries()) {
      await expect(rows.nth(i).locator(".ap-stat")).toHaveText(stat);
      await expect(rows.nth(i).locator(".ap-card-body")).toContainText(stat);
      await expect(rows.nth(i).locator(".ap-card-source")).toContainText("Source:");
    }
    await expect(rows.nth(2).locator(".ap-stat")).toHaveCount(0);
    // No figure for "No clear roadmap": a broken dotted route stands in for it.
    await expect(rows.nth(2).locator(".ap-noroute")).toBeVisible();
  });

  test("no horizontal scroll from 320 to 1920", async ({ page }) => {
    for (const width of [320, 375, 810, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/about");
      await page.locator(".ap").scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => document.documentElement.scrollWidth), `${width}px`).toBeLessThanOrEqual(width);
    }
  });
});
