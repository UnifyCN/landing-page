import { test, expect } from "@playwright/test";

// The FAQ summary handler calls preventDefault() and fully drives the toggle in
// JS — so `.faq-answer-wrap.is-open` (not the native `open` attribute alone)
// is what proves the handler actually bound.
test.describe("FAQ accordion", () => {
  test("expands and collapses a question", async ({ page }) => {
    await page.goto("/");

    const item = page.locator(".faq-item").first();
    await expect(item).toHaveAttribute("data-faq-bound", "true");

    const wrap = item.locator(".faq-answer-wrap");
    await expect(item).not.toHaveAttribute("open");
    await expect(wrap).not.toHaveClass(/is-open/);

    await item.locator(".faq-summary").click();
    await expect(item).toHaveAttribute("open");
    await expect(wrap).toHaveClass(/is-open/);

    await item.locator(".faq-summary").click();
    await expect(wrap).not.toHaveClass(/is-open/);
    await expect(item).not.toHaveAttribute("open");
  });
});
