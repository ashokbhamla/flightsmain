import React from 'react';
import { Metadata } from 'next';
import { Box } from '@mui/material';
import { Locale, localeFromParam } from '@/lib/i18n';
import { 
  getServerTranslation, 
  getServerHtmlTranslation, 
  getPageMetadata,
  preWarmTranslationCache 
} from '@/lib/translationOptimizer';
import { fetchAirlineContent, fetchAirlineData, fetchAirlineAirportContent, fetchAirlineAirportData } from '@/lib/api';
import { getAirlineCodeFromSlug } from '@/lib/utils';
import OptimizedAirlineRouteContent from '@/components/OptimizedAirlineRouteContent';
import SchemaOrg from '@/components/SchemaOrg';

// Pre-warm translation cache for better performance
preWarmTranslationCache('en');
preWarmTranslationCache('es');
preWarmTranslationCache('ru');
preWarmTranslationCache('fr');

interface OptimizedAirlineRoutePageProps {
  params: { locale: string; airline: string; route: string };
}

function parseFlightSlug(route: string): { departureIata: string; arrivalIata: string | null } {
  // Handle different route formats
  if (route.includes('-')) {
    const parts = route.split('-');
    if (parts.length === 2) {
      return { departureIata: parts[0].toUpperCase(), arrivalIata: parts[1].toUpperCase() };
    }
  }
  
  // Handle single airport codes
  if (route.length === 3) {
    return { departureIata: route.toUpperCase(), arrivalIata: null };
  }
  
  return { departureIata: 'DEL', arrivalIata: 'BOM' }; // fallback
}

export async function generateMetadata({ params }: OptimizedAirlineRoutePageProps): Promise<Metadata> {
  const locale = localeFromParam(params.locale);
  const { departureIata, arrivalIata } = parseFlightSlug(params.route);
  const airlineCode = getAirlineCodeFromSlug(params.airline);
  
  // Get airline name for dynamic metadata
  const airlineName = params.airline.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  const departureCity = departureIata;
  const arrivalCity = arrivalIata || '';
  
  // Generate optimized metadata with translations
  const metadata = getPageMetadata(locale, 'airlines', {
    airlineName,
    departureCity,
    arrivalCity
  });
  
  const title = arrivalIata ? 
    getServerTranslation(locale, 'flightPage.title')
      .replace('{airlineName}', airlineName)
      .replace('{departureCity}', departureCity)
      .replace('{arrivalCity}', arrivalCity) :
    `${airlineName} flights from ${departureCity}`;
    
  const description = arrivalIata ?
    getServerTranslation(locale, 'flightPage.description')
      .replace('{airlineName}', airlineName)
      .replace('{departureCity}', departureCity)
      .replace('{arrivalCity}', arrivalCity) :
    `Plan your journey from ${departureCity} with ${airlineName}'s latest deals, travel tips, and flight information.`;

  return {
    title,
    description,
    keywords: `${airlineName}, flights, ${departureCity}, ${arrivalCity || 'destinations'}, travel, booking`,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale === 'ru' ? 'ru_RU' : locale === 'fr' ? 'fr_FR' : locale === 'es' ? 'es_ES' : 'en_US',
    },
  };
}

export default async function OptimizedAirlineRoutePage({ params }: OptimizedAirlineRoutePageProps) {
  const locale = localeFromParam(params.locale);
  const { departureIata, arrivalIata } = parseFlightSlug(params.route);
  const airlineCode = getAirlineCodeFromSlug(params.airline);
  
  // Map locale to language ID for API calls
  const getLangId = (locale: string): 1 | 2 => {
    // Always use English from API since it's the only available language
    return 1;
  };

  // Fetch content and flight data with error handling
  let contentData = null;
  let flightData = null;
  
  try {
    if (arrivalIata) {
      // Route pair - use existing airline content/data functions
      [contentData, flightData] = await Promise.all([
        fetchAirlineContent(airlineCode, arrivalIata, departureIata, getLangId(locale), 1),
        fetchAirlineData(airlineCode, arrivalIata, departureIata, getLangId(locale), 1)
      ]);
    } else {
      // Single airport - use airport-specific functions
      [contentData, flightData] = await Promise.all([
        fetchAirlineAirportContent(airlineCode, departureIata, getLangId(locale), 1),
        fetchAirlineAirportData(airlineCode, departureIata, 1)
      ]);
    }
  } catch (error) {
    console.error('Error fetching airline data:', error);
  }

  // Helper function to extract city names from title
  const extractCitiesFromTitle = (title: string) => {
    const match = title.match(/flights from ([^to]+) to ([^@]+)/i);
    if (match) {
      return {
        departureCity: match[1].trim(),
        arrivalCity: match[2].trim()
      };
    }
    return null;
  };

  // Use city names from API data (content API first, then flight data, then fallback)
  let departureCity: string = departureIata;
  let arrivalCity: string = arrivalIata || '';
  
  if (contentData?.departure_city) {
    departureCity = contentData.departure_city;
    arrivalCity = contentData.arrival_city || '';
  } else if (flightData?.title) {
    const cities = extractCitiesFromTitle(flightData.title);
    if (cities) {
      departureCity = cities.departureCity;
      arrivalCity = cities.arrivalCity;
    }
  }
  
  // Fallback to IATA codes if no city names found
  if (!departureCity) {
    departureCity = departureIata;
  }
  if (!arrivalCity && arrivalIata) {
    arrivalCity = arrivalIata;
  }

  // Get airline name
  const airlineName = contentData?.airline_name || 
                     flightData?.airline_name || 
                     params.airline.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

  // Filter out duplicate content sections from API data
  const finalContentData = contentData ? {
    ...contentData,
    // Remove duplicate sections that cause content duplication
    hotels: null,
    airlines: null,
    best_time_visit: null,
    departure_terminal_paragraph: null,
    arrival_terminal_paragraph: null,
    terminal_contact_paragraph: null,
    faqs: null
  } : contentData;

  // Normalize flight data
  const normalizedFlights = flightData?.flights || [];
  
  // Generate JSON-LD structured data for SEO
  const generateStructuredData = () => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
    const currentUrl = `${baseUrl}/${locale}/airlines/${params.airline}/${params.route}`;
    
    const productData = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": arrivalIata ? 
        getServerTranslation(locale, 'flightPage.schemaProductName')
          .replace('{airlineName}', airlineName)
          .replace('{departureCity}', departureCity)
          .replace('{arrivalCity}', arrivalCity) :
        `${airlineName} flights from ${departureCity}`,
      "description": arrivalIata ?
        getServerTranslation(locale, 'flightPage.schemaProductDescription')
          .replace('{airlineName}', airlineName)
          .replace('{departureCity}', departureCity)
          .replace('{arrivalCity}', arrivalCity) :
        `Find ${airlineName} flights from ${departureCity}`,
      "url": currentUrl,
      "brand": {
        "@type": "Brand",
        "name": airlineName
      },
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "USD",
         "lowPrice": normalizedFlights.length > 0 ? Math.min(...normalizedFlights.map((f: any) => f.price || 0)) : 0,
         "highPrice": normalizedFlights.length > 0 ? Math.max(...normalizedFlights.map((f: any) => f.price || 0)) : 0,
        "offerCount": normalizedFlights.length
      }
    };

    const itemListData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": arrivalIata ?
        getServerTranslation(locale, 'flightPage.schemaItemListName')
          .replace('{airlineName}', airlineName)
          .replace('{departureCity}', departureCity)
          .replace('{arrivalCity}', arrivalCity) :
        `${airlineName} Flights from ${departureCity}`,
      "description": arrivalIata ?
        getServerTranslation(locale, 'flightPage.schemaItemListDescription')
          .replace('{airlineName}', airlineName)
          .replace('{departureCity}', departureCity)
          .replace('{arrivalCity}', arrivalCity) :
        `Available ${airlineName} flights from ${departureCity}`,
      "numberOfItems": normalizedFlights.length,
      "itemListElement": normalizedFlights.slice(0, 10).map((flight: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Flight",
          "name": getServerTranslation(locale, 'flightPage.schemaFlightDescription')
            .replace('{airlineName}', airlineName)
            .replace('{departureCity}', departureCity)
            .replace('{arrivalCity}', arrivalCity),
          "airline": {
            "@type": "Airline",
            "name": airlineName
          },
          "departureAirport": {
            "@type": "Airport",
            "name": getServerTranslation(locale, 'flightPage.schemaAirportName')
              .replace('{cityName}', departureCity),
            "iataCode": departureIata
          },
          ...(arrivalIata && {
            "arrivalAirport": {
              "@type": "Airport",
              "name": getServerTranslation(locale, 'flightPage.schemaAirportName')
                .replace('{cityName}', arrivalCity),
              "iataCode": arrivalIata
            }
          }),
          "offers": {
            "@type": "Offer",
            "price": flight.price || 0,
            "priceCurrency": "USD"
          }
        }
      }))
    };

    return [productData, itemListData];
  };

  return (
    <Box>
      <OptimizedAirlineRouteContent
        locale={locale}
        contentData={finalContentData}
        flightData={flightData}
        airlineName={airlineName}
        departureCity={departureCity}
        arrivalCity={arrivalCity}
        departureIata={departureIata}
         arrivalIata={arrivalIata || undefined}
        normalizedFlights={normalizedFlights}
      />
      
      <SchemaOrg data={generateStructuredData()} />
    </Box>
  );
}
