"use client";

import { useState } from "react";
import { Box, Container, Typography, Grid, Card, CardContent, Button, Chip } from "@mui/material";
import { useRouter } from "next/navigation";
import FlightSearchBox from "@/components/FlightSearchBox";

const airlines = [
  {
    code: "aa",
    name: "American Airlines",
    logo: "✈️",
    description: "One of the world's largest airlines, offering extensive domestic and international routes",
    routes: [
      { from: "LAX", to: "JFK", fromCity: "Los Angeles", toCity: "New York" },
      { from: "DFW", to: "LAX", fromCity: "Dallas", toCity: "Los Angeles" },
      { from: "JFK", to: "LHR", fromCity: "New York", toCity: "London" },
      { from: "MIA", to: "LAX", fromCity: "Miami", toCity: "Los Angeles" }
    ],
    color: "#FF6B35"
  },
  {
    code: "dl",
    name: "Delta Air Lines",
    logo: "🛩️",
    description: "Leading US airline known for excellent customer service and extensive route network",
    routes: [
      { from: "ATL", to: "LAX", fromCity: "Atlanta", toCity: "Los Angeles" },
      { from: "JFK", to: "ATL", fromCity: "New York", toCity: "Atlanta" },
      { from: "LAX", to: "NRT", fromCity: "Los Angeles", toCity: "Tokyo" },
      { from: "SEA", to: "JFK", fromCity: "Seattle", toCity: "New York" }
    ],
    color: "#0066CC"
  },
  {
    code: "ua",
    name: "United Airlines",
    logo: "✈️",
    description: "Major US carrier with strong international presence and Star Alliance membership",
    routes: [
      { from: "SFO", to: "JFK", fromCity: "San Francisco", toCity: "New York" },
      { from: "ORD", to: "LAX", fromCity: "Chicago", toCity: "Los Angeles" },
      { from: "EWR", to: "LHR", fromCity: "Newark", toCity: "London" },
      { from: "DEN", to: "SFO", fromCity: "Denver", toCity: "San Francisco" }
    ],
    color: "#800080"
  },
  {
    code: "wn",
    name: "Southwest Airlines",
    logo: "✈️",
    description: "Low-cost carrier known for no baggage fees and flexible booking policies",
    routes: [
      { from: "DAL", to: "LAX", fromCity: "Dallas", toCity: "Los Angeles" },
      { from: "MDW", to: "DEN", fromCity: "Chicago", toCity: "Denver" },
      { from: "BWI", to: "FLL", fromCity: "Baltimore", toCity: "Fort Lauderdale" },
      { from: "PHX", to: "LAS", fromCity: "Phoenix", toCity: "Las Vegas" }
    ],
    color: "#FFD700"
  },
  {
    code: "ba",
    name: "British Airways",
    logo: "✈️",
    description: "UK's flag carrier offering premium service and extensive European network",
    routes: [
      { from: "LHR", to: "JFK", fromCity: "London", toCity: "New York" },
      { from: "LHR", to: "LAX", fromCity: "London", toCity: "Los Angeles" },
      { from: "LHR", to: "CDG", fromCity: "London", toCity: "Paris" },
      { from: "LHR", to: "FCO", fromCity: "London", toCity: "Rome" }
    ],
    color: "#1E3A8A"
  },
  {
    code: "lh",
    name: "Lufthansa",
    logo: "✈️",
    description: "Germany's largest airline and Star Alliance founding member",
    routes: [
      { from: "FRA", to: "JFK", fromCity: "Frankfurt", toCity: "New York" },
      { from: "FRA", to: "LAX", fromCity: "Frankfurt", toCity: "Los Angeles" },
      { from: "FRA", to: "NRT", fromCity: "Frankfurt", toCity: "Tokyo" },
      { from: "FRA", to: "SIN", fromCity: "Frankfurt", toCity: "Singapore" }
    ],
    color: "#1E40AF"
  }
];

export default function AirlinesPage() {
  const [selectedAirline, setSelectedAirline] = useState<string | null>(null);
  const router = useRouter();

  const handleAirlineClick = (airlineCode: string) => {
    setSelectedAirline(airlineCode);
  };

  const handleRouteClick = (from: string, to: string) => {
    router.push(`/flights/${from}${to}`);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Flight Search Box */}
      <Box sx={{ mb: 4 }}>
        <FlightSearchBox />
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            fontWeight: 700,
            textAlign: 'center',
            mb: 2,
            color: '#1a1a1a'
          }}
        >
          Airlines
        </Typography>
        
        <Typography 
          variant="h2" 
          sx={{ 
            fontSize: '1.2rem',
            fontWeight: 400,
            textAlign: 'center',
            mb: 6,
            color: '#666',
            maxWidth: '600px',
            mx: 'auto'
          }}
        >
          Browse and compare flights from major airlines worldwide. Find the best airline deals for your next trip.
        </Typography>

        <Grid container spacing={3}>
          {airlines.map((airline) => (
            <Grid item xs={12} sm={6} md={4} key={airline.code}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  }
                }}
                onClick={() => handleAirlineClick(airline.code)}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography 
                      sx={{ 
                        fontSize: '2rem', 
                        mr: 2,
                        color: airline.color
                      }}
                    >
                      {airline.logo}
                    </Typography>
                    <Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          color: '#1a1a1a',
                          mb: 0.5
                        }}
                      >
                        {airline.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#666',
                          textTransform: 'uppercase',
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}
                      >
                        {airline.code.toUpperCase()}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#666',
                      mb: 3,
                      lineHeight: 1.5
                    }}
                  >
                    {airline.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: 600,
                        color: '#1a1a1a',
                        mb: 1
                      }}
                    >
                      Popular Routes:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {airline.routes.slice(0, 3).map((route, index) => (
                        <Chip
                          key={index}
                          label={`${route.from} → ${route.to}`}
                          size="small"
                          sx={{
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            fontSize: '0.75rem',
                            height: '24px',
                            '&:hover': {
                              backgroundColor: airline.color,
                              color: 'white',
                            }
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRouteClick(route.from, route.to);
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: airline.color,
                      color: 'white',
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1,
                      '&:hover': {
                        backgroundColor: airline.color,
                        opacity: 0.9,
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/airlines/${airline.code}`);
                    }}
                  >
                    View Flights
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}