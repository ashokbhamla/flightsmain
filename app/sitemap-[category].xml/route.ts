import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const locale = searchParams.get('locale') || 'en';
  const category = params.category;

  try {
    // Fetch data from your API
    const data = await fetchSitemapData(category, page, locale);
    
    const sitemap = generateSitemapXML(data.urls, data.totalPages, page, category);
    
    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });
  } catch (error) {
    console.error(`Error generating sitemap for ${category}:`, error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}

async function fetchSitemapData(category: string, page: number, _locale: string) {
  const limit = 1000; // Smaller chunks for edge functions
  const offset = (page - 1) * limit;
  
  try {
    const response = await fetch(
      `https://api.triposia.com/real/urls?urls=${category}&limit=${limit}&offset=${offset}`,
      { 
        cache: 'no-store',
        headers: {
          'User-Agent': 'AirlinesMap-Sitemap/1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      urls: data.urls || [],
      totalPages: Math.ceil((data.total || data.urls?.length || 0) / limit)
    };
  } catch (error) {
    console.error(`Error fetching data for ${category}:`, error);
    // Return fallback data
    return {
      urls: [],
      totalPages: 1
    };
  }
}

function generateSitemapXML(urls: string[], totalPages: number, currentPage: number, category: string) {
  const baseUrl = 'https://airlinesmap.com';
  const locales = ['en', 'es', 'ru', 'fr'];
  
  const urlEntries = urls.flatMap(url => 
    locales.map(locale => `
  <url>
    <loc>${baseUrl}/${locale}${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${getChangeFrequency(category)}</changefreq>
    <priority>${getPriority(category, url)}</priority>
  </url>`)
  ).join('');

  // Add pagination if there are more pages
  const pagination = currentPage < totalPages ? `
  <url>
    <loc>${baseUrl}/sitemap-${category}.xml?page=${currentPage + 1}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.5</priority>
  </url>` : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
${pagination}
</urlset>`;
}

function getChangeFrequency(category: string): string {
  const frequencies: Record<string, string> = {
    'flightsone_pages': 'daily',
    'flightsround_pages': 'daily',
    'airlinesround_pages': 'daily',
    'airlinesone_pages': 'daily',
    'airport_pages': 'weekly',
    'airlines_pages': 'weekly',
    'airport_hotels': 'weekly'
  };
  return frequencies[category] || 'weekly';
}

function getPriority(category: string, url: string): number {
  // Higher priority for popular routes and major airports
  const isPopularRoute = url.includes('lax') || url.includes('jfk') || url.includes('lhr') || url.includes('cdg');
  const isMajorAirport = url.includes('lax') || url.includes('jfk') || url.includes('lhr') || url.includes('cdg') || url.includes('dxb');
  
  if (isPopularRoute) return 0.9;
  if (isMajorAirport) return 0.8;
  return 0.7;
}
