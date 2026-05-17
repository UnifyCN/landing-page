import { test, expect } from "@playwright/test";

// Every top-level route must respond, render exactly one <h1>, and show the
// persisted navbar. Catches broken routes, heading-hierarchy regressions, and
// a navbar that failed to render.
const routes = [
  "/",
  "/about",
  "/community",
  "/contact",
  "/partners",
  "/resources",
  "/blog",
];

for (const route of routes) {
  test(`${route} loads with one h1 and the navbar`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response, `${route} should produce a response`).not.toBeNull();
    expect(response!.status(), `${route} should return 2xx/3xx`).toBeLessThan(400);
    await expect(page.locator("#nav-pill")).toBeVisible();
    // Scoped to <main> so the dev-toolbar's shadow-DOM panels (which Playwright
    // pierces into) don't count. In production there is no toolbar, so this is
    // equivalent to a bare `h1` check.
    await expect(page.locator("main h1")).toHaveCount(1);
  });
}
