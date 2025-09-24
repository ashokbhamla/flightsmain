import React from 'react';
import { Metadata } from 'next';
import { Box } from '@mui/material';
import { localeFromParam } from '@/lib/i18n';
import { getCleanPageMetadata } from '@/lib/cleanContentSystem';
import { fetchAirlineContent, fetchAirlineData, fetchAirlineAirportContent, fetchAirlineAirportData } from '@/lib/api';
import { getAirlineCodeFromSlug } from '@/lib/utils';
import CleanPageComponent from '@/components/CleanPageComponent';
import SchemaOrg from '@/components/SchemaOrg';

interface CleanAirlineRoutePageProps {
  params: { locale: string; airline: string; route: string };
}

/**
 * Clean Airline Route Page
 * NO DUPLICATES - completely clean content
 * Single source of truth for all content
 */

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

export async function generateMetadata({ params }: CleanAirlineRoutePageProps): Promise<Metadata> {
  const locale = localeFromParam(params.locale);
  const { departureIata, arrivalIata } = parseFlightSlug(params.route);
  const airlineCode = getAirlineCodeFromSlug(params.airline);
  
  // Get airline name for dynamic metadata
  const airlineName = params.airline.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  const departureCity = departureIata;
  const arrivalCity = arrivalIata || '';
  
  // Generate clean metadata (NO DUPLICATES)
  const metadata = getCleanPageMetadata({
    locale,
    airlineName,
    departureCity,
    arrivalCity,
    departureIata,
    arrivalIata: arrivalIata || undefined
  });
  
  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: 'website',
      locale: locale === 'ru' ? 'ru_RU' : locale === 'fr' ? 'fr_FR' : locale === 'es' ? 'es_ES' : 'en_US',
    },
  };
}

export default async function CleanAirlineRoutePage({ params }: CleanAirlineRoutePageProps) {
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
  let departureCity: string = departureIata; // Initialize with fallback
  let arrivalCity: string = arrivalIata || ''; // Initialize with fallback
  
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

  // Get airline name
  const airlineName = contentData?.airline_name || 
                     flightData?.airline_name || 
                     params.airline.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

  // FILTER OUT ALL DUPLICATE CONTENT
  // This ensures NO duplicates are passed to the component
  const cleanContentData = contentData ? {
    ...contentData,
    // Remove ALL duplicate sections that cause content duplication
    hotels: null,
    airlines: null,
    best_time_visit: null,
    departure_terminal_paragraph: null,
    arrival_terminal_paragraph: null,
    terminal_contact_paragraph: null,
    faqs: null,
    // Remove any other potential duplicate fields
    popular_destinations: null,
    places_to_visit: null,
    city_info: null,
    booking_steps: null,
    cancellation: null,
    classes: null,
    destinations_overview: null
  } : null;

  // Normalize flight data
  const normalizedFlights = flightData?.flights || [];
  
  // Generate JSON-LD structured data for SEO (NO DUPLICATES)
  const generateStructuredData = () => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
    const currentUrl = `${baseUrl}/${locale}/airlines/${params.airline}/${params.route}`;
    
    const productData = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": arrivalIata ? 
        `${airlineName} flights from ${departureCity} to ${arrivalCity}` :
        `${airlineName} flights from ${departureCity}`,
      "description": arrivalIata ?
        `Plan your journey from ${departureCity} to ${arrivalCity} with ${airlineName}'s latest deals, travel tips, and flight information.` :
        `Plan your journey from ${departureCity} with ${airlineName}'s latest deals, travel tips, and flight information.`,
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
        `${airlineName} Flights from ${departureCity} to ${arrivalCity}` :
        `${airlineName} Flights from ${departureCity}`,
      "description": arrivalIata ?
        `Available ${airlineName} flights from ${departureCity} to ${arrivalCity}` :
        `Available ${airlineName} flights from ${departureCity}`,
      "numberOfItems": normalizedFlights.length,
      "itemListElement": normalizedFlights.slice(0, 10).map((flight: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Flight",
          "name": `${airlineName} flight from ${departureCity} to ${arrivalCity || departureCity}`,
          "airline": {
            "@type": "Airline",
            "name": airlineName
          },
          "departureAirport": {
            "@type": "Airport",
            "name": `${departureCity} Airport`,
            "iataCode": departureIata
          },
          ...(arrivalIata && {
            "arrivalAirport": {
              "@type": "Airport",
              "name": `${arrivalCity} Airport`,
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
      <CleanPageComponent
        locale={locale}
        airlineName={airlineName}
        departureCity={departureCity}
        arrivalCity={arrivalCity}
        departureIata={departureIata}
         arrivalIata={arrivalIata || undefined}
        flightData={flightData}
        normalizedFlights={normalizedFlights}
        pageType="airline"
      />
      
      <SchemaOrg data={generateStructuredData()} />
    </Box>
  );
}
