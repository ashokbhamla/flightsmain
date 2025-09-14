'use client';

import { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  Chip, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Checkbox, 
  FormControlLabel, 
  FormGroup, 
  Paper,
  Collapse
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

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

interface FlightFiltersProps {
  flights: Flight[];
  onFilteredFlightsChange: (filteredFlights: Flight[]) => void;
}

export default function FlightFilters({ flights, onFilteredFlightsChange }: FlightFiltersProps) {
  const [filters, setFilters] = useState({
    directOnly: false,
    stops: 'all', // 'all', '0', '1', '2+'
    airlines: [] as string[],
    sortBy: 'price' // 'price', 'duration', 'airline'
  });
  
  const [showFilters, setShowFilters] = useState(false);

  // Get unique airlines from flights
  const availableAirlines = useMemo(() => {
    const airlines = flights
      .map(flight => flight.airline)
      .filter((airline, index, self) => airline && self.indexOf(airline) === index);
    return airlines.sort();
  }, [flights]);

  // Filter and sort flights
  const filteredFlights = useMemo(() => {
    let filtered = [...flights];

    // Filter by direct flights
    if (filters.directOnly) {
      filtered = filtered.filter(flight => flight.isDirect || flight.stops === 0);
    }

    // Filter by stops
    if (filters.stops !== 'all') {
      if (filters.stops === '0') {
        filtered = filtered.filter(flight => flight.isDirect || flight.stops === 0);
      } else if (filters.stops === '1') {
        filtered = filtered.filter(flight => flight.stops === 1);
      } else if (filters.stops === '2+') {
        filtered = filtered.filter(flight => (flight.stops || 0) >= 2);
      }
    }

    // Filter by airlines
    if (filters.airlines.length > 0) {
      filtered = filtered.filter(flight => 
        flight.airline && filters.airlines.includes(flight.airline)
      );
    }

    // Sort flights
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price':
          const priceA = parseInt(a.price.replace('$', '')) || 0;
          const priceB = parseInt(b.price.replace('$', '')) || 0;
          return priceA - priceB;
        case 'duration':
          const durationA = parseInt(a.duration.replace(' min', '')) || 0;
          const durationB = parseInt(b.duration.replace(' min', '')) || 0;
          return durationA - durationB;
        case 'airline':
          return (a.airline || '').localeCompare(b.airline || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [flights, filters]);

  // Update parent component when filtered flights change
  useMemo(() => {
    onFilteredFlightsChange(filteredFlights);
  }, [filteredFlights, onFilteredFlightsChange]);

  const handleFilterChange = (filterType: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleAirlineChange = (airline: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      airlines: checked 
        ? [...prev.airlines, airline]
        : prev.airlines.filter(a => a !== airline)
    }));
  };

  const clearFilters = () => {
    setFilters({
      directOnly: false,
      stops: 'all',
      airlines: [],
      sortBy: 'price'
    });
  };

  const activeFiltersCount = [
    filters.directOnly,
    filters.stops !== 'all',
    filters.airlines.length > 0
  ].filter(Boolean).length;

  return (
    <Box sx={{ mb: 4 }}>
      {/* Filter Toggle Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontSize: '1.1rem',
            fontWeight: 600,
            color: '#1a1a1a'
          }}
        >
          Filter Flights
          {activeFiltersCount > 0 && (
            <Chip 
              label={activeFiltersCount} 
              size="small" 
              sx={{ 
                ml: 1, 
                backgroundColor: '#1e3a8a', 
                color: 'white',
                fontSize: '0.7rem',
                height: '20px'
              }} 
            />
          )}
        </Typography>
        <Button
          onClick={() => setShowFilters(!showFilters)}
          endIcon={showFilters ? <ExpandLess /> : <ExpandMore />}
          sx={{ 
            textTransform: 'none',
            color: '#1e3a8a',
            fontWeight: 500
          }}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </Box>

      {/* Filter Controls */}
      <Collapse in={showFilters}>
        <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8fafc' }}>
          <Grid container spacing={3}>
            {/* Direct Flights Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.directOnly}
                    onChange={(e) => handleFilterChange('directOnly', e.target.checked)}
                    sx={{ color: '#1e3a8a' }}
                  />
                }
                label="Direct flights only"
              />
            </Grid>

            {/* Stops Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Stops</InputLabel>
                <Select
                  value={filters.stops}
                  label="Stops"
                  onChange={(e) => handleFilterChange('stops', e.target.value)}
                  sx={{ backgroundColor: 'white' }}
                >
                  <MenuItem value="all">All stops</MenuItem>
                  <MenuItem value="0">Non-stop</MenuItem>
                  <MenuItem value="1">1 stop</MenuItem>
                  <MenuItem value="2+">2+ stops</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Sort By Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={filters.sortBy}
                  label="Sort by"
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  sx={{ backgroundColor: 'white' }}
                >
                  <MenuItem value="price">Price</MenuItem>
                  <MenuItem value="duration">Duration</MenuItem>
                  <MenuItem value="airline">Airline</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Clear Filters */}
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                onClick={clearFilters}
                fullWidth
                sx={{ 
                  borderColor: '#1e3a8a',
                  color: '#1e3a8a',
                  '&:hover': {
                    borderColor: '#1e40af',
                    backgroundColor: '#f1f5f9'
                  }
                }}
              >
                Clear Filters
              </Button>
            </Grid>

            {/* Airlines Filter */}
            {availableAirlines.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#1a1a1a' }}>
                  Airlines
                </Typography>
                <FormGroup row>
                  {availableAirlines.map((airline) => (
                    <FormControlLabel
                      key={airline}
                      control={
                        <Checkbox
                          checked={filters.airlines.includes(airline)}
                          onChange={(e) => handleAirlineChange(airline, e.target.checked)}
                          sx={{ color: '#1e3a8a' }}
                        />
                      }
                      label={airline}
                      sx={{ mr: 2 }}
                    />
                  ))}
                </FormGroup>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Collapse>

      {/* Results Count */}
      <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
        Showing {filteredFlights.length} of {flights.length} flights
      </Typography>
    </Box>
  );
}
