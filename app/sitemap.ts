import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://airlinesmap.com';
  const categories = [
    'flightsone_pages',
    'flightsround_pages',
    'airlinesround_pages',
    'airlinesone_pages',
    'airport_pages',
    'airlines_pages',
    'airport_hotels'
  ];

  const sitemaps = categories.map(category => ({
    url: `${baseUrl}/sitemap-${category}.xml`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8
  }));

  return sitemaps;
}
