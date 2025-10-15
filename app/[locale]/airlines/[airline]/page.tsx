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

// Function to fetch airline content from the correct API endpoint
async function fetchAirlineContent(slug: string, langId: 1 | 2) {
  try {
    // Extract airline code from slug (e.g., "indigo" -> "6e")
    const airlineCode = getAirlineCodeFromSlug(slug);
    
    const response = await fetch(
      `https://api.triposia.com/content/airlines?airline_code=${airlineCode}&departure_iata=&lang=${langId}`,
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

// Helper function to get airline code from slug
function getAirlineCodeFromSlug(slug: string): string {
  // Comprehensive airline code mapping
  const airlineCodeMap: { [key: string]: string } = {
    // Indian Airlines
    'indigo': '6e',
    'air-india': 'ai',
    'spicejet': 'sg',
    'go-air': 'g8',
    'vistara': 'uk',
    'air-asia': 'i5',
    'jet-airways': '9w',
    'kingfisher': 'it',
    'trujet': '2t',
    'alliance-air': '9i',
    
    // US Airlines
    'united': 'ua',
    'united-airlines': 'ua',
    'american': 'aa',
    'american-airlines': 'aa',
    'delta': 'dl',
    'delta-airlines': 'dl',
    'southwest': 'wn',
    'southwest-airlines': 'wn',
    'alaska': 'as',
    'alaska-airlines': 'as',
    'jetblue': 'b6',
    'spirit': 'nk',
    'frontier': 'f9',
    
    // European Airlines
    'lufthansa': 'lh',
    'british-airways': 'ba',
    'air-france': 'af',
    'klm': 'kl',
    'ryanair': 'fr',
    'easyjet': 'u2',
    'iberia': 'ib',
    'alitalia': 'az',
    'swiss': 'lx',
    'turkish-airlines': 'tk',
    
    // Middle East Airlines
    'emirates': 'ek',
    'qatar': 'qr',
    'qatar-airways': 'qr',
    'etihad': 'ey',
    'etihad-airways': 'ey',
    'saudi': 'sv',
    
    // Asian Airlines
    'singapore': 'sq',
    'singapore-airlines': 'sq',
    'cathay': 'cx',
    'cathay-pacific': 'cx',
    'japan-airlines': 'jl',
    'ana': 'nh',
    'korean-air': 'ke',
    'thai': 'tg',
    'thai-airways': 'tg',
    'malaysia': 'mh',
    'china-eastern': 'mu',
    'china-southern': 'cz',
    
    // Other Airlines
    'qantas': 'qf',
    'air-canada': 'ac',
    'aeromexico': 'am',
    'latam': 'la',
    'copa': 'cm'
  };
  
  const lowerSlug = slug.toLowerCase();
  
  // Check direct mapping first
  if (airlineCodeMap[lowerSlug]) {
    return airlineCodeMap[lowerSlug];
  }
  
  // Try to extract IATA code from complex slugs like "united-ua-ual-us"
  // Pattern: airline-name-XX-XXX-XX where XX is likely the IATA code (2 letters)
  const parts = slug.split('-');
  
  // Look for a 2-letter part (IATA code)
  for (const part of parts) {
    if (part.length === 2 && /^[a-zA-Z]{2}$/.test(part)) {
      return part.toLowerCase();
    }
  }
  
  // Look for a 3-letter part (ICAO code) if no IATA found
  for (const part of parts) {
    if (part.length === 3 && /^[a-zA-Z]{3}$/.test(part)) {
      return part.toLowerCase();
    }
  }
  
  // Try to match the first part of the slug with airline names
  const firstPart = parts[0];
  if (airlineCodeMap[firstPart]) {
    return airlineCodeMap[firstPart];
  }
  
  // Last resort: if slug is already 2-3 letters, use it as-is
  if (slug.length === 2 || slug.length === 3) {
    return slug.toLowerCase();
  }
  
  // Ultimate fallback: use first part or entire slug
  return (firstPart || slug).toLowerCase();
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
    // Extract proper airline code and name from slug
    const extractedCode = getAirlineCodeFromSlug(airline);
    const airlineCode = extractedCode.toUpperCase();
    
    // Try to get a nice airline name
    const parts = airline.split('-');
    let airlineName = '';
    
    // If we found a 2-letter code in the slug, use parts before it as the name
    const twoLetterIndex = parts.findIndex(p => p.length === 2 && /^[a-zA-Z]{2}$/.test(p));
    if (twoLetterIndex > 0) {
      airlineName = parts.slice(0, twoLetterIndex).map(p => 
        p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()
      ).join(' ');
    } else {
      // Otherwise use the first part capitalized
      airlineName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
    }
    
    // Add "Airlines" if not already present
    if (!airlineName.toLowerCase().includes('airline')) {
      airlineName += ' Airlines';
    }

    const fallbackData = {
      airline_name: airlineName,
      iata_code: airlineCode,
      icao_code: 'N/A',
      country: 'Information not available',
      fleet_size: 'Information not available',
      destinations: 'Multiple destinations served',
      founded: 'Information not available',
      overview: `<p>Welcome to ${airlineName} (${airlineCode}). This airline serves passengers with various routes and services. Please note that detailed information may not be available due to API connectivity issues.</p>`,
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
