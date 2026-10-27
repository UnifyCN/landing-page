import { test, expect, devices, type Page } from "@playwright/test";

// The navbar is a full-width bar at the top of the page and folds into a
// compact pill once the page scrolls. It opens back up on hover, keyboard
// focus, a tap (touch), or while a menu or the Get the app panel is open.
// State lives on #nav-wrap[data-compact].

const wrap = (page: Page) => page.locator("#nav-wrap");

async function scrollDown(page: Page) {
  await page.evaluate(() => window.scrollTo(0, 900));
  await expect(wrap(page)).toHaveAttribute("data-compact", "true");
}

test.describe("shapeshifting navbar, desktop", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("full at the top, compact after scrolling, full again at the top", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#nav-pill")).toHaveAttribute("data-nav-bound", "true");
    await expect(wrap(page)).toHaveAttribute("data-compact", "false");
    await scrollDown(page);
    await expect(page.locator("#nav-pill .nav-links")).toHaveCSS("pointer-events", "none");
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(wrap(page)).toHaveAttribute("data-compact", "false");
  });

  test("hovering the pill opens it and leaving folds it again", async ({ page }) => {
    await page.goto("/");
    await scrollDown(page);
    const pill = await page.locator(".nav-bg--pill").boundingBox();
    await page.mouse.move(pill!.x + pill!.width / 2, pill!.y + pill!.height / 2);
    await expect(wrap(page)).toHaveAttribute("data-compact", "false");
    await expect(page.locator("a.nav-link", { hasText: "Events" })).toBeVisible();
    await page.mouse.move(700, 600);
    await expect(wrap(page)).toHaveAttribute("data-compact", "true");
  });

  test("keyboard focus opens it, with a visible focus ring", async ({ page }) => {
    await page.goto("/");
    await scrollDown(page);
    await page.locator("a.nav-link", { hasText: "Events" }).focus();
    await expect(wrap(page)).toHaveAttribute("data-compact", "false");
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    const ring = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
    expect(ring).not.toBe("none");
  });

  test("the Get the app panel still opens from the pill and keeps the bar open", async ({ page }) => {
    await page.goto("/");
    await scrollDown(page);
    await page.locator("#get-app-trigger").click();
    await expect(page.locator("#get-app")).toHaveClass(/is-open/);
    await page.mouse.move(700, 700);
    await expect(wrap(page)).toHaveAttribute("data-compact", "false");
  });

  test("no horizontal scroll in either state", async ({ page }) => {
    for (const width of [320, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/");
      for (const y of [0, 900]) {
        await page.evaluate((v) => window.scrollTo(0, v), y);
        await page.waitForTimeout(100);
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      }
    }
  });
});

test.describe("shapeshifting navbar, reduced motion", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("switches states without animating", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await scrollDown(page);
    const durations = await page.evaluate(() =>
      [".nav-bg--pill", ".nav-logo", ".nav-right", ".nav-links"].map(
        (s) => getComputedStyle(document.querySelector(s)!).transitionDuration,
      ),
    );
    for (const d of durations) expect(d.split(",").every((v) => parseFloat(v) === 0), `transition-duration ${d}`).toBe(true);
  });
});

for (const [name, device] of [
  ["iPhone", devices["iPhone 13"]],
  ["Android", devices["Pixel 7"]],
] as const) {
  test.describe(`shapeshifting navbar on ${name}`, () => {
    // Device size, touch and user agent, without switching browser engine.
    const { defaultBrowserType: _engine, ...phone } = device;
    test.use(phone);

    test("a tap on the pill opens it, scrolling on folds it", async ({ page }) => {
      await page.goto("/");
      await scrollDown(page);
      const pill = await page.locator(".nav-bg--pill").boundingBox();
      await page.touchscreen.tap(pill!.x + pill!.width / 2, pill!.y + pill!.height / 2);
      await expect(wrap(page)).toHaveAttribute("data-compact", "false");
      await expect(page.locator(".nav-mini-wrap")).toHaveCSS("opacity", "1");
      await page.evaluate(() => window.scrollTo(0, 1200));
      await expect(wrap(page)).toHaveAttribute("data-compact", "true");
    });

    test("the menu still opens from the compact pill", async ({ page }) => {
      await page.goto("/");
      await scrollDown(page);
      await page.locator("#nav-toggle").click();
      await expect(page.locator("#mobile-nav")).toHaveClass(/is-open/);
      await expect(page.locator("#nav-toggle")).toHaveAttribute("aria-expanded", "true");
    });

    test("the bar's app button goes to this phone's store", async ({ page }) => {
      await page.goto("/");
      const store = page.locator(".nav-mini--store");
      await expect(store).toBeVisible();
      await expect(page.locator(".nav-mini--web")).toBeHidden();
      await expect(store).toHaveAttribute("href", name === "iPhone" ? /apps\.apple\.com/ : /play\.google\.com/);
    });
  });
}
