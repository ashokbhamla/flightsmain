import { Box, Container, Grid, Paper, Typography, Chip, Divider, Button } from '@mui/material';
import type { Metadata } from 'next';
import HotelImageSlider from '@/components/HotelImageSlider';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface AiContent {
  description?: string;
  amenities?: string[];
  places_to_visit?: Array<{ name: string; type?: string; note?: string }>;
  best_months?: string;
  cheapest_time?: string;
  peak_season?: string;
  transportation?: { distance_from_airport_text?: string; travel_time_text?: string; options?: string[] };
  reviews?: Array<{ title?: string; snippet?: string; rating?: number; theme?: string }>;
  faqs?: Array<{ q: string; a: string }>;
}

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
  ai_content?: AiContent;
}

interface CityResponse {
  airport_iata: string;
  airport_name: string;
  city: string;
  country: string;
  hotels: HotelItem[];
}

async function fetchCity(iata: string): Promise<CityResponse[] | null> {
  try {
    const res = await fetch(`https://api.triposia.com/hotels/city-code?city_id=${encodeURIComponent(iata.toUpperCase())}&lang_id=1&domain_id=1`, { cache: 'no-store', headers: { accept: 'application/json' } });
    if (!res.ok) return null;
    const json = await res.json();
    return Array.isArray(json) ? json as CityResponse[] : null;
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
  reviewScore?: number;
  starRating?: number;
  landingURL?: string;
};

async function fetchAgoda(hotelId: number, checkIn: string, checkOut: string): Promise<AgodaResult | null> {
  const siteId = process.env.AGODA_SITE_ID || '1918595';
  const apiKey = process.env.AGODA_API_KEY || '4b41ae74-e665-4cb0-b351-d47c1aecf389';
  try {
    const res = await fetch('http://affiliateapi7643.agoda.com/affiliateservice/lt_v1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept-Encoding': 'gzip,deflate', 'Authorization': `${siteId}:${apiKey}` },
      cache: 'no-store',
      body: JSON.stringify({ criteria: { additional: { currency: 'USD', language: 'en-us', occupancy: { numberOfAdult: 2, numberOfChildren: 0 } }, checkInDate: checkIn, checkOutDate: checkOut, hotelId: [hotelId] } })
    });
    if (!res.ok) return null;
    const json = await res.json();
    const first = Array.isArray(json?.results) && json.results.find((r: any) => r?.hotelId === hotelId);
    return first || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params, searchParams }: { params: { locale: string; id: string }, searchParams: { [k: string]: string | string[] | undefined } }): Promise<Metadata> {
  const id = Number(params.id);
  const iata = (searchParams?.iata as string) || '';
  const cities = iata ? await fetchCity(iata) : null;
  const city = cities?.find(Boolean) || null;
  const hotel = city?.hotels?.find(h => h.hotel_id === id);
  const hotelName = hotel?.hotel_name || `Hotel ${id}`;
  const rawDesc = hotel?.ai_content?.description || `View details, amenities, FAQs and latest price for ${hotelName}.`;
  const desc = rawDesc.length > 158 ? `${rawDesc.slice(0, 155)}...` : rawDesc;
  const ogImage = (await (async () => {
    const today = new Date();
    const ci = new Date(today.getTime() + 7 * 86400000);
    const co = new Date(ci.getTime() + 86400000);
    const toIso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const ag = await fetchAgoda(id, toIso(ci), toIso(co));
    return ag?.imageURL || `https://source.unsplash.com/1200x630/?hotel,${encodeURIComponent(city?.city || '')}`;
  })());
  return {
    title: hotelName,
    description: desc,
    openGraph: { title: hotelName, description: desc, images: [{ url: ogImage, width: 1200, height: 630, alt: hotelName }] },
    twitter: { card: 'summary_large_image', title: hotelName, description: desc, images: [ogImage] },
    robots: { index: true, follow: true },
  };
}

export default async function HotelDetailPage({ params, searchParams }: { params: { locale: string; id: string }, searchParams: { [k: string]: string | string[] | undefined } }) {
  const id = Number(params.id);
  const iata = (searchParams?.iata as string) || '';
  const today = new Date();
  const ci = new Date(today.getTime() + 7 * 86400000);
  const co = new Date(ci.getTime() + 86400000);
  const toIso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const checkIn = toIso(ci);
  const checkOut = toIso(co);

  const cities = iata ? await fetchCity(iata) : null;
  const city = cities?.find(Boolean) || null;
  const hotel = city?.hotels?.find(h => h.hotel_id === id) || null;
  const agoda = await fetchAgoda(id, checkIn, checkOut);

  const gallery: string[] = [];
  if (agoda?.imageURL) gallery.push(agoda.imageURL);
  if (hotel?.city) gallery.push(`https://source.unsplash.com/featured/?hotel,${encodeURIComponent(hotel.city)}`);
  if (hotel?.hotel_name) gallery.push(`https://source.unsplash.com/featured/?resort,${encodeURIComponent(hotel.hotel_name.split(' ').slice(0,2).join(' '))}`);

  const jsonLdHotel = hotel ? {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: hotel.hotel_name,
    url: typeof window === 'undefined' ? undefined : window.location.href,
    image: gallery[0],
    address: hotel.address ? { '@type': 'PostalAddress', streetAddress: hotel.address, addressLocality: hotel.city || city?.city, addressCountry: city?.country } : undefined,
    geo: (typeof hotel.latitude === 'number' && typeof hotel.longitude === 'number') ? { '@type': 'GeoCoordinates', latitude: hotel.latitude, longitude: hotel.longitude } : undefined,
    starRating: typeof (agoda?.starRating ?? hotel.star_rating) === 'number' ? { '@type': 'Rating', ratingValue: (agoda?.starRating ?? hotel.star_rating), bestRating: 5 } : undefined,
    amenityFeature: Array.isArray(hotel.ai_content?.amenities) ? hotel.ai_content!.amenities!.map(a => ({ '@type': 'LocationFeatureSpecification', name: a })) : undefined,
    offers: agoda?.dailyRate ? { '@type': 'Offer', price: agoda.dailyRate, priceCurrency: 'USD', availability: 'https://schema.org/InStock' } : undefined,
  } : null;

  const jsonLdFaq = Array.isArray(hotel?.ai_content?.faqs) && hotel!.ai_content!.faqs!.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: hotel!.ai_content!.faqs!.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
  } : null;

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '80vh' }}>
      <Container sx={{ py: 3 }}>
        {jsonLdHotel && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHotel) }} />
        )}
        {jsonLdFaq && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
        )}

        <Typography component="h1" variant="h4" sx={{ fontWeight: 900, textAlign: 'center', mb: 1 }}>
          {hotel?.hotel_name || `Hotel ${id}`}
        </Typography>
        {hotel && (
          <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
            {(hotel.address || hotel.city) && `${hotel.address ? hotel.address + ' • ' : ''}${hotel.city || ''}`} {typeof hotel.distance_km === 'number' ? `• ~${hotel.distance_km.toFixed(1)} km from ${city?.airport_iata}` : ''}
          </Typography>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <HotelImageSlider images={gallery} alt={hotel?.hotel_name || ''} height={300} />
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {typeof (agoda?.starRating ?? hotel?.star_rating) === 'number' && (
                  <Chip color="primary" label={`${(agoda?.starRating ?? hotel?.star_rating) as number}★`} />
                )}
                {typeof hotel?.distance_km === 'number' && (
                  <Chip variant="outlined" label={`${hotel.distance_km.toFixed(1)} km from airport`} />
                )}
                {typeof agoda?.reviewScore === 'number' && (
                  <Chip variant="outlined" label={`Score ${agoda.reviewScore}`} />
                )}
              </Box>
              <Divider sx={{ my: 2 }} />
              {hotel?.ai_content?.description && (
                <Typography color="text.secondary">{hotel.ai_content.description}</Typography>
              )}
            </Paper>

            {Array.isArray(hotel?.ai_content?.amenities) && hotel!.ai_content!.amenities!.length > 0 && (
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Amenities</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {hotel!.ai_content!.amenities!.map((a, i) => (<Chip key={i} label={a} />))}
                </Box>
              </Paper>
            )}

            {Array.isArray(hotel?.ai_content?.places_to_visit) && hotel!.ai_content!.places_to_visit!.length > 0 && (
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Nearby places</Typography>
                <Box sx={{ display: 'grid', gap: 0.75 }}>
                  {hotel!.ai_content!.places_to_visit!.map((p, i) => (
                    <Typography key={i} color="text.secondary">• {p.name}{p.type ? ` (${p.type})` : ''}{p.note ? ` — ${p.note}` : ''}</Typography>
                  ))}
                </Box>
              </Paper>
            )}

            {Array.isArray(hotel?.ai_content?.faqs) && hotel!.ai_content!.faqs!.length > 0 && (
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>FAQs</Typography>
                <Box sx={{ display: 'grid', gap: 1 }}>
                  {hotel!.ai_content!.faqs!.map((f, i) => (
                    <Box key={i}>
                      <Typography sx={{ fontWeight: 700 }}>{f.q}</Typography>
                      <Typography color="text.secondary">{f.a}</Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, position: 'sticky', top: 16 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Live price (USD)</Typography>
              {agoda?.dailyRate ? (
                <>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: 'success.main' }}>USD {agoda.dailyRate.toFixed(2)}</Typography>
                  {typeof agoda.crossedOutRate === 'number' && agoda.crossedOutRate > agoda.dailyRate && (
                    <Typography sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>USD {agoda.crossedOutRate.toFixed(2)}</Typography>
                  )}
                </>
              ) : (
                <Typography color="text.secondary">Price not available</Typography>
              )}
              <Divider sx={{ my: 2 }} />
              <Button fullWidth variant="contained" color="success" href={'tel:+18883196206'} sx={{ fontWeight: 800, mb: 1 }}>Call (888) 319-6206</Button>
              <Button fullWidth variant="outlined" href={`/${params.locale || 'en'}/hotel-quote?hid=${encodeURIComponent(String(id))}&name=${encodeURIComponent(hotel?.hotel_name || '')}&price=${encodeURIComponent(String(agoda?.dailyRate || ''))}&currency=USD&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&iata=${encodeURIComponent(iata)}&img=${encodeURIComponent(agoda?.imageURL || '')}`} sx={{ fontWeight: 800 }}>Get Quote</Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}


