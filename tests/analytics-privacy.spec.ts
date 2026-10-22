import { test, expect } from "@playwright/test";
import { isSameSite, sanitizeEvent, sanitizeProperties, sanitizeUrl } from "../src/lib/analytics/privacy";

// URL scrubbing run on every PostHog event (before_send in
// src/scripts/analytics.ts). Pure; runs in the Playwright worker.
const SITE = "unifysocial.ca";

test.describe("sanitizeUrl", () => {
  test("keeps utm_*, ref, gclid, fbclid and drops every other parameter and the fragment", () => {
    expect(
      sanitizeUrl(
        "https://unifysocial.ca/teer?email=alice%40example.test&utm_source=x&utm_campaign=c&name=Alice&ref=r&gclid=g&fbclid=f&token=t#frag",
      ),
    ).toBe("https://unifysocial.ca/teer?utm_source=x&utm_campaign=c&ref=r&gclid=g&fbclid=f");
  });

  test("a URL with nothing worth keeping loses its ? and #", () => {
    expect(sanitizeUrl("https://unifysocial.ca/about?email=a%40b.c#top")).toBe("https://unifysocial.ca/about");
    expect(sanitizeUrl("https://unifysocial.ca/")).toBe("https://unifysocial.ca/");
  });

  test("dropQuery removes every parameter, attribution included", () => {
    expect(sanitizeUrl("https://www.google.com/search?q=alice&utm_source=x#a", { dropQuery: true })).toBe(
      "https://www.google.com/search",
    );
  });

  test("site paths are scrubbed too", () => {
    expect(sanitizeUrl("/about?email=a%40b.c&utm_medium=m#x")).toBe("/about?utm_medium=m");
    expect(sanitizeUrl("/")).toBe("/");
  });

  test("anything that is not an http(s) URL or a path is left alone", () => {
    for (const value of ["$direct", "", "google", "mailto:a@b.c?subject=x", "//evil.com/?email=x", "hero"]) {
      expect(sanitizeUrl(value), value).toBe(value);
    }
  });
});

test.describe("isSameSite", () => {
  test("the current host and every unifysocial.ca host are this site", () => {
    expect(isSameSite("unifysocial.ca", SITE)).toBe(true);
    expect(isSameSite("www.unifysocial.ca", SITE)).toBe(true);
    expect(isSameSite("app.unifysocial.ca", SITE)).toBe(true);
    expect(isSameSite("localhost", "localhost")).toBe(true);
    expect(isSameSite("www.google.com", SITE)).toBe(false);
    expect(isSameSite("unifysocial.ca.evil.com", SITE)).toBe(false);
  });
});

test.describe("sanitizeProperties", () => {
  test("every URL-bearing property is scrubbed; a same-site referrer keeps attribution, an external one loses its query", () => {
    const out = sanitizeProperties(
      {
        $current_url: "https://unifysocial.ca/?email=alice%40example.test&utm_source=x&gclid=y#frag",
        $referrer: "https://www.google.com/search?q=alice%40example.test",
        $initial_referrer: "https://www.unifysocial.ca/blog?utm_source=news&email=a#x",
        $session_entry_url: "https://unifysocial.ca/?email=a&fbclid=f",
        $session_entry_referrer: "https://chatgpt.com/?q=private",
        $external_click_url: "https://play.google.com/store/apps/details?id=x&email=a",
        $pathname: "/",
        page: "/teer?email=a#x",
        target: "google_play",
        $referring_domain: "www.google.com",
        utm_source: "x",
      },
      SITE,
    );
    expect(out).toEqual({
      $current_url: "https://unifysocial.ca/?utm_source=x&gclid=y",
      $referrer: "https://www.google.com/search",
      $initial_referrer: "https://www.unifysocial.ca/blog?utm_source=news",
      $session_entry_url: "https://unifysocial.ca/?fbclid=f",
      $session_entry_referrer: "https://chatgpt.com/",
      $external_click_url: "https://play.google.com/store/apps/details",
      $pathname: "/",
      page: "/teer",
      target: "google_play",
      $referring_domain: "www.google.com",
      utm_source: "x",
    });
  });

  test("ph_keyword (a search referrer's q=) is removed", () => {
    expect(
      sanitizeProperties({ ph_keyword: "alice@example.test", $session_entry_ph_keyword: "alice", $search_engine: "google" }, SITE),
    ).toEqual({ $search_engine: "google" });
  });

  test("nested objects are scrubbed: posthog-js's stored { r, u } entry", () => {
    expect(
      sanitizeProperties(
        {
          $initial_person_info: {
            r: "https://www.google.com/search?q=alice",
            u: "https://unifysocial.ca/?email=alice&utm_source=x#f",
          },
        },
        SITE,
      ),
    ).toEqual({ $initial_person_info: { r: "https://www.google.com/search", u: "https://unifysocial.ca/?utm_source=x" } });
  });

  test("non-string values pass through", () => {
    const value = { n: 1, b: true, z: null, list: ["https://unifysocial.ca/?email=a", 2] };
    expect(sanitizeProperties(value, SITE)).toEqual({ n: 1, b: true, z: null, list: ["https://unifysocial.ca/", 2] });
  });
});

test.describe("sanitizeEvent", () => {
  test("scrubs properties, $set and $set_once and keeps the rest of the event", () => {
    const event = {
      uuid: "u1",
      event: "$pageview",
      properties: { $current_url: "https://unifysocial.ca/?email=a&utm_source=x" },
      $set: { $current_url: "https://unifysocial.ca/?email=a" },
      $set_once: {
        $initial_current_url: "https://unifysocial.ca/?email=a&gclid=g#f",
        $initial_referrer: "https://www.bing.com/search?q=a",
        $initial_pathname: "/",
      },
    };
    expect(sanitizeEvent(event, SITE)).toEqual({
      uuid: "u1",
      event: "$pageview",
      properties: { $current_url: "https://unifysocial.ca/?utm_source=x" },
      $set: { $current_url: "https://unifysocial.ca/" },
      $set_once: {
        $initial_current_url: "https://unifysocial.ca/?gclid=g",
        $initial_referrer: "https://www.bing.com/search",
        $initial_pathname: "/",
      },
    });
    // The input is not mutated.
    expect(event.properties.$current_url).toContain("email=a");
  });
});
