import { test, expect } from "@playwright/test";

// /events is server-rendered from live Supabase rows and the wall clock. The
// dev server swaps both for a fixture when a request carries
// `x-events-fixture` (src/lib/events/fixtures.ts), so every assertion below is
// against known events on a known date. The agenda island binds via
// astro:page-load behind data-ev-bound.
//
// Fixture: 8 partner events on Oct 7 (x2), 8, 14, 15, 29 and Nov 3, 12, one
// featured Unify event on Oct 17, and one past event (id 9050, Sep 20).
//   mid-month  = Tue 2026-10-06, events left in the current month
//   month-end  = Wed 2026-09-30, the current month has no events left. This is
//                the date of the failed deploy run (Actions 36791295477).
const CLOCKS = ["mid-month", "month-end"] as const;

for (const clock of CLOCKS) {
  test.describe(`events page (${clock})`, () => {
    test.use({ extraHTTPHeaders: { "x-events-fixture": clock } });

    test("renders the agenda and binds the filter island", async ({ page }) => {
      await page.goto("/events");
      await expect(page.locator("main h1")).toHaveText(/Free Events for Newcomers in Canada/);

      const agenda = page.locator("#events-agenda");
      await expect(agenda).toHaveAttribute("data-ev-bound", "true");
      await expect(agenda.locator("[data-item]:not([hidden])")).toHaveCount(8);
      await expect(agenda.locator("[data-count]")).toHaveText(/8 upcoming events/);
      // The featured Unify event sits in the hero band, not the partner agenda.
      await expect(page.locator(".evh")).toContainText("Unify Gather: Newcomer Social");
      await expect(agenda).not.toContainText("Unify Gather: Newcomer Social");
      await expect(agenda).not.toContainText("Library Tour for Newcomers");
    });

    test("topic chip filters the list, writes the URL, and clears", async ({ page }) => {
      await page.goto("/events");
      const agenda = page.locator("#events-agenda");
      await expect(agenda).toHaveAttribute("data-ev-bound", "true");

      const chip = agenda.locator('[data-filter="genre"][data-value="Employment"]');
      await chip.click();

      await expect(chip).toHaveAttribute("aria-pressed", "true");
      await expect(page).toHaveURL(/genre=Employment/);
      const shown = agenda.locator("[data-item]:not([hidden])");
      await expect(shown).toHaveCount(2);
      for (let i = 0; i < 2; i++) {
        await expect(shown.nth(i)).toHaveAttribute("data-genre", "Employment");
      }

      await agenda.locator(".ag-toolbar [data-clear]").click();
      await expect(page).toHaveURL(/\/events$/);
      await expect(agenda.locator('[data-filter="genre"][data-value=""]')).toHaveAttribute("aria-pressed", "true");
      await expect(shown).toHaveCount(8);
    });

    test("the calendar opens on the first month that has events", async ({ page }) => {
      await page.goto("/events");
      const calendar = page.locator("#events-agenda [data-calendar]");
      await expect(calendar).toHaveAttribute("data-active-month", "2026-10");
      await expect(calendar.locator("[data-month]:not([hidden])")).toHaveAttribute("data-month", "2026-10");
      await expect(calendar.locator("[data-month]:not([hidden]) [data-day-btn]")).toHaveCount(5);
    });

    test("a calendar day filters to that day", async ({ page }) => {
      await page.goto("/events");
      const agenda = page.locator("#events-agenda");
      await expect(agenda).toHaveAttribute("data-ev-bound", "true");

      const day = agenda.locator("[data-month]:not([hidden]) [data-day-btn]").first();
      await expect(day).toHaveAttribute("data-day-btn", "2026-10-07");
      await day.click();
      await expect(day).toHaveAttribute("aria-pressed", "true");
      await expect(page).toHaveURL(/day=2026-10-07/);

      const shown = agenda.locator("[data-item]:not([hidden])");
      await expect(shown).toHaveCount(2);
      for (let i = 0; i < 2; i++) {
        await expect(shown.nth(i)).toHaveAttribute("data-day", "2026-10-07");
      }
    });

    test("calendar arrow keys move between event days", async ({ page }) => {
      await page.goto("/events");
      const agenda = page.locator("#events-agenda");
      await expect(agenda).toHaveAttribute("data-ev-bound", "true");

      const days = agenda.locator("[data-day-btn]");
      await expect(days).toHaveCount(7);
      await expect(days.nth(0)).toHaveAttribute("data-day-btn", "2026-10-07");
      await days.nth(0).focus();
      await page.keyboard.press("ArrowRight");
      const second = agenda.locator('[data-day-btn="2026-10-08"]');
      await expect(second).toBeFocused();
      await expect(second).toHaveAttribute("tabindex", "0");
    });

    test("arrow keys cross into the next month and show it", async ({ page }) => {
      await page.goto("/events");
      const agenda = page.locator("#events-agenda");
      await expect(agenda).toHaveAttribute("data-ev-bound", "true");

      await agenda.locator('[data-day-btn="2026-10-29"]').focus();
      await page.keyboard.press("ArrowRight");
      await expect(agenda.locator('[data-day-btn="2026-11-03"]')).toBeFocused();
      await expect(agenda.locator('[data-month="2026-11"]')).toBeVisible();
      await expect(agenda.locator('[data-month="2026-10"]')).toBeHidden();
    });

    test("on phones the calendar starts folded and opens from its summary", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/events");
      const calendar = page.locator("#events-agenda [data-calendar]");
      await expect(page.locator("#events-agenda")).toHaveAttribute("data-ev-bound", "true");
      await expect(calendar).not.toHaveAttribute("open", "");
      await calendar.locator("summary").click();
      await expect(calendar).toHaveAttribute("open", "");
      await expect(calendar.locator("[data-month]:not([hidden]) [data-day-btn]").first()).toBeVisible();
    });

    test("an event card opens its detail page with a register link", async ({ page }) => {
      await page.goto("/events");
      const card = page.locator("#events-agenda a.ec").first();
      await expect(card).toHaveAttribute("href", "/events/9001-esl-conversation-practice");
      await card.click();
      await expect(page).toHaveURL(/\/events\/9001-esl-conversation-practice$/);
      // Scoped to <main>: Playwright pierces the dev toolbar's shadow-DOM h1s.
      await expect(page.locator("main h1")).toHaveCount(1);
      await expect(page.locator("main h1")).toHaveText("ESL Conversation Practice");
      await expect(page.locator("a[data-event-register]")).toHaveAttribute("target", "_blank");
    });

    test("a detail URL with a stale slug 301s to the canonical one", async ({ page, request }) => {
      const res = await request.get("/events/9001-old-title", { maxRedirects: 0 });
      expect(res.status()).toBe(301);
      expect(res.headers().location).toBe("/events/9001-esl-conversation-practice");

      await page.goto("/events/9001-old-title");
      await expect(page).toHaveURL(/\/events\/9001-esl-conversation-practice$/);
    });
  });
}

test.describe("events page (month-end)", () => {
  test.use({ extraHTTPHeaders: { "x-events-fixture": "month-end" } });

  test("the empty current month stays reachable behind the previous-month button", async ({ page }) => {
    await page.goto("/events");
    const calendar = page.locator("#events-agenda [data-calendar]");
    await expect(page.locator("#events-agenda")).toHaveAttribute("data-ev-bound", "true");

    await calendar.locator('[data-month="2026-10"] [data-month-nav="-1"]').click();
    await expect(calendar.locator('[data-month="2026-09"]')).toBeVisible();
    await expect(calendar.locator('[data-month="2026-09"] [data-day-btn]')).toHaveCount(0);
    await expect(calendar.locator('[data-month="2026-09"] .is-today')).toHaveText("30");
  });
});
