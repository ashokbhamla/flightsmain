'use client';

import { useMemo } from 'react';
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

export default function LeadPageContent({ phoneNumber }: LeadPageContentProps) {
  const normalizedPhone = useMemo(() => {
    if (!phoneNumber) {
      return '(888) 319-6206';
    }
    const trimmed = phoneNumber.trim();
    const digitsOnly = trimmed.replace(/[^\d+]/g, '');
    if (!digitsOnly) {
      return '+1 (877) 290-1852';
    }
    return digitsOnly.startsWith('+') ? digitsOnly : `+${digitsOnly}`;
  }, [phoneNumber]);

  const telHref = useMemo(() => {
    const clean = normalizedPhone.replace(/\s+/g, '');
    return `tel:${clean}`;
  }, [normalizedPhone]);

  const entries = [
    {
      title: 'Call Expedia | 24/7 Customer Support | Call Now',
      description:
        'Easy flight ticket booking, ticket changes, and cancellations over the call. Talk to an expert travel agent right away.',
      tags: ['Book Flights', 'Ticket Changes', 'Cancellations'],
    },
    {
      title: 'Expedia Flight Booking Desk | Call Now',
      description:
        'Book your flight, change itineraries, or get assistance with cancellations instantly from our dedicated desk.',
      tags: ['Book Flights', 'Manage Trips', 'Refund Assistance'],
    },
    {
      title: 'Call Expedia | 24/7 Customer Support | Call Now',
      description:
        '24/7 award-winning support for new bookings and existing reservations. Skip hold times and speak with a specialist.',
      tags: ['24/7 Support', 'Live Agents', 'Best Deals'],
    },
    {
      title: 'Call 1800 Expedia | Customer Support Number | Flight Ticket On Call',
      description:
        'Fast and reliable assistance for urgent travel. Secure exclusive deals by speaking to our travel experts.',
      tags: ['Exclusive Deals', 'Instant Quotes', 'Priority Service'],
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f1f5f9', py: { xs: 6, md: 8 } }}>
      <Container maxWidth="md">
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
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
            borderRadius: 3,
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
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'rgba(15,23,42,0.12)',
                bgcolor: 'white',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Box>
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
                <Button
                  component="a"
                  href={telHref}
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    alignSelf: { xs: 'stretch', sm: 'auto' },
                    fontWeight: 600,
                    textTransform: 'none',
                  }}
                >
                  Call Now
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}

