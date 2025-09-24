import React, { useMemo } from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { Locale } from '../lib/i18n';
import { 
  useOptimizedTranslation, 
  useOptimizedHtmlTranslation, 
  useBatchTranslations,
  createTranslationContext 
} from '../lib/translationOptimizer';

interface OptimizedAirlineRouteContentProps {
  locale: Locale;
  contentData: any;
  flightData: any;
  airlineName: string;
  departureCity: string;
  arrivalCity?: string;
  departureIata: string;
  arrivalIata?: string;
  normalizedFlights: any[];
}

export default function OptimizedAirlineRouteContent({
  locale,
  contentData,
  flightData,
  airlineName,
  departureCity,
  arrivalCity,
  departureIata,
  arrivalIata,
  normalizedFlights
}: OptimizedAirlineRouteContentProps) {
  
  // Create optimized translation context
  const translations = useMemo(() => createTranslationContext(locale), [locale]);
  
  // Batch load common translations for better performance
  const commonTranslations = useBatchTranslations(locale, [
    'flightPage.title',
    'flightPage.description',
    'flightPage.faqs',
    'flightPage.popularDestinations',
    'flightPage.airlines',
    'flightPage.availableFlights',
    'flightPage.bookingSteps',
    'flightPage.cancellationPolicy',
    'flightPage.classes',
    'flightPage.destinationsOverview',
    'flightPage.placesToVisit',
    'flightPage.cityInfo',
    'flightPage.bestTimeVisit',
    'common.loading',
    'common.error',
    'common.bookNow',
    'common.findFlights'
  ]);

  // Optimized content translations with caching
  const title = useOptimizedTranslation(
    locale, 
    'flightPage.title',
    arrivalIata ? 
      `${airlineName} flights from ${departureCity} to ${arrivalCity}` :
      `${airlineName} flights from ${departureCity}`
  );

  const description = useOptimizedHtmlTranslation(
    locale,
    'flightPage.description',
    contentData?.description,
    arrivalIata ? 
      `Plan your journey from ${departureCity} to ${arrivalCity} with ${airlineName}'s latest deals, travel tips, and flight information.` :
      `Plan your journey from ${departureCity} with ${airlineName}'s latest deals, travel tips, and flight information.`
  );

  // Batch load content translations
  const contentTranslations = useBatchTranslations(locale, [
    'flightPage.bookingSteps',
    'flightPage.cancellationPolicy',
    'flightPage.classes',
    'flightPage.destinationsOverview',
    'flightPage.placesToVisit',
    'flightPage.cityInfo',
    'flightPage.bestTimeVisit'
  ], {
    'flightPage.bookingSteps': `How to Book ${airlineName} Flights`,
    'flightPage.cancellationPolicy': `${airlineName} Cancellation Policy`,
    'flightPage.classes': `${airlineName} Flight Classes`,
    'flightPage.destinationsOverview': `${airlineName} Destinations Overview`,
    'flightPage.placesToVisit': arrivalIata ? `Places to Visit in ${arrivalCity}` : `Places to Visit from ${departureCity}`,
    'flightPage.cityInfo': 'City Information',
    'flightPage.bestTimeVisit': arrivalIata ? `Best Time to Visit ${arrivalCity}` : `Best Time to Visit ${departureCity}`
  });

  // Optimized HTML content translations
  const bookingSteps = useOptimizedHtmlTranslation(
    locale,
    'flightPage.bookingSteps',
    contentData?.booking_steps
  );

  const cancellationPolicy = useOptimizedHtmlTranslation(
    locale,
    'flightPage.cancellationPolicy',
    contentData?.cancellation
  );

  const classes = useOptimizedHtmlTranslation(
    locale,
    'flightPage.classes',
    contentData?.classes
  );

  const destinationsOverview = useOptimizedHtmlTranslation(
    locale,
    'flightPage.destinationsOverview',
    contentData?.destinations_overview
  );

  const popularDestinations = useOptimizedHtmlTranslation(
    locale,
    'flightPage.popularDestinations',
    contentData?.destinations
  );

  const placesToVisit = useOptimizedHtmlTranslation(
    locale,
    'flightPage.placesToVisit',
    contentData?.places
  );

  const cityInfo = useOptimizedHtmlTranslation(
    locale,
    'flightPage.cityInfo',
    contentData?.city_info
  );

  const bestTimeVisit = useOptimizedHtmlTranslation(
    locale,
    'flightPage.bestTimeVisit',
    contentData?.best_time_visit
  );

  // Flight data processing
  const flightStats = useMemo(() => {
    if (!normalizedFlights || normalizedFlights.length === 0) {
      return {
        totalFlights: 0,
        avgPrice: 0,
        cheapestPrice: 0,
        mostExpensivePrice: 0
      };
    }

    const prices = normalizedFlights.map(f => f.price || 0).filter(p => p > 0);
    const totalFlights = normalizedFlights.length;
    const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
    const cheapestPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const mostExpensivePrice = prices.length > 0 ? Math.max(...prices) : 0;

    return {
      totalFlights,
      avgPrice,
      cheapestPrice,
      mostExpensivePrice
    };
  }, [normalizedFlights]);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: '2.5rem',
            fontWeight: 700,
            mb: 2,
            color: '#1a1a1a',
            lineHeight: 1.2
          }}
        >
          {title}
        </Typography>
        
        <div
          dangerouslySetInnerHTML={description}
          style={{
            fontSize: '1.2rem',
            lineHeight: 1.6,
            color: '#666',
            marginBottom: '2rem'
          }}
        />
      </Box>

      {/* Flight Statistics */}
      {flightStats.totalFlights > 0 && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  {commonTranslations['flightPage.availableFlights']}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {flightStats.totalFlights}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Average Price
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  ${flightStats.avgPrice}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Cheapest Price
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                  ${flightStats.cheapestPrice}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Most Expensive
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  ${flightStats.mostExpensivePrice}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Content Sections */}
      <Grid container spacing={4}>
        {/* Left Column - Main Content */}
        <Grid item xs={12} lg={8}>
          {/* Booking Steps */}
          {bookingSteps.__html && (
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontSize: '1.8rem',
                  fontWeight: 600,
                  mb: 3,
                  color: '#1a1a1a'
                }}
              >
                {contentTranslations['flightPage.bookingSteps']}
              </Typography>
              <div
                dangerouslySetInnerHTML={bookingSteps}
                style={{
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  color: '#666'
                }}
              />
            </Box>
          )}

          {/* Cancellation Policy */}
          {cancellationPolicy.__html && (
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontSize: '1.8rem',
                  fontWeight: 600,
                  mb: 3,
                  color: '#1a1a1a'
                }}
              >
                {contentTranslations['flightPage.cancellationPolicy']}
              </Typography>
              <div
                dangerouslySetInnerHTML={cancellationPolicy}
                style={{
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  color: '#666'
                }}
              />
            </Box>
          )}

          {/* Flight Classes */}
          {classes.__html && (
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontSize: '1.8rem',
                  fontWeight: 600,
                  mb: 3,
                  color: '#1a1a1a'
                }}
              >
                {contentTranslations['flightPage.classes']}
              </Typography>
              <div
                dangerouslySetInnerHTML={classes}
                style={{
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  color: '#666'
                }}
              />
            </Box>
          )}

          {/* Destinations Overview */}
          {destinationsOverview.__html && (
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontSize: '1.8rem',
                  fontWeight: 600,
                  mb: 3,
                  color: '#1a1a1a'
                }}
              >
                {contentTranslations['flightPage.destinationsOverview']}
              </Typography>
              <div
                dangerouslySetInnerHTML={destinationsOverview}
                style={{
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  color: '#666'
                }}
              />
            </Box>
          )}

          {/* Popular Destinations */}
          {popularDestinations.__html && (
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontSize: '1.8rem',
                  fontWeight: 600,
                  mb: 3,
                  color: '#1a1a1a'
                }}
              >
                {commonTranslations['flightPage.popularDestinations']}
              </Typography>
              <div
                dangerouslySetInnerHTML={popularDestinations}
                style={{
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  color: '#666'
                }}
              />
            </Box>
          )}

          {/* Places to Visit */}
          {placesToVisit.__html && (
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontSize: '1.8rem',
                  fontWeight: 600,
                  mb: 3,
                  color: '#1a1a1a'
                }}
              >
                {contentTranslations['flightPage.placesToVisit']}
              </Typography>
              <div
                dangerouslySetInnerHTML={placesToVisit}
                style={{
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  color: '#666'
                }}
              />
            </Box>
          )}

          {/* City Information */}
          {cityInfo.__html && (
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontSize: '1.8rem',
                  fontWeight: 600,
                  mb: 3,
                  color: '#1a1a1a'
                }}
              >
                {contentTranslations['flightPage.cityInfo']}
              </Typography>
              <div
                dangerouslySetInnerHTML={cityInfo}
                style={{
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  color: '#666'
                }}
              />
            </Box>
          )}

          {/* Best Time to Visit */}
          {bestTimeVisit.__html && (
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontSize: '1.8rem',
                  fontWeight: 600,
                  mb: 3,
                  color: '#1a1a1a'
                }}
              >
                {contentTranslations['flightPage.bestTimeVisit']}
              </Typography>
              <div
                dangerouslySetInnerHTML={bestTimeVisit}
                style={{
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  color: '#666'
                }}
              />
            </Box>
          )}
        </Grid>

        {/* Right Column - Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Quick Actions */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {commonTranslations['common.findFlights']}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Search for the best flight deals
              </Typography>
              {/* Add flight search widget here */}
            </CardContent>
          </Card>

          {/* Flight Information */}
          {flightData && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Flight Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Departure: {departureIata}
                </Typography>
                {arrivalIata && (
                  <Typography variant="body2" color="text.secondary">
                    Arrival: {arrivalIata}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  Airline: {airlineName}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
