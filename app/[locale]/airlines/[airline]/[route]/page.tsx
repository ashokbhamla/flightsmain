import { Metadata } from 'next';
import { Typography, Box, Container, Grid, Card, CardContent, Button, Tabs, Tab, Chip } from '@mui/material';
import { localeFromParam } from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';
import { generateAirlineCanonicalUrl, generateAlternateUrls } from '@/lib/canonical';
import SchemaOrg from '@/components/SchemaOrg';
import { breadcrumbSchema } from '@/lib/schema';
import { fetchAirlineContent, fetchAirlineData, fetchAirlineAirportContent, fetchAirlineAirportData, fetchAirlineContactInfo } from '@/lib/api';
import dynamic from 'next/dynamic';
import { toUSD } from '@/utils/currency';
import { normalizeFlights, NormalizedFlight } from '@/lib/flightNormalizer';
import { getAirlineLogoUrl } from '@/lib/cdn';

// Dynamic imports for client components with SSR enabled for SEO
const FlightSearchBox = dynamic(() => import('@/components/FlightSearchBox'), { 
  ssr: true,
  loading: () => <div>Loading search...</div>
});
const FlightCard = dynamic(() => import('@/components/FlightCard'), { 
  ssr: true,
  loading: () => <div>Loading flight card...</div>
});
const ClientPriceGraph = dynamic(() => import('@/components/ClientPriceGraph'), { 
  ssr: true,
  loading: () => <div>Loading graph...</div>
});
const FlightTabs = dynamic(() => import('@/components/FlightTabs'), { 
  ssr: true,
  loading: () => <div>Loading tabs...</div>
});
const FlightCards = dynamic(() => import('@/components/FlightCards'), { 
  ssr: true,
  loading: () => <div>Loading flight cards...</div>
});

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
    'CAN': 'Guangzhou',
    'BKK': 'Bangkok',
    'PVG': 'Shanghai',
    'NRT': 'Tokyo',
    'ICN': 'Seoul',
    'SIN': 'Singapore',
    'HKG': 'Hong Kong',
    'KUL': 'Kuala Lumpur',
    'DMK': 'Bangkok',
    'CNX': 'Chiang Mai',
    'HKT': 'Phuket'
  };
  return cityMap[iataCode] || iataCode;
}


// Helper function to get airline name from code
function getAirlineName(airlineCode: string, contentData?: any, airlineContactInfo?: any): string {
  // Use airline name from contact info API first (most reliable)
  if (airlineContactInfo?.name) {
    return airlineContactInfo.name;
  }
  
  // Use airline name from content API if available
  if (contentData?.airline_name) {
    return contentData.airline_name;
  }
  
  const airlineMap: { [key: string]: string } = {
    'ai': 'Air India',
    '6e': 'IndiGo',
    'uk': 'Vistara',
    'sg': 'SpiceJet',
    'g8': 'GoAir',
    'ix': 'Air India Express',
    'i5': 'AirAsia India',
    '9w': 'Jet Airways',
    's2': 'JetLite',
    'aq': '9Air'
  };
  return airlineMap[airlineCode.toLowerCase()] || airlineCode.toUpperCase();
}

// Helper function to get airport coordinates
function getAirportCoordinates(airportCode: string, flightData: any): { lat: number; lng: number } {
  // Try to get coordinates from flight data
  if (flightData?.airports) {
    const airport = flightData.airports.find((a: any) => a.iata === airportCode);
    if (airport?.latitude && airport?.longitude) {
      return { lat: parseFloat(airport.latitude), lng: parseFloat(airport.longitude) };
    }
  }
  
  // Try to get coordinates from content data
  if (flightData?.contentData?.airports) {
    const airport = flightData.contentData.airports.find((a: any) => a.iata === airportCode);
    if (airport?.latitude && airport?.longitude) {
      return { lat: parseFloat(airport.latitude), lng: parseFloat(airport.longitude) };
    }
  }
  
  // Fallback coordinates for major airports
  const fallbackCoords: { [key: string]: { lat: number; lng: number } } = {
    'DEL': { lat: 28.5562, lng: 77.1000 },
    'BOM': { lat: 19.0896, lng: 72.8656 },
    'HYD': { lat: 17.2403, lng: 78.4294 },
    'BLR': { lat: 13.1979, lng: 77.7063 },
    'MAA': { lat: 12.9941, lng: 80.1709 },
    'CCU': { lat: 22.6546, lng: 88.4467 },
    'AMD': { lat: 23.0772, lng: 72.6347 },
    'PNQ': { lat: 18.5821, lng: 73.9197 },
    'COK': { lat: 9.9312, lng: 76.2673 },
    'GOI': { lat: 15.3808, lng: 73.8314 },
    'JFK': { lat: 40.6413, lng: -73.7781 },
    'LAX': { lat: 33.9416, lng: -118.4085 },
    'LHR': { lat: 51.4700, lng: -0.4543 },
    'DXB': { lat: 25.2532, lng: 55.3657 },
    'SIN': { lat: 1.3644, lng: 103.9915 },
    'BKK': { lat: 13.6900, lng: 100.7501 },
    'HKG': { lat: 22.3080, lng: 113.9185 },
    'NRT': { lat: 35.7720, lng: 139.7003 },
    'ICN': { lat: 37.4602, lng: 126.4407 },
    'FRA': { lat: 50.0379, lng: 8.5622 },
    'CDG': { lat: 49.0097, lng: 2.5479 },
    'AMS': { lat: 52.3105, lng: 4.7683 },
    'MAD': { lat: 40.4983, lng: -3.5676 },
    'FCO': { lat: 41.8003, lng: 12.2389 },
    'ZUR': { lat: 47.4647, lng: 8.5492 },
    'VIE': { lat: 48.1103, lng: 16.5697 },
    'CPH': { lat: 55.6179, lng: 12.6561 },
    'ARN': { lat: 59.6519, lng: 17.9186 },
    'OSL': { lat: 60.1939, lng: 11.1004 },
    'HEL': { lat: 60.3172, lng: 24.9633 },
    'WAW': { lat: 52.1657, lng: 20.9671 },
    'PRG': { lat: 50.1008, lng: 14.2638 },
    'BUD': { lat: 47.4394, lng: 19.2618 },
    'IST': { lat: 41.2753, lng: 28.7519 },
    'ATH': { lat: 37.9364, lng: 23.9445 },
    'LIS': { lat: 38.7742, lng: -9.1342 },
    'BCN': { lat: 41.2974, lng: 2.0833 },
    'MXP': { lat: 45.6306, lng: 8.7281 },
    'LIN': { lat: 45.4452, lng: 9.2767 },
    'VCE': { lat: 45.5053, lng: 12.3519 },
    'FLR': { lat: 43.8100, lng: 11.2051 },
    'NAP': { lat: 40.8860, lng: 14.2908 },
    'BRI': { lat: 41.1386, lng: 16.7606 },
    'CTA': { lat: 37.4668, lng: 15.0664 },
    'PMO': { lat: 38.1759, lng: 13.0910 },
    'CAG': { lat: 39.2515, lng: 9.0543 },
    'OLB': { lat: 40.8986, lng: 9.5176 },
    'AHO': { lat: 40.6321, lng: 8.2908 },
    'BGY': { lat: 45.6736, lng: 9.7042 },
    'VRN': { lat: 45.3957, lng: 10.8885 },
    'TRN': { lat: 45.2008, lng: 7.6496 },
    'GOA': { lat: 44.4133, lng: 8.8375 },
    'PSA': { lat: 43.6839, lng: 10.3927 },
    'BLQ': { lat: 44.5354, lng: 11.2887 },
    'TSF': { lat: 45.6503, lng: 12.1944 },
    'VBS': { lat: 45.4289, lng: 10.3306 },
    'BZO': { lat: 46.4602, lng: 11.3264 },
    'BDS': { lat: 40.5176, lng: 17.4032 },
    'FOG': { lat: 41.4329, lng: 15.5350 },
    'PSR': { lat: 42.4317, lng: 14.1811 },
    'SUF': { lat: 38.9058, lng: 16.2423 },
    'LCC': { lat: 40.2392, lng: 18.1333 }
  };
  
  return fallbackCoords[airportCode] || { lat: 28.5562, lng: 77.1000 }; // Default to Delhi
}

// Helper function to decode HTML entities
function decodeHtmlEntities(html: string): string {
  return html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&amp;/g, '&');
}

// Helper function to generate weather description based on temperature data
function generateWeatherDescription(weatherData: any[], cityName: string): string {
  if (!weatherData || weatherData.length === 0) {
    return `Plan your visit to ${cityName} with current temperature data. ${cityName} experiences varied weather throughout the year, with temperatures ranging from mild to warm depending on the season.`;
  }

  const temperatures = weatherData.map(item => item.value);
  const maxTemp = Math.max(...temperatures);
  const minTemp = Math.min(...temperatures);
  const avgTemp = temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;
  
  // Find the warmest and coolest months
  const warmestMonth = weatherData.find(item => item.value === maxTemp)?.name || 'summer';
  const coolestMonth = weatherData.find(item => item.value === minTemp)?.name || 'winter';
  
  // Determine best time to visit (mild temperatures)
  const mildTemps = weatherData.filter(item => item.value >= 65 && item.value <= 80);
  const bestMonths = mildTemps.map(item => item.name).join(', ');
  
  return `Plan your visit to ${cityName} with detailed temperature insights. ${cityName} experiences temperatures ranging from ${minTemp}°F in ${coolestMonth} to ${maxTemp}°F in ${warmestMonth}, with an average of ${Math.round(avgTemp)}°F. The best time to visit is during ${bestMonths || 'spring and fall'} when temperatures are most comfortable for sightseeing and outdoor activities.`;
}

// Helper function to generate rainfall description based on rainfall data
function generateRainfallDescription(rainfallData: any[], cityName: string): string {
  if (!rainfallData || rainfallData.length === 0) {
    return `Stay prepared for your trip to ${cityName} with rainfall information. Understanding precipitation patterns helps you pack appropriately and plan outdoor activities during your visit.`;
  }

  const rainfalls = rainfallData.map(item => item.value);
  const maxRainfall = Math.max(...rainfalls);
  const minRainfall = Math.min(...rainfalls);
  const avgRainfall = rainfalls.reduce((sum, rain) => sum + rain, 0) / rainfalls.length;
  
  // Find the wettest and driest months
  const wettestMonth = rainfallData.find(item => item.value === maxRainfall)?.name || 'summer';
  const driestMonth = rainfallData.find(item => item.value === minRainfall)?.name || 'winter';
  
  // Determine best time to visit (low rainfall)
  const dryMonths = rainfallData.filter(item => item.value <= avgRainfall * 0.7);
  const bestMonths = dryMonths.map(item => item.name).join(', ');
  
  return `Stay prepared for your trip to ${cityName} with detailed rainfall insights. ${cityName} receives rainfall ranging from ${minRainfall} inches in ${driestMonth} to ${maxRainfall} inches in ${wettestMonth}, with an average of ${avgRainfall.toFixed(1)} inches annually. The best time to visit is during ${bestMonths || 'winter and spring'} when rainfall is minimal, ensuring clear skies for outdoor exploration and sightseeing.`;
}

export async function generateMetadata({ params }: { params: { locale: string; airline: string; route: string } }): Promise<Metadata> {
  const locale = localeFromParam(params.locale);
  const t = getTranslations(locale);
  const { departureIata, arrivalIata } = parseFlightSlug(params.route);
  const airlineCode = params.airline;
  
  // Generate canonical URL and alternate URLs
  const canonicalUrl = generateAirlineCanonicalUrl(airlineCode, params.route, locale);
  const alternateUrls = generateAlternateUrls(`/airlines/${airlineCode}/${params.route}`);
  
  // Map locale to language ID for API calls
  const getLangId = (locale: string): 1 | 2 => {
    switch (locale) {
      case 'es': return 2;
      case 'ru': return 1; // Fallback to English for Russian
      case 'fr': return 1; // Fallback to English for French
      default: return 1; // English
    }
  };

  try {
    // Fetch airline contact info for metadata
    const airlineContactInfo = await fetchAirlineContactInfo(airlineCode);
    let contentData = null;
    
    if (arrivalIata) {
      // Route pair - use airline content function
      contentData = await fetchAirlineContent(airlineCode, arrivalIata, departureIata, getLangId(locale));
    } else {
      // Single airport - use airline airport content function
      contentData = await fetchAirlineAirportContent(airlineCode, departureIata, getLangId(locale));
    }
    
    // Helper function to strip HTML tags and truncate to 158 characters
    const stripHtml = (html: string) => {
      const cleanText = html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').replace(/\s+/g, ' ').trim();
      return cleanText.length > 158 ? cleanText.substring(0, 155) + '...' : cleanText;
    };
    
    // Use fallback translations when API content is not translated or is in English
    const title = (contentData?.title && locale === 'en') ? 
      stripHtml(contentData.title) : 
      (arrivalIata ? 
        `${getAirlineName(airlineCode, contentData, airlineContactInfo)} flights ${getCityName(departureIata)} to ${getCityName(arrivalIata)}` :
        `${getAirlineName(airlineCode, contentData, airlineContactInfo)} flights from ${getCityName(departureIata)}`
      );

    // Use fallback translations when API content is not translated or is in English
    const description = (contentData?.meta_description && locale === 'en') ? 
      stripHtml(contentData.meta_description) : 
      ((contentData?.description && locale === 'en') ? 
        stripHtml(contentData.description) : 
        (arrivalIata ?
          `Find ${getAirlineName(airlineCode, contentData, airlineContactInfo)} flights from ${getCityName(departureIata)} to ${getCityName(arrivalIata)}. Compare prices and book your trip.` :
          `Find ${getAirlineName(airlineCode, contentData, airlineContactInfo)} flights from ${getCityName(departureIata)}. Compare prices and book your trip.`
        )
      );
    
    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
        languages: alternateUrls,
      },
      keywords: contentData?.meta?.keywords?.join(', ') || (arrivalIata ?
        `${getAirlineName(airlineCode, contentData, airlineContactInfo)} flights ${departureIata} ${arrivalIata}, ${getCityName(departureIata)} to ${getCityName(arrivalIata)} ${getAirlineName(airlineCode, contentData, airlineContactInfo)}` :
        `${getAirlineName(airlineCode, contentData, airlineContactInfo)} flights ${departureIata}, ${getCityName(departureIata)} ${getAirlineName(airlineCode, contentData, airlineContactInfo)}`
      ),
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        type: 'website',
        locale: locale === 'es' ? 'es_ES' : locale === 'ru' ? 'ru_RU' : locale === 'fr' ? 'fr_FR' : 'en_US',
        siteName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'AirlinesMap',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    };
  } catch (error) {
    console.error('Error fetching metadata for airline page:', error);
    // Fetch airline contact info for fallback
    const airlineContactInfo = await fetchAirlineContactInfo(airlineCode);
    const fallbackAirlineName = getAirlineName(airlineCode, null, airlineContactInfo);
    
    const title = arrivalIata ? 
      `${fallbackAirlineName} ${t.flightPage.flights} ${t.flightPage.from} ${getCityName(departureIata)} ${t.flightPage.to} ${getCityName(arrivalIata)}` :
      `${fallbackAirlineName} ${t.flightPage.flights} ${t.flightPage.from} ${getCityName(departureIata)}`;
    
    const description = arrivalIata ?
      `${t.flightPage.findBest} ${fallbackAirlineName} ${t.flightPage.flightDeals} ${t.flightPage.from} ${getCityName(departureIata)} ${t.flightPage.to} ${getCityName(arrivalIata)}.` :
      `${t.flightPage.findBest} ${fallbackAirlineName} ${t.flightPage.flightDeals} ${t.flightPage.from} ${getCityName(departureIata)}.`;
    
    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
        languages: alternateUrls,
      },
    };
  }
}

// Helper function to parse route and extract IATA codes
function parseFlightSlug(route: string): { departureIata: string; arrivalIata: string | null } {
  const parts = route.split('-');
  if (parts.length >= 2) {
    // Route pair like "bkk-can"
    return {
      departureIata: parts[0].toUpperCase(),
      arrivalIata: parts[1].toUpperCase()
    };
  } else if (parts.length === 1) {
    // Single airport like "ixz"
    return {
      departureIata: parts[0].toUpperCase(),
      arrivalIata: null
    };
  }
  return { departureIata: 'DEL', arrivalIata: 'BOM' }; // fallback
}

export default async function AirlineRoutePage({ params }: { params: { locale: string; airline: string; route: string } }) {
  const locale = localeFromParam(params.locale);
  const { departureIata, arrivalIata } = parseFlightSlug(params.route);
  const airlineCode = params.airline;
  
  // Fetch content and flight data based on route type
  let contentData = null;
  let flightData = null;
  
  // Map locale to language ID for API calls
  const getLangId = (locale: string): 1 | 2 => {
    switch (locale) {
      case 'es': return 2;
      case 'ru': return 1; // Fallback to English for Russian
      case 'fr': return 1; // Fallback to English for French
      default: return 1; // English
    }
  };

  try {
    if (arrivalIata) {
      // Route pair - use existing airline content/data functions
      [contentData, flightData] = await Promise.all([
        fetchAirlineContent(airlineCode, arrivalIata, departureIata, getLangId(locale)),
        fetchAirlineData(airlineCode, arrivalIata, departureIata)
      ]);
    } else {
      // Single airport - use airport-specific functions
      [contentData, flightData] = await Promise.all([
        fetchAirlineAirportContent(airlineCode, departureIata, getLangId(locale)),
        fetchAirlineAirportData(airlineCode, departureIata)
      ]);
    }
  } catch (error) {
    console.error('Error fetching airline data:', error);
  }

  // Use city names from content API if available, otherwise fallback to hardcoded mapping
  const departureCity = contentData?.departure_city ? 
    `${contentData.departure_city} (${departureIata})` : 
    getCityName(departureIata);
  const arrivalCity = arrivalIata ? 
    (contentData?.arrival_city ? 
      `${contentData.arrival_city} (${arrivalIata})` : 
      getCityName(arrivalIata)
    ) : 
    'Various Destinations';
  // Fetch airline contact information from the dedicated API
  const airlineContactInfo = await fetchAirlineContactInfo(airlineCode);
  
  const airlineName = getAirlineName(airlineCode, contentData, airlineContactInfo);
  
  // Extract airline details from flight data as fallback
  let airlineDetails = flightData?.[0]?.airlineroutes?.[0]?.airline || null;
  
  // Use contact info from dedicated API if available
  if (airlineContactInfo) {
    airlineDetails = {
      ...airlineDetails,
      phone: airlineContactInfo.phone || airlineDetails?.phone || '+1-800-223-7776',
      url: airlineContactInfo.website || airlineDetails?.url || `https://www.${airlineCode.toLowerCase()}.com`,
      address: airlineContactInfo.address || airlineDetails?.address || '',
      city: airlineContactInfo.city || airlineDetails?.city || '',
      state: airlineContactInfo.state || airlineDetails?.state || '',
      zipcode: airlineContactInfo.zipcode || airlineDetails?.zipcode || '',
      country: airlineContactInfo.country || airlineDetails?.country || 'India',
      location: airlineContactInfo.city && airlineContactInfo.state ? 
        `${airlineContactInfo.city}, ${airlineContactInfo.state}` : 
        airlineDetails?.location || 'India'
    };
  }

  // Helper function to strip HTML tags
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').replace(/\s+/g, ' ').trim();
  };

  // Normalize flight data for display
  let normalizedFlights: NormalizedFlight[] = [];
  
  if (flightData && Array.isArray(flightData)) {
    // Direct array from API (like the one you provided)
    normalizedFlights = normalizeFlights(flightData);
  } else if (flightData && flightData.flights && Array.isArray(flightData.flights)) {
    // Handle case where flightData has flights array
    normalizedFlights = normalizeFlights(flightData.flights);
  } else if (flightData && flightData.oneway_flights && Array.isArray(flightData.oneway_flights)) {
    // Handle case where flightData has a different structure
    normalizedFlights = normalizeFlights(flightData.oneway_flights);
  } else if (flightData && flightData.data && Array.isArray(flightData.data)) {
    // Handle case where data is nested under 'data' property
    normalizedFlights = normalizeFlights(flightData.data);
  }

  // Generate flight deals from API data
  const sampleFlightDeals = [
  {
    id: 1,
      type: 'round-trip',
      price: contentData?.avragefares ? `$${contentData.avragefares}` : (flightData?.round_trip_start ? `$${flightData.round_trip_start}` : '$189'),
      description: contentData?.cheap_flights ? stripHtml(contentData.cheap_flights) : `Round-trip ${airlineName} flights from ${departureCity} to ${arrivalCity}`,
      buttonText: 'Search Deals',
      buttonColor: '#10b981'
  },
  {
    id: 2,
      type: 'one-way',
      price: flightData?.oneway_trip_start ? `$${flightData.oneway_trip_start}` : '$122',
      description: contentData?.direct_flights ? stripHtml(contentData.direct_flights) : `One-way ${airlineName} flight from ${departureCity} to ${arrivalCity}`,
      buttonText: 'Search Deals',
      buttonColor: '#1e3a8a'
  },
  {
    id: 3,
      type: 'popular',
      month: contentData?.cheapest_month || flightData?.popular_month || 'April',
      description: `Cheapest month is ${contentData?.cheapest_month || flightData?.popular_month || 'April'} from ${departureCity}. Maximum price drop flights to ${departureCity} in month of ${contentData?.cheapest_month || flightData?.popular_month || 'April'}.`,
      buttonText: 'View Popular',
      buttonColor: '#ff6b35'
  },
  {
    id: 4,
      type: 'cheapest',
      month: contentData?.cheapest_day || flightData?.cheapest_day || 'Monday',
      description: `Cheapest week day is ${contentData?.cheapest_day || flightData?.cheapest_day || 'Monday'} from ${departureCity}. Maximum price drop flights to ${departureCity} on ${contentData?.cheapest_day || flightData?.cheapest_day || 'Monday'}.`,
      buttonText: 'Find Deals',
      buttonColor: '#10b981'
    }
  ];

  // Use actual API data for charts
  // Weekly data from Real API
  const weeklyPriceData = flightData?.weeks?.map((week: any) => ({
    name: week.name.split(' ')[0], // Extract day name (Mon, Tue, etc.)
    value: week.value
  })) || [
    { name: 'Mon', value: 12 },
    { name: 'Tue', value: 10 },
    { name: 'Wed', value: 12 },
    { name: 'Thu', value: 7 },
    { name: 'Fri', value: 10 },
    { name: 'Sat', value: 9 },
    { name: 'Sun', value: 8 }
  ];

  // Monthly data from Real API
  const monthlyPriceData = flightData?.months?.map((month: any) => ({
    name: month.name.split(' ')[0], // Extract month name (Jan, Feb, etc.)
    value: month.price
  })) || [
    { name: 'Jan', value: 150 },
    { name: 'Feb', value: 140 },
    { name: 'Mar', value: 160 },
    { name: 'Apr', value: 170 },
    { name: 'May', value: 165 },
    { name: 'Jun', value: 180 },
    { name: 'Jul', value: 190 },
    { name: 'Aug', value: 185 },
    { name: 'Sep', value: 175 },
    { name: 'Oct', value: 160 },
    { name: 'Nov', value: 155 },
    { name: 'Dec', value: 170 }
  ];

  const weatherData = flightData?.temperature?.map((temp: any) => ({
    name: temp.name.split(' ')[0], // Extract month name
    value: Math.round(temp.value) // Convert to integer
  })) || [
    { name: 'Jan', value: 57 },
    { name: 'Feb', value: 59 },
    { name: 'Mar', value: 64 },
    { name: 'Apr', value: 72 },
    { name: 'May', value: 79 },
    { name: 'Jun', value: 81 },
    { name: 'Jul', value: 82 },
    { name: 'Aug', value: 82 },
    { name: 'Sep', value: 81 },
    { name: 'Oct', value: 75 },
    { name: 'Nov', value: 68 },
    { name: 'Dec', value: 59 }
  ];

  const rainfallData = flightData?.rainfall?.map((rain: any) => ({
    name: rain.name.split(' ')[0], // Extract month name
    value: Math.round(rain.value * 10) / 10 // Round to 1 decimal
  })) || [
    { name: 'Jan', value: 1.6 },
    { name: 'Feb', value: 2.4 },
    { name: 'Mar', value: 3.5 },
    { name: 'Apr', value: 6.7 },
    { name: 'May', value: 10.2 },
    { name: 'Jun', value: 10.2 },
    { name: 'Jul', value: 9.4 },
    { name: 'Aug', value: 9.1 },
    { name: 'Sep', value: 5.9 },
    { name: 'Oct', value: 2.4 },
    { name: 'Nov', value: 1.6 },
    { name: 'Dec', value: 1.2 }
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      <Container 
        sx={{ 
          py: { xs: 3, sm: 4, md: 6 },
          px: { xs: 2, sm: 4, md: 6 },
          width: '100%',
          maxWidth: '100%'
        }}
      >
        {/* Main Title */}
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            fontWeight: 700,
            textAlign: 'left',
            mb: 2,
            color: '#1a1a1a'
          }}
        >
          {contentData?.title || (arrivalIata ? 
            `${airlineName} flights from ${departureCity} to ${arrivalCity}` :
            normalizedFlights.length > 0 ? 
              `${airlineName} flights from ${departureCity} to ${normalizedFlights.slice(0, 3).map(f => f.city).join(', ')}${normalizedFlights.length > 3 ? ` and ${normalizedFlights.length - 3} more destinations` : ''}` :
              `${airlineName} flights from ${departureCity}`
          )}
        </Typography>

        {/* Subtitle */}
        <Typography 
          variant="h6" 
          sx={{ 
            fontSize: '1.1rem',
            color: '#666',
            mb: 4,
            lineHeight: 1.6
          }}
          dangerouslySetInnerHTML={{
            __html: contentData?.description || (arrivalIata ? 
              `Plan your journey from ${departureCity} to ${arrivalCity} with ${airlineName}'s latest deals, travel tips, and flight information.` :
              normalizedFlights.length > 0 ?
                `Plan your journey from ${departureCity} to ${normalizedFlights.slice(0, 3).map(f => f.city).join(', ')}${normalizedFlights.length > 3 ? ` and ${normalizedFlights.length - 3} more destinations` : ''} with ${airlineName}'s latest deals, travel tips, and flight information.` :
                `Plan your journey from ${departureCity} with ${airlineName}'s latest deals, travel tips, and flight information.`
            )
          }}
        />



        {/* Flight Search Box - Same as other pages */}
          <FlightSearchBox 
            defaultFrom={{ 
              code: departureIata, 
              name: `${departureCity} (${departureIata})`, 
              city_name: departureCity,
              country_name: '',
              country_code: '',
              type: 'airport' as const
            }}
            defaultTo={arrivalIata ? { 
              code: arrivalIata, 
              name: `${arrivalCity} (${arrivalIata})`, 
              city_name: arrivalCity,
              country_name: '',
              country_code: '',
              type: 'airport' as const
            } : undefined}
          locale={locale}
        />


        {/* Cheap Flight Deals */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontSize: '1.8rem',
              fontWeight: 600,
              mb: 3,
              color: '#1a1a1a'
            }}
          >
            Cheap {airlineName} flight deals from {departureCity} to {arrivalCity}
          </Typography>
          
          <Grid container spacing={3}>
            {sampleFlightDeals.map((deal) => (
              <Grid item xs={12} sm={6} md={3} key={deal.id}>
                <Card sx={{ 
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #f0f0f0',
                  height: '100%',
                  '&:hover': { 
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                  }
                }}>
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mr: 1 }}>
                        {deal.type === 'round-trip' ? 'Round-trip from:' : 
                         deal.type === 'one-way' ? 'One-way from:' :
                         deal.type === 'popular' ? 'Cheapest Month:' : 'Cheapest Day:'}
        </Typography>
                      <Box sx={{ 
                        width: 16, 
                        height: 16, 
                        borderRadius: '50%', 
                        backgroundColor: '#e0e0e0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        color: '#666'
                      }}>
                        i
        </Box>
      </Box>

                    {deal.price && (
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          fontWeight: 700, 
                          color: deal.buttonColor,
                          fontSize: '2rem',
                          mb: 1
                        }}
                      >
                        {deal.price}
        </Typography>
                    )}
                    
                    {deal.month && (
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          fontWeight: 700, 
                          color: deal.buttonColor,
                          fontSize: '1.5rem',
                          mb: 1
                        }}
                      >
                        {deal.month}
            </Typography>
                    )}
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#666',
                        mb: 3,
                        flex: 1,
                        lineHeight: 1.5
                      }}
                    >
                      {deal.description}
            </Typography>
                    
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: deal.buttonColor,
                        color: 'white',
                        borderRadius: '4px',
                        py: 1.5,
                        fontWeight: 600,
                        '&:hover': { 
                          backgroundColor: deal.buttonColor,
                          opacity: 0.9
                        }
                      }}
                    >
                      {deal.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Booking Steps */}
        {contentData?.booking_steps && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 4,
                color: '#1a1a1a',
                textAlign: 'left'
              }}
            >
              How to Book {airlineName} Flights
            </Typography>
            <Box 
              sx={{ 
                color: '#4a5568',
                lineHeight: 1.7,
                '& h3, & h4, & h5, & h6': {
                  color: '#1a1a1a',
                  fontWeight: 600,
                  mb: 2,
                  mt: 3
                },
                '& p': {
                  mb: 2
                },
                '& ul, & ol': {
                  pl: 3,
                  mb: 2
                },
                '& li': {
                  mb: 1
                }
              }}
              dangerouslySetInnerHTML={{ __html: contentData.booking_steps }}
            />
          </Box>
        )}

        {/* Cancellation Policy */}
        {contentData?.cancellation && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 4,
                color: '#1a1a1a',
                textAlign: 'left'
              }}
            >
              {airlineName} Cancellation Policy
            </Typography>
            <Box 
              sx={{ 
                color: '#4a5568',
                lineHeight: 1.7,
                '& h3, & h4, & h5, & h6': {
                  color: '#1a1a1a',
                  fontWeight: 600,
                  mb: 2,
                  mt: 3
                },
                '& p': {
                  mb: 2
                },
                '& ul, & ol': {
                  pl: 3,
                  mb: 2
                },
                '& li': {
                  mb: 1
                }
              }}
              dangerouslySetInnerHTML={{ __html: contentData.cancellation }}
            />
          </Box>
        )}

        {/* Classes */}
        {contentData?.classes && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 4,
                color: '#1a1a1a',
                textAlign: 'left'
              }}
            >
              {airlineName} Flight Classes
            </Typography>
            <Box 
              sx={{ 
                color: '#4a5568',
                lineHeight: 1.7,
                '& h3, & h4, & h5, & h6': {
                  color: '#1a1a1a',
                  fontWeight: 600,
                  mb: 2,
                  mt: 3
                },
                '& p': {
                  mb: 2
                },
                '& ul, & ol': {
                  pl: 3,
                  mb: 2
                },
                '& li': {
                  mb: 1
                }
              }}
              dangerouslySetInnerHTML={{ __html: contentData.classes }}
            />
          </Box>
        )}

        {/* Destinations Overview */}
        {contentData?.destinations_overview && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 4,
                color: '#1a1a1a',
                textAlign: 'left'
              }}
            >
              {airlineName} Destinations Overview
            </Typography>
            <Box 
              sx={{ 
                color: '#4a5568',
                lineHeight: 1.7,
                '& h3, & h4, & h5, & h6': {
                  color: '#1a1a1a',
                  fontWeight: 600,
                  mb: 2,
                  mt: 3
                },
                '& p': {
                  mb: 2
                },
                '& ul, & ol': {
                  pl: 3,
                  mb: 2
                },
                '& li': {
                  mb: 1
                }
              }}
              dangerouslySetInnerHTML={{ __html: contentData.destinations_overview }}
            />
          </Box>
        )}


        {/* Flight Deals Section with Tabs */}
        {flightData && arrivalIata && (
          <FlightTabs 
            flightData={flightData}
            departureCity={departureCity}
            arrivalCity={arrivalCity}
            departureIata={departureIata}
            arrivalIata={arrivalIata}
            normalizedFlights={normalizedFlights}
            tabDescriptions={contentData?.tab_descriptions}
          />
        )}

        {/* Flight Cards for Single Airport Pages */}
        {flightData && !arrivalIata && normalizedFlights.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 4,
                color: '#1a1a1a'
              }}
            >
              Available Flights from {departureCity}
            </Typography>
            <FlightTabs 
              flightData={flightData}
              departureCity={departureCity}
              arrivalCity="Various Destinations"
              departureIata={departureIata}
              arrivalIata={null}
              normalizedFlights={normalizedFlights}
              tabDescriptions={contentData?.tab_descriptions}
            />
          </Box>
        )}



        {/* Price Trends & Analysis */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontSize: '1.8rem',
              fontWeight: 600,
              mb: 4,
              color: '#1a1a1a'
            }}
          >
            Price Trends & Analysis
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ClientPriceGraph
                title="Weekly Price Trends"
                description={
                  contentData?.weekly_price_paragraph || `Track weekly price fluctuations for ${airlineName} flights from ${departureCity} to ${arrivalCity}. With average fares around $${flightData?.average_fare || 'N/A'}, the cheapest day to fly is typically ${flightData?.cheapest_day || 'mid-week'}. Prices typically vary by day of the week, with mid-week flights often offering better deals.`
                }
                data={weeklyPriceData}
                yAxisLabel="Price (USD)"
                showPrices={true}
                height={300}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ClientPriceGraph
                title="Monthly Price Trends"
                description={
                  contentData?.monthly_price_paragraph || `Monitor monthly price patterns to identify the best time to book your ${airlineName} flight from ${departureCity} to ${arrivalCity}. With average fares around $${flightData?.average_fare || 'N/A'}, the cheapest month to fly is typically ${flightData?.cheapest_month || 'off-season'}. Seasonal variations and holiday periods significantly impact pricing.`
                }
                data={monthlyPriceData}
                yAxisLabel="Price (USD)"
                showPrices={true}
                height={300}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Weather & Climate */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontSize: '1.8rem',
              fontWeight: 600,
              mb: 4,
              color: '#1a1a1a'
            }}
          >
            Weather & Climate Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ClientPriceGraph
                title={`Weather in ${departureCity}`}
                description={generateWeatherDescription(weatherData, departureCity)}
                data={weatherData}
                yAxisLabel="Temperature (°F)"
                showPrices={false}
                height={300}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ClientPriceGraph
                title={`Average Rainfall in ${departureCity}`}
                description={generateRainfallDescription(rainfallData, departureCity)}
                data={rainfallData}
                yAxisLabel="Rainfall (inches)"
                showPrices={false}
                height={300}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Popular Destinations Section */}
        {(contentData?.destinations || contentData?.description) && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 3,
                color: '#1a1a1a'
              }}
            >
              Popular Destinations from {departureCity}
            </Typography>
            
            {contentData?.description && (
              <div 
                dangerouslySetInnerHTML={{ __html: contentData.description }} 
                style={{ 
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  color: '#666',
                  marginBottom: '1rem'
                }}
              />
            )}
            
            {contentData?.destinations && (
              <div 
                dangerouslySetInnerHTML={{ __html: contentData.destinations }} 
                style={{ 
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  color: '#666'
                }}
              />
            )}
          </Box>
        )}

        {/* Departure Terminal Information */}
        {contentData?.departure_terminal_paragraph && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 3,
                color: '#1a1a1a'
              }}
            >
              {airlineName} Departure Terminal
            </Typography>
            <div 
              dangerouslySetInnerHTML={{ __html: contentData.departure_terminal_paragraph }} 
              style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>
        )}

        {/* Arrival Terminal Information */}
        {contentData?.arrival_terminal_paragraph && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 3,
                color: '#1a1a1a'
              }}
            >
              {airlineName} Arrival Terminal
            </Typography>
            <div 
              dangerouslySetInnerHTML={{ __html: contentData.arrival_terminal_paragraph }} 
              style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>
        )}

        {/* Airlines Contact Information at Departure City Terminal */}
        {contentData?.terminal_contact_paragraph && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 3,
                color: '#1a1a1a'
              }}
            >
              Airlines Contact Information at {departureCity} Terminal
            </Typography>
            <div 
              dangerouslySetInnerHTML={{ __html: contentData.terminal_contact_paragraph }} 
              style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>
        )}

        {/* Hotels Near Departure City */}
        {contentData?.hotels && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 3,
                color: '#1a1a1a'
              }}
            >
              Hotels Near {departureCity}
            </Typography>
            <div 
              dangerouslySetInnerHTML={{ __html: contentData.hotels }} 
              style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>
        )}

        {/* FAQ Section */}
        {contentData?.faqs && contentData.faqs.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 3,
                color: '#1a1a1a'
              }}
            >
              Frequently Asked Questions
            </Typography>
            <div 
              dangerouslySetInnerHTML={{ __html: contentData.faqs.map((faq: any) => 
                `<div style="margin-bottom: 1.5rem;">
                  <h3 style="font-weight: 600; color: #1a1a1a; margin-bottom: 0.5rem;">${faq.q || ''}</h3>
                  <p style="color: #666; line-height: 1.6;">${faq.a || ''}</p>
                </div>`
              ).join('') }} 
              style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>
        )}

        {/* Places Section */}
        {contentData?.places && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 3,
                color: '#1a1a1a'
              }}
            >
              Places to Visit in {arrivalCity}
            </Typography>
            <div 
              dangerouslySetInnerHTML={{ __html: contentData.places }} 
              style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>
        )}

        {/* Hotels Section */}
        {contentData?.hotels && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 3,
                color: '#1a1a1a'
              }}
            >
              Hotels in {arrivalCity}
            </Typography>
            <div 
              dangerouslySetInnerHTML={{ __html: contentData.hotels }} 
              style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>
        )}

        {/* City Information Section */}
        {contentData?.city && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 3,
                color: '#1a1a1a'
              }}
            >
              About {arrivalCity}
            </Typography>
            <div 
              dangerouslySetInnerHTML={{ __html: contentData.city }} 
              style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>
        )}

        {/* Departure Information */}
        {contentData?.departure_paragraph && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 3,
                color: '#1a1a1a'
              }}
            >
              Departure Information
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#666',
                lineHeight: 1.6,
                fontSize: '1.1rem'
              }}
              dangerouslySetInnerHTML={{ __html: contentData.departure_paragraph }}
            />
          </Box>
        )}

        {/* Arrival Information */}
        {contentData?.arrival_paragraph && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 3,
                color: '#1a1a1a'
              }}
            >
              Arrival Information
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#666',
                lineHeight: 1.6,
                fontSize: '1.1rem'
              }}
              dangerouslySetInnerHTML={{ __html: contentData.arrival_paragraph }}
            />
          </Box>
        )}

        {/* Terminal & Contact Information */}
        {contentData?.terminal_contact_paragraph && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 3,
                color: '#1a1a1a'
              }}
            >
              Terminal & Contact Information
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#666',
                lineHeight: 1.6,
                fontSize: '1.1rem'
              }}
              dangerouslySetInnerHTML={{ __html: contentData.terminal_contact_paragraph }}
            />
          </Box>
        )}

        {/* Additional Description */}
        {contentData?.description && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 3,
                color: '#1a1a1a'
              }}
            >
              About This Route
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#666',
                lineHeight: 1.6,
                fontSize: '1.1rem'
              }}
              dangerouslySetInnerHTML={{ __html: contentData.description }}
            />
          </Box>
        )}

        {/* Destinations */}
        {contentData?.destinations && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 3,
                color: '#1a1a1a'
              }}
            >
              Popular Destinations
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#666',
                lineHeight: 1.6,
                fontSize: '1.1rem'
              }}
              dangerouslySetInnerHTML={{ __html: contentData.destinations }}
            />
          </Box>
        )}



        {/* Places to Visit (Additional) */}
        {contentData?.places_to_visit && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 3,
                color: '#1a1a1a'
              }}
            >
              More Places to Visit
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#666',
                mb: 4,
                lineHeight: 1.6,
                fontSize: '1.1rem'
              }}
              dangerouslySetInnerHTML={{ __html: contentData.places_to_visit }}
            />
          </Box>
        )}



        {/* Additional Content Sections - City, Hotels, Airlines */}
        {contentData?.city && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 3,
                color: '#1a1a1a'
              }}
            >
              About {arrivalCity}
            </Typography>
            <div 
              dangerouslySetInnerHTML={{ __html: contentData.city }} 
              style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>
        )}

        {contentData?.hotels && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 3,
                color: '#1a1a1a'
              }}
            >
              Hotels in {arrivalCity}
            </Typography>
            <div 
              dangerouslySetInnerHTML={{ __html: contentData.hotels }} 
              style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>
        )}

        {contentData?.airlines && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 3,
                color: '#1a1a1a'
              }}
            >
              Airlines Information
            </Typography>
            <div 
              dangerouslySetInnerHTML={{ __html: contentData.airlines }} 
              style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>
        )}

        {/* Places to Visit */}
        {contentData?.places && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 3,
                color: '#1a1a1a'
              }}
            >
              Places to Visit in {arrivalCity}
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#666',
                mb: 4,
                lineHeight: 1.6,
                fontSize: '1.1rem'
              }}
              dangerouslySetInnerHTML={{ __html: contentData.places }}
            />
          </Box>
        )}


        {/* Weather Information */}
        {contentData?.temperature && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 3,
                color: '#1a1a1a'
              }}
            >
              Weather Information
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#666',
                mb: 4,
                lineHeight: 1.6,
                fontSize: '1.1rem'
              }}
              dangerouslySetInnerHTML={{ __html: contentData.temperature }}
            />
            
            {contentData?.rainfall && (
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#666',
                  mb: 4,
                  lineHeight: 1.6,
                  fontSize: '1.1rem'
                }}
                dangerouslySetInnerHTML={{ __html: contentData.rainfall }}
              />
            )}
          </Box>
        )}

        {/* Monthly and Weekly Information */}
        {(contentData?.monthly || contentData?.weekly) && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 3,
                color: '#1a1a1a'
              }}
            >
              Price Information
            </Typography>
            
            {contentData?.monthly && (
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#666',
                  mb: 3,
                  lineHeight: 1.6,
                  fontSize: '1.1rem'
                }}
                dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(contentData.monthly) }}
              />
            )}
            
            {contentData?.weekly && (
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#666',
                  mb: 4,
                  lineHeight: 1.6,
                  fontSize: '1.1rem'
                }}
                dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(contentData.weekly) }}
              />
            )}
          </Box>
        )}

        {/* Content from API */}
        {contentData?.content && (
          <Box sx={{ mb: 6 }}>
            <div 
              dangerouslySetInnerHTML={{ __html: contentData.content }} 
              style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>
        )}

        {/* Airline Contact Information */}
        <Box sx={{ 
          mb: 6, 
          mt: 4,
          p: 4,
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontSize: '1.8rem',
              fontWeight: 600,
              mb: 3,
              color: '#1a1a1a',
              textAlign: 'left'
            }}
          >
            <strong>{airlineName}</strong> Contact Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  color: '#1e3a8a', 
                  mb: 1,
                  textAlign: 'left'
                }}>
                  Customer Service
                </Typography>
                <Typography variant="body1" sx={{ color: '#4a5568', mb: 1 }}>
                  Phone: {airlineDetails?.phone || '+1 (800) 123-4567'}
                </Typography>
                <Typography variant="body1" sx={{ color: '#4a5568', mb: 1 }}>
                  Email: customer.service@{airlineCode.toLowerCase()}.com
                </Typography>
                <Typography variant="body1" sx={{ color: '#4a5568' }}>
                  Hours: 24/7 Customer Support
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  color: '#1e3a8a', 
                  mb: 1,
                  textAlign: 'left'
                }}>
                  Booking & Reservations
                </Typography>
                <Typography variant="body1" sx={{ color: '#4a5568', mb: 1 }}>
                  Phone: {airlineDetails?.phone || '+1 (800) 987-6543'}
                </Typography>
                <Typography variant="body1" sx={{ color: '#4a5568', mb: 1 }}>
                  Email: reservations@{airlineCode.toLowerCase()}.com
                </Typography>
                <Typography variant="body1" sx={{ color: '#4a5568' }}>
                  Online: {airlineDetails?.url || `${airlineCode.toLowerCase()}.com`}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  color: '#1e3a8a', 
                  mb: 1,
                  textAlign: 'left'
                }}>
                  Baggage Information
                </Typography>
                <Typography variant="body1" sx={{ color: '#4a5568', mb: 1 }}>
                  Phone: {airlineDetails?.phone || '+1 (800) 555-0123'}
                </Typography>
                <Typography variant="body1" sx={{ color: '#4a5568', mb: 1 }}>
                  Email: baggage@{airlineCode.toLowerCase()}.com
                </Typography>
                <Typography variant="body1" sx={{ color: '#4a5568' }}>
                  Lost & Found: {airlineDetails?.phone || '+1 (800) 555-0124'}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  color: '#1e3a8a', 
                  mb: 1,
                  textAlign: 'left'
                }}>
                  Corporate Office
                </Typography>
                <Typography variant="body1" sx={{ color: '#4a5568', mb: 1 }}>
                  <strong>{airlineName}</strong> Airlines Headquarters
                </Typography>
                {airlineDetails?.address && (
                  <Typography variant="body1" sx={{ color: '#4a5568', mb: 1 }}>
                    {airlineDetails.address}
                  </Typography>
                )}
                {airlineDetails?.city && airlineDetails?.state && (
                  <Typography variant="body1" sx={{ color: '#4a5568', mb: 1 }}>
                    {airlineDetails.city}, {airlineDetails.state}
                  </Typography>
                )}
                {airlineDetails?.zipcode && (
                  <Typography variant="body1" sx={{ color: '#4a5568', mb: 1 }}>
                    {airlineDetails.zipcode}
                  </Typography>
                )}
                <Typography variant="body1" sx={{ color: '#4a5568', mb: 1 }}>
                  {airlineDetails?.country || 'India'}
                </Typography>
                <Typography variant="body1" sx={{ color: '#4a5568' }}>
                  Phone: {airlineDetails?.phone || '+1 (212) 555-0100'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ 
            mt: 3, 
            p: 3, 
            backgroundColor: '#1e3a8a', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <Typography variant="h6" sx={{ 
              color: 'white', 
              fontWeight: 600, 
              mb: 1,
              textAlign: 'left'
            }}>
              Need Help? Contact Us Now
            </Typography>
            <Typography variant="body2" sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              textAlign: 'left'
            }}>
              Our customer service team is available 24/7 to assist you with bookings, 
              changes, cancellations, and any other inquiries about your {airlineName} flight.
            </Typography>
          </Box>
        </Box>

    </Container>
      
      <SchemaOrg data={breadcrumbSchema([
        { name: 'Home', url: locale === 'es' ? '/es' : '/' },
        { name: 'Airlines', url: (locale === 'es' ? '/es' : '') + '/airlines' },
        { name: airlineName, url: (locale === 'es' ? '/es' : '') + `/airlines/${airlineCode}` },
        { name: `${departureCity}${arrivalIata ? ` to ${arrivalCity}` : normalizedFlights.length > 0 ? ` to ${normalizedFlights.slice(0, 2).map(f => f.city).join(', ')}${normalizedFlights.length > 2 ? ` and ${normalizedFlights.length - 2} more` : ''}` : ''}`, url: (locale === 'es' ? '/es' : '') + `/airlines/${airlineCode}/${params.route}` },
      ])} />

      {/* Flight Product Schema */}
      {flightData && (
        <SchemaOrg data={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": `${airlineName} flights from ${departureCity} to ${arrivalCity}`,
          "description": contentData?.description?.replace(/<[^>]*>/g, '') || `Find cheap ${airlineName} flights from ${departureCity} to ${arrivalCity}`,
          "image": [
            getAirlineLogoUrl(airlineCode, 'large'),
            `${process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com'}/images/flights/${departureIata}-${arrivalIata}.jpg`
          ],
          "brand": {
            "@type": "Brand",
            "name": airlineName
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.2",
            "reviewCount": "89"
          },
          "offers": flightData.oneway_flights?.slice(0, 5).map((flight: any) => ({
            "@type": "Offer",
            "price": flight.price || "0",
            "priceCurrency": flight.currency || "USD",
            "availability": "https://schema.org/InStock",
            "seller": {
              "@type": "Organization",
              "name": airlineName
            },
            "validFrom": flight.iso_date || new Date().toISOString(),
            "description": `${airlineName} flight from ${flight.iata_from || departureIata} to ${flight.iata_to || arrivalIata}`,
            "shippingDetails": {
              "@type": "OfferShippingDetails",
              "shippingRate": {
                "@type": "MonetaryAmount",
                "value": "0",
                "currency": "USD"
              },
              "deliveryTime": {
                "@type": "ShippingDeliveryTime",
                "businessDays": {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                }
              }
            },
            "hasMerchantReturnPolicy": {
              "@type": "MerchantReturnPolicy",
              "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
              "merchantReturnDays": 24,
              "returnMethod": "https://schema.org/ReturnByMail",
              "returnFees": "https://schema.org/FreeReturn"
            }
          })) || []
        }} />
      )}

      {/* Flight Schema */}
      {flightData && arrivalIata && (
        <SchemaOrg data={{
          "@context": "https://schema.org",
          "@type": "Flight",
          "flightNumber": `${airlineCode.toUpperCase()}${Math.floor(Math.random() * 1000)}`,
          "airline": {
            "@type": "Airline",
            "name": airlineName,
            "iataCode": airlineCode.toUpperCase()
          },
          "departureAirport": {
            "@type": "Airport",
            "name": `${departureIata} Airport`,
            "iataCode": departureIata,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": departureCity,
              "addressCountry": "IN"
            }
          },
          "arrivalAirport": {
            "@type": "Airport",
            "name": `${arrivalIata} Airport`,
            "iataCode": arrivalIata,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": arrivalCity,
              "addressCountry": "IN"
            }
          },
          "departureTime": flightData.oneway_flights?.[0]?.iso_date && flightData.oneway_flights[0]?.departure_time ? 
            `${flightData.oneway_flights[0].iso_date}T${(flightData.oneway_flights[0].departure_time || '').replace(' ', '')}` : undefined,
          "arrivalTime": flightData.oneway_flights?.[0]?.iso_date && flightData.oneway_flights[0]?.arrival_time ? 
            `${flightData.oneway_flights[0].iso_date}T${(flightData.oneway_flights[0].arrival_time || '').replace(' ', '')}` : undefined,
          "flightDistance": "1200",
          "flightDistanceUnit": "km"
        }} />
      )}

      {/* Flight List Schema for All Flights */}
      {flightData && (
        <SchemaOrg data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": `${airlineName} Flights from ${departureCity}${arrivalIata ? ` to ${arrivalCity}` : ''}`,
          "description": `Available ${airlineName} flights from ${departureCity}${arrivalIata ? ` to ${arrivalCity}` : ' to various destinations'}`,
          "numberOfItems": (flightData.oneway_flights?.length || 0) + (flightData.last_minute_flights?.length || 0) + (flightData.cheap_flights?.length || 0) + (flightData.best_flights?.length || 0),
          "itemListElement": [
            ...(flightData.oneway_flights?.slice(0, 10).map((flight: any, index: number) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Flight",
                "flightNumber": `${airlineCode.toUpperCase()}${flight.flight_number || Math.floor(Math.random() * 1000)}`,
                "airline": {
                  "@type": "Airline",
                  "name": airlineName,
                  "iataCode": airlineCode.toUpperCase()
                },
                "departureAirport": {
                  "@type": "Airport",
                  "name": `${flight.iata_from || departureIata} Airport`,
                  "iataCode": flight.iata_from || departureIata
                },
                "arrivalAirport": {
                  "@type": "Airport",
                  "name": `${flight.iata_to || arrivalIata} Airport`,
                  "iataCode": flight.iata_to || arrivalIata
                },
                "departureTime": flight.iso_date && flight.departure_time ? 
                  `${flight.iso_date}T${(flight.departure_time || '').replace(' ', '')}` : undefined,
                "arrivalTime": flight.iso_date && flight.arrival_time ? 
                  `${flight.iso_date}T${(flight.arrival_time || '').replace(' ', '')}` : undefined,
                "offers": {
                  "@type": "Offer",
                  "price": flight.price || "0",
                  "priceCurrency": flight.currency || "USD",
                  "availability": "https://schema.org/InStock"
                }
              }
            })) || []),
            ...(flightData.last_minute_flights?.slice(0, 5).map((flight: any, index: number) => ({
              "@type": "ListItem",
              "position": (flightData.oneway_flights?.length || 0) + index + 1,
              "item": {
                "@type": "Flight",
                "flightNumber": `${airlineCode.toUpperCase()}${flight.flight_number || Math.floor(Math.random() * 1000)}`,
                "airline": {
                  "@type": "Airline",
                  "name": airlineName,
                  "iataCode": airlineCode.toUpperCase()
                },
                "departureAirport": {
                  "@type": "Airport",
                  "name": `${flight.iata_from || departureIata} Airport`,
                  "iataCode": flight.iata_from || departureIata
                },
                "arrivalAirport": {
                  "@type": "Airport",
                  "name": `${flight.iata_to || arrivalIata} Airport`,
                  "iataCode": flight.iata_to || arrivalIata
                },
                "departureTime": flight.iso_date && flight.departure_time ? 
                  `${flight.iso_date}T${(flight.departure_time || '').replace(' ', '')}` : undefined,
                "arrivalTime": flight.iso_date && flight.arrival_time ? 
                  `${flight.iso_date}T${(flight.arrival_time || '').replace(' ', '')}` : undefined,
                "offers": {
                  "@type": "Offer",
                  "price": flight.price || "0",
                  "priceCurrency": flight.currency || "USD",
                  "availability": "https://schema.org/InStock"
                }
              }
            })) || [])
          ]
        }} />
      )}

      {/* FAQ Schema */}
      <SchemaOrg data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": contentData?.faqs?.map((faq: any) => ({
          "@type": "Question",
          "name": faq.q?.replace(/<[^>]*>/g, '') || '',
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a?.replace(/<[^>]*>/g, '') || ''
          }
        })) || [
          {
            "@type": "Question",
            "name": `How long is the ${airlineName} flight from ${departureCity} to ${arrivalCity}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": contentData?.flight_duration || `Non-stop ${airlineName} flights average about 2-3 hours, covering a distance of approximately 1,200 miles (1,900 km).`
            }
          },
          {
            "@type": "Question",
            "name": `Which airport should I fly into in ${arrivalCity}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": contentData?.airport_recommendation || `The main airport is ${arrivalCity} Airport (${arrivalIata}), which is closest to downtown and handles most domestic flights.`
            }
          },
          {
            "@type": "Question",
            "name": `Do I need a visa to travel from ${departureCity} to ${arrivalCity}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": contentData?.visa_requirements || `No visa is required for domestic travel within India.`
            }
          },
          {
            "@type": "Question",
            "name": `What is the best time to book ${airlineName} flights from ${departureCity} to ${arrivalCity}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": contentData?.best_day_to_book || `Booking around 3-6 weeks in advance and flying mid-week (Tuesday or Wednesday) can help you find the cheapest ${airlineName} fares.`
            }
          },
          {
            "@type": "Question",
            "name": `How to find cheap ${airlineName} flights from ${departureCity} to ${arrivalCity}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": contentData?.how_to_find_cheap_flights || `Use fare comparison tools, set price alerts, consider nearby airports, and be flexible with your travel dates to secure the lowest ${airlineName} fares.`
            }
          }
        ]
      }} />

      {/* Individual Flight Schemas */}
      {normalizedFlights.slice(0, 10).map((flight, index) => {
        const departureCoords = getAirportCoordinates(flight.from, flightData);
        const arrivalCoords = getAirportCoordinates(flight.to, flightData);
        
        return (
          <SchemaOrg 
            key={`flight-${index}`}
            data={{
              "@type": "Flight",
              "@context": "http://schema.org",
              "estimatedFlightDuration": flight.duration || "2h 30m",
              "departureTime": "6:10 am",
              "departureAirport": {
                "@type": "Airport",
                "name": flight.airport || `${flight.from} Airport`,
                "iataCode": flight.from,
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": departureCoords.lat,
                  "longitude": departureCoords.lng
                }
              },
              "arrivalAirport": {
                "@type": "Airport",
                "name": flight.airport || `${flight.to} Airport`,
                "iataCode": flight.to,
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": arrivalCoords.lat,
                  "longitude": arrivalCoords.lng
                }
              },
              "image": [
                `${process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com'}/images/flights/${flight.from || departureIata}-${flight.to || arrivalIata}.jpg`,
                getAirlineLogoUrl(airlineCode, 'medium')
              ],
              "offers": [{
                "@type": "Offer",
                "price": flight.price || "0",
                "priceCurrency": "USD",
                "shippingDetails": {
                  "@type": "OfferShippingDetails",
                  "shippingRate": {
                    "@type": "MonetaryAmount",
                    "value": "0",
                    "currency": "USD"
                  },
                  "deliveryTime": {
                    "@type": "ShippingDeliveryTime",
                    "businessDays": {
                      "@type": "OpeningHoursSpecification",
                      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                    }
                  }
                },
                "hasMerchantReturnPolicy": {
                  "@type": "MerchantReturnPolicy",
                  "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
                  "merchantReturnDays": 24,
                  "returnMethod": "https://schema.org/ReturnByMail",
                  "returnFees": "https://schema.org/FreeReturn"
                }
              }],
              "provider": {
                "@type": "Airline",
                "name": airlineName,
                "iataCode": airlineCode.toUpperCase()
              }
            }}
          />
        );
      })}

      {/* WebSite Schema */}
      <SchemaOrg data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "AirlinesMap",
        "url": process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com"}/search?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      }} />

      {/* Organization Schema */}
      <SchemaOrg data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "AirlinesMap",
        "url": process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com",
        "logo": `${process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com"}/logo.png`,
        "description": "Compare airlines and find the best flight deals",
        "foundingDate": "2020",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": process.env.NEXT_PUBLIC_PHONE || "+1-800-FLIGHTS",
          "contactType": "customer service"
        },
        "availableLanguage": ["English", "Spanish", "French", "Russian"],
        "sameAs": [
          process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com/airlinesmap.com",
          process.env.NEXT_PUBLIC_TWITTER_URL || "https://twitter.com/airlinesmap.com",
          process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/airlinesmap.com"
        ],
        "address": {
          "@type": "PostalAddress",
          "streetAddress": process.env.NEXT_PUBLIC_ADDRESS || "8th the green suite b",
          "addressLocality": process.env.NEXT_PUBLIC_CITY || "Dover",
          "addressRegion": process.env.NEXT_PUBLIC_STATE || "DE",
          "postalCode": process.env.NEXT_PUBLIC_ZIP || "19901",
          "addressCountry": process.env.NEXT_PUBLIC_COUNTRY || "US"
        }
      }} />

      {/* Airport Schema for Departure */}
      <SchemaOrg data={{
        "@context": "https://schema.org",
        "@type": "Airport",
        "name": `${departureIata} Airport`,
        "iataCode": departureIata,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": departureCity,
          "addressCountry": contentData?.country || "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": getAirportCoordinates(departureIata, flightData).lat,
          "longitude": getAirportCoordinates(departureIata, flightData).lng
        }
      }} />

      {/* WebPage Schema */}
      <SchemaOrg data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": contentData?.title || `${airlineName} flights from ${departureCity} to ${arrivalCity}`,
        "description": contentData?.description?.replace(/<[^>]*>/g, '') || `Find the best ${airlineName} flight deals from ${departureCity} to ${arrivalCity}`,
        "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com"}/airlines/${airlineCode}/${params.route}`,
        "mainEntity": {
          "@type": "Airline",
          "name": airlineName,
          "iataCode": airlineCode.toUpperCase()
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Airlines",
              "item": `${process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com"}/airlines`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": airlineName,
              "item": `${process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com"}/airlines/${airlineCode}`
            },
            {
              "@type": "ListItem",
              "position": 4,
              "name": `${departureCity} to ${arrivalCity}`,
              "item": `${process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com"}/airlines/${airlineCode}/${params.route}`
            }
          ]
        }
      }} />

      {/* TravelAgency Schema */}
      <SchemaOrg data={{
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "AirlinesMap",
        "url": process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com",
        "description": "Compare airlines and find the best flight deals",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": process.env.NEXT_PUBLIC_ADDRESS || "8th the green suite b",
          "addressLocality": process.env.NEXT_PUBLIC_CITY || "Dover",
          "addressRegion": process.env.NEXT_PUBLIC_STATE || "DE",
          "postalCode": process.env.NEXT_PUBLIC_ZIP || "19901",
          "addressCountry": process.env.NEXT_PUBLIC_COUNTRY || "US"
        },
        "telephone": process.env.NEXT_PUBLIC_PHONE || "+1-800-FLIGHTS",
        "email": process.env.NEXT_PUBLIC_EMAIL || "support@airlinesmap.com",
        "areaServed": {
          "@type": "Country",
          "name": contentData?.country || "India"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Flight Services",
          "itemListElement": normalizedFlights.slice(0, 5).map((flight, index) => ({
            "@type": "Offer",
            "itemOffered": {
              "@type": "Flight",
              "name": `${airlineName} flight from ${flight.from} to ${flight.to}`,
              "provider": {
                "@type": "Airline",
                "name": airlineName,
                "iataCode": airlineCode.toUpperCase()
              }
            },
            "price": flight.price || "0",
            "shippingDetails": {
              "@type": "OfferShippingDetails",
              "shippingRate": {
                "@type": "MonetaryAmount",
                "value": "0",
                "currency": "USD"
              },
              "deliveryTime": {
                "@type": "ShippingDeliveryTime",
                "businessDays": {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                }
              }
            },
            "hasMerchantReturnPolicy": {
              "@type": "MerchantReturnPolicy",
              "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
              "merchantReturnDays": 24,
              "returnMethod": "https://schema.org/ReturnByMail",
              "returnFees": "https://schema.org/FreeReturn"
            },
            "priceCurrency": "USD"
          }))
        }
      }} />

    </Box>
  );
}
