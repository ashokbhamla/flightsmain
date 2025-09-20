import { Locale } from '@/lib/i18n';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HotelIcon from '@mui/icons-material/Hotel';
import InfoIcon from '@mui/icons-material/Info';
import FlightSearchBox from '@/components/FlightSearchBox';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { getAirportImageUrl } from '@/lib/cdn';

interface AirportTemplateProps {
  locale: Locale;
  pageData: any;
  params: any;
  onAction?: (searchData: any) => void;
}

// Language-specific content
const getAirportContent = (locale: Locale, airportName: string, airportCode: string) => {
  const content = {
    en: {
      title: `${airportName} Airport (${airportCode}) - Airport Information`,
      description: `Complete guide to ${airportName} Airport (${airportCode}). Find terminal information, facilities, airlines, and travel tips.`,
      airportInfoTitle: 'Airport Information',
      airportDetailsTitle: 'Airport Details',
      iataCode: 'IATA Code:',
      icaoCode: 'ICAO Code:',
      airportName: 'Airport Name:',
      phone: 'Phone:',
      airlinesServing: 'Airlines Serving:',
      terminals: 'Terminals:',
      facilities: 'Facilities:',
      overview: 'Overview',
      securityCheckin: 'Security and Check-in',
      faqTitle: 'Frequently Asked Questions',
      fallbackOverview: `Welcome to ${airportName} Airport. This airport serves passengers with various facilities and services. Please note that detailed information may not be available due to API connectivity issues.`,
      fallbackAirlines: 'Multiple airlines serve this airport',
      fallbackTerminals: 'Terminal information available at the airport',
      fallbackFacilities: 'Various facilities and lounges available',
      fallbackFaqs: [
        {
          question: 'What facilities are available at this airport?',
          answer: 'The airport offers various facilities including restaurants, shops, lounges, and other passenger services.'
        },
        {
          question: 'How early should I arrive for my flight?',
          answer: 'We recommend arriving at least 2 hours before domestic flights and 3 hours before international flights.'
        },
        {
          question: 'Why is some information not available?',
          answer: 'Some airport data may not be available due to API connectivity issues. Please contact the airport directly for the most current information.'
        }
      ]
    },
    es: {
      title: `Aeropuerto ${airportName} (${airportCode}) - Información del Aeropuerto`,
      description: `Guía completa del Aeropuerto ${airportName} (${airportCode}). Encuentra información de terminales, instalaciones, aerolíneas y consejos de viaje.`,
      airportInfoTitle: 'Información del Aeropuerto',
      airportDetailsTitle: 'Detalles del Aeropuerto',
      iataCode: 'Código IATA:',
      icaoCode: 'Código ICAO:',
      airportName: 'Nombre del Aeropuerto:',
      phone: 'Teléfono:',
      airlinesServing: 'Aerolíneas que Sirven:',
      terminals: 'Terminales:',
      facilities: 'Instalaciones:',
      overview: 'Resumen',
      securityCheckin: 'Seguridad y Facturación',
      faqTitle: 'Preguntas Frecuentes',
      fallbackOverview: `Bienvenido al Aeropuerto ${airportName}. Este aeropuerto sirve a los pasajeros con varias instalaciones y servicios. Tenga en cuenta que la información detallada puede no estar disponible debido a problemas de conectividad de la API.`,
      fallbackAirlines: 'Múltiples aerolíneas sirven este aeropuerto',
      fallbackTerminals: 'Información de terminales disponible en el aeropuerto',
      fallbackFacilities: 'Varias instalaciones y salas de espera disponibles',
      fallbackFaqs: [
        {
          question: '¿Qué instalaciones están disponibles en este aeropuerto?',
          answer: 'El aeropuerto ofrece varias instalaciones incluyendo restaurantes, tiendas, salas de espera y otros servicios para pasajeros.'
        },
        {
          question: '¿Qué tan temprano debo llegar para mi vuelo?',
          answer: 'Recomendamos llegar al menos 2 horas antes de vuelos nacionales y 3 horas antes de vuelos internacionales.'
        },
        {
          question: '¿Por qué no está disponible alguna información?',
          answer: 'Algunos datos del aeropuerto pueden no estar disponibles debido a problemas de conectividad de la API. Por favor, contacte directamente al aeropuerto para la información más actualizada.'
        }
      ]
    },
    ru: {
      title: `Аэропорт ${airportName} (${airportCode}) - Информация об Аэропорте`,
      description: `Полное руководство по аэропорту ${airportName} (${airportCode}). Найдите информацию о терминалах, удобствах, авиакомпаниях и советы по путешествиям.`,
      airportInfoTitle: 'Информация об Аэропорте',
      airportDetailsTitle: 'Детали Аэропорта',
      iataCode: 'Код IATA:',
      icaoCode: 'Код ICAO:',
      airportName: 'Название Аэропорта:',
      phone: 'Телефон:',
      airlinesServing: 'Обслуживающие Авиакомпании:',
      terminals: 'Терминалы:',
      facilities: 'Удобства:',
      overview: 'Обзор',
      securityCheckin: 'Безопасность и Регистрация',
      faqTitle: 'Часто Задаваемые Вопросы',
      fallbackOverview: `Добро пожаловать в аэропорт ${airportName}. Этот аэропорт обслуживает пассажиров с различными удобствами и услугами. Обратите внимание, что подробная информация может быть недоступна из-за проблем с подключением к API.`,
      fallbackAirlines: 'Несколько авиакомпаний обслуживают этот аэропорт',
      fallbackTerminals: 'Информация о терминалах доступна в аэропорту',
      fallbackFacilities: 'Различные удобства и залы ожидания доступны',
      fallbackFaqs: [
        {
          question: 'Какие удобства доступны в этом аэропорту?',
          answer: 'Аэропорт предлагает различные удобства, включая рестораны, магазины, залы ожидания и другие услуги для пассажиров.'
        },
        {
          question: 'Как рано мне нужно прибыть на мой рейс?',
          answer: 'Мы рекомендуем прибывать как минимум за 2 часа до внутренних рейсов и за 3 часа до международных рейсов.'
        },
        {
          question: 'Почему некоторая информация недоступна?',
          answer: 'Некоторые данные аэропорта могут быть недоступны из-за проблем с подключением к API. Пожалуйста, обратитесь напрямую в аэропорт для получения самой актуальной информации.'
        }
      ]
    },
    fr: {
      title: `Aéroport ${airportName} (${airportCode}) - Informations sur l'Aéroport`,
      description: `Guide complet de l'Aéroport ${airportName} (${airportCode}). Trouvez des informations sur les terminaux, les installations, les compagnies aériennes et les conseils de voyage.`,
      airportInfoTitle: 'Informations sur l\'Aéroport',
      airportDetailsTitle: 'Détails de l\'Aéroport',
      iataCode: 'Code IATA:',
      icaoCode: 'Code ICAO:',
      airportName: 'Nom de l\'Aéroport:',
      phone: 'Téléphone:',
      airlinesServing: 'Compagnies Aériennes Desservant:',
      terminals: 'Terminaux:',
      facilities: 'Installations:',
      overview: 'Aperçu',
      securityCheckin: 'Sécurité et Enregistrement',
      faqTitle: 'Questions Fréquemment Posées',
      fallbackOverview: `Bienvenue à l'Aéroport ${airportName}. Cet aéroport dessert les passagers avec diverses installations et services. Veuillez noter que des informations détaillées peuvent ne pas être disponibles en raison de problèmes de connectivité API.`,
      fallbackAirlines: 'Plusieurs compagnies aériennes desservent cet aéroport',
      fallbackTerminals: 'Informations sur les terminaux disponibles à l\'aéroport',
      fallbackFacilities: 'Diverses installations et salons disponibles',
      fallbackFaqs: [
        {
          question: 'Quelles installations sont disponibles dans cet aéroport?',
          answer: 'L\'aéroport offre diverses installations incluant des restaurants, des boutiques, des salons et d\'autres services passagers.'
        },
        {
          question: 'À quelle heure dois-je arriver pour mon vol?',
          answer: 'Nous recommandons d\'arriver au moins 2 heures avant les vols domestiques et 3 heures avant les vols internationaux.'
        },
        {
          question: 'Pourquoi certaines informations ne sont-elles pas disponibles?',
          answer: 'Certaines données d\'aéroport peuvent ne pas être disponibles en raison de problèmes de connectivité API. Veuillez contacter directement l\'aéroport pour les informations les plus récentes.'
        }
      ]
    }
  };

  return content[locale] || content.en;
};

export default function AirportTemplate({ locale, pageData, params, onAction }: AirportTemplateProps) {
  const slug = params.slug || params.airportCode;
  
  // Fallback data when API is not available
  if (!pageData) {
    const airportName = slug.replace(/-/g, ' ').toUpperCase();
    const airportCode = slug.split('-')[0]?.toUpperCase() || 'N/A';
    
    const fallbackData = {
      title: `Airport Information - ${airportName}`,
      airport_name: airportName,
      airport_code: airportCode,
      overview: `<p>Welcome to ${airportName} Airport. This airport serves passengers with various facilities and services. Please note that detailed information may not be available due to API connectivity issues.</p>`,
      contact_info: {
        iata: airportCode,
        icao: 'N/A',
        phone: 'Contact airport directly for information'
      },
      airlines_serving: 'Multiple airlines serve this airport',
      terminals: 'Terminal information available at the airport',
      lounges_facilities: 'Various facilities and lounges available',
      faqs: [
        {
          question: 'What facilities are available at this airport?',
          answer: 'The airport offers various facilities including restaurants, shops, lounges, and other passenger services.'
        },
        {
          question: 'How early should I arrive for my flight?',
          answer: 'We recommend arriving at least 2 hours before domestic flights and 3 hours before international flights.'
        },
        {
          question: 'Why is some information not available?',
          answer: 'Some airport data may not be available due to API connectivity issues. Please contact the airport directly for the most current information.'
        }
      ]
    };
    pageData = fallbackData;
  }

  const airportName = pageData.airport_name || slug.replace(/-/g, ' ').toUpperCase();
  const airportCode = pageData.airport_code || pageData.contact_info?.iata || slug.split('-')[0]?.toUpperCase() || 'N/A';
  const content = getAirportContent(locale, airportName, airportCode);

  return (
    <Box>
      {/* Hero Section with Search Box */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          color: 'white',
          py: 6,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'left', mb: 4 }}>
            {/* Airport Image */}
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
                  backgroundImage: `url(${getAirportImageUrl(airportCode, 'large')})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '4px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  position: 'relative',
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
              />
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 700,
                    mb: 2,
                    textAlign: 'left'
                  }}
                  dangerouslySetInnerHTML={{ __html: pageData.title || content.title }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                    opacity: 0.9,
                    textAlign: 'left',
                    mx: 0
                  }}
                  dangerouslySetInnerHTML={{ __html: pageData.overview || pageData.meta_description || content.description }}
                />
              </Box>
            </Box>
          </Box>
          
          {/* Flight Search Box */}
          <FlightSearchBox />
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Airport Overview Card */}
        <Card sx={{ mb: 6, p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" sx={{ mb: 3, color: '#1e3a8a', fontWeight: 700 }}>
                {content.airportInfoTitle}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>{content.iataCode}</strong> {pageData.contact_info?.iata || pageData.airport_code || 'N/A'}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>{content.icaoCode}</strong> {pageData.contact_info?.icao || 'N/A'}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>{content.airportName}</strong> {pageData.airport_name || 'N/A'}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>{content.phone}</strong> {pageData.contact_info?.phone || 'N/A'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" sx={{ mb: 3, color: '#1e3a8a', fontWeight: 700 }}>
                {content.airportDetailsTitle}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>{content.airlinesServing}</strong> {pageData.airlines_serving || content.fallbackAirlines}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>{content.terminals}</strong> {pageData.terminals || content.fallbackTerminals}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>{content.facilities}</strong> {pageData.lounges_facilities || content.fallbackFacilities}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* Content Sections */}
        {pageData.overview && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h3" sx={{ mb: 4, color: '#333', fontWeight: 700 }}>
              {content.overview}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ mb: 3, color: '#666', lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: pageData.overview }}
            />
          </Box>
        )}

        {/* Security and Check-in */}
        {pageData.security_checkin && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h3" sx={{ mb: 4, color: '#333', fontWeight: 700 }}>
              {content.securityCheckin}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ mb: 3, color: '#666', lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: pageData.security_checkin }}
            />
          </Box>
        )}

        {/* FAQ Section */}
        {pageData.faqs && pageData.faqs.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h3" sx={{ mb: 4, color: '#333', fontWeight: 700 }}>
              {content.faqTitle}
            </Typography>
            {pageData.faqs.map((faq: any, index: number) => (
              <Accordion key={index} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" color="text.secondary">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
