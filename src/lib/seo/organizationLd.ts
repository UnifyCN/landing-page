import { APP_STORE_URL, PLAY_STORE_URL } from '../app-links';

export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Unify Social',
    legalName: 'Unify Newcomer Support Society',
    alternateName: 'Unify',
    description:
      'Unify is a non-profit, all-in-one app and guide that helps newcomers settle in Canada, covering immigration, jobs, taxes, credential recognition, and community. Free on iPhone, Android, and in any web browser at app.unifysocial.ca. Built in Vancouver.',
    url: 'https://unifysocial.ca',
    logo: 'https://unifysocial.ca/assets/logo/new-unify-logo-256.png',
    sameAs: [
      'https://www.instagram.com/unifysocial.ca/',
      'https://www.facebook.com/p/Unify-Social-61570879043328/',
      'https://www.linkedin.com/company/unify-social/posts/?feedView=all',
      'https://x.com/unifysocialca',
      APP_STORE_URL,
      PLAY_STORE_URL,
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Vancouver',
      addressRegion: 'BC',
      addressCountry: 'CA',
    },
    areaServed: { '@type': 'Country', name: 'Canada' },
  };
}
