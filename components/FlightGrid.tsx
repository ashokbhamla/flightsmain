'use client';

import { useState } from 'react';
import { Box, Grid, Button, Typography } from '@mui/material';
import FlightCard from './FlightCard';

interface Flight {
  id: number;
  airline: string;
  airlineLogo: string;
  price: string;
  departure: string;
  departureTime: string;
  departureRoute: string;
  return: string;
  returnTime: string;
  returnRoute: string;
  stops: string;
  duration: string;
  dealFound: string;
  bookingPlatform: string;
}

interface FlightGridProps {
  flights: Flight[];
  title?: string;
  subtitle?: string;
  initialShowCount?: number;
  onBook?: (flightId: number) => void;
}

export default function FlightGrid({ 
  flights, 
  title, 
  subtitle, 
  initialShowCount = 6,
  onBook 
}: FlightGridProps) {
  const [showAllFlights, setShowAllFlights] = useState(false);

  const displayedFlights = showAllFlights ? flights : flights.slice(0, initialShowCount);
  const hasMoreFlights = flights.length > initialShowCount;

  const handleLoadMore = () => {
    setShowAllFlights(true);
  };

  const handleShowLess = () => {
    setShowAllFlights(false);
  };

  return (
    <Box>
      {(title || subtitle) && (
        <Box sx={{ mb: 4 }}>
          {title && (
            <Typography 
              variant="h5" 
              sx={{ 
                textAlign: 'left', 
                mb: 2, 
                color: '#666',
                fontWeight: 500
              }}
            >
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography 
              variant="body1" 
              sx={{ 
                textAlign: 'left', 
                color: '#666',
                fontSize: '1rem'
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      )}

      <Grid container spacing={3}>
        {displayedFlights.map((flight) => (
          <Grid item xs={12} sm={6} key={flight.id}>
            <FlightCard flight={flight} onBook={onBook} />
          </Grid>
        ))}
      </Grid>

      {hasMoreFlights && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          {!showAllFlights ? (
            <Button
              variant="outlined"
              onClick={handleLoadMore}
              sx={{ 
                borderColor: '#10b981',
                color: '#10b981',
                '&:hover': { 
                  borderColor: '#059669',
                  backgroundColor: 'rgba(16, 185, 129, 0.04)'
                }
              }}
            >
              Load More Flights
            </Button>
          ) : (
            <Button
              variant="outlined"
              onClick={handleShowLess}
              sx={{ 
                borderColor: '#666',
                color: '#666',
                '&:hover': { 
                  borderColor: '#333',
                  backgroundColor: 'rgba(102, 102, 102, 0.04)'
                }
              }}
            >
              Show Less
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}
