// The ways into the product: the iPhone app, the Android app, and the web app.
// Store links route by device (see BaseLayout's platform script): iPhone goes to
// the App Store, Android to Google Play, and everything else to /download,
// which shows both stores and a QR code.
export const APP_STORE_URL = "https://apps.apple.com/ca/app/unify-newcomer-support/id6754875762";
export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.anonymous.unifyfrontend";
export const WEB_APP_URL = "https://app.unifysocial.ca";
export const DOWNLOAD_PATH = "/download";

/**
 * Web app entry link with landing-page attribution, in the same UTM shape as
 * /canadian-resume (src/lib/canadian-resume.ts). `campaign` names the
 * placement, e.g. "navbar" or "cta-band".
 */
export function webAppUrl(campaign: string): string {
  return `${WEB_APP_URL}/?utm_source=unifysocial.ca&utm_medium=referral&utm_campaign=${campaign}`;
}
