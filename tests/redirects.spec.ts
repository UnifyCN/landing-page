import { test, expect } from "@playwright/test";

// Guards the legacy-slug 301 map in src/pages/blog/[slug].astro. When a post slug
// is renamed, its old URL still holds Google ranking equity; without a redirect it
// 302-bounces to /blog and that equity is lost (this actually happened to the TEER 3
// post, the site's #1 organic page). If you rename a slug, add it to the map.

test("legacy TEER parens URL 301-redirects to the canonical post", async ({ page }) => {
  const response = await page.goto(
    "/blog/the-easiest-skilled-jobs-to-transition-into-(teer-3)-for-pr-purposes-in-canada"
  );
  // The redirect must be 301 (permanent) so Google transfers ranking equity; a 302 would not.
  const redirectedFrom = response?.request().redirectedFrom();
  expect(redirectedFrom, "expected the legacy URL to redirect").not.toBeNull();
  const redirectStatus = (await redirectedFrom!.response())?.status();
  expect(redirectStatus).toBe(301);
  await expect(page).toHaveURL(
    /\/blog\/the-easiest-skilled-jobs-to-transition-into-teer-3-for-pr-purposes-in-canada$/
  );
  await expect(page.locator("main h1")).toHaveCount(1);
});

test("an unknown blog slug falls back to /blog", async ({ page }) => {
  await page.goto("/blog/this-post-does-not-exist-xyz");
  await expect(page).toHaveURL(/\/blog$/);
});
