// Review helper (events r1): View Transition re-binding, mobile first-event position, month nav.
import { chromium } from "@playwright/test";
const base = "http://localhost:4322";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(base + "/", { waitUntil: "networkidle" });
await page.locator("#nav-pill a.nav-link", { hasText: "Events" }).click();
await page.waitForURL(/\/events$/);
await page.waitForTimeout(500);
const bound1 = await page.locator("#events-agenda").getAttribute("data-ev-bound");
await page.locator('[data-filter="partner"]:not([data-value=""])').first().click();
const url1 = page.url();
// Into a detail page and back via the back link (client nav).
await page.locator("#events-agenda [data-item]:not([hidden]) a.ec").first().click();
await page.waitForURL(/\/events\/\d+-/);
await page.locator("a.ed-back").click();
await page.waitForURL(/\/events/);
await page.waitForTimeout(500);
const bound2 = await page.locator("#events-agenda").getAttribute("data-ev-bound");
const day = page.locator("[data-month]:not([hidden]) [data-day-btn]").first();
await day.click();
console.log("VT", { bound1, url1, bound2, dayPressedAfterReturn: await day.getAttribute("aria-pressed"), url2: page.url() });

// Month nav keyboard focus handoff.
await page.goto(base + "/events", { waitUntil: "networkidle" });
const next = page.locator('[data-month]:not([hidden]) [data-month-nav="1"]');
await next.focus();
await page.keyboard.press("Enter");
const fAfter = await page.evaluate(() => ({ label: document.activeElement.getAttribute("aria-label"), month: document.activeElement.closest("[data-month]")?.dataset.month }));
console.log("month nav focus", fAfter, "months:", await page.locator("[data-month]").count());

// Mobile: where does the first event land with live data (no featured)?
for (const [w, h] of [[390, 844], [320, 640], [810, 1000]]) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(base + "/events", { waitUntil: "networkidle" });
  const y = await page.evaluate(() => {
    const top = (s) => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().top + scrollY) : null; };
    return { heroBottom: Math.round(document.querySelector(".evh").getBoundingClientRect().bottom + scrollY), calendar: top(".ag-cal"), chips: top(".ag-filters"), firstCard: top("[data-item]:not([hidden])"), vh: innerHeight };
  });
  console.log(`first event @${w}`, y, "screens to first card:", (y.firstCard / y.vh).toFixed(2));
}
await browser.close();
