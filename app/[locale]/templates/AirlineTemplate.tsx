import { Locale } from '@/lib/i18n';
import { Typography, Box, Container, Grid, Card, CardContent, Button, Chip, Rating } from '@mui/material';
import FlightSearchBox from '@/components/FlightSearchBox';
import FlightIcon from '@mui/icons-material/Flight';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { getAirlineLogoUrl } from '@/lib/cdn';

interface AirlineTemplateProps {
  locale: Locale;
  pageData: any;
  params: any;
  onAction?: (searchData: any) => void;
}

// Language-specific content
const getAirlineContent = (locale: Locale, airlineName: string) => {
  const content = {
    en: {
      title: `${airlineName} Airlines - Flight Information & Booking`,
      description: `Find the best ${airlineName} flight deals, routes, and booking information. Compare prices and book your next trip with ${airlineName}.`,
      aboutTitle: `About ${airlineName}`,
      routesTitle: 'Popular Routes',
      servicesTitle: 'Services & Amenities',
      bookingTitle: 'Book Your Flight',
      searchFlights: 'Search Flights',
      viewDetails: 'View Details',
      bookNow: 'Book Now',
      from: 'From',
      to: 'To',
      price: 'Price',
      duration: 'Duration',
      fallbackRoutes: [
        {
          from: 'New York (JFK)',
          to: 'Los Angeles (LAX)',
          price: '$299',
          duration: '5h 30m',
          frequency: 'Daily'
        },
        {
          from: 'London (LHR)',
          to: 'Paris (CDG)',
          price: '$199',
          duration: '1h 15m',
          frequency: 'Multiple daily'
        },
        {
          from: 'Tokyo (NRT)',
          to: 'Seoul (ICN)',
          price: '$399',
          duration: '2h 30m',
          frequency: 'Daily'
        }
      ]
    },
    es: {
      title: `Aerolíneas ${airlineName} - Información de Vuelos y Reservas`,
      description: `Encuentra las mejores ofertas de vuelos de ${airlineName}, rutas e información de reservas. Compara precios y reserva tu próximo viaje con ${airlineName}.`,
      aboutTitle: `Acerca de ${airlineName}`,
      routesTitle: 'Rutas Populares',
      servicesTitle: 'Servicios y Comodidades',
      bookingTitle: 'Reserva tu Vuelo',
      searchFlights: 'Buscar Vuelos',
      viewDetails: 'Ver Detalles',
      bookNow: 'Reservar Ahora',
      from: 'Desde',
      to: 'Hacia',
      price: 'Precio',
      duration: 'Duración',
      fallbackRoutes: [
        {
          from: 'Nueva York (JFK)',
          to: 'Los Ángeles (LAX)',
          price: '$299',
          duration: '5h 30m',
          frequency: 'Diario'
        },
        {
          from: 'Londres (LHR)',
          to: 'París (CDG)',
          price: '$199',
          duration: '1h 15m',
          frequency: 'Múltiples diarios'
        },
        {
          from: 'Tokio (NRT)',
          to: 'Seúl (ICN)',
          price: '$399',
          duration: '2h 30m',
          frequency: 'Diario'
        }
      ]
    },
    ru: {
      title: `Авиакомпания ${airlineName} - Информация о Рейсах и Бронирование`,
      description: `Найдите лучшие предложения рейсов ${airlineName}, маршруты и информацию о бронировании. Сравните цены и забронируйте свой следующий рейс с ${airlineName}.`,
      aboutTitle: `О ${airlineName}`,
      routesTitle: 'Популярные Маршруты',
      servicesTitle: 'Услуги и Удобства',
      bookingTitle: 'Забронируйте Рейс',
      searchFlights: 'Поиск Рейсов',
      viewDetails: 'Просмотр Деталей',
      bookNow: 'Забронировать Сейчас',
      from: 'Из',
      to: 'В',
      price: 'Цена',
      duration: 'Продолжительность',
      fallbackRoutes: [
        {
          from: 'Нью-Йорк (JFK)',
          to: 'Лос-Анджелес (LAX)',
          price: '$299',
          duration: '5ч 30м',
          frequency: 'Ежедневно'
        },
        {
          from: 'Лондон (LHR)',
          to: 'Париж (CDG)',
          price: '$199',
          duration: '1ч 15м',
          frequency: 'Несколько раз в день'
        },
        {
          from: 'Токио (NRT)',
          to: 'Сеул (ICN)',
          price: '$399',
          duration: '2ч 30м',
          frequency: 'Ежедневно'
        }
      ]
    },
    fr: {
      title: `Compagnie Aérienne ${airlineName} - Informations de Vol et Réservation`,
      description: `Trouvez les meilleures offres de vols ${airlineName}, itinéraires et informations de réservation. Comparez les prix et réservez votre prochain voyage avec ${airlineName}.`,
      aboutTitle: `À Propos de ${airlineName}`,
      routesTitle: 'Itinéraires Populaires',
      servicesTitle: 'Services et Équipements',
      bookingTitle: 'Réservez Votre Vol',
      searchFlights: 'Rechercher des Vols',
      viewDetails: 'Voir Détails',
      bookNow: 'Réserver Maintenant',
      from: 'De',
      to: 'Vers',
      price: 'Prix',
      duration: 'Durée',
      fallbackRoutes: [
        {
          from: 'New York (JFK)',
          to: 'Los Angeles (LAX)',
          price: '$299',
          duration: '5h 30m',
          frequency: 'Quotidien'
        },
        {
          from: 'Londres (LHR)',
          to: 'Paris (CDG)',
          price: '$199',
          duration: '1h 15m',
          frequency: 'Plusieurs par jour'
        },
        {
          from: 'Tokyo (NRT)',
          to: 'Séoul (ICN)',
          price: '$399',
          duration: '2h 30m',
          frequency: 'Quotidien'
        }
      ]
    }
  };

  return content[locale] || content.en;
};

export default function AirlineTemplate({ locale, pageData, params, onAction }: AirlineTemplateProps) {
  const { airline } = params;
  
  // Fallback data when API is not available
  if (!pageData) {
    const airlineName = airline.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
    
    const fallbackData = {
      title: `${airlineName} Airlines - Flight Information & Booking`,
      airline_name: airlineName,
      description: `Find the best ${airlineName} flight deals, routes, and booking information. Compare prices and book your next trip with ${airlineName}.`,
      overview: `<p>${airlineName} is a leading airline offering domestic and international flights with excellent service and competitive prices. Book your next flight with confidence.</p>`,
      routes: [
        {
          from: 'New York (JFK)',
          to: 'Los Angeles (LAX)',
          price: '$299',
          duration: '5h 30m',
          frequency: 'Daily'
        },
        {
          from: 'London (LHR)',
          to: 'Paris (CDG)',
          price: '$199',
          duration: '1h 15m',
          frequency: 'Multiple daily'
        },
        {
          from: 'Tokyo (NRT)',
          to: 'Seoul (ICN)',
          price: '$399',
          duration: '2h 30m',
          frequency: 'Daily'
        }
      ],
      services: [
        'In-flight entertainment',
        'Complimentary meals',
        'WiFi on board',
        'Extra legroom options',
        'Priority boarding'
      ]
    };
    pageData = fallbackData;
  }

  const airlineName = pageData.airline_name || airline.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  const content = getAirlineContent(locale, airlineName);

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
            {/* Airline Logo */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 3, 
              mb: 3,
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <Box
                sx={{
                  width: { xs: 120, sm: 150, md: 180 },
                  height: { xs: 120, sm: 150, md: 180 },
                  borderRadius: '50%',
                  overflow: 'hidden',
                  backgroundImage: `url(${getAirlineLogoUrl(airline.toUpperCase(), 'large')})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '4px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  position: 'relative',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    zIndex: 1,
                  }
                }}
              >
                <FlightIcon sx={{ 
                  fontSize: { xs: '3rem', sm: '4rem', md: '5rem' }, 
                  color: 'white',
                  zIndex: 2
                }} />
              </Box>
              <Box sx={{ flex: 1 }}>
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
                  dangerouslySetInnerHTML={{ __html: pageData?.description || content.description }}
                />
              </Box>
            </Box>
          </Box>
          <FlightSearchBox />
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* About Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ mb: 4, color: '#333', fontWeight: 700 }}>
            {content.aboutTitle}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ mb: 3, color: '#666', lineHeight: 1.7 }}
            dangerouslySetInnerHTML={{ __html: pageData?.overview || content.description }}
          />
        </Box>

        {/* Popular Routes */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ mb: 4, color: '#333', fontWeight: 700 }}>
            {content.routesTitle}
          </Typography>
          
          <Grid container spacing={3}>
            {(pageData?.routes || content.fallbackRoutes).map((route: any, index: number) => (
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
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <FlightIcon sx={{ color: '#1e3a8a', mr: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                        {airlineName}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                        <strong>{content.from}:</strong> {route.from}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                        <strong>{content.to}:</strong> {route.to}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e3a8a' }}>
                        {route.price}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {route.duration}
                      </Typography>
                    </Box>

                    <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                      {route.frequency}
                    </Typography>

                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: '#1e3a8a',
                        '&:hover': {
                          backgroundColor: '#1536a3'
                        },
                        borderRadius: 2,
                        py: 1.5
                      }}
                    >
                      {content.bookNow}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Services & Amenities */}
        {pageData?.services && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h3" sx={{ mb: 4, color: '#333', fontWeight: 700 }}>
              {content.servicesTitle}
            </Typography>
            
            <Grid container spacing={2}>
              {pageData.services.map((service: string, index: number) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 2, 
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    backgroundColor: '#f9f9f9'
                  }}>
                    <StarIcon sx={{ color: '#1e3a8a', mr: 1 }} />
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {service}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* City Information */}
        {pageData?.city && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 3,
                color: '#1a1a1a'
              }}
            >
              {locale === 'es' ? 'Información de la Ciudad' : 
               locale === 'ru' ? 'Информация о Городе' :
               locale === 'fr' ? 'Informations sur la Ville' : 'City Information'}
            </Typography>
            
            <div 
              dangerouslySetInnerHTML={{ __html: pageData.city }} 
              style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>
        )}

        {/* Booking Steps */}
        {(pageData?.booking_steps || true) && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 4,
                color: '#1a1a1a',
                textAlign: 'left'
              }}
            >
              How to Book {airlineName} Flights
            </Typography>
            <Box 
              sx={{ 
                color: '#4a5568',
                lineHeight: 1.7,
                '& h3, & h4, & h5, & h6': {
                  color: '#1a1a1a',
                  fontWeight: 600,
                  mb: 2,
                  mt: 3
                },
                '& p': {
                  mb: 2
                },
                '& ul, & ol': {
                  pl: 3,
                  mb: 2
                },
                '& li': {
                  mb: 1
                }
              }}
              dangerouslySetInnerHTML={{ __html: pageData.booking_steps || '<p>Learn how to book flights with ' + airlineName + '. Follow our simple step-by-step guide to find and book the best deals.</p><ol><li>Search for your destination and travel dates</li><li>Compare prices and select your preferred flight</li><li>Enter passenger details and payment information</li><li>Confirm your booking and receive your e-ticket</li></ol>' }}
            />
          </Box>
        )}

        {/* Cancellation Policy */}
        {(pageData?.cancellation || true) && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 4,
                color: '#1a1a1a',
                textAlign: 'left'
              }}
            >
              {airlineName} Cancellation Policy
            </Typography>
            <Box 
              sx={{ 
                color: '#4a5568',
                lineHeight: 1.7,
                '& h3, & h4, & h5, & h6': {
                  color: '#1a1a1a',
                  fontWeight: 600,
                  mb: 2,
                  mt: 3
                },
                '& p': {
                  mb: 2
                },
                '& ul, & ol': {
                  pl: 3,
                  mb: 2
                },
                '& li': {
                  mb: 1
                }
              }}
              dangerouslySetInnerHTML={{ __html: pageData.cancellation || '<p>Understanding ' + airlineName + ' cancellation policy is important before booking your flight.</p><h3>Cancellation Rules</h3><ul><li>Free cancellation within 24 hours of booking</li><li>Refundable tickets can be cancelled for a fee</li><li>Non-refundable tickets may be eligible for credit</li><li>Changes may be subject to fare difference</li></ul><h3>How to Cancel</h3><p>You can cancel your booking online through our website or by contacting customer service.</p>' }}
            />
          </Box>
        )}

        {/* Classes */}
        {(pageData?.classes || true) && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 4,
                color: '#1a1a1a',
                textAlign: 'left'
              }}
            >
              {airlineName} Flight Classes
            </Typography>
            <Box 
              sx={{ 
                color: '#4a5568',
                lineHeight: 1.7,
                '& h3, & h4, & h5, & h6': {
                  color: '#1a1a1a',
                  fontWeight: 600,
                  mb: 2,
                  mt: 3
                },
                '& p': {
                  mb: 2
                },
                '& ul, & ol': {
                  pl: 3,
                  mb: 2
                },
                '& li': {
                  mb: 1
                }
              }}
              dangerouslySetInnerHTML={{ __html: pageData.classes || '<p>' + airlineName + ' offers different travel classes to suit your needs and budget.</p><h3>Economy Class</h3><p>Our most affordable option with comfortable seating and essential amenities.</p><h3>Business Class</h3><p>Enhanced comfort with priority boarding, extra legroom, and premium services.</p><h3>First Class</h3><p>Luxury travel experience with the highest level of comfort and personalized service.</p>' }}
            />
          </Box>
        )}

        {/* Destinations Overview */}
        {(pageData?.destinations_overview || true) && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 4,
                color: '#1a1a1a',
                textAlign: 'left'
              }}
            >
              {airlineName} Destinations Overview
            </Typography>
            <Box 
              sx={{ 
                color: '#4a5568',
                lineHeight: 1.7,
                '& h3, & h4, & h5, & h6': {
                  color: '#1a1a1a',
                  fontWeight: 600,
                  mb: 2,
                  mt: 3
                },
                '& p': {
                  mb: 2
                },
                '& ul, & ol': {
                  pl: 3,
                  mb: 2
                },
                '& li': {
                  mb: 1
                }
              }}
              dangerouslySetInnerHTML={{ __html: pageData.destinations_overview || '<p>' + airlineName + ' serves numerous destinations worldwide, connecting travelers to major cities and popular tourist destinations.</p><h3>Domestic Destinations</h3><p>We operate flights to major cities across the country, providing convenient connections for domestic travelers.</p><h3>International Destinations</h3><p>Our international network includes popular destinations in Europe, Asia, and the Americas.</p><h3>Popular Routes</h3><ul><li>Major business hubs</li><li>Tourist destinations</li><li>Connecting flights</li><li>Seasonal routes</li></ul>' }}
            />
          </Box>
        )}

        {/* Contact Information */}
        {pageData?.contactInfo && (
          <Box sx={{ 
            mb: 6, 
            p: 4,
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 3,
                color: '#1a1a1a',
                textAlign: 'left'
              }}
            >
              {airlineName} Contact Information
            </Typography>
            
            <Grid container spacing={3}>
              {pageData.contactInfo.phone && (
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 1 }}>
                      Phone
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {pageData.contactInfo.phone}
                    </Typography>
                  </Box>
                </Grid>
              )}
              
              {pageData.contactInfo.email && (
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 1 }}>
                      Email
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {pageData.contactInfo.email}
                    </Typography>
                  </Box>
                </Grid>
              )}
              
              {pageData.contactInfo.website && (
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 1 }}>
                      Website
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      <a 
                        href={pageData.contactInfo.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#1e3a8a', textDecoration: 'none' }}
                      >
                        {pageData.contactInfo.website}
                      </a>
                    </Typography>
                  </Box>
                </Grid>
              )}
              
              {pageData.contactInfo.address && (
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 1 }}>
                      Address
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {pageData.contactInfo.address}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* FAQs */}
        {((pageData?.faqs && Array.isArray(pageData.faqs) && pageData.faqs.length > 0) || true) && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 4,
                color: '#1a1a1a',
                textAlign: 'left'
              }}
            >
              Frequently Asked Questions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {(pageData?.faqs && Array.isArray(pageData.faqs) && pageData.faqs.length > 0) ? 
                pageData.faqs.map((faq: any, index: number) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        mb: 1,
                        color: '#1a1a1a',
                        textAlign: 'left'
                      }}
                    >
                      {faq.q || faq.question || `Question ${index + 1}`}
                    </Typography>
                    <Box 
                      sx={{ 
                        color: '#4a5568',
                        lineHeight: 1.6,
                        '& h3, & h4, & h5, & h6': {
                          color: '#1a1a1a',
                          fontWeight: 600,
                          mb: 2,
                          mt: 3
                        },
                        '& p': {
                          mb: 2
                        },
                        '& ul, & ol': {
                          pl: 3,
                          mb: 2
                        },
                        '& li': {
                          mb: 1
                        }
                      }}
                      dangerouslySetInnerHTML={{ __html: faq.a || faq.answer || '' }}
                    />
                  </Box>
                )) : 
                [
                  {
                    q: `What is ${airlineName}?`,
                    a: `${airlineName} is a leading airline providing domestic and international flight services with a focus on customer satisfaction and competitive pricing.`
                  },
                  {
                    q: `How can I book a flight with ${airlineName}?`,
                    a: `You can book flights through our website, mobile app, or by contacting our customer service team. We offer various payment options for your convenience.`
                  },
                  {
                    q: `What is ${airlineName}'s baggage policy?`,
                    a: `Baggage allowances vary by ticket type and destination. Please check our baggage policy page for detailed information about weight limits and fees.`
                  },
                  {
                    q: `Can I change or cancel my ${airlineName} booking?`,
                    a: `Yes, you can change or cancel your booking depending on your ticket type. Some changes may be subject to fees and fare differences.`
                  }
                ].map((faq: any, index: number) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        mb: 1,
                        color: '#1a1a1a',
                        textAlign: 'left'
                      }}
                    >
                      {faq.q}
                    </Typography>
                    <Box 
                      sx={{ 
                        color: '#4a5568',
                        lineHeight: 1.6,
                        '& h3, & h4, & h5, & h6': {
                          color: '#1a1a1a',
                          fontWeight: 600,
                          mb: 2,
                          mt: 3
                        },
                        '& p': {
                          mb: 2
                        },
                        '& ul, & ol': {
                          pl: 3,
                          mb: 2
                        },
                        '& li': {
                          mb: 1
                        }
                      }}
                      dangerouslySetInnerHTML={{ __html: faq.a }}
                    />
                  </Box>
                ))
              }
            </Box>
          </Box>
        )}

        {/* Booking Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ mb: 4, color: '#333', fontWeight: 700 }}>
            {content.bookingTitle}
          </Typography>
          
          <Card sx={{ p: 4, backgroundColor: '#f8f9fa' }}>
            <Typography variant="h6" sx={{ mb: 3, color: '#333' }}>
              {content.searchFlights}
            </Typography>
            <FlightSearchBox />
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
