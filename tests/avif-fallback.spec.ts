import { test, expect, type Page } from "@playwright/test";
import { webpFallback } from "../src/lib/image-fallback";

// Every AVIF the site serves sits in a <picture> with a WebP (or, for the
// logo, PNG) fallback, because Safari 15 and older cannot decode AVIF and
// showed alt text instead. Chromium can be told to behave like such a browser
// through the DevTools protocol, which is what "without AVIF" does here.
async function disableAvif(page: Page) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setDisabledImageTypes", { imageTypes: ["avif"] });
}

/**
 * Every same-origin image the browser has chosen a file for.
 * `state` is "loaded", "broken" (finished with nothing decoded: what an
 * unsupported format looks like), or "pending" (lazy and never near the
 * viewport, such as the marquee's offscreen second copy).
 */
function snapshot(page: Page) {
  return page.locator("img").evaluateAll((imgs) =>
    (imgs as HTMLImageElement[])
      .filter((img) => img.currentSrc.startsWith(location.origin))
      .map((img) => ({
        src: img.currentSrc.replace(location.origin, ""),
        state: !img.complete ? "pending" : img.naturalWidth > 0 ? "loaded" : "broken",
      })),
  );
}

/** Scroll the whole page so lazy images load, give them time, then report. */
async function localImages(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
    window.scrollTo(0, 0);
  });
  // Not networkidle: some pages keep a connection open (Turnstile, video).
  await page.waitForTimeout(1500);
  return snapshot(page);
}

const PAGES = ["/", "/about", "/partners", "/partners/sfu", "/resources", "/resources/how-to-write-a-resume"];

test.describe("without AVIF support", () => {
  for (const path of PAGES) {
    test(`${path}: every image falls back to a format that loads`, async ({ page }) => {
      await disableAvif(page);
      await page.goto(path);
      const images = await localImages(page);
      expect(images.filter((img) => img.state === "loaded").length).toBeGreaterThan(0);
      expect(images.filter((img) => img.src.endsWith(".avif")).map((img) => img.src)).toEqual([]);
      expect(images.filter((img) => img.state === "broken").map((img) => img.src)).toEqual([]);
    });
  }

  test("the home page falls back to WebP for the hero and partner logos, PNG for the logo", async ({ page }) => {
    await disableAvif(page);
    await page.goto("/");
    await page.locator("section.partners").scrollIntoViewIfNeeded();
    const src = (selector: string) =>
      page.locator(selector).first().evaluate((img: HTMLImageElement) => img.currentSrc.replace(location.origin, ""));
    await expect.poll(() => src("img.hero-devices")).toMatch(/^\/assets\/images\/hero-web-mobile-c(-\d+)?\.webp$/);
    await expect.poll(() => src("img.partner-logo")).toMatch(/^\/assets\/images\/partners\/[a-z_]+\.webp$/);
    await expect.poll(() => src("#nav-pill img")).toBe("/assets/logo/new-unify-logo-256.png");
    expect(await page.locator("img.partner-logo").first().evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  });

  test("event pages fall back too (sidebar partner logos and the cover placeholder)", async ({ page }) => {
    await page.setExtraHTTPHeaders({ "x-events-fixture": "mid-month" });
    await disableAvif(page);
    await page.goto("/events");
    const images = await localImages(page);
    expect(images.filter((img) => img.src.endsWith(".avif")).map((img) => img.src)).toEqual([]);
    expect(images.filter((img) => img.state === "broken").map((img) => img.src)).toEqual([]);
    expect(images.some((img) => /partners\/[a-z_]+\.webp$/.test(img.src) && img.state === "loaded")).toBe(true);
    // An event with no cover shows the logo mark; without AVIF that is the PNG.
    expect(images.some((img) => img.src === "/assets/logo/new-unify-logo-256.png")).toBe(true);
  });
});

test("a <picture>'s <source> never takes part in layout", async ({ page }) => {
  // Without `picture > source { display: none }` (global.css) the <source>
  // inside a display: contents <picture> is an empty flex item: on /partners it
  // pushed each testimonial logo 16px right and made the card 18px taller.
  for (const path of ["/", "/partners", "/about"]) {
    await page.goto(path);
    const displays = await page
      .locator("picture > source")
      .evaluateAll((sources) => [...new Set(sources.map((s) => getComputedStyle(s).display))]);
    expect(displays, path).toEqual(["none"]);
  }
  await page.goto("/partners");
  const footer = page.locator(".pt-attribution").first();
  const logo = footer.locator("img.pt-logo");
  const [footerBox, logoBox] = [(await footer.boundingBox())!, (await logo.boundingBox())!];
  // The logo starts at the footer's left edge, with nothing in front of it.
  expect(Math.abs(logoBox.x - footerBox.x)).toBeLessThan(1);
});

test.describe("with AVIF support", () => {
  test("AVIF is still what a modern browser gets", async ({ page }) => {
    await page.goto("/");
    await page.locator("section.partners").scrollIntoViewIfNeeded();
    const src = (selector: string) =>
      page.locator(selector).first().evaluate((img: HTMLImageElement) => img.currentSrc.replace(location.origin, ""));
    await expect.poll(() => src("img.hero-devices")).toMatch(/hero-web-mobile-c-724\.avif$/);
    await expect.poll(() => src("img.partner-logo")).toMatch(/\.avif$/);
    await expect.poll(() => src("#nav-pill img")).toMatch(/new-unify-logo-168\.avif$/);
  });

  test("no <img> on these pages points straight at an AVIF", async ({ page }) => {
    // The fallback only works if the <img> itself is not AVIF.
    for (const path of PAGES) {
      await page.goto(path);
      const direct = await page
        .locator("img")
        .evaluateAll((imgs) => imgs.map((img) => img.getAttribute("src") ?? "").filter((s) => s.endsWith(".avif")));
      expect(direct, path).toEqual([]);
    }
  });
});

test("webpFallback swaps the extension wherever a URL can end", () => {
  expect(webpFallback("/a/photo.avif")).toBe("/a/photo.webp");
  expect(webpFallback("/a/x-380.avif 380w, /a/x-760.avif 760w")).toBe("/a/x-380.webp 380w, /a/x-760.webp 760w");
  expect(webpFallback("/a/photo.avif?v=2")).toBe("/a/photo.webp?v=2");
  expect(webpFallback("/a/photo.avif#top")).toBe("/a/photo.webp#top");
  // Not an extension: left alone.
  expect(webpFallback("/a/avif-notes.png")).toBe("/a/avif-notes.png");
  expect(webpFallback("/a/photo.avifx")).toBe("/a/photo.avifx");
});
