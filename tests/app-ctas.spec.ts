import { test, expect, type Locator, type Page } from "@playwright/test";

// The sitewide app CTAs (navbar + bottom CTA band) always render both ways in:
// the web app and the App Store. Which one is the filled button follows the
// device: BaseLayout's inline <head> script sets html[data-platform] before
// first paint ("ios" on iPhone, "web" otherwise) and re-sets it after every
// ClientRouter swap. Without JS the attribute is absent and the CSS default is
// the web app.
const WEB = /^https:\/\/app\.unifysocial\.ca\/\?utm_source=unifysocial\.ca&utm_medium=referral&utm_campaign=/;
const APP_STORE = "https://apps.apple.com/ca/app/unify-newcomer-support/id6754875762";
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
    ios: band.locator('a.cta-btn[data-app-cta="ios"]'),
  };
}

async function expectBandPrimary(page: Page, primary: "web" | "ios") {
  const { web, ios } = await bandButtons(page);
  await expect(web).toHaveAttribute("href", WEB);
  await expect(ios).toHaveAttribute("href", APP_STORE);
  const [first, second] = primary === "web" ? [web, ios] : [ios, web];
  expect(await background(first)).toBe("rgb(216, 74, 41)");
  expect(await background(second)).toBe(TRANSPARENT);
  expect((await box(first)).y).toBeLessThan((await box(second)).y);
  // Same box either way, so the swap can never move anything.
  expect((await box(first)).width).toBeCloseTo((await box(second)).width, 1);
  expect((await box(first)).height).toBeCloseTo((await box(second)).height, 1);
}

test.describe("app CTAs on desktop", () => {
  test("the navbar leads with the web app and keeps Download Unify beside it", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("html")).toHaveAttribute("data-platform", "web");

    const web = page.locator('#nav-pill a.app-cta[data-app-cta="web"]');
    const ios = page.locator('#nav-pill a.app-cta[data-app-cta="ios"]');
    await expect(web).toHaveText("Open Unify in your browser");
    await expect(web).toHaveAttribute("href", /utm_campaign=navbar$/);
    await expect(web).toHaveAttribute("href", WEB);
    await expect(ios).toHaveText("Download Unify");
    await expect(ios).toHaveAttribute("href", APP_STORE);
    await expect(ios).toHaveAttribute("target", "_blank");

    expect(await background(web)).toBe("rgb(23, 22, 22)");
    expect(await background(ios)).toBe(TRANSPARENT);
    // Filled button sits at the pill's trailing edge, the quiet link before it.
    expect((await box(ios)).x).toBeLessThan((await box(web)).x);
    // Tab order follows what is shown: quiet link, then the filled button.
    await ios.focus();
    await page.keyboard.press("Tab");
    await expect(web).toBeFocused();
  });

  test("the CTA band leads with the web app", async ({ page }) => {
    await page.goto("/about");
    await expectBandPrimary(page, "web");
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
    test(`the pill holds both CTAs on one line at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/about");
      const pill = await box(page.locator("#nav-pill"));
      const web = await box(page.locator('#nav-pill a.app-cta[data-app-cta="web"]'));
      const ios = await box(page.locator('#nav-pill a.app-cta[data-app-cta="ios"]'));
      expect(pill.x).toBeGreaterThanOrEqual(0);
      expect(pill.x + pill.width).toBeLessThanOrEqual(width);
      expect(web.height).toBeCloseTo(ios.height, 1);
      expect(web.y).toBeCloseTo(ios.y, 1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    });
  }
});

test.describe("app CTAs on iPhone", () => {
  test.use({ userAgent: IPHONE_UA, viewport: { width: 390, height: 844 } });

  test("the App Store is the filled button in the band and the menu", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("html")).toHaveAttribute("data-platform", "ios");
    await expectBandPrimary(page, "ios");

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator("#nav-toggle").click();
    await expect(page.locator("#mobile-nav")).toHaveClass(/is-open/);
    const web = page.locator('#mobile-nav a.app-cta[data-app-cta="web"]');
    const ios = page.locator('#mobile-nav a.app-cta[data-app-cta="ios"]');
    await expect(web).toBeVisible();
    await expect(ios).toBeVisible();
    expect(await background(ios)).toBe("rgb(23, 22, 22)");
    expect(await background(web)).toBe(TRANSPARENT);
    expect((await box(ios)).y).toBeLessThan((await box(web)).y);
    // The filled button keeps its side padding; the quiet link has none.
    expect(await sidePadding(ios)).toEqual(["13px", "13px"]);
    expect(await sidePadding(web)).toEqual(["0px", "0px"]);
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
    await expectBandPrimary(page, "ios");
  });
});

test.describe("app CTAs on Android", () => {
  test.use({ userAgent: ANDROID_UA, viewport: { width: 412, height: 915 } });

  test("the web app is the filled button in the band and the menu", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("html")).toHaveAttribute("data-platform", "web");
    await expectBandPrimary(page, "web");

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator("#nav-toggle").click();
    await expect(page.locator("#mobile-nav")).toHaveClass(/is-open/);
    const web = page.locator('#mobile-nav a.app-cta[data-app-cta="web"]');
    const ios = page.locator('#mobile-nav a.app-cta[data-app-cta="ios"]');
    expect(await background(web)).toBe("rgb(23, 22, 22)");
    expect((await box(web)).y).toBeLessThan((await box(ios)).y);
    expect(await sidePadding(web)).toEqual(["13px", "13px"]);
    expect(await sidePadding(ios)).toEqual(["0px", "0px"]);
    // Touch target: at least 44px tall.
    expect((await box(web)).height).toBeGreaterThanOrEqual(44);
    expect((await box(ios)).height).toBeGreaterThanOrEqual(44);
  });
});

test.describe("app CTAs without JavaScript", () => {
  test.use({ javaScriptEnabled: false, userAgent: IPHONE_UA });

  test("both links render and the web app is the default primary", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("html")).not.toHaveAttribute("data-platform");

    const band = page.locator("section.cta-wrap");
    const web = band.locator('a.cta-btn[data-app-cta="web"]');
    const ios = band.locator('a.cta-btn[data-app-cta="ios"]');
    await expect(web).toBeVisible();
    await expect(ios).toBeVisible();
    await expect(web).toHaveAttribute("href", WEB);
    await expect(ios).toHaveAttribute("href", APP_STORE);
    expect(await background(web)).toBe("rgb(216, 74, 41)");
    expect(await background(ios)).toBe(TRANSPARENT);

    await expect(page.locator('#nav-pill a.app-cta[data-app-cta="web"]')).toBeVisible();
    await expect(page.locator('#nav-pill a.app-cta[data-app-cta="ios"]')).toBeVisible();
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
    const { web, ios } = await bandButtons(page);
    for (const btn of [web, ios]) {
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
