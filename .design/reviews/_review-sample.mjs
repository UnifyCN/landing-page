// Review helper (events r1): sample background pixels next to hero text from the live page.
import { chromium } from "@playwright/test";
const browser = await chromium.launch();
for (const [w, h] of [[390, 844], [1440, 900]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto("http://localhost:4322/events", { waitUntil: "networkidle" });
  const b = await page.locator(".evh-eyebrow").first().boundingBox();
  const t = await page.locator(".evh-title").first().boundingBox();
  await page.addStyleTag({ content: ".evh-inner *{color:transparent!important}" });
  await page.waitForTimeout(200);
  const res = {};
  for (const [name, box] of [["eyebrow", b], ["title", t]]) {
    const buf = await page.screenshot({ clip: box });
    res[name] = await page.evaluate(async (b64) => {
      const img = new Image(); img.src = "data:image/png;base64," + b64; await img.decode();
      const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
      const x = c.getContext("2d"); x.drawImage(img, 0, 0);
      const d = x.getImageData(0, 0, c.width, c.height).data;
      const L = (r, g, bb) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(bb); };
      const arr = [];
      for (let i = 0; i < d.length; i += 4) arr.push([d[i], d[i + 1], d[i + 2], L(d[i], d[i + 1], d[i + 2])]);
      arr.sort((p, q) => p[3] - q[3]);
      const pick = (q) => arr[Math.floor((arr.length - 1) * q)].slice(0, 3);
      return { size: [img.width, img.height], darkest: pick(0), median: pick(0.5), p95: pick(0.95), brightest: pick(1) };
    }, buf.toString("base64"));
  }
  console.log(w, JSON.stringify(res));
  await page.close();
}
await browser.close();
