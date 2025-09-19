import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Chip, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, FormGroup, Paper, Collapse } from '@mui/material';
import { localeFromParam } from '@/lib/i18n';
import { generateFlightCanonicalUrl, generateAlternateUrls } from '@/lib/canonical';
import SchemaOrg from '@/components/SchemaOrg';
import { breadcrumbSchema } from '@/lib/schema';
import { fetchFlightContent, fetchFlightData, fetchDestinationFlightContent, fetchDestinationFlightData } from '@/lib/api';
import { normalizeFlights } from '@/lib/flightUtils';
import DynamicTemplateSelector from '@/app/[locale]/templates/DynamicTemplateSelector';
import { getLanguageId, getTranslations } from '@/lib/translations';
import FlightSearchBox from '@/components/FlightSearchBox';
// import FlightListWithFilters from '@/components/FlightListWithFilters';

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
    'IXZ': 'Port Blair'
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

    const title = contentData?.title || `${t.flightPage.flights} ${t.flightPage.from} ${cityName} (${airportCode})`;
    const fullDescription = contentData?.description || `${t.flightPage.findBest} ${t.flightPage.flightDeals} ${t.flightPage.from} ${cityName} ${t.flightPage.to} ${t.flightPage.destinationsWorldwide}.`;
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
    const contentData = await fetchFlightContent(arrivalIata, departureIata, getLanguageId(locale));
    
    return {
      title: contentData?.title || `${t.flightPage.flights} ${t.flightPage.from} ${getCityName(departureIata)} (${departureIata}) ${t.flightPage.to} ${getCityName(arrivalIata)} (${arrivalIata})`,
      description: contentData?.description || `${t.flightPage.findBest} ${t.flightPage.flightDeals} ${t.flightPage.from} ${getCityName(departureIata)} ${t.flightPage.to} ${getCityName(arrivalIata)}. ${t.flightPage.comparePricesBookTrip}.`,
      keywords: contentData?.meta?.keywords?.join(', ') || `flights ${departureIata} ${arrivalIata}, ${getCityName(departureIata)} to ${getCityName(arrivalIata)} flights`,
      alternates: {
        canonical: canonicalUrl,
        languages: alternateUrls,
      },
      openGraph: {
        title: contentData?.title || `${t.flightPage.flights} ${t.flightPage.from} ${getCityName(departureIata)} ${t.flightPage.to} ${getCityName(arrivalIata)}`,
        description: contentData?.description || `${t.flightPage.findBest} ${t.flightPage.flightDeals} ${t.flightPage.from} ${getCityName(departureIata)} ${t.flightPage.to} ${getCityName(arrivalIata)}.`,
        type: 'website',
        url: canonicalUrl,
        siteName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'flightsearchs',
        locale: locale === 'es' ? 'es_ES' : locale === 'ru' ? 'ru_RU' : locale === 'fr' ? 'fr_FR' : 'en_US',
      },
      twitter: {
        card: 'summary',
        title: contentData?.title || `${t.flightPage.flights} ${t.flightPage.from} ${getCityName(departureIata)} ${t.flightPage.to} ${getCityName(arrivalIata)}`,
        description: contentData?.description || `${t.flightPage.findBest} ${t.flightPage.flightDeals} ${t.flightPage.from} ${getCityName(departureIata)} ${t.flightPage.to} ${getCityName(arrivalIata)}.`,
      },
    };
  } catch (error) {
    console.error('Error fetching metadata for flight page:', error);
    return {
      title: `${t.flightPage.flights} ${t.flightPage.from} ${getCityName(departureIata)} (${departureIata}) ${t.flightPage.to} ${getCityName(arrivalIata)} (${arrivalIata})`,
      description: `${t.flightPage.findBest} ${t.flightPage.flightDeals} ${t.flightPage.from} ${getCityName(departureIata)} ${t.flightPage.to} ${getCityName(arrivalIata)}.`,
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
    [contentData, flightData] = await Promise.all([
        fetchDestinationFlightContent(airportCode, getLanguageId(locale) as 1 | 2),
        fetchDestinationFlightData(airportCode)
    ]);
      
      // Normalize the flight data for display
      if (flightData && Array.isArray(flightData)) {
        normalizedFlights = enhanceFlightData(normalizeFlights(flightData));
      }
  } catch (error) {
      console.error('Error fetching airport data:', error);
    }

    // Use the same approach as the from/[airport] page
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
          {/* Hero Section */}
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 700,
              textAlign: { xs: 'center', sm: 'left' },
              mb: 2,
              color: '#1a1a1a'
            }}
          >
            {contentData?.title || `Flights from ${cityName} (${airportCode})`}
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              fontWeight: 400,
              textAlign: { xs: 'center', sm: 'left' },
              mb: 4,
              color: '#666'
            }}
          >
            {contentData?.description || `Discover amazing destinations from ${cityName}. Find the best flight deals and plan your next adventure from ${cityName} to destinations worldwide.`}
          </Typography>

          {/* Flight Search Box */}
          <Box sx={{ mb: 6 }}>
            <FlightSearchBox 
              defaultFrom={{ 
                code: airportCode, 
                name: `${airportCode} - ${cityName}`, 
                city_name: cityName,
                country_name: '',
                country_code: '',
                type: 'airport' as const
              }}
            />
          </Box>

          {/* Price Prediction Cards */}
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
                fontWeight: 700,
                textAlign: 'left',
                mb: 4,
                color: '#1a1a1a'
              }}
            >
{t.flightPage.pricePrediction.replace('{cityName}', cityName)}
            </Typography>
            
            <Grid container spacing={3}>
              {/* Round-trip Card */}
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ 
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e0e0e0',
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': { 
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                    transform: 'translateY(-4px)',
                    transition: 'all 0.3s ease'
                  }
                }}>
                  <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                    <Box sx={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      backgroundColor: '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      color: '#666'
                    }}>
                      i
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 3, pt: 4 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: '#1a1a1a',
                        mb: 2
                      }}
                    >
                      Average price start from:
                    </Typography>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        color: '#10b981',
                        mb: 2,
                        lineHeight: 1
                      }}
                    >
                      ${contentData?.avragefares ? Math.round(contentData.avragefares) : '189'}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#666',
                        mb: 3,
                        fontSize: '0.9rem'
                      }}
                    >
                      Average flight prices from {cityName} {airportCode} to destinations worldwide
                    </Typography>
                    <Button 
                      variant="contained" 
                      fullWidth
                      sx={{ 
                        backgroundColor: '#1e3a8a',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 1.5,
                        '&:hover': {
                          backgroundColor: '#1e40af'
                        }
                      }}
                    >
                      Search Deals
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              {/* One-way Card */}
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ 
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e0e0e0',
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': { 
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                    transform: 'translateY(-4px)',
                    transition: 'all 0.3s ease'
                  }
                }}>
                  <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                    <Box sx={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      backgroundColor: '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      color: '#666'
                    }}>
                      i
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 3, pt: 4 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: '#1a1a1a',
                        mb: 2
                      }}
                    >
{t.flightPage.oneWay}
                    </Typography>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        color: '#1e3a8a',
                        mb: 2,
                        lineHeight: 1
                      }}
                    >
                      ${contentData?.avragefares ? Math.round(contentData.avragefares * 0.45) : '122'}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#666',
                        mb: 3,
                        fontSize: '0.9rem'
                      }}
                    >
{t.flightPage.oneWayFlight.replace('{from}', cityName).replace('{code}', airportCode).replace('{to}', getRandomDestination())}
                    </Typography>
                    <Button 
                      variant="contained" 
                      fullWidth
                      sx={{ 
                        backgroundColor: '#1e3a8a',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 1.5,
                        '&:hover': {
                          backgroundColor: '#1e40af'
                        }
                      }}
                    >
                      Search Deals
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              {/* Cheapest Day Card */}
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ 
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e0e0e0',
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': { 
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                    transform: 'translateY(-4px)',
                    transition: 'all 0.3s ease'
                  }
                }}>
                  <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                    <Box sx={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      backgroundColor: '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      color: '#666'
                    }}>
                      i
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 3, pt: 4 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: '#1a1a1a',
                        mb: 2
                      }}
                    >
{t.flightPage.cheapestDay}
                    </Typography>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        color: '#f59e0b',
                        mb: 2,
                        lineHeight: 1
                      }}
                    >
                      {contentData?.cheapest_day || 'Monday'}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#666',
                        mb: 3,
                        fontSize: '0.9rem'
                      }}
                    >
                      Best day to book flights from {cityName}. Get the lowest prices on this day.
                    </Typography>
                    <Button 
                      variant="contained" 
                      fullWidth
                      sx={{ 
                        backgroundColor: '#1e3a8a',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 1.5,
                        '&:hover': {
                          backgroundColor: '#1e40af'
                        }
                      }}
                    >
                      Find Deals
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              {/* Cheapest In Card */}
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ 
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e0e0e0',
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': { 
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                    transform: 'translateY(-4px)',
                    transition: 'all 0.3s ease'
                  }
                }}>
                  <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                    <Box sx={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      backgroundColor: '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      color: '#666'
                    }}>
                      i
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 3, pt: 4 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: '#1a1a1a',
                        mb: 2
                      }}
                    >
                      Cheapest In:
                    </Typography>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        color: '#10b981',
                        mb: 2,
                        lineHeight: 1
                      }}
                    >
                      {contentData?.cheapest_month ? contentData.cheapest_month.split(' ')[0] : 'January'}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#666',
                        mb: 3,
                        fontSize: '0.9rem'
                      }}
                    >
                      Cheapest prices for flights to {cityName} this month. Find deals now.
                    </Typography>
                    <Button 
                      variant="contained" 
                      fullWidth
                      sx={{ 
                        backgroundColor: '#1e3a8a',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 1.5,
                        '&:hover': {
                          backgroundColor: '#1e40af'
                        }
                      }}
                    >
                      Find Deals
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>


          {/* Available Flights Section */}
          {normalizedFlights && normalizedFlights.length > 0 && (
            <Box sx={{ mb: 6 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
                  fontWeight: 700,
                  textAlign: 'left',
                  mb: 4,
                  color: '#1a1a1a'
                }}
              >
                Flights from {cityName} ({airportCode}) Airport
              </Typography>
              
              {/* Simple Filter Section */}
              <Paper sx={{ p: 3, mb: 4, backgroundColor: '#f8fafc' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1a1a1a' }}>
                  Filter Flights
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControlLabel
                      control={<Checkbox sx={{ color: '#1e3a8a' }} />}
                      label="Direct flights only"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Stops</InputLabel>
                      <Select
                        defaultValue="all"
                        label="Stops"
                        sx={{ backgroundColor: 'white' }}
                      >
                        <MenuItem value="all">All stops</MenuItem>
                        <MenuItem value="0">Non-stop</MenuItem>
                        <MenuItem value="1">1 {t.flightPage.stop}</MenuItem>
                        <MenuItem value="2+">2+ {t.flightPage.stops}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Sort by</InputLabel>
                      <Select
                        defaultValue="price"
                        label="Sort by"
                        sx={{ backgroundColor: 'white' }}
                      >
                        <MenuItem value="price">Price</MenuItem>
                        <MenuItem value="duration">Duration</MenuItem>
                        <MenuItem value="airline">Airline</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ 
                        borderColor: '#1e3a8a',
                        color: '#1e3a8a',
                        '&:hover': {
                          borderColor: '#1e40af',
                          backgroundColor: '#f1f5f9'
                        }
                      }}
                    >
                      Clear Filters
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
              
              <Grid container spacing={3}>
                {normalizedFlights.slice(0, 12).map((flight: any, index: number) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
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
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                            {flight.from} → {flight.to}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {flight.isDirect && (
                              <Chip 
                                label="Direct"
                                size="small"
                                sx={{ 
                                  backgroundColor: '#10b981',
                                  color: 'white',
                                  fontSize: '0.7rem'
                                }}
                              />
                            )}
                            <Chip 
                              label={flight.flightsPerDay || 'Multiple flights'}
                              size="small"
                              sx={{ 
                                backgroundColor: '#1e3a8a',
                                color: 'white',
                                fontSize: '0.7rem'
                              }}
                            />
                          </Box>
                        </Box>
                        
                        <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                          {getCityName(flight.from)} to {flight.city}
                        </Typography>
                        
                        <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                          {flight.city} • {flight.duration} {t.flightPage.avg}
                          {flight.stops !== undefined && (
                            <span> • {flight.stops === 0 ? 'Non-stop' : `${flight.stops} ${flight.stops > 1 ? t.flightPage.stops : t.flightPage.stop}`}</span>
                          )}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
{t.flightPage.from} {flight.price}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            {flight.flightsPerWeek} {t.flightPage.flightsPerWeek}
                          </Typography>
                        </Box>

                        {/* Airlines */}
                        {flight.airline && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
{t.flightPage.airline} {flight.airline}
                            </Typography>
                          </Box>
                        )}
                        
                        <Button 
                          variant="contained" 
                          size="small"
                          fullWidth
                          sx={{ 
                            backgroundColor: '#10b981',
                            '&:hover': { backgroundColor: '#059669' },
                            textTransform: 'none',
                            fontSize: '0.8rem'
                          }}
                          href={`/flights/${flight.from.toLowerCase()}-${flight.to.toLowerCase()}`}
                        >
{t.flightPage.viewFlights}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Price Trends & Analysis */}
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
                fontWeight: 700,
                textAlign: 'left',
                mb: 4,
                color: '#1a1a1a'
              }}
            >
{t.flightPage.priceTrends}
            </Typography>
            
            <Grid container spacing={3}>
              {/* Weekly Price Trends */}
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e0e0e0',
                  height: '100%'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ 
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      mb: 2,
                      color: '#1a1a1a'
                    }}>
{t.flightPage.weeklyTrends}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#666',
                        mb: 3,
                        fontSize: '0.9rem',
                        lineHeight: 1.5
                      }}
                      dangerouslySetInnerHTML={{ 
                        __html: contentData?.weekly_fares_graph?.paragraph || 
                        `If your flying dates are flexible, consider flying to ${cityName} on a Tuesday.`
                      }}
                    />
                    
                    {/* Simple Bar Chart for Weekly Data */}
                    <Box sx={{ height: 200, display: 'flex', alignItems: 'end', gap: 1, px: 1 }}>
                      {Array.isArray(contentData?.weekly_fares_graph?.data) && contentData.weekly_fares_graph.data.length > 0 ? contentData.weekly_fares_graph.data.map((item: any, index: number) => {
                        const maxValue = Math.max(...(contentData?.weekly_fares_graph?.data?.map((d: any) => d.avg_fare) || [100]));
                        const height = (item.avg_fare / maxValue) * 150;
                        const isLowest = item.avg_fare === Math.min(...(contentData?.weekly_fares_graph?.data?.map((d: any) => d.avg_fare) || [100]));
                        
                        return (
                          <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box sx={{ 
                              width: '100%',
                              height: `${height}px`,
                              backgroundColor: isLowest ? '#10b981' : '#e5e7eb',
                              borderRadius: '4px 4px 0 0',
                              mb: 1,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                backgroundColor: isLowest ? '#059669' : '#d1d5db'
                              }
                            }} />
                            <Typography variant="caption" sx={{ 
                              fontSize: '0.7rem',
                              color: '#666',
                              textAlign: 'center',
                              transform: 'rotate(-45deg)',
                              transformOrigin: 'center',
                              whiteSpace: 'nowrap'
                            }}>
                              {item.day?.substring(0, 3)}
                            </Typography>
                            <Typography variant="caption" sx={{ 
                              fontSize: '0.7rem',
                              color: '#1a1a1a',
                              fontWeight: 600,
                              mt: 0.5
                            }}>
                              ${item.avg_fare}
                            </Typography>
                          </Box>
                        );
                      }) || (
                        // Fallback data if API doesn't provide weekly_fares_graph
                        ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                          const values = [75, 65, 70, 68, 78, 85, 82];
                          const height = (values[index] / 85) * 150;
                          const isLowest = values[index] === 65;
                          
                          return (
                            <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <Box sx={{ 
                                width: '100%',
                                height: `${height}px`,
                                backgroundColor: isLowest ? '#10b981' : '#e5e7eb',
                                borderRadius: '4px 4px 0 0',
                                mb: 1
                              }} />
                              <Typography variant="caption" sx={{ 
                                fontSize: '0.7rem',
                                color: '#666',
                                textAlign: 'center',
                                transform: 'rotate(-45deg)',
                                transformOrigin: 'center',
                                whiteSpace: 'nowrap'
                              }}>
                                {day}
                              </Typography>
                              <Typography variant="caption" sx={{ 
                                fontSize: '0.7rem',
                                color: '#1a1a1a',
                                fontWeight: 600,
                                mt: 0.5
                              }}>
                                ${values[index]}
                              </Typography>
                            </Box>
                          );
                        })
                      ) : null}
                    </Box>
                    
                    <Typography variant="caption" sx={{ 
                      color: '#666',
                      fontSize: '0.75rem',
                      textAlign: 'center',
                      display: 'block',
                      mt: 2
                    }}>
                      Price (USD)
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Monthly Price Trends */}
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e0e0e0',
                  height: '100%'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ 
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      mb: 2,
                      color: '#1a1a1a'
                    }}>
{t.flightPage.monthlyTrends}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#666',
                        mb: 3,
                        fontSize: '0.9rem',
                        lineHeight: 1.5
                      }}
                      dangerouslySetInnerHTML={{ 
                        __html: contentData?.monthly_fares_graph?.paragraph || 
                        `The cheapest month for flights from ${cityName} is September.`
                      }}
                    />
                    
                    {/* Simple Bar Chart for Monthly Data */}
                    <Box sx={{ height: 200, display: 'flex', alignItems: 'end', gap: 0.5, px: 1 }}>
                      {Array.isArray(contentData?.monthly_fares_graph?.data) && contentData.monthly_fares_graph.data.length > 0 ? contentData.monthly_fares_graph.data.map((item: any, index: number) => {
                        const maxValue = Math.max(...(contentData?.monthly_fares_graph?.data?.map((d: any) => d.avg_fare) || [100]));
                        const height = (item.avg_fare / maxValue) * 150;
                        const isLowest = item.avg_fare === Math.min(...(contentData?.monthly_fares_graph?.data?.map((d: any) => d.avg_fare) || [100]));
                        
                        return (
                          <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box sx={{ 
                              width: '100%',
                              height: `${height}px`,
                              backgroundColor: isLowest ? '#10b981' : '#e5e7eb',
                              borderRadius: '4px 4px 0 0',
                              mb: 1,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                backgroundColor: isLowest ? '#059669' : '#d1d5db'
                              }
                            }} />
                            <Typography variant="caption" sx={{ 
                              fontSize: '0.6rem',
                              color: '#666',
                              textAlign: 'center',
                              transform: 'rotate(-45deg)',
                              transformOrigin: 'center',
                              whiteSpace: 'nowrap'
                            }}>
                              {item.month?.substring(0, 3)}
                            </Typography>
                            <Typography variant="caption" sx={{ 
                              fontSize: '0.6rem',
                              color: '#1a1a1a',
                              fontWeight: 600,
                              mt: 0.5
                            }}>
                              ${item.avg_fare}
                            </Typography>
                          </Box>
                        );
                      }) || (
                        // Fallback data if API doesn't provide monthly_fares_graph
                        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => {
                          const values = [150, 140, 160, 170, 165, 180, 190, 185, 120, 160, 155, 170];
                          const height = (values[index] / 190) * 150;
                          const isLowest = values[index] === 120;
                          
                          return (
                            <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <Box sx={{ 
                                width: '100%',
                                height: `${height}px`,
                                backgroundColor: isLowest ? '#10b981' : '#e5e7eb',
                                borderRadius: '4px 4px 0 0',
                                mb: 1
                              }} />
                              <Typography variant="caption" sx={{ 
                                fontSize: '0.6rem',
                                color: '#666',
                                textAlign: 'center',
                                transform: 'rotate(-45deg)',
                                transformOrigin: 'center',
                                whiteSpace: 'nowrap'
                              }}>
                                {month}
                              </Typography>
                              <Typography variant="caption" sx={{ 
                                fontSize: '0.6rem',
                                color: '#1a1a1a',
                                fontWeight: 600,
                                mt: 0.5
                              }}>
                                ${values[index]}
                              </Typography>
                            </Box>
                          );
                        })
                      ) : null}
                    </Box>
                    
                    <Typography variant="caption" sx={{ 
                      color: '#666',
                      fontSize: '0.75rem',
                      textAlign: 'center',
                      display: 'block',
                      mt: 2
                    }}>
                      Price (USD)
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Destinations Section */}
          {contentData?.destinations && (
            <Box sx={{ mb: 6 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
                  fontWeight: 700,
                  textAlign: 'left',
                  mb: 4,
                  color: '#1a1a1a'
                }}
              >
{t.flightPage.popularDestinations}
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#666',
                  mb: 4,
                  fontSize: '1rem',
                  lineHeight: 1.6
                }}
                dangerouslySetInnerHTML={{ 
                  __html: contentData.destinations
                }}
              />
              
              {contentData?.destinations_links && (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#666',
                    fontSize: '1rem',
                    lineHeight: 1.6
                  }}
                  dangerouslySetInnerHTML={{ 
                    __html: contentData.destinations_links
                  }}
                />
              )}
            </Box>
          )}

          {/* Places to Visit Section */}
          {contentData?.places_to_visit && (
            <Box sx={{ mb: 6 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
                  fontWeight: 700,
                  textAlign: 'left',
                  mb: 4,
                  color: '#1a1a1a'
                }}
              >
                Places to Visit
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#666',
                  fontSize: '1rem',
                  lineHeight: 1.6
                }}
                dangerouslySetInnerHTML={{ 
                  __html: contentData.places_to_visit
                }}
              />
            </Box>
          )}

          {/* Airlines Section */}
          {contentData?.airlines && (
            <Box sx={{ mb: 6 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
                  fontWeight: 700,
                  textAlign: 'left',
                  mb: 4,
                  color: '#1a1a1a'
                }}
              >
{t.flightPage.airlines}
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#666',
                  fontSize: '1rem',
                  lineHeight: 1.6
                }}
                dangerouslySetInnerHTML={{ 
                  __html: contentData.airlines
                }}
              />
            </Box>
          )}

          {/* FAQs Section */}
          {contentData?.faqs && Array.isArray(contentData.faqs) && contentData.faqs.length > 0 && (
            <Box sx={{ mb: 6 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
                  fontWeight: 700,
                  textAlign: 'left',
                  mb: 4,
                  color: '#1a1a1a'
                }}
              >
{t.flightPage.faqs}
              </Typography>
              
              {contentData.faqs.map((faq: any, index: number) => (
                <Box key={index} sx={{ mb: 3 }}>
                  {/* Display FAQ question if available */}
                  {(faq.q || faq.question) && (
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: '#1a1a1a',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        mb: 1
                      }}
                      dangerouslySetInnerHTML={{ 
                        __html: faq.q || faq.question
                      }}
                    />
                  )}
                  
                  {/* Display FAQ answer if available */}
                  {(faq.a || faq.answer) && (
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: '#666',
                        fontSize: '1rem',
                        lineHeight: 1.6
                      }}
                      dangerouslySetInnerHTML={{ 
                        __html: faq.a || faq.answer
                      }}
                    />
                  )}
                  
                  {/* Fallback: if faq is a string or has content property */}
                  {!faq.q && !faq.question && !faq.a && !faq.answer && (
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: '#666',
                        fontSize: '1rem',
                        lineHeight: 1.6
                      }}
                      dangerouslySetInnerHTML={{ 
                        __html: typeof faq === 'string' ? faq : (faq.content || faq.text || JSON.stringify(faq))
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Container>
        
        <SchemaOrg data={breadcrumbSchema([
          { name: 'Home', url: locale === 'es' ? '/es' : '/' },
          { name: 'Flights', url: (locale === 'es' ? '/es' : '') + '/flights' },
          { name: `Flights from ${cityName}`, url: (locale === 'es' ? '/es' : '') + `/flights/${params.slug}` },
        ])} />

        {/* FAQ Schema */}
        {contentData?.faqs && Array.isArray(contentData.faqs) && contentData.faqs.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": contentData.faqs.map((faq: any) => ({
                  "@type": "Question",
                  "name": faq.q || faq.question || "",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a || faq.answer || ""
                  }
                }))
              })
            }}
          />
        )}

        {/* Flight Product Schema */}
        {normalizedFlights && normalizedFlights.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                "name": `Flights from ${cityName} (${airportCode})`,
                "description": contentData?.description || `Find the best flights from ${cityName} to various destinations worldwide.`,
                "brand": {
                  "@type": "Brand",
                  "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "airlinesmap.com"
                },
                "offers": {
                  "@type": "AggregateOffer",
                  "priceCurrency": "USD",
                  "lowPrice": Math.min(...normalizedFlights.map((f: any) => parseFloat(f.price?.replace('$', '') || '0') || 0)),
                  "highPrice": Math.max(...normalizedFlights.map((f: any) => parseFloat(f.price?.replace('$', '') || '0') || 0)),
                  "offerCount": normalizedFlights.length,
                  "offers": normalizedFlights.slice(0, 10).map((flight: any) => ({
                    "@type": "Offer",
                    "price": flight.price?.replace('$', '') || "0",
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock",
                    "seller": {
                      "@type": "Organization",
                      "name": flight.airline || "Airline"
                    },
                    "description": `Flight from ${flight.from} to ${flight.to}`,
                    "validFrom": new Date().toISOString().split('T')[0],
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
                  }))
                },
                "category": "Flight",
                "additionalProperty": [
                  {
                    "@type": "PropertyValue",
                    "name": "Airport Code",
                    "value": airportCode
                  },
                  {
                    "@type": "PropertyValue", 
                    "name": "City",
                    "value": cityName
                  },
                  {
                    "@type": "PropertyValue",
                    "name": "Total Destinations",
                    "value": normalizedFlights.length
                  }
                ]
              })
            }}
          />
        )}

      {/* Flight Search Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "airlinesmap.com",
            "url": process.env.NEXT_PUBLIC_DOMAIN || "https://airlinesmap.com",
            "description": contentData?.description || `Find the best flight deals from ${departureCity} to ${arrivalCity}`,
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com'}/search?q={search_term_string}`
              },
              "query-input": "required name=search_term_string"
            },
            "mainEntity": {
              "@type": "ItemList",
              "name": `Flights from ${departureCity} to ${arrivalCity}`,
              "description": contentData?.description || `Available flights from ${departureCity} to ${arrivalCity}`,
              "numberOfItems": flightData?.oneway_flights?.length || 0,
              "itemListElement": (flightData?.oneway_flights || []).slice(0, 5).map((flight: any, index: number) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Flight",
                  "name": `${flight.airline || 'Airline'} Flight`,
                  "description": `One-way flight from ${departureCity} to ${arrivalCity}`,
                  "price": flight.price || "0",
                  "priceCurrency": "USD"
                }
              }))
            }
          })
        }}
      />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "airlinesmap.com",
              "url": process.env.NEXT_PUBLIC_DOMAIN || "https://airlinesmap.com",
              "logo": `${process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com'}/logo.png`,
              "description": contentData?.company_description || "Find the best flight deals and travel information worldwide",
              "sameAs": [
                process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://www.facebook.com/flightsearchs",
                process.env.NEXT_PUBLIC_TWITTER_URL || "https://www.twitter.com/flightsearchs",
                process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/flightsearchs"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": process.env.NEXT_PUBLIC_PHONE || "+1-800-FLIGHTS",
                "contactType": "customer service",
                "availableLanguage": process.env.NEXT_PUBLIC_LANGUAGES?.split(',') || ["English", "Spanish", "French", "Russian"]
              }
            })
          }}
        />

        {/* Airport Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Airport",
              "name": `${cityName} Airport`,
              "iataCode": airportCode,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": cityName,
                "addressCountry": contentData?.country || "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": contentData?.latitude || contentData?.lat || contentData?.airport?.latitude || contentData?.airport?.lat || "28.5562",
                "longitude": contentData?.longitude || contentData?.lng || contentData?.airport?.longitude || contentData?.airport?.lng || "77.1000"
              }
            })
          }}
        />

        {/* WebPage Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": contentData?.title || `Flights from ${cityName} (${airportCode})`,
              "description": contentData?.description || `Find the best flights from ${cityName} to various destinations worldwide.`,
              "url": `${process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com'}/flights/${params.slug}`,
              "isPartOf": {
                "@type": "WebSite",
                "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "airlinesmap.com",
                "url": process.env.NEXT_PUBLIC_DOMAIN || "https://airlinesmap.com"
              },
              "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": process.env.NEXT_PUBLIC_DOMAIN || "https://airlinesmap.com"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Flights",
                    "item": `${process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com'}/flights`
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": `Flights from ${cityName}`,
                    "item": `${process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com'}/flights/${params.slug}`
                  }
                ]
              },
              "mainEntity": {
                "@type": "Airport",
                "name": `${cityName} Airport`,
                "iataCode": airportCode
              }
            })
          }}
        />

        {/* TravelAgency Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "airlinesmap.com",
              "url": process.env.NEXT_PUBLIC_DOMAIN || "https://airlinesmap.com",
              "description": contentData?.travel_agency_description || "Your trusted partner for finding the best flight deals and travel information",
              "areaServed": contentData?.area_served || "Worldwide",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": contentData?.catalog_name || "Flight Services",
                "itemListElement": normalizedFlights?.slice(0, 5).map((flight: any, index: number) => ({
                  "@type": "Offer",
                  "name": `Flight from ${flight.from} to ${flight.to}`,
                  "description": `One-way flight from ${getCityName(flight.from)} to ${flight.city}`,
                  "price": flight.price?.replace('$', '') || "0",
                  "priceCurrency": "USD",
                  "availability": "https://schema.org/InStock",
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
              }
            })
          }}
        />

      {/* Flight Route Schema */}
      {flightData && (
        <SchemaOrg data={{
          "@context": "https://schema.org",
          "@type": "FlightReservation",
          "reservationId": `FLIGHT-${departureIata}-${arrivalIata}-${Date.now()}`,
          "reservationStatus": "https://schema.org/ReservationConfirmed",
          "underName": {
            "@type": "Person",
            "name": "Passenger"
          },
          "reservationFor": {
            "@type": "Flight",
            "flightNumber": `${flightData.oneway_flights?.[0]?.airline_iata || 'AI'}${Math.floor(Math.random() * 1000)}`,
            "provider": {
              "@type": "Airline",
              "name": flightData.oneway_flights?.[0]?.airline || "Airline",
              "iataCode": flightData.oneway_flights?.[0]?.airline_iata || "AI"
            },
            "departureAirport": {
              "@type": "Airport",
              "name": `${departureIata} Airport`,
              "iataCode": departureIata,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": departureCity
              }
            },
            "arrivalAirport": {
              "@type": "Airport",
              "name": `${arrivalIata} Airport`,
              "iataCode": arrivalIata,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": arrivalCity
              }
            },
            "estimatedFlightDuration": flightData.oneway_flights?.[0]?.duration || "N/A"
          },
          "totalPrice": flightData.oneway_flights?.[0]?.price || "0",
          "priceCurrency": "USD"
        }} />
      )}

      {/* Individual Flight Schemas */}
      {normalizedFlights && normalizedFlights.length > 0 && normalizedFlights.map((flight: any, index: number) => {
          // Get coordinates from API data or flight data
          const getAirportCoordinates = (airportCode: string, flightData: any) => {
            // Try to get coordinates from flight data first (check various possible structures)
            if (flightData?.departureAirport?.latitude && flightData?.departureAirport?.longitude && flightData?.departureAirport?.iataCode === airportCode) {
              return { lat: flightData.departureAirport.latitude, lng: flightData.departureAirport.longitude };
            }
            if (flightData?.arrivalAirport?.latitude && flightData?.arrivalAirport?.longitude && flightData?.arrivalAirport?.iataCode === airportCode) {
              return { lat: flightData.arrivalAirport.latitude, lng: flightData.arrivalAirport.longitude };
            }
            
            // Check if coordinates are in the route data
            if (flightData?.lat && flightData?.lng) {
              return { lat: flightData.lat, lng: flightData.lng };
            }
            if (flightData?.latitude && flightData?.longitude) {
              return { lat: flightData.latitude, lng: flightData.longitude };
            }
            
            // Check if coordinates are in airport data
            if (flightData?.airport?.lat && flightData?.airport?.lng) {
              return { lat: flightData.airport.lat, lng: flightData.airport.lng };
            }
            if (flightData?.airport?.latitude && flightData?.airport?.longitude) {
              return { lat: flightData.airport.latitude, lng: flightData.airport.longitude };
            }
            
            // Fallback to contentData coordinates
            if (contentData?.latitude && contentData?.longitude) {
              return { lat: contentData.latitude, lng: contentData.longitude };
            }
            if (contentData?.lat && contentData?.lng) {
              return { lat: contentData.lat, lng: contentData.lng };
            }
            
            // Final fallback
            return { lat: 28.5562, lng: 77.1000 };
          };

          const departureCoords = getAirportCoordinates(flight.from, flight);
          const arrivalCoords = getAirportCoordinates(flight.to, flight);

          return (
            <script
              key={`flight-${index}`}
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@type": "Flight",
                  "@context": "http://schema.org",
                  "estimatedFlightDuration": flight.duration || "N/A",
                  "departureTime": flight.departureTime || "6:10 am",
                  "departureAirport": {
                    "@type": "Airport",
                    "name": `${getCityName(flight.from)} Airport`,
                    "iataCode": flight.from,
                    "geo": {
                      "@type": "GeoCoordinates",
                      "latitude": departureCoords.lat,
                      "longitude": departureCoords.lng
                    }
                  },
                  "arrivalAirport": {
                    "@type": "Airport",
                    "name": `${flight.city} Airport`,
                    "iataCode": flight.to,
                    "geo": {
                      "@type": "GeoCoordinates",
                      "latitude": arrivalCoords.lat,
                      "longitude": arrivalCoords.lng
                    }
                  },
                  "image": [
                    `${process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com'}/images/flights/${flight.from}-${flight.to}.jpg`,
                    `${process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com'}/images/flights/generic-flight.jpg`
                  ],
                  "offers": [{
                    "@type": "Offer",
                    "price": parseInt(flight.price?.replace('$', '') || '0'),
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
                    "name": flight.airline || "Airline",
                    "iataCode": flight.airline?.substring(0, 2).toUpperCase() || "AL"
                  }
                })
              }}
            />
          );
        })}
      </Box>
    );
  }
  
  // departureIata, arrivalIata, departureCity, arrivalCity already declared above
  
  // Fetch content and flight data
  let contentData = null;
  let flightData = null;
  
  try {
    [contentData, flightData] = await Promise.all([
      fetchFlightContent(arrivalIata, departureIata, getLanguageId(locale)),
      fetchFlightData(arrivalIata, departureIata)
    ]);
  } catch (error) {
    console.error('Error fetching flight data:', error);
  }

  // Normalize flight data for consistent display
  let normalizedFlights: any[] = [];
  if (flightData && flightData.oneway_flights && Array.isArray(flightData.oneway_flights)) {
    normalizedFlights = enhanceFlightData(flightData.oneway_flights.map((flight: any) => ({
      from: flight.iata_from || departureIata,
      to: flight.iata_to || arrivalIata,
      city: arrivalCity,
      duration: flight.duration || `${Math.floor(Math.random() * 3) + 1}h ${Math.floor(Math.random() * 60)}m`,
      price: `$${flight.price || Math.floor(Math.random() * 500) + 100}`,
      flightsPerDay: 'Multiple flights',
      flightsPerWeek: Math.floor(Math.random() * 20) + 10,
      airline: flight.airline || 'Unknown Airline',
      carrier: flight.airline_iata || 'XX',
      isDirect: Math.random() > 0.3, // 70% direct flights
      stops: Math.random() > 0.3 ? 0 : Math.floor(Math.random() * 2) + 1
    })));
  }

  // Combine content and flight data for the template
  const combinedPageData = {
    ...contentData,
    ...flightData,
    departureIata,
    arrivalIata,
    departureCity,
    arrivalCity,
    normalizedFlights
  };

  // Determine template type based on whether it's a single airport or route pair
  // Single codes (like aad, hyd) use airport template, route pairs (like lax-was) use flight template
  const templateType = arrivalIata ? "flight" : "airport";
  

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      <DynamicTemplateSelector
        locale={locale}
        templateType={templateType}
        pageData={combinedPageData}
        params={{ departureIata, arrivalIata }}
        onAction={() => {}}
      />
      
      <SchemaOrg data={breadcrumbSchema([
        { name: 'Home', url: locale === 'es' ? '/es' : '/' },
        { name: 'Flights', url: (locale === 'es' ? '/es' : '') + '/flights' },
        { name: `${departureIata}-${arrivalIata}`, url: (locale === 'es' ? '/es' : '') + `/flights/${params.slug}` },
      ])} />

      {/* Flight Product Schema */}
      {flightData && (
        <SchemaOrg data={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": contentData?.title || `Flights from ${departureCity} to ${arrivalCity}`,
          "description": contentData?.description || `Find cheap flights from ${departureCity} to ${arrivalCity}`,
          "image": [
            `${process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com'}/images/flights/${departureIata}-${arrivalIata}.jpg`,
            `${process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com'}/images/flights/generic-flight.jpg`
          ],
          "brand": {
            "@type": "Brand",
            "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "airlinesmap.com"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.3",
            "reviewCount": "127"
          },
          "offers": flightData.oneway_flights?.slice(0, 5).map((flight: any) => ({
            "@type": "Offer",
            "price": flight.price || "0",
            "priceCurrency": flight.currency || "USD",
            "availability": "https://schema.org/InStock",
            "seller": {
              "@type": "Organization",
              "name": flight.airline || "Unknown Airline"
            },
            "validFrom": flight.iso_date || new Date().toISOString(),
            "description": `${flight.airline || 'Unknown'} flight from ${flight.iata_from || ''} to ${flight.iata_to || ''}`,
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
      {flightData && (
        <SchemaOrg data={{
          "@context": "https://schema.org",
          "@type": "Flight",
          "flightNumber": `${flightData.oneway_flights?.[0]?.airline_iata || 'AI'}${Math.floor(Math.random() * 1000)}`,
          "provider": {
            "@type": "Airline",
            "name": flightData.oneway_flights?.[0]?.airline || "Airline",
            "iataCode": flightData.oneway_flights?.[0]?.airline_iata || "AI"
          },
          "departureAirport": {
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
              "latitude": contentData?.departure_latitude || contentData?.departure_lat || contentData?.latitude || contentData?.lat || "28.5562",
              "longitude": contentData?.departure_longitude || contentData?.departure_lng || contentData?.longitude || contentData?.lng || "77.1000"
            }
          },
          "arrivalAirport": {
            "@type": "Airport",
            "name": `${arrivalIata} Airport`,
            "iataCode": arrivalIata,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": arrivalCity,
              "addressCountry": contentData?.arrival_country || contentData?.country || "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": contentData?.arrival_latitude || contentData?.arrival_lat || contentData?.latitude || contentData?.lat || "28.5562",
              "longitude": contentData?.arrival_longitude || contentData?.arrival_lng || contentData?.longitude || contentData?.lng || "77.1000"
            }
          },
          "departureTime": flightData.oneway_flights?.[0]?.iso_date ? `${flightData.oneway_flights[0].iso_date}T${(flightData.oneway_flights[0].departure_time || '').replace(' ', '')}` : undefined,
          "arrivalTime": flightData.oneway_flights?.[0]?.iso_date ? `${flightData.oneway_flights[0].iso_date}T${(flightData.oneway_flights[0].arrival_time || '').replace(' ', '')}` : undefined,
          "flightDistance": contentData?.flight_distance || "1200"
        }} />
      )}

      {/* Flight Offers Schema */}
      {flightData && flightData.oneway_flights && (
        <SchemaOrg data={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": contentData?.title || `One-way flights from ${departureCity} to ${arrivalCity}`,
          "description": contentData?.description || `Cheapest one-way flights from ${departureCity} (${departureIata}) to ${arrivalCity} (${arrivalIata})`,
          "category": "Flight",
          "brand": {
            "@type": "Brand",
            "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "airlinesmap.com"
          },
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "USD",
            "lowPrice": Math.min(...flightData.oneway_flights.map((f: any) => parseFloat(f.price) || 0)),
            "highPrice": Math.max(...flightData.oneway_flights.map((f: any) => parseFloat(f.price) || 0)),
            "offerCount": flightData.oneway_flights.length,
            "offers": flightData.oneway_flights.slice(0, 10).map((flight: any) => ({
              "@type": "Offer",
              "price": flight.price || "0",
              "priceCurrency": flight.currency || "USD",
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": flight.airline || "Unknown Airline"
              },
              "validFrom": flight.iso_date || new Date().toISOString(),
              "description": `${flight.airline || 'Unknown'} one-way flight`,
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
            }))
          }
        }} />
      )}

      {/* FAQ Schema */}
      <SchemaOrg data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": contentData?.faqs?.map((faq: any) => ({
          "@type": "Question",
          "name": faq.question?.replace(/<[^>]*>/g, '') || '',
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer?.replace(/<[^>]*>/g, '') || ''
          }
        })) || [
          {
            "@type": "Question",
            "name": `How long is the flight from ${departureCity} to ${arrivalCity}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": contentData?.flight_duration || `Non-stop flights average about 2-3 hours, covering a distance of approximately 1,200 miles (1,900 km).`
            }
          },
          {
            "@type": "Question",
            "name": `Which airport should I fly into in ${arrivalCity}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": contentData?.airport_recommendation || `The main airport is ${arrivalIata}, which is closest to downtown and handles most domestic flights.`
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
            "name": `What is the best time to book flights from ${departureCity} to ${arrivalCity}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": contentData?.best_day_to_book || `Booking around 3-6 weeks in advance and flying mid-week (Tuesday or Wednesday) can help you find the cheapest fares.`
            }
          },
          {
            "@type": "Question",
            "name": `How to find cheap flights from ${departureCity} to ${arrivalCity}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": contentData?.how_to_find_cheap_flights || `Use fare comparison tools, set price alerts, consider nearby airports, and be flexible with your travel dates to secure the lowest fares.`
            }
          }
        ]
      }} />

      {/* Travel Agency Schema */}
      <SchemaOrg data={{
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "airlinesmap.com",
        "description": contentData?.travel_agency_description || "Find cheap flights, hotels, and travel deals",
        "url": process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com',
        "logo": `${process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com'}${process.env.NEXT_PUBLIC_LOGO_URL || "/logo.png"}`,
        "address": {
          "@type": "PostalAddress",
          "addressCountry": contentData?.company_country || "US"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "telephone": process.env.NEXT_PUBLIC_PHONE_NUMBER || "+1-800-FLIGHTS",
          "availableLanguage": process.env.NEXT_PUBLIC_LANGUAGES?.split(',') || ["English", "Spanish"]
        },
        "sameAs": [
          process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://www.facebook.com/flightsearchs",
          process.env.NEXT_PUBLIC_TWITTER_URL || "https://www.twitter.com/flightsearchs",
          process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/flightsearchs",
          process.env.NEXT_PUBLIC_PINTEREST_URL || "https://www.pinterest.com/flightsearchs",
          process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://www.youtube.com/flightsearchs"
        ]
      }} />

      {/* WebPage Schema */}
      <SchemaOrg data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": contentData?.title || `Flights from ${departureCity} (${departureIata}) to ${arrivalCity} (${arrivalIata})`,
        "description": contentData?.description || `Find cheap flights from ${departureCity} to ${arrivalCity}`,
        "url": `${process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com'}/flights/${params.slug}`,
        "isPartOf": {
          "@type": "WebSite",
          "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "airlinesmap.com",
          "url": process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com'
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com'
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Flights",
              "item": `${process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com'}/flights`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": `${departureIata}-${arrivalIata}`.toUpperCase(),
              "item": `${process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com'}/flights/${params.slug}`
            }
          ]
        },
        "mainEntity": {
          "@type": "Flight",
          "departureAirport": {
            "@type": "Airport",
            "iataCode": departureIata,
            "name": `${departureIata} Airport`
          },
          "arrivalAirport": {
            "@type": "Airport",
            "iataCode": arrivalIata,
            "name": `${arrivalIata} Airport`
          }
        }
      }} />

      {/* LocalBusiness Schema for Airport */}
      <SchemaOrg data={{
        "@context": "https://schema.org",
        "@type": "Airport",
        "name": `${arrivalIata} Airport`,
        "iataCode": arrivalIata,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": arrivalCity,
          "addressCountry": contentData?.country || "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": contentData?.latitude || contentData?.lat || contentData?.airport?.latitude || contentData?.airport?.lat || "28.5562",
          "longitude": contentData?.longitude || contentData?.lng || contentData?.airport?.longitude || contentData?.airport?.lng || "77.1000"
        }
      }} />

      {/* Individual Flight Schemas - Same as single airport pages */}
      {normalizedFlights && normalizedFlights.length > 0 && normalizedFlights.map((flight: any, index: number) => {
        // Get coordinates from API data or flight data
        const getAirportCoordinates = (airportCode: string, flightData: any) => {
          // Try to get coordinates from flight data first (check various possible structures)
          if (flightData?.departureAirport?.latitude && flightData?.departureAirport?.longitude && flightData?.departureAirport?.iataCode === airportCode) {
            return { lat: flightData.departureAirport.latitude, lng: flightData.departureAirport.longitude };
          }
          if (flightData?.arrivalAirport?.latitude && flightData?.arrivalAirport?.longitude && flightData?.arrivalAirport?.iataCode === airportCode) {
            return { lat: flightData.arrivalAirport.latitude, lng: flightData.arrivalAirport.longitude };
          }
          
          // Check if coordinates are in the route data
          if (flightData?.lat && flightData?.lng) {
            return { lat: flightData.lat, lng: flightData.lng };
          }
          if (flightData?.latitude && flightData?.longitude) {
            return { lat: flightData.latitude, lng: flightData.longitude };
          }
          
          // Check if coordinates are in airport data
          if (flightData?.airport?.lat && flightData?.airport?.lng) {
            return { lat: flightData.airport.lat, lng: flightData.airport.lng };
          }
          if (flightData?.airport?.latitude && flightData?.airport?.longitude) {
            return { lat: flightData.airport.latitude, lng: flightData.airport.longitude };
          }
          
          // Fallback to contentData coordinates
          if (contentData?.latitude && contentData?.longitude) {
            return { lat: contentData.latitude, lng: contentData.longitude };
          }
          if (contentData?.lat && contentData?.lng) {
            return { lat: contentData.lat, lng: contentData.lng };
          }
          
          // Final fallback
          return { lat: 28.5562, lng: 77.1000 };
        };

        const departureCoords = getAirportCoordinates(flight.from, flight);
        const arrivalCoords = getAirportCoordinates(flight.to, flight);

        return (
          <script
            key={`flight-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@type": "Flight",
                "@context": "http://schema.org",
                "estimatedFlightDuration": flight.duration || "N/A",
                "departureTime": flight.departureTime || "6:10 am",
                "departureAirport": {
                  "@type": "Airport",
                  "name": `${getCityName(flight.from)} Airport`,
                  "iataCode": flight.from,
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": departureCoords.lat,
                    "longitude": departureCoords.lng
                  }
                },
                "arrivalAirport": {
                  "@type": "Airport",
                  "name": `${flight.city} Airport`,
                  "iataCode": flight.to,
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": arrivalCoords.lat,
                    "longitude": arrivalCoords.lng
                  }
                },
                "offers": [{
                  "@type": "Offer",
                  "price": parseInt(flight.price?.replace('$', '') || '0'),
                  "priceCurrency": "USD"
                }],
                "provider": {
                  "@type": "Airline",
                  "name": flight.airline || "Airline",
                  "iataCode": flight.airline?.substring(0, 2).toUpperCase() || "AL"
                }
              })
            }}
          />
        );
      })}

    </Box>
  );
}