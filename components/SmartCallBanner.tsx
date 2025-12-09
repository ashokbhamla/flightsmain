'use client';

import React from 'react';
import { Box, Button, Typography, Container, Stack, Chip } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';

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

  return (
    <Box
      sx={{
        width: '100%',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #10b981 100%)',
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 4, md: 5 },
        px: { xs: 2, md: 0 },
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      }}
    >
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

      <Container maxWidth="lg">
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 3, md: 4 },
          }}
        >
          {/* Left side - Content */}
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }} sx={{ mb: 2 }}>
              <Chip
                icon={<HeadsetMicIcon />}
                label="24/7 Support"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
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
                }}
              />
            </Stack>

            <Typography
              variant="h3"
              component="h1"
              sx={{
                color: 'white',
                fontWeight: 800,
                mb: 1.5,
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                lineHeight: 1.2,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
              }}
            >
              Need Help? Call Us Now!
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.95)',
                mb: 3,
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                fontWeight: 400,
                lineHeight: 1.5,
              }}
            >
              Speak with our travel experts for instant flight bookings, changes, cancellations, and exclusive deals.
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              justifyContent={{ xs: 'center', md: 'flex-start' }}
            >
              <Button
                onClick={handleClick}
                href={telHref}
                variant="contained"
                size="large"
                startIcon={<PhoneIcon sx={{ fontSize: 28 }} />}
                sx={{
                  backgroundColor: '#22c55e',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  px: { xs: 4, md: 5 },
                  py: { xs: 1.5, md: 2 },
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(34, 197, 94, 0.4)',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#16a34a',
                    boxShadow: '0 12px 32px rgba(34, 197, 94, 0.5)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Call {phone}
              </Button>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }}>
                  <CheckCircleIcon sx={{ color: '#22c55e', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                    No hold times
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }}>
                  <CheckCircleIcon sx={{ color: '#22c55e', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                    Expert agents ready
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Box>

          {/* Right side - Phone Icon/Visual */}
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
                width: 180,
                height: 180,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              }}
            >
              <PhoneIcon
                sx={{
                  fontSize: 80,
                  color: 'white',
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
                }}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

