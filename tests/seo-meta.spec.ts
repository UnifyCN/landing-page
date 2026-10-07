import { test, expect, type APIRequestContext } from "@playwright/test";
import { GUIDE_HUBS } from "../src/lib/guide-hubs";
import { partners } from "../src/lib/partners";
import { resources } from "../src/lib/resources";
import { LICENCE_RULES } from "../src/lib/licence-exchange";
import { HEALTH_PLANS } from "../src/lib/health-coverage";
import { TEER_TIERS } from "../src/lib/teer";
import { CREDENTIALS } from "../src/lib/credentials";
import { fitDescription, fitTitle, pickDescription } from "../src/lib/seo/meta";

// Google cuts titles near 60 characters and descriptions near 160. These read
// the served HTML (no browser needed), so the whole site is checked quickly.
// Targets per hub: ~/Unify/seo-targets.md (kept outside the repo).
const TITLE_MAX = 60;
const DESCRIPTION_MAX = 160;

const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

async function head(request: APIRequestContext, path: string) {
  const res = await request.get(path);
  expect(res.status(), path).toBe(200);
  const html = await res.text();
  const title = decode(/<title>([\s\S]*?)<\/title>/.exec(html)?.[1] ?? "");
  const description = decode(/<meta name="description" content="([^"]*)"/.exec(html)?.[1] ?? "");
  const h1s = [...html.matchAll(/<h1[\s>]/g)].length;
  const ldTypes = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
    (m) => JSON.parse(m[1])["@type"] as string,
  );
  return { title, description, h1s, ldTypes, html };
}

test.describe("guide hubs", () => {
  for (const hub of GUIDE_HUBS) {
    test(`${hub.href} has a 50-60 character title, a description under 160, one h1 and FAQ data`, async ({
      request,
    }) => {
      const page = await head(request, hub.href);
      expect(page.title.length, page.title).toBeGreaterThanOrEqual(50);
      expect(page.title.length, page.title).toBeLessThanOrEqual(TITLE_MAX);
      expect(page.description.length, page.description).toBeGreaterThanOrEqual(110);
      expect(page.description.length, page.description).toBeLessThan(DESCRIPTION_MAX);
      expect(page.h1s).toBe(1);
      expect(page.ldTypes).toEqual(expect.arrayContaining(["Organization", "BreadcrumbList", "FAQPage"]));
    });
  }

  test("HowTo data is present only where the page shows numbered steps, and matches them", async ({
    request,
  }) => {
    const withSteps = ["/new-to-canada", "/drivers-licence"];
    for (const hub of GUIDE_HUBS) {
      const { ldTypes } = await head(request, hub.href);
      expect(ldTypes.includes("HowTo"), hub.href).toBe(withSteps.includes(hub.href));
    }

    for (const path of withSteps) {
      const { html } = await head(request, path);
      const howTo = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
        .map((m) => JSON.parse(m[1]))
        .find((ld) => ld["@type"] === "HowTo");
      expect(howTo, path).toBeTruthy();
      expect(howTo.step.length, path).toBeGreaterThanOrEqual(5);
      if (path === "/drivers-licence") expect(howTo.step).toHaveLength(5);

      // Compare against what a visitor can read: scripts (the JSON-LD itself
      // included), styles, comments and tags are stripped first, so the markup
      // cannot vouch for itself.
      const visible = decode(
        html
          .replace(/<script[\s\S]*?<\/script>/g, " ")
          .replace(/<style[\s\S]*?<\/style>/g, " ")
          .replace(/<!--[\s\S]*?-->/g, " ")
          .replace(/<[^>]+>/g, " "),
      ).replace(/\s+/g, " ");
      for (const step of howTo.step) {
        expect(visible, `${path}: step name "${step.name}"`).toContain(step.name);
        expect(visible, `${path}: step text "${step.text.slice(0, 40)}"`).toContain(step.text);
      }
    }
  });
});

test("no page has a description over 160 characters or a missing title", async ({ request }) => {
  test.setTimeout(120_000);
  const paths = [
    "/",
    "/about",
    "/contact",
    "/events",
    "/partners",
    "/resources",
    "/blog",
    "/whats-new",
    ...GUIDE_HUBS.map((h) => h.href),
    ...partners.map((p) => `/partners/${p.slug}`),
    ...resources.map((r) => `/resources/${r.slug}`),
    ...LICENCE_RULES.map((r) => `/drivers-licence/${r.slug}`),
    ...HEALTH_PLANS.map((p) => `/health-card/${p.slug}`),
    ...TEER_TIERS.map((t) => `/teer/${t.slug}`),
    ...CREDENTIALS.map((c) => `/credentials/${c.slug}`),
  ];
  const tooLong: string[] = [];
  for (const path of paths) {
    const page = await head(request, path);
    expect(page.title.length, `${path} title`).toBeGreaterThan(0);
    if (page.description.length > DESCRIPTION_MAX) tooLong.push(`${path} (${page.description.length})`);
  }
  expect(tooLong).toEqual([]);
});

test("province and resource page titles fit in 60 characters", async ({ request }) => {
  const paths = [
    ...LICENCE_RULES.map((r) => `/drivers-licence/${r.slug}`),
    ...HEALTH_PLANS.map((p) => `/health-card/${p.slug}`),
    ...resources.map((r) => `/resources/${r.slug}`),
  ];
  const tooLong: string[] = [];
  for (const path of paths) {
    const { title } = await head(request, path);
    if (title.length > TITLE_MAX) tooLong.push(`${path} (${title.length}): ${title}`);
  }
  expect(tooLong).toEqual([]);
});

test.describe("length helpers", () => {
  test("fitTitle picks the first candidate that fits, else the last", () => {
    expect(fitTitle("a".repeat(61), "b".repeat(60), "c")).toBe("b".repeat(60));
    expect(fitTitle("a".repeat(61), "b".repeat(70))).toBe("b".repeat(70));
  });

  test("pickDescription and fitDescription never exceed 160 characters", () => {
    const long = "This sentence is about forty characters. ".repeat(8).trim();
    expect(pickDescription(long, "Short enough.")).toBe("Short enough.");
    expect(fitDescription("Short enough.")).toBe("Short enough.");

    const sentences = fitDescription(long);
    expect(sentences.length).toBeLessThanOrEqual(160);
    expect(sentences.endsWith(".")).toBe(true);

    const oneSentence = fitDescription(`${"word ".repeat(60).trim()}.`);
    expect(oneSentence.length).toBeLessThanOrEqual(160);
    expect(oneSentence.endsWith("…")).toBe(true);
    expect(oneSentence).not.toMatch(/\s…$/);
  });
});
