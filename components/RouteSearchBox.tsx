'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Autocomplete, 
  Typography, 
  Card, 
  CardContent,
  Grid,
  Chip,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FlightIcon from '@mui/icons-material/Flight';
import { getCityImageUrl } from '@/lib/cdn';

interface Route {
  departure_city: string;
  arrival_city: string;
  departure_country: string;
  arrival_country: string;
  departure_iata: string;
  arrival_iata: string;
}

interface RouteSearchBoxProps {
  onRouteSelect: (route: Route) => void;
  userLocation?: {
    city: string;
    country: string;
    countryCode: string;
  };
}

export default function RouteSearchBox({ onRouteSelect, userLocation }: RouteSearchBoxProps) {
  const [departureCity, setDepartureCity] = useState(userLocation?.city || '');
  const [arrivalCity, setArrivalCity] = useState('');
  const [departureOptions, setDepartureOptions] = useState<string[]>([]);
  const [arrivalOptions, setArrivalOptions] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load city options from routes data
  useEffect(() => {
    const loadCityOptions = async () => {
      try {
        const response = await fetch('/api/routes');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            const cities = new Set<string>();
            data.data.availableRoutes?.forEach((route: Route) => {
              cities.add(route.departure_city);
              cities.add(route.arrival_city);
            });
            setDepartureOptions(Array.from(cities).sort());
            setArrivalOptions(Array.from(cities).sort());
          }
        }
      } catch (error) {
        console.error('Error loading city options:', error);
      }
    };

    loadCityOptions();
  }, []);

  const handleSearch = async () => {
    if (!departureCity || !arrivalCity) {
      setError('Please select both departure and arrival cities');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromCity: departureCity,
          toCity: arrivalCity
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSearchResults(data.data.routes || []);
        } else {
          setError(data.error || 'No routes found');
        }
      } else {
        setError('Failed to search routes');
      }
    } catch (error) {
      console.error('Error searching routes:', error);
      setError('Failed to search routes');
    } finally {
      setLoading(false);
    }
  };

  const handleRouteSelect = (route: Route) => {
    onRouteSelect(route);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
        Search Flight Routes
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <Autocomplete
                value={departureCity}
                onChange={(_, newValue) => setDepartureCity(newValue || '')}
                inputValue={departureCity}
                onInputChange={(_, newInputValue) => setDepartureCity(newInputValue)}
                options={departureOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="From"
                    placeholder="Departure city"
                    fullWidth
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <img
                        src={getCityImageUrl(option, 'small')}
                        alt={option}
                        style={{ width: 20, height: 20, borderRadius: 4 }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      {option}
                    </Box>
                  </Box>
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={1} sx={{ textAlign: 'center' }}>
              <FlightIcon sx={{ transform: 'rotate(90deg)', color: '#666' }} />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Autocomplete
                value={arrivalCity}
                onChange={(_, newValue) => setArrivalCity(newValue || '')}
                inputValue={arrivalCity}
                onInputChange={(_, newInputValue) => setArrivalCity(newInputValue)}
                options={arrivalOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="To"
                    placeholder="Arrival city"
                    fullWidth
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <img
                        src={getCityImageUrl(option, 'small')}
                        alt={option}
                        style={{ width: 20, height: 20, borderRadius: 4 }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      {option}
                    </Box>
                  </Box>
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleSearch}
                disabled={loading || !departureCity || !arrivalCity}
                startIcon={<SearchIcon />}
                sx={{ height: '56px' }}
              >
                {loading ? 'Searching...' : 'Search Routes'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {searchResults.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Available Routes ({searchResults.length})
          </Typography>
          <Grid container spacing={2}>
            {searchResults.map((route, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
                    transition: 'all 0.2s'
                  }}
                  onClick={() => handleRouteSelect(route)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <img
                        src={getCityImageUrl(route.departure_city, 'small')}
                        alt={route.departure_city}
                        style={{ width: 24, height: 24, borderRadius: 4, marginRight: 8 }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <Typography variant="h6" sx={{ flex: 1 }}>
                        {route.departure_city} → {route.arrival_city}
                      </Typography>
                      <img
                        src={getCityImageUrl(route.arrival_city, 'small')}
                        alt={route.arrival_city}
                        style={{ width: 24, height: 24, borderRadius: 4, marginLeft: 8 }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        label={`${route.departure_iata} → ${route.arrival_iata}`} 
                        size="small" 
                        sx={{ mr: 1, mb: 1 }}
                      />
                      <Chip 
                        label={`${route.departure_country} → ${route.arrival_country}`} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                    
                    <Button 
                      variant="outlined" 
                      fullWidth
                      onClick={() => handleRouteSelect(route)}
                    >
                      Select Route
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}
