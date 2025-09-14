import { Metadata } from 'next';
import { Box } from '@mui/material';
import { localeFromParam } from '@/lib/i18n';
import { generateHotelCanonicalUrl, generateAlternateUrls } from '@/lib/canonical';
import SchemaOrg from '@/components/SchemaOrg';
import { breadcrumbSchema } from '@/lib/schema';
import { fetchHotelsByAirport } from '@/lib/api';
import DynamicTemplateSelector from '@/app/[locale]/templates/DynamicTemplateSelector';
import { getLanguageId } from '@/lib/translations';

// Function to fetch hotel content from the new API endpoint
async function fetchHotelContent(airportCode: string, langId: 1 | 2) {
  try {
    const response = await fetch(
      `http://34.173.111.243/content/hotels?airport_code=${airportCode}&lang_id=${langId}&domain_id=1`,
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
    console.error('Error fetching hotel content:', error);
    return null;
  }
}

interface HotelsPageProps {
  params: {
    locale: string;
    airportCode: string;
  };
}

export async function generateMetadata({ params }: HotelsPageProps): Promise<Metadata> {
  const { locale, airportCode } = params;
  const validLocale = localeFromParam(locale);
  
  // Extract airport code from the parameter (remove -airport-hotels suffix)
  const extractedAirportCode = airportCode.replace('-airport-hotels', '');
  
  // Generate canonical URL and alternate URLs
  const canonicalUrl = generateHotelCanonicalUrl(extractedAirportCode, validLocale);
  const alternateUrls = generateAlternateUrls(`/hotels/${extractedAirportCode}-airport-hotels`);
  
  let apiData = null;
  let contentData = null;
  
  try {
    [apiData, contentData] = await Promise.all([
      fetchHotelsByAirport(extractedAirportCode, getLanguageId(locale as any) as 1 | 2),
      fetchHotelContent(extractedAirportCode, getLanguageId(locale as any) as 1 | 2)
    ]);
  } catch (error) {
    console.error('Error fetching hotels data for metadata:', error);
  }

  const airportName = apiData?.airport_name || airportCode.replace(/-/g, ' ').toUpperCase();
  const hotelCount = apiData?.hotels_list?.length || 0;
  const metaDescription = contentData?.description || apiData?.meta_description || `Find the best hotels near ${airportName} Airport. ${hotelCount} hotels with great amenities, free shuttle service, and competitive rates. Book your stay today!`;
  
  const title = contentData?.title || apiData?.title || `${airportName} Airport Hotels - ${hotelCount} Hotels Near Airport`;

  return {
    title,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: alternateUrls,
    },
    openGraph: {
      title,
      description: metaDescription,
      url: canonicalUrl,
      siteName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'flightsearchs',
      locale: locale === 'es' ? 'es_ES' : locale === 'ru' ? 'ru_RU' : locale === 'fr' ? 'fr_FR' : 'en_US',
    },
  };
}

export default async function HotelsPage({ params }: HotelsPageProps) {
  const { locale, airportCode } = params;
  const validLocale = localeFromParam(locale);
  
  // Extract airport code from the parameter (remove -airport-hotels suffix)
  const extractedAirportCode = airportCode.replace('-airport-hotels', '');
  
  let apiData = null;
  try {
    apiData = await fetchHotelsByAirport(extractedAirportCode, locale === 'es' ? 2 : 1);
  } catch (error) {
    console.error('Error fetching hotels data:', error);
  }

  // Extract data from API response
  const airportName = apiData?.airport_name || airportCode.replace(/-/g, ' ').toUpperCase();
  const airportCodeFromAPI = apiData?.airport_code || airportCode.toUpperCase();
  let hotelsList = apiData?.hotels_list || [];
  const hotelCount = hotelsList.length;
  const overview = apiData?.overview || `Find the best hotels near ${airportName} Airport with great amenities and competitive rates`;

  // Fallback data when API is not available
  if (!apiData || hotelsList.length === 0) {
    const fallbackHotels = [
      {
        name: `${airportName} Airport Hotel`,
        stars: 4,
        distance_km: 0.5,
        distance_text: '5-10 min taxi',
        address: 'Near Airport Terminal',
        url: '#',
        image: 'https://dummyimage.com/600x400/cccccc/000000&text=Hotel+Image'
      },
      {
        name: `Grand ${airportName} Hotel`,
        stars: 5,
        distance_km: 1.2,
        distance_text: '10-15 min taxi',
        address: 'Airport Area',
        url: '#',
        image: 'https://dummyimage.com/600x400/cccccc/000000&text=Hotel+Image'
      },
      {
        name: `Budget Inn ${airportName}`,
        stars: 3,
        distance_km: 0.8,
        distance_text: '8-12 min taxi',
        address: 'Airport District',
        url: '#',
        image: 'https://dummyimage.com/600x400/cccccc/000000&text=Hotel+Image'
      }
    ];
    hotelsList = fallbackHotels;
  }

  const breadcrumbData = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Hotels', url: '/hotels' },
    { name: `${airportName} Airport Hotels`, url: `/hotels/${airportCode}-hotels` }
  ]);

  return (
    <Box>
      <DynamicTemplateSelector
        locale={validLocale}
        templateType="hotel"
        pageData={apiData}
        params={{ airportCode: extractedAirportCode }}
        onAction={() => {}}
      />

      <SchemaOrg data={breadcrumbData} />
    </Box>
  );
}
