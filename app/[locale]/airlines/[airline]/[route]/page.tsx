import { Metadata } from 'next';
import { Typography, Box, Container, Grid, Card, CardContent, Button } from '@mui/material';
import { localeFromParam } from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';
import AirlineRouteContent from '@/components/AirlineRouteContent';
import { generateFallbackContent } from '@/lib/fallbackContentGenerator';
import { generateDatasetSchema } from '@/lib/datasetSchemaGenerator';
import { generateAirlineCanonicalUrl, generateAlternateUrls } from '@/lib/canonical';
import SchemaOrg from '@/components/SchemaOrg';
import { breadcrumbSchema } from '@/lib/schema';
import { fetchAirlineContent, fetchAirlineData, fetchAirlineAirportContent, fetchAirlineAirportData, fetchAirlineContactInfo, fetchCityByIata } from '@/lib/api';
import { 
  getCachedAirlineContent, 
  getCachedAirlineAirportContent, 
  getCachedAirlineData, 
  getCachedAirlineAirportData, 
  getCachedAirlineContactInfo, 
  getCachedCityData 
} from '@/lib/cached-api';
import dynamic from 'next/dynamic';
import { normalizeFlights, NormalizedFlight } from '@/lib/flightNormalizer';
import { getAirlineLogoUrl, getAirportImageUrl } from '@/lib/cdn';

// Dynamic imports for client components with SSR enabled for SEO and performance optimization
const FlightSearchBox = dynamic(() => import('@/components/FlightSearchBox'), { 
  ssr: true,
  loading: () => <div>Loading search...</div>
});
const ClientPriceGraph = dynamic(() => import('@/components/ClientPriceGraph'), { 
  ssr: true,
  loading: () => <div>Loading graph...</div>
});
const FlightTabs = dynamic(() => import('@/components/FlightTabs'), { 
  ssr: true,
  loading: () => <div>Loading tabs...</div>
});


// Helper function to decode and clean HTML content
function renderContent(content: any): string {
  if (typeof content === 'string') {
    // Remove markdown code blocks
    let cleaned = content.replace(/```html\n?/g, '').replace(/```\n?/g, '');
    
    // Decode HTML entities
    cleaned = cleaned
      .replace(/\\u003C/g, '<')
      .replace(/\\u003E/g, '>')
      .replace(/\\u0026/g, '&')
      .replace(/\\u0027/g, "'")
      .replace(/\\u0022/g, '"')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t');
    
    return cleaned;
  }
  if (content && typeof content === 'object') {
    return content.content || content.text || content.description || content.html || JSON.stringify(content);
  }
  return '';
}

// Helper function to get city name from IATA code using API data or fallback
function getCityName(iataCode: string, cityData?: any): string {
  // Use API data if available
  if (cityData?.city_name) {
    return cityData.city_name;
  }
  
  // Fallback to hardcoded mapping if API data not available
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


// Helper function to get airline code from slug
function getAirlineCodeFromSlug(slug: string): string {
  const airlineCodeMap: { [key: string]: string } = {
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
    'delta': 'dl',
    'american': 'aa',
    'united': 'ua',
    'southwest': 'wn',
    'jetblue': 'b6',
    'alaska': 'as',
    'spirit': 'nk',
    'frontier': 'f9',
    'allegiant': 'g4',
    'hawaiian': 'ha'
  };
  
  return airlineCodeMap[slug.toLowerCase()] || slug.toUpperCase();
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
function generateWeatherDescription(weatherData: any[], cityName: string, t: any): string {
  if (!weatherData || weatherData.length === 0) {
    const fallbackText = t?.flightPage?.weatherDescriptionFallback;
    if (fallbackText && typeof fallbackText === 'string') {
      return fallbackText.replace('{cityName}', cityName);
    }
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
  
  const detailedDescription = t?.flightPage?.weatherDescriptionDetailed;
  if (detailedDescription) {
    return detailedDescription
      .replace(/{cityName}/g, cityName)
      .replace(/{minTemp}/g, minTemp.toString())
      .replace(/{coolestMonth}/g, coolestMonth)
      .replace(/{maxTemp}/g, maxTemp.toString())
      .replace(/{warmestMonth}/g, warmestMonth)
      .replace(/{avgTemp}/g, Math.round(avgTemp).toString())
      .replace(/{bestMonths}/g, bestMonths || 'spring and fall');
  }
  
  return `Plan your visit to ${cityName} with detailed temperature insights. ${cityName} experiences temperatures ranging from ${minTemp}°F in ${coolestMonth} to ${maxTemp}°F in ${warmestMonth}, with an average of ${Math.round(avgTemp)}°F. The best time to visit is during ${bestMonths || 'spring and fall'} when temperatures are most comfortable for sightseeing and outdoor activities.`;
}

// Helper function to generate rainfall description based on rainfall data
function generateRainfallDescription(rainfallData: any[], cityName: string, t: any): string {
  if (!rainfallData || rainfallData.length === 0) {
    const fallbackText = t?.flightPage?.rainfallDescriptionFallback;
    if (fallbackText && typeof fallbackText === 'string') {
      return fallbackText.replace('{cityName}', cityName);
    }
    return `Stay prepared for your trip to ${cityName} with current rainfall data. ${cityName} receives varied rainfall throughout the year, with precipitation patterns changing by season.`;
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
  
  const detailedDescription = t?.flightPage?.rainfallDescriptionDetailed;
  if (detailedDescription) {
    return detailedDescription
      .replace(/{cityName}/g, cityName)
      .replace(/{minRainfall}/g, minRainfall.toString())
      .replace(/{driestMonth}/g, driestMonth)
      .replace(/{maxRainfall}/g, maxRainfall.toString())
      .replace(/{wettestMonth}/g, wettestMonth)
      .replace(/{avgRainfall}/g, avgRainfall.toFixed(1))
      .replace(/{bestMonths}/g, bestMonths || 'winter and spring');
  }
  
  return `Stay prepared for your trip to ${cityName} with detailed rainfall insights. ${cityName} receives rainfall ranging from ${minRainfall} inches in ${driestMonth} to ${maxRainfall} inches in ${wettestMonth}, with an average of ${avgRainfall.toFixed(1)} inches annually. The best time to visit is during ${bestMonths || 'winter and spring'} when rainfall is minimal, ensuring clear skies for outdoor exploration and sightseeing.`;
}

export async function generateMetadata({ params }: { params: { locale: string; airline: string; route: string } }): Promise<Metadata> {
  const locale = localeFromParam(params.locale);
  const t = getTranslations(locale);
  const { departureIata, arrivalIata } = parseFlightSlug(params.route);
  // Convert airline slug to airline code (e.g., "indigo" -> "6e", "6e" -> "6e")
  const airlineCode = getAirlineCodeFromSlug(params.airline);
  
  // Generate canonical URL and alternate URLs
  const canonicalUrl = generateAirlineCanonicalUrl(airlineCode, params.route, locale);
  const alternateUrls = generateAlternateUrls(`/airlines/${airlineCode}/${params.route}`);
  
  // Map locale to language ID for API calls
  const getLangId = (locale: string): 1 | 2 | 3 | 4 => {
    switch (locale) {
      case 'en':
    return 1;
      case 'es':
        return 2;
      case 'ru':
        return 3;
      case 'fr':
        return 4;
      default:
        return 1; // Default to English
    }
  };

    let contentData = null;
    let flightData = null;
  let airlineContactInfo = null;

  try {
    // Fetch all data in parallel for better performance
    const [contentDataResult, flightDataResult, airlineContactInfoResult] = await Promise.all([
      arrivalIata 
        ? fetchAirlineContent(airlineCode, arrivalIata, departureIata, getLangId(locale), 1)
        : fetchAirlineAirportContent(airlineCode, departureIata, getLangId(locale), 1),
      arrivalIata 
        ? fetchAirlineData(airlineCode, arrivalIata, departureIata, getLangId(locale), 1)
        : fetchAirlineAirportData(airlineCode, departureIata, 1),
      fetchAirlineContactInfo(airlineCode)
    ]);
    
    contentData = contentDataResult;
    flightData = flightDataResult;
    airlineContactInfo = airlineContactInfoResult;
    
    
    // Get translations for the current locale
    const t = getTranslations(locale);
    
    // Use dynamic data from content API for title and description
    const title = contentData?.title || (arrivalIata ? 
      t.flightPage.title
        .replace('{airlineName}', getAirlineName(airlineCode, contentData, airlineContactInfo))
        .replace('{departureCity}', flightData?.metadata?.departure_city || contentData?.departure_city || getCityName(departureIata))
        .replace('{arrivalCity}', flightData?.metadata?.arrival_city || contentData?.arrival_city || getCityName(arrivalIata)) :
      t.flightPage.title
        .replace('{airlineName}', getAirlineName(airlineCode, contentData, airlineContactInfo))
        .replace('{departureCity}', flightData?.metadata?.departure_city || contentData?.departure_city || getCityName(departureIata))
        .replace('{arrivalCity}', t.flightPage.destinationsWorldwide));

    // Use dynamic data from content API for description
    const description = contentData?.meta_description || (arrivalIata ?
      t.flightPage.description
        .replace('{airlineName}', getAirlineName(airlineCode, contentData, airlineContactInfo))
        .replace('{departureCity}', flightData?.metadata?.departure_city || contentData?.departure_city || getCityName(departureIata))
        .replace('{arrivalCity}', flightData?.metadata?.arrival_city || contentData?.arrival_city || getCityName(arrivalIata)) :
      t.flightPage.description
        .replace('{airlineName}', getAirlineName(airlineCode, contentData, airlineContactInfo))
        .replace('{departureCity}', flightData?.metadata?.departure_city || contentData?.departure_city || getCityName(departureIata))
        .replace('{arrivalCity}', t.flightPage.destinationsWorldwide));
    
    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
        languages: alternateUrls,
      },
      keywords: contentData?.meta?.keywords?.join(', ') || (arrivalIata ?
        `${getAirlineName(airlineCode, contentData, airlineContactInfo)} flights ${getCityName(departureIata)} ${getCityName(arrivalIata)}, ${getCityName(departureIata)} to ${getCityName(arrivalIata)} ${getAirlineName(airlineCode, contentData, airlineContactInfo)}` :
        `${getAirlineName(airlineCode, contentData, airlineContactInfo)} flights ${getCityName(departureIata)}, ${getCityName(departureIata)} ${getAirlineName(airlineCode, contentData, airlineContactInfo)}`
      ),
      authors: [{ name: process.env.NEXT_PUBLIC_COMPANY_NAME || 'AirlinesMap' }],
      creator: process.env.NEXT_PUBLIC_COMPANY_NAME || 'AirlinesMap',
      publisher: process.env.NEXT_PUBLIC_COMPANY_NAME || 'AirlinesMap',
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        type: 'website',
        locale: locale === 'es' ? 'es_ES' : locale === 'ru' ? 'ru_RU' : locale === 'fr' ? 'fr_FR' : 'en_US',
        siteName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'AirlinesMap',
        images: [
          {
            url: getAirlineLogoUrl(airlineCode, 'large'),
            width: 1200,
            height: 630,
            alt: `${getAirlineName(airlineCode, contentData, airlineContactInfo)} logo`,
          },
          ...(arrivalIata ? [
            {
              url: getAirportImageUrl(departureIata),
              width: 1200,
              height: 630,
              alt: `${getCityName(departureIata)} Airport`,
            },
            {
              url: getAirportImageUrl(arrivalIata),
              width: 1200,
              height: 630,
              alt: `${getCityName(arrivalIata)} Airport`,
            }
          ] : [
            {
              url: getAirportImageUrl(departureIata),
              width: 1200,
              height: 630,
              alt: `${getCityName(departureIata)} Airport`,
            }
          ])
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        site: '@airlinesmap',
        creator: '@airlinesmap',
        images: [
          getAirlineLogoUrl(airlineCode, 'large'),
          ...(arrivalIata ? [
            getAirportImageUrl(departureIata),
            getAirportImageUrl(arrivalIata)
          ] : [
            getAirportImageUrl(departureIata)
          ])
        ],
      },
    };
  } catch (error) {
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
      keywords: arrivalIata ?
        `${fallbackAirlineName} flights ${getCityName(departureIata)} ${getCityName(arrivalIata)}, ${getCityName(departureIata)} to ${getCityName(arrivalIata)} ${fallbackAirlineName}` :
        `${fallbackAirlineName} flights ${getCityName(departureIata)}, ${getCityName(departureIata)} ${fallbackAirlineName}`,
      authors: [{ name: process.env.NEXT_PUBLIC_COMPANY_NAME || 'AirlinesMap' }],
      creator: process.env.NEXT_PUBLIC_COMPANY_NAME || 'AirlinesMap',
      publisher: process.env.NEXT_PUBLIC_COMPANY_NAME || 'AirlinesMap',
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        type: 'website',
        locale: locale === 'es' ? 'es_ES' : locale === 'ru' ? 'ru_RU' : locale === 'fr' ? 'fr_FR' : 'en_US',
        siteName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'AirlinesMap',
        images: [
          {
            url: getAirlineLogoUrl(airlineCode, 'large'),
            width: 1200,
            height: 630,
            alt: `${fallbackAirlineName} logo`,
          },
          ...(arrivalIata ? [
            {
              url: getAirportImageUrl(departureIata),
              width: 1200,
              height: 630,
              alt: `${getCityName(departureIata)} Airport`,
            },
            {
              url: getAirportImageUrl(arrivalIata),
              width: 1200,
              height: 630,
              alt: `${getCityName(arrivalIata)} Airport`,
            }
          ] : [
            {
              url: getAirportImageUrl(departureIata),
              width: 1200,
              height: 630,
              alt: `${getCityName(departureIata)} Airport`,
            }
          ])
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        site: '@airlinesmap',
        creator: '@airlinesmap',
        images: [
          getAirlineLogoUrl(airlineCode, 'large'),
          ...(arrivalIata ? [
            getAirportImageUrl(departureIata),
            getAirportImageUrl(arrivalIata)
          ] : [
            getAirportImageUrl(departureIata)
          ])
        ],
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
  // Convert airline slug to airline code (e.g., "indigo" -> "6e", "6e" -> "6e")
  const airlineCode = getAirlineCodeFromSlug(params.airline);
  const t = getTranslations(locale) as any;
  
  // Fetch content and flight data based on route type
  let contentData = null;
  let flightData = null;
  let airlineContactInfo = null;
  let departureCityData = null;
  let arrivalCityData = null;
  
  // Map locale to language ID for API calls
  const getLangId = (locale: string): 1 | 2 | 3 | 4 => {
    switch (locale) {
      case 'en':
    return 1;
      case 'es':
        return 2;
      case 'ru':
        return 3;
      case 'fr':
        return 4;
      default:
        return 1; // Default to English
    }
  };

  // Helper function to safely replace strings in translations
  const safeReplace = (text: any, replacements: Record<string, string>): string => {
    if (!text || typeof text !== 'string') return '';
    let result = text;
    Object.entries(replacements).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{${key}}`, 'g'), value);
    });
    return result;
  };

  try {
    // Fetch all data in parallel for better performance with Redis caching
    const [contentDataResult, flightDataResult, airlineContactInfoResult, departureCityDataResult, arrivalCityDataResult] = await Promise.all([
      arrivalIata 
        ? getCachedAirlineContent(airlineCode, arrivalIata, departureIata, getLangId(locale), 1)
        : getCachedAirlineAirportContent(airlineCode, departureIata, getLangId(locale), 1),
      arrivalIata 
        ? getCachedAirlineData(airlineCode, arrivalIata, departureIata, getLangId(locale), 1)
        : getCachedAirlineAirportData(airlineCode, departureIata, 1),
      getCachedAirlineContactInfo(airlineCode),
      // Fetch city data for departure airport with caching
      getCachedCityData(departureIata, getLangId(locale), 1).catch(() => null),
      // Fetch city data for arrival airport (only if it exists) with caching
      arrivalIata ? getCachedCityData(arrivalIata, getLangId(locale), 1).catch(() => null) : null
    ]);
    
    contentData = contentDataResult;
    flightData = flightDataResult;
    airlineContactInfo = airlineContactInfoResult;
    departureCityData = departureCityDataResult;
    arrivalCityData = arrivalCityDataResult;
  } catch (error) {
  }

  // Helper function to extract city names from title
  const extractCitiesFromTitle = (title: string) => {
    // Pattern: "Aegean Airlines flights from Amman to Istanbul @ $268"
    const match = title.match(/flights from ([^to]+) to ([^@]+)/i);
    if (match) {
      return {
        departureCity: match[1].trim(),
        arrivalCity: match[2].trim()
      };
    }
    return null;
  };

  // Make city data available for schemas
  const cityData = {
    departure: departureCityData,
    arrival: arrivalCityData
  };

  // Use city names from API data (content API first, then flight data, then city API, then fallback)
  let departureCity, arrivalCity;
  
  if (contentData?.departure_city) {
    // Use content API data for departure city
    departureCity = `${contentData.departure_city} (${departureIata})`;
    // For arrival city, check if we have it in content data, otherwise use flight data or city API
    if (contentData?.arrival_city) {
    arrivalCity = arrivalIata ? `${contentData.arrival_city} (${arrivalIata})` : 'Various Destinations';
    } else if (flightData?.arrival_city) {
      arrivalCity = arrivalIata ? `${flightData.arrival_city} (${arrivalIata})` : 'Various Destinations';
    } else {
      arrivalCity = arrivalIata ? getCityName(arrivalIata, arrivalCityData) : 'Various Destinations';
    }
  } else if (flightData?.metadata?.departure_city) {
    // Use flight data API metadata
    departureCity = `${flightData.metadata.departure_city} (${departureIata})`;
    arrivalCity = arrivalIata ? (flightData.metadata.arrival_city ? `${flightData.metadata.arrival_city} (${arrivalIata})` : getCityName(arrivalIata, arrivalCityData)) : 'Various Destinations';
  } else if (flightData?.departure_city) {
    // Use flight data API (legacy)
    departureCity = `${flightData.departure_city} (${departureIata})`;
    arrivalCity = arrivalIata ? (flightData?.arrival_city ? `${flightData.arrival_city} (${arrivalIata})` : getCityName(arrivalIata, arrivalCityData)) : 'Various Destinations';
  } else if (contentData?.title) {
    // Extract from title
    const cities = extractCitiesFromTitle(contentData.title);
    if (cities) {
      departureCity = `${cities.departureCity} (${departureIata})`;
      arrivalCity = arrivalIata ? `${cities.arrivalCity} (${arrivalIata})` : 'Various Destinations';
    } else {
      // Fallback to city API data
      departureCity = getCityName(departureIata, departureCityData);
      arrivalCity = arrivalIata ? getCityName(arrivalIata, arrivalCityData) : 'Various Destinations';
    }
  } else {
    // Fallback to city API data
    departureCity = getCityName(departureIata, departureCityData);
    arrivalCity = arrivalIata ? getCityName(arrivalIata, arrivalCityData) : 'Various Destinations';
  }
  
  const airlineName = getAirlineName(airlineCode, contentData, airlineContactInfo);
  
  // Extract airline details from flight data as fallback
  let airlineDetails = flightData?.[0]?.airlineroutes?.[0]?.airline || null;
  
  // Use contact info from dedicated API if available
  if (airlineContactInfo) {
    airlineDetails = {
      ...airlineDetails,
      phone: airlineContactInfo.phone || airlineDetails?.phone || '+1-888-319-6206',
      url: airlineContactInfo.website || airlineDetails?.url || `https://www.${airlineCode.toLowerCase()}.com`,
      address: airlineContactInfo.address || airlineDetails?.address || '',
      city: airlineContactInfo.city || airlineDetails?.city || '',
      state: airlineContactInfo.state || airlineDetails?.state || '',
      zipcode: airlineContactInfo.zipcode || airlineDetails?.zipcode || '',
      country: airlineContactInfo.country || airlineDetails?.country || 'India',
      location: airlineContactInfo.city && airlineContactInfo.state ? 
        `${airlineContactInfo.city}, ${airlineContactInfo.state}` : 
        airlineDetails?.location || 'India',
      // Add more dynamic fields
      email: airlineContactInfo.email || airlineDetails?.email || `customer.service@${airlineCode.toLowerCase()}.com`,
      reservations_email: airlineContactInfo.reservations_email || airlineDetails?.reservations_email || `reservations@${airlineCode.toLowerCase()}.com`,
      baggage_email: airlineContactInfo.baggage_email || airlineDetails?.baggage_email || `baggage@${airlineCode.toLowerCase()}.com`,
      service_hours: airlineContactInfo.service_hours || airlineDetails?.service_hours || '24/7 Customer Support',
      twitter: airlineContactInfo.twitter || airlineDetails?.twitter || '',
      facebook: airlineContactInfo.facebook || airlineDetails?.facebook || '',
      instagram: airlineContactInfo.instagram || airlineDetails?.instagram || '',
      linkedin: airlineContactInfo.linkedin || airlineDetails?.linkedin || ''
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
  } else if (flightData && !Array.isArray(flightData) && flightData.iata_from && flightData.iata_to && flightData.price) {
    // Handle single route object from airport-only pages (legacy - when API returns single object)
    // Create flight cards for each day of the week that has flights
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const departureTimes = ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '08:00'];
    
    normalizedFlights = [];
    
    for (let i = 1; i <= 7; i++) {
      if (flightData[`day${i}`] === 'yes') {
        const dayName = days[i - 1];
        const basePrice = parseFloat(flightData.price);
        // Vary price slightly by day
        const priceVariation = i === 5 ? 0.9 : (i === 1 ? 1.1 : 1.0); // Friday cheaper, Monday more expensive
        const duration = flightData.common_duration || 120;
        
        normalizedFlights.push({
          from: flightData.iata_from,
          to: flightData.iata_to,
          city: flightData.city_name_en || flightData.airport?.city_name || getCityName(flightData.iata_to, cityData.arrival),
          airport: flightData.airport?.display_name || `${flightData.city_name_en} (${flightData.iata_to})`,
          flightsPerDay: flightData.flights_per_day || '1 flight',
          flightsPerWeek: flightData.flights_per_week || '6',
          airline: airlineCode,
          airlineCode: airlineCode.toUpperCase(),
          airlineCountry: flightData.country_code || 'Unknown',
          airlineUrl: flightData.airlineroutes?.[0]?.airline?.url || '#',
          price: `$${Math.round(basePrice * priceVariation)}`,
          duration: `${duration} min`,
          departureTime: departureTimes[i - 1],
          arrivalTime: calculateArrivalTime(departureTimes[i - 1], duration),
          stops: 0,
          fromCity: getCityName(flightData.iata_from, cityData.departure),
          toCity: flightData.city_name_en || flightData.airport?.city_name || getCityName(flightData.iata_to, cityData.arrival),
          day: dayName
        });
      }
    }
  }
  
  // Helper function to calculate arrival time
  function calculateArrivalTime(departureTime: string, durationMinutes: number): string {
    const [hours, minutes] = departureTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const arrivalHours = Math.floor(totalMinutes / 60) % 24;
    const arrivalMinutes = totalMinutes % 60;
    return `${arrivalHours.toString().padStart(2, '0')}:${arrivalMinutes.toString().padStart(2, '0')}`;
  }

  // Generate flight deals from API data
  const sampleFlightDeals = [
  {
    id: 1,
      type: 'round-trip',
      price: contentData?.avragefares ? `$${contentData.avragefares * 2}` : (flightData?.round_trip_start ? `$${flightData.round_trip_start}` : '$104'),
      description: contentData?.cheap_flights ? stripHtml(contentData.cheap_flights) : `Round-trip ${airlineName} flights from ${departureCity} (${departureIata}) to ${arrivalCity || 'Various Destinations'}`,
      buttonText: t.searchDeals,
      buttonColor: '#10b981'
  },
  {
    id: 2,
      type: 'one-way',
      price: contentData?.avragefares ? `$${contentData.avragefares}` : (flightData?.oneway_trip_start ? `$${flightData.oneway_trip_start}` : '$72'),
      description: contentData?.direct_flights ? stripHtml(contentData.direct_flights) : `One-way ${airlineName} flight from ${departureCity} (${departureIata}) to ${arrivalCity || 'Various Destinations'}`,
      buttonText: t.searchDeals,
      buttonColor: '#1e3a8a'
  },
  {
    id: 3,
      type: 'popular',
      month: contentData?.cheapest_month || flightData?.popular_month || 'December',
      description: `Cheapest month is ${contentData?.cheapest_month || flightData?.popular_month || 'December'} from ${departureCity} (${departureIata}). Maximum price drop flights to ${arrivalCity || 'Various Destinations'} in month of ${contentData?.cheapest_month || flightData?.popular_month || 'December'}.`,
      buttonText: t.viewPopular,
      buttonColor: '#ff6b35'
  },
  {
    id: 4,
      type: 'cheapest',
      month: contentData?.cheapest_day || flightData?.cheapest_day || 'Tuesday',
      description: `Cheapest week day is ${contentData?.cheapest_day || flightData?.cheapest_day || 'Tuesday'} from ${departureCity} (${departureIata}). Maximum price drop flights to ${arrivalCity || 'Various Destinations'} on ${contentData?.cheapest_day || flightData?.cheapest_day || 'Tuesday'}.`,
      buttonText: t.findDeals,
      buttonColor: '#10b981'
    }
  ];

  // Use actual API data for charts - prioritize content API data over flight data
  // Weekly data from Content API (weekly_prices_avg) or Real API fallback
  const weeklyPriceData = contentData?.weekly_prices_avg?.map((week: any) => ({
    name: week.day.substring(0, 3), // Extract day name (Mon, Tue, etc.)
    value: week.avg_price
  })) || flightData?.weeks?.map((week: any) => ({
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

  // Monthly data from Content API (monthly_prices_avg) or Real API fallback
  const monthlyPriceData = contentData?.monthly_prices_avg?.map((month: any) => ({
    name: month.month.substring(0, 3), // Extract month name (Jan, Feb, etc.)
    value: month.avg_price
  })) || flightData?.months?.map((month: any) => ({
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


  // Weather data from Real API or hardcoded fallback
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

  // Rainfall data from Real API or hardcoded fallback
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

  // Generate fallback content when API content is not available
  const fallbackContent = generateFallbackContent({
    locale,
    airlineName,
    departureCity,
    arrivalCity,
    flightData,
    contentData
  });

  // Filter out duplicate content sections from API data
  const finalContentData = contentData ? {
    ...contentData,
    // Remove duplicate sections that cause content duplication
    hotels: null,
    airlines: null,
    best_time_visit: null
    // Keep faqs for display
  } : contentData;


  // Generate canonical URL
  const canonicalUrl = generateAirlineCanonicalUrl(airlineCode, params.route, locale);

  // Generate dataset schemas for graphs
  const datasetSchemas = generateDatasetSchema({
    locale,
    airlineName,
    departureCity,
    arrivalCity,
    pageUrl: canonicalUrl,
    monthlyPriceData: monthlyPriceData,
    monthlyWeatherData: weatherData,
    monthlyRainfallData: rainfallData,
    weeklyPriceData: weeklyPriceData
  });

  // Performance optimizations - removed useMemo as it can't be used in server components

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      {/* Main Content with Translation Support */}
      <AirlineRouteContent
        locale={locale}
        contentData={finalContentData}
        flightData={flightData}
        airlineName={airlineName}
        departureCity={departureCity}
        arrivalCity={arrivalCity}
        departureIata={departureIata}
        arrivalIata={arrivalIata}
        normalizedFlights={normalizedFlights}
      />

      <Container 
        sx={{ 
          py: { xs: 3, sm: 4, md: 6 },
          px: { xs: 2, sm: 4, md: 6 },
          width: '100%',
          maxWidth: '100%'
        }}
      >



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
            {safeReplace(t?.flightPage?.cheapFlightDeals, {
              airlineName,
              departureCity,
              arrivalCity
            }) || `Cheap ${airlineName} flight deals from ${departureCity} to ${arrivalCity}`}
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
                        {deal.type === 'round-trip' ? t.roundTripFrom : 
                         deal.type === 'one-way' ? t.oneWayFrom :
                         deal.type === 'popular' ? t.cheapestMonthLabel : t.cheapestDayLabel}
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
{safeReplace(t?.flightPage?.bookingSteps || 'How to Book {airlineName} Flights', { airlineName })}
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
              dangerouslySetInnerHTML={{ __html: renderContent(contentData.booking_steps) }}
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
{safeReplace(t?.flightPage?.cancellationPolicy || '{airlineName} Cancellation Policy', { airlineName })}
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
              dangerouslySetInnerHTML={{ __html: renderContent(contentData.cancellation) }}
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
{safeReplace(t?.flightPage?.classes || '{airlineName} Flight Classes', { airlineName })}
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
              dangerouslySetInnerHTML={{ __html: renderContent(contentData.classes) }}
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
{safeReplace(t?.flightPage?.destinationsOverview || '{airlineName} Destinations Overview', { airlineName })}
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
              dangerouslySetInnerHTML={{ __html: renderContent(contentData.destinations_overview) }}
            />
          </Box>
        )}


        {/* Flight Deals Section with Tabs */}
        {flightData && arrivalIata && (
          <>
            {/* Static Flight Data for SEO */}
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
                {airlineName} Flights from {departureCity} to {arrivalCity}
              </Typography>
              
              {/* One-way Flights */}
              {flightData.oneway_flights && flightData.oneway_flights.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2, color: '#1a1a1a' }}>
                    {t.flightPage.oneWayFlights}
                  </Typography>
                  <Grid container spacing={2}>
                    {flightData.oneway_flights.slice(0, 6).map((flight: any, index: number) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ p: 2, height: '100%' }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {airlineName} {flight.flight_number || `FL${index + 1}`}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            {getCityName(flight.iata_from || departureIata, cityData.departure)} → {getCityName(flight.iata_to || arrivalIata, cityData.arrival)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            Departure: {flight.departure_time || 'N/A'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            Arrival: {flight.arrival_time || 'N/A'}
                          </Typography>
                          <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 600 }}>
                            ${flight.price || 'N/A'}
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Last Minute Flights */}
              {flightData.last_minute_flights && flightData.last_minute_flights.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2, color: '#1a1a1a' }}>
                    {t.flightPage.lastMinuteFlights}
                  </Typography>
                  <Grid container spacing={2}>
                    {flightData.last_minute_flights.slice(0, 6).map((flight: any, index: number) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ p: 2, height: '100%' }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {airlineName} {flight.flight_number || `LM${index + 1}`}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            {getCityName(flight.iata_from || departureIata, cityData.departure)} → {getCityName(flight.iata_to || arrivalIata, cityData.arrival)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            Departure: {flight.departure_time || 'N/A'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            Arrival: {flight.arrival_time || 'N/A'}
                          </Typography>
                          <Typography variant="h6" sx={{ color: '#ff6b35', fontWeight: 600 }}>
                            ${flight.price || 'N/A'}
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Cheap Flights */}
              {flightData.cheap_flights && flightData.cheap_flights.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2, color: '#1a1a1a' }}>
                    {t.flightPage.cheapFlights}
                  </Typography>
                  <Grid container spacing={2}>
                    {flightData.cheap_flights.slice(0, 6).map((flight: any, index: number) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ p: 2, height: '100%' }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {airlineName} {flight.flight_number || `CF${index + 1}`}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            {getCityName(flight.iata_from || departureIata, cityData.departure)} → {getCityName(flight.iata_to || arrivalIata, cityData.arrival)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            Departure: {flight.departure_time || 'N/A'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            Arrival: {flight.arrival_time || 'N/A'}
                          </Typography>
                          <Typography variant="h6" sx={{ color: '#1e3a8a', fontWeight: 600 }}>
                            ${flight.price || 'N/A'}
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Best Flights */}
              {flightData.best_flights && flightData.best_flights.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2, color: '#1a1a1a' }}>
                    {t.flightPage.bestFlights}
                  </Typography>
                  <Grid container spacing={2}>
                    {flightData.best_flights.slice(0, 6).map((flight: any, index: number) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ p: 2, height: '100%' }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {airlineName} {flight.flight_number || `BF${index + 1}`}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            {getCityName(flight.iata_from || departureIata, cityData.departure)} → {getCityName(flight.iata_to || arrivalIata, cityData.arrival)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            Departure: {flight.departure_time || 'N/A'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            Arrival: {flight.arrival_time || 'N/A'}
                          </Typography>
                          <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 600 }}>
                            ${flight.price || 'N/A'}
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Box>

            {/* Interactive Flight Tabs */}
            <FlightTabs 
              flightData={flightData}
              departureCity={departureCity}
              arrivalCity={arrivalCity}
              departureIata={departureIata}
              arrivalIata={arrivalIata}
              normalizedFlights={normalizedFlights}
              tabDescriptions={contentData?.tab_descriptions}
            />
          </>
        )}

        {/* Flight Cards for Single Airport Pages */}
        {flightData && !arrivalIata && normalizedFlights.length > 0 && (
          <>
            {/* Static Flight Data for SEO */}
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
                {t.flightPage.availableFlights} {t.flightPage.from} {departureCity}
              </Typography>
              
              {/* One-way Flights */}
              {flightData.oneway_flights && flightData.oneway_flights.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2, color: '#1a1a1a' }}>
                    {t.flightPage.oneWayFlights}
                  </Typography>
                  <Grid container spacing={2}>
                    {flightData.oneway_flights.slice(0, 6).map((flight: any, index: number) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ p: 2, height: '100%' }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {airlineName} {flight.flight_number || `FL${index + 1}`}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            {getCityName(flight.iata_from || departureIata, cityData.departure)} → {getCityName(flight.iata_to || 'Destination', cityData.arrival)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            Departure: {flight.departure_time || 'N/A'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            Arrival: {flight.arrival_time || 'N/A'}
                          </Typography>
                          <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 600 }}>
                            ${flight.price || 'N/A'}
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Last Minute Flights */}
              {flightData.last_minute_flights && flightData.last_minute_flights.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2, color: '#1a1a1a' }}>
                    {t.flightPage.lastMinuteFlights}
                  </Typography>
                  <Grid container spacing={2}>
                    {flightData.last_minute_flights.slice(0, 6).map((flight: any, index: number) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ p: 2, height: '100%' }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {airlineName} {flight.flight_number || `LM${index + 1}`}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            {getCityName(flight.iata_from || departureIata, cityData.departure)} → {getCityName(flight.iata_to || 'Destination', cityData.arrival)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            Departure: {flight.departure_time || 'N/A'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            Arrival: {flight.arrival_time || 'N/A'}
                          </Typography>
                          <Typography variant="h6" sx={{ color: '#ff6b35', fontWeight: 600 }}>
                            ${flight.price || 'N/A'}
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Cheap Flights */}
              {flightData.cheap_flights && flightData.cheap_flights.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2, color: '#1a1a1a' }}>
                    {t.flightPage.cheapFlights}
                  </Typography>
                  <Grid container spacing={2}>
                    {flightData.cheap_flights.slice(0, 6).map((flight: any, index: number) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ p: 2, height: '100%' }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {airlineName} {flight.flight_number || `CF${index + 1}`}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            {getCityName(flight.iata_from || departureIata, cityData.departure)} → {getCityName(flight.iata_to || 'Destination', cityData.arrival)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            Departure: {flight.departure_time || 'N/A'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            Arrival: {flight.arrival_time || 'N/A'}
                          </Typography>
                          <Typography variant="h6" sx={{ color: '#1e3a8a', fontWeight: 600 }}>
                            ${flight.price || 'N/A'}
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Best Flights */}
              {flightData.best_flights && flightData.best_flights.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2, color: '#1a1a1a' }}>
                    {t.flightPage.bestFlights}
                  </Typography>
                  <Grid container spacing={2}>
                    {flightData.best_flights.slice(0, 6).map((flight: any, index: number) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ p: 2, height: '100%' }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {airlineName} {flight.flight_number || `BF${index + 1}`}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            {getCityName(flight.iata_from || departureIata, cityData.departure)} → {getCityName(flight.iata_to || 'Destination', cityData.arrival)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            Departure: {flight.departure_time || 'N/A'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            Arrival: {flight.arrival_time || 'N/A'}
                          </Typography>
                          <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 600 }}>
                            ${flight.price || 'N/A'}
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Box>

            {/* Interactive Flight Tabs */}
            <FlightTabs 
              flightData={flightData}
              departureCity={departureCity}
              arrivalCity="Various Destinations"
              departureIata={departureIata}
              arrivalIata={null}
              normalizedFlights={normalizedFlights}
              tabDescriptions={contentData?.tab_descriptions}
            />
          </>
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
            {t.flightPage.priceTrends}
          </Typography>
          
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ClientPriceGraph
                title={t.flightPage.weeklyTrends}
                description={contentData?.weekly || `Track weekly price fluctuations for ${airlineName} flights from ${departureCity} to ${arrivalCity}. With average fares around $${flightData?.average_fare || 'N/A'}, the cheapest day to fly is typically ${flightData?.cheapest_day || 'mid-week'}. Prices typically vary by day of the week, with mid-week flights often offering better deals.`}
                data={weeklyPriceData}
                yAxisLabel="Price (USD)"
                showPrices={true}
                height={300}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ClientPriceGraph
                title={t.flightPage.monthlyTrends}
                description={contentData?.monthly || `Monitor monthly price patterns to identify the best time to book your ${airlineName} flight from ${departureCity} to ${arrivalCity}. With average fares around $${flightData?.average_fare || 'N/A'}, the cheapest month to fly is typically ${flightData?.cheapest_month || 'off-season'}. Seasonal variations and holiday periods significantly impact pricing.`}
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
            {t.flightPage.weatherClimateInfo || 'Weather & Climate Information'}
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ClientPriceGraph
                title={`${t.flightPage.weatherIn || 'Weather in'} ${departureCity}`}
                description={contentData?.temperature || generateWeatherDescription(weatherData, departureCity, t)}
                data={weatherData}
                yAxisLabel="Temperature (°F)"
                showPrices={false}
                height={300}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ClientPriceGraph
                title={`${t.flightPage.averageRainfallIn || 'Average Rainfall in'} ${departureCity}`}
                description={contentData?.rainfall || generateRainfallDescription(rainfallData, departureCity, t)}
                data={rainfallData}
                yAxisLabel="Rainfall (inches)"
                showPrices={false}
                height={300}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Best Time to Book Tickets Section */}
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
            {locale === 'es' ? `Mejor Momento para Reservar Boletos de ${airlineName} ${departureCity} a ${arrivalCity}` : 
             locale === 'ru' ? `Лучшее время для бронирования билетов ${airlineName} ${departureCity} в ${arrivalCity}` :
             locale === 'fr' ? `Meilleur Moment pour Réserver des Billets ${airlineName} ${departureCity} à ${arrivalCity}` : 
             `Best Time to Book ${airlineName} Tickets ${departureCity} to ${arrivalCity}`}
            </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
                fontSize: '1.1rem',
              lineHeight: 1.7,
              color: '#4a5568',
              mb: 3
            }}
          >
            {locale === 'es' ? 
              `El mejor día para reservar boletos de ${airlineName} de ${departureCity} a ${arrivalCity} es típicamente ${contentData?.cheapest_day || flightData?.cheapest_day || 'miércoles'}. Los precios suelen ser más bajos en este día de la semana, lo que puede ahorrarle dinero significativo en su viaje.` :
             locale === 'ru' ? 
              `Лучший день для бронирования билетов ${airlineName} из ${departureCity} в ${arrivalCity} обычно ${contentData?.cheapest_day || flightData?.cheapest_day || 'среда'}. Цены обычно ниже в этот день недели, что может сэкономить вам значительную сумму денег на поездке.` :
             locale === 'fr' ? 
              `Le meilleur jour pour réserver des billets ${airlineName} de ${departureCity} à ${arrivalCity} est généralement ${contentData?.cheapest_day || flightData?.cheapest_day || 'mercredi'}. Les prix sont généralement plus bas ce jour de la semaine, ce qui peut vous faire économiser beaucoup d'argent sur votre voyage.` :
              `The best day to book ${airlineName} tickets from ${departureCity} to ${arrivalCity} is typically ${contentData?.cheapest_day || flightData?.cheapest_day || 'Wednesday'}. Prices are usually lower on this day of the week, which can save you significant money on your trip.`
            }
          </Typography>
        </Box>

        {/* Best Time to Book Flights Section */}
        {contentData?.cheap_flights && (
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
              {locale === 'es' ? `Mejor Momento para Reservar Vuelos de ${airlineName} ${departureCity} a ${arrivalCity}` : 
               locale === 'ru' ? `Лучшее время для бронирования рейсов ${airlineName} ${departureCity} в ${arrivalCity}` :
               locale === 'fr' ? `Meilleur Moment pour Réserver des Vols ${airlineName} ${departureCity} à ${arrivalCity}` : 
               `Best Time to Book ${airlineName} Flights Tickets ${departureCity} to ${arrivalCity}`}
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
              dangerouslySetInnerHTML={{ __html: contentData.cheap_flights }}
            />
          </Box>
        )}

        {/* Best Time to Visit Section */}
        {contentData?.best_time_to_visit && (
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
              {locale === 'es' ? `Mejor Época para Visitar ${arrivalCity}` : 
               locale === 'ru' ? `Лучшее время для посещения ${arrivalCity}` :
               locale === 'fr' ? `Meilleure Période pour Visiter ${arrivalCity}` : 
               `Best Time to Visit ${arrivalCity}`}
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
              dangerouslySetInnerHTML={{ __html: contentData.best_time_to_visit }}
            />
          </Box>
        )}

        {/* Overview Section */}
        {contentData?.overview && (
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
              {locale === 'es' ? `Descripción General de ${arrivalCity}` : 
               locale === 'ru' ? `Обзор ${arrivalCity}` :
               locale === 'fr' ? `Aperçu de ${arrivalCity}` : 
               `Overview of ${arrivalCity}`}
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
              dangerouslySetInnerHTML={{ __html: contentData.overview }}
            />
          </Box>
        )}

        {/* Peak Season Section */}
        {contentData?.peak_season && (
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
              {locale === 'es' ? `Temporada Alta en ${arrivalCity}` : 
               locale === 'ru' ? `Пиковый сезон в ${arrivalCity}` :
               locale === 'fr' ? `Haute Saison à ${arrivalCity}` : 
               `Peak Season in ${arrivalCity}`}
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
              dangerouslySetInnerHTML={{ __html: contentData.peak_season }}
            />
          </Box>
        )}

        {/* Weather Section */}
        {contentData?.weather && (
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
              {locale === 'es' ? `Clima en ${arrivalCity}` : 
               locale === 'ru' ? `Погода в ${arrivalCity}` :
               locale === 'fr' ? `Météo à ${arrivalCity}` : 
               `Weather in ${arrivalCity}`}
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
              dangerouslySetInnerHTML={{ __html: contentData.weather }}
            />
          </Box>
        )}

        {/* Fallback Content Section - Generated when API content is not available */}
        {!contentData && (
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
              {fallbackContent.title}
            </Typography>
            
            <div 
              dangerouslySetInnerHTML={{ __html: renderContent(fallbackContent.description) }} 
              style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666',
                marginBottom: '2rem'
              }}
            />

            <div 
              dangerouslySetInnerHTML={{ __html: renderContent(fallbackContent.pageContent) }} 
              style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666',
                marginBottom: '2rem'
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
              {safeReplace(t?.flightPage?.aboutCity || 'About {arrivalCity}', { arrivalCity })}
            </Typography>
            <div 
              dangerouslySetInnerHTML={{ __html: renderContent(contentData.city) }} 
              style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
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
              {t.flightPage.arrivalInfo}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#666',
                lineHeight: 1.6,
                fontSize: '1.1rem'
              }}
              dangerouslySetInnerHTML={{ __html: renderContent(contentData.arrival_paragraph) }}
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
              {locale === 'es' ? 'Información de la Terminal de Llegada' :
               locale === 'ru' ? 'Информация о терминале прибытия' :
               locale === 'fr' ? 'Informations sur le terminal d\'arrivée' :
               'Arrival Terminal Information'}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#666',
                lineHeight: 1.6,
                fontSize: '1.1rem'
              }}
              dangerouslySetInnerHTML={{ __html: renderContent(contentData.arrival_terminal_paragraph) }}
            />
          </Box>
        )}


        {/* Terminal Contact Information */}
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
              {locale === 'es' ? 'Información de Contacto de la Terminal' :
               locale === 'ru' ? 'Контактная информация терминала' :
               locale === 'fr' ? 'Informations de Contact du Terminal' :
               'Terminal Contact Information'}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#666',
                lineHeight: 1.6,
                fontSize: '1.1rem'
              }}
              dangerouslySetInnerHTML={{ __html: renderContent(contentData.terminal_contact_paragraph) }}
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
            <strong>{airlineName}</strong> {t.contactInfo?.title || 'Contact Information'}
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
                  {t.contactInfo?.customerService || 'Customer Service'}
                </Typography>
                <Typography variant="body1" sx={{ color: '#4a5568', mb: 1 }}>
                  {t.contactInfo?.phone || 'Phone'}: {airlineDetails?.phone || '+1 (800) 123-4567'}
                </Typography>
                <Typography variant="body1" sx={{ color: '#4a5568', mb: 1 }}>
                  {t.contactInfo?.email || 'Email'}: {airlineDetails?.email || `customer.service@${airlineCode.toLowerCase()}.com`}
                </Typography>
                <Typography variant="body1" sx={{ color: '#4a5568' }}>
                  {t.contactInfo?.hours || 'Hours'}: {airlineDetails?.service_hours || '24/7 Customer Support'}
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
                  {t.contactInfo?.bookingReservations || 'Booking & Reservations'}
                </Typography>
                <Typography variant="body1" sx={{ color: '#4a5568', mb: 1 }}>
                  {t.contactInfo?.phone || 'Phone'}: {airlineDetails?.phone || '+1 (800) 987-6543'}
                </Typography>
                <Typography variant="body1" sx={{ color: '#4a5568', mb: 1 }}>
                  {t.contactInfo?.email || 'Email'}: {airlineDetails?.reservations_email || `reservations@${airlineCode.toLowerCase()}.com`}
                </Typography>
                <Typography variant="body1" sx={{ color: '#4a5568' }}>
                  {t.contactInfo?.online || 'Online'}: {airlineDetails?.url || `${airlineCode.toLowerCase()}.com`}
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
                  {t.contactInfo?.baggageInformation || 'Baggage Information'}
                </Typography>
                <Typography variant="body1" sx={{ color: '#4a5568', mb: 1 }}>
                  {t.contactInfo?.phone || 'Phone'}: {airlineDetails?.phone || '+1-888-319-6206'}
                </Typography>
                <Typography variant="body1" sx={{ color: '#4a5568', mb: 1 }}>
                  {t.contactInfo?.email || 'Email'}: {airlineDetails?.baggage_email || `baggage@${airlineCode.toLowerCase()}.com`}
                </Typography>
                <Typography variant="body1" sx={{ color: '#4a5568' }}>
                  {t.contactInfo?.lostFound || 'Lost & Found'}: {airlineDetails?.phone || '+1-888-319-6206'}
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
                  {t.contactInfo?.corporateOffice || 'Corporate Office'}
                </Typography>
                <Typography variant="body1" sx={{ color: '#4a5568', mb: 1 }}>
                  <strong>{airlineName}</strong> {t.contactInfo?.headquarters || 'Airlines Headquarters'}
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
                  Phone: {airlineDetails?.phone || '+1-888-319-6206'}
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
              {t.contactInfo?.needHelp || 'Need Help? Contact Us Now'}
            </Typography>
            <Typography variant="body2" sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              textAlign: 'left'
            }}>
              {t.contactInfo?.customerServiceDesc || 'Our customer service team is available 24/7 to assist you with bookings, changes, cancellations, and any other inquiries about your flight.'}
            </Typography>
          </Box>
        </Box>

        {/* FAQ Section - Bottom of Page */}
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
            {t.flightPage.faqs}
          </Typography>
          
          
          {contentData?.faqs && contentData.faqs.length > 0 ? (
            <div 
              dangerouslySetInnerHTML={{ 
                __html: contentData.faqs.map((faq: any) => 
                  `<div style="margin-bottom: 1.5rem; padding: 1rem 0; border-bottom: 1px solid #e0e0e0;">
                    <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; color: #333;">${renderContent(faq.title || faq.q || faq.question)}</h3>
                    <p style="font-size: 1rem; line-height: 1.6; color: #555; margin: 0;">${renderContent(faq.content || faq.a || faq.answer)}</p>
                  </div>`
                ).join('') 
              }} 
            />
          ) : (
            <Typography variant="body1" sx={{ color: '#666' }}>
              No FAQs available from the API.
            </Typography>
          )}
        </Box>

    </Container>
      
      <SchemaOrg data={breadcrumbSchema([
        { name: 'Home', url: locale === 'en' ? '/' : `/${locale}` },
        { name: 'Airlines', url: locale === 'en' ? '/airlines' : `/${locale}/airlines` },
        { name: airlineName, url: locale === 'en' ? `/airlines/${airlineCode}` : `/${locale}/airlines/${airlineCode}` },
        { name: `${departureCity}${arrivalIata ? ` to ${arrivalCity}` : normalizedFlights.length > 0 ? ` to ${normalizedFlights.slice(0, 2).map(f => f.city).join(', ')}${normalizedFlights.length > 2 ? ` and ${normalizedFlights.length - 2} more` : ''}` : ''}`, url: locale === 'en' ? `/airlines/${airlineCode}/${params.route}` : `/${locale}/airlines/${airlineCode}/${params.route}` },
      ])} />

      {/* Organization Schema */}
      <SchemaOrg data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "AirlinesMap",
        "url": process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com",
        "logo": process.env.NEXT_PUBLIC_COMPANY_LOGO || "https://airlinesmap.com/logo.png",
        "description": process.env.NEXT_PUBLIC_COMPANY_DESCRIPTION || "Find the best flight deals, hotels, and travel packages",
        "foundingDate": process.env.NEXT_PUBLIC_COMPANY_FOUNDING_DATE || "2018",
        "telephone": process.env.NEXT_PUBLIC_PHONE || "+1-888-319-6206",
        "email": process.env.NEXT_PUBLIC_EMAIL || "support@airlinesmap.com",
        "sameAs": [
          process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com/airlinesmap",
          process.env.NEXT_PUBLIC_TWITTER_URL || "https://twitter.com/airlinesmap",
          process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/airlinesmap",
          process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com/company/airlinesmap"
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

      {/* TravelAgency Schema */}
      <SchemaOrg data={{
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "AirlinesMap",
        "url": process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com",
        "description": process.env.NEXT_PUBLIC_COMPANY_DESCRIPTION || "Find the best flight deals, hotels, and travel packages",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": process.env.NEXT_PUBLIC_ADDRESS || "8th the green suite b",
          "addressLocality": process.env.NEXT_PUBLIC_CITY || "Dover",
          "addressRegion": process.env.NEXT_PUBLIC_STATE || "DE",
          "postalCode": process.env.NEXT_PUBLIC_ZIP || "19901",
          "addressCountry": process.env.NEXT_PUBLIC_COUNTRY || "US"
        },
        "telephone": process.env.NEXT_PUBLIC_PHONE || "+1-888-319-6206",
        "email": process.env.NEXT_PUBLIC_EMAIL || "support@airlinesmap.com"
      }} />

      {/* WebSite Schema */}
      <SchemaOrg data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": process.env.NEXT_PUBLIC_SITE_NAME || "AirlinesMap",
        "url": process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com",
        "description": process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Find the best flight deals, hotels, and travel packages",
        "inLanguage": locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : locale === 'ru' ? 'ru-RU' : 'fr-FR',
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://airlinesmap.com'}/${locale === 'en' ? '' : locale + '/'}search?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        },
        "publisher": {
          "@type": "Organization",
          "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "AirlinesMap",
          "url": process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com"
        }
      }} />

      {/* Flight Product Schema */}
      {flightData && (
        <SchemaOrg data={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": contentData?.title || `${airlineName} flights from ${departureCity} to ${arrivalCity}`,
          "description": contentData?.metadescription?.replace(/<[^>]*>/g, '') || contentData?.description?.replace(/<[^>]*>/g, '') || `Find cheap ${airlineName} flights from ${departureCity} to ${arrivalCity}`,
          "image": [
            getAirlineLogoUrl(airlineCode, 'large'),
            getAirportImageUrl(departureIata),
            arrivalIata ? getAirportImageUrl(arrivalIata) : null
          ].filter(Boolean),
          "brand": {
            "@type": "Brand",
            "name": airlineName
          },
          "category": "Travel",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": contentData?.rating || process.env.NEXT_PUBLIC_DEFAULT_RATING || "4.2",
            "reviewCount": contentData?.review_count || process.env.NEXT_PUBLIC_DEFAULT_REVIEW_COUNT || "89"
          },
          "additionalProperty": [
            {
              "@type": "PropertyValue",
              "name": "Departure City",
              "value": departureCity
            },
            {
              "@type": "PropertyValue",
              "name": "Arrival City", 
              "value": arrivalCity || "Various Destinations"
            },
            {
              "@type": "PropertyValue",
              "name": "Airline Code",
              "value": airlineCode.toUpperCase()
            },
            {
              "@type": "PropertyValue",
              "name": "Cheapest Day",
              "value": contentData?.cheapest_day || "Varies"
            },
            {
              "@type": "PropertyValue",
              "name": "Cheapest Month",
              "value": contentData?.cheapest_month || "Varies"
            },
            {
              "@type": "PropertyValue",
              "name": "Average Price",
              "value": contentData?.avragefares ? `$${contentData.avragefares}` : "Varies"
            }
          ],
          "offers": normalizedFlights.slice(0, 10).map((flight: any) => ({
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
            "price": flight.price?.replace('$', '') || "0",
            "priceCurrency": process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || "USD",
            "availability": "https://schema.org/InStock",
            "seller": {
              "@type": "Organization",
              "name": airlineName
            },
            "validFrom": new Date().toISOString(),
            "description": `${airlineName} flight from ${flight.from} to ${flight.to}`,
            "shippingDetails": {
              "@type": "OfferShippingDetails",
              "shippingRate": {
                "@type": "MonetaryAmount",
                "value": "0",
                "currency": process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || "USD"
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
              "merchantReturnDays": parseInt(process.env.NEXT_PUBLIC_RETURN_DAYS || "24"),
              "returnMethod": process.env.NEXT_PUBLIC_RETURN_METHOD || "https://schema.org/ReturnByMail",
              "returnFees": process.env.NEXT_PUBLIC_RETURN_FEES || "https://schema.org/FreeReturn"
            }
          }))
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
            "name": safeReplace(t?.schemaAirportName || '{cityName} Airport', { cityName: getCityName(departureIata) }),
            "iataCode": departureIata,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": departureCity,
              "addressCountry": "IN"
            }
          },
          "arrivalAirport": {
            "@type": "Airport",
            "name": safeReplace(t?.schemaAirportName || '{cityName} Airport', { cityName: getCityName(arrivalIata) }),
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
          "name": safeReplace(t?.schemaItemListName || '{airlineName} Flights from {departureCity}{arrivalCity}', {
            airlineName,
            departureCity,
            arrivalCity: arrivalIata ? ` to ${arrivalCity}` : ''
          }),
          "description": safeReplace(t?.schemaItemListDescription || 'Available {airlineName} flights from {departureCity}{arrivalCity}', {
            airlineName,
            departureCity,
            arrivalCity: arrivalIata ? ` to ${arrivalCity}` : ' to various destinations'
          }),
          "numberOfItems": (flightData.oneway_flights?.length || 0) + (flightData.last_minute_flights?.length || 0) + (flightData.cheap_flights?.length || 0) + (flightData.best_flights?.length || 0),
          "itemListElement": [
            ...(flightData.oneway_flights?.map((flight: any, index: number) => ({
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
                  "name": safeReplace(t?.schemaAirportName || '{cityName} Airport', { cityName: getCityName(flight.iata_from || departureIata) }),
                  "iataCode": flight.iata_from || departureIata
                },
                "arrivalAirport": {
                  "@type": "Airport",
                  "name": safeReplace(t?.schemaAirportName || '{cityName} Airport', { cityName: getCityName(flight.iata_to || arrivalIata) }),
                  "iataCode": flight.iata_to || arrivalIata
                },
                "departureTime": flight.iso_date && flight.departure_time ? 
                  `${flight.iso_date}T${(flight.departure_time || '').replace(' ', '')}` : undefined,
                "arrivalTime": flight.iso_date && flight.arrival_time ? 
                  `${flight.iso_date}T${(flight.arrival_time || '').replace(' ', '')}` : undefined,
                "offers": {
                  "@type": "Offer",
                  "price": flight.price || "0",
                  "priceCurrency": flight.currency || process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || "USD",
                  "availability": "https://schema.org/InStock"
                }
              }
            })) || []),
            ...(flightData.last_minute_flights?.map((flight: any, index: number) => ({
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
                  "name": safeReplace(t?.schemaAirportName || '{cityName} Airport', { cityName: getCityName(flight.iata_from || departureIata) }),
                  "iataCode": flight.iata_from || departureIata
                },
                "arrivalAirport": {
                  "@type": "Airport",
                  "name": safeReplace(t?.schemaAirportName || '{cityName} Airport', { cityName: getCityName(flight.iata_to || arrivalIata) }),
                  "iataCode": flight.iata_to || arrivalIata
                },
                "departureTime": flight.iso_date && flight.departure_time ? 
                  `${flight.iso_date}T${(flight.departure_time || '').replace(' ', '')}` : undefined,
                "arrivalTime": flight.iso_date && flight.arrival_time ? 
                  `${flight.iso_date}T${(flight.arrival_time || '').replace(' ', '')}` : undefined,
                "offers": {
                  "@type": "Offer",
                  "price": flight.price || "0",
                  "priceCurrency": flight.currency || process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || "USD",
                  "availability": "https://schema.org/InStock"
                }
              }
            })) || []),
            ...(flightData.cheap_flights?.map((flight: any, index: number) => ({
              "@type": "ListItem",
              "position": (flightData.oneway_flights?.length || 0) + (flightData.last_minute_flights?.length || 0) + index + 1,
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
                  "name": safeReplace(t?.schemaAirportName || '{cityName} Airport', { cityName: getCityName(flight.iata_from || departureIata) }),
                  "iataCode": flight.iata_from || departureIata
                },
                "arrivalAirport": {
                  "@type": "Airport",
                  "name": safeReplace(t?.schemaAirportName || '{cityName} Airport', { cityName: getCityName(flight.iata_to || arrivalIata) }),
                  "iataCode": flight.iata_to || arrivalIata
                },
                "departureTime": flight.iso_date && flight.departure_time ? 
                  `${flight.iso_date}T${(flight.departure_time || '').replace(' ', '')}` : undefined,
                "arrivalTime": flight.iso_date && flight.arrival_time ? 
                  `${flight.iso_date}T${(flight.arrival_time || '').replace(' ', '')}` : undefined,
                "offers": {
                  "@type": "Offer",
                  "price": flight.price || "0",
                  "priceCurrency": flight.currency || process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || "USD",
                  "availability": "https://schema.org/InStock"
                }
              }
            })) || []),
            ...(flightData.best_flights?.map((flight: any, index: number) => ({
              "@type": "ListItem",
              "position": (flightData.oneway_flights?.length || 0) + (flightData.last_minute_flights?.length || 0) + (flightData.cheap_flights?.length || 0) + index + 1,
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
                  "name": safeReplace(t?.schemaAirportName || '{cityName} Airport', { cityName: getCityName(flight.iata_from || departureIata) }),
                  "iataCode": flight.iata_from || departureIata
                },
                "arrivalAirport": {
                  "@type": "Airport",
                  "name": safeReplace(t?.schemaAirportName || '{cityName} Airport', { cityName: getCityName(flight.iata_to || arrivalIata) }),
                  "iataCode": flight.iata_to || arrivalIata
                },
                "departureTime": flight.iso_date && flight.departure_time ? 
                  `${flight.iso_date}T${(flight.departure_time || '').replace(' ', '')}` : undefined,
                "arrivalTime": flight.iso_date && flight.arrival_time ? 
                  `${flight.iso_date}T${(flight.arrival_time || '').replace(' ', '')}` : undefined,
                "offers": {
                  "@type": "Offer",
                  "price": flight.price || "0",
                  "priceCurrency": flight.currency || process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || "USD",
                  "availability": "https://schema.org/InStock"
                }
              }
            })) || [])
          ]
        }} />
      )}

      {/* Flight List Schema */}
      {normalizedFlights && normalizedFlights.length > 0 && (
        <SchemaOrg data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": `${airlineName} Flights from ${departureCity} to ${arrivalCity || 'Various Destinations'}`,
          "description": `Complete list of ${airlineName} flights from ${departureCity} to ${arrivalCity || 'various destinations'}`,
          "numberOfItems": normalizedFlights.length,
          "itemListElement": normalizedFlights.map((flight, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "Flight",
              "flightNumber": `${airlineCode.toUpperCase()}${(flight as any).flight_number || (100 + index)}`,
              "name": `${airlineName} ${(flight as any).flight_number || `FL${index + 1}`}${(flight as any).day ? ` - ${(flight as any).day}` : ''}`,
              "description": `${airlineName} flight from ${getCityName(flight.from, cityData.departure)} to ${getCityName(flight.to, cityData.arrival)}${(flight as any).day ? ` on ${(flight as any).day}s` : ''}. Duration: ${flight.duration || 'N/A'}, Price: $${flight.price}`,
              "provider": {
                "@type": "Airline",
                "name": airlineName,
                "iataCode": airlineCode.toUpperCase()
              },
              "departureAirport": {
                "@type": "Airport",
                "name": `${getCityName(flight.from, cityData.departure)} Airport`,
                "iataCode": flight.from
              },
              "arrivalAirport": {
                "@type": "Airport", 
                "name": `${getCityName(flight.to, cityData.arrival)} Airport`,
                "iataCode": flight.to
              },
              "departureTime": (flight as any).departureTime || "09:00",
              "arrivalTime": (flight as any).arrivalTime || "11:00",
              "offers": {
                "@type": "Offer",
                "price": (flight as any).price ? String((flight as any).price).replace('$', '') : "0",
                "priceCurrency": process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || "USD",
                "availability": "https://schema.org/InStock",
                "validFrom": new Date().toISOString()
              }
            }
          }))
        }} />
      )}

      {/* FAQ Schema */}
      <SchemaOrg data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": contentData?.faqs?.map((faq: any) => {
          const question = renderContent(faq.title || faq.q || faq.question);
          const answer = renderContent(faq.content || faq.a || faq.answer);
          
          // Remove HTML tags and clean up the text
          const cleanQuestion = question.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
          const cleanAnswer = answer.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
          
          return {
          "@type": "Question",
            "name": cleanQuestion,
          "acceptedAnswer": {
            "@type": "Answer",
              "text": cleanAnswer
          }
          };
        }) || [
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
      {normalizedFlights.map((flight, index) => {
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
                "name": flight.airport || safeReplace(t?.schemaAirportName || '{cityName} Airport', { cityName: getCityName(flight.from) }),
                "iataCode": flight.from,
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": departureCoords.lat,
                  "longitude": departureCoords.lng
                }
              },
              "arrivalAirport": {
                "@type": "Airport",
                "name": flight.airport || safeReplace(t?.schemaAirportName || '{cityName} Airport', { cityName: getCityName(flight.to) }),
                "iataCode": flight.to,
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": arrivalCoords.lat,
                  "longitude": arrivalCoords.lng
                }
              },
              "image": [
                getAirportImageUrl(flight.from || departureIata),
                flight.to ? getAirportImageUrl(flight.to) : (arrivalIata ? getAirportImageUrl(arrivalIata) : null),
                getAirlineLogoUrl(airlineCode, 'medium')
              ].filter(Boolean),
              "offers": [{
                "@type": "Offer",
                "price": flight.price || "0",
                "priceCurrency": process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || "USD",
                "shippingDetails": {
                  "@type": "OfferShippingDetails",
                  "shippingRate": {
                    "@type": "MonetaryAmount",
                    "value": "0",
                    "currency": process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || "USD"
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
        "description": process.env.NEXT_PUBLIC_COMPANY_DESCRIPTION || "Compare airlines and find the best flight deals",
        "foundingDate": process.env.NEXT_PUBLIC_COMPANY_FOUNDING_DATE || "2020",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": process.env.NEXT_PUBLIC_PHONE || "+1-888-319-6206",
          "contactType": "customer service"
        },
        "knowsLanguage": [
          {
            "@type": "Language",
            "name": "English",
            "alternateName": "en"
          },
          {
            "@type": "Language", 
            "name": "Spanish",
            "alternateName": "es"
          },
          {
            "@type": "Language",
            "name": "French", 
            "alternateName": "fr"
          },
          {
            "@type": "Language",
            "name": "Russian",
            "alternateName": "ru"
          }
        ],
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
        "name": safeReplace(t?.schemaAirportName || '{cityName} Airport', { cityName: getCityName(departureIata) }),
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
        "description": process.env.NEXT_PUBLIC_COMPANY_DESCRIPTION || "Compare airlines and find the best flight deals",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": process.env.NEXT_PUBLIC_ADDRESS || "8th the green suite b",
          "addressLocality": process.env.NEXT_PUBLIC_CITY || "Dover",
          "addressRegion": process.env.NEXT_PUBLIC_STATE || "DE",
          "postalCode": process.env.NEXT_PUBLIC_ZIP || "19901",
          "addressCountry": process.env.NEXT_PUBLIC_COUNTRY || "US"
        },
        "telephone": process.env.NEXT_PUBLIC_PHONE || "+1-888-319-6206",
        "email": process.env.NEXT_PUBLIC_EMAIL || "support@airlinesmap.com",
        "areaServed": {
          "@type": "Country",
          "name": contentData?.country || "India"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Flight Services",
          "itemListElement": normalizedFlights.map((flight, index) => ({
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
                "currency": process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || "USD"
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
              "merchantReturnDays": parseInt(process.env.NEXT_PUBLIC_RETURN_DAYS || "24"),
              "returnMethod": process.env.NEXT_PUBLIC_RETURN_METHOD || "https://schema.org/ReturnByMail",
              "returnFees": process.env.NEXT_PUBLIC_RETURN_FEES || "https://schema.org/FreeReturn"
            },
            "priceCurrency": "USD"
          }))
        }
      }} />

      {/* Dataset Schemas for Graphs */}
      <SchemaOrg data={datasetSchemas.monthly} />
      <SchemaOrg data={datasetSchemas.weekly} />

      {/* Content Schema */}
      <SchemaOrg data={{
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": contentData?.title || `${airlineName} flights from ${departureCity} to ${arrivalCity}`,
        "description": contentData?.description || contentData?.meta_description || `Find the best ${airlineName} flight deals from ${departureCity} to ${arrivalCity}`,
        "author": {
          "@type": "Organization",
          "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "AirlinesMap"
        },
        "publisher": {
          "@type": "Organization",
          "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "AirlinesMap",
          "logo": {
            "@type": "ImageObject",
            "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com"}/logo.png`
          }
        },
        "datePublished": new Date().toISOString(),
        "dateModified": new Date().toISOString(),
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com"}/airlines/${airlineCode}/${params.route}`
        },
        "about": {
          "@type": "Place",
          "name": arrivalCity,
          "description": contentData?.overview || `Information about ${arrivalCity}`
        }
      }} />

      {/* Flight List Schema */}
      {normalizedFlights && normalizedFlights.length > 0 && (
        <SchemaOrg data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": `${airlineName} Flights from ${departureCity} to ${arrivalCity}`,
          "description": `Available ${airlineName} flights from ${departureCity} (${departureIata}) to ${arrivalCity} (${arrivalIata})`,
          "numberOfItems": normalizedFlights.length,
          "itemListElement": normalizedFlights.map((flight, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "Flight",
              "name": `${airlineName} Flight ${flight.airline || 'XX'}${index + 1}`,
              "flightNumber": `${flight.airline || 'XX'}${index + 1}`,
              "departureTime": '09:00',
              "arrivalTime": '11:00',
              "duration": '2h 30m',
              "price": {
                "@type": "PriceSpecification",
                "price": flight.price || 100,
                "priceCurrency": 'USD'
              },
              "departureAirport": {
                "@type": "Airport",
                "name": `${departureCity} Airport`,
                "iataCode": flight.from || departureIata
              },
              "arrivalAirport": {
                "@type": "Airport",
                "name": `${arrivalCity} Airport`,
                "iataCode": flight.to || arrivalIata
              }
            }
          }))
        }} />
      )}

      {/* Place Schema for Destination */}
      <SchemaOrg data={{
        "@context": "https://schema.org",
        "@type": "Place",
        "name": arrivalCity,
        "description": contentData?.overview || `Information about ${arrivalCity}`,
        "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com"}/airlines/${airlineCode}/${params.route}`,
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "0.0", // This would need to be fetched from city data
          "longitude": "0.0"
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": arrivalCity,
          "addressCountry": "Unknown"
        }
      }} />

      {/* Price Data Schema */}
      <SchemaOrg data={{
        "@context": "https://schema.org",
        "@type": "Dataset",
        "name": `${airlineName} Flight Price Data - ${departureCity} to ${arrivalCity}`,
        "description": `Historical price data for ${airlineName} flights from ${departureCity} to ${arrivalCity}`,
        "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com"}/airlines/${airlineCode}/${params.route}`,
        "creator": {
          "@type": "Organization",
          "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "AirlinesMap"
        },
        "license": "https://creativecommons.org/licenses/by/4.0/",
        "variableMeasured": [
          {
            "@type": "PropertyValue",
            "name": "Weekly Price Average",
            "description": "Average flight prices by day of the week",
            "unitText": "USD"
          },
          {
            "@type": "PropertyValue",
            "name": "Monthly Price Average", 
            "description": "Average flight prices by month",
            "unitText": "USD"
          },
          {
            "@type": "PropertyValue",
            "name": "Temperature Data",
            "description": "Average temperature by month",
            "unitText": "°F"
          },
          {
            "@type": "PropertyValue",
            "name": "Rainfall Data",
            "description": "Average rainfall by month",
            "unitText": "inches"
          }
        ],
        "distribution": {
          "@type": "DataDownload",
          "encodingFormat": "application/json",
          "contentUrl": `${process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com"}/api/airline-data?airline_code=${airlineCode}&arrival_iata=${arrivalIata}&departure_iata=${departureIata}`
        }
      }} />

      {/* LocalBusiness Schema */}
      <SchemaOrg data={{
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "AirlinesMap",
        "description": process.env.NEXT_PUBLIC_COMPANY_DESCRIPTION || "Compare airlines and find the best flight deals",
        "url": process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com",
        "telephone": process.env.NEXT_PUBLIC_PHONE || "+1-888-319-6206",
        "email": process.env.NEXT_PUBLIC_EMAIL || "support@airlinesmap.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": process.env.NEXT_PUBLIC_ADDRESS || "8th the green suite b",
          "addressLocality": process.env.NEXT_PUBLIC_CITY || "Dover",
          "addressRegion": process.env.NEXT_PUBLIC_STATE || "DE",
          "postalCode": process.env.NEXT_PUBLIC_ZIP || "19901",
          "addressCountry": process.env.NEXT_PUBLIC_COUNTRY || "US"
        },
        "openingHours": "Mo-Su 00:00-23:59",
        "priceRange": "$$",
        "paymentAccepted": "Cash, Credit Card, PayPal",
        "currenciesAccepted": "USD, EUR, GBP"
      }} />

      {/* Service Schema */}
      <SchemaOrg data={{
        "@context": "https://schema.org",
        "@type": "Service",
        "name": `${airlineName} Flight Booking Service`,
        "description": `Book ${airlineName} flights from ${departureCity} to ${arrivalCity} with the best prices and deals`,
        "provider": {
          "@type": "Organization",
          "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "AirlinesMap"
        },
        "areaServed": {
          "@type": "Country",
          "name": "Worldwide"
        },
        "serviceType": "Flight Booking",
        "offers": {
          "@type": "Offer",
          "price": flightData?.round_trip_start || "100",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        }
      }} />

      {/* HowTo Schema */}
      <SchemaOrg data={{
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": `How to Book ${airlineName} Flights from ${departureCity} to ${arrivalCity}`,
        "description": `Step-by-step guide to booking ${airlineName} flights from ${departureCity} to ${arrivalCity}`,
        "step": [
          {
            "@type": "HowToStep",
            "name": "Search for Flights",
            "text": `Search for ${airlineName} flights from ${departureCity} to ${arrivalCity} using our flight search tool`
          },
          {
            "@type": "HowToStep", 
            "name": "Compare Prices",
            "text": "Compare prices across different dates and times to find the best deal"
          },
          {
            "@type": "HowToStep",
            "name": "Select Flight",
            "text": "Choose your preferred flight based on price, time, and convenience"
          },
          {
            "@type": "HowToStep",
            "name": "Book and Pay",
            "text": "Complete your booking and payment to confirm your flight"
          }
        ]
      }} />

      {/* Flight List Schema */}
      <SchemaOrg data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": `${airlineName} Flights from ${departureCity} to ${arrivalCity}`,
        "description": `Available ${airlineName} flights from ${departureCity} (${departureIata}) to ${arrivalCity} (${arrivalIata})`,
        "numberOfItems": normalizedFlights.length,
        "itemListElement": normalizedFlights.map((flight, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Flight",
            "name": `${airlineName} Flight ${flight.airline || 'XX'}${index + 1}`,
            "flightNumber": `${flight.airline || 'XX'}${index + 1}`,
            "departureTime": '09:00',
            "arrivalTime": '11:00',
            "duration": '2h 30m',
            "price": {
              "@type": "PriceSpecification",
              "price": flight.price || 100,
              "priceCurrency": 'USD'
            },
            "departureAirport": {
              "@type": "Airport",
              "name": `${departureCity} Airport`,
              "iataCode": flight.from
            },
            "arrivalAirport": {
              "@type": "Airport",
              "name": `${arrivalCity} Airport`,
              "iataCode": flight.to
            }
          }
        }))
      }} />

      {/* Price Data Schema */}
      <SchemaOrg data={{
        "@context": "https://schema.org",
        "@type": "Dataset",
        "name": `${airlineName} Flight Price Data - ${departureCity} to ${arrivalCity}`,
        "description": `Historical price data for ${airlineName} flights from ${departureCity} to ${arrivalCity}`,
        "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com"}/airlines/${airlineCode}/${params.route}`,
        "creator": {
          "@type": "Organization",
          "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "AirlinesMap"
        },
        "license": "https://creativecommons.org/licenses/by/4.0/",
        "variableMeasured": [
          {
            "@type": "PropertyValue",
            "name": "Weekly Price Average",
            "description": "Average flight prices by day of the week",
            "unitText": "USD"
          },
          {
            "@type": "PropertyValue",
            "name": "Monthly Price Average", 
            "description": "Average flight prices by month",
            "unitText": "USD"
          }
        ],
        "distribution": {
          "@type": "DataDownload",
          "encodingFormat": "application/json",
          "contentUrl": `${process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com"}/api/airlines/${airlineCode}/${params.route}/prices`
        }
      }} />

      {/* Places to Visit Section */}
      {contentData?.places && (
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
            {locale === 'es' ? `Lugares para Visitar en ${arrivalCity}` : 
             locale === 'ru' ? `Места для посещения в ${arrivalCity}` :
             locale === 'fr' ? `Lieux à Visiter à ${arrivalCity}` : 
             `Places to Visit in ${arrivalCity}`}
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
            dangerouslySetInnerHTML={{ __html: contentData.places }}
          />
        </Box>
      )}

      {/* Direct Flights Section */}
      {contentData?.direct_flights && (
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
            {locale === 'es' ? `Vuelos Directos de ${airlineName} ${departureCity} a ${arrivalCity}` : 
             locale === 'ru' ? `Прямые рейсы ${airlineName} ${departureCity} в ${arrivalCity}` :
             locale === 'fr' ? `Vols Directs ${airlineName} ${departureCity} à ${arrivalCity}` : 
             `${airlineName} Direct Flights ${departureCity} to ${arrivalCity}`}
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
            dangerouslySetInnerHTML={{ __html: contentData.direct_flights }}
          />
        </Box>
      )}

      {/* City Overview Section */}
      {arrivalCityData?.overview && (
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
            {locale === 'es' ? `Descripción General de ${arrivalCity}` : 
             locale === 'ru' ? `Обзор ${arrivalCity}` :
             locale === 'fr' ? `Aperçu de ${arrivalCity}` : 
             `Overview of ${arrivalCity}`}
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
            dangerouslySetInnerHTML={{ __html: arrivalCityData.overview }}
          />
        </Box>
      )}

      {/* Best Time to Visit Section */}
      {arrivalCityData?.best_time_to_visit && (
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
            {locale === 'es' ? `Mejor Época para Visitar ${arrivalCity}` : 
             locale === 'ru' ? `Лучшее время для посещения ${arrivalCity}` :
             locale === 'fr' ? `Meilleure Période pour Visiter ${arrivalCity}` : 
             `Best Time to Visit ${arrivalCity}`}
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
            dangerouslySetInnerHTML={{ __html: arrivalCityData.best_time_to_visit }}
          />
        </Box>
      )}

      {/* Peak Season Section */}
      {arrivalCityData?.peak_season && (
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
            {locale === 'es' ? `Temporada Alta en ${arrivalCity}` : 
             locale === 'ru' ? `Пиковый сезон в ${arrivalCity}` :
             locale === 'fr' ? `Haute Saison à ${arrivalCity}` : 
             `Peak Season in ${arrivalCity}`}
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
            dangerouslySetInnerHTML={{ __html: arrivalCityData.peak_season }}
          />
        </Box>
      )}

      {/* Weather Section */}
      {arrivalCityData?.weather && (
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
            {locale === 'es' ? `Clima en ${arrivalCity}` : 
             locale === 'ru' ? `Погода в ${arrivalCity}` :
             locale === 'fr' ? `Météo à ${arrivalCity}` : 
             `Weather in ${arrivalCity}`}
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
            dangerouslySetInnerHTML={{ __html: arrivalCityData.weather }}
          />
        </Box>
      )}

    </Box>
  );
}
