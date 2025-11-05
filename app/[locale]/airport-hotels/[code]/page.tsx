import { Box, Container, Grid, Card, CardContent, CardActions, Typography, Button, Chip } from '@mui/material';
import type { Metadata } from 'next';
import HotelImageSlider from '@/components/HotelImageSlider';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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

interface AiCityContent {
  overview?: string;
  peak_season?: string;
  low_season?: string;
  monthly_weather_overview?: string;
  transportation?: string;
  airport_hotels_paragraph?: string;
  popular_hotels_blurbs?: Array<{ hotel_name: string; text: string }>;
  faqs?: Array<{ q: string; a: string }>;
  seo_keywords?: string[];
  title?: string;
  meta_description?: string;
}

interface CityStats {
  total_hotels?: number;
  star_stats?: Record<string, number>;
  top_amenities?: string[];
  categories?: string[];
}

interface CityPopularHotel {
  hotel_id: number;
  hotel_name: string;
  star_rating?: number;
  distance_km?: number;
  url?: string;
}

interface ApiResponse {
  _id: string;
  airport_iata: string;
  airport_name: string;
  city: string;
  country: string;
  city_code: string;
  hotels: HotelItem[];
  ai_city_content?: AiCityContent;
  city_page_stats?: CityStats;
  city_popular_hotels?: CityPopularHotel[];
  title?: string;
  meta_description?: string;
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
    if (Array.isArray(json) && json.length > 0) {
      const up = iata.toUpperCase();
      const match = json.find((x: any) => x?.city_code === up || x?.airport_iata === up) || json[0];
      return match as ApiResponse;
    }
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

export async function generateMetadata({ params }: { params: { locale: string; code: string } }): Promise<Metadata> {
  const { code, locale } = params as any;
  const data = await fetchHotels(code);
  const city = data?.city || code.toUpperCase();
  const airport = data?.airport_iata || code.toUpperCase();
  const title = data?.ai_city_content?.title || data?.title || `${airport} Airport Hotels in ${city} | Up to 30% Off`;
  const description = data?.ai_city_content?.meta_description || data?.meta_description || data?.ai_city_content?.overview || `Find hotels near ${airport} in ${city}, ${data?.country || ''}. Compare prices, distances and book quotes with up to 30% off.`;
  const ogImage = `https://source.unsplash.com/1200x630/?hotel,${encodeURIComponent(city)}`;
  const path = `/${locale || 'en'}/airport-hotels/${code}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      locale: locale || 'en',
      siteName: 'AirlinesMap',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: path,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
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
  const city = data?.city || code.toUpperCase();
  const airport = data?.airport_iata || code.toUpperCase();
  const pageTitle = data?.ai_city_content?.title || data?.title || `${airport} Airport Hotels in ${city} | Up to 30% Off`;

  return (
    <Box sx={{ minHeight: '70vh', backgroundColor: '#f8fafc' }}>
      <Container sx={{ pt: { xs: 3, md: 6 }, pb: 6 }}>
        {/* JSON-LD: ItemList of hotels */}
        {data && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                name: `${data.airport_iata} Airport Hotels in ${data.city}, ${data.country}`,
                itemListOrder: 'http://schema.org/ItemListOrderAscending',
                itemListElement: (data.hotels || [])
                  .filter((h: any) => {
                    const a = agodaMap[h.hotel_id];
                    return a && a.dailyRate && a.imageURL;
                  })
                  .slice(0, 12)
                  .map((h: any, index: number) => {
                    const a = agodaMap[h.hotel_id];
                    return {
                      '@type': 'ListItem',
                      position: index + 1,
                      item: {
                        '@type': 'Hotel',
                        name: h.hotel_name,
                        url: `/${(locale || 'en')}/hotel-quote?hid=${encodeURIComponent(String(h.hotel_id))}&name=${encodeURIComponent(h.hotel_name)}&currency=USD&iata=${encodeURIComponent(code)}`,
                        image: a?.imageURL || undefined,
                        address: {
                          '@type': 'PostalAddress',
                          addressLocality: h.city || data.city,
                          addressCountry: data.country,
                        },
                        geo: (typeof h.latitude === 'number' && typeof h.longitude === 'number') ? {
                          '@type': 'GeoCoordinates',
                          latitude: h.latitude,
                          longitude: h.longitude,
                        } : undefined,
                        starRating: typeof (a?.starRating ?? h.star_rating) === 'number' ? {
                          '@type': 'Rating',
                          ratingValue: (a?.starRating ?? h.star_rating),
                          bestRating: 5,
                        } : undefined,
                        offers: a?.dailyRate ? {
                          '@type': 'Offer',
                          price: a.dailyRate,
                          priceCurrency: 'USD',
                          availability: 'https://schema.org/InStock',
                        } : undefined,
                        additionalProperty: typeof h.distance_km === 'number' ? [{
                          '@type': 'PropertyValue',
                          name: 'distanceFromAirportKm',
                          value: h.distance_km,
                        }] : undefined,
                      },
                    };
                  }),
              }),
            }}
          />
        )}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 800 }}>
            {pageTitle}
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
              const gallery: string[] = [a.imageURL];
              if (h.city) {
                gallery.push(`https://source.unsplash.com/featured/?hotel,${encodeURIComponent(h.city)}`);
              }
              if (h.hotel_name) {
                gallery.push(`https://source.unsplash.com/featured/?resort,${encodeURIComponent(h.hotel_name.split(' ').slice(0,2).join(' '))}`);
              }
              return (
              <Grid item xs={12} sm={6} md={6} key={h.hotel_id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <HotelImageSlider images={gallery} alt={h.hotel_name} height={220} />
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                      <a href={`/${locale || 'en'}/hotel/${slugify(`${h.hotel_name} ${h.city || data.city}`)}/${h.hotel_id}?iata=${encodeURIComponent(code)}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {h.hotel_name}
                      </a>
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
                    {typeof h.distance_km === 'number' && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Approx. {h.distance_km.toFixed(1)} km from airport
                      </Typography>
                    )}
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
                      href={`/${locale || 'en'}/hotel/${slugify(`${h.hotel_name} ${h.city || data.city}`)}/${h.hotel_id}?iata=${encodeURIComponent(code)}`}
                    >
                      Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              );
            })}
          </Grid>
        )}

        {data?.ai_city_content && (
          <Box sx={{ mt: 5 }}>
            {data.ai_city_content.overview && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 800, mb: 1 }}>Overview</Typography>
                <Typography color="text.secondary">{data.ai_city_content.overview}</Typography>
              </Box>
            )}
            {data.ai_city_content.peak_season && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 800, mb: 1 }}>Peak season</Typography>
                <Typography color="text.secondary">{data.ai_city_content.peak_season}</Typography>
              </Box>
            )}
            {data.ai_city_content.low_season && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 800, mb: 1 }}>Low season</Typography>
                <Typography color="text.secondary">{data.ai_city_content.low_season}</Typography>
              </Box>
            )}
            {data.ai_city_content.monthly_weather_overview && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 800, mb: 1 }}>Monthly weather overview</Typography>
                <Typography color="text.secondary">{data.ai_city_content.monthly_weather_overview}</Typography>
              </Box>
            )}
            {data.ai_city_content.transportation && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 800, mb: 1 }}>Transportation</Typography>
                <Typography color="text.secondary">{data.ai_city_content.transportation}</Typography>
              </Box>
            )}
            {data.ai_city_content.airport_hotels_paragraph && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 800, mb: 1 }}>Airport hotels</Typography>
                <Typography color="text.secondary">{data.ai_city_content.airport_hotels_paragraph}</Typography>
              </Box>
            )}
          </Box>
        )}

        {(data?.city_page_stats || data?.city_popular_hotels) && (
          <Box sx={{ mt: 4 }}>
            {data?.city_page_stats && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 800, mb: 1 }}>City stats</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                  {typeof data.city_page_stats.total_hotels === 'number' && (
                    <Chip label={`Total hotels: ${data.city_page_stats.total_hotels}`} />
                  )}
                  {data.city_page_stats.categories?.map((c) => (
                    <Chip key={c} variant="outlined" label={c} />
                  ))}
                </Box>
                {data.city_page_stats.star_stats && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {Object.entries(data.city_page_stats.star_stats).map(([star, count]) => (
                      <Chip key={star} color="primary" label={`${star}★: ${count}`} />
                    ))}
                  </Box>
                )}
              </Box>
            )}

            {Array.isArray(data?.city_popular_hotels) && data.city_popular_hotels.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 800, mb: 1 }}>Popular hotels</Typography>
                <Grid container spacing={2}>
                  {data.city_popular_hotels.slice(0, 8).map((p) => (
                    <Grid item xs={12} sm={6} md={6} key={p.hotel_id}>
                      <Card>
                        <CardContent>
                          <Typography sx={{ fontWeight: 700 }}>{p.hotel_name}</Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                            {typeof p.star_rating === 'number' && <Chip size="small" color="primary" label={`${p.star_rating}★`} />}
                            {typeof p.distance_km === 'number' && <Chip size="small" variant="outlined" label={`${p.distance_km.toFixed(1)} km`} />}
                          </Box>
                          {typeof p.distance_km === 'number' && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              Approx. {p.distance_km.toFixed(1)} km from airport
                            </Typography>
                          )}
                        </CardContent>
                        <CardActions sx={{ p: 2, pt: 0 }}>
                          <Button variant="outlined" size="small" sx={{ fontWeight: 700 }} href={`/${locale || 'en'}/hotel/${slugify(`${p.hotel_name} ${data.city}`)}/${p.hotel_id}?iata=${encodeURIComponent(code)}`}>
                            Details
                          </Button>
                          <Button variant="contained" size="small" color="success" sx={{ fontWeight: 700 }} href={'tel:+18883196206'}>
                            Call Now
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        )}

        {Array.isArray(data?.ai_city_content?.faqs) && data.ai_city_content!.faqs!.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 800, mb: 1 }}>FAQs</Typography>
            <Box sx={{ display: 'grid', gap: 1.5 }}>
              {data!.ai_city_content!.faqs!.map((f, i) => (
                <Box key={i}>
                  <Typography sx={{ fontWeight: 700 }}>{f.q}</Typography>
                  <Typography color="text.secondary">{f.a}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}


