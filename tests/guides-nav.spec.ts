import { test, expect } from "@playwright/test";
import { GUIDE_HUBS } from "../src/lib/guide-hubs";

// The guide hubs used to be reachable from the footer only. They now have a
// "Guides" tab in the navbar (two-column dropdown on desktop, folded group in
// the mobile menu) and an index section on the home page. The navbar carries
// transition:persist, so these also guard the menu after client-side navs.
test.describe("Guides menu on desktop", () => {
  test("the dropdown lists every hub and navigates", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("#nav-pill")).toHaveAttribute("data-nav-bound", "true");

    const caret = page.getByRole("button", { name: "More in Guides" });
    const menu = page.locator("#nav-menu-guides");
    await caret.click();
    await expect(caret).toHaveAttribute("aria-expanded", "true");
    await expect(menu).toBeVisible();

    const links = menu.locator("a.nav-menu-link");
    await expect(links).toHaveCount(GUIDE_HUBS.length);
    for (const hub of GUIDE_HUBS) {
      await expect(menu.locator(`a.nav-menu-link[href="${hub.href}"]`)).toBeVisible();
    }

    // Two columns: the first two links share a row.
    const first = (await links.nth(0).boundingBox())!;
    const second = (await links.nth(1).boundingBox())!;
    expect(Math.abs(first.y - second.y)).toBeLessThan(2);
    expect(second.x).toBeGreaterThan(first.x + first.width - 1);

    await menu.locator('a.nav-menu-link[href="/banking"]').click();
    await expect(page).toHaveURL(/\/banking$/);
    // The parent reads active on a child's page; the menu closed on navigation.
    await expect(page.locator("a.nav-link", { hasText: "Guides" })).toHaveClass(/nav-link-active/);
    await expect(menu).toBeHidden();
  });

  test("the Guides tab itself goes to the home page guide index", async ({ page }) => {
    await page.goto("/about");
    await page.locator("a.nav-link", { hasText: "Guides" }).click();
    await expect(page).toHaveURL(/\/#guides$/);
    await expect(page.locator("#guides")).toBeInViewport();
    // On the home page neither Home's nor Guides' active state is wrong.
    await expect(page.locator("a.nav-link", { hasText: "Home" })).toHaveClass(/nav-link-active/);
    await expect(page.locator("a.nav-link", { hasText: "Guides" })).not.toHaveClass(/nav-link-active/);
  });

  test("the menu fits a 1024px wide, 700px tall window", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 700 });
    await page.goto("/about");
    await page.getByRole("button", { name: "More in Guides" }).click();
    const box = (await page.locator("#nav-menu-guides .nav-menu-list").boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(1024);
    expect(box.y + box.height).toBeLessThanOrEqual(700);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1024);
  });
});

test.describe("Guides group in the mobile menu", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("starts folded, opens from its summary, and navigates", async ({ page }) => {
    await page.goto("/");
    await page.locator("#nav-toggle").click();
    const menu = page.locator("#mobile-nav");
    await expect(menu).toHaveClass(/is-open/);

    const group = menu.locator("details.mobile-group");
    await expect(group).not.toHaveAttribute("open", "");
    await group.locator("summary").click();
    await expect(group).toHaveAttribute("open", "");
    await expect(group.locator("a.mobile-sub-link")).toHaveCount(GUIDE_HUBS.length);

    await group.locator('a.mobile-sub-link[href="/health-card"]').click();
    await expect(page).toHaveURL(/\/health-card$/);
    await expect(menu).not.toHaveClass(/is-open/);

    // Reopened on a guide page: the group is open on the current guide.
    await page.locator("#nav-toggle").click();
    await expect(group).toHaveAttribute("open", "");
    await expect(group.locator('a.mobile-sub-link[href="/health-card"]')).toHaveClass(/mobile-nav-link-active/);
  });
});

test.describe("home page guide index and footer", () => {
  test("links every hub from the page body", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("section#guides");
    await expect(section.locator("h2")).toHaveText("Settling in Canada, one step at a time");
    await expect(section.locator("a.gh-link")).toHaveCount(GUIDE_HUBS.length);
    for (const hub of GUIDE_HUBS) {
      await expect(section.locator(`a.gh-link[href="${hub.href}"]`)).toHaveCount(1);
    }
    // Still one h1 on the home page.
    await expect(page.locator("main h1")).toHaveCount(1);

    await section.locator('a.gh-link[href="/new-to-canada"]').click();
    await expect(page).toHaveURL(/\/new-to-canada$/);
  });

  test("the footer links /who-is-a-newcomer", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator('footer a[href="/who-is-a-newcomer"]')).toHaveCount(1);
  });

  for (const width of [320, 768, 1024, 1920]) {
    test(`the guide index has no sideways scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/");
      await page.locator("section#guides").scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    });
  }
});

test.describe("phone-width overflow fixes", () => {
  for (const width of [320, 360]) {
    test(`/drivers-licence has no sideways scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 700 });
      await page.goto("/drivers-licence");
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    });
  }

  test("the mobile menu's filled CTA fits its column at 320px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto("/about");
    await page.locator("#nav-toggle").click();
    await expect(page.locator("#mobile-nav")).toHaveClass(/is-open/);
    const fits = await page
      .locator("#mobile-nav .app-ctas--stacked")
      .evaluate((el) => el.scrollWidth <= el.clientWidth);
    expect(fits).toBe(true);
  });
});
