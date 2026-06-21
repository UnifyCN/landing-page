const WEB_APP_URL = 'https://app.unifysocial.ca';

export function webAppLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Unify - Canada Newcomer Guide',
    applicationCategory: 'EducationApplication',
    operatingSystem: 'Web',
    browserRequirements: 'Requires JavaScript. Requires a modern web browser.',
    url: WEB_APP_URL,
    installUrl: WEB_APP_URL,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CAD' },
  };
}
