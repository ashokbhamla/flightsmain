type Json = Record<string, any>;

export function orgSchema(header: any): Json | null {
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'airlinesmap.com';
  const companyUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com';
  const companyEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'support@airlinesmap.com';
  const companyPhone = process.env.NEXT_PUBLIC_COMPANY_PHONE || '+1-800-FLIGHTS';
  const companyAddress = process.env.NEXT_PUBLIC_COMPANY_ADDRESS || '8th the green suite b, Dover, DE 19901, US';
  const companyLogo = process.env.NEXT_PUBLIC_COMPANY_LOGO || `${companyUrl}/logo.png`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: companyName,
    url: companyUrl,
    email: companyEmail,
    telephone: companyPhone,
    address: {
      '@type': 'PostalAddress',
      'streetAddress': '8th the green suite b',
      'addressLocality': 'Dover',
      'addressRegion': 'DE',
      'postalCode': '19901',
      'addressCountry': 'US'
    },
    logo: companyLogo,
    sameAs: [
      process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com/airlinesmap',
      process.env.NEXT_PUBLIC_TWITTER_URL || 'https://twitter.com/airlinesmap',
      process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/airlinesmap'
    ],
  };
}

export function websiteSchema(header: any): Json {
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'airlinesmap.com';
  const companyUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: companyName,
    url: companyUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${companyUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function localBusinessSchema(): Json {
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'airlinesmap.com';
  const companyUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com';
  const companyEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'support@airlinesmap.com';
  const companyPhone = process.env.NEXT_PUBLIC_COMPANY_PHONE || '+1-800-FLIGHTS';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: companyName,
    url: companyUrl,
    email: companyEmail,
    telephone: companyPhone,
    address: {
      '@type': 'PostalAddress',
      'streetAddress': '8th the green suite b',
      'addressLocality': 'Dover',
      'addressRegion': 'DE',
      'postalCode': '19901',
      'addressCountry': 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      'latitude': '39.1582',
      'longitude': '-75.5244'
    },
    openingHours: 'Mo-Su 00:00-23:59',
    priceRange: '$$',
    aggregateRating: {
      '@type': 'AggregateRating',
      'ratingValue': '4.5',
      'reviewCount': '150'
    }
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
