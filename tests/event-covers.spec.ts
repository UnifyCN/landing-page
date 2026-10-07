import { test, expect } from "@playwright/test";
import { COVER_FALLBACK, COVER_SLOTS, COVER_TRANSFORM_HOSTS, coverImage } from "../src/lib/events/cover-image";

// Event covers go through Cloudflare Image Transformations in production
// (src/lib/events/cover-image.ts). /cdn-cgi/image does not exist under
// `astro dev`, so the URL building is tested directly and the fallback is
// tested in a page with the transformation made to fail.
const PEXELS = "https://images.pexels.com/photos/1/pexels-photo-1.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200";

test.describe("coverImage", () => {
  test("builds a width-matched srcset for a host the feed uses", () => {
    const img = coverImage(PEXELS, "row", true);
    expect(img.original).toBe(PEXELS);
    expect(img.sizes).toBe(COVER_SLOTS.row.sizes);
    const candidates = img.srcset!.split(", ");
    expect(candidates).toHaveLength(COVER_SLOTS.row.widths.length);
    for (const [i, width] of COVER_SLOTS.row.widths.entries()) {
      // Options, then the source URL untouched (query string included), then the descriptor.
      expect(candidates[i]).toBe(`/cdn-cgi/image/width=${width},quality=75,format=auto,fit=scale-down/${PEXELS} ${width}w`);
    }
    expect(img.src).toContain(`width=${COVER_SLOTS.row.widths.at(-1)},`);
  });

  test("each slot asks for its own widths", () => {
    for (const slot of ["row", "feature", "detail"] as const) {
      const img = coverImage(PEXELS, slot, true);
      expect(img.srcset!.match(/ \d+w/g)!.map((d) => Number(d.slice(1, -1)))).toEqual([...COVER_SLOTS[slot].widths]);
    }
  });

  test("leaves other hosts, http, relative and broken URLs alone", () => {
    for (const url of [
      "https://example.com/a.jpg",
      "https://evil.example/images.pexels.com/a.jpg",
      "https://images.pexels.com.evil.example/a.jpg",
      "http://images.pexels.com/a.jpg",
      "/assets/images/community/newcomer-community-vancouver-800.jpg",
      "not a url",
    ]) {
      expect(coverImage(url, "row", true), url).toEqual({ src: url });
    }
  });

  test("does nothing when transformations are off (astro dev)", () => {
    expect(coverImage(PEXELS, "row", false)).toEqual({ src: PEXELS });
  });

  test("the allow-list is the five hosts the feed uses", () => {
    expect([...COVER_TRANSFORM_HOSTS].sort()).toEqual(
      ["burnabynh.ca", "events.sfu.ca", "images.pexels.com", "vpl.bibliocommons.com", "www.capilanou.ca"].sort(),
    );
  });
});

test("a refused transformation falls back to the original image, once", async ({ page }) => {
  // What production does when Cloudflare answers 403 for a source host.
  const original = "/assets/images/community/newcomer-community-vancouver-800.jpg";
  let transformRequests = 0;
  await page.route("**/cdn-cgi/image/**", (route) => {
    transformRequests++;
    return route.fulfill({ status: 403, contentType: "text/plain", body: "Forbidden" });
  });
  await page.goto("/about");
  await page.evaluate(
    ({ original, fallback }) => {
      const img = document.createElement("img");
      img.id = "cover-under-test";
      img.dataset.original = original;
      img.setAttribute("onerror", fallback);
      img.sizes = "232px";
      img.srcset = `/cdn-cgi/image/width=160,quality=75,format=auto,fit=scale-down/x 160w, /cdn-cgi/image/width=320,quality=75,format=auto,fit=scale-down/x 320w`;
      img.src = "/cdn-cgi/image/width=320,quality=75,format=auto,fit=scale-down/x";
      document.body.append(img);
    },
    { original, fallback: COVER_FALLBACK },
  );
  const img = page.locator("#cover-under-test");
  await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
  expect(await img.evaluate((el: HTMLImageElement) => el.currentSrc)).toContain(original);
  await expect(img).not.toHaveAttribute("srcset");
  // One failed attempt, then the original: no retry loop.
  expect(transformRequests).toBe(1);
});

test.describe("event pages under astro dev", () => {
  test.use({ extraHTTPHeaders: { "x-events-fixture": "mid-month" } });

  test("covers render untransformed, still lazy and sized", async ({ page }) => {
    await page.goto("/events");
    const cover = page.locator("img.ec-img").first();
    await expect(cover).toHaveAttribute("src", "/assets/images/community/newcomer-community-vancouver-800.jpg");
    await expect(cover).not.toHaveAttribute("srcset");
    await expect(cover).not.toHaveAttribute("onerror");
    await expect(cover).toHaveAttribute("loading", "lazy");
    await expect(cover).toHaveAttribute("width", "640");
  });
});
