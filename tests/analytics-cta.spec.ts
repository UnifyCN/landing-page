import { test, expect } from "@playwright/test";
import { ctaClickedProperties, playStoreUrl } from "../src/lib/analytics/cta";

// Pure parts of the landing page's PostHog CTA tracking (spec #314, ticket
// #320). No browser needed: these run in the Playwright worker.
const APP_STORE = "https://apps.apple.com/ca/app/unify-canada-newcomer-guide/id6754875762";
const PLAY = "https://play.google.com/store/apps/details?id=com.anonymous.unifyfrontend";

test.describe("cta_clicked properties", () => {
  test("an App Store link is target app_store", () => {
    expect(ctaClickedProperties(APP_STORE, "hero", "/")).toEqual({ target: "app_store", placement: "hero", page: "/" });
  });

  test("a Google Play link, with or without a referrer, is target google_play", () => {
    expect(ctaClickedProperties(PLAY, "cta_band", "/about")).toEqual({
      target: "google_play",
      placement: "cta_band",
      page: "/about",
    });
    expect(ctaClickedProperties(playStoreUrl("hero"), "hero", "/")?.target).toBe("google_play");
  });

  test("any app.unifysocial.ca link is target web_app", () => {
    expect(ctaClickedProperties("https://app.unifysocial.ca", "hero", "/")?.target).toBe("web_app");
    expect(
      ctaClickedProperties("https://app.unifysocial.ca/resume?utm_source=unifysocial.ca", "canadian_resume", "/canadian-resume")
        ?.target,
    ).toBe("web_app");
  });

  test("a link with no placement gets the stable placement inline", () => {
    expect(ctaClickedProperties("https://app.unifysocial.ca/home", undefined, "/blog/x")).toEqual({
      target: "web_app",
      placement: "inline",
      page: "/blog/x",
    });
  });

  test("other links are not CTAs", () => {
    for (const href of [
      "/download",
      "https://unifysocial.ca/about",
      "https://www.instagram.com/unifysocial.ca/",
      "https://apps.apple.com/ca/app/some-other-app/id123",
      "https://play.google.com/store/apps/details?id=com.other.app",
      "https://notapp.unifysocial.ca",
      "mailto:contact@unifysocial.ca",
      "not a url",
    ]) {
      expect(ctaClickedProperties(href, "hero", "/"), href).toBeNull();
    }
  });
});

test.describe("Google Play referrer", () => {
  test("carries the landing UTMs with the placement as utm_content", () => {
    const url = new URL(playStoreUrl("cta_band"));
    expect(url.origin + url.pathname).toBe("https://play.google.com/store/apps/details");
    expect(url.searchParams.get("id")).toBe("com.anonymous.unifyfrontend");
    expect(url.searchParams.get("referrer")).toBe(
      "utm_source=unifysocial.ca&utm_medium=website&utm_campaign=landing&utm_content=cta_band",
    );
    // The referrer is one encoded parameter, so its & do not split the store URL.
    expect(playStoreUrl("hero")).toBe(
      `${PLAY}&referrer=utm_source%3Dunifysocial.ca%26utm_medium%3Dwebsite%26utm_campaign%3Dlanding%26utm_content%3Dhero`,
    );
  });
});
