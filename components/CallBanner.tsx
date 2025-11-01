'use client';

import React from 'react';
import { Box, Button, Typography } from '@mui/material';

export default function CallBanner() {
  const phone = '(888) 319-6206';
  const telHref = 'tel:+18883196206';

  const handleClick = () => {
    try {
      // Optional gtag conversion (if available on window)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w: any = window as any;
      if (w.gtag) {
        w.gtag('event', 'conversion', {
          send_to: 'AW-16765334947/QHicCJr_1rYbEKPrqro-',
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
        position: 'relative',
        overflow: 'hidden',
        color: 'white',
        // Hero-like background with subtle texture
        backgroundImage:
          'linear-gradient( to bottom, rgba(15,23,42,.85), rgba(15,23,42,.85) ), url(https://images.unsplash.com/photo-1536922246289-88c42f957773?q=80&w=1600&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        px: { xs: 2, md: 6 },
        py: { xs: 3, md: 5 },
      }}
    >
      <Box sx={{ maxWidth: 1280, mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
        <Box sx={{ lineHeight: 1 }}>
          <Typography
            component="div"
            sx={{
              letterSpacing: '.06em',
              fontWeight: 900,
              fontSize: { xs: '1.8rem', sm: '2.6rem', md: '3.2rem' },
            }}
          >
            UP TO <Box component="span" sx={{ color: '#22c55e' }}>10% OFF</Box>
          </Typography>
          <Typography
            component="div"
            sx={{
              mt: 0.5,
              letterSpacing: '.08em',
              fontWeight: 800,
              fontSize: { xs: '1rem', sm: '1.3rem', md: '1.6rem' },
            }}
          >
            FURTHER REDUCTIONS • AIRLINES RESERVATION
          </Typography>
          <Typography sx={{ mt: 1, color: 'rgba(255,255,255,.85)', fontSize: { xs: '.8rem', md: '.95rem' } }}>
            Call now for exclusive fares. Offer valid on select itineraries while supplies last.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            onClick={handleClick}
            href={telHref}
            size="large"
            variant="contained"
            sx={{
              fontWeight: 900,
              px: { xs: 2.5, md: 3.5 },
              py: { xs: 1.25, md: 1.5 },
              fontSize: { xs: '.95rem', md: '1.05rem' },
              background: 'linear-gradient(135deg,#22c55e 0%,#16a34a 100%)',
              '&:hover': { background: 'linear-gradient(135deg,#16a34a 0%,#15803d 100%)' },
              boxShadow: '0 10px 24px rgba(34,197,94,.4)'
            }}
            aria-label={`Call ${phone}`}
          >
            Call {phone}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}


