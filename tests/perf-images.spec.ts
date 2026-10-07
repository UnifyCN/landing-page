import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { partners, partnerLogoSize } from "../src/lib/partners";
import { HERO_SIZES, HERO_SRCSET } from "../src/lib/hero-image";

// Guards the page-speed pass (audit fix 7): small AVIF brand images, explicit
// dimensions so nothing shifts while images load, and event covers that do not
// compete with the header photo. Images are produced by
// scripts/build-brand-images.mjs.
test.describe("image dimensions", () => {
  // The home page and a guide hub. /about and /partners still have images
  // without dimensions (founder photos, icons, two blobs); they are below the
  // first screen or absolutely positioned and were left out of this pass.
  for (const path of ["/", "/new-to-canada"]) {
    test(`${path}: every image has width and height`, async ({ page }) => {
      await page.goto(path);
      const missing = await page
        .locator("img")
        .evaluateAll((imgs) =>
          imgs.filter((img) => !img.hasAttribute("width") || !img.hasAttribute("height")).map((img) => img.getAttribute("src")),
        );
      expect(missing).toEqual([]);
    });
  }

  test("the home page does not shift while its images load", async ({ page }) => {
    await page.addInitScript(() => {
      (window as Window & { __cls?: number }).__cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) {
          if (!entry.hadRecentInput) (window as Window & { __cls?: number }).__cls! += entry.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    // Phone width with every image held back, so the page lays out first and
    // the images arrive late. Without width/height the navbar pill moved when
    // the logo arrived and everything under the hero moved when the phone
    // screenshot did (production measured 0.13). Checked by removing the hero
    // attributes: this fails at 0.05. It does NOT cover the partner strip,
    // whose logos load below the fold; the "every image has width and height"
    // test above is what guards those.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.route(/\.(avif|png|jpe?g|webp|svg)(\?.*)?$/, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 700));
      await route.continue();
    });
    await page.goto("/");
    await page.waitForTimeout(1800);
    await page.locator("section.partners").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    const cls = await page.evaluate(() => (window as Window & { __cls?: number }).__cls ?? 0);
    expect(cls).toBeLessThan(0.02);
  });
});

test.describe("brand images", () => {
  test("the logo is a small AVIF with a PNG fallback, in the navbar and footer", async ({ page }) => {
    await page.goto("/about");
    for (const scope of ["#nav-pill", "footer"]) {
      const picture = page.locator(`${scope} picture:has(img[alt="Unify Social"])`).first();
      await expect(picture.locator("source")).toHaveAttribute("srcset", "/assets/logo/new-unify-logo-168.avif");
      await expect(picture.locator("source")).toHaveAttribute("type", "image/avif");
      await expect(picture.locator("img")).toHaveAttribute("src", "/assets/logo/new-unify-logo-256.png");
    }
    const navLogo = page.locator("#nav-pill picture img");
    await expect(navLogo).toHaveAttribute("width", "40");
    await expect(navLogo).toHaveAttribute("height", "40");
    // The browser actually picked the AVIF and it decoded.
    expect(await navLogo.evaluate((img: HTMLImageElement) => img.currentSrc)).toMatch(/new-unify-logo-168\.avif$/);
    expect(await navLogo.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBe(168);
  });

  test("every partner logo is an AVIF that exists and has recorded dimensions", () => {
    for (const partner of partners) {
      expect(partner.logo, partner.slug).toMatch(/\.avif$/);
      const file = fileURLToPath(new URL(`../public${partner.logo}`, import.meta.url));
      expect(existsSync(file), partner.logo).toBe(true);
      const size = partnerLogoSize(partner.logo);
      expect(size.width, partner.logo).toBeGreaterThan(0);
      expect(size.height, partner.logo).toBeLessThanOrEqual(160);
    }
  });

  test("the hero phone has right-sized candidates and the preload matches it", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("img.hero-phone");
    // AVIF candidates on the <source>, the same widths as WebP on the <img>.
    const source = page.locator("picture:has(img.hero-phone) source");
    await expect(source).toHaveAttribute("type", "image/avif");
    await expect(source).toHaveAttribute("srcset", HERO_SRCSET);
    await expect(source).toHaveAttribute("sizes", HERO_SIZES);
    await expect(hero).toHaveAttribute("srcset", HERO_SRCSET.replaceAll(".avif", ".webp"));
    await expect(hero).toHaveAttribute("sizes", HERO_SIZES);
    await expect(hero).toHaveAttribute("fetchpriority", "high");
    const preload = page.locator('link[rel="preload"][as="image"]');
    await expect(preload).toHaveAttribute("imagesrcset", HERO_SRCSET);
    await expect(preload).toHaveAttribute("imagesizes", HERO_SIZES);
    // At 1440px wide and 1x the 380px file is enough; the 1030px original is not fetched.
    expect(await hero.evaluate((img: HTMLImageElement) => img.currentSrc)).toMatch(/learn-hero-380\.avif$/);
  });
});

test.describe("event covers", () => {
  test.use({ extraHTTPHeaders: { "x-events-fixture": "mid-month" } });

  test("covers are lazy, low priority, and reserve their box", async ({ page }) => {
    await page.goto("/events");
    const covers = page.locator("img.ec-img");
    expect(await covers.count()).toBeGreaterThanOrEqual(2);
    for (const cover of await covers.all()) {
      await expect(cover).toHaveAttribute("loading", "lazy");
      await expect(cover).toHaveAttribute("fetchpriority", "low");
      await expect(cover).toHaveAttribute("width", "640");
      await expect(cover).toHaveAttribute("height", "360");
    }
    // The header photo stays the one eager, high-priority image.
    await expect(page.locator(".evh-photo img")).toHaveAttribute("fetchpriority", "high");
  });
});
