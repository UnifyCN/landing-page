import { test, expect } from "@playwright/test";

// /whats-new renders src/lib/whats-new.ts. These assert the page's contract
// (order, shape, links), not the wording of any one entry, so editing the list
// does not break them.
test.describe("what's new", () => {
  test("lists dated entries, newest first", async ({ page }) => {
    await page.goto("/whats-new");
    await expect(page.locator("main h1")).toHaveText("What's new in Unify");

    const items = page.locator(".wn-item");
    const count = await items.count();
    expect(count).toBeGreaterThan(0);

    const dates = await page.locator(".wn-item time").evaluateAll((els) =>
      els.map((el) => el.getAttribute("datetime") ?? ""),
    );
    expect(dates).toHaveLength(count);
    for (const d of dates) expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(dates).toEqual([...dates].sort().reverse());

    for (let i = 0; i < count; i++) {
      await expect(items.nth(i).locator("h2")).not.toBeEmpty();
      await expect(items.nth(i).locator(".wn-desc")).not.toBeEmpty();
    }
  });

  test("copy has no em dashes and web app links use app.unifysocial.ca", async ({ page }) => {
    await page.goto("/whats-new");
    expect(await page.locator(".wn-list").innerText()).not.toMatch(/\u2014/);

    const hrefs = await page.locator(".wn-link").evaluateAll((els) =>
      els.map((el) => el.getAttribute("href") ?? ""),
    );
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(href.startsWith("https://app.unifysocial.ca") || href.startsWith("/")).toBe(true);
    }
  });

  test("is linked from the home page and the footer", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('section.platform a.platform-new[href="/whats-new"]')).toHaveCount(1);
    await expect(page.locator('footer a[href="/whats-new"]')).toHaveCount(1);

    await page.locator('footer a[href="/whats-new"]').click();
    await expect(page).toHaveURL(/\/whats-new$/);
    await expect(page.locator("main h1")).toHaveText("What's new in Unify");
  });

  test("fits a 320px phone without horizontal scroll", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto("/whats-new");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  });
});
