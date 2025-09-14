'use client';

import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Chip, Link } from '@mui/material';
import { NormalizedFlight } from '@/lib/flightNormalizer';

interface FlightCardsProps {
  flights: NormalizedFlight[];
  title?: string;
  showAirlineInfo?: boolean;
  onFlightClick?: (flight: NormalizedFlight) => void;
}

export default function FlightCards({ 
  flights, 
  title = "Available Flights", 
  showAirlineInfo = true,
  onFlightClick 
}: FlightCardsProps) {
  if (!flights || flights.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No flights available
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {title && (
        <Typography 
          variant="h2" 
          sx={{ 
            fontSize: '1.8rem',
            fontWeight: 600,
            mb: 4,
            color: '#1a1a1a'
          }}
        >
          {title}
        </Typography>
      )}
      
      <Grid container spacing={3}>
        {flights.map((flight, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ 
              height: '100%',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f0f0f0',
              '&:hover': { 
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
              }
            }}>
              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Route Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                    {flight.from} → {flight.to}
                  </Typography>
                  <Chip 
                    label={flight.flightsPerDay}
                    size="small"
                    sx={{ 
                      backgroundColor: '#10b981',
                      color: 'white',
                      fontSize: '0.75rem'
                    }}
                  />
                </Box>
                
                {/* City Names */}
                <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                  {flight.city}
                </Typography>
                
                {/* Airport Info */}
                <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                  {flight.airport} • {flight.duration} avg
                </Typography>
                
                {/* Price and Frequency */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                    From {flight.price}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {flight.flightsPerWeek} flights/week
                  </Typography>
                </Box>

                {/* Airline Info */}
                {showAirlineInfo && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#666', mr: 1 }}>
                      Operated by:
                    </Typography>
                    <Link 
                      href={flight.airlineUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      sx={{ 
                        fontWeight: 600, 
                        color: '#1e3a8a',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      {flight.airline}
                    </Link>
                  </Box>
                )}

                {/* Action Button */}
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => onFlightClick?.(flight)}
                  sx={{
                    backgroundColor: '#1e3a8a',
                    color: 'white',
                    borderRadius: '4px',
                    py: 1.5,
                    fontWeight: 600,
                    mt: 'auto',
                    '&:hover': { 
                      backgroundColor: '#1e3a8a',
                      opacity: 0.9
                    }
                  }}
                >
                  View Flights
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
