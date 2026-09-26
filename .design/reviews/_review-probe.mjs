// Review helper (events r1): measurements, keyboard, states. Read-only against the dev server.
import { chromium } from "@playwright/test";
const base = "http://localhost:4322";
const out = (k, v) => console.log(`\n## ${k}\n` + (typeof v === "string" ? v : JSON.stringify(v, null, 2)));
const shots = new URL("./shots/", import.meta.url).pathname;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(base + "/events", { waitUntil: "networkidle" });

// 1. Contrast of text tokens (computed colour vs effective bg).
const contrast = await page.evaluate(() => {
  const lum = (c) => {
    const m = c.match(/[\d.]+/g).map(Number);
    const [r, g, b] = m.slice(0, 3).map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
    return +((x + 0.05) / (y + 0.05)).toFixed(2);
  };
  const sel = {
    count: ".ag-count",
    filterLabel: ".ag-filter-label",
    groupCount: ".ag-group-count",
    calHint: ".ag-cal-hint",
    dow: ".ag-dow",
    partnerSmall: ".ag-partner-text small",
    emptyDay: ".ag-day:not(.has-events)",
    cardMeta: ".ec-meta p:not(.ec-host)",
    badge: ".ec-badge:not(.ec-badge--type)",
    typeBadge: ".ec-badge--type",
    agSub: ".ag-sub",
    weekday: ".ag-when span",
    chipActive: '.ag-chip[aria-pressed="true"]',
  };
  const res = {};
  for (const [k, s] of Object.entries(sel)) {
    const el = document.querySelector(s);
    if (!el) { res[k] = "missing"; continue; }
    const cs = getComputedStyle(el);
    let bgEl = el, bg = "rgba(0, 0, 0, 0)";
    while (bgEl) {
      const b = getComputedStyle(bgEl).backgroundColor;
      if (!b.startsWith("rgba(0, 0, 0, 0)") && !b.endsWith(", 0)")) { bg = b; break; }
      bgEl = bgEl.parentElement;
    }
    res[k] = { color: cs.color, bg, size: cs.fontSize, weight: cs.fontWeight, ratio: ratio(cs.color, bg) };
  }
  return res;
});
out("contrast (text vs nearest opaque bg)", contrast);

// 2. Target sizes.
const targets = await page.evaluate(() => {
  const size = (s) => {
    const el = document.querySelector(s);
    if (!el) return "missing";
    const r = el.getBoundingClientRect();
    return `${Math.round(r.width)}x${Math.round(r.height)}`;
  };
  return {
    chip: size(".ag-chip"),
    calDay: size("[data-month]:not([hidden]) .ag-day.has-events"),
    calNav: size("[data-month]:not([hidden]) .ag-cal-nav"),
    clear: size(".ag-clear"),
    navCaret: size(".nav-caret"),
    more: size(".ag-more"),
  };
});
out("target sizes @1440", targets);
await page.setViewportSize({ width: 390, height: 844 });
out("target sizes @390", await page.evaluate(() => {
  const size = (s) => { const el = document.querySelector(s); if (!el) return "missing"; const r = el.getBoundingClientRect(); return `${Math.round(r.width)}x${Math.round(r.height)}`; };
  return { chip: size(".ag-chip"), calDay: size("[data-month]:not([hidden]) .ag-day.has-events"), calNav: size("[data-month]:not([hidden]) .ag-cal-nav"), hamburger: size("#nav-toggle") };
}));

// 3. Row card anatomy at 320.
await page.setViewportSize({ width: 320, height: 800 });
await page.waitForTimeout(300);
out("row card @320", await page.evaluate(() => {
  const it = document.querySelector("[data-item]:not([hidden])");
  const r = (s) => { const e = it.querySelector(s); const b = e.getBoundingClientRect(); return Math.round(b.width); };
  const t = it.querySelector(".ec-title");
  return { item: r(".ec") , media: r(".ec-media"), body: r(".ec-body"), titleText: t.textContent, titleLines: Math.round(t.getBoundingClientRect().height / parseFloat(getComputedStyle(t).lineHeight)), clipWhiteSpace: getComputedStyle(it.querySelector(".ec-clip")).whiteSpace };
}));
await page.locator("[data-item]:not([hidden])").first().screenshot({ path: shots + "row-320.png" });

// 4. Hero text over photo at 390 and 1440: screenshot the copy region for manual check.
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(base + "/events", { waitUntil: "networkidle" });
await page.screenshot({ path: shots + "hero-390.png" });
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(base + "/events", { waitUntil: "networkidle" });
await page.screenshot({ path: shots + "hero-1440.png" });

// 5. Keyboard: tab through the page and log the focus order into the agenda; check focus visibility.
const order = [];
await page.keyboard.press("Tab");
for (let i = 0; i < 40; i++) {
  const f = await page.evaluate(() => {
    const a = document.activeElement;
    const cs = getComputedStyle(a);
    return `${a.tagName}.${(a.className || "").toString().split(" ")[0]} "${(a.getAttribute("aria-label") || a.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40)}" outline=${cs.outlineStyle}/${cs.outlineWidth}`;
  });
  order.push(f);
  await page.keyboard.press("Tab");
}
out("tab order (first 40 stops from top)", order.join("\n"));

// 6. Chips by keyboard.
await page.goto(base + "/events", { waitUntil: "networkidle" });
const chip = page.locator('[data-filter="genre"]:not([data-value=""])').first();
await chip.focus();
await page.keyboard.press("Enter");
out("chip via Enter", { pressed: await chip.getAttribute("aria-pressed"), url: page.url(), count: await page.locator("[data-count]").textContent() });
await page.keyboard.press("Space");
out("chip via Space (toggle off)", { pressed: await chip.getAttribute("aria-pressed"), url: page.url() });

// 7. Empty filter state: combine a genre + partner that yields zero.
const combos = await page.evaluate(() => {
  const items = [...document.querySelectorAll("[data-item]")];
  const g = [...new Set(items.map((e) => e.dataset.genre).filter(Boolean))];
  const p = [...new Set(items.map((e) => e.dataset.partner).filter(Boolean))];
  for (const gg of g) for (const pp of p) if (!items.some((e) => e.dataset.genre === gg && e.dataset.partner === pp)) return [gg, pp];
  return null;
});
if (combos) {
  await page.goto(`${base}/events?genre=${combos[0]}&partner=${combos[1]}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  out("empty state via URL " + combos.join("+"), {
    emptyVisible: await page.locator("[data-empty]").isVisible(),
    count: await page.locator("[data-count]").textContent(),
    dimmedChips: await page.locator(".ag-chip.is-dim").count(),
  });
  await page.locator("[data-empty]").screenshot({ path: shots + "empty.png" });
  // also via click
  await page.goto(base + "/events", { waitUntil: "networkidle" });
  await page.locator(`[data-filter="genre"][data-value="${combos[0]}"]`).click();
  await page.locator(`[data-filter="partner"][data-value="${combos[1]}"]`).click();
  out("empty state via clicks", { emptyVisible: await page.locator("[data-empty]").isVisible(), url: page.url() });
  await page.locator("[data-empty] [data-clear]").click();
  out("after empty-state Clear", { url: page.url(), focused: await page.evaluate(() => document.activeElement?.tagName + "." + document.activeElement?.className) });
} else out("empty state", "no zero-result combo found");

// 8. Calendar keyboard.
await page.goto(base + "/events", { waitUntil: "networkidle" });
const days = page.locator("[data-month]:not([hidden]) [data-day-btn]");
const nDays = await days.count();
await days.first().focus();
const before = await page.evaluate(() => document.activeElement.dataset.dayBtn);
await page.keyboard.press("ArrowRight");
const afterRight = await page.evaluate(() => document.activeElement.dataset.dayBtn);
await page.keyboard.press("ArrowDown");
const afterDown = await page.evaluate(() => document.activeElement.dataset.dayBtn);
await page.keyboard.press("Enter");
const pressed = await page.evaluate(() => document.activeElement.getAttribute("aria-pressed"));
await page.keyboard.press("Tab");
const afterTab = await page.evaluate(() => { const a = document.activeElement; return a.dataset.dayBtn ? "day " + a.dataset.dayBtn : a.tagName + "." + a.className; });
out("calendar keys", { visibleMonthEventDays: nDays, before, afterRight, afterDown, enterPressed: pressed, tabGoesTo: afterTab, grid: await page.locator(".ag-cal-grid").first().getAttribute("role") });
// Arrow at end of month: does it cross to next month?
await days.last().focus();
await page.keyboard.press("ArrowRight");
out("ArrowRight on last event-day of month", await page.evaluate(() => document.activeElement.dataset.dayBtn || document.activeElement.className));

// 9. Show more focus.
await page.goto(base + "/events", { waitUntil: "networkidle" });
const lastVisibleBefore = await page.evaluate(() => [...document.querySelectorAll("[data-item]:not([hidden]) a.ec")].map((a) => a.getAttribute("href")));
await page.locator("[data-more]").focus();
await page.keyboard.press("Enter");
await page.waitForTimeout(200);
const focusedHref = await page.evaluate(() => document.activeElement?.getAttribute("href"));
out("Show more (no filters)", {
  visibleBefore: lastVisibleBefore.length,
  visibleAfter: await page.locator("[data-item]:not([hidden])").count(),
  focusedHref,
  focusedWasAlreadyVisible: lastVisibleBefore.includes(focusedHref),
  focusedIndexInOldList: lastVisibleBefore.indexOf(focusedHref),
});
// Show more with a filter that has > 15 matches.
const bigPartner = await page.evaluate(() => {
  const items = [...document.querySelectorAll("[data-item]")];
  const c = {}; items.forEach((e) => (c[e.dataset.partner] = (c[e.dataset.partner] || 0) + 1));
  return Object.entries(c).sort((a, b) => b[1] - a[1])[0];
});
await page.goto(`${base}/events?partner=${bigPartner[0]}`, { waitUntil: "networkidle" });
await page.waitForTimeout(200);
if (await page.locator("[data-more]").isVisible()) {
  const vis = await page.evaluate(() => [...document.querySelectorAll("[data-item]:not([hidden]) a.ec")].map((a) => a.getAttribute("href")));
  await page.locator("[data-more]").click();
  await page.waitForTimeout(200);
  const f = await page.evaluate(() => document.activeElement?.getAttribute("href"));
  out(`Show more (partner=${bigPartner[0]}, ${bigPartner[1]} events)`, { focused: f, focusedWasAlreadyVisible: vis.includes(f), indexInOld: vis.indexOf(f) });
}

// 10. Sticky group heading vs navbar at 1440 and 390.
for (const [w, h] of [[1440, 900], [390, 844]]) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(base + "/events", { waitUntil: "networkidle" });
  const g = page.locator(".ag-group:not([hidden])").nth(1);
  await g.evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + 300));
  await page.waitForTimeout(400);
  out(`sticky heading @${w}`, await page.evaluate(() => {
    const pill = document.getElementById("nav-pill").getBoundingClientRect();
    const hs = [...document.querySelectorAll(".ag-group:not([hidden]) .ag-group-h")].map((e) => e.getBoundingClientRect()).filter((r) => r.top < 200 && r.bottom > 0);
    return { pillBottom: Math.round(pill.bottom), headingTops: hs.map((r) => [Math.round(r.top), Math.round(r.bottom)]) };
  }));
  await page.screenshot({ path: shots + `sticky-${w}.png` });
}

// 11. Nav dropdown keyboard at 1440.
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(base + "/events", { waitUntil: "networkidle" });
const caret = page.getByRole("button", { name: "More in About" });
await caret.focus();
await page.keyboard.press("Enter");
const exp1 = await caret.getAttribute("aria-expanded");
await page.keyboard.press("Tab");
const f1 = await page.evaluate(() => document.activeElement.textContent.trim().replace(/\s+/g, " "));
await page.keyboard.press("Tab");
const f2 = await page.evaluate(() => document.activeElement.textContent.trim().replace(/\s+/g, " "));
await page.keyboard.press("Tab");
const f3 = await page.evaluate(() => document.activeElement.textContent.trim().replace(/\s+/g, " "));
const exp2 = await caret.getAttribute("aria-expanded");
await caret.focus();
await page.keyboard.press("Space");
await page.keyboard.press("Escape");
out("nav dropdown keyboard", { afterEnter: exp1, tab1: f1, tab2: f2, tab3: f3, expandedAfterTabbingOut: exp2, afterEscape: await caret.getAttribute("aria-expanded"), focusAfterEsc: await page.evaluate(() => document.activeElement.getAttribute("aria-label")) });
await caret.focus();
await page.keyboard.press("Enter");
await page.screenshot({ path: shots + "nav-open-1440.png", clip: { x: 300, y: 0, width: 840, height: 260 } });
out("nav caret focus ring", await caret.evaluate((b) => { const cs = getComputedStyle(b); return `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`; }));
// Nav at 1024-1100 (new nav-full breakpoint).
for (const w of [1023, 1024, 1060]) {
  await page.setViewportSize({ width: w, height: 800 });
  await page.waitForTimeout(200);
  out(`nav @${w}`, await page.evaluate(() => { const p = document.getElementById("nav-pill").getBoundingClientRect(); return { pillWidth: Math.round(p.width), pillLeft: Math.round(p.left), hamburgerVisible: getComputedStyle(document.getElementById("nav-toggle")).display !== "none" }; }));
  await page.screenshot({ path: shots + `nav-${w}.png`, clip: { x: 0, y: 0, width: w, height: 110 } });
}

// 12. Reduced motion.
const rm = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const rp = await rm.newPage();
await rp.goto(base + "/events", { waitUntil: "networkidle" });
out("reduced motion", await rp.evaluate(() => {
  const g = (s, p) => { const e = document.querySelector(s); return e ? getComputedStyle(e)[p] : "missing"; };
  return { ecTransition: g(".ec", "transition"), chipTransition: g(".ag-chip", "transition"), navMenuTransition: g(".nav-menu", "transition"), smoothScrollUsed: "scrollIntoView smooth on day click (not gated)" };
}));
await rm.close();

// 13. Detail pages at 390: order of past-state banner vs facts card; more-from list date visibility.
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(base + "/events/914", { waitUntil: "networkidle" });
out("past detail @390", await page.evaluate(() => {
  const y = (s) => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().top + scrollY) : null; };
  return { endedBannerY: y(".ed-ended"), factsCardY: y(".ed-card"), coverY: y(".ed-cover"), viewportH: innerHeight, registerBtn: !!document.querySelector("[data-event-register]"), quietBtn: document.querySelector(".ed-btn--quiet")?.textContent.trim() };
}));
await page.screenshot({ path: shots + "past-390.png" });
await page.goto(base + "/events/679", { waitUntil: "networkidle" });
out("upcoming detail @390", await page.evaluate(() => {
  const b = document.querySelector("[data-event-register]")?.getBoundingClientRect();
  return { registerTop: b && Math.round(b.top + scrollY), viewportH: innerHeight };
}));
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(base + "/events/679", { waitUntil: "networkidle" });
out("more-from rows: visible date text?", await page.evaluate(() => [...document.querySelectorAll(".ed-more .ec")].map((a) => {
  const title = a.querySelector(".ec-title").textContent.trim();
  const visibleMeta = [...a.querySelectorAll(".ec-meta p")].map((p) => p.innerText.trim()).join(" | ");
  return `${title} :: ${visibleMeta}`;
})));
out("card accessible name sample", await page.evaluate(() => document.querySelector(".ed-more .ec")?.innerText.replace(/\s+/g, " ").trim()));

// 14. H1 count and JSON-LD.
for (const r of ["/events", "/events/679"]) {
  await page.goto(base + r, { waitUntil: "networkidle" });
  out("seo " + r, await page.evaluate(() => ({
    h1: document.querySelectorAll("main h1").length,
    title: document.title,
    canonical: document.querySelector('link[rel="canonical"]')?.href,
    ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent)["@type"]),
  })));
}
await browser.close();
