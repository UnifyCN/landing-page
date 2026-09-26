// Captures every r1 option at desktop and phone widths into .design/evidence/r1/.
// Usage: node .design/experiments/r1/capture.mjs [option-file ...]
import { chromium } from "@playwright/test";

const base = "http://127.0.0.1:8767/";
const out = new URL("../../evidence/r1/", import.meta.url).pathname;
const files = process.argv.slice(2).length ? process.argv.slice(2) : ["a-spotlight.html", "b-agenda.html", "c-frontpage.html"];
const sizes = [{ w: 1440, h: 900 }, { w: 390, h: 844 }];

const browser = await chromium.launch();
for (const f of files) {
  for (const { w, h } of sizes) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    await page.goto(base + f, { waitUntil: "networkidle" });
    // Force lazy images to load so the capture shows real covers.
    await page.evaluate(() => document.querySelectorAll("img[loading=lazy]").forEach((i) => (i.loading = "eager")));
    await page.waitForTimeout(2000);
    const name = f.replace(".html", "");
    await page.screenshot({ path: `${out}${name}-${w}-fold.png` });
    await page.screenshot({ path: `${out}${name}-${w}.png`, fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    console.log(`${name} @${w}: overflow ${overflow}px`);
    await page.close();
  }
}
await browser.close();
