import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Chip, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, FormGroup, Paper, Collapse } from '@mui/material';
import { localeFromParam } from '@/lib/i18n';
import { generateFlightCanonicalUrl, generateAlternateUrls } from '@/lib/canonical';
import SchemaOrg from '@/components/SchemaOrg';
import { breadcrumbSchema } from '@/lib/schema';
import { fetchFlightContent, fetchFlightData, fetchDestinationFlightContent, fetchDestinationFlightData } from '@/lib/api';
import { getCachedFlightContent, getCachedFlightData } from '@/lib/cached-api';
import { normalizeFlights } from '@/lib/flightUtils';
import DynamicTemplateSelector from '@/app/[locale]/templates/DynamicTemplateSelector';
import FlightTemplate from '@/app/[locale]/templates/FlightTemplate';
import { getLanguageId, getTranslations } from '@/lib/translations';
import FlightSearchBox from '@/components/FlightSearchBox';
// import FlightListWithFilters from '@/components/FlightListWithFilters';

// Helper function to get domain ID based on current domain
function getDomainId(): 1 | 2 {
  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'airlinesmap.com';
  // domain_id mapping:
  // 1 = airlinesmap.com
  // 2 = other domain (if you have multiple domains)
  return domain.includes('airlinesmap.com') ? 1 : 2;
}

// Helper function to check if slug is a valid airport code
// Single codes (like aad, hyd) are airport codes, route pairs (like jfk-agp) are not
function isAirportCode(slug: string): boolean {
  // If slug contains a hyphen, it's a route pair (like jfk-agp), not a single airport
  return !slug.includes('-');
}

// Helper function to parse slug and extract IATA codes
function parseFlightSlug(slug: string): { departureIata: string; arrivalIata: string } {
  const parts = slug.split('-');
  if (parts.length >= 2) {
    return {
      departureIata: parts[0].toUpperCase(),
      arrivalIata: parts[1].toUpperCase()
    };
  }
  
  // For single codes, treat them as airport codes (like aad, hyd, etc.)
  // These are dynamic route pages that can serve multiple airports
  return { departureIata: slug.toUpperCase(), arrivalIata: '' };
}

// Helper function to generate canonical URL for flights from airport
function generateFlightsFromCanonicalUrl(airportCode: string, locale: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com';
  const localePath = locale === 'en' ? '' : `/${locale}`;
  return `${baseUrl}${localePath}/flights/from/${airportCode}`;
}

// Helper function to truncate description to 158 characters
function truncateDescription(description: string, maxLength: number = 158): string {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength - 4) + '...';
}

// Helper function to get city name from IATA code
function getCityName(iataCode: string): string {
  const cityMap: { [key: string]: string } = {
    'LAX': 'Los Angeles',
    'WAS': 'Washington, D.C.',
    'BWI': 'Baltimore',
    'IAD': 'Washington Dulles',
    'DCA': 'Washington Reagan',
    'JFK': 'New York',
    'ORD': 'Chicago',
    'DFW': 'Dallas',
    'ATL': 'Atlanta',
    'BOS': 'Boston',
    'MIA': 'Miami',
    'SFO': 'San Francisco',
    'SEA': 'Seattle',
    'DEN': 'Denver',
    'LAS': 'Las Vegas',
    'PHX': 'Phoenix',
    'MCO': 'Orlando',
    'CLT': 'Charlotte',
    'IAH': 'Houston',
    'DTW': 'Detroit',
    'DEL': 'Delhi',
    'BOM': 'Mumbai',
    'HYD': 'Hyderabad',
    'BLR': 'Bangalore',
    'CCU': 'Kolkata',
    'MAA': 'Chennai',
    'AMD': 'Ahmedabad',
    'PNQ': 'Pune',
    'COK': 'Kochi',
    'GOI': 'Goa',
    'IXZ': 'Port Blair',
    'AAN': 'Al Ain',
    'IAG': 'Niagara Falls',
    'SFB': 'Orlando Sanford'
  };
  return cityMap[iataCode] || iataCode;
}

// Helper function to get random destination
function getRandomDestination(): string {
  const destinations = [
    'New York JFK', 'London LHR', 'Dubai DXB', 'Singapore SIN', 'Tokyo NRT',
    'Paris CDG', 'Frankfurt FRA', 'Amsterdam AMS', 'Bangkok BKK', 'Sydney SYD',
    'Toronto YYZ', 'Vancouver YVR', 'Zurich ZUR', 'Rome FCO', 'Barcelona BCN',
    'Istanbul IST', 'Doha DOH', 'Abu Dhabi AUH', 'Kuala Lumpur KUL', 'Seoul ICN'
  ];
  return destinations[Math.floor(Math.random() * destinations.length)];
}

// Helper function to enhance flight data with stops and direct flight info
function enhanceFlightData(flights: any[]): any[] {
  return flights.map(flight => {
    // Mock data for stops - in real implementation, this would come from API
    const stopsOptions = [0, 0, 0, 1, 1, 2]; // More direct flights than connecting
    const randomStops = stopsOptions[Math.floor(Math.random() * stopsOptions.length)];
    
    return {
      ...flight,
      isDirect: randomStops === 0,
      stops: randomStops
    };
  });
}


export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const locale = localeFromParam(params.locale);
  const t = getTranslations(locale);
  
  // Check if slug is a single airport code and handle metadata differently
  if (isAirportCode(params.slug)) {
    const airportCode = params.slug.toUpperCase();
    const cityName = getCityName(airportCode);
    
    // Generate canonical URL and alternate URLs for single airport
    const canonicalUrl = generateFlightsFromCanonicalUrl(params.slug, locale);
    const alternateUrls = generateAlternateUrls(`/flights/${params.slug}`);
    
    let contentData: any = null;
    
    try {
      contentData = await fetchDestinationFlightContent(airportCode, getLanguageId(locale));
    } catch (error) {
      console.error('Error fetching metadata for airport page:', error);
    }

    const title = contentData?.title || `${t?.flightPage?.flights || 'Flights'} ${t?.flightPage?.from || 'from'} ${cityName} (${airportCode})`;
    const fullDescription = contentData?.description || `${t?.flightPage?.findBest || 'Find the best'} ${t?.flightPage?.flightDeals || 'flight deals'} ${t?.flightPage?.from || 'from'} ${cityName} ${t?.flightPage?.to || 'to'} ${t?.flightPage?.destinationsWorldwide || 'destinations worldwide'}.`;
    const metaDescription = truncateDescription(fullDescription, 158);

    return {
      title: title,
      description: metaDescription,
      keywords: contentData?.meta_keywords?.join(', ') || `flights from ${airportCode}, ${cityName} flights`,
      alternates: {
        canonical: canonicalUrl,
        languages: alternateUrls,
      },
      openGraph: {
        title: title,
        description: metaDescription,
        url: canonicalUrl,
        siteName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'flightsearchs',
        locale: locale === 'es' ? 'es_ES' : locale === 'ru' ? 'ru_RU' : locale === 'fr' ? 'fr_FR' : 'en_US',
      },
      twitter: {
        card: 'summary',
        title: title,
        description: metaDescription,
      },
    };
  }
  
  const { departureIata, arrivalIata } = parseFlightSlug(params.slug);
  
  // Generate canonical URL and alternate URLs
  const canonicalUrl = generateFlightCanonicalUrl(params.slug, locale);
  const alternateUrls = generateAlternateUrls(`/flights/${params.slug}`);
  
  try {
    const contentData = await getCachedFlightContent(arrivalIata, departureIata, getLanguageId(locale), getDomainId());
    
    return {
      title: contentData?.title || `${t?.flightPage?.flights || 'Flights'} ${t?.flightPage?.from || 'from'} ${getCityName(departureIata)} (${departureIata}) ${t?.flightPage?.to || 'to'} ${getCityName(arrivalIata)} (${arrivalIata})`,
      description: contentData?.description || `${t?.flightPage?.findBest || 'Find the best'} ${t?.flightPage?.flightDeals || 'flight deals'} ${t?.flightPage?.from || 'from'} ${getCityName(departureIata)} ${t?.flightPage?.to || 'to'} ${getCityName(arrivalIata)}. ${t?.flightPage?.comparePricesBookTrip || 'Compare prices, book your next trip'}.`,
      keywords: contentData?.meta?.keywords?.join(', ') || `flights ${departureIata} ${arrivalIata}, ${getCityName(departureIata)} to ${getCityName(arrivalIata)} flights`,
      alternates: {
        canonical: canonicalUrl,
        languages: alternateUrls,
      },
      openGraph: {
        title: contentData?.title || `${t?.flightPage?.flights || 'Flights'} ${t?.flightPage?.from || 'from'} ${getCityName(departureIata)} ${t?.flightPage?.to || 'to'} ${getCityName(arrivalIata)}`,
        description: contentData?.description || `${t?.flightPage?.findBest || 'Find the best'} ${t?.flightPage?.flightDeals || 'flight deals'} ${t?.flightPage?.from || 'from'} ${getCityName(departureIata)} ${t?.flightPage?.to || 'to'} ${getCityName(arrivalIata)}.`,
        type: 'website',
        url: canonicalUrl,
        siteName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'flightsearchs',
        locale: locale === 'es' ? 'es_ES' : locale === 'ru' ? 'ru_RU' : locale === 'fr' ? 'fr_FR' : 'en_US',
      },
      twitter: {
        card: 'summary',
        title: contentData?.title || `${t?.flightPage?.flights || 'Flights'} ${t?.flightPage?.from || 'from'} ${getCityName(departureIata)} ${t?.flightPage?.to || 'to'} ${getCityName(arrivalIata)}`,
        description: contentData?.description || `${t?.flightPage?.findBest || 'Find the best'} ${t?.flightPage?.flightDeals || 'flight deals'} ${t?.flightPage?.from || 'from'} ${getCityName(departureIata)} ${t?.flightPage?.to || 'to'} ${getCityName(arrivalIata)}.`,
      },
    };
  } catch (error) {
    console.error('Error fetching metadata for flight page:', error);
    return {
      title: `${t?.flightPage?.flights || 'Flights'} ${t?.flightPage?.from || 'from'} ${getCityName(departureIata)} (${departureIata}) ${t?.flightPage?.to || 'to'} ${getCityName(arrivalIata)} (${arrivalIata})`,
      description: `${t?.flightPage?.findBest || 'Find the best'} ${t?.flightPage?.flightDeals || 'flight deals'} ${t?.flightPage?.from || 'from'} ${getCityName(departureIata)} ${t?.flightPage?.to || 'to'} ${getCityName(arrivalIata)}.`,
      alternates: {
        canonical: canonicalUrl,
        languages: alternateUrls,
      },
    };
  }
}

export default async function FlightBySlug({ params }: { params: { locale: string; slug: string } }) {
  const locale = localeFromParam(params.locale);
  const t = getTranslations(locale);
  
  // Parse slug to get departure and arrival info early
  const { departureIata, arrivalIata } = parseFlightSlug(params.slug);
  const departureCity = getCityName(departureIata);
  const arrivalCity = getCityName(arrivalIata);
  
  // Declare variables for flight data
  let actualFlightData = null;
  
  // Check if slug is a single airport code and handle it directly
  if (isAirportCode(params.slug)) {
    // Handle single airport code directly instead of redirecting
    const airportCode = params.slug.toUpperCase();
    const cityName = getCityName(airportCode);
    
    // Fetch content for single airport
  let contentData = null;
  let flightData = null;
    let normalizedFlights: any[] = [];
  
  try {
    console.log('Fetching data for airport:', airportCode.toLowerCase(), 'locale:', locale);
    
    [contentData, flightData] = await Promise.all([
        fetchDestinationFlightContent(airportCode.toLowerCase(), getLanguageId(locale) as 1 | 2 | 3 | 4),
        fetchDestinationFlightData(airportCode.toLowerCase())
    ]);
    
    console.log('AAQ API Data:', { 
      contentData, 
      flightData, 
      airportCode, 
      locale,
      hasContentData: !!contentData,
      hasFlightData: !!flightData,
      contentDataKeys: contentData ? Object.keys(contentData) : 'null',
      flightDataKeys: flightData ? Object.keys(flightData) : 'null'
    });
    
    // Set actualFlightData for single airport - pass the full array for transformation
    actualFlightData = flightData;
      
      // Normalize the flight data for display
      if (flightData && Array.isArray(flightData)) {
        normalizedFlights = enhanceFlightData(normalizeFlights(flightData));
      }
  } catch (error: any) {
      console.error('Error fetching airport data:', error);
      console.error('Error details:', error.message, error.stack);
    }

    // Use FlightTemplate for single airport pages
    return (
      <FlightTemplate 
        locale={locale}
        pageData={contentData}
        params={{ slug: airportCode }}
        flightData={actualFlightData}
        departureCityName={cityName}
        arrivalCityName={cityName}
        departureIata={airportCode}
        arrivalIata={airportCode}
      />
    );
  }
  
  // departureIata, arrivalIata, departureCity, arrivalCity already declared above
  
  // Fetch content and flight data
  let contentData = null;
  let flightData = null;
  
  console.log('Route page API calls:', { departureIata, arrivalIata, locale });
  
  try {
    [contentData, flightData] = await Promise.all([
      getCachedFlightContent(arrivalIata, departureIata, getLanguageId(locale), getDomainId()),
      getCachedFlightData(arrivalIata, departureIata, getLanguageId(locale), getDomainId())
    ]);
    // Pass the full flight data array for route pair pages
    actualFlightData = flightData;
    
    console.log('Route page API results:', { 
      hasContentData: !!contentData, 
      hasFlightData: !!flightData,
      flightDataKeys: flightData ? Object.keys(flightData) : 'null',
      onewayFlights: flightData?.oneway_flights?.length || 0
    });
  } catch (error: any) {
    console.error('Error fetching flight data:', error);
  }

  // Normalize flight data for consistent display
  let normalizedFlights: any[] = [];
  if (actualFlightData && actualFlightData.oneway_flights && Array.isArray(actualFlightData.oneway_flights)) {
    normalizedFlights = enhanceFlightData(actualFlightData.oneway_flights.map((flight: any) => ({
      from: flight.iata_from || departureIata,
      to: flight.iata_to || arrivalIata,
      city: arrivalCity,
      duration: flight.duration || `${Math.floor(Math.random() * 3) + 1}h ${Math.floor(Math.random() * 60)}m`,
      price: `$${flight.price || Math.floor(Math.random() * 500) + 100}`,
      airline: flight.airline || 'Airline',
      stops: flight.stops || 0,
      departureTime: flight.departure_time || '6:00 AM',
      arrivalTime: flight.arrival_time || '8:00 AM'
    })));
  }

  // Use FlightTemplate for route pair pages
  return (
    <FlightTemplate 
        locale={locale}
      pageData={contentData}
      params={params}
      flightData={actualFlightData}
      departureCityName={departureCity}
      arrivalCityName={arrivalCity}
      departureIata={departureIata}
      arrivalIata={arrivalIata}
    />
  );
}