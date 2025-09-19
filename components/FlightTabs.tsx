'use client';

import { useState } from 'react';
import { Box, Typography, Tabs, Tab, Grid } from '@mui/material';
import FlightCard from './FlightCard';
import FlightCards from './FlightCards';
import FlightRouteCard from './FlightRouteCard';
import { NormalizedFlight } from '@/lib/flightNormalizer';
import { getTranslations } from '@/lib/translations';
import { Locale } from '@/lib/i18n';
import { getAirlineLogoUrl } from '@/lib/cdn';

interface FlightData {
  iata_from: string;
  iata_to: string;
  departure_time: string;
  arrival_time: string;
  stops: number;
  date: string;
  iso_date: string;
  duration: string;
  price: number;
  currency: string;
  localized_price: string;
  airline: string;
  airline_iata: string;
}

interface FlightTabsProps {
  flightData?: {
    oneway_flights?: FlightData[];
    last_minute_flights?: FlightData[];
    cheap_flights?: FlightData[];
    best_flights?: FlightData[];
  } | null;
  departureCity: string;
  arrivalCity: string;
  departureIata: string;
  arrivalIata: string;
  normalizedFlights?: NormalizedFlight[];
  tabDescriptions?: {
    oneway_flights?: string;
    last_minute_flights?: string;
    cheap_flights?: string;
    best_flights?: string;
  };
  locale?: Locale;
}

export default function FlightTabs({ flightData, departureCity, arrivalCity, departureIata, arrivalIata, normalizedFlights, tabDescriptions, locale = 'en' }: FlightTabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const t = getTranslations(locale);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Transform API data to FlightCard format
  const transformFlightData = (flights: FlightData[]) => {
    return flights.map((flight, index) => ({
      id: index + 1,
      airline: flight.airline,
      airlineLogo: getAirlineLogoUrl(flight.airline_iata),
      price: flight.localized_price,
      departure: `${flight.iata_from} - ${departureCity}`,
      departureTime: `${flight.date} • ${flight.departure_time}`,
      departureRoute: `${flight.iata_from} - ${flight.iata_to}`,
      return: `${flight.iata_to} - ${arrivalCity}`,
      returnTime: `${flight.date} • ${flight.arrival_time}`,
      returnRoute: `${flight.iata_to} - ${flight.iata_from}`,
      stops: flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`,
      duration: flight.duration,
      dealFound: 'Just now',
      bookingPlatform: `${flight.airline}.com`
    }));
  };

  // Use normalized flights if available, otherwise fall back to original flight data
  const hasNormalizedFlights = normalizedFlights && normalizedFlights.length > 0;
  
  const allTabData = [
    {
      label: t.flightTabs.onewayFlights,
      flights: hasNormalizedFlights ? normalizedFlights : transformFlightData(flightData?.oneway_flights || []),
      description: tabDescriptions?.oneway_flights || t.flightTabs.onewayDescription.replace('{from}', departureCity).replace('{to}', arrivalCity)
    },
    {
      label: t.flightTabs.lastMinute,
      flights: hasNormalizedFlights ? normalizedFlights : transformFlightData(flightData?.last_minute_flights || []),
      description: tabDescriptions?.last_minute_flights || t.flightTabs.lastMinuteDescription.replace('{from}', departureCity).replace('{to}', arrivalCity)
    },
    {
      label: t.flightTabs.cheapFlights,
      flights: hasNormalizedFlights ? normalizedFlights : transformFlightData(flightData?.cheap_flights || []),
      description: tabDescriptions?.cheap_flights || t.flightTabs.cheapDescription.replace('{from}', departureCity).replace('{to}', arrivalCity)
    },
    {
      label: t.flightTabs.bestFlights,
      flights: hasNormalizedFlights ? normalizedFlights : transformFlightData(flightData?.best_flights || []),
      description: tabDescriptions?.best_flights || t.flightTabs.bestDescription.replace('{from}', departureCity).replace('{to}', arrivalCity)
    }
  ];

  // Filter out tabs with no flights
  const tabData = allTabData.filter(tab => tab.flights.length > 0);
  
  // If no tabs have flights, show all tabs with empty state
  const displayTabs = tabData.length > 0 ? tabData : allTabData;

  return (
    <Box sx={{ mb: 6 }}>
      <Typography 
        variant="h2" 
        sx={{ 
          fontSize: '1.8rem',
          fontWeight: 600,
          mb: 2,
          color: '#1a1a1a'
        }}
      >
        {t.flightSearch.findFlightDeals} from {departureCity} to {arrivalCity}
      </Typography>
      
      <Typography 
        variant="h6" 
        sx={{ 
          fontSize: '1.1rem',
          fontWeight: 500,
          mb: 2,
          color: '#1a1a1a'
        }}
      >
        {t.flightSearch.cheapestFlights} from {departureCity} to {arrivalCity}
      </Typography>
      
      {/* Tabs - Only show if there are flights available */}
      {displayTabs.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 3 }, gap: { xs: 0.5, md: 1 }, flexWrap: 'wrap' }}>
          {displayTabs.map((tab, index) => (
            <Box
              key={index}
              onClick={() => setActiveTab(index)}
              sx={{
                px: { xs: 2, md: 3 },
                py: { xs: 2, md: 1.5 },
                cursor: 'pointer',
                minHeight: { xs: '48px', md: 'auto' },
                minWidth: { xs: '120px', md: 'auto' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease-in-out',
                backgroundColor: activeTab === index ? '#1e3a8a' : 'white',
                border: activeTab === index ? 'none' : '1px solid #1e3a8a',
                '&:hover': {
                  backgroundColor: activeTab === index ? '#1e3a8a' : '#f8f9fa',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              <Typography
                sx={{
                  color: activeTab === index ? 'white' : '#1e3a8a',
                  fontWeight: activeTab === index ? 600 : 500,
                  fontSize: { xs: '14px', md: '0.9rem' },
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap',
                  textAlign: 'center'
                }}
              >
                {tab.label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      
      <Typography 
        variant="body1" 
        sx={{ 
          color: '#666',
          mb: 4,
          lineHeight: 1.6
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: displayTabs[activeTab]?.description || '' }} />
      </Typography>
      
      {/* Flight Cards Grid */}
      {hasNormalizedFlights ? (
        <Grid container spacing={3}>
          {displayTabs[activeTab]?.flights.map((flight, index) => (
            <Grid item xs={12} sm={6} md={4} key={`${(flight as NormalizedFlight).from}-${(flight as NormalizedFlight).to}-${index}`}>
              <FlightRouteCard 
                flight={flight as NormalizedFlight}
                onBookClick={(flight) => {
                  console.log('Flight booked:', flight);
                }}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {displayTabs[activeTab]?.flights.map((flight, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <FlightCard flight={flight as any} />
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Show message if no flights */}
      {displayTabs[activeTab]?.flights.length === 0 && (
        <Box sx={{ 
          textAlign: 'center', 
          py: 6,
          backgroundColor: '#f8f9fa',
          border: '1px solid #e9ecef'
        }}>
          <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
            No flights found
          </Typography>
          <Typography variant="body2" sx={{ color: '#999' }}>
            Try adjusting your search criteria or check back later for new deals.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
