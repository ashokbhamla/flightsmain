"use client";

import { useState } from 'react';
import { Box, Typography, IconButton, useTheme, useMediaQuery } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const testimonials = [
  {
    id: 1,
    platform: 'Trustpilot',
    platformColor: '#00b67a',
    rating: 5,
    review: "Amazing service! Found the best flight deals and saved over $200 on my trip to Europe. The booking process was smooth and customer support was excellent. read more...",
    customer: "Sarah Mitchell",
    initials: "SM",
    avatarColor: '#1e3a8a',
    timeAgo: "2 days ago"
  },
  {
    id: 2,
    platform: 'Google',
    platformColor: '#4285f4',
    rating: 5,
    review: "Outstanding flight search experience! The interface is intuitive and I found exactly what I was looking for. Highly recommend for anyone planning travel. read more...",
    customer: "John Davis",
    initials: "JD",
    avatarColor: '#34a853',
    timeAgo: "1 week ago"
  },
  {
    id: 3,
    platform: 'Trustpilot',
    platformColor: '#00b67a',
    rating: 5,
    review: "Incredible savings! I was skeptical at first but ended up saving $350 on my business trip. The customer service team was incredibly helpful throughout. read more...",
    customer: "Michael Chen",
    initials: "MC",
    avatarColor: '#e74c3c',
    timeAgo: "3 days ago"
  },
  {
    id: 4,
    platform: 'Google',
    platformColor: '#4285f4',
    rating: 4,
    review: "Great platform for finding flights. The price comparison feature helped me choose the best option. Will definitely use again for future trips. read more...",
    customer: "Emma Wilson",
    initials: "EW",
    avatarColor: '#9b59b6',
    timeAgo: "5 days ago"
  },
  {
    id: 5,
    platform: 'Trustpilot',
    platformColor: '#00b67a',
    rating: 5,
    review: "Best flight search engine I've used! Found a last-minute deal that saved me $180. The mobile app is also very user-friendly. read more...",
    customer: "David Rodriguez",
    initials: "DR",
    avatarColor: '#f39c12',
    timeAgo: "1 day ago"
  },
  {
    id: 6,
    platform: 'Google',
    platformColor: '#4285f4',
    rating: 5,
    review: "Excellent service and competitive prices. I've booked multiple flights through this platform and always had a great experience. Highly recommended! read more...",
    customer: "Lisa Thompson",
    initials: "LT",
    avatarColor: '#16a085',
    timeAgo: "4 days ago"
  }
];

export default function TestimonialsSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const cardsPerView = isMobile ? 1 : 4;
  const totalSlides = Math.ceil(testimonials.length / cardsPerView);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Box key={index} sx={{ color: '#ffd700', fontSize: '1.2rem' }}>
        {index < rating ? '★' : '☆'}
      </Box>
    ));
  };

  return (
    <Box sx={{ 
      py: '4 !important', 
      backgroundColor: '#f8f9fa',
      borderTop: '1px solid #e0e0e0'
    }}>
      <Box sx={{ 
        maxWidth: '1200px', 
        mx: 'auto', 
        px: { xs: '2 !important', sm: '4 !important', md: '6 !important' } 
      }}>
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#1e3a8a',
              fontWeight: 700,
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
              mb: 1
            }}
          >
            What Our Customers Say
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#10b981',
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
              maxWidth: '500px',
              mx: 'auto'
            }}
          >
            Join thousands of satisfied customers who found their perfect flights with us
          </Typography>
        </Box>

        {/* Slider Container */}
        <Box sx={{ position: 'relative' }}>
          {/* Navigation Buttons */}
          <IconButton
            onClick={prevSlide}
            sx={{
              position: 'absolute',
              left: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'white',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              zIndex: 2,
              '&:hover': {
                backgroundColor: '#f8f9fa'
              },
              display: { xs: 'none', md: 'flex' }
            }}
          >
            <ChevronLeftIcon />
          </IconButton>

          <IconButton
            onClick={nextSlide}
            sx={{
              position: 'absolute',
              right: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'white',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              zIndex: 2,
              '&:hover': {
                backgroundColor: '#f8f9fa'
              },
              display: { xs: 'none', md: 'flex' }
            }}
          >
            <ChevronRightIcon />
          </IconButton>

          {/* Cards Container */}
          <Box sx={{ 
            overflow: 'hidden',
            position: 'relative'
          }}>
            <Box sx={{
              display: 'flex',
              transform: `translateX(-${currentSlide * (100 / cardsPerView)}%)`,
              transition: 'transform 0.5s ease-in-out',
              gap: { xs: 2, sm: 2, md: 3 }
            }}>
              {testimonials.map((testimonial) => (
                <Box
                  key={testimonial.id}
                  sx={{
                    minWidth: { 
                      xs: 'calc(100% - 16px)', 
                      sm: 'calc(50% - 16px)', 
                      md: 'calc(25% - 24px)' 
                    },
                    flex: { 
                      xs: '0 0 calc(100% - 16px)', 
                      sm: '0 0 calc(50% - 16px)', 
                      md: '0 0 calc(25% - 24px)' 
                    }
                  }}
                >
                  {/* Testimonial Card */}
                  <Box sx={{
                    backgroundColor: 'white',
                    borderRadius: 0,
                    p: { xs: 1.5, sm: 2, md: 2 },
                    height: '100%',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: '1px solid #e0e0e0',
                    position: 'relative',
                    '&:hover': {
                      boxShadow: '0 6px 25px rgba(0, 0, 0, 0.12)',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease'
                    }
                  }}>
                    {/* Platform Badge */}
                    <Box sx={{
                      position: 'absolute',
                      top: { xs: 3, sm: 5, md: 5 },
                      left: { xs: 12, sm: 16, md: 16 },
                      backgroundColor: testimonial.platformColor,
                      color: 'white',
                      px: { xs: 1.5, sm: 2, md: 2 },
                      py: { xs: 0.3, sm: 0.5, md: 0.5 },
                      borderRadius: 0,
                      fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.8rem' },
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      zIndex: 10
                    }}>
                      {testimonial.platform === 'Google' ? (
                        <Box sx={{ fontSize: '14px', fontWeight: 'bold' }}>G</Box>
                      ) : (
                        <Box sx={{ fontSize: '12px' }}>✓</Box>
                      )}
                      {testimonial.platform}
                    </Box>

                    {/* Stars */}
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 2, mt: 1 }}>
                      {renderStars(testimonial.rating)}
                    </Box>

                    {/* Review Text */}
                    <Typography sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.9rem', md: '0.9rem' }, 
                      color: '#333', 
                      lineHeight: 1.5,
                      mb: { xs: 1.5, sm: 2, md: 2 },
                      fontStyle: 'italic',
                      minHeight: { xs: '50px', sm: '60px', md: '60px' }
                    }}>
                      &ldquo;{testimonial.review}&rdquo;
                    </Typography>

                    {/* Customer Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2, md: 2 } }}>
                      <Box sx={{
                        width: { xs: 32, sm: 36, md: 40 },
                        height: { xs: 32, sm: 36, md: 40 },
                        backgroundColor: testimonial.avatarColor,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }
                      }}>
                        {testimonial.initials}
                      </Box>
                      <Box>
                        <Typography sx={{ 
                          fontWeight: 600, 
                          color: '#333', 
                          fontSize: { xs: '0.8rem', sm: '0.9rem', md: '0.9rem' }
                        }}>
                          {testimonial.customer}
                        </Typography>
                        <Typography sx={{ 
                          color: '#666', 
                          fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.8rem' }
                        }}>
                          Verified Customer • {testimonial.timeAgo}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Dots Indicator */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 1, 
            mt: 4 
          }}>
            {Array.from({ length: totalSlides }, (_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentSlide(index)}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: index === currentSlide ? '#1e3a8a' : '#e0e0e0',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                  '&:hover': {
                    backgroundColor: index === currentSlide ? '#1e3a8a' : '#c0c0c0'
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
