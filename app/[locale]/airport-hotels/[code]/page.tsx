import { Box, Container, Grid, Card, CardContent, CardActions, Typography, Button, Chip } from '@mui/material';

interface HotelItem {
  hotel_id: number;
  hotel_name: string;
  star_rating?: number | null;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  url?: string;
  distance_km?: number;
}

interface ApiResponse {
  _id: string;
  airport_iata: string;
  airport_name: string;
  city: string;
  country: string;
  city_code: string;
  hotels: HotelItem[];
}

async function fetchHotels(iata: string): Promise<ApiResponse | null> {
  try {
    const res = await fetch(`https://api.triposia.com/hotels/city-code?city_id=${encodeURIComponent(iata.toUpperCase())}&lang_id=1&domain_id=1`, {
      // Fresh data for users
      cache: 'no-store',
      headers: { accept: 'application/json' },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (Array.isArray(json) && json.length > 0) return json[0] as ApiResponse;
    return null;
  } catch {
    return null;
  }
}

type AgodaResult = {
  hotelId: number;
  hotelName: string;
  currency: string;
  dailyRate: number;
  crossedOutRate?: number;
  discountPercentage?: number;
  imageURL?: string;
  landingURL?: string;
  reviewScore?: number;
  starRating?: number;
};

async function fetchAgodaPrices(hotelIds: number[], checkIn: string, checkOut: string): Promise<Record<number, AgodaResult>> {
  if (!hotelIds.length) return {};
  const siteId = process.env.AGODA_SITE_ID || '1918595';
  const apiKey = process.env.AGODA_API_KEY || '4b41ae74-e665-4cb0-b351-d47c1aecf389';
  const url = 'http://affiliateapi7643.agoda.com/affiliateservice/lt_v1';
  const body = {
    criteria: {
      additional: {
        currency: 'USD',
        language: 'en-us',
        occupancy: { numberOfAdult: 2, numberOfChildren: 0 },
      },
      checkInDate: checkIn,
      checkOutDate: checkOut,
      hotelId: hotelIds,
    },
  };
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip,deflate',
        'Authorization': `${siteId}:${apiKey}`,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    if (!res.ok) return {};
    const json = await res.json();
    const list: AgodaResult[] = Array.isArray(json?.results) ? json.results : [];
    const map: Record<number, AgodaResult> = {};
    for (const it of list) {
      if (typeof it.hotelId === 'number') map[it.hotelId] = it;
    }
    return map;
  } catch {
    return {};
  }
}

export default async function AirportHotelsPage({ params }: { params: { locale: string; code: string } }) {
  const { code, locale } = params as any;
  const data = await fetchHotels(code);

  // Dates: today+7 and +8 by default (can be adapted to query if needed)
  const today = new Date();
  const ci = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const co = new Date(ci.getTime() + 1 * 24 * 60 * 60 * 1000);
  const toIso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const checkIn = toIso(ci);
  const checkOut = toIso(co);
  const agodaMap = data ? await fetchAgodaPrices((data.hotels || []).map(h => h.hotel_id), checkIn, checkOut) : {};

  return (
    <Box sx={{ minHeight: '70vh', backgroundColor: '#f8fafc' }}>
      <Container sx={{ pt: { xs: 3, md: 6 }, pb: 6 }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {data ? `${data.airport_iata} • Airport Hotels` : `${code.toUpperCase()} • Airport Hotels`}
          </Typography>
          {data && (
            <Typography variant="subtitle1" color="text.secondary">
              {data.airport_name} — {data.city}, {data.country}
            </Typography>
          )}
        </Box>

        {!data && (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography color="text.secondary">No hotels found for this airport right now.</Typography>
          </Box>
        )}

        {data && (
          <Grid container spacing={2}>
            {data.hotels?.map((h) => {
              const a = agodaMap[h.hotel_id];
              if (!a?.dailyRate || !a?.imageURL) return null; // hide card without price or image
              return (
              <Grid item xs={12} sm={6} md={6} key={h.hotel_id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {h.hotel_name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                      {typeof (a?.starRating ?? h.star_rating) === 'number' && (
                        <Chip size="small" color="primary" label={`${(a?.starRating ?? h.star_rating) as number}★`} />
                      )}
                      {typeof h.distance_km === 'number' && (
                        <Chip size="small" variant="outlined" label={`${h.distance_km.toFixed(1)} km`} />
                      )}
                      {typeof a?.reviewScore === 'number' && (
                        <Chip size="small" variant="outlined" label={`Score ${a.reviewScore}`} />
                      )}
                      {typeof a?.discountPercentage === 'number' && a.discountPercentage > 0 && (
                        <Chip size="small" color="success" label={`${Math.round(a.discountPercentage)}% OFF`} />
                      )}
                    </Box>
                    {a?.imageURL && (
                      <Box sx={{ mb: 1, borderRadius: 1, overflow: 'hidden' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={a.imageURL} alt={h.hotel_name} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                      </Box>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      {h.address || h.city || 'Address unavailable'}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 900, color: 'success.main', lineHeight: 1 }}>
                        USD {a.dailyRate.toFixed(2)}
                      </Typography>
                      {typeof a?.crossedOutRate === 'number' && a.crossedOutRate > a.dailyRate && (
                        <Typography variant="body2" sx={{ color: 'text.secondary', textDecoration: 'line-through' }}>
                          USD {a.crossedOutRate.toFixed(2)}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="success"
                      href={'tel:+18883196206'}
                      sx={{ flex: 1, fontWeight: 800 }}
                    >
                      Call (888) 319-6206
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{ flex: 1, fontWeight: 800 }}
                      href={`/${locale || 'en'}/hotel-quote?hid=${encodeURIComponent(String(h.hotel_id))}&name=${encodeURIComponent(h.hotel_name)}&price=${encodeURIComponent(String(a?.dailyRate || ''))}&currency=${encodeURIComponent(a?.currency || 'USD')}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&iata=${encodeURIComponent(code)}&img=${encodeURIComponent(a?.imageURL || '')}`}
                    >
                      Get Quote
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
}


