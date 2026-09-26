import { test, expect } from "@playwright/test";

// The About and Resources dropdowns in the desktop navbar. The navbar carries
// transition:persist, so the caret handlers bind once (data-nav-bound) and must
// keep working and keep the active state right after View Transition navs.
test.describe("navbar dropdowns", () => {
  test("the caret opens and closes the menu from the keyboard", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#nav-pill")).toHaveAttribute("data-nav-bound", "true");

    const caret = page.getByRole("button", { name: "More in About" });
    const menu = page.locator("#nav-menu-about");

    await caret.focus();
    await page.keyboard.press("Enter");
    await expect(caret).toHaveAttribute("aria-expanded", "true");
    await expect(menu).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(caret).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toBeHidden();
    await expect(caret).toBeFocused();
  });

  test("a parent is marked active on its child's page after a client nav", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "More in Resources" }).click();
    await page.locator("a.nav-menu-link", { hasText: "Blog" }).click();
    await expect(page).toHaveURL(/\/blog$/);

    const resources = page.locator("a.nav-link", { hasText: "Resources" });
    await expect(resources).toHaveClass(/nav-link-active/);
    await expect(resources).not.toHaveAttribute("aria-current", "page");
    await expect(page.locator("a.nav-link", { hasText: "Home" })).not.toHaveClass(
      /nav-link-active/,
    );

    // The caret still works on the new page (handlers survived the swap).
    await page.getByRole("button", { name: "More in About" }).click();
    await expect(page.locator("#nav-menu-about")).toBeVisible();
  });

  test("mobile menu lists child links under their parent", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.locator("#nav-toggle").click();

    const subLinks = page.locator("#mobile-nav a.mobile-sub-link");
    await expect(subLinks).toHaveText(["Partners", "Contact", "Blog"]);
  });
});
