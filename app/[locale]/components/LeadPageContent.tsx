'use client';

import { useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Stack,
  Chip,
  TextField,
  InputAdornment,
  Divider,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Locale } from '@/lib/i18n';

interface LeadPageContentProps {
  locale: Locale;
  phoneNumber: string;
}

export default function LeadPageContent({ phoneNumber, locale: _locale }: LeadPageContentProps) {
  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.body.classList.add('lead-page-active');
    return () => {
      document.body.classList.remove('lead-page-active');
    };
  }, []);

  const normalizedPhone = useMemo(() => {
    if (!phoneNumber) {
      return '(888) 319-6206';
    }
    const trimmed = phoneNumber.trim();
    const digitsOnly = trimmed.replace(/[^\d+]/g, '');
    if (!digitsOnly) {
      return '(888) 319-6206';
    }
    return trimmed;
  }, [phoneNumber]);

  const telHref = useMemo(() => {
    const digits = normalizedPhone.replace(/\D/g, '');
    if (!digits) {
      return 'tel:+18883196206';
    }
    if (digits.length === 11 && digits.startsWith('1')) {
      return `tel:+${digits}`;
    }
    if (digits.length === 10) {
      return `tel:+1${digits}`;
    }
    return `tel:+${digits}`;
  }, [normalizedPhone]);

  const entries = [
    {
      title: 'Delta Airlines Refund & Ticket Change Desk',
      description:
        'Talk to a certified Delta specialist for refunds, rebooking, and same-day travel support. We fix companion tickets and irregular ops fast.',
      tags: ['24/7 Agents', 'Same-Day Changes', 'SkyMiles Support'],
      displayUrl: 'www.delta.com › customer-support',
      cta: 'Call Delta Desk',
    },
    {
      title: 'American Airlines Booking & Support Hotline',
      description:
        'Book new trips, unlock AAdvantage upgrades, or change an existing ticket with an American Airlines expert in minutes.',
      tags: ['AAdvantage', 'Web-Only Fares', 'Trip Credits'],
      displayUrl: 'www.aa.com › help-center',
      cta: 'Call American Desk',
    },
    {
      title: 'United Airlines Flight Change Center',
      description:
        'Need to move a United flight? We handle Basic Economy upgrades, award itinerary changes, and travel waivers 24/7.',
      tags: ['MileagePlus', 'Travel Waiver Help', 'Rebooking'],
      displayUrl: 'www.united.com › manage-reservation',
      cta: 'Call United Desk',
    },
    {
      title: 'Southwest Airlines Same-Day Change Desk',
      description:
        'Switch Wanna Get Away fares, standby earlier flights, or cancel for credits with Rapid Rewards specialists on the line.',
      tags: ['No Change Fees', 'Rapid Rewards', 'Standby Help'],
      displayUrl: 'www.southwest.com › change-flight',
      cta: 'Call Southwest Desk',
    },
    {
      title: 'Qatar Airways Premium Service Line',
      description:
        'Manage multi-city journeys, refund claims, and Qsuite upgrades with Qatar Airways concierge agents.',
      tags: ['Business Class', 'Upgrade Requests', 'Refund Desk'],
      displayUrl: 'www.qatarairways.com › contact',
      cta: 'Call Qatar Desk',
    },
    {
      title: 'British Airways Refund & Travel Credit Team',
      description:
        'Resolve British Airways cancellation vouchers, Avios bookings, and schedule changes with dedicated BA support.',
      tags: ['Avios Support', 'Travel Credits', 'Refund Experts'],
      displayUrl: 'www.britishairways.com › customer-service',
      cta: 'Call British Desk',
    },
  ];

  return (
    <>
      <style jsx global>{`
        body.lead-page-active header.MuiAppBar-root,
        body.lead-page-active [data-call-banner] {
          display: none !important;
        }
      `}</style>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f1f5f9', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <Paper
          elevation={6}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: '4px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
            color: 'white',
            textAlign: 'center',
            mb: { xs: 4, md: 6 },
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, lineHeight: 1.2 }}>
            Speak With Expedia Travel Experts in Seconds
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.85, mb: 4 }}>
            Get faster bookings, ticket changes, cancellations, and exclusive deals over the phone.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              component="a"
              href={telHref}
              variant="contained"
              size="large"
              startIcon={<PhoneIcon />}
              sx={{
                backgroundColor: '#22c55e',
                minWidth: 240,
                fontSize: '1.125rem',
                fontWeight: 700,
                py: 1.5,
                '&:hover': { backgroundColor: '#16a34a' },
              }}
            >
              Call {normalizedPhone}
            </Button>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Available 24/7 · No hold times · Agents ready now
            </Typography>
          </Stack>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            mb: { xs: 3, md: 4 },
            borderRadius: '4px',
            border: '1px solid',
            borderColor: 'rgba(15,23,42,0.1)',
            bgcolor: 'white',
          }}
        >
          <TextField
            fullWidth
            placeholder="Book your flight"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                '& fieldset': { border: 'none' },
                bgcolor: '#f8fafc',
                py: 0.5,
              },
            }}
          />
        </Paper>

        <Stack spacing={{ xs: 2.5, md: 3 }}>
          {entries.map((entry, index) => (
            <Paper
              key={`${entry.title}-${index}`}
              component="a"
              href={telHref}
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: '4px',
                border: '1px solid #d9e2f1',
                bgcolor: 'white',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                boxShadow: '0 3px 12px rgba(15, 23, 42, 0.08)',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                '&:hover': {
                  boxShadow: '0 12px 24px rgba(15, 23, 42, 0.18)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ color: '#475569', mb: 1 }}>
                  <Chip
                    label="Ad"
                    size="small"
                    sx={{
                      bgcolor: '#e2e8f0',
                      color: '#0f172a',
                      fontWeight: 600,
                      height: 20,
                      '& .MuiChip-label': { px: 1 },
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {entry.displayUrl}
                  </Typography>
                </Stack>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                  {entry.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#334155', mb: 1.5 }}>
                  {entry.description}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {entry.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{
                        bgcolor: '#eff6ff',
                        color: '#1d4ed8',
                        fontWeight: 600,
                      }}
                    />
                  ))}
                </Stack>
              </Box>
              <Divider sx={{ borderColor: 'rgba(15,23,42,0.08)' }} />
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                justifyContent="space-between"
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <PhoneIcon fontSize="small" />
                  {normalizedPhone}
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{
                    alignSelf: { xs: 'stretch', sm: 'auto' },
                    backgroundColor: '#1e3a8a',
                    color: '#ffffff',
                    borderRadius: '999px',
                    px: 2.5,
                    py: 1,
                    fontWeight: 600,
                    justifyContent: 'center',
                    textTransform: 'none',
                    transition: 'background-color 0.15s ease',
                    '&:hover': {
                      backgroundColor: '#172554',
                    },
                  }}
                >
                  <Typography component="span" sx={{ fontWeight: 600 }}>
                    {entry.cta || 'Call Now'}
                  </Typography>
                  <ArrowForwardIcon fontSize="small" />
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Container>
    </Box>
    </>
  );
}

