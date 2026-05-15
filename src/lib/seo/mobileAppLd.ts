const APP_STORE_URL =
  'https://apps.apple.com/ca/app/unify-canada-newcomer-guide/id6754875762';

const SITE = 'https://unifysocial.ca';

export function mobileAppLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: 'Unify - Canada Newcomer Guide',
    applicationCategory: 'EducationApplication',
    operatingSystem: 'iOS',
    url: SITE,
    installUrl: APP_STORE_URL,
    downloadUrl: APP_STORE_URL,
    screenshot: [
      `${SITE}/assets/screenshots/checklist.png`,
      `${SITE}/assets/screenshots/community.png`,
      `${SITE}/assets/screenshots/companion.png`,
      `${SITE}/assets/screenshots/home-feed.png`,
      `${SITE}/assets/screenshots/learn.png`,
    ],
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CAD' },
  };
}
