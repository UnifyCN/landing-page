import { test, expect } from "@playwright/test";

// /new-to-canada checklist island: ticks persist in localStorage, the
// progress count follows the audience filter, and the handler re-binds after
// a View Transition navigation (the footer link keeps it a client-side swap).

test.describe("/new-to-canada checklist", () => {
  test("ticking a step updates progress and survives a reload", async ({ page }) => {
    await page.goto("/new-to-canada");
    const root = page.locator("[data-nc-root]");
    await expect(root).toHaveAttribute("data-nc-bound", "true");
    await expect(page.locator("[data-nc-done]")).toHaveText("0");

    const first = page.locator(".nc-item").first();
    await first.locator("label.nc-item-title").click();
    await expect(first.locator(".nc-check")).toBeChecked();
    await expect(page.locator("[data-nc-done]")).toHaveText("1");

    await page.reload();
    await expect(page.locator(".nc-item").first().locator(".nc-check")).toBeChecked();
    await expect(page.locator("[data-nc-done]")).toHaveText("1");
  });

  test("audience filter hides steps that do not apply", async ({ page }) => {
    await page.goto("/new-to-canada");
    const prOnly = page.locator('.nc-item:not([data-who~="student"])').first();
    await expect(prOnly).toBeVisible();

    await page.locator('.nc-who-opt:has(input[value="student"])').click();
    await expect(prOnly).toBeHidden();

    const total = await page.locator("[data-nc-total]").textContent();
    const studentSteps = await page.locator('.nc-item[data-who~="student"]').count();
    expect(Number(total)).toBe(studentSteps);
  });

  test("checklist re-binds after Home → New to Canada via the footer", async ({ page }) => {
    await page.goto("/");
    await page.locator("footer a", { hasText: "New to Canada Checklist" }).click();
    await expect(page).toHaveURL(/\/new-to-canada$/);
    await expect(page.locator("[data-nc-root]")).toHaveAttribute("data-nc-bound", "true");
  });
});
