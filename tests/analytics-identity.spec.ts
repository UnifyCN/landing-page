import { expect, test } from "@playwright/test";
import { SHARED_IDENTITY_OPTIONS } from "../src/lib/analytics/identity";

test.describe("PostHog identity options", () => {
  test("share the .unifysocial.ca cookie with the web app and prefer it over localStorage", () => {
    expect(SHARED_IDENTITY_OPTIONS).toEqual({
      persistence: "localStorage+cookie",
      cross_subdomain_cookie: true,
      __preview_cookie_wins_on_conflict: true,
    });
  });
});
