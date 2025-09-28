'use client';

import { Box, Typography, Card, CardContent, Button, Divider } from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import LazyImage from './LazyImage';

interface FlightCardProps {
  flight: {
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
    departure_city_name?: string;
    arrival_city_name?: string;
  };
  onBook?: (flightId: number) => void;
}

export default function FlightCard({ flight, onBook }: FlightCardProps) {
  // Function to get city name from IATA code
  const getCityName = (iataCode: string) => {
    const cityMap: { [key: string]: string } = {
      'LAX': 'Los Angeles',
      'WAS': 'Washington, D.C.',
      'BWI': 'Baltimore',
      'IAD': 'Washington Dulles',
      'DCA': 'Washington Reagan',
      'JFK': 'New York',
      'ORD': 'Chicago',
      'DFW': 'Dallas',
      'ATL': 'Atlanta',
      'BOS': 'Boston',
      'MIA': 'Miami',
      'SFO': 'San Francisco',
      'SEA': 'Seattle',
      'DEN': 'Denver',
      'LAS': 'Las Vegas',
      'PHX': 'Phoenix',
      'MCO': 'Orlando',
      'CLT': 'Charlotte',
      'IAH': 'Houston',
      'DTW': 'Detroit',
      'DEL': 'Delhi',
      'BOM': 'Mumbai',
      'HYD': 'Hyderabad',
      'BLR': 'Bangalore',
      'CCU': 'Kolkata',
      'MAA': 'Chennai',
      'AMD': 'Ahmedabad',
      'PNQ': 'Pune',
      'COK': 'Kochi',
      'GOI': 'Goa'
    };
    return cityMap[iataCode] || iataCode;
  };

  return (
    <Card sx={{ 
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f0f0f0',
      '&:hover': { 
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
        transform: 'translateY(-2px)',
        transition: 'all 0.3s ease'
      }
    }}>
      <CardContent sx={{ p: 0 }}>
        {/* Top Section - Flight Route & Price */}
        <Box sx={{ p: 3, pb: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            position: 'relative'
          }}>
            {/* Left Side - Departure */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 700, 
                color: '#1a1a1a',
                fontSize: '1.5rem',
                mb: 0.5
              }}>
                {flight.departureRoute.split(' - ')[0]}
              </Typography>
              <Typography variant="body2" sx={{ 
                color: '#666',
                fontSize: '0.8rem',
                mb: 0.5
              }}>
                {flight.departure_city_name || getCityName(flight.departureRoute.split(' - ')[0])}
              </Typography>
              <Typography variant="body2" sx={{ 
                color: '#666',
                fontSize: '0.9rem',
                mb: 0.5
              }}>
                {flight.departure} • {flight.departureTime}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {flight.airlineLogo && (
                  <LazyImage
                    src={flight.airlineLogo}
                    alt={flight.airline}
                    width={24}
                    height={24}
                    placeholder="blur"
                    style={{ 
                      objectFit: 'contain' 
                    }}
                  />
                )}
                <Typography variant="body2" sx={{ 
                  color: '#10b981',
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}>
                  {flight.airline}
                </Typography>
              </Box>
            </Box>

            {/* Middle - Flight Path & Duration */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              mx: 2,
              position: 'relative'
            }}>
              <Typography variant="body2" sx={{ 
                color: '#666',
                fontSize: '0.8rem',
                mb: 1
              }}>
                {flight.duration}
              </Typography>
              
              {/* Flight Path Line */}
              <Box sx={{ 
                width: '60px',
                height: '2px',
                backgroundColor: '#e0e0e0',
                position: 'relative',
                mb: 1
              }}>
                {/* Flight Icon */}
                <FlightTakeoffIcon sx={{ 
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: '#10b981',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  p: 0.5
                }} />
              </Box>
            </Box>

            {/* Right Side - Arrival & Price */}
            <Box sx={{ flex: 1, textAlign: 'right' }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 700, 
                color: '#1a1a1a',
                fontSize: '1.5rem',
                mb: 0.5
              }}>
                {flight.departureRoute.split(' - ')[1]}
              </Typography>
              <Typography variant="body2" sx={{ 
                color: '#666',
                fontSize: '0.8rem',
                mb: 0.5
              }}>
                {flight.arrival_city_name || getCityName(flight.departureRoute.split(' - ')[1])}
              </Typography>
              <Typography variant="h5" sx={{ 
                fontWeight: 700, 
                color: '#10b981',
                fontSize: '1.3rem'
              }}>
                {flight.price}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Divider */}
        <Divider sx={{ mx: 3 }} />

        {/* Bottom Section - Details & Action */}
        <Box sx={{ 
          p: 3, 
          pt: 2,
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}>
          {/* Left Side - Flight Details */}
          <Typography variant="body2" sx={{ 
            color: '#666',
            fontSize: '0.9rem'
          }}>
            {flight.stops} • {flight.duration}
          </Typography>

          {/* Right Side - Book Now Button */}
          <Button
            variant="contained"
            onClick={() => onBook?.(flight.id)}
            sx={{
              backgroundColor: '#10b981',
              color: 'white',
              borderRadius: '0 8px 8px 0',
              px: 3,
              py: 1.5,
              fontWeight: 600,
              fontSize: '0.9rem',
              '&:hover': { backgroundColor: '#059669' }
            }}
          >
            Book Now
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
