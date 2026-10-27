import { test, expect, type Page } from "@playwright/test";

// Home hero: the logo ring with feature reveals and the seven-language welcome.
// It is an island bound through astro:page-load with a data-hero-bound guard.

const pressedFeature = (page: Page) =>
  page.locator(".feats button[aria-pressed='true']").getAttribute("data-f");
const shownWord = (page: Page) => page.locator(".hero-words > span.on").getAttribute("lang");

test.describe("home hero", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
  });

  test("binds once, keeps the SEO phrase next to the H1", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("[data-hero]")).toHaveAttribute("data-hero-bound", "true");
    // document.querySelectorAll, not a locator: locators also see the h1s
    // inside the Astro dev toolbar's shadow DOM.
    expect(await page.evaluate(() => document.querySelectorAll("h1").length)).toBe(1);
    await expect(page.locator("h1.hero-h1")).toHaveText("Let's get you settled in Canada.");
    await expect(page.locator(".hero-desc")).toContainText("newcomer settlement platform");
  });

  test("features and the welcome cycle on their own", async ({ page }) => {
    await page.goto("/");
    await page.mouse.move(5, 890);
    expect(await pressedFeature(page)).toBe("checklist");
    await expect.poll(() => pressedFeature(page), { timeout: 6000 }).not.toBe("checklist");
    expect(await shownWord(page)).not.toBe("en");
  });

  test("hovering the visual pauses the features", async ({ page }) => {
    await page.goto("/");
    await page.locator(".hero-visual .phone").hover();
    const first = await pressedFeature(page);
    await page.waitForTimeout(4000);
    expect(await pressedFeature(page)).toBe(first);
  });

  test("keyboard focus pauses the features, and a chip pins one", async ({ page }) => {
    await page.goto("/");
    await page.locator(".feats button[data-f='learn']").focus();
    const paused = await pressedFeature(page);
    await page.waitForTimeout(3600);
    expect(await pressedFeature(page)).toBe(paused);
    await page.keyboard.press("Enter");
    expect(await pressedFeature(page)).toBe("learn");
    await expect(page.locator(".scr img.on")).toHaveAttribute("data-f", "learn");
  });

  test("a language chip shows the welcome in that language and stops the cycle", async ({ page }) => {
    await page.goto("/");
    await page.locator(".hero-langs button[lang='pa']").click();
    expect(await shownWord(page)).toBe("pa");
    await page.waitForTimeout(3000);
    expect(await shownWord(page)).toBe("pa");
    await expect(page.locator(".hero-langs button[lang='pa']")).toHaveAttribute("aria-pressed", "true");
  });

  test("no horizontal scroll from 320 to 1920", async ({ page }) => {
    for (const width of [320, 375, 600, 810, 1024, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      expect(await page.evaluate(() => document.documentElement.scrollWidth), `${width}px`).toBeLessThanOrEqual(width);
    }
  });
});

test.describe("home hero, reduced motion", () => {
  test("nothing cycles and nothing is left hidden", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForTimeout(3500);
    expect(await pressedFeature(page)).toBe("checklist");
    expect(await shownWord(page)).toBe("en");
    const hidden = await page.evaluate(() =>
      [".hero-rating", ".hero-welcome", ".hero-h1", ".hero-desc", ".hero-cta-row", ".hero-visual"].filter(
        (s) => getComputedStyle(document.querySelector(s)!).opacity !== "1",
      ),
    );
    expect(hidden).toEqual([]);
  });
});
