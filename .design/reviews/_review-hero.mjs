// Review helper (events r1): hero text contrast over the photo, measured per glyph pixel.
// Screenshot each text box with and without the text; pixels that change are glyph
// pixels; contrast = text colour vs the background pixel under that glyph.
import { chromium } from "@playwright/test";
const base = "http://localhost:4322";
const browser = await chromium.launch();

for (const [w, h] of [[320, 700], [390, 844], [810, 900], [1440, 900], [1920, 1080]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(base + "/events", { waitUntil: "networkidle" });
  const targets = [".evh-eyebrow", ".evh-title", ".evh-lede", ".evh-stat dt"];
  const info = {};
  for (const t of targets) {
    const el = page.locator(t).first();
    const box = await el.evaluate((e) => {
      const r = document.createRange(); r.selectNodeContents(e);
      const b = r.getBoundingClientRect();
      return { x: Math.max(0, b.x), y: b.y + scrollY, width: b.width, height: b.height };
    });
    const color = await el.evaluate((e) => getComputedStyle(e).color);
    const withText = (await page.screenshot({ clip: box, fullPage: true })).toString("base64");
    info[t] = { box, color, withText };
  }
  await page.addStyleTag({ content: ".evh-inner *{color:transparent!important} .evh-dot{color:transparent!important}" });
  await page.waitForTimeout(150);
  const res = {};
  for (const t of targets) {
    const { box, color, withText } = info[t];
    const without = (await page.screenshot({ clip: box, fullPage: true })).toString("base64");
    res[t] = await page.evaluate(async ({ a, b, color }) => {
      const load = async (s) => { const i = new Image(); i.src = "data:image/png;base64," + s; await i.decode(); const c = document.createElement("canvas"); c.width = i.width; c.height = i.height; const x = c.getContext("2d"); x.drawImage(i, 0, 0); return x.getImageData(0, 0, c.width, c.height).data; };
      const A = await load(a), B = await load(b);
      const L = (r, g, bb) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(bb); };
      const m = color.match(/[\d.]+/g).map(Number); const al = m[3] ?? 1;
      const rs = [];
      for (let i = 0; i < A.length; i += 4) {
        const diff = Math.abs(A[i] - B[i]) + Math.abs(A[i + 1] - B[i + 1]) + Math.abs(A[i + 2] - B[i + 2]);
        if (diff < 60) continue; // glyph-core pixels only
        const bg = [B[i], B[i + 1], B[i + 2]];
        const fg = [0, 1, 2].map((k) => m[k] * al + bg[k] * (1 - al));
        const [x, y] = [L(...fg), L(...bg)].sort((p, q) => q - p);
        rs.push((x + 0.05) / (y + 0.05));
      }
      rs.sort((p, q) => p - q);
      const q = (f) => +rs[Math.floor((rs.length - 1) * f)].toFixed(2);
      return { glyphPx: rs.length, min: q(0), p5: q(0.05), median: q(0.5) };
    }, { a: withText, b: without, color });
  }
  console.log(`@${w}`, JSON.stringify(res));
  await page.close();
}
await browser.close();
