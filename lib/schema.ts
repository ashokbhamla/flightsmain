type Json = Record<string, any>;

export function orgSchema(header: any): Json | null {
  const org = header?.organizationDetails;
  if (!org) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    url: org.url,
    email: org.contactEmail,
    telephone: org.phone,
    address: org.address,
    logo: header?.logo?.src,
    sameAs: Object.values(header?.socialMediaLinks ?? {}),
  };
}

export function websiteSchema(header: any): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: header?.title ?? 'Travel Portal',
    url: header?.organizationDetails?.url ?? 'https://example.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${header?.organizationDetails?.url ?? 'https://example.com'}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
