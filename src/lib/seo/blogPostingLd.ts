interface BlogPostingArgs {
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  updatedAt?: string;
  canonicalUrl: string;
}

export function blogPostingLd({
  title,
  description,
  thumbnailUrl,
  publishedAt,
  updatedAt,
  canonicalUrl,
}: BlogPostingArgs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image: [thumbnailUrl],
    datePublished: publishedAt,
    dateModified: updatedAt ?? publishedAt,
    author: {
      '@type': 'Organization',
      name: 'Unify Social',
      url: 'https://unifysocial.ca',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Unify Social',
      logo: {
        '@type': 'ImageObject',
        url: 'https://unifysocial.ca/assets/logo/new-unify-logo-256.png',
      },
    },
    mainEntityOfPage: canonicalUrl,
  };
}
