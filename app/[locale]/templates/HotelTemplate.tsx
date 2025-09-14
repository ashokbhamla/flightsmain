import { Locale } from '@/lib/i18n';
import { Typography, Box, Container, Grid, Card, CardContent, Button, Chip, Rating } from '@mui/material';
import FlightSearchBox from '@/components/FlightSearchBox';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import WifiIcon from '@mui/icons-material/Wifi';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import PoolIcon from '@mui/icons-material/Pool';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

interface HotelTemplateProps {
  locale: Locale;
  pageData: any;
  params: any;
  onAction?: (searchData: any) => void;
}

// Language-specific content
const getHotelContent = (locale: Locale, airportName: string, hotelCount: number) => {
  const content = {
    en: {
      title: `${airportName} Airport Hotels - ${hotelCount} Hotels Near Airport`,
      description: `Find the best hotels near ${airportName} Airport. ${hotelCount} hotels with great amenities, free shuttle service, and competitive rates. Book your stay today!`,
      hotelsNearTitle: `${hotelCount} Hotels Near ${airportName} Airport`,
      hotelsDescription: `Discover comfortable accommodations with convenient access to ${airportName} Airport. All hotels offer essential amenities and many provide complimentary airport shuttle service.`,
      noHotelsTitle: `No hotels found for ${airportName} Airport`,
      noHotelsDescription: 'Please try a different airport code or check back later for updated listings.',
      viewDetails: 'View Details',
      bookNow: 'Book Now',
      distanceFromAirport: 'km from airport',
      fallbackHotels: [
        {
          name: `${airportName} Airport Hotel`,
          stars: 4,
          distance_km: 0.5,
          distance_text: '5-10 min taxi',
          address: 'Near Airport Terminal',
          url: '#',
          image: 'https://dummyimage.com/600x400/cccccc/000000&text=Hotel+Image'
        },
        {
          name: `Grand ${airportName} Hotel`,
          stars: 5,
          distance_km: 1.2,
          distance_text: '10-15 min taxi',
          address: 'Airport Area',
          url: '#',
          image: 'https://dummyimage.com/600x400/cccccc/000000&text=Hotel+Image'
        },
        {
          name: `Budget Inn ${airportName}`,
          stars: 3,
          distance_km: 0.8,
          distance_text: '8-12 min taxi',
          address: 'Airport District',
          url: '#',
          image: 'https://dummyimage.com/600x400/cccccc/000000&text=Hotel+Image'
        }
      ]
    },
    es: {
      title: `Hoteles del Aeropuerto ${airportName} - ${hotelCount} Hoteles Cerca del Aeropuerto`,
      description: `Encuentra los mejores hoteles cerca del Aeropuerto ${airportName}. ${hotelCount} hoteles con excelentes comodidades, servicio de traslado gratuito y tarifas competitivas. ¡Reserva tu estadía hoy!`,
      hotelsNearTitle: `${hotelCount} Hoteles Cerca del Aeropuerto ${airportName}`,
      hotelsDescription: `Descubre alojamientos cómodos con acceso conveniente al Aeropuerto ${airportName}. Todos los hoteles ofrecen comodidades esenciales y muchos proporcionan servicio de traslado gratuito al aeropuerto.`,
      noHotelsTitle: `No se encontraron hoteles para el Aeropuerto ${airportName}`,
      noHotelsDescription: 'Por favor, intenta con un código de aeropuerto diferente o revisa más tarde para listados actualizados.',
      viewDetails: 'Ver Detalles',
      bookNow: 'Reservar Ahora',
      distanceFromAirport: 'km del aeropuerto',
      fallbackHotels: [
        {
          name: `Hotel del Aeropuerto ${airportName}`,
          stars: 4,
          distance_km: 0.5,
          distance_text: '5-10 min taxi',
          address: 'Cerca del Terminal del Aeropuerto',
          url: '#',
          image: 'https://dummyimage.com/600x400/cccccc/000000&text=Hotel+Image'
        },
        {
          name: `Gran Hotel ${airportName}`,
          stars: 5,
          distance_km: 1.2,
          distance_text: '10-15 min taxi',
          address: 'Área del Aeropuerto',
          url: '#',
          image: 'https://dummyimage.com/600x400/cccccc/000000&text=Hotel+Image'
        },
        {
          name: `Posada Económica ${airportName}`,
          stars: 3,
          distance_km: 0.8,
          distance_text: '8-12 min taxi',
          address: 'Distrito del Aeropuerto',
          url: '#',
          image: 'https://dummyimage.com/600x400/cccccc/000000&text=Hotel+Image'
        }
      ]
    },
    ru: {
      title: `Отели Аэропорта ${airportName} - ${hotelCount} Отелей Возле Аэропорта`,
      description: `Найдите лучшие отели возле аэропорта ${airportName}. ${hotelCount} отелей с отличными удобствами, бесплатным трансфером и конкурентоспособными тарифами. Забронируйте проживание сегодня!`,
      hotelsNearTitle: `${hotelCount} Отелей Возле Аэропорта ${airportName}`,
      hotelsDescription: `Откройте для себя комфортабельные варианты размещения с удобным доступом к аэропорту ${airportName}. Все отели предлагают основные удобства, а многие предоставляют бесплатный трансфер в аэропорт.`,
      noHotelsTitle: `Отели для аэропорта ${airportName} не найдены`,
      noHotelsDescription: 'Пожалуйста, попробуйте другой код аэропорта или проверьте позже для обновленных списков.',
      viewDetails: 'Просмотр Деталей',
      bookNow: 'Забронировать Сейчас',
      distanceFromAirport: 'км от аэропорта',
      fallbackHotels: [
        {
          name: `Отель Аэропорта ${airportName}`,
          stars: 4,
          distance_km: 0.5,
          distance_text: '5-10 мин такси',
          address: 'Возле Терминала Аэропорта',
          url: '#',
          image: 'https://dummyimage.com/600x400/cccccc/000000&text=Hotel+Image'
        },
        {
          name: `Гранд Отель ${airportName}`,
          stars: 5,
          distance_km: 1.2,
          distance_text: '10-15 мин такси',
          address: 'Район Аэропорта',
          url: '#',
          image: 'https://dummyimage.com/600x400/cccccc/000000&text=Hotel+Image'
        },
        {
          name: `Бюджетный Отель ${airportName}`,
          stars: 3,
          distance_km: 0.8,
          distance_text: '8-12 мин такси',
          address: 'Район Аэропорта',
          url: '#',
          image: 'https://dummyimage.com/600x400/cccccc/000000&text=Hotel+Image'
        }
      ]
    },
    fr: {
      title: `Hôtels de l'Aéroport ${airportName} - ${hotelCount} Hôtels Près de l'Aéroport`,
      description: `Trouvez les meilleurs hôtels près de l'Aéroport ${airportName}. ${hotelCount} hôtels avec d'excellents équipements, service de navette gratuit et tarifs compétitifs. Réservez votre séjour aujourd'hui!`,
      hotelsNearTitle: `${hotelCount} Hôtels Près de l'Aéroport ${airportName}`,
      hotelsDescription: `Découvrez des hébergements confortables avec un accès pratique à l'Aéroport ${airportName}. Tous les hôtels offrent des équipements essentiels et beaucoup fournissent un service de navette gratuit vers l'aéroport.`,
      noHotelsTitle: `Aucun hôtel trouvé pour l'Aéroport ${airportName}`,
      noHotelsDescription: 'Veuillez essayer un code d\'aéroport différent ou revenir plus tard pour des listes mises à jour.',
      viewDetails: 'Voir Détails',
      bookNow: 'Réserver Maintenant',
      distanceFromAirport: 'km de l\'aéroport',
      fallbackHotels: [
        {
          name: `Hôtel de l'Aéroport ${airportName}`,
          stars: 4,
          distance_km: 0.5,
          distance_text: '5-10 min taxi',
          address: 'Près du Terminal de l\'Aéroport',
          url: '#',
          image: 'https://dummyimage.com/600x400/cccccc/000000&text=Hotel+Image'
        },
        {
          name: `Grand Hôtel ${airportName}`,
          stars: 5,
          distance_km: 1.2,
          distance_text: '10-15 min taxi',
          address: 'Zone de l\'Aéroport',
          url: '#',
          image: 'https://dummyimage.com/600x400/cccccc/000000&text=Hotel+Image'
        },
        {
          name: `Auberge Économique ${airportName}`,
          stars: 3,
          distance_km: 0.8,
          distance_text: '8-12 min taxi',
          address: 'District de l\'Aéroport',
          url: '#',
          image: 'https://dummyimage.com/600x400/cccccc/000000&text=Hotel+Image'
        }
      ]
    }
  };

  return content[locale] || content.en;
};

export default function HotelTemplate({ locale, pageData, params, onAction }: HotelTemplateProps) {
  const { airportCode } = params;
  
  // Extract airport code from the parameter (remove -airport-hotels suffix)
  const extractedAirportCode = airportCode.replace('-airport-hotels', '');
  
  // Extract data from API response
  const airportName = pageData?.airport_name || airportCode.replace(/-/g, ' ').toUpperCase();
  const airportCodeFromAPI = pageData?.airport_code || airportCode.toUpperCase();
  let hotelsList = pageData?.hotels_list || [];
  const hotelCount = hotelsList.length;
  const overview = pageData?.overview || `Find the best hotels near ${airportName} Airport with great amenities and competitive rates`;

  const content = getHotelContent(locale, airportName, hotelCount);

  // Fallback data when API is not available
  if (!pageData || hotelsList.length === 0) {
    hotelsList = content.fallbackHotels;
  }

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
          <Box sx={{ textAlign: 'left', mb: 4 }}>
            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 700,
                mb: 2,
                textAlign: 'left'
              }}
            >
              {pageData?.title || content.title}
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
              {overview}
            </Typography>
          </Box>
          <FlightSearchBox />
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ mb: 2, color: '#333', fontWeight: 700 }}>
            {content.hotelsNearTitle}
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
            {content.hotelsDescription}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {hotelsList.map((hotel: any, index: number) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                }
              }}>
                <Box sx={{ 
                  height: 200, 
                  backgroundImage: `url(${hotel.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.3)',
                    zIndex: 1
                  }
                }}>
                  <Typography variant="h6" sx={{ zIndex: 2, textAlign: 'center', px: 2 }}>
                    {hotel.name}
                  </Typography>
                </Box>
                
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', flex: 1 }}>
                      {hotel.name}
                    </Typography>
                    {hotel.stars && hotel.stars !== 'N/A' && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 2 }}>
                        <StarIcon sx={{ color: '#ffc107', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {hotel.stars}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <LocationOnIcon sx={{ color: '#666', fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {hotel.distance_text} • {hotel.distance_km} {content.distanceFromAirport}
                    </Typography>
                  </Box>

                  {hotel.address && (
                    <Typography variant="body2" sx={{ color: '#666', mb: 3, lineHeight: 1.6 }}>
                      {hotel.address}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e3a8a' }}>
                      {content.viewDetails}
                    </Typography>
                    <Button
                      variant="contained"
                      component="a"
                      href={hotel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        backgroundColor: '#1e3a8a',
                        '&:hover': {
                          backgroundColor: '#1536a3'
                        },
                        borderRadius: 2,
                        px: 3,
                        py: 1
                      }}
                    >
                      {content.bookNow}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {hotelsList.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" sx={{ color: '#666', mb: 2 }}>
              {content.noHotelsTitle}
            </Typography>
            <Typography variant="body1" sx={{ color: '#999' }}>
              {content.noHotelsDescription}
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
