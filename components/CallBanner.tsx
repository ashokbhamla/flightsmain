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
        bgcolor: '#0f172a',
        color: 'white',
        px: { xs: 2, md: 3 },
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.95rem', md: '1rem' } }}>
        Airlines Reservation — Flat 10% Discount
      </Typography>
      <Button
        variant="contained"
        color="success"
        onClick={handleClick}
        href={telHref}
        sx={{ fontWeight: 800 }}
      >
        Call {phone}
      </Button>
    </Box>
  );
}


