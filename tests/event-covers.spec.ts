import { test, expect } from "@playwright/test";
import {
  COVER_FALLBACK,
  COVER_SLOTS,
  COVER_TRANSFORM_HOSTS,
  coverImage,
  coverTransformsEnabled,
} from "../src/lib/events/cover-image";

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

  test("leaves other hosts, look-alikes, http, credentials, ports and broken URLs alone", () => {
    for (const url of [
      "https://example.com/a.jpg",
      "https://evil.example/images.pexels.com/a.jpg",
      "https://images.pexels.com.evil.example/a.jpg",
      "https://images.pexels.com@evil.example/a.jpg",
      "https://user:pass@images.pexels.com/a.jpg",
      "https://images.pexels.com:8443/a.jpg",
      "http://images.pexels.com/a.jpg",
      "/assets/images/community/newcomer-community-vancouver-800.jpg",
      "not a url",
    ]) {
      expect(coverImage(url, "row", true), url).toEqual({ src: url });
    }
  });

  test("a URL with commas stays one srcset candidate per width (SFU)", () => {
    const sfu = "https://events.sfu.ca/live/image/gid/55/width/491/height/246/crop/1/src_region/0,0,2160,1080/x.png";
    const img = coverImage(sfu, "row", true);
    // Candidates are separated by ", " and each is "<url> <width>w": the URL
    // itself has no whitespace and does not end in a comma, so the commas
    // inside it (and inside Cloudflare's options) cannot split it.
    const candidates = img.srcset!.split(", ");
    expect(candidates).toHaveLength(COVER_SLOTS.row.widths.length);
    for (const candidate of candidates) {
      const [url, descriptor, ...rest] = candidate.split(" ");
      expect(rest).toEqual([]);
      expect(descriptor).toMatch(/^\d+w$/);
      expect(url.endsWith(sfu)).toBe(true);
    }
  });

  test("normalises what it embeds, and refuses what srcset could not hold", () => {
    const spaced = coverImage("https://burnabynh.ca/wp-content/uploads/My Event.jpg", "row", true);
    expect(spaced.srcset).toContain("/https://burnabynh.ca/wp-content/uploads/My%20Event.jpg 160w");
    expect(spaced.srcset).not.toMatch(/My Event/);
    expect(spaced.original).toBe("https://burnabynh.ca/wp-content/uploads/My Event.jpg");
    const traversal = coverImage("https://burnabynh.ca/a/../../b.jpg", "row", true);
    expect(traversal.src.endsWith("/https://burnabynh.ca/b.jpg")).toBe(true);
    const trailing = "https://burnabynh.ca/a.jpg,";
    expect(coverImage(trailing, "row", true)).toEqual({ src: trailing });
  });

  test("sizes ask for the cropped source width, not the box width", () => {
    // 2:1 covers shown with object-fit: cover need box height x 2 (see COVER_SLOTS).
    expect(COVER_SLOTS.row.sizes).toBe("(max-width: 480px) 136px, (max-width: 640px) 208px, 290px");
    expect(COVER_SLOTS.feature.sizes).toBe("(max-width: 700px) 128vw, 580px");
    expect(COVER_SLOTS.detail.sizes).toBe("(max-width: 900px) 113vw, 860px");
    // A 3x phone row thumb (136 CSS px) and a 2x desktop featured card (580) have a candidate big enough.
    expect(Math.max(...COVER_SLOTS.row.widths)).toBeGreaterThanOrEqual(136 * 3);
    expect(Math.max(...COVER_SLOTS.feature.widths)).toBeGreaterThanOrEqual(580 * 2);
  });

  test("transformations are only on for the production zone", () => {
    expect(coverTransformsEnabled("unifysocial.ca", true)).toBe(true);
    expect(coverTransformsEnabled("unifysocial.ca", false)).toBe(false);
    expect(coverTransformsEnabled("localhost", true)).toBe(false);
    expect(coverTransformsEnabled("unify-landing-page.wild-recipe-8e20.workers.dev", true)).toBe(false);
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

test.describe("event pages rendered the way production renders covers", () => {
  // The "transformed-covers" fixture turns transformations on under dev; the
  // test stands in for Cloudflare by answering /cdn-cgi/image itself.
  test.use({ extraHTTPHeaders: { "x-events-fixture": "transformed-covers" } });
  const SFU = "https://events.sfu.ca/live/image/gid/55/width/491/height/246/crop/1/src_region/0,0,2160,1080/1_Banking.png";
  const PEXELS_COVER = "https://images.pexels.com/photos/1/pexels-photo-1.jpeg?auto=compress&w=1200";

  test("agenda rows, the featured card and the detail page carry the full wiring", async ({ page }) => {
    const asked: string[] = [];
    await page.route("**/cdn-cgi/image/**", async (route) => {
      asked.push(new URL(route.request().url()).pathname);
      const local = await page.request.get("/assets/images/community/newcomer-community-vancouver-800.jpg");
      await route.fulfill({ status: 200, contentType: "image/jpeg", body: await local.body() });
    });
    await page.goto("/events");

    const row = page.locator(`.ec--row img.ec-img[data-original="${SFU}"]`);
    await expect(row).toHaveAttribute("src", `/cdn-cgi/image/width=640,quality=75,format=auto,fit=scale-down/${SFU}`);
    await expect(row).toHaveAttribute("sizes", COVER_SLOTS.row.sizes);
    expect((await row.getAttribute("srcset"))!.split(", ")).toHaveLength(COVER_SLOTS.row.widths.length);
    await expect(row).toHaveAttribute("onerror", COVER_FALLBACK);
    await expect(row).toHaveAttribute("loading", "lazy");
    await expect(row).toHaveAttribute("fetchpriority", "low");
    await expect(row).toHaveAttribute("width", "640");
    await expect(row).toHaveAttribute("height", "360");
    await expect(row).toHaveAttribute("referrerpolicy", "no-referrer");

    const feature = page.locator(`.ec--feature img.ec-img[data-original="${PEXELS_COVER}"]`);
    await expect(feature).toHaveAttribute("sizes", COVER_SLOTS.feature.sizes);
    await expect(feature).toHaveAttribute("src", `/cdn-cgi/image/width=1200,quality=75,format=auto,fit=scale-down/${PEXELS_COVER}`);

    // A cover that is not on a listed host is untouched, in the same page.
    const local = page.locator('img.ec-img[src="/assets/images/community/newcomer-community-vancouver-800.jpg"]').first();
    await expect(local).not.toHaveAttribute("srcset");
    await expect(local).not.toHaveAttribute("onerror");

    // The row actually loads through the transformation, at a row width.
    await row.scrollIntoViewIfNeeded();
    await expect.poll(() => row.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
    expect(await row.evaluate((el: HTMLImageElement) => el.currentSrc)).toContain("/cdn-cgi/image/width=");
    expect(asked.some((path) => path.endsWith("/1_Banking.png"))).toBe(true);

    await page.goto("/events/9070-banking-basics-workshop");
    const detail = page.locator(`.ed-cover img[data-original="${SFU}"]`);
    await expect(detail).toHaveAttribute("sizes", COVER_SLOTS.detail.sizes);
    await expect(detail).toHaveAttribute("src", `/cdn-cgi/image/width=1280,quality=75,format=auto,fit=scale-down/${SFU}`);
    await expect(detail).toHaveAttribute("onerror", COVER_FALLBACK);
    await expect(detail).toHaveAttribute("loading", "eager");
  });

  test("when Cloudflare refuses, the rendered card falls back to the original", async ({ page }) => {
    await page.route("**/cdn-cgi/image/**", (route) => route.fulfill({ status: 403, contentType: "text/plain", body: "Forbidden" }));
    await page.route("https://events.sfu.ca/**", async (route) => {
      const local = await page.request.get("/assets/images/community/newcomer-community-vancouver-800.jpg");
      await route.fulfill({ status: 200, contentType: "image/jpeg", body: await local.body() });
    });
    await page.goto("/events");
    const row = page.locator(`.ec--row img.ec-img[data-original="${SFU}"]`);
    await row.scrollIntoViewIfNeeded();
    await expect.poll(() => row.evaluate((el: HTMLImageElement) => el.currentSrc)).toBe(SFU);
    await expect.poll(() => row.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
    await expect(row).not.toHaveAttribute("srcset");
  });
});
