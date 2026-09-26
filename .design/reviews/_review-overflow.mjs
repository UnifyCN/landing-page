// Review helper (events r1): sweep widths 320-1920 for horizontal overflow.
import { chromium } from "@playwright/test";
const base = "http://localhost:4322";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const routes = [
  "/events",
  "/events/679-international-student-group-advising",
  "/events/914-turn-knowledge-into-career-success-with-sfu-beedie-s-ft-mba",
];
for (const r of routes) {
  await page.goto(base + r, { waitUntil: "networkidle" });
  const bad = [];
  for (let w = 320; w <= 1920; w += 10) {
    await page.setViewportSize({ width: w, height: 900 });
    const o = await page.evaluate(() => {
      const de = document.documentElement;
      const over = de.scrollWidth - de.clientWidth;
      const offenders = [];
      if (over > 0) {
        for (const el of document.querySelectorAll("body *")) {
          const rc = el.getBoundingClientRect();
          if (rc.right > de.clientWidth + 1 && rc.width > 0) {
            offenders.push(el.className?.toString?.().slice(0, 40) || el.tagName);
            if (offenders.length > 4) break;
          }
        }
      }
      return { over, offenders };
    });
    if (o.over > 0) bad.push(`${w}:${o.over}px ${o.offenders.join("|")}`);
  }
  console.log(r, bad.length ? "\n  " + bad.join("\n  ") : "no horizontal overflow 320-1920 (step 10)");
}
await browser.close();
