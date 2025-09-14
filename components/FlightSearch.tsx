"use client";

import { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Popover,
  MenuItem,
  IconButton,
  Typography,
  Divider,
  Autocomplete
} from "@mui/material";
import { DateRange, DateRangePicker } from "@mui/x-date-pickers-pro";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SearchIcon from "@mui/icons-material/Search";

interface AirportOption {
  code: string;
  name: string;
  country: string;
}

const airports: AirportOption[] = [
  { code: "DEL", name: "Indira Gandhi International Airport", country: "India" },
  { code: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport", country: "India" },
  { code: "LAX", name: "Los Angeles International Airport", country: "USA" },
  { code: "JFK", name: "John F. Kennedy International Airport", country: "USA" },
  { code: "DXB", name: "Dubai International Airport", country: "UAE" }
];

const cabinClasses = ["Economy", "Premium Economy", "Business", "First Class"];

export default function FlightSearch() {
  const [tripType, setTripType] = useState(0);
  const [fromAirport, setFromAirport] = useState<AirportOption | null>(null);
  const [toAirport, setToAirport] = useState<AirportOption | null>(null);
  const [dates, setDates] = useState<DateRange<Date>>([null, null]);

  const [travelerAnchor, setTravelerAnchor] = useState<null | HTMLElement>(null);
  const [travelers, setTravelers] = useState(1);
  const [travelClass, setTravelClass] = useState("Economy");

  const openTraveler = Boolean(travelerAnchor);

  const handleTravelerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setTravelerAnchor(event.currentTarget);
  };

  const handleTravelerClose = () => {
    setTravelerAnchor(null);
  };

  const handleSearch = () => {
    console.log({
      tripType,
      fromAirport,
      toAirport,
      dates,
      travelers,
      travelClass
    });
  };

  return (
    <Box
      sx={{
        opacity: 1,
        transform: 'translateY(0)',
        transition: 'opacity 0.1s ease-out'
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          color: 'white',
          py: { xs: 4, sm: 6, md: 8 },
          px: { xs: 2, sm: 4, md: 6 },
          textAlign: 'left',
          mb: 4
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.6rem', sm: '1.9rem', md: '2.4rem' },
            fontWeight: 700,
            mb: 2,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          Find Your Perfect Flight
        </Typography>
        
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.3rem' },
            fontWeight: 400,
            mb: 4,
            opacity: 0.9,
            maxWidth: '800px',
            lineHeight: 1.4
          }}
        >
          Discover amazing deals on flights worldwide. Book with confidence.
        </Typography>

        {/* Search Box Integrated in Hero */}
        <Box
          sx={{
            width: '100%',
            mt: 4,
            backgroundColor: 'white',
            borderRadius: '4px',
            p: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Trip Type Tabs */}
          <Tabs
            value={tripType}
            onChange={(_, v) => setTripType(v)}
            sx={{ 
              mb: 3,
              '& .MuiTab-root': {
                color: '#666666',
                '&.Mui-selected': {
                  color: '#1e3a8a'
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#1e3a8a'
              }
            }}
          >
            <Tab label="Round trip" />
            <Tab label="One way" />
            <Tab label="Multi-city" />
          </Tabs>

          {/* Search Fields */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { 
                xs: "1fr", 
                sm: "1fr 1fr", 
                md: "1fr 1fr 1fr 1fr auto" 
              },
              gap: { xs: 2, sm: 2, md: 2 },
              alignItems: "center"
            }}
          >
            {/* From */}
            <Autocomplete
              options={airports}
              getOptionLabel={(option) => `${option.code} - ${option.name}`}
              value={fromAirport}
              onChange={(_, newValue) => setFromAirport(newValue)}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="From" 
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      borderRadius: '4px',
                      '& fieldset': {
                        borderColor: '#e0e0e0'
                      },
                      '&:hover fieldset': {
                        borderColor: '#1e3a8a'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1e3a8a'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: '#666666'
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#1e3a8a'
                    }
                  }}
                />
              )}
            />

            {/* To */}
            <Autocomplete
              options={airports}
              getOptionLabel={(option) => `${option.code} - ${option.name}`}
              value={toAirport}
              onChange={(_, newValue) => setToAirport(newValue)}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="To" 
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      borderRadius: '4px',
                      '& fieldset': {
                        borderColor: '#e0e0e0'
                      },
                      '&:hover fieldset': {
                        borderColor: '#1e3a8a'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1e3a8a'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: '#666666'
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#1e3a8a'
                    }
                  }}
                />
              )}
            />

            {/* Dates - Simplified for faster loading */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateRangePicker
                value={dates}
                onChange={(newValue) => setDates(newValue)}
                localeText={{ start: "Departure", end: "Return" }}
                slotProps={{
                  textField: { 
                    variant: "outlined", 
                    fullWidth: true,
                    placeholder: "Select dates",
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        '& fieldset': {
                          borderColor: '#e0e0e0'
                        },
                        '&:hover fieldset': {
                          borderColor: '#1e3a8a'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1e3a8a'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: '#666666'
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#1e3a8a'
                      }
                    }
                  }
                }}
                closeOnSelect={false}
                disableOpenPicker={false}
              />
            </LocalizationProvider>

            {/* Travelers & Class */}
            <TextField
              label="Travelers & Class"
              variant="outlined"
              value={`${travelers} Traveler${travelers > 1 ? "s" : ""}, ${travelClass}`}
              onClick={handleTravelerClick}
              sx={{ 
                cursor: "pointer",
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  '& fieldset': {
                    borderColor: '#e0e0e0'
                  },
                  '&:hover fieldset': {
                    borderColor: '#1e3a8a'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1e3a8a'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#666666'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#1e3a8a'
                }
              }}
              InputProps={{
                readOnly: true,
              }}
            />

            {/* Search Button */}
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              sx={{ 
                px: { xs: 2, sm: 3, md: 4 }, 
                py: { xs: 1.5, sm: 1.2, md: 1.2 },
                height: { xs: "48px", sm: "52px", md: "56px" },
                minWidth: { xs: "100px", sm: "110px", md: "120px" },
                backgroundColor: '#10b981',
                color: 'white',
                fontWeight: 600,
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1rem' },
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: '#059669'
                }
              }}
            >
              Search
            </Button>
          </Box>

          {/* Trust Factors and Additional Options */}
          <Box sx={{ mt: 3 }}>
            {/* Filters and Options */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between', 
              alignItems: { xs: 'flex-start', sm: 'center' }, 
              mb: 3,
              flexWrap: 'wrap',
              gap: { xs: 2, sm: 2, md: 2 }
            }}>
              {/* Left Side - Check Hotels */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                order: { xs: 2, sm: 1 }
              }}>
                <Box sx={{ 
                  width: 16, 
                  height: 16, 
                  backgroundColor: '#10b981', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  ✓
                </Box>
                <Box sx={{ 
                  width: 16, 
                  height: 16, 
                  color: '#10b981'
                }}>
                  🏨
                </Box>
                <Typography sx={{ 
                  color: '#666666', 
                  fontSize: { xs: '0.8rem', sm: '0.9rem' }
                }}>
                  Check hotels also clearbeds.com
                </Typography>
              </Box>

              {/* Right Side - Trust Badges */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { xs: 1, sm: 2 },
                flexWrap: 'wrap',
                order: { xs: 1, sm: 2 }
              }}>
                {/* Google Rating */}
                <Box sx={{
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  minWidth: '100px',
                  justifyContent: 'center',
                  border: '1px solid #e0e0e0'
                }}>
                  <Typography sx={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 'bold',
                    color: '#4285f4'
                  }}>
                    G
                  </Typography>
                  <Typography sx={{ fontSize: '0.9rem', color: '#333' }}>
                    4.8 Google
                  </Typography>
                </Box>

                {/* Trustpilot */}
                <Box sx={{
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  minWidth: '100px',
                  justifyContent: 'center',
                  border: '1px solid #e0e0e0'
                }}>
                  <Box sx={{ 
                    width: 16, 
                    height: 16, 
                    backgroundColor: '#00b67a', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    ✓
                  </Box>
                  <Typography sx={{ fontSize: '0.9rem', color: '#333' }}>
                    4.7 Trustpilot
                  </Typography>
                </Box>

                {/* TripAdvisor */}
                <Box sx={{
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  minWidth: '100px',
                  justifyContent: 'center',
                  border: '1px solid #e0e0e0'
                }}>
                  <Box sx={{ 
                    width: 16, 
                    height: 16, 
                    backgroundColor: '#00aa6c', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    ✓
                  </Box>
                  <Typography sx={{ fontSize: '0.9rem', color: '#333' }}>
                    4.5 TripAdvisor
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Traveler Popover */}
      <Popover
        open={openTraveler}
        anchorEl={travelerAnchor}
        onClose={handleTravelerClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="subtitle1">Travelers</Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <IconButton onClick={() => setTravelers(Math.max(1, travelers - 1))}>
              <RemoveIcon />
            </IconButton>
            <Typography sx={{ mx: 1 }}>{travelers}</Typography>
            <IconButton onClick={() => setTravelers(travelers + 1)}>
              <AddIcon />
            </IconButton>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Typography variant="subtitle1">Class</Typography>
          <TextField
            select
            value={travelClass}
            onChange={(e) => setTravelClass(e.target.value)}
            fullWidth
          >
            {cabinClasses.map((cabinClass) => (
              <MenuItem key={cabinClass} value={cabinClass}>
                {cabinClass}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Popover>
    </Box>
  );
}
