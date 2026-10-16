import { test, expect, type Locator, type Page } from "@playwright/test";

// The sitewide app CTAs (navbar + bottom CTA band) always render both ways in:
// the web app and a download. Which one is the filled button follows the
// device: BaseLayout's inline <head> script sets html[data-platform] before
// first paint ("ios" on iPhone/iPad, "android" on Android, "web" otherwise) and
// re-sets it after every ClientRouter swap. Without JS the attribute is absent
// and the CSS default is the web app. The band's download goes to /download
// until BaseLayout points it at the phone's own store.
const WEB = /^https:\/\/app\.unifysocial\.ca\/\?utm_source=unifysocial\.ca&utm_medium=referral&utm_campaign=/;
const APP_STORE = "https://apps.apple.com/ca/app/unify-canada-newcomer-guide/id6754875762";
const PLAY_STORE = "https://play.google.com/store/apps/details?id=com.anonymous.unifyfrontend";
const IPHONE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1";
const ANDROID_UA =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36";

const TRANSPARENT = "rgba(0, 0, 0, 0)";
const sidePadding = (el: Locator) =>
  el.evaluate((node) => {
    const cs = getComputedStyle(node);
    return [cs.paddingLeft, cs.paddingRight];
  });
/** Marks the document so a later check can tell a client-side swap from a full reload. */
const markDocument = (page: Page) => page.evaluate(() => ((window as Window & { __sameDoc?: boolean }).__sameDoc = true));
const sameDocument = (page: Page) => page.evaluate(() => (window as Window & { __sameDoc?: boolean }).__sameDoc === true);
const background = (el: Locator) => el.evaluate((node) => getComputedStyle(node).backgroundColor);
const box = async (el: Locator) => (await el.boundingBox())!;

/** The band's two buttons, with the reveal forced so they are measurable. */
async function bandButtons(page: Page) {
  const band = page.locator("section.cta-wrap");
  await band.scrollIntoViewIfNeeded();
  await expect(band).toHaveClass(/visible/);
  return {
    web: band.locator('a.cta-btn[data-app-cta="web"]'),
    store: band.locator('a.cta-btn[data-app-cta="store"]'),
  };
}

async function expectBandPrimary(page: Page, primary: "web" | "store", storeHref: string) {
  const { web, store } = await bandButtons(page);
  await expect(web).toHaveAttribute("href", WEB);
  await expect(store).toHaveAttribute("href", storeHref);
  const [first, second] = primary === "web" ? [web, store] : [store, web];
  expect(await background(first)).toBe("rgb(216, 74, 41)");
  expect(await background(second)).toBe(TRANSPARENT);
  expect((await box(first)).y).toBeLessThan((await box(second)).y);
  // Same box either way, so the swap can never move anything.
  expect((await box(first)).width).toBeCloseTo((await box(second)).width, 1);
  expect((await box(first)).height).toBeCloseTo((await box(second)).height, 1);
}

test.describe("app CTAs on desktop", () => {
  test("the pill shows an outlined Get the app and a filled Open web app", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("html")).toHaveAttribute("data-platform", "web");

    const web = page.locator('#nav-pill a.app-cta[data-app-cta="web"]');
    const store = page.locator("#get-app-trigger");
    await expect(web).toHaveText("Open web app");
    await expect(web).toHaveAttribute("href", /utm_campaign=navbar$/);
    await expect(web).toHaveAttribute("href", WEB);
    await expect(store).toHaveText("Get the app");
    // On desktop it is a disclosure button; its href is the no-JS fallback.
    await expect(store).toHaveAttribute("href", "/download");
    await expect(store).toHaveAttribute("role", "button");
    await expect(store).toHaveAttribute("aria-expanded", "false");

    expect(await background(web)).toBe("rgb(23, 22, 22)");
    expect(await background(store)).not.toBe("rgb(23, 22, 22)");
    expect((await box(store)).x).toBeLessThan((await box(web)).x);
    // Tab order: Get the app, then Open web app (the closed panel is skipped).
    await store.focus();
    await page.keyboard.press("Tab");
    await expect(web).toBeFocused();
  });

  test("Get the app opens the download panel and closes on Escape and outside click", async ({ page }) => {
    await page.goto("/about");
    const store = page.locator("#get-app-trigger");
    const panel = page.locator("#get-app-panel");
    await expect(panel).toBeHidden();

    await store.click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(store).toHaveAttribute("aria-expanded", "true");
    await expect(panel).toBeVisible();
    await expect(panel.locator(".get-app-qr")).toBeVisible();
    await expect(panel.locator('a.store-badge-link[data-store="ios"]')).toHaveAttribute("href", APP_STORE);
    await expect(panel.locator('a.store-badge-link[data-store="android"]')).toHaveAttribute("href", PLAY_STORE);
    // The panel stays on screen.
    const card = await box(panel.locator(".get-app-card"));
    expect(card.x).toBeGreaterThanOrEqual(0);
    expect(card.x + card.width).toBeLessThanOrEqual(1440);

    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(store).toHaveAttribute("aria-expanded", "false");
    await expect(store).toBeFocused();

    await page.keyboard.press(" ");
    await expect(panel).toBeVisible();
    await page.mouse.click(20, 700);
    await expect(panel).toBeHidden();
  });

  test("the CTA band leads with the web app and sends the download to /download", async ({ page }) => {
    await page.goto("/about");
    await expectBandPrimary(page, "web", "/download");
    await expect(page.locator("section.cta-wrap a.cta-btn[data-app-cta='web']")).toHaveAttribute(
      "href",
      /utm_campaign=cta-band$/,
    );
  });

  test("data-platform survives a View Transition navigation", async ({ page }) => {
    await page.goto("/about");
    await markDocument(page);
    await page.locator("a.nav-link", { hasText: "Events" }).click();
    await expect(page).toHaveURL(/\/events$/);
    expect(await sameDocument(page), "expected a ClientRouter swap, not a full reload").toBe(true);
    await expect(page.locator("html")).toHaveAttribute("data-platform", "web");
  });

  for (const width of [1024, 1280, 1920]) {
    test(`the pill holds both CTAs on one line and the panel fits at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/about");
      const pill = await box(page.locator("#nav-pill"));
      const web = await box(page.locator('#nav-pill a.app-cta[data-app-cta="web"]'));
      const store = await box(page.locator("#get-app-trigger"));
      expect(pill.x).toBeGreaterThanOrEqual(0);
      expect(pill.x + pill.width).toBeLessThanOrEqual(width);
      expect(web.height).toBeCloseTo(store.height, 1);
      expect(web.y).toBeCloseTo(store.y, 1);
      await page.locator("#get-app-trigger").click();
      const card = await box(page.locator(".get-app-card"));
      expect(card.x).toBeGreaterThanOrEqual(0);
      expect(card.x + card.width).toBeLessThanOrEqual(width);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    });
  }
});

test.describe("app CTAs on iPhone", () => {
  test.use({ userAgent: IPHONE_UA, viewport: { width: 390, height: 844 } });

  test("the App Store is the filled button in the band and the menu", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("html")).toHaveAttribute("data-platform", "ios");
    await expectBandPrimary(page, "store", APP_STORE);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator("#nav-toggle").click();
    await expect(page.locator("#mobile-nav")).toHaveClass(/is-open/);
    const web = page.locator('#mobile-nav a.app-cta[data-app-cta="web"]');
    const store = page.locator('#mobile-nav a.app-cta[data-app-cta="store"]');
    await expect(web).toBeVisible();
    await expect(store).toBeVisible();
    await expect(store).toHaveText("Get the app");
    await expect(store).toHaveAttribute("href", APP_STORE);
    expect(await background(store)).toBe("rgb(23, 22, 22)");
    expect(await background(web)).toBe(TRANSPARENT);
    expect((await box(store)).y).toBeLessThan((await box(web)).y);
    // Both are buttons now (filled + outlined), so both keep side padding.
    expect(await sidePadding(store)).toEqual(["13px", "13px"]);
    expect(await sidePadding(web)).toEqual(["13px", "13px"]);
    await expect(web).toHaveAttribute("href", WEB);
  });

  test("data-platform is set again after a View Transition navigation", async ({ page }) => {
    await page.goto("/");
    await markDocument(page);
    await page.locator("#nav-toggle").click();
    await page.locator("#mobile-nav a.mobile-nav-link", { hasText: "About" }).click();
    await expect(page).toHaveURL(/\/about$/);
    expect(await sameDocument(page), "expected a ClientRouter swap, not a full reload").toBe(true);
    await expect(page.locator("html")).toHaveAttribute("data-platform", "ios");
    await expectBandPrimary(page, "store", APP_STORE);
  });
});

test.describe("app CTAs on Android", () => {
  test.use({ userAgent: ANDROID_UA, viewport: { width: 412, height: 915 } });

  test("Google Play is the filled button in the band and the menu", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("html")).toHaveAttribute("data-platform", "android");
    await expectBandPrimary(page, "store", PLAY_STORE);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator("#nav-toggle").click();
    await expect(page.locator("#mobile-nav")).toHaveClass(/is-open/);
    const web = page.locator('#mobile-nav a.app-cta[data-app-cta="web"]');
    const store = page.locator('#mobile-nav a.app-cta[data-app-cta="store"]');
    await expect(store).toHaveAttribute("href", PLAY_STORE);
    expect(await background(store)).toBe("rgb(23, 22, 22)");
    expect(await background(web)).toBe(TRANSPARENT);
    expect((await box(store)).y).toBeLessThan((await box(web)).y);
    // Touch target: at least 44px tall.
    expect((await box(web)).height).toBeGreaterThanOrEqual(44);
    expect((await box(store)).height).toBeGreaterThanOrEqual(44);
  });
});

test.describe("app CTAs on iPad", () => {
  test.use({
    userAgent:
      "Mozilla/5.0 (iPad; CPU OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
    viewport: { width: 1180, height: 820 },
  });

  test("Get the app is a plain link to the App Store, with no panel", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("html")).toHaveAttribute("data-platform", "ios");
    const store = page.locator("#get-app-trigger");
    await expect(store).toHaveAttribute("href", APP_STORE);
    await expect(store).toHaveAttribute("target", "_blank");
    await expect(store).not.toHaveAttribute("role", "button");
    await expect(store.locator(".get-app-caret")).toBeHidden();
  });
});

test.describe("app CTAs on iPad in desktop mode", () => {
  // iPadOS 13+ Safari sends a Mac user agent; only the touch screen tells it apart.
  test.use({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15",
    viewport: { width: 1180, height: 820 },
  });

  test("is detected as ios, and a Mac with no touch screen stays web", async ({ page }) => {
    await page.addInitScript(() => Object.defineProperty(navigator, "maxTouchPoints", { get: () => 5 }));
    await page.goto("/about");
    await expect(page.locator("html")).toHaveAttribute("data-platform", "ios");
    await expect(page.locator("#get-app-trigger")).toHaveAttribute("href", APP_STORE);

    const mac = await page.context().newPage();
    await mac.goto("/about");
    await expect(mac.locator("html")).toHaveAttribute("data-platform", "web");
    await mac.close();
  });
});

test.describe("app CTAs without JavaScript", () => {
  test.use({ javaScriptEnabled: false, userAgent: IPHONE_UA });

  test("both links render and the web app is the default primary", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("html")).not.toHaveAttribute("data-platform");

    const band = page.locator("section.cta-wrap");
    const web = band.locator('a.cta-btn[data-app-cta="web"]');
    const store = band.locator('a.cta-btn[data-app-cta="store"]');
    await expect(web).toBeVisible();
    await expect(store).toBeVisible();
    await expect(web).toHaveAttribute("href", WEB);
    await expect(store).toHaveAttribute("href", "/download");
    expect(await background(web)).toBe("rgb(216, 74, 41)");
    expect(await background(store)).toBe(TRANSPARENT);

    await expect(page.locator('#nav-pill a.app-cta[data-app-cta="web"]')).toBeVisible();
    await expect(page.locator("#get-app-trigger")).toBeVisible();
    await expect(page.locator("#get-app-trigger")).toHaveAttribute("href", "/download");
  });
});

test.describe("mobile menu on a short phone", () => {
  test.use({ viewport: { width: 320, height: 568 } });

  test("the CTAs clear the links and the menu scrolls to the note", async ({ page }) => {
    await page.goto("/about");
    await page.locator("#nav-toggle").click();
    const menu = page.locator("#mobile-nav");
    await expect(menu).toHaveClass(/is-open/);

    const list = await box(menu.locator(".mobile-link-list"));
    const ctas = await box(menu.locator(".app-ctas--stacked"));
    expect(ctas.y).toBeGreaterThanOrEqual(list.y + list.height + 16);

    // Whatever does not fit is reachable by scrolling, not clipped.
    const note = menu.locator(".mobile-cta-note");
    await note.scrollIntoViewIfNeeded();
    await expect(note).toBeInViewport({ ratio: 1 });
  });
});

test.describe("app CTAs at the narrowest phone", () => {
  test.use({ viewport: { width: 320, height: 640 } });

  test("the band's buttons fit on one line each with no horizontal scroll", async ({ page }) => {
    await page.goto("/about");
    const { web, store } = await bandButtons(page);
    for (const btn of [web, store]) {
      const b = await box(btn);
      expect(b.x).toBeGreaterThanOrEqual(0);
      expect(b.x + b.width).toBeLessThanOrEqual(320);
      expect(b.height).toBeLessThan(64); // one line of text
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  });
});

test("the Organization schema and llms.txt name the web app", async ({ page, request }) => {
  await page.goto("/about");
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const org = blocks.map((b) => JSON.parse(b)).find((ld) => ld["@type"] === "Organization");
  expect(org.description).toContain("app.unifysocial.ca");

  const llms = await (await request.get("/llms.txt")).text();
  expect(llms).toContain("https://app.unifysocial.ca");
});
