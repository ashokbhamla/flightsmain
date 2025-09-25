import { Metadata } from 'next';
import { Typography, Box, Container, Grid, Card, CardContent, Button, Chip } from '@mui/material';
import { localeFromParam } from '@/lib/i18n';
import { generateFlightsFromCanonicalUrl, generateAlternateUrls } from '@/lib/canonical';
import SchemaOrg from '@/components/SchemaOrg';
import { breadcrumbSchema } from '@/lib/schema';
import { fetchDestinationFlightContent, fetchDestinationFlightData, fetchFlightContent, fetchFlightData } from '@/lib/api';
import FlightSearchBox from '@/components/FlightSearchBox';
import ClientPriceGraph from '@/components/ClientPriceGraph';
import { normalizeFlights, getCityName } from '@/lib/flightUtils';
import { getLanguageId } from '@/lib/translations';

export async function generateMetadata({ params }: { params: { locale: string, airport: string } }): Promise<Metadata> {
  const locale = localeFromParam(params.locale);
  const airportCode = params.airport.toUpperCase();
  
  // Generate canonical URL and alternate URLs
  const canonicalUrl = generateFlightsFromCanonicalUrl(params.airport, locale);
  const alternateUrls = generateAlternateUrls(`/flights/from/${params.airport}`);
  
  // Check if this is a route-specific page (e.g., del-bom)
  const isRoutePage = airportCode.includes('-');
  let departureIata = '';
  let arrivalIata = '';
  let cityName = '';
  let routeTitle = '';
  
  if (isRoutePage) {
    const [dep, arr] = airportCode.split('-');
    departureIata = dep;
    arrivalIata = arr;
    cityName = `${getCityName(dep)} to ${getCityName(arr)}`;
    routeTitle = `Flights from ${getCityName(dep)} to ${getCityName(arr)}`;
  } else {
    cityName = getCityName(airportCode);
    routeTitle = `Flights from ${cityName}`;
  }

  let contentData: any = null;
  
  try {
    if (isRoutePage) {
      contentData = await fetchFlightContent(arrivalIata, departureIata, locale === 'es' ? 2 : 1);
    } else {
      contentData = await fetchDestinationFlightContent(airportCode, locale === 'es' ? 2 : 1);
    }
  } catch (error) {
    console.error('Error fetching content for metadata:', error);
  }

  if (contentData) {
    return {
      title: contentData.title || routeTitle,
      description: contentData.description || `Find cheap flights from ${cityName} to destinations worldwide.`,
      keywords: contentData.meta_keywords?.join(', ') || '',
      alternates: {
        canonical: canonicalUrl,
        languages: alternateUrls,
      },
      openGraph: {
        title: contentData.title || routeTitle,
        description: contentData.description || `Find cheap flights from ${cityName} to destinations worldwide.`,
        url: canonicalUrl,
        type: 'website',
      },
      twitter: {
        card: 'summary',
        title: contentData.title || routeTitle,
        description: contentData.description || `Find cheap flights from ${cityName} to destinations worldwide.`,
      },
    };
  } else {
    return {
      title: routeTitle,
      description: `Find cheap flights from ${cityName} to destinations worldwide.`,
      alternates: {
        canonical: canonicalUrl,
        languages: alternateUrls,
      },
    };
  }
}

export default async function FlightDestinationPage({ params }: { params: { locale: string, airport: string } }) {
  const locale = localeFromParam(params.locale);
  const airportCode = params.airport.toUpperCase();
  
  // Check if this is a route-specific page (e.g., del-bom)
  const isRoutePage = airportCode.includes('-');
  let departureIata = '';
  let arrivalIata = '';
  let cityName = '';
  let routeTitle = '';
  
  if (isRoutePage) {
    const [dep, arr] = airportCode.split('-');
    departureIata = dep;
    arrivalIata = arr;
    cityName = `${getCityName(dep)} to ${getCityName(arr)}`;
    routeTitle = `Flights from ${getCityName(dep)} to ${getCityName(arr)}`;
  } else {
    cityName = getCityName(airportCode);
    routeTitle = `Flights from ${cityName}`;
  }

  let contentData: any = null;
  let flightData: any = null;
  let normalizedFlights: any[] = [];

  try {
    if (isRoutePage) {
      // Fetch route-specific content
      contentData = await fetchFlightContent(arrivalIata, departureIata, getLanguageId(locale) as 1 | 2);
      flightData = await fetchFlightData(arrivalIata, departureIata);
    } else {
      // Fetch destination-specific content
      contentData = await fetchDestinationFlightContent(airportCode, getLanguageId(locale) as 1 | 2);
      flightData = await fetchDestinationFlightData(airportCode);
    }
    
    // Normalize the flight data for display
    if (flightData && Array.isArray(flightData)) {
      normalizedFlights = normalizeFlights(flightData);
    }
  } catch (error) {
    console.error('Error fetching flight page data:', error);
  }

  // Sample data for graphs (you can replace with API data when available)
  const weeklyPriceData = [
    { name: 'Mon', value: 245 },
    { name: 'Tue', value: 189 },
    { name: 'Wed', value: 198 },
    { name: 'Thu', value: 195 },
    { name: 'Fri', value: 267 },
    { name: 'Sat', value: 289 },
    { name: 'Sun', value: 312 }
  ];

  const monthlyPriceData = [
    { name: 'Jan', value: 189 },
    { name: 'Feb', value: 198 },
    { name: 'Mar', value: 245 },
    { name: 'Apr', value: 267 },
    { name: 'May', value: 289 },
    { name: 'Jun', value: 312 },
    { name: 'Jul', value: 298 },
    { name: 'Aug', value: 275 },
    { name: 'Sep', value: 198 },
    { name: 'Oct', value: 198 },
    { name: 'Nov', value: 245 },
    { name: 'Dec', value: 267 }
  ];

  const weatherData = [
    { name: 'Jan', value: 35 },
    { name: 'Feb', value: 38 },
    { name: 'Mar', value: 47 },
    { name: 'Apr', value: 58 },
    { name: 'May', value: 68 },
    { name: 'Jun', value: 75 },
    { name: 'Jul', value: 78 },
    { name: 'Aug', value: 76 },
    { name: 'Sep', value: 70 },
    { name: 'Oct', value: 61 },
    { name: 'Nov', value: 50 },
    { name: 'Dec', value: 40 }
  ];

  const rainfallData = [
    { name: 'Jan', value: 2.8 },
    { name: 'Feb', value: 2.6 },
    { name: 'Mar', value: 3.4 },
    { name: 'Apr', value: 3.1 },
    { name: 'May', value: 3.8 },
    { name: 'Jun', value: 4.2 },
    { name: 'Jul', value: 4.5 },
    { name: 'Aug', value: 4.1 },
    { name: 'Sep', value: 3.9 },
    { name: 'Oct', value: 3.2 },
    { name: 'Nov', value: 2.9 },
    { name: 'Dec', value: 2.7 }
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
          {contentData?.title || routeTitle}
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
                code: isRoutePage ? departureIata : airportCode, 
                name: isRoutePage ? `${departureIata} - ${getCityName(departureIata)}` : `${airportCode} - ${cityName}`, 
                city_name: isRoutePage ? getCityName(departureIata) : cityName,
                country_name: '',
                country_code: '',
                type: 'airport' as const
              }}
              defaultTo={isRoutePage ? { 
                code: arrivalIata, 
                name: `${arrivalIata} - ${getCityName(arrivalIata)}`, 
                city_name: getCityName(arrivalIata),
                country_name: '',
                country_code: '',
                type: 'airport' as const
              } : undefined}
            />
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
                        <Chip 
                          label={flight.flightsPerDay || 'Multiple flights'}
                          size="small"
                          sx={{ 
                            backgroundColor: '#10b981',
                            color: 'white',
                            fontSize: '0.75rem'
                          }}
                        />
                      </Box>
                      
                      <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                        {getCityName(flight.from)} to {flight.city}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                        {flight.city} • {flight.duration} avg
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                          From {flight.price}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          {flight.flightsPerWeek} flights/week
                        </Typography>
                      </Box>

                      {/* Airlines */}
                      {flight.airline && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            Airline: {flight.airline}
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
                        View Flights
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
                description={contentData?.weekly_fares_graph_content || contentData?.weekly_price_description || `Track weekly price fluctuations for flights from ${cityName}. Prices typically vary by day of the week, with mid-week flights often offering better deals.`}
                data={weeklyPriceData}
                yAxisLabel="Price (USD)"
                showPrices={true}
                height={300}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ClientPriceGraph
                title="Monthly Price Trends"
                description={contentData?.monthly_fares_graph_content || contentData?.monthly_price_description || `Monitor monthly price patterns to identify the best time to book your flight from ${cityName}. Seasonal variations and holiday periods significantly impact pricing.`}
                data={monthlyPriceData}
                yAxisLabel="Price (USD)"
                showPrices={true}
                height={300}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Places to Visit Section */}
        {contentData?.places_to_visit && Array.isArray(contentData.places_to_visit) && contentData.places_to_visit.length > 0 && (
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
              Places to Visit in {cityName}
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#666',
                lineHeight: 1.6,
                mb: 4
              }}
            >
              {contentData?.places_content || `Discover the best attractions and places to visit in ${cityName}. From historical landmarks to modern attractions, there's something for every traveler.`}
            </Typography>
            
            <Grid container spacing={3}>
              {contentData.places_to_visit.map((place: any, index: number) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ height: '100%', border: '1px solid #e0e0e0' }}>
                    <CardContent>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          mb: 2,
                          color: '#1a1a1a'
                        }}
                      >
                        {place.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#666',
                          lineHeight: 1.6
                        }}
                      >
                        {place.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Destinations Section */}
        {contentData?.destinations && (
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
              Flights from {cityName} ({airportCode}) Airport
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#666',
                lineHeight: 1.6,
                mb: 4
              }}
              dangerouslySetInnerHTML={{ __html: contentData.destinations }}
            />
            
            {contentData?.destinations_links && (
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#666',
                  lineHeight: 1.6,
                  mb: 4
                }}
                dangerouslySetInnerHTML={{ __html: contentData.destinations_links }}
              />
            )}
            
            {contentData?.cheapest_flights && (
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#666',
                  lineHeight: 1.6
                }}
                dangerouslySetInnerHTML={{ __html: contentData.cheapest_flights }}
              />
            )}
          </Box>
        )}

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
                  title={`Weather in ${isRoutePage ? getCityName(arrivalIata) : cityName}`}
                  description={contentData?.temperature || `Plan your visit to ${isRoutePage ? getCityName(arrivalIata) : cityName} with current temperature data. ${isRoutePage ? getCityName(arrivalIata) : cityName} experiences varied weather throughout the year.`}
                data={weatherData}
                yAxisLabel="Temperature (°F)"
                showPrices={false}
                height={300}
              />
            </Grid>
            <Grid item xs={12} md={6}>
                              <ClientPriceGraph
                  title={`Average Rainfall in ${isRoutePage ? getCityName(arrivalIata) : cityName}`}
                  description={contentData?.rainfall || `Stay prepared for your trip to ${isRoutePage ? getCityName(arrivalIata) : cityName} with rainfall information. Understanding precipitation patterns helps you plan your visit.`}
                data={rainfallData}
                yAxisLabel="Rainfall (inches)"
                showPrices={false}
                height={300}
              />
            </Grid>
          </Grid>
        </Box>

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
              Places to Visit in {isRoutePage ? getCityName(arrivalIata) : cityName}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#666',
                lineHeight: 1.6,
                mb: 3
              }}
            >
              {contentData.places}
            </Typography>
          </Box>
        )}

        {/* Airlines Section */}
        {contentData?.airlines && (
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
              Airlines Operating from {cityName}
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#666',
                lineHeight: 1.6
              }}
              dangerouslySetInnerHTML={{ __html: contentData.airlines }}
            />
          </Box>
        )}

        {/* FAQ Section */}
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
            Frequently Asked Questions
          </Typography>
          
          <Grid container spacing={3}>
            {contentData?.faqs && Array.isArray(contentData.faqs) && contentData.faqs.length > 0 ? (
              contentData.faqs.map((faq: any, index: number) => (
                <Grid item xs={12} key={index}>
                  <Card sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                    <CardContent>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          mb: 2,
                          color: '#1a1a1a'
                        }}
                        dangerouslySetInnerHTML={{ __html: faq.q }}
                      />
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#666',
                          lineHeight: 1.6
                        }}
                        dangerouslySetInnerHTML={{ __html: faq.a }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <>
                <Grid item xs={12}>
                  <Card sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                    <CardContent>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          mb: 2,
                          color: '#1a1a1a'
                        }}
                      >
                        What airlines fly from {cityName}?
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#666',
                          lineHeight: 1.6
                        }}
                      >
                        Major airlines operating from {cityName} include Air India, IndiGo, Vistara, SpiceJet, and several international carriers. The airport serves both domestic and international destinations.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                    <CardContent>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          mb: 2,
                          color: '#1a1a1a'
                        }}
                      >
                        How early should I arrive at {cityName} Airport?
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#666',
                          lineHeight: 1.6
                        }}
                      >
                        We recommend arriving at least 2 hours before domestic flights and 3 hours before international flights to allow time for check-in, security screening, and boarding.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                    <CardContent>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          mb: 2,
                          color: '#1a1a1a'
                        }}
                      >
                        What are the best times to book flights from {cityName}?
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#666',
                          lineHeight: 1.6
                        }}
                      >
                        The best time to book flights from {cityName} is typically 3-4 weeks in advance for domestic routes and 6-8 weeks for international flights. Mid-week departures often offer better prices.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            )}
          </Grid>
        </Box>


        {/* About City Section */}
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
            About {isRoutePage ? getCityName(arrivalIata) : cityName}
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#666',
              lineHeight: 1.6,
              mb: 3
            }}
          >
            {contentData?.stats || `${isRoutePage ? getCityName(arrivalIata) : cityName} is a vibrant destination with rich culture, history, and modern amenities. The city offers a perfect blend of traditional charm and contemporary lifestyle, making it an ideal place to visit and explore.`}
          </Typography>
        </Box>

        {/* Additional Information Sections */}
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
            Additional Information
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontSize: '1.4rem',
                  fontWeight: 600,
                  mb: 3,
                  color: '#1a1a1a'
                }}
              >
                Travel Restrictions
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#666',
                  lineHeight: 1.6,
                  mb: 3
                }}
              >
                {contentData?.travel_restrictions || `Please check current travel restrictions and requirements before booking your flight from ${cityName}. Requirements may vary based on your destination and nationality.`}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontSize: '1.4rem',
                  fontWeight: 600,
                  mb: 3,
                  color: '#1a1a1a'
                }}
              >
                Flight Duration
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#666',
                  lineHeight: 1.6,
                  mb: 3
                }}
              >
                {contentData?.flight_duration || `Flight durations from ${cityName} vary depending on your destination. Domestic flights typically range from 1-3 hours, while international flights can take 4-12 hours or more.`}
              </Typography>
            </Grid>
          </Grid>
        </Box>

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
      </Container>
      
      <SchemaOrg data={breadcrumbSchema([
        { name: 'Home', url: locale === 'es' ? '/es' : '/' },
        { name: 'Flights', url: (locale === 'es' ? '/es' : '') + '/flights' },
        { name: `Flights from ${cityName}`, url: (locale === 'es' ? '/es' : '') + `/flights/${params.airport}` },
      ])} />

      {/* Flight Destination Schema */}
      <SchemaOrg data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": contentData?.title || `Flights from ${cityName} (${airportCode})`,
        "description": contentData?.description || `Find cheap flights from ${cityName} to destinations worldwide.`,
        "url": `${process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com'}/flights/${params.airport}`,
        "isPartOf": {
          "@type": "WebSite",
          "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "airlinesmap.com",
          "url": process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com'
        },
        "mainEntity": {
          "@type": "Airport",
          "name": `${airportCode} Airport`,
          "iataCode": airportCode,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": cityName,
            "addressCountry": "IN"
          }
        }
      }} />

      {/* Flight Product Schema */}
      {normalizedFlights && normalizedFlights.length > 0 && (
        <SchemaOrg data={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": `Flights from ${cityName}`,
          "description": contentData?.description || `Find cheap flights from ${cityName} to destinations worldwide`,
          "image": [
            `${process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com'}/images/airports/${airportCode}.jpg`,
            `${process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com'}/images/flights/generic-flight.jpg`
          ],
          "brand": {
            "@type": "Brand",
            "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "airlinesmap.com"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.4",
            "reviewCount": "203"
          },
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "USD",
            "lowPrice": Math.min(...normalizedFlights.map((f: any) => parseInt(f.price.replace('$', '')))),
            "highPrice": Math.max(...normalizedFlights.map((f: any) => parseInt(f.price.replace('$', '')))),
            "offerCount": normalizedFlights.length,
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
          },
          "category": "Travel",
          "additionalProperty": [
            {
              "@type": "PropertyValue",
              "name": "Departure Airport",
              "value": airportCode
            },
            {
              "@type": "PropertyValue", 
              "name": "Departure City",
              "value": cityName
            }
          ]
        }} />
      )}

      {/* Flight Schema */}
      {normalizedFlights && normalizedFlights.length > 0 && (
        <SchemaOrg data={{
          "@context": "https://schema.org",
          "@type": "Flight",
          "flightNumber": `${normalizedFlights[0]?.carrier || 'AI'}${Math.floor(Math.random() * 1000)}`,
          "airline": {
            "@type": "Airline",
            "name": normalizedFlights[0]?.airline || "Air India",
            "iataCode": normalizedFlights[0]?.carrier || "AI"
          },
          "departureAirport": {
            "@type": "Airport",
            "name": `${airportCode} Airport`,
            "iataCode": airportCode,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": cityName,
              "addressCountry": "IN"
            }
          },
          "arrivalAirport": {
            "@type": "Airport",
            "name": `${normalizedFlights[0]?.to} Airport`,
            "iataCode": normalizedFlights[0]?.to,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": normalizedFlights[0]?.city,
              "addressCountry": "IN"
            }
          },
          "departureTime": "2024-12-01T10:00:00+05:30",
          "arrivalTime": "2024-12-01T12:00:00+05:30",
          "flightDistance": "500 km",
          "aircraft": {
            "@type": "Aircraft",
            "name": "Boeing 737"
          }
        }} />
      )}

      {/* OneWay Price Schema */}
      {normalizedFlights && normalizedFlights.length > 0 && (
        <SchemaOrg data={{
          "@context": "https://schema.org",
          "@type": "OneWay",
          "name": `One-way flights from ${cityName}`,
          "description": `Cheapest one-way flights from ${cityName} (${airportCode}) to various destinations`,
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "USD",
            "lowPrice": Math.min(...normalizedFlights.map((f: any) => parseInt(f.price.replace('$', '')))),
            "highPrice": Math.max(...normalizedFlights.map((f: any) => parseInt(f.price.replace('$', '')))),
            "offerCount": normalizedFlights.length,
            "availability": "https://schema.org/InStock",
            "validFrom": new Date().toISOString(),
            "description": `Multiple airlines offering flights from ${cityName}`
          }
        }} />
      )}

      {/* FAQ Schema */}
      {contentData?.faqs && Array.isArray(contentData.faqs) && contentData.faqs.length > 0 && (
        <SchemaOrg data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": contentData.faqs.map((faq: any) => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.a.replace(/<[^>]*>/g, '') // Strip HTML for SEO schema
            }
          }))
        }} />
      )}

      {/* Travel Agency Schema */}
      <SchemaOrg data={{
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "airlinesmap.com",
        "description": "Find cheap flights, hotels, and travel deals",
        "url": process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com',
        "logo": `${process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com'}${process.env.NEXT_PUBLIC_LOGO_URL || "/logo.png"}`,
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "US"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "telephone": process.env.NEXT_PUBLIC_PHONE_NUMBER || "+1-888-319-6206",
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
            }
          ]
        },
        "sameAs": [
          process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://www.facebook.com/flightsearchs",
          process.env.NEXT_PUBLIC_TWITTER_URL || "https://www.twitter.com/flightsearchs",
          process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/flightsearchs",
          process.env.NEXT_PUBLIC_PINTEREST_URL || "https://www.pinterest.com/flightsearchs",
          process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://www.youtube.com/flightsearchs"
        ]
      }} />

    </Box>
  );
}
