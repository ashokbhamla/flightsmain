'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import PhoneInTalkRoundedIcon from '@mui/icons-material/PhoneInTalkRounded';

export default function CallBanner() {
  const phone = '(888) 351-1711';
  const telHref = 'tel:+18883511711';

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
      data-call-banner
      sx={{
        width: '100%',
        backgroundColor: '#0f172a',
        color: '#e2e8f0',
        px: { xs: 2, md: 4 },
        py: { xs: 1.5, md: 1.75 },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1200,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 1, sm: 2 },
        }}
      >
        <Typography
          component="span"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.1rem', sm: '1rem' },
            letterSpacing: '.04em',
            textTransform: 'uppercase',
          }}
        >
          Search Airlines
        </Typography>
        <Typography
          component="span"
          sx={{
            flexGrow: 1,
            fontSize: { xs: '0.9rem', sm: '0.95rem' },
            color: '#cbd5f5',
          }}
        >
          Speak with a live agent for flight options, changes, or support—available 24/7.
        </Typography>
        <Button
          onClick={handleClick}
          href={telHref}
          variant="outlined"
          size="small"
          sx={{
            whiteSpace: 'nowrap',
            fontWeight: 700,
            color: '#e2e8f0',
            borderColor: '#475569',
            '&:hover': {
              borderColor: '#94a3b8',
              backgroundColor: 'rgba(148,163,184,0.12)',
            },
          }}
          startIcon={<PhoneInTalkRoundedIcon fontSize="small" />}
          aria-label={`Call ${phone}`}
        >
          Call {phone}
        </Button>
      </Box>
    </Box>
  );
}
