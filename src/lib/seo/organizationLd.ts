export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Unify Social',
    alternateName: 'Unify',
    description:
      'Unify is an all-in-one mobile app and guide that helps newcomers settle in Canada, covering immigration, jobs, taxes, credential recognition, and community. Built in Vancouver.',
    url: 'https://unifysocial.ca',
    logo: 'https://unifysocial.ca/assets/logo/new-unify-logo-256.png',
    sameAs: [
      'https://www.instagram.com/unifysocial.ca/',
      'https://www.facebook.com/p/Unify-Social-61570879043328/',
      'https://www.linkedin.com/company/unify-social/posts/?feedView=all',
      'https://x.com/unifysocialca',
      'https://apps.apple.com/ca/app/unify-canada-newcomer-guide/id6754875762',
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
