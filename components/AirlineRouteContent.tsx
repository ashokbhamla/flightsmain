'use client';

import { Typography, Box, Container, Grid, Card, CardContent } from '@mui/material';
import { useTranslationWithFallback, useMultiLanguageContent, useHtmlTranslation } from '@/lib/useTranslationWithFallback';
import { Locale } from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';

interface AirlineRouteContentProps {
  locale: Locale;
  contentData: any;
  flightData: any;
  airlineName: string;
  departureCity: string;
  arrivalCity: string;
  departureIata: string;
  arrivalIata: string | null;
  normalizedFlights: any[];
}

export default function AirlineRouteContent({
  locale,
  contentData,
  flightData,
  airlineName,
  departureCity,
  arrivalCity,
  departureIata,
  arrivalIata,
  normalizedFlights
}: AirlineRouteContentProps) {
  const t = getTranslations(locale);
  
  // Use translation hooks for all content
  const title = useTranslationWithFallback({
    locale,
    apiContent: contentData?.title,
    fallbackKey: 'flightPage.title',
    defaultText: arrivalIata ? 
      `${airlineName} flights from ${departureCity} to ${arrivalCity}` :
      `${airlineName} flights from ${departureCity}`
  });

  const description = useHtmlTranslation({
    locale,
    apiContent: contentData?.description,
    fallbackKey: 'flightPage.description',
    defaultHtml: arrivalIata ? 
      `Plan your journey from ${departureCity} to ${arrivalCity} with ${airlineName}'s latest deals, travel tips, and flight information.` :
      `Plan your journey from ${departureCity} with ${airlineName}'s latest deals, travel tips, and flight information.`
  });

  const bookingSteps = useHtmlTranslation({
    locale,
    apiContent: contentData?.booking_steps,
    fallbackKey: 'flightPage.bookingSteps'
  });

  const cancellationPolicy = useHtmlTranslation({
    locale,
    apiContent: contentData?.cancellation,
    fallbackKey: 'flightPage.cancellationPolicy'
  });

  const classes = useHtmlTranslation({
    locale,
    apiContent: contentData?.classes,
    fallbackKey: 'flightPage.classes'
  });

  const destinationsOverview = useHtmlTranslation({
    locale,
    apiContent: contentData?.destinations_overview,
    fallbackKey: 'flightPage.destinationsOverview'
  });

  const popularDestinations = useHtmlTranslation({
    locale,
    apiContent: contentData?.destinations,
    fallbackKey: 'flightPage.popularDestinations'
  });

  const placesToVisit = useHtmlTranslation({
    locale,
    apiContent: contentData?.places,
    fallbackKey: 'flightPage.placesToVisit'
  });

  const hotels = useHtmlTranslation({
    locale,
    apiContent: contentData?.hotels,
    fallbackKey: 'flightPage.hotels'
  });

  const cityInfo = useHtmlTranslation({
    locale,
    apiContent: contentData?.city,
    fallbackKey: 'flightPage.cityInfo'
  });

  const airlines = useHtmlTranslation({
    locale,
    apiContent: contentData?.airlines,
    fallbackKey: 'flightPage.airlines'
  });

  const bestTimeVisit = useHtmlTranslation({
    locale,
    apiContent: contentData?.best_time_visit,
    fallbackKey: 'flightPage.bestTimeVisit'
  });

  const departureTerminal = useHtmlTranslation({
    locale,
    apiContent: contentData?.departure_terminal_paragraph,
    fallbackKey: 'flightPage.departureTerminal'
  });

  const arrivalTerminal = useHtmlTranslation({
    locale,
    apiContent: contentData?.arrival_terminal_paragraph,
    fallbackKey: 'flightPage.arrivalTerminal'
  });

  const terminalContact = useHtmlTranslation({
    locale,
    apiContent: contentData?.terminal_contact_paragraph,
    fallbackKey: 'flightPage.terminalContact'
  });

  const faqs = useMultiLanguageContent({
    locale,
    apiContent: contentData?.faqs,
    fallbackTranslations: {
      en: 'Frequently Asked Questions',
      es: 'Preguntas Frecuentes',
      ru: 'Часто Задаваемые Вопросы',
      fr: 'Questions Fréquemment Posées'
    }
  });

  return (
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
        {title}
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
        dangerouslySetInnerHTML={description}
      />

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
{t.flightPage.bookingSteps.replace('{airlineName}', airlineName)}
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
            dangerouslySetInnerHTML={bookingSteps}
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
            dangerouslySetInnerHTML={cancellationPolicy}
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
            {airlineName} Classes
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
            dangerouslySetInnerHTML={classes}
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
            dangerouslySetInnerHTML={destinationsOverview}
          />
        </Box>
      )}

      {/* Popular Destinations - Only show if not already in description */}
      {contentData?.destinations && !description.__html?.includes('destinations') && (
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
{t.flightPage.popularDestinations} from {departureCity}
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
{t.flightPage.placesToVisit.replace('{arrivalCity}', arrivalCity)}
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

      {/* Hotels */}
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
{t.flightPage.hotels.replace('{arrivalCity}', arrivalCity)}
          </Typography>
          <div 
            dangerouslySetInnerHTML={hotels}
            style={{ 
              fontSize: '1.1rem',
              lineHeight: 1.6,
              color: '#666'
            }}
          />
        </Box>
      )}

      {/* City Information */}
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
{t.flightPage.cityInfo}
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

      {/* Airlines */}
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
{t.flightPage.airlines} at {arrivalCity}
          </Typography>
          <div 
            dangerouslySetInnerHTML={airlines}
            style={{ 
              fontSize: '1.1rem',
              lineHeight: 1.6,
              color: '#666'
            }}
          />
        </Box>
      )}

      {/* Best Time to Visit */}
      {contentData?.best_time_visit && (
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
{t.flightPage.bestTimeVisit.replace('{arrivalCity}', arrivalCity)}
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

      {/* Departure Terminal */}
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
{t.flightPage.departureTerminal}
          </Typography>
          <div 
            dangerouslySetInnerHTML={departureTerminal}
            style={{ 
              fontSize: '1.1rem',
              lineHeight: 1.6,
              color: '#666'
            }}
          />
        </Box>
      )}

      {/* Arrival Terminal */}
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
{t.flightPage.arrivalTerminal}
          </Typography>
          <div 
            dangerouslySetInnerHTML={arrivalTerminal}
            style={{ 
              fontSize: '1.1rem',
              lineHeight: 1.6,
              color: '#666'
            }}
          />
        </Box>
      )}

      {/* Terminal Contact */}
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
{t.flightPage.terminalContact}
          </Typography>
          <div 
            dangerouslySetInnerHTML={terminalContact}
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
            {faqs}
          </Typography>
          <div 
            dangerouslySetInnerHTML={{ 
              __html: contentData.faqs.map((faq: any) => 
                `<div style="margin-bottom: 1.5rem;">
                  <h3 style="font-weight: 600; color: #1a1a1a; margin-bottom: 0.5rem;">${faq.q || ''}</h3>
                  <p style="color: #666; line-height: 1.6;">${faq.a || ''}</p>
                </div>`
              ).join('') 
            }} 
            style={{ 
              fontSize: '1.1rem',
              lineHeight: 1.6,
              color: '#666'
            }}
          />
        </Box>
      )}
    </Container>
  );
}
