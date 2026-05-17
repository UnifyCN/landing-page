import { test, expect } from "@playwright/test";

// Forms are tested for render + binding + client-side error surfacing only.
// An empty submit round-trips the local `/api/contact` & `/api/partner-inquiry`
// routes, which fail Zod validation and return `fieldErrors` — no Turnstile or
// Resend network is reached. A success-path test is out of scope: the real
// Turnstile site key isn't allow-listed for localhost, so no token exists.

test.describe("contact form", () => {
  test("renders all fields and the Turnstile container", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("#contact-form")).toBeVisible();
    for (const name of ["name", "email", "message"]) {
      await expect(
        page.locator(`#contact-form [name="${name}"]`),
      ).toBeVisible();
    }
    await expect(page.locator("#cf-turnstile-widget")).toBeAttached();
  });

  test("empty submit surfaces field validation errors", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("#contact-form")).toHaveAttribute(
      "data-cf-bound",
      "true",
    );

    await page.locator("#cf-submit-btn").click();

    await expect(page.locator("#cf-name-error")).not.toBeEmpty();
    await expect(page.locator("#cf-email-error")).not.toBeEmpty();
    await expect(page.locator("#cf-message-error")).not.toBeEmpty();
  });
});

test.describe("partner inquiry form", () => {
  test("renders all fields and the Turnstile container", async ({ page }) => {
    await page.goto("/partners");
    await expect(page.locator("#bp-form")).toBeVisible();
    for (const name of [
      "orgName",
      "contactName",
      "email",
      "orgType",
      "city",
      "message",
    ]) {
      await expect(page.locator(`#bp-form [name="${name}"]`)).toBeVisible();
    }
    await expect(page.locator("#bp-turnstile-widget")).toBeAttached();
  });

  test("empty submit surfaces field validation errors", async ({ page }) => {
    await page.goto("/partners");
    await expect(page.locator("#bp-form")).toHaveAttribute(
      "data-bp-bound",
      "true",
    );

    await page.locator("#bp-submit-btn").click();

    await expect(page.locator("#bp-orgName-error")).not.toBeEmpty();
    await expect(page.locator("#bp-email-error")).not.toBeEmpty();
    await expect(page.locator("#bp-message-error")).not.toBeEmpty();
  });
});
