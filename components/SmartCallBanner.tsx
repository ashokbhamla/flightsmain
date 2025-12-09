'use client';

import React from 'react';
import { Box, Button, Typography, Container, Stack, Chip, Grid, Avatar, Rating } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import CancelIcon from '@mui/icons-material/Cancel';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import StarIcon from '@mui/icons-material/Star';

export default function SmartCallBanner() {
  const phone = '(888) 351-1711';
  const telHref = 'tel:+18883511711';

  const handleClick = () => {
    try {
      // Optional gtag conversion (if available on window)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w: any = window as any;
      if (w.gtag) {
        w.gtag('event', 'conversion', {
          send_to: 'AW-17749159006',
          value: 1,
          currency: 'USD',
          phone_conversion_number: phone,
        });
      }
    } catch {}
  };

  const keywords = [
    { text: 'Flights Booking', icon: <AirplaneTicketIcon /> },
    { text: 'Flights Change', icon: <FlightTakeoffIcon /> },
    { text: 'Airlines Flights Change', icon: <FlightLandIcon /> },
    { text: 'Flights Cancellations', icon: <CancelIcon /> },
    { text: 'Help Support', icon: <SupportAgentIcon /> },
    { text: 'Speak to Agents', icon: <HeadsetMicIcon /> },
  ];

  return (
    <Box
      component="a"
      href={telHref}
      onClick={handleClick}
      sx={{
        width: '100%',
        minHeight: { xs: '100vh', md: '90vh' },
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #10b981 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 4, md: 6 },
        px: { xs: 2, md: 0 },
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      {/* Plane Background Image - Using SVG/Unicode */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 100 L180 100 M100 20 L100 180 M40 60 L160 140 M160 60 L40 140' stroke='white' stroke-width='2'/%3E%3Cpath d='M20 100 L60 80 L100 100 L140 120 L180 100' stroke='white' stroke-width='3' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: '400px 400px',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Airplane silhouette overlay */}
      <Box
        sx={{
          position: 'absolute',
          right: { xs: '-100px', md: '-50px' },
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: { xs: '300px', md: '500px' },
          opacity: 0.15,
          color: 'white',
          zIndex: 0,
          userSelect: 'none',
        }}
      >
        ✈️
      </Box>

      {/* Decorative background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          opacity: 0.5,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          opacity: 0.5,
        }}
      />

      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative', 
          zIndex: 1, 
          width: '100%',
          pointerEvents: 'none',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Grid container spacing={4} alignItems="center">
          {/* Left side - Content */}
          <Grid item xs={12} md={7}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }} sx={{ mb: 2, flexWrap: 'wrap' }}>
                <Chip
                  icon={<HeadsetMicIcon />}
                  label="24/7 Support"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 600,
                    backdropFilter: 'blur(10px)',
                    mb: { xs: 1, md: 0 },
                  }}
                />
                <Chip
                  icon={<AccessTimeIcon />}
                  label="Instant Response"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 600,
                    backdropFilter: 'blur(10px)',
                    mb: { xs: 1, md: 0 },
                  }}
                />
              </Stack>

              <Typography
                variant="h2"
                component="h1"
                sx={{
                  color: 'white',
                  fontWeight: 900,
                  mb: 2,
                  fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem', lg: '4rem' },
                  lineHeight: 1.1,
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                }}
              >
                Need Help? Call Us Now!
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: 'rgba(255, 255, 255, 0.95)',
                  mb: 4,
                  fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                  fontWeight: 400,
                  lineHeight: 1.6,
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                }}
              >
                Speak with our travel experts for instant flight bookings, changes, cancellations, and exclusive deals.
              </Typography>

              {/* Keywords Grid */}
              <Grid container spacing={2} sx={{ mb: 4 }}>
                {keywords.map((keyword, index) => (
                  <Grid item xs={6} sm={4} md={4} key={index}>
                    <Chip
                      icon={keyword.icon}
                      label={keyword.text}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        color: 'white',
                        fontWeight: 600,
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem' },
                        height: { xs: 36, md: 40 },
                        '& .MuiChip-icon': {
                          color: '#22c55e',
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.25)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Reviews & Ratings Section */}
              <Box sx={{ mb: 4, p: 2, backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }} sx={{ mb: 2 }}>
                  <Rating value={4.8} precision={0.1} readOnly sx={{ '& .MuiRating-iconFilled': { color: '#fbbf24' } }} />
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
                    4.8/5
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: { xs: '0.85rem', md: '0.95rem' } }}>
                    (2,847 reviews)
                  </Typography>
                </Stack>
                <Grid container spacing={2}>
                  {[
                    { name: 'Sarah M.', rating: 5, comment: 'Quick and helpful!' },
                    { name: 'John D.', rating: 5, comment: 'Best service ever!' },
                    { name: 'Emily R.', rating: 5, comment: 'Saved me time!' },
                  ].map((review, idx) => (
                    <Grid item xs={12} sm={4} key={idx}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#22c55e' }}>
                          {review.name[0]}
                        </Avatar>
                        <Box>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Rating value={review.rating} size="small" readOnly sx={{ '& .MuiRating-iconFilled': { color: '#fbbf24' } }} />
                          </Stack>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.9)', display: 'block', fontSize: '0.7rem' }}>
                            {review.comment}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Highlighted Call to Action */}
              <Box 
                sx={{ 
                  position: 'relative', 
                  mb: 3,
                  pointerEvents: 'none',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: '-10px',
                    left: '-10px',
                    right: '-10px',
                    bottom: '-10px',
                    background: 'linear-gradient(45deg, #22c55e, #10b981, #22c55e)',
                    borderRadius: '20px',
                    opacity: 0.3,
                    filter: 'blur(20px)',
                    zIndex: 0,
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 0.3 },
                      '50%': { opacity: 0.5 },
                    },
                  }}
                />
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                  href={telHref}
                  variant="contained"
                  size="large"
                  startIcon={<PhoneIcon sx={{ fontSize: 36 }} />}
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    backgroundColor: '#22c55e',
                    color: 'white',
                    fontWeight: 900,
                    fontSize: { xs: '1.4rem', md: '1.8rem' },
                    px: { xs: 6, md: 8 },
                    py: { xs: 2.5, md: 3 },
                    borderRadius: '18px',
                    boxShadow: '0 12px 40px rgba(34, 197, 94, 0.6), 0 0 30px rgba(34, 197, 94, 0.4)',
                    textTransform: 'none',
                    border: '3px solid rgba(255, 255, 255, 0.3)',
                    pointerEvents: 'auto',
                    '&:hover': {
                      backgroundColor: '#16a34a',
                      boxShadow: '0 16px 50px rgba(34, 197, 94, 0.7), 0 0 40px rgba(34, 197, 94, 0.5)',
                      transform: 'translateY(-4px) scale(1.02)',
                    },
                    transition: 'all 0.3s ease',
                    animation: 'glow 2s ease-in-out infinite',
                    '@keyframes glow': {
                      '0%, 100%': { boxShadow: '0 12px 40px rgba(34, 197, 94, 0.6), 0 0 30px rgba(34, 197, 94, 0.4)' },
                      '50%': { boxShadow: '0 12px 50px rgba(34, 197, 94, 0.8), 0 0 40px rgba(34, 197, 94, 0.6)' },
                    },
                  }}
                >
                  📞 Call {phone} Now
                </Button>
              </Box>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                justifyContent={{ xs: 'center', md: 'flex-start' }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }}>
                    <CheckCircleIcon sx={{ color: '#22c55e', fontSize: 24 }} />
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.95)', fontWeight: 600, fontSize: { xs: '0.9rem', md: '1rem' } }}>
                      No hold times
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }}>
                    <CheckCircleIcon sx={{ color: '#22c55e', fontSize: 24 }} />
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.95)', fontWeight: 600, fontSize: { xs: '0.9rem', md: '1rem' } }}>
                      Expert agents ready
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* Right side - Airline Icons */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', md: 'flex-end' },
                gap: 3,
              }}
            >
              {/* Airline Icons Grid */}
              <Grid container spacing={2} justifyContent={{ xs: 'center', md: 'flex-end' }}>
                {[
                  { name: 'Delta', code: 'DL' },
                  { name: 'American', code: 'AA' },
                  { name: 'United', code: 'UA' },
                  { name: 'Southwest', code: 'WN' },
                  { name: 'JetBlue', code: 'B6' },
                  { name: 'Alaska', code: 'AS' },
                ].map((airline, index) => (
                  <Grid item key={index}>
                    <Box
                      sx={{
                        width: { xs: 80, md: 100 },
                        height: { xs: 80, md: 100 },
                        borderRadius: '16px',
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px) scale(1.05)',
                          background: 'rgba(255, 255, 255, 0.25)',
                        },
                      }}
                    >
                      <FlightTakeoffIcon
                        sx={{
                          fontSize: { xs: 32, md: 40 },
                          color: 'white',
                          mb: 0.5,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'white',
                          fontWeight: 700,
                          fontSize: { xs: '0.65rem', md: '0.75rem' },
                          textAlign: 'center',
                        }}
                      >
                        {airline.code}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* Large Phone Icon */}
              <Box
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 200,
                  height: 200,
                }}
              >
                <Box
                  sx={{
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '4px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <PhoneIcon
                    sx={{
                      fontSize: 100,
                      color: 'white',
                      filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

