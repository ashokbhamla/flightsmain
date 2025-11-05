import { Metadata } from 'next';
import { Typography, Box, Container, Grid, Card, CardContent, Button } from '@mui/material';
import { localeFromParam } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Hotels Near US Airports - Find Airport Hotels in America',
  description: 'Discover the best hotels near major US airports including LAX, JFK, ATL, ORD, DFW, and more. Find comfortable accommodations with airport shuttle service, great amenities, and competitive rates.',
  keywords: [
    'airport hotels',
    'US airport hotels',
    'hotels near LAX',
    'hotels near JFK',
    'hotels near ATL',
    'hotels near ORD',
    'hotels near DFW',
    'airport shuttle hotels',
    'hotel booking',
    'airport accommodation',
    'US hotels',
    'airport proximity hotels'
  ],
  openGraph: {
    title: 'Hotels Near US Airports - Find Airport Hotels in America',
    description: 'Discover the best hotels near major US airports including LAX, JFK, ATL, ORD, DFW, and more. Find comfortable accommodations with airport shuttle service, great amenities, and competitive rates.',
    siteName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'flightsearchs',
  },
};

const popularAirports = [
  { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles, CA' },
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York, NY' },
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International Airport', city: 'Atlanta, GA' },
  { code: 'ORD', name: "O'Hare International Airport", city: 'Chicago, IL' },
  { code: 'DFW', name: 'Dallas/Fort Worth International Airport', city: 'Dallas, TX' },
  { code: 'DEN', name: 'Denver International Airport', city: 'Denver, CO' },
  { code: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco, CA' },
  { code: 'LAS', name: 'Harry Reid International Airport', city: 'Las Vegas, NV' },
  { code: 'MCO', name: 'Orlando International Airport', city: 'Orlando, FL' },
  { code: 'MIA', name: 'Miami International Airport', city: 'Miami, FL' },
  { code: 'SEA', name: 'Seattle-Tacoma International Airport', city: 'Seattle, WA' },
  { code: 'BWI', name: 'Baltimore/Washington International Thurgood Marshall Airport', city: 'Baltimore, MD' }
];

export default function HotelsPage({ params }: { params: { locale: string } }) {
  const locale = localeFromParam(params.locale);

  return (
    <Box>
      <Box sx={{ 
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', 
        color: 'white', 
        py: 6,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'left', mb: 0 }}>
            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 700,
                mb: 2,
                textAlign: 'left'
              }}
            >
              Hotels Near US Airports
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                opacity: 0.9,
                textAlign: 'left',
                mx: 0
              }}
            >
              Find the best hotels near major US airports with great amenities and competitive rates
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ mb: 2, color: '#333', fontWeight: 700 }}>
            Popular US Airport Hotels
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
            Discover comfortable accommodations near major US airports with convenient access, 
            essential amenities, and many offering complimentary airport shuttle service.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {popularAirports.map((airport) => (
            <Grid item xs={12} sm={6} md={4} key={airport.code}>
              <Card sx={{ 
                height: '100%',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                }
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://source.unsplash.com/600x360/?city,${encodeURIComponent(airport.city.split(',')[0])}`}
                  alt={`${airport.city} hotels`}
                  style={{ width: '100%', height: 180, objectFit: 'cover' }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827', mb: 0.5 }}>
                    Hotels in {airport.city.split(',')[0]}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280', mb: 2 }}>
                    Near {airport.name}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    href={`/${locale}/airport-hotels/${airport.code}`}
                    sx={{
                      backgroundColor: '#1e3a8a',
                      '&:hover': { backgroundColor: '#1536a3' },
                      borderRadius: 2,
                      py: 1.25,
                      fontWeight: 800
                    }}
                  >
                    View Hotels
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 8, textAlign: 'center', py: 6, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
          <Typography variant="h4" sx={{ mb: 2, color: '#333', fontWeight: 700 }}>
            Why Choose Airport Hotels?
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 1, color: '#1e3a8a', fontWeight: 600 }}>
                Convenient Location
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Stay close to the airport for easy access to your flights and reduced travel time.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 1, color: '#1e3a8a', fontWeight: 600 }}>
                Free Shuttle Service
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Many hotels offer complimentary airport shuttle service for your convenience.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 1, color: '#1e3a8a', fontWeight: 600 }}>
                Great Amenities
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Enjoy modern facilities including WiFi, restaurants, parking, and more.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
