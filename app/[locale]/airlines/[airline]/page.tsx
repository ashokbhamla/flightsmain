import { Metadata } from 'next';
import { Box } from '@mui/material';
import { generateAirlineCanonicalUrl, generateAlternateUrls } from '@/lib/canonical';
import SchemaOrg from '@/components/SchemaOrg';
import { breadcrumbSchema } from '@/lib/schema';
import { fetchAirlineBySlug } from '@/lib/api';
import DynamicTemplateSelector from '@/app/[locale]/templates/DynamicTemplateSelector';
import { localeFromParam } from '@/lib/i18n';

// Helper function to get language ID for API calls
function getLangId(locale: string): 1 | 2 {
  switch (locale) {
    case 'es': return 2;
    case 'ru': return 1; // Fallback to English for Russian
    case 'fr': return 1; // Fallback to English for French
    default: return 1; // English
  }
}

// Function to fetch airline content from the new API endpoint
async function fetchAirlineContent(slug: string, langId: 1 | 2) {
  try {
    const response = await fetch(
      `http://34.173.111.243/content/airlines?slugs=${slug}&lang_id=${langId}&domain_id=1`,
      { 
        next: { revalidate: 300 },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching airline content:', error);
    return null;
  }
}

interface AirlinePageProps {
  params: {
    locale: string;
    airline: string;
  };
}

export async function generateMetadata({ params }: AirlinePageProps): Promise<Metadata> {
  const { locale, airline } = params;
  const validLocale = localeFromParam(locale);
  
  // Generate canonical URL and alternate URLs
  const canonicalUrl = generateAirlineCanonicalUrl(airline, undefined, validLocale);
  const alternateUrls = generateAlternateUrls(`/airlines/${airline}`);
  
  let airlineData = null;
  let contentData = null;
  
  try {
    [airlineData, contentData] = await Promise.all([
      fetchAirlineBySlug(airline, getLangId(locale)),
      fetchAirlineContent(airline, getLangId(locale))
    ]);
  } catch (error) {
    console.error('Error fetching airline data for metadata:', error);
  }

  if (!airlineData) {
    const airlineName = airline.replace(/-/g, ' ').toUpperCase();
    return {
      title: contentData?.title || `${airlineName} - Airline Information`,
      description: contentData?.description || `Information about ${airlineName} airline flights and services.`,
      alternates: {
        canonical: canonicalUrl,
        languages: alternateUrls,
      },
      openGraph: {
        title: contentData?.title || `${airlineName} - Airline Information`,
        description: contentData?.description || `Information about ${airlineName} airline flights and services.`,
        url: canonicalUrl,
        siteName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'flightsearchs',
        locale: locale === 'es' ? 'es_ES' : locale === 'ru' ? 'ru_RU' : locale === 'fr' ? 'fr_FR' : 'en_US',
      },
    };
  }

  return {
    title: contentData?.title || `${airlineData.airline_name} - Flight Information`,
    description: contentData?.description || airlineData.overview || `Information about ${airlineData.airline_name} flights and services.`,
    alternates: {
      canonical: canonicalUrl,
      languages: alternateUrls,
    },
    openGraph: {
      title: contentData?.title || `${airlineData.airline_name} - Flight Information`,
      description: contentData?.description || airlineData.overview || `Information about ${airlineData.airline_name} flights and services.`,
      url: canonicalUrl,
      siteName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'flightsearchs',
      locale: locale === 'es' ? 'es_ES' : locale === 'ru' ? 'ru_RU' : locale === 'fr' ? 'fr_FR' : 'en_US',
    },
  };
}

export default async function AirlinePage({ params }: AirlinePageProps) {
  const { locale, airline } = params;
  const validLocale = localeFromParam(locale);
  
  let airlineData = null;
  let contentData = null;
  
  try {
    [airlineData, contentData] = await Promise.all([
      fetchAirlineBySlug(airline, getLangId(locale)),
      fetchAirlineContent(airline, getLangId(locale))
    ]);
  } catch (error) {
    console.error('Error fetching airline data:', error);
  }

  if (!airlineData) {
    const airlineName = airline.replace(/-/g, ' ').toUpperCase();
    const airlineCode = airline.split('-')[0]?.toUpperCase() || 'N/A';

    const fallbackData = {
      airline_name: airlineName,
      iata_code: airlineCode,
      icao_code: 'N/A',
      country: 'Information not available',
      fleet_size: 'Information not available',
      destinations: 'Multiple destinations served',
      founded: 'Information not available',
      overview: `<p>Welcome to ${airlineName} airline. This airline serves passengers with various routes and services. Please note that detailed information may not be available due to API connectivity issues.</p>`,
      popular_routes: 'Route information will be available soon. Please check back for updates on popular destinations served by this airline.'
    };
    airlineData = fallbackData;
  }

  // Combine airline data with content data
  const combinedPageData = {
    ...airlineData,
    ...contentData
  };

  const breadcrumbData = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Airlines', url: '/airlines' },
    { name: airlineData.airline_name, url: `/airlines/${airline}` }
  ]);

  return (
    <Box>
      <DynamicTemplateSelector
        locale={validLocale}
        templateType="airline"
        pageData={combinedPageData}
        params={{ airline }}
        onAction={() => {}}
      />

      <SchemaOrg data={breadcrumbData} />
    </Box>
  );
}
