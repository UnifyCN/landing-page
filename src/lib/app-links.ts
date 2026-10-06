// The two ways into the product. The iPhone app is the only native app (there
// is no Google Play listing), so the web app is the route for desktop and
// Android visitors.
export const APP_STORE_URL = "https://apps.apple.com/ca/app/unify-newcomer-support/id6754875762";
export const WEB_APP_URL = "https://app.unifysocial.ca";

/**
 * Web app entry link with landing-page attribution, in the same UTM shape as
 * /canadian-resume (src/lib/canadian-resume.ts). `campaign` names the
 * placement, e.g. "navbar" or "cta-band".
 */
export function webAppUrl(campaign: string): string {
  return `${WEB_APP_URL}/?utm_source=unifysocial.ca&utm_medium=referral&utm_campaign=${campaign}`;
}
