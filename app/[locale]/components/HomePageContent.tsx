'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Rating,
  Avatar,
  Paper,
  Chip
} from '@mui/material';
import { 
  LocationOn, 
  Star
} from '@mui/icons-material';
import FlightSearchBox from '../../../components/FlightSearchBox';
import SmartCallBanner from '@/components/SmartCallBanner';
import { Locale } from '@/lib/i18n';
import { UserLocation } from '@/lib/geoip';
import { getHomepageCards } from '@/lib/api';

interface HomePageContentProps {
  locale: Locale;
  userLocation: UserLocation;
}

export default function HomePageContent({ locale, userLocation }: HomePageContentProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [cardsData, setCardsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCardsData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Use parallel loading for better performance
      const [cardsData, layoutData] = await Promise.allSettled([
        getHomepageCards(
          userLocation?.countryCode || 'US',
          userLocation?.country || 'United States',
          locale,
          '1' // domain_id
        ),
        // Preload layout data in parallel
        fetch(`/api/layout?lang=${locale === 'ru' ? 2 : 1}`, {
          cache: 'force-cache',
          next: { revalidate: 3600 }
        }).then(res => res.ok ? res.json() : null).catch(() => null)
      ]);
      
      // Use cards data or fallback
      const data = cardsData.status === 'fulfilled' ? cardsData.value : {
        popular_routes: [],
        customer_reviews: [],
        hotels: []
      };
      
      setCardsData(data);
    } catch (error) {
      console.error('Error fetching homepage cards:', error);
      // Set fallback data to prevent infinite loading
      setCardsData({
        popular_routes: [],
        customer_reviews: [],
        hotels: []
      });
    } finally {
      setLoading(false);
    }
  }, [userLocation?.countryCode, userLocation?.country, locale]);

  useEffect(() => {
    setIsHydrated(true);
    fetchCardsData();
  }, [fetchCardsData]);

  if (!isHydrated || loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  const handleFlightSearch = (searchData: any) => {
    console.log('Flight search:', searchData);
    // Handle flight search logic here
  };

  // Currency formatting utility
  const formatCurrency = (price: string, locale: string) => {
    if (locale === 'ru') {
      // Convert USD to RUB (approximate rate: 1 USD = 100 RUB)
      const numericPrice = parseFloat(price.replace(/[$,]/g, ''));
      const rubPrice = Math.round(numericPrice * 100);
      return `₽${rubPrice.toLocaleString('ru-RU')}`;
    }
    return price; // Keep original USD format for other locales
  };

  // Map API data to component format
  const mapApiRoutes = (apiRoutes: any[]) => {
    return apiRoutes?.map((route, index) => ({
      id: index + 1,
      from: route.departure_city,
      to: route.arrival_city,
      price: formatCurrency(route.average_fare, locale),
      image: route.image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&fm=webp',
      originalPrice: formatCurrency(route.average_fare, locale)
    })) || [];
  };

  // Use API data or fallback to default data
  const flightRoutes = cardsData?.popular_routes ? mapApiRoutes(cardsData.popular_routes) : [
    {
      id: 1,
      from: 'Bangalore',
      to: 'Mumbai',
      price: formatCurrency('$23', locale),
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&fm=webp',
      originalPrice: formatCurrency('$33', locale)
    },
    {
      id: 2,
      from: 'Mumbai',
      to: 'Phuket',
      price: formatCurrency('$50', locale),
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&fm=webp',
      originalPrice: formatCurrency('$70', locale)
    },
    {
      id: 3,
      from: 'Delhi',
      to: 'Bali',
      price: formatCurrency('$55', locale),
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop&fm=webp',
      originalPrice: formatCurrency('$75', locale)
    }
  ];

  // Use API data or fallback to default data
  const trendingDestinations = cardsData?.popular_routes ? mapApiRoutes(cardsData.popular_routes) : [
    {
      id: 1,
      name: 'Bangkok',
      country: 'Thailand',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&fm=webp'
    },
    {
      id: 2,
      name: 'Bali',
      country: 'Indonesia',
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop&fm=webp'
    },
    {
      id: 3,
      name: 'Phuket',
      country: 'Thailand',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&fm=webp'
    },
    {
      id: 4,
      name: 'Singapore',
      country: 'Singapore',
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop&fm=webp'
    },
    {
      id: 5,
      name: 'Tokyo',
      country: 'Japan',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop&fm=webp'
    },
    {
      id: 6,
      name: 'New York City',
      country: 'New York',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop&fm=webp'
    }
  ];

  // Use API data or fallback to default data
  const customerReviews = cardsData?.customer_reviews || [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'New York, NY',
      rating: 5,
      comment: 'Amazing experience! Found the best deals on flights and hotels. Highly recommended!',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face&fm=webp'
    },
    {
      id: 2,
      name: 'Michael Chen',
      location: 'Los Angeles, CA',
      rating: 5,
      comment: 'Great platform with excellent customer service. Booked my entire vacation here.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&fm=webp'
    },
    {
      id: 3,
      name: 'Emily Davis',
      location: 'Chicago, IL',
      rating: 4,
      comment: 'User-friendly interface and competitive prices. Will definitely use again!',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face&fm=webp'
    }
  ];

  // Map API hotels data to component format
  const mapApiHotels = (apiHotels: any[]) => {
    return apiHotels?.map((hotel, index) => ({
      id: index + 1,
      name: hotel.hotel_name,
      location: hotel.city,
      price: formatCurrency(`$${hotel.star_rating}00/night`, locale),
      rating: hotel.star_rating,
      image: hotel.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&fm=webp',
      amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant']
    })) || [];
  };

  // Use API data or fallback to default data
  const featuredHotels = cardsData?.hotels ? mapApiHotels(cardsData.hotels) : [
    {
      id: 1,
      name: 'Grand Hotel New York',
      location: 'Manhattan, NY',
      price: formatCurrency('$299/night', locale),
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&fm=webp',
      amenities: ['Free WiFi', 'Pool', 'Spa']
    },
    {
      id: 2,
      name: 'Luxury Resort Miami',
      location: 'Miami Beach, FL',
      price: formatCurrency('$399/night', locale),
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop&fm=webp',
      amenities: ['Beach Access', 'Restaurant', 'Gym']
    },
    {
      id: 3,
      name: 'Boutique Hotel Chicago',
      location: 'Downtown Chicago, IL',
      price: formatCurrency('$199/night', locale),
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop&fm=webp',
      amenities: ['Free WiFi', 'Bar', 'Concierge']
    }
  ];

  return (
    <Box>
      {/* Smart Call Banner */}
      <SmartCallBanner />

      {/* Hero Section with Flight Search - Matching Image Design */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        py: 8,
        px: 2
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            textAlign: 'left', 
            mb: 6,
            display: { xs: 'none', md: 'block' }
          }}>
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                color: 'white', 
                fontWeight: 700, 
                mb: 2,
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              Find Your Perfect Flight
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                fontWeight: 400,
                fontSize: { xs: '1.2rem', md: '1.5rem' }
              }}
            >
              Discover amazing deals on flights worldwide. Book with confidence.
            </Typography>
          </Box>

          <FlightSearchBox 
            className="hero-search"
            locale={locale}
          />
        </Container>
      </Box>

      {/* Trusted & Recognized by Major Media Outlets - Flight Routes */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography variant="h3" component="h2" sx={{ 
            fontWeight: 700, 
            mb: 2, 
            color: '#1a1a1a',
            fontSize: { xs: '1.75rem', md: '2.125rem' }
          }}>
            Trusted & Recognized by Major Media Outlets
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2, md: 4 }}>
          {flightRoutes.map((route: any) => (
            <Grid item xs={12} sm={6} md={4} key={route.id}>
              <Card sx={{ 
                overflow: 'hidden',
                position: 'relative',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
                }
              }}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={route.image}
                    alt={`${route.from} to ${route.to}`}
                  />
                  <Chip
                    label={route.price}
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      backgroundColor: '#1e3a8a',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.9rem'
                    }}
                  />
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 1 }}>
                    {route.from} → {route.to}
                  </Typography>
                  <Typography variant="h5" sx={{ color: '#10b981', fontWeight: 700, mb: 2 }}>
                    Start from {route.price}
                  </Typography>
                  <Button 
                    variant="contained" 
                    fullWidth
                    sx={{ 
                      backgroundColor: '#1e3a8a',
                      minHeight: { xs: '48px', md: '36px' },
                      fontSize: { xs: '16px', md: '14px' },
                      fontWeight: 600,
                      textTransform: 'none',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': { 
                        backgroundColor: '#1e40af',
                        transform: 'translateY(-1px)'
                      },
                      '&:active': {
                        backgroundColor: '#1e3a8a',
                        transform: 'scale(0.98)'
                      }
                    }}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Trending Summer Destinations */}
      <Box sx={{ backgroundColor: '#f8fafc', py: { xs: 4, md: 8 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Typography variant="h3" component="h2" sx={{ 
              fontWeight: 700, 
              mb: 2, 
              color: '#1a1a1a',
              fontSize: { xs: '1.75rem', md: '2.125rem' }
            }}>
              Trending Summer Destinations
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 4 }}>
            {trendingDestinations.map((destination: any) => (
              <Grid item xs={12} sm={6} md={4} key={destination.id}>
                <Card sx={{ 
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
                  }
                }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={destination.image}
                    alt={destination.name}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 0.5 }}>
                      {destination.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                      {destination.country}
                    </Typography>
                    <Button 
                      variant="contained" 
                      fullWidth
                      sx={{ 
                        backgroundColor: '#1e3a8a',
                        minHeight: { xs: '48px', md: '36px' },
                        fontSize: { xs: '16px', md: '14px' },
                        fontWeight: 600,
                        textTransform: 'none',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': { 
                          backgroundColor: '#1e40af',
                          transform: 'translateY(-1px)'
                        },
                        '&:active': {
                          backgroundColor: '#1e3a8a',
                          transform: 'scale(0.98)'
                        }
                      }}
                    >
                      Explore
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* What Our Customers Say */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography variant="h3" component="h2" sx={{ 
            fontWeight: 700, 
            mb: 2, 
            color: '#1a1a1a',
            fontSize: { xs: '1.75rem', md: '2.125rem' }
          }}>
            What Our Customers Say
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2, md: 4 }}>
          {customerReviews.map((review: any) => (
            <Grid item xs={12} md={4} key={review.id}>
              <Paper sx={{ p: 4, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar 
                    src={review.avatar} 
                    alt={review.name}
                    sx={{ width: 50, height: 50, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                      {review.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {review.location}
                    </Typography>
                  </Box>
                </Box>

                <Rating value={review.rating} readOnly sx={{ mb: 2 }} />
                
                <Typography variant="body1" sx={{ color: '#666', fontStyle: 'italic' }}>
                  &quot;{review.comment}&quot;
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Exclusive Hotel Recommendations */}
      <Box sx={{ backgroundColor: '#f8fafc', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 2, color: '#1a1a1a' }}>
              Exclusive Hotel Recommendations
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {featuredHotels.map((hotel: any) => (
              <Grid item xs={12} md={4} key={hotel.id}>
                <Card sx={{ 
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
                  }
                }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={hotel.image}
                    alt={hotel.name}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 0.5 }}>
                          {hotel.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationOn sx={{ fontSize: 16 }} />
                          {hotel.location}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 700 }}>
                          {hotel.price}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Star sx={{ color: '#ffc107', fontSize: 16 }} />
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            {hotel.rating}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                      {hotel.amenities.map((amenity: any, index: number) => (
                        <Chip 
                          key={index}
                          label={amenity} 
                          size="small" 
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      ))}
                    </Box>

                    <Button 
                      variant="contained" 
                      fullWidth
                      sx={{ 
                        backgroundColor: '#1e3a8a',
                        '&:hover': { backgroundColor: '#1e40af' }
                      }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      </Box>
    );
}