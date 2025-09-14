'use client';

import React from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { FlightTakeoff, FlightLand } from '@mui/icons-material';
import { NormalizedFlight } from '@/lib/flightNormalizer';

interface FlightRouteCardProps {
  flight: NormalizedFlight;
  onBookClick?: (flight: NormalizedFlight) => void;
}

export default function FlightRouteCard({ flight, onBookClick }: FlightRouteCardProps) {
  const handleBookClick = () => {
    if (onBookClick) {
      onBookClick(flight);
    }
  };

  return (
    <Card 
      sx={{ 
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Top Section - Airport Codes and Duration */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          {/* Departure */}
          <Box sx={{ textAlign: 'left' }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold', 
                fontSize: '1.8rem',
                color: '#1a1a1a',
                lineHeight: 1
              }}
            >
              {flight.from}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#666',
                fontSize: '0.9rem',
                mt: 0.5
              }}
            >
              {flight.city}
            </Typography>
          </Box>

          {/* Duration and Flight Icon */}
          <Box sx={{ textAlign: 'center', flex: 1, mx: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: '#1a1a1a',
                mb: 1
              }}
            >
              {flight.duration}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box 
                sx={{ 
                  width: '60px', 
                  height: '2px', 
                  backgroundColor: '#e0e0e0',
                  position: 'relative'
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#1e3a8a',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FlightTakeoff sx={{ fontSize: '8px', color: 'white' }} />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Arrival and Price */}
          <Box sx={{ textAlign: 'right' }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold', 
                fontSize: '1.8rem',
                color: '#1a1a1a',
                lineHeight: 1
              }}
            >
              {flight.to}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#666',
                fontSize: '0.9rem',
                mt: 0.5
              }}
            >
              {flight.city}
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 'bold',
                color: '#10b981',
                fontSize: '1.4rem',
                mt: 1
              }}
            >
              {flight.price}
            </Typography>
          </Box>
        </Box>

        {/* Middle Section - Flight Details */}
        <Box sx={{ mb: 2 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666',
              mb: 1
            }}
          >
            {flight.from} - {flight.city} • {flight.airport}
          </Typography>
          
          {/* Airline Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box 
              sx={{ 
                width: '20px', 
                height: '20px', 
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1
              }}
            >
              <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: 'bold' }}>
                {flight.airlineCode}
              </Typography>
            </Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#10b981',
                fontWeight: 500
              }}
            >
              {flight.airline}
            </Typography>
          </Box>
        </Box>

        {/* Bottom Section - Stops and Book Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#666',
                mb: 0.5
              }}
            >
              {flight.flightsPerDay} • {flight.flightsPerWeek}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#999',
                fontSize: '0.8rem'
              }}
            >
              {flight.airlineCountry}
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            onClick={handleBookClick}
            sx={{
              backgroundColor: '#10b981',
              color: 'white',
              fontWeight: 'bold',
              px: 3,
              py: 1,
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '0.9rem',
              '&:hover': {
                backgroundColor: '#059669',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            Book Now
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
