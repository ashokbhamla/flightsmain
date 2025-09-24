import React, { useMemo } from 'react';
import { Box, Typography, Card, CardContent, Grid, Container } from '@mui/material';
import { Locale } from '../lib/i18n';
import { generateCleanContent, CleanContent } from '../lib/cleanContentSystem';

interface CleanPageComponentProps {
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
 * Clean Page Component
 * NO DUPLICATES - completely clean content
 * Single source of truth for all content
 */
export default function CleanPageComponent({
  locale,
  airlineName,
  departureCity,
  arrivalCity,
  departureIata,
  arrivalIata,
  flightData,
  normalizedFlights = [],
  pageType = 'airline'
}: CleanPageComponentProps) {
  
  // Get clean content (NO DUPLICATES)
  const content: CleanContent = useMemo(() => {
    return generateCleanContent({
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
      {/* Page Header - SINGLE TITLE */}
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

      {/* Main Content - NO DUPLICATES */}
      <Grid container spacing={4}>
        {/* Left Column - Main Content */}
        <Grid item xs={12} lg={8}>
          {/* Booking Steps - SINGLE SECTION */}
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

          {/* Cancellation Policy - SINGLE SECTION */}
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

          {/* Flight Classes - SINGLE SECTION */}
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

          {/* Destinations Overview - SINGLE SECTION */}
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

          {/* Popular Destinations - SINGLE SECTION */}
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

          {/* Places to Visit - SINGLE SECTION */}
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

          {/* City Information - SINGLE SECTION */}
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

          {/* Best Time to Visit - SINGLE SECTION */}
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

          {/* FAQs - SINGLE SECTION, NO DUPLICATES */}
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
          {/* Quick Actions - SINGLE SECTION */}
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

          {/* Flight Information - SINGLE SECTION */}
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

          {/* Page Type Information - SINGLE SECTION */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Page Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Type: {pageType.charAt(0).toUpperCase() + pageType.slice(1)} Page
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Language: {locale.toUpperCase()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Status: Clean (No Duplicates)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

/**
 * Hook to get clean content for any page
 * NO DUPLICATES - single source of truth
 */
export function useCleanContent(context: {
  locale: Locale;
  airlineName: string;
  departureCity: string;
  arrivalCity?: string;
  departureIata: string;
  arrivalIata?: string;
}): CleanContent {
  return useMemo(() => {
    return generateCleanContent(context);
  }, [context.locale, context.airlineName, context.departureCity, context.arrivalCity, context.departureIata, context.arrivalIata]);
}
