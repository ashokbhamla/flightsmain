'use client';

import { useState, useCallback, useEffect, memo } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  FormControlLabel, 
  Checkbox,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tabs,
  Tab,
  InputAdornment
} from '@mui/material';
import { Search as SearchIcon, FlightTakeoff, LocationOn, SwapHoriz } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { addDays } from 'date-fns';
import dynamic from 'next/dynamic';
import { getTranslations } from '@/lib/translations';
import { Locale } from '@/lib/i18n';
const UnifiedAirportPopup = dynamic(() => import('./UnifiedAirportPopup'), {
  ssr: false,
  loading: () => null
});

interface AirportOption {
  code: string;
  name: string;
  city_name: string;
  country_name: string;
  country_code: string;
  type: 'airport' | 'city';
  coordinates?: {
    lon: number;
    lat: number;
  };
}

interface FlightSearchBoxProps {
  className?: string;
  locale?: Locale;
  defaultFrom?: AirportOption;
  defaultTo?: AirportOption;
}

const FlightSearchBox = memo<FlightSearchBoxProps>(({ 
  className = '',
  locale = 'en',
  defaultFrom,
  defaultTo
}) => {
  const t = getTranslations(locale);
  const [tripType, setTripType] = useState(0);
  const [fromAirport, setFromAirport] = useState<AirportOption | null>(defaultFrom || null);
  const [toAirport, setToAirport] = useState<AirportOption | null>(defaultTo || null);
  const [fromInputValue, setFromInputValue] = useState(defaultFrom?.name || '');
  const [toInputValue, setToInputValue] = useState(defaultTo?.name || '');
  const [departureDate, setDepartureDate] = useState<Date | null>(new Date());
  const [returnDate, setReturnDate] = useState<Date | null>(addDays(new Date(), 7));
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([new Date(), addDays(new Date(), 7)]);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [travelClass, setTravelClass] = useState('Economy');
  const [travelerDialogOpen, setTravelerDialogOpen] = useState(false);
  const [includeHotels, setIncludeHotels] = useState(false);
  const [unifiedPopupOpen, setUnifiedPopupOpen] = useState(false);

  // Sync dateRange with individual dates
  useEffect(() => {
    setDateRange([departureDate, returnDate]);
  }, [departureDate, returnDate]);

  // Handle date range changes
  const handleDateRangeChange = (newValue: [Date | null, Date | null]) => {
    setDateRange(newValue);
    setDepartureDate(newValue[0]);
    setReturnDate(newValue[1]);
  };




  const handleSwapAirports = () => {
    const temp = fromAirport;
    setFromAirport(toAirport);
    setToAirport(temp);
    
    const tempInput = fromInputValue;
    setFromInputValue(toInputValue);
    setToInputValue(tempInput);
    
    // Close any open dropdowns
    // No longer needed with unified popup
  };

  const handleTravelerClick = () => {
    setTravelerDialogOpen(true);
  };

  // Unified popup handlers
  const [popupActiveTab, setPopupActiveTab] = useState<'from' | 'to'>('from');
  
  const handleFromClick = () => {
    setPopupActiveTab('from');
    setUnifiedPopupOpen(true);
  };

  const handleToClick = () => {
    setPopupActiveTab('to');
    setUnifiedPopupOpen(true);
  };

  const handleUnifiedPopupSelect = (option: AirportOption, isFrom: boolean) => {
    if (isFrom) {
      setFromAirport(option);
      setFromInputValue(`${option.code} - ${option.name}`);
      
      // Switch to "To" tab instead of closing popup
      setPopupActiveTab('to');
      
      // Auto-fill "To" field with popular destination as suggestion
      autoFillToDestination(option);
    } else {
      setToAirport(option);
      setToInputValue(`${option.code} - ${option.name}`);
      // Close popup after selecting "To"
      setUnifiedPopupOpen(false);
    }
  };

  // Function to auto-fill "To" destination based on "From" selection
  const autoFillToDestination = async (fromAirport: AirportOption) => {
    try {
      // Get popular destinations for the selected airport
      const popularDestinations = await getPopularDestinations(fromAirport.code);
      
      if (popularDestinations.length > 0) {
        // Select the first popular destination
        const suggestedDestination = popularDestinations[0];
        setToAirport(suggestedDestination);
        setToInputValue(`${suggestedDestination.code} - ${suggestedDestination.name}`);
      }
    } catch (error) {
      console.error('Error auto-filling destination:', error);
    }
  };

  // Function to get popular destinations for a given airport
  const getPopularDestinations = useCallback(async (airportCode: string): Promise<AirportOption[]> => {
    try {
      // This is a simplified version - in a real app, you'd call an API
      // For now, we'll return some popular destinations based on the airport
      const popularDestinations: { [key: string]: AirportOption[] } = {
        'DEL': [
          { code: 'BOM', name: 'Mumbai', city_name: 'Mumbai', country_name: 'India', country_code: 'IN', type: 'city' },
          { code: 'BLR', name: 'Bangalore', city_name: 'Bangalore', country_name: 'India', country_code: 'IN', type: 'city' },
          { code: 'DXB', name: 'Dubai', city_name: 'Dubai', country_name: 'United Arab Emirates', country_code: 'AE', type: 'city' },
          { code: 'SIN', name: 'Singapore', city_name: 'Singapore', country_name: 'Singapore', country_code: 'SG', type: 'city' },
          { code: 'LHR', name: 'London', city_name: 'London', country_name: 'United Kingdom', country_code: 'GB', type: 'city' }
        ],
        'BOM': [
          { code: 'DEL', name: 'Delhi', city_name: 'Delhi', country_name: 'India', country_code: 'IN', type: 'city' },
          { code: 'BLR', name: 'Bangalore', city_name: 'Bangalore', country_name: 'India', country_code: 'IN', type: 'city' },
          { code: 'DXB', name: 'Dubai', city_name: 'Dubai', country_name: 'United Arab Emirates', country_code: 'AE', type: 'city' },
          { code: 'SIN', name: 'Singapore', city_name: 'Singapore', country_name: 'Singapore', country_code: 'SG', type: 'city' },
          { code: 'LHR', name: 'London', city_name: 'London', country_name: 'United Kingdom', country_code: 'GB', type: 'city' }
        ],
        'LHR': [
          { code: 'CDG', name: 'Paris', city_name: 'Paris', country_name: 'France', country_code: 'FR', type: 'city' },
          { code: 'FRA', name: 'Frankfurt', city_name: 'Frankfurt', country_name: 'Germany', country_code: 'DE', type: 'city' },
          { code: 'MAD', name: 'Madrid', city_name: 'Madrid', country_name: 'Spain', country_code: 'ES', type: 'city' },
          { code: 'JFK', name: 'New York', city_name: 'New York', country_name: 'United States', country_code: 'US', type: 'city' },
          { code: 'DXB', name: 'Dubai', city_name: 'Dubai', country_name: 'United Arab Emirates', country_code: 'AE', type: 'city' }
        ],
        'JFK': [
          { code: 'LAX', name: 'Los Angeles', city_name: 'Los Angeles', country_name: 'United States', country_code: 'US', type: 'city' },
          { code: 'LHR', name: 'London', city_name: 'London', country_name: 'United Kingdom', country_code: 'GB', type: 'city' },
          { code: 'CDG', name: 'Paris', city_name: 'Paris', country_name: 'France', country_code: 'FR', type: 'city' },
          { code: 'FRA', name: 'Frankfurt', city_name: 'Frankfurt', country_name: 'Germany', country_code: 'DE', type: 'city' },
          { code: 'SFO', name: 'San Francisco', city_name: 'San Francisco', country_name: 'United States', country_code: 'US', type: 'city' }
        ],
        'LAX': [
          { code: 'JFK', name: 'New York', city_name: 'New York', country_name: 'United States', country_code: 'US', type: 'city' },
          { code: 'SFO', name: 'San Francisco', city_name: 'San Francisco', country_name: 'United States', country_code: 'US', type: 'city' },
          { code: 'LHR', name: 'London', city_name: 'London', country_name: 'United Kingdom', country_code: 'GB', type: 'city' },
          { code: 'NRT', name: 'Tokyo', city_name: 'Tokyo', country_name: 'Japan', country_code: 'JP', type: 'city' },
          { code: 'SYD', name: 'Sydney', city_name: 'Sydney', country_name: 'Australia', country_code: 'AU', type: 'city' }
        ]
      };

      return popularDestinations[airportCode] || [];
    } catch (error) {
      console.error('Error getting popular destinations:', error);
      return [];
    }
  }, []);

  // Search function for unified popup
  const searchAirports = useCallback(async (query: string): Promise<AirportOption[]> => {
    try {
      const response = await fetch(`/api/airports/search?q=${encodeURIComponent(query)}&locale=${locale}`);
      if (!response.ok) {
        throw new Error('Failed to search airports');
      }
      const data = await response.json();
      return data.airports || [];
    } catch (error) {
      console.error('Error searching airports:', error);
      return [];
    }
  }, [locale]);

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}${month}`;
  };

  const getClassCode = (classType: string): string => {
    switch (classType.toLowerCase()) {
      case 'economy': return '';
      case 'premium economy': return 'p';
      case 'business': return 'b';
      case 'first': return 'f';
      default: return '';
    }
  };

  const handleSearch = () => {
    try {
      if (!fromAirport || !toAirport || !departureDate) {
        console.log('Missing required fields:', { fromAirport, toAirport, departureDate });
        return;
      }

      const fromCode = fromAirport.code;
      const toCode = toAirport.code;
      const departureDateStr = formatDate(departureDate);
      const returnDateStr = tripType === 0 ? formatDate(returnDate) : '';
      const classCode = getClassCode(travelClass);
      const totalPassengers = adults + children + infants;
      
      // Create search URL format:
      // Round trip: DEL1709BOM19091 or DEL1709BOM1909b111
      // One way: DEL2309BOM1 or DEL2309BOMb111
      let searchCode = `${fromCode}${departureDateStr}${toCode}`;
      
      // Add return date only for round trip
      if (tripType === 0 && returnDate) {
        searchCode += returnDateStr;
      }
      
      // Add total passengers
      searchCode += totalPassengers.toString();
      
      // Add class code if not economy
      if (classCode) {
        searchCode += classCode;
      }
      
      // Add passenger breakdown: adults, infants, children
      if (adults > 0) searchCode += adults.toString();
      if (infants > 0) searchCode += infants.toString();
      if (children > 0) searchCode += children.toString();

      console.log('Search code generated:', searchCode);
      console.log('Trip type:', tripType === 0 ? 'Round Trip' : 'One Way');

      // Navigate to search page with proper URL
      if (typeof window !== 'undefined') {
        const currentLocale = window.location.pathname.split('/')[1] || 'en';
        const searchUrl = `/${currentLocale}/search#/flights/${searchCode}`;
        console.log('Navigating to:', searchUrl);
        window.location.href = searchUrl;
      }
    } catch (error) {
      console.error('Error in handleSearch:', error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box 
        className={className}
        sx={{ 
          backgroundColor: 'white',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
          p: { xs: 2, md: 3 },
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          position: 'relative',
          zIndex: 1,
          width: { xs: "100%", md: "auto" },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-2px)',
          }
        }}
      >
        {/* Trip Type Selection */}
        <Tabs
          value={tripType}
          onChange={(_, v) => setTripType(v)}
          sx={{ 
            mb: { xs: 2, md: 3 },
            '& .MuiTab-root': {
              color: '#6b7280',
              fontWeight: 600,
              fontSize: { xs: '16px', md: '1rem' },
              textTransform: 'none',
              minHeight: { xs: 56, md: 48 },
              px: { xs: 2, md: 3 },
              py: { xs: 1.5, md: 1 },
              '&.Mui-selected': {
                color: '#1e3a8a',
                fontWeight: 700
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#1e3a8a',
              height: { xs: 4, md: 3 },
              borderRadius: '2px 2px 0 0'
            }
          }}
        >
          <Tab label={t.flightSearch.roundTrip} />
          <Tab label={t.flightSearch.oneWay} />
          <Tab label={t.flightSearch.multiCity} />
        </Tabs>

        {/* Search Form - Responsive Layout */}
        <Box
          sx={{
            display: "flex",
            gap: { xs: 1.5, md: 2 },
            alignItems: "end",
            flexWrap: { xs: "wrap", md: "nowrap" },
            width: "100%"
          }}
        >
          {/* From */}
          <Box sx={{ 
            flex: { xs: "1 1 100%", sm: "1 1 200px", md: 1 },
            minWidth: { xs: "100%", sm: 200 },
            width: { xs: "100%", sm: "auto" }
          }}>
              <TextField 
                label={t.flightSearch.from} 
                variant="outlined"
                size="small"
              value={fromInputValue}
              onClick={handleFromClick}
                InputProps={{
                readOnly: true,
                  endAdornment: (
                  <InputAdornment position="end">
                    <FlightTakeoff sx={{ color: '#1e3a8a', fontSize: '1.2rem' }} />
                  </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    height: { xs: '64px', md: '56px' },
                    fontSize: { xs: '16px', md: '14px' },
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '& fieldset': {
                    borderColor: '#d1d5db',
                    borderWidth: '2px',
                    borderRadius: '12px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    },
                    '&:hover fieldset': {
                    borderColor: '#1e3a8a',
                    boxShadow: '0 0 0 3px rgba(30, 58, 138, 0.1)',
                    },
                    '&.Mui-focused fieldset': {
                    borderColor: '#1e3a8a',
                    borderWidth: '2px',
                    boxShadow: '0 0 0 3px rgba(30, 58, 138, 0.15)',
                    }
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '16px', md: '14px' },
                  color: '#6b7280',
                  fontWeight: 500,
                  transform: { xs: 'translate(14px, 20px) scale(1)', md: 'translate(14px, -9px) scale(1)' },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  },
                  '& .MuiInputLabel-shrink': {
                  transform: { xs: 'translate(14px, -9px) scale(0.75)', md: 'translate(14px, -9px) scale(0.75)' },
                  color: '#1e3a8a',
                  fontWeight: 600,
                },
                '& .MuiInputBase-input': {
                  color: '#1f2937',
                  fontWeight: 500,
                  cursor: 'pointer',
                  '&::placeholder': {
                    color: '#9ca3af',
                    opacity: 1,
                  }
                }
              }}
            />
          </Box>

          {/* Swap Button */}
          <IconButton
            onClick={handleSwapAirports}
            sx={{
              backgroundColor: '#f8fafc',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              '&:hover': {
                backgroundColor: '#e2e8f0',
                borderColor: '#1e3a8a',
                transform: 'scale(1.05)',
                boxShadow: '0 4px 12px rgba(30, 58, 138, 0.15)',
              },
              '&:active': {
                backgroundColor: '#cbd5e1',
                transform: 'scale(0.95)',
                boxShadow: '0 2px 8px rgba(30, 58, 138, 0.1)',
              },
              p: { xs: 1.5, md: 1 },
              minWidth: { xs: '48px', md: '40px' },
              minHeight: { xs: '48px', md: '40px' },
              width: { xs: '100%', md: 'auto' },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '& .MuiSvgIcon-root': {
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              },
              '&:hover .MuiSvgIcon-root': {
                transform: 'rotate(180deg)',
              }
            }}
          >
            <SwapHoriz sx={{ 
              color: '#64748b',
              fontSize: { xs: '24px', md: '20px' }
            }} />
          </IconButton>

          {/* To */}
          <Box sx={{ 
            flex: { xs: "1 1 100%", sm: "1 1 200px", md: 1 },
            minWidth: { xs: "100%", sm: 200 },
            width: { xs: "100%", sm: "auto" }
          }}>
              <TextField 
                label={t.flightSearch.to} 
                variant="outlined"
                size="small"
              value={toInputValue}
              onClick={handleToClick}
                InputProps={{
                readOnly: true,
                  endAdornment: (
                  <InputAdornment position="end">
                    <LocationOn sx={{ color: '#10b981', fontSize: '1.2rem' }} />
                  </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    height: { xs: '64px', md: '56px' },
                    fontSize: { xs: '16px', md: '14px' },
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '& fieldset': {
                    borderColor: '#d1d5db',
                    borderWidth: '2px',
                    borderRadius: '12px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    },
                    '&:hover fieldset': {
                    borderColor: '#1e3a8a',
                    boxShadow: '0 0 0 3px rgba(30, 58, 138, 0.1)',
                    },
                    '&.Mui-focused fieldset': {
                    borderColor: '#1e3a8a',
                    borderWidth: '2px',
                    boxShadow: '0 0 0 3px rgba(30, 58, 138, 0.15)',
                    }
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '16px', md: '14px' },
                  color: '#6b7280',
                  fontWeight: 500,
                  transform: { xs: 'translate(14px, 20px) scale(1)', md: 'translate(14px, -9px) scale(1)' },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  },
                  '& .MuiInputLabel-shrink': {
                  transform: { xs: 'translate(14px, -9px) scale(0.75)', md: 'translate(14px, -9px) scale(0.75)' },
                  color: '#1e3a8a',
                  fontWeight: 600,
                },
                '& .MuiInputBase-input': {
                  color: '#1f2937',
                  fontWeight: 500,
                  cursor: 'pointer',
                  '&::placeholder': {
                    color: '#9ca3af',
                    opacity: 1,
                  }
                }
              }}
            />
          </Box>

          {/* Date Selection */}
          <Box sx={{ 
            flex: { xs: "1 1 100%", sm: "1 1 200px", md: 1 },
            minWidth: { xs: "100%", sm: 200 },
            width: { xs: "100%", sm: "auto" }
          }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              {tripType === 1 ? (
                // One Way - Single Date Picker
                <DatePicker
                  label={t.flightSearch.departure}
                  value={departureDate}
                  onChange={(newValue: Date | null) => setDepartureDate(newValue)}
                  sx={{
                    width: '100%',
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      height: { xs: '64px', md: '56px' },
                      fontSize: { xs: '16px', md: '14px' },
                      borderRadius: '12px',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '& fieldset': {
                        borderColor: '#d1d5db',
                        borderWidth: '2px',
                        borderRadius: '12px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#1e3a8a',
                        boxShadow: '0 0 0 3px rgba(30, 58, 138, 0.1)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1e3a8a',
                        borderWidth: '2px',
                        boxShadow: '0 0 0 3px rgba(30, 58, 138, 0.15)',
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '16px', md: '14px' },
                      color: '#6b7280',
                      fontWeight: 500,
                      transform: { xs: 'translate(14px, 20px) scale(1)', md: 'translate(14px, -9px) scale(1)' },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    },
                    '& .MuiInputLabel-shrink': {
                      transform: { xs: 'translate(14px, -9px) scale(0.75)', md: 'translate(14px, -9px) scale(0.75)' },
                      color: '#1e3a8a',
                      fontWeight: 600,
                    },
                    '& .MuiInputBase-input': {
                      color: '#1f2937',
                      fontWeight: 500,
                    }
                  }}
                />
              ) : (
                // Round Trip - Date Range Picker (Single Input)
                <DateRangePicker
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  sx={{
                    width: '100%',
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      height: { xs: '64px', md: '56px' },
                      fontSize: { xs: '16px', md: '14px' },
                      borderRadius: '12px',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '& fieldset': {
                        borderColor: '#d1d5db',
                        borderWidth: '2px',
                        borderRadius: '12px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#1e3a8a',
                        boxShadow: '0 0 0 3px rgba(30, 58, 138, 0.1)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1e3a8a',
                        borderWidth: '2px',
                        boxShadow: '0 0 0 3px rgba(30, 58, 138, 0.15)',
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '16px', md: '14px' },
                      color: '#6b7280',
                      fontWeight: 500,
                      transform: { xs: 'translate(14px, 20px) scale(1)', md: 'translate(14px, -9px) scale(1)' },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    },
                    '& .MuiInputLabel-shrink': {
                      transform: { xs: 'translate(14px, -9px) scale(0.75)', md: 'translate(14px, -9px) scale(0.75)' },
                      color: '#1e3a8a',
                      fontWeight: 600,
                    },
                    '& .MuiInputBase-input': {
                      color: '#1f2937',
                      fontWeight: 500,
                    }
                  }}
                />
              )}
            </LocalizationProvider>
          </Box>

          {/* Travelers & Class */}
          <TextField
            label="Travelers & Class"
            variant="outlined"
            size="small"
            value={`${adults + children + infants} Traveler${adults + children + infants > 1 ? "s" : ""}, ${travelClass}`}
            onClick={handleTravelerClick}
            sx={{ 
              flex: { xs: "1 1 100%", sm: "1 1 200px", md: 1 },
              minWidth: { xs: "100%", sm: 200 },
              width: { xs: "100%", sm: "auto" },
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                height: { xs: '64px', md: '56px' },
                fontSize: { xs: '16px', md: '14px' },
                cursor: 'pointer',
                borderRadius: '12px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '& fieldset': {
                  borderColor: '#d1d5db',
                  borderWidth: '2px',
                  borderRadius: '12px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                },
                '&:hover fieldset': {
                  borderColor: '#1e3a8a',
                  boxShadow: '0 0 0 3px rgba(30, 58, 138, 0.1)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1e3a8a',
                  borderWidth: '2px',
                  boxShadow: '0 0 0 3px rgba(30, 58, 138, 0.15)',
                }
              },
              '& .MuiInputLabel-root': {
                fontSize: { xs: '16px', md: '14px' },
                color: '#6b7280',
                fontWeight: 500,
                transform: { xs: 'translate(14px, 20px) scale(1)', md: 'translate(14px, -9px) scale(1)' },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              },
              '& .MuiInputLabel-shrink': {
                transform: { xs: 'translate(14px, -9px) scale(0.75)', md: 'translate(14px, -9px) scale(0.75)' },
                color: '#1e3a8a',
                fontWeight: 600,
              },
              '& .MuiInputBase-input': {
                color: '#1f2937',
                fontWeight: 500,
                cursor: 'pointer',
              }
            }}
            InputProps={{
              readOnly: true,
            }}
          />

          {/* Search Button */}
          <Button
            variant="contained"
            onClick={handleSearch}
            startIcon={<SearchIcon />}
            sx={{
              backgroundColor: '#1e3a8a',
              color: 'white',
              px: { xs: 3, md: 4 },
              py: { xs: 2, md: 1.5 },
              fontSize: { xs: '16px', md: '1rem' },
              fontWeight: 600,
              textTransform: 'none',
              minHeight: { xs: '64px', md: '56px' },
              minWidth: { xs: '100%', md: 120 },
              width: { xs: '100%', md: 'auto' },
              borderRadius: '12px',
              boxShadow: '0 4px 14px 0 rgba(30, 58, 138, 0.25)',
              '&:hover': {
                backgroundColor: '#1e40af',
                boxShadow: '0 6px 20px 0 rgba(30, 58, 138, 0.4)',
                transform: 'translateY(-1px)',
              },
              '&:active': {
                backgroundColor: '#1d4ed8',
                transform: 'translateY(0) scale(0.98)',
                boxShadow: '0 2px 8px 0 rgba(30, 58, 138, 0.3)'
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '& .MuiButton-startIcon': {
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              },
              '&:hover .MuiButton-startIcon': {
                transform: 'scale(1.1)',
              }
            }}
          >
            {t.flightSearch.search}
          </Button>
        </Box>

          {/* Hotels Checkbox */}
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={includeHotels}
                onChange={(e) => setIncludeHotels(e.target.checked)}
                sx={{
                  color: '#1e3a8a',
                  '&.Mui-checked': {
                    color: '#1e3a8a'
                  }
                }}
              />
            }
            label={
              <Typography sx={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: 500 }}>
                Include hotels in search
              </Typography>
            }
          />
        </Box>

        {/* Traveler Selection Dialog */}
        <Dialog open={travelerDialogOpen} onClose={() => setTravelerDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Travelers & Class</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
              {/* Adults */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6">{t.flightSearch.adults}</Typography>
                  <Typography variant="body2" color="text.secondary">12+ years</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    sx={{ minWidth: 40 }}
                    disabled={adults <= 1}
                  >
                    -
                  </Button>
                  <Typography sx={{ minWidth: 20, textAlign: 'center' }}>{adults}</Typography>
            <Button
              variant="outlined"
                    onClick={() => setAdults(adults + 1)}
                    sx={{ minWidth: 40 }}
                  >
                    +
                  </Button>
                </Box>
              </Box>

              {/* Children */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6">{t.flightSearch.children}</Typography>
                  <Typography variant="body2" color="text.secondary">2-11 years</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    sx={{ minWidth: 40 }}
                    disabled={children <= 0}
                  >
                    -
            </Button>
                  <Typography sx={{ minWidth: 20, textAlign: 'center' }}>{children}</Typography>
            <Button
              variant="outlined"
                    onClick={() => setChildren(children + 1)}
                    sx={{ minWidth: 40 }}
                  >
                    +
                  </Button>
                </Box>
              </Box>

              {/* Infants */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6">{t.flightSearch.infants}</Typography>
                  <Typography variant="body2" color="text.secondary">Under 2 years</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setInfants(Math.max(0, infants - 1))}
                    sx={{ minWidth: 40 }}
                    disabled={infants <= 0}
                  >
                    -
            </Button>
                  <Typography sx={{ minWidth: 20, textAlign: 'center' }}>{infants}</Typography>
            <Button
              variant="outlined"
                    onClick={() => setInfants(infants + 1)}
                    sx={{ minWidth: 40 }}
                    disabled={infants >= adults}
                  >
                    +
            </Button>
          </Box>
        </Box>

              <FormControl fullWidth>
                <InputLabel>Class</InputLabel>
                <Select
                  value={travelClass}
                  onChange={(e) => setTravelClass(e.target.value)}
                  label="Class"
                >
                  <MenuItem value="Economy">Economy</MenuItem>
                  <MenuItem value="Premium Economy">Premium Economy</MenuItem>
                  <MenuItem value="Business">Business</MenuItem>
                  <MenuItem value="First">First</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTravelerDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setTravelerDialogOpen(false)} variant="contained">
              Apply
            </Button>
          </DialogActions>
        </Dialog>

        {/* Unified Airport Popup */}
        <UnifiedAirportPopup
          open={unifiedPopupOpen}
          onClose={() => setUnifiedPopupOpen(false)}
          onSelect={handleUnifiedPopupSelect}
          currentFrom={fromAirport}
          currentTo={toAirport}
          searchAirports={searchAirports}
          locale={locale}
          initialTab={popupActiveTab}
        />
      </Box>
    </LocalizationProvider>
  );
});

FlightSearchBox.displayName = 'FlightSearchBox';

export default FlightSearchBox;