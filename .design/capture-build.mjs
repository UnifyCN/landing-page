// Build-phase evidence: captures real routes from the worktree dev server.
// Usage: node .design/capture-build.mjs <outDir> <path> [path ...]
// Prints horizontal overflow per width; widths cover the continuous-resize sweep.
import { chromium } from "@playwright/test";

const [outDir, ...paths] = process.argv.slice(2);
const base = "http://localhost:4322";
const widths = (process.env.WIDTHS ?? "1440,390").split(",").map(Number);
const full = process.env.FULL !== "0";

const browser = await chromium.launch();
for (const p of paths) {
  for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto(base + p, { waitUntil: "networkidle" });
    await page.evaluate(() => document.querySelectorAll("img[loading=lazy]").forEach((i) => (i.loading = "eager")));
    await page.waitForTimeout(1200);
    const name = p.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "") || "root";
    if (full) await page.screenshot({ path: `${outDir}/${name}-${w}.png`, fullPage: true });
    const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    console.log(`${p} @${w}: overflow ${over}px`);
    await page.close();
  }
}
await browser.close();
