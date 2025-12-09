import { Box, Container, Grid, Paper, Typography, Chip, Divider, Button } from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalAirportIcon from '@mui/icons-material/LocalAirport';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import PoolIcon from '@mui/icons-material/Pool';
import SpaIcon from '@mui/icons-material/Spa';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import HotTubIcon from '@mui/icons-material/HotTub';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
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

export async function generateMetadata({ params, searchParams }: { params: { locale: string; slug: string; id: string }, searchParams: { [k: string]: string | string[] | undefined } }): Promise<Metadata> {
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

export default async function HotelDetailPage({ params, searchParams }: { params: { locale: string; slug: string; id: string }, searchParams: { [k: string]: string | string[] | undefined } }) {
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
    makesOffer: agoda?.dailyRate ? [{
      '@type': 'Offer',
      price: agoda.dailyRate,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: hotel.url || undefined,
      itemOffered: {
        '@type': 'HotelRoom',
        name: `${hotel.hotel_name} Room`,
      },
    }] : undefined,
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

            {/* Highlights */}
            {Array.isArray(hotel?.ai_content?.amenities) && hotel!.ai_content!.amenities!.length > 0 && (
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Highlights</Typography>
                <Grid container spacing={2}>
                  {hotel!.ai_content!.amenities!.slice(0, 8).map((a, i) => {
                    const label = a.toLowerCase();
                    const Icon = label.includes('wifi') ? WifiIcon
                      : label.includes('airport') || label.includes('transfer') ? LocalAirportIcon
                      : label.includes('air') && label.includes('conditioning') ? AcUnitIcon
                      : label.includes('housekeeping') ? CleaningServicesIcon
                      : label.includes('room service') ? RoomServiceIcon
                      : label.includes('parking') ? LocalParkingIcon
                      : label.includes('pool') ? PoolIcon
                      : label.includes('spa') ? SpaIcon
                      : label.includes('restaurant') ? RestaurantIcon
                      : label.includes('bar') ? LocalBarIcon
                      : label.includes('family') ? FamilyRestroomIcon
                      : label.includes('coffee') || label.includes('breakfast') ? LocalCafeIcon
                      : label.includes('hot tub') ? HotTubIcon
                      : label.includes('fitness') || label.includes('gym') ? FitnessCenterIcon
                      : null;
                    return (
                      <Grid item xs={6} sm={4} key={i}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {Icon ? <Icon fontSize="small" /> : <Chip size="small" label={''} sx={{ visibility: 'hidden' }} />}
                          <Typography variant="body2">{a}</Typography>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </Paper>
            )}

            {Array.isArray(hotel?.ai_content?.amenities) && hotel!.ai_content!.amenities!.length > 0 && (
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Amenities</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {hotel!.ai_content!.amenities!.map((a, i) => (<Chip key={i} label={a} />))}
                </Box>
              </Paper>
            )}

            {/* Time & season sections */}
            {(hotel?.ai_content?.best_months || hotel?.ai_content?.cheapest_time || hotel?.ai_content?.peak_season) && (
              <Paper sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2}>
                  {hotel?.ai_content?.best_months && (
                    <Grid item xs={12} md={4}>
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>Best months</Typography>
                      <Typography color="text.secondary">{hotel.ai_content!.best_months}</Typography>
                    </Grid>
                  )}
                  {hotel?.ai_content?.cheapest_time && (
                    <Grid item xs={12} md={4}>
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>Cheapest time</Typography>
                      <Typography color="text.secondary">{hotel.ai_content!.cheapest_time}</Typography>
                    </Grid>
                  )}
                  {hotel?.ai_content?.peak_season && (
                    <Grid item xs={12} md={4}>
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>Peak season</Typography>
                      <Typography color="text.secondary">{hotel.ai_content!.peak_season}</Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            )}

            {/* Transportation */}
            {hotel?.ai_content?.transportation && (
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Transportation</Typography>
                <Box sx={{ display: 'grid', gap: 0.5 }}>
                  {hotel.ai_content.transportation.distance_from_airport_text && (
                    <Typography color="text.secondary">{hotel.ai_content.transportation.distance_from_airport_text}</Typography>
                  )}
                  {hotel.ai_content.transportation.travel_time_text && (
                    <Typography color="text.secondary">{hotel.ai_content.transportation.travel_time_text}</Typography>
                  )}
                </Box>
                {Array.isArray(hotel.ai_content.transportation.options) && hotel.ai_content.transportation.options.length > 0 && (
                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {hotel.ai_content.transportation.options.map((o, i) => (
                      <Chip key={i} variant="outlined" label={o} />
                    ))}
                  </Box>
                )}
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

            {/* Reviews */}
            {Array.isArray(hotel?.ai_content?.reviews) && hotel!.ai_content!.reviews!.length > 0 && (
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Reviews</Typography>
                <Grid container spacing={1.5}>
                  {hotel!.ai_content!.reviews!.slice(0, 8).map((r, i) => (
                    <Grid key={i} item xs={12} sm={6}>
                      <Paper variant="outlined" sx={{ p: 1.5 }}>
                        <Typography sx={{ fontWeight: 700, mb: 0.5 }}>{r.title || 'Review'}</Typography>
                        {typeof r.rating === 'number' && (<Chip size="small" color="primary" label={r.rating.toFixed(1)} sx={{ mr: 1 }} />)}
                        {r.theme && (<Chip size="small" label={r.theme} />)}
                        {r.snippet && (<Typography color="text.secondary" sx={{ mt: 0.5 }}>{r.snippet}</Typography>)}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
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
              <Button fullWidth variant="contained" color="success" href={'tel:+18883511711'} sx={{ fontWeight: 800, mb: 1 }}>Call (888) 351-1711</Button>
              <Button fullWidth variant="outlined" href={`/${params.locale || 'en'}/hotel-quote?hid=${encodeURIComponent(String(id))}&name=${encodeURIComponent(hotel?.hotel_name || '')}&price=${encodeURIComponent(String(agoda?.dailyRate || ''))}&currency=USD&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&iata=${encodeURIComponent(iata)}&img=${encodeURIComponent(agoda?.imageURL || '')}`} sx={{ fontWeight: 800 }}>Get Quote</Button>
            </Paper>

            {/* Map */}
            {(typeof hotel?.latitude === 'number' && typeof hotel?.longitude === 'number') && (
              <Paper sx={{ p: 0, mt: 2, overflow: 'hidden' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, p: 2, pb: 0 }}>Location map</Typography>
                {(() => {
                  const lat = hotel!.latitude as number;
                  const lon = hotel!.longitude as number;
                  const bbox = `${(lon - 0.05).toFixed(6)}%2C${(lat - 0.05).toFixed(6)}%2C${(lon + 0.05).toFixed(6)}%2C${(lat + 0.05).toFixed(6)}`;
                  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;
                  return (
                    <Box sx={{ width: '100%', height: 280 }}>
                      <iframe title="map" src={src} style={{ border: 0, width: '100%', height: '100%' }} />
                    </Box>
                  );
                })()}
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}


