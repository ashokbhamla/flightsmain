import React from 'react';
import { Metadata } from 'next';
import { Box } from '@mui/material';
import { Locale, localeFromParam } from '@/lib/i18n';
import { getMasterPageMetadata } from '@/lib/masterTranslationSystem';
import UniversalMasterPage from '@/components/UniversalMasterPage';
import SchemaOrg from '@/components/SchemaOrg';

interface UniversalPageTemplateProps {
  params: { 
    locale: string; 
    pageType: string; 
    pageSlug: string; 
  };
}

/**
 * Universal Page Template
 * Works for ALL pages in the web app:
 * - Airlines: /airlines/[airline]/[route]
 * - Hotels: /hotels/[hotel]/[destination]
 * - Airports: /airports/[airport]
 * - Destinations: /destinations/[destination]
 * 
 * English is the MASTER - all changes in English automatically apply to all languages
 */

function parsePageSlug(pageType: string, pageSlug: string): {
  departureIata: string;
  arrivalIata?: string;
  entityName: string;
} {
  switch (pageType) {
    case 'airlines':
      // Handle airline routes like "6e-ixc" or "dl-jfk"
      if (pageSlug.includes('-')) {
        const parts = pageSlug.split('-');
        return {
          departureIata: parts[0].toUpperCase(),
          arrivalIata: parts[1].toUpperCase(),
          entityName: parts[0].toUpperCase()
        };
      }
      // Handle single airport codes
      return {
        departureIata: pageSlug.toUpperCase(),
        arrivalIata: undefined,
        entityName: pageSlug.toUpperCase()
      };
      
    case 'hotels':
      // Handle hotel destinations
      return {
        departureIata: pageSlug.toUpperCase(),
        arrivalIata: undefined,
        entityName: pageSlug.replace(/-/g, ' ').toUpperCase()
      };
      
    case 'airports':
      // Handle airport codes
      return {
        departureIata: pageSlug.toUpperCase(),
        arrivalIata: undefined,
        entityName: pageSlug.toUpperCase()
      };
      
    case 'destinations':
      // Handle destination names
      return {
        departureIata: pageSlug.toUpperCase(),
        arrivalIata: undefined,
        entityName: pageSlug.replace(/-/g, ' ').toUpperCase()
      };
      
    default:
      return {
        departureIata: 'DEL',
        arrivalIata: undefined,
        entityName: 'UNKNOWN'
      };
  }
}

function getEntityName(pageType: string, entityName: string): string {
  switch (pageType) {
    case 'airlines':
      // Convert airline codes to names
      const airlineNames: Record<string, string> = {
        '6E': 'IndiGo',
        'DL': 'Delta Air Lines',
        'AA': 'American Airlines',
        'UA': 'United Airlines',
        'LH': 'Lufthansa',
        'BA': 'British Airways',
        'AF': 'Air France',
        'EK': 'Emirates',
        'SQ': 'Singapore Airlines',
        'JL': 'Japan Airlines'
      };
      return airlineNames[entityName] || entityName;
      
    case 'hotels':
      return entityName.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
      
    case 'airports':
      // Convert airport codes to city names
      const airportNames: Record<string, string> = {
        'DEL': 'Delhi',
        'BOM': 'Mumbai',
        'JFK': 'New York',
        'LAX': 'Los Angeles',
        'LHR': 'London',
        'CDG': 'Paris',
        'NRT': 'Tokyo',
        'ICN': 'Seoul',
        'DXB': 'Dubai',
        'SIN': 'Singapore',
        'BKK': 'Bangkok',
        'HKG': 'Hong Kong',
        'IXC': 'Chandigarh'
      };
      return airportNames[entityName] || entityName;
      
    case 'destinations':
      return entityName.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
      
    default:
      return entityName;
  }
}

export async function generateMetadata({ params }: UniversalPageTemplateProps): Promise<Metadata> {
  const locale = localeFromParam(params.locale);
  const { departureIata, arrivalIata, entityName } = parsePageSlug(params.pageType, params.pageSlug);
  
  const airlineName = getEntityName(params.pageType, entityName);
  const departureCity = getEntityName('airports', departureIata);
  const arrivalCity = arrivalIata ? getEntityName('airports', arrivalIata) : undefined;
  
  // Get master page metadata (English is master)
  const metadata = getMasterPageMetadata({
    locale,
    airlineName,
    departureCity,
    arrivalCity,
    departureIata,
    arrivalIata
  });
  
  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    openGraph: {
      title: metadata.ogTitle,
      description: metadata.ogDescription,
      type: 'website',
      locale: locale === 'ru' ? 'ru_RU' : locale === 'fr' ? 'fr_FR' : locale === 'es' ? 'es_ES' : 'en_US',
    },
  };
}

export default async function UniversalPageTemplate({ params }: UniversalPageTemplateProps) {
  const locale = localeFromParam(params.locale);
  const { departureIata, arrivalIata, entityName } = parsePageSlug(params.pageType, params.pageSlug);
  
  const airlineName = getEntityName(params.pageType, entityName);
  const departureCity = getEntityName('airports', departureIata);
  const arrivalCity = arrivalIata ? getEntityName('airports', arrivalIata) : undefined;
  
  // Mock flight data for demonstration
  const mockFlightData = {
    flights: [
      { price: 299, airline: airlineName, departure: departureIata, arrival: arrivalIata || departureIata },
      { price: 399, airline: airlineName, departure: departureIata, arrival: arrivalIata || departureIata },
      { price: 199, airline: airlineName, departure: departureIata, arrival: arrivalIata || departureIata }
    ]
  };
  
  const normalizedFlights = mockFlightData.flights || [];
  
  // Generate JSON-LD structured data for SEO
  const generateStructuredData = () => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
    const currentUrl = `${baseUrl}/${locale}/${params.pageType}/${params.pageSlug}`;
    
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
        "lowPrice": normalizedFlights.length > 0 ? Math.min(...normalizedFlights.map(f => f.price || 0)) : 0,
        "highPrice": normalizedFlights.length > 0 ? Math.max(...normalizedFlights.map(f => f.price || 0)) : 0,
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
      <UniversalMasterPage
        locale={locale}
        airlineName={airlineName}
        departureCity={departureCity}
        arrivalCity={arrivalCity}
        departureIata={departureIata}
        arrivalIata={arrivalIata}
        flightData={mockFlightData}
        normalizedFlights={normalizedFlights}
        pageType={params.pageType as any}
      />
      
      <SchemaOrg data={generateStructuredData()} />
    </Box>
  );
}
