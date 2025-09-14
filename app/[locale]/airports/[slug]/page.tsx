import { Metadata } from 'next';
import { fetchAirportBySlug } from '@/lib/api';
import { localeFromParam } from '@/lib/i18n';
import { generateAirportCanonicalUrl, generateAlternateUrls } from '@/lib/canonical';
import { Box } from '@mui/material';
import SchemaOrg from '@/components/SchemaOrg';
import { breadcrumbSchema } from '@/lib/schema';
import DynamicTemplateSelector from '@/app/[locale]/templates/DynamicTemplateSelector';
import { getLanguageId } from '@/lib/translations';

// Function to fetch airport content from the new API endpoint
async function fetchAirportContent(slug: string, langId: 1 | 2) {
  try {
    const response = await fetch(
      `http://34.173.111.243/content/airports?slugs=${slug}&lang_id=${langId}&domain_id=1`,
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
    console.error('Error fetching airport content:', error);
    return null;
  }
}

interface AirportPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: AirportPageProps): Promise<Metadata> {
  const locale = localeFromParam(params.locale);
  const slug = params.slug;
  
  // Generate canonical URL and alternate URLs
  const canonicalUrl = generateAirportCanonicalUrl(slug, locale);
  const alternateUrls = generateAlternateUrls(`/airports/${slug}`);
  
  let airportData = null;
  let contentData = null;
  
  try {
    [airportData, contentData] = await Promise.all([
      fetchAirportBySlug(slug, getLanguageId(locale) as 1 | 2),
      fetchAirportContent(slug, getLanguageId(locale) as 1 | 2)
    ]);
  } catch (error) {
    console.error('Error fetching airport data for metadata:', error);
  }

  if (!airportData) {
    const airportName = slug.replace(/-/g, ' ').toUpperCase();
    const airportCode = slug.split('-')[0]?.toUpperCase() || 'N/A';
    
    return {
      title: `${airportName} Airport (${airportCode}) - Airport Information`,
      description: `Complete guide to ${airportName} Airport (${airportCode}). Find terminal information, facilities, airlines, and travel tips.`,
      alternates: {
        canonical: canonicalUrl,
        languages: alternateUrls,
      },
      openGraph: {
        title: `${airportName} Airport (${airportCode}) - Airport Information`,
        description: `Complete guide to ${airportName} Airport (${airportCode}). Find terminal information, facilities, airlines, and travel tips.`,
        url: canonicalUrl,
        siteName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'flightsearchs',
        locale: locale === 'es' ? 'es_ES' : locale === 'ru' ? 'ru_RU' : locale === 'fr' ? 'fr_FR' : 'en_US',
      },
    };
  }

  const airportName = airportData.airport_name || slug.replace(/-/g, ' ').toUpperCase();
  const airportCode = airportData.airport_code || airportData.contact_info?.iata || slug.split('-')[0]?.toUpperCase() || 'N/A';
  const description = contentData?.description || airportData.overview 
    ? (contentData?.description || airportData.overview).replace(/<[^>]*>/g, '').substring(0, 160) + '...'
    : `Complete guide to ${airportName} Airport (${airportCode}). Find terminal information, facilities, airlines, and travel tips.`;

  return {
    title: contentData?.title || `${airportName} Airport (${airportCode}) - Airport Information`,
    description: description,
    alternates: {
      canonical: canonicalUrl,
      languages: alternateUrls,
    },
    openGraph: {
      title: contentData?.title || `${airportName} Airport (${airportCode}) - Airport Information`,
      description: description,
      url: canonicalUrl,
      siteName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'flightsearchs',
      locale: locale === 'es' ? 'es_ES' : locale === 'ru' ? 'ru_RU' : locale === 'fr' ? 'fr_FR' : 'en_US',
    },
  };
}

export default async function AirportPage({ params }: AirportPageProps) {
  const locale = localeFromParam(params.locale);
  const slug = params.slug;
  
  // Fetch airport data from API with error handling
  let airportData = null;
  try {
    airportData = await fetchAirportBySlug(slug, locale === 'es' ? 2 : 1);
  } catch (error) {
    console.error('Error fetching airport data:', error);
    // Continue with fallback data instead of throwing
  }
  
  // Fallback data when API is not available
  if (!airportData) {
    const airportName = slug.replace(/-/g, ' ').toUpperCase();
    const airportCode = slug.split('-')[0]?.toUpperCase() || 'N/A';
    
    const fallbackData = {
      title: `Airport Information - ${airportName}`,
      airport_name: airportName,
      airport_code: airportCode,
      overview: `<p>Welcome to ${airportName} Airport. This airport serves passengers with various facilities and services. Please note that detailed information may not be available due to API connectivity issues.</p>`,
      contact_info: {
        iata: airportCode,
        icao: 'N/A',
        phone: 'Contact airport directly for information'
      },
      airlines_serving: 'Multiple airlines serve this airport',
      terminals: 'Terminal information available at the airport',
      lounges_facilities: 'Various facilities and lounges available',
      faqs: [
        {
          question: 'What facilities are available at this airport?',
          answer: 'The airport offers various facilities including restaurants, shops, lounges, and other passenger services.'
        },
        {
          question: 'How early should I arrive for my flight?',
          answer: 'We recommend arriving at least 2 hours before domestic flights and 3 hours before international flights.'
        },
        {
          question: 'Why is some information not available?',
          answer: 'Some airport data may not be available due to API connectivity issues. Please contact the airport directly for the most current information.'
        }
      ]
    };
    airportData = fallbackData;
  }

  return (
    <Box>
      <DynamicTemplateSelector
        locale={locale}
        templateType="airport"
        pageData={airportData}
        params={{ slug }}
        onAction={() => {}}
      />

      <SchemaOrg data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Airports', url: '/airports' },
        { name: airportData.airport_name || 'Airport', url: `/airports/${slug}` },
      ])} />
    </Box>
  );
}
