interface LocalBusinessArgs {
  name: string;
  url: string;
  city: string;
  canonicalUrl: string;
}

function parseAddress(city: string) {
  const parts = city.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return {
      '@type': 'PostalAddress',
      addressLocality: parts[0],
      addressRegion: parts[1],
      addressCountry: 'CA',
    };
  }
  return {
    '@type': 'PostalAddress',
    addressRegion: parts[0] ?? '',
    addressCountry: 'CA',
  };
}

export function localBusinessLd({ name, url, city, canonicalUrl }: LocalBusinessArgs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    url,
    address: parseAddress(city),
    sameAs: [url],
    mainEntityOfPage: canonicalUrl,
  };
}
