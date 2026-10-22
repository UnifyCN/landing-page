// The PostHog identity options shared with app.unifysocial.ca (Unify-Web-App
// lib/posthog.ts sets the same three). The identity cookie lives on
// .unifysocial.ca, so a landing visitor who opens the web app stays the same
// PostHog person. localStorage is per-origin: by default an older id stored
// there beats the shared cookie and splits the person in two, so the cookie
// wins on conflict.
export const SHARED_IDENTITY_OPTIONS = {
  persistence: "localStorage+cookie",
  cross_subdomain_cookie: true,
  __preview_cookie_wins_on_conflict: true,
} as const;
