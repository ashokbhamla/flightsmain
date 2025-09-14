'use client';

import { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Chip } from '@mui/material';
import FlightFilters from './FlightFilters';

interface Flight {
  from: string;
  to: string;
  city: string;
  duration: string;
  price: string;
  flightsPerDay: string;
  flightsPerWeek: string;
  airline: string;
  carrier: string;
  isDirect?: boolean;
  stops?: number;
}

interface FlightListWithFiltersProps {
  flights: Flight[];
  cityName: string;
  airportCode: string;
  getCityName: (iataCode: string) => string;
}

export default function FlightListWithFilters({ 
  flights, 
  cityName, 
  airportCode, 
  getCityName 
}: FlightListWithFiltersProps) {
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>(flights);

  const handleFilteredFlightsChange = (newFilteredFlights: Flight[]) => {
    setFilteredFlights(newFilteredFlights);
  };

  return (
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
      
      {/* Flight Filters */}
      <FlightFilters 
        flights={flights}
        onFilteredFlightsChange={handleFilteredFlightsChange}
      />
      
      {/* Flight Cards */}
      <Grid container spacing={3}>
        {filteredFlights.slice(0, 12).map((flight: any, index: number) => (
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
                  {flight.city} • {flight.duration} avg
                  {flight.stops !== undefined && (
                    <span> • {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</span>
                  )}
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

      {/* No Results Message */}
      {filteredFlights.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
            No flights match your current filters
          </Typography>
          <Typography variant="body2" sx={{ color: '#999' }}>
            Try adjusting your filter criteria to see more results
          </Typography>
        </Box>
      )}
    </Box>
  );
}
