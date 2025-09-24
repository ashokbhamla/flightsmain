import React, { useMemo } from 'react';
import { Box, Typography, Card, CardContent, Grid, Container } from '@mui/material';
import { Locale } from '../lib/i18n';
import { getMasterTranslatedContent, MasterContent } from '../lib/masterTranslationSystem';

interface UniversalMasterPageProps {
  locale: Locale;
  airlineName: string;
  departureCity: string;
  arrivalCity?: string;
  departureIata: string;
  arrivalIata?: string;
  flightData?: any;
  normalizedFlights?: any[];
  pageType?: 'airline' | 'hotel' | 'airport' | 'destination';
}

/**
 * Universal Master Page Component
 * Works for ALL pages in the web app - airlines, hotels, airports, destinations
 * English is the master - all changes in English automatically apply to all languages
 */
export default function UniversalMasterPage({
  locale,
  airlineName,
  departureCity,
  arrivalCity,
  departureIata,
  arrivalIata,
  flightData,
  normalizedFlights = [],
  pageType = 'airline'
}: UniversalMasterPageProps) {
  
  // Get master content (English) and translate to target language
  const content: MasterContent = useMemo(() => {
    return getMasterTranslatedContent({
      locale,
      airlineName,
      departureCity,
      arrivalCity,
      departureIata,
      arrivalIata
    });
  }, [locale, airlineName, departureCity, arrivalCity, departureIata, arrivalIata]);

  // Calculate flight statistics
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
          {content.title}
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            fontSize: '1.2rem',
            lineHeight: 1.6,
            color: '#666',
            marginBottom: '2rem'
          }}
        >
          {content.description}
        </Typography>
      </Box>

      {/* Flight Statistics - Only show if we have flight data */}
      {flightStats.totalFlights > 0 && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  {content.ui.availableFlights}
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
                  {content.ui.averagePrice}
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
                  {content.ui.cheapestPrice}
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
                  {content.ui.mostExpensive}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  ${flightStats.mostExpensivePrice}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Left Column - Main Content */}
        <Grid item xs={12} lg={8}>
          {/* Booking Steps */}
          <Box sx={{ mb: 4 }}>
            <div
              dangerouslySetInnerHTML={{ __html: content.bookingSteps }}
              style={{
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>

          {/* Cancellation Policy */}
          <Box sx={{ mb: 4 }}>
            <div
              dangerouslySetInnerHTML={{ __html: content.cancellationPolicy }}
              style={{
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>

          {/* Flight Classes */}
          <Box sx={{ mb: 4 }}>
            <div
              dangerouslySetInnerHTML={{ __html: content.classes }}
              style={{
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>

          {/* Destinations Overview */}
          <Box sx={{ mb: 4 }}>
            <div
              dangerouslySetInnerHTML={{ __html: content.destinationsOverview }}
              style={{
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>

          {/* Popular Destinations */}
          <Box sx={{ mb: 4 }}>
            <div
              dangerouslySetInnerHTML={{ __html: content.popularDestinations }}
              style={{
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>

          {/* Places to Visit */}
          <Box sx={{ mb: 4 }}>
            <div
              dangerouslySetInnerHTML={{ __html: content.placesToVisit }}
              style={{
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>

          {/* City Information */}
          <Box sx={{ mb: 4 }}>
            <div
              dangerouslySetInnerHTML={{ __html: content.cityInfo }}
              style={{
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>

          {/* Best Time to Visit */}
          <Box sx={{ mb: 4 }}>
            <div
              dangerouslySetInnerHTML={{ __html: content.bestTimeVisit }}
              style={{
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>

          {/* FAQs */}
          {content.faqs && content.faqs.length > 0 && (
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
                Frequently Asked Questions
              </Typography>
              
              {content.faqs.map((faq, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#1a1a1a', 
                      mb: 1 
                    }}
                  >
                    {faq.q}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#666', 
                      lineHeight: 1.6 
                    }}
                  >
                    {faq.a}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Grid>

        {/* Right Column - Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Quick Actions */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {content.ui.findFlights}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Search for the best flight deals
              </Typography>
              {/* Add flight search widget here */}
            </CardContent>
          </Card>

          {/* Flight Information */}
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

          {/* Page Type Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Page Type
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {pageType.charAt(0).toUpperCase() + pageType.slice(1)} Page
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Language: {locale.toUpperCase()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Master: English
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

/**
 * Hook to get master content for any page
 * This ensures all pages use the same translation pattern
 */
export function useMasterContent(context: {
  locale: Locale;
  airlineName: string;
  departureCity: string;
  arrivalCity?: string;
  departureIata: string;
  arrivalIata?: string;
}): MasterContent {
  return useMemo(() => {
    return getMasterTranslatedContent(context);
  }, [context.locale, context.airlineName, context.departureCity, context.arrivalCity, context.departureIata, context.arrivalIata]);
}
