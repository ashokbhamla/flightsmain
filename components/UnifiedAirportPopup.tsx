'use client';

import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  InputAdornment,
  CircularProgress,
  Chip,
  Fade,
  Backdrop,
  IconButton,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  FlightTakeoff,
  LocationOn,
  Close as CloseIcon,
  Star
} from '@mui/icons-material';
import { getCountryFlag } from '@/lib/countryFlags';

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

interface UnifiedAirportPopupProps {
  open: boolean;
  onClose: () => void;
  onSelect: (option: AirportOption, isFrom: boolean) => void;
  currentFrom?: AirportOption | null;
  currentTo?: AirportOption | null;
  searchAirports: (query: string) => Promise<AirportOption[]>;
  locale?: string;
  initialTab?: 'from' | 'to';
}

const UnifiedAirportPopup = memo(function UnifiedAirportPopup({
  open,
  onClose,
  onSelect,
  currentFrom,
  currentTo,
  searchAirports,
  locale = 'en',
  initialTab = 'from'
}: UnifiedAirportPopupProps) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState<'from' | 'to'>(initialTab);

  // Update active tab when initialTab prop changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<AirportOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<AirportOption[]>([]);
  const [popularDestinations, setPopularDestinations] = useState<AirportOption[]>([]);
  const [isSearchInitialized, setIsSearchInitialized] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Debounced search function - only works when search is initialized
  const debouncedSearch = useCallback(
    (query: string) => {
      if (!isSearchInitialized) return;
      
      const timeoutId = setTimeout(async () => {
        if (query.length > 0) {
          setLoading(true);
          try {
            const results = await searchAirports(query);
            setOptions(results);
          } catch (error) {
            console.error('Search error:', error);
            setOptions([]);
          } finally {
            setLoading(false);
          }
        } else {
          setOptions([]);
        }
      }, 300);
      
      return () => clearTimeout(timeoutId);
    },
    [searchAirports, isSearchInitialized]
  );

  // Initialize search functionality when user clicks on input
  const initializeSearch = useCallback(() => {
    if (!isSearchInitialized) {
      setIsSearchInitialized(true);
      // Load popular destinations when search is initialized
      loadPopularDestinations();
    }
  }, [isSearchInitialized]);

  // Load popular destinations
  const loadPopularDestinations = useCallback(() => {
    const popular: AirportOption[] = [
      { code: 'JFK', name: 'New York JFK', city_name: 'New York', country_name: 'United States', country_code: 'US', type: 'airport' },
      { code: 'LAX', name: 'Los Angeles', city_name: 'Los Angeles', country_name: 'United States', country_code: 'US', type: 'airport' },
      { code: 'LHR', name: 'London Heathrow', city_name: 'London', country_name: 'United Kingdom', country_code: 'GB', type: 'airport' },
      { code: 'CDG', name: 'Paris Charles de Gaulle', city_name: 'Paris', country_name: 'France', country_code: 'FR', type: 'airport' },
      { code: 'NRT', name: 'Tokyo Narita', city_name: 'Tokyo', country_name: 'Japan', country_code: 'JP', type: 'airport' },
      { code: 'SYD', name: 'Sydney', city_name: 'Sydney', country_name: 'Australia', country_code: 'AU', type: 'airport' },
      { code: 'DXB', name: 'Dubai', city_name: 'Dubai', country_name: 'United Arab Emirates', country_code: 'AE', type: 'airport' },
      { code: 'SIN', name: 'Singapore Changi', city_name: 'Singapore', country_name: 'Singapore', country_code: 'SG', type: 'airport' }
    ];
    setPopularDestinations(popular);
  }, []);

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Handle input focus/click to initialize search
  const handleInputFocus = () => {
    initializeSearch();
  };

  // Handle option selection
  const handleOptionSelect = (option: AirportOption) => {
    onSelect(option, activeTab === 'from');
    
    // Add to recent searches
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.code !== option.code);
      return [option, ...filtered].slice(0, 5);
    });
    
    // If selecting From, switch to To immediately (local UX safety)
    if (activeTab === 'from') {
      setActiveTab('to');
      setSearchTerm('');
      setOptions([]);
    }

    // Don't close popup automatically - let parent component handle it
  };

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: 'from' | 'to') => {
    setActiveTab(newValue);
    setSearchTerm('');
    setOptions([]);
  };

  // When parent updates currentFrom (after selecting From), auto-switch to "to" locally as well
  useEffect(() => {
    if (currentFrom && activeTab === 'from') {
      setActiveTab('to');
      setSearchTerm('');
      setOptions([]);
    }
  }, [currentFrom]);

  // Focus the search input whenever the dialog opens or tab changes
  useEffect(() => {
    if (open) {
      // Slight delay to ensure input is mounted
      const id = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(id);
    }
  }, [open, activeTab]);

  // Load popular destinations on mount
  // Popular destinations are now loaded on-demand when user clicks on input

  // Clear search when popup closes
  useEffect(() => {
    if (!open) {
      setSearchTerm('');
      setOptions([]);
    }
  }, [open]);

  const renderOption = (option: AirportOption, index: number) => (
    <ListItem key={`${option.code}-${index}`} disablePadding>
      <ListItemButton
        onClick={() => handleOptionSelect(option)}
        sx={{
          py: 2,
          px: 3,
          borderRadius: 1,
          mx: 1,
          mb: 0.5,
          '&:hover': {
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <ListItemIcon sx={{ minWidth: 48 }}>
          <Box sx={{ position: 'relative' }}>
            {option.type === 'airport' ? (
              <FlightTakeoff sx={{ color: '#3b82f6', fontSize: '1.5rem' }} />
            ) : (
              <LocationOn sx={{ color: '#10b981', fontSize: '1.5rem' }} />
            )}
            <Box
              sx={{
                position: 'absolute',
                top: -8,
                right: -8,
                fontSize: '0.75rem',
                lineHeight: 1,
              }}
            >
              {getCountryFlag(option.country_code)}
            </Box>
          </Box>
        </ListItemIcon>
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937' }}>
                {option.code}
              </Typography>
              <Typography variant="body1" sx={{ color: '#6b7280' }}>
                -
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, color: '#1f2937' }}>
                {option.name}
              </Typography>
            </Box>
          }
          secondary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                {option.city_name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                •
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                {option.country_name}
              </Typography>
            </Box>
          }
        />
      </ListItemButton>
    </ListItem>
  );

  const isFromTab = activeTab === 'from';

  return (
    <>
      <Backdrop
        open={open}
        sx={{
          zIndex: 1300,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        }}
      />
      <Dialog
        open={open}
        onClose={(_event, reason) => {
          // Prevent accidental close while choosing From
          if ((reason === 'backdropClick' || reason === 'escapeKeyDown') && activeTab === 'from') {
            return;
          }
          onClose();
        }}
        disableEscapeKeyDown={activeTab === 'from'}
        keepMounted
        fullScreen={isSmall}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            maxHeight: { xs: '100vh', md: '80vh' },
            margin: { xs: 0, md: 2 },
          }
        }}
        sx={{
          '& .MuiDialog-container': {
            alignItems: 'flex-start'
          },
          '& .MuiDialog-paper': {
            margin: 0,
          }
        }}
      >
        <DialogTitle sx={{ 
          p: 0,
          borderBottom: '1px solid #e5e7eb',
          position: 'sticky',
          top: 0,
          zIndex: 7,
          backgroundColor: '#ffffff'
        }}>
          <Box sx={{ p: 3, pb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937' }}>
                Select {isFromTab ? 'Departure' : 'Destination'} City
              </Typography>
              <IconButton onClick={onClose} sx={{ color: '#6b7280' }}>
                <CloseIcon />
              </IconButton>
            </Box>
            
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  minHeight: 48,
                },
                '& .Mui-selected': {
                  color: '#3b82f6 !important',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#3b82f6',
                  height: 3,
                  borderRadius: '2px 2px 0 0',
                }
              }}
            >
              <Tab 
                value="from" 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>From</Typography>
                    {currentFrom && (
                      <Chip
                        label={currentFrom.code}
                        size="small"
                        sx={{ 
                          backgroundColor: '#dbeafe',
                          color: '#1e40af',
                          fontWeight: 600,
                          height: 20,
                          fontSize: '0.75rem'
                        }}
                      />
                    )}
                  </Box>
                } 
              />
              <Tab 
                value="to" 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>To</Typography>
                    {currentTo && (
                      <Chip
                        label={currentTo.code}
                        size="small"
                        sx={{ 
                          backgroundColor: '#dcfce7',
                          color: '#166534',
                          fontWeight: 600,
                          height: 20,
                          fontSize: '0.75rem'
                        }}
                      />
                    )}
                  </Box>
                } 
              />
            </Tabs>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
          {/* Sticky search bar just under the title/tabs */}
          <Box sx={{ 
            p: 3, 
            pb: 2,
            position: 'sticky',
            top: { xs: 0, md: 0 },
            zIndex: 6,
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <TextField
              fullWidth
              placeholder={`Search ${isFromTab ? 'departure' : 'destination'} cities or airports...`}
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={handleInputFocus}
              autoFocus
              InputProps={{
                inputRef: inputRef,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#6b7280' }} />
                  </InputAdornment>
                ),
                endAdornment: loading ? (
                  <InputAdornment position="end">
                    <CircularProgress size={20} />
                  </InputAdornment>
                ) : null,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: '#f9fafb',
                  '& fieldset': {
                    borderColor: '#d1d5db',
                  },
                  '&:hover fieldset': {
                    borderColor: '#3b82f6',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3b82f6',
                    borderWidth: 2,
                  }
                }
              }}
            />
          </Box>

          <Divider />

          <Box sx={{ maxHeight: { xs: 'calc(100vh - 220px)', md: 400 }, overflow: 'auto' }}>
            {searchTerm ? (
              // Search results
              <Fade in={true} timeout={300}>
                <Box>
                  {options.length > 0 ? (
                    <List sx={{ p: 1 }}>
                      {options.map((option, index) => renderOption(option, index))}
                    </List>
                  ) : !loading ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                      <Typography color="text.secondary" sx={{ fontSize: '1rem' }}>
                        No cities or airports found for &quot;{searchTerm}&quot;
                      </Typography>
                    </Box>
                  ) : null}
                </Box>
              </Fade>
            ) : (
              // Default content when no search
              <Fade in={true} timeout={300}>
                <Box>
                  {!isSearchInitialized ? (
                    // Show loading message when search is not initialized
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                      <Typography color="text.secondary" sx={{ fontSize: '1rem', mb: 2 }}>
                        Click on the search box to load destinations
                      </Typography>
                      <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                        This helps reduce initial page load time
                      </Typography>
                    </Box>
                  ) : (
                    <>
                  {/* Recent searches */}
                  {recentSearches.length > 0 && (
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h6" sx={{ mb: 2, color: '#374151', fontWeight: 600 }}>
                        Recent Searches
                      </Typography>
                      <List sx={{ p: 0 }}>
                        {recentSearches.map((option, index) => renderOption(option, index))}
                      </List>
                    </Box>
                  )}

                  {/* Popular destinations */}
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: '#374151', fontWeight: 600 }}>
                      <Star sx={{ fontSize: '1.2rem', mr: 1, verticalAlign: 'middle', color: '#f59e0b' }} />
                      Popular Destinations
                    </Typography>
                    <List sx={{ p: 0 }}>
                      {popularDestinations.map((option, index) => renderOption(option, index))}
                    </List>
                  </Box>
                    </>
                  )}
                </Box>
              </Fade>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
});

export default UnifiedAirportPopup;
