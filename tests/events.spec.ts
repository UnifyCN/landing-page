import { test, expect } from "@playwright/test";

// /events renders live Supabase data (public.events), so these tests assert
// behaviour against whatever is upcoming, not specific events. The agenda
// island binds via astro:page-load behind data-ev-bound.
test.describe("events page", () => {
  test("renders the agenda and binds the filter island", async ({ page }) => {
    await page.goto("/events");
    await expect(page.locator("main h1")).toHaveText(/Free Events for Newcomers in Canada/);

    const agenda = page.locator("#events-agenda");
    await expect(agenda).toHaveAttribute("data-ev-bound", "true");
    await expect(agenda.locator("[data-item]:not([hidden])").first()).toBeVisible();
  });

  test("topic chip filters the list, writes the URL, and clears", async ({ page }) => {
    await page.goto("/events");
    const agenda = page.locator("#events-agenda");
    await expect(agenda).toHaveAttribute("data-ev-bound", "true");

    const chip = agenda.locator('[data-filter="genre"]:not([data-value=""])').first();
    const genre = await chip.getAttribute("data-value");
    await chip.click();

    await expect(chip).toHaveAttribute("aria-pressed", "true");
    await expect(page).toHaveURL(new RegExp(`genre=${genre}`));
    const shown = agenda.locator("[data-item]:not([hidden])");
    const n = await shown.count();
    expect(n).toBeGreaterThan(0);
    for (let i = 0; i < n; i++) {
      await expect(shown.nth(i)).toHaveAttribute("data-genre", genre!);
    }

    await agenda.locator(".ag-toolbar [data-clear]").click();
    await expect(page).toHaveURL(/\/events$/);
    await expect(agenda.locator('[data-filter="genre"][data-value=""]')).toHaveAttribute("aria-pressed", "true");
  });

  test("a calendar day filters to that day", async ({ page }) => {
    await page.goto("/events");
    const agenda = page.locator("#events-agenda");
    await expect(agenda).toHaveAttribute("data-ev-bound", "true");

    const day = agenda.locator("[data-month]:not([hidden]) [data-day-btn]").first();
    const key = await day.getAttribute("data-day-btn");
    await day.click();
    await expect(day).toHaveAttribute("aria-pressed", "true");

    const shown = agenda.locator("[data-item]:not([hidden])");
    const n = await shown.count();
    expect(n).toBeGreaterThan(0);
    for (let i = 0; i < n; i++) {
      await expect(shown.nth(i)).toHaveAttribute("data-day", key!);
    }
  });

  test("an event card opens its detail page with a register link", async ({ page }) => {
    await page.goto("/events");
    const card = page.locator("#events-agenda a.ec").first();
    const href = await card.getAttribute("href");
    await card.click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    // Scoped to <main>: Playwright pierces the dev toolbar's shadow-DOM h1s.
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator("a[data-event-register]")).toHaveAttribute("target", "_blank");
  });

  test("a detail URL with a stale slug 301s to the canonical one", async ({ page }) => {
    await page.goto("/events");
    const href = await page.locator("#events-agenda a.ec").first().getAttribute("href");
    const id = href!.match(/^\/events\/(\d+)-/)![1];
    await page.goto(`/events/${id}-old-title`);
    await expect(page).toHaveURL(new RegExp(`${href}$`));
  });
});
