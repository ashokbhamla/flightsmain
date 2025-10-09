'use client';

import { Locale } from '@/lib/i18n';
import { Typography, Box, Container, Grid, Card, CardContent, Button } from '@mui/material';
import FlightSearchBox from '@/components/FlightSearchBox';
import ClientPriceGraph from '@/components/ClientPriceGraph';
import FlightTabs from '@/components/FlightTabs';
import { getAirportImageUrl } from '@/lib/cdn';
import { fetchCityByIata } from '@/lib/api';
import { memo, useState, useEffect } from 'react';
import SchemaOrg from '@/components/SchemaOrg';
import { generateDatasetSchema } from '@/lib/datasetSchemaGenerator';

interface FlightTemplateProps {
  locale: Locale;
  pageData: any;
  params: any;
  flightData?: any;
  departureCityName?: string;
  arrivalCityName?: string;
  departureIata?: string;
  arrivalIata?: string;
  onAction?: (searchData: any) => void;
}

// Language-specific content
const getFlightContent = (locale: Locale, departureCity: string, arrivalCity: string, departureIata: string, arrivalIata: string) => {
  const content = {
    en: {
      title: `Flights from ${departureCity} (${departureIata}) to ${arrivalCity} (${arrivalIata})`,
      description: `Plan your journey from ${departureCity} to ${arrivalCity} with the latest deals, travel tips, and flight information.`,
      cheapDealsTitle: `Cheap flight deals from ${departureCity} to ${arrivalCity}`,
      priceTrendsTitle: 'Price Trends & Analysis',
      weeklyTitle: 'Weekly Price Trends',
      weeklyDescription: `Track weekly price fluctuations for flights from ${departureCity} to ${arrivalCity}. Prices typically vary by day of the week, with mid-week flights often offering better deals.`,
      monthlyTitle: 'Monthly Price Trends',
      monthlyDescription: `Monitor monthly price patterns to identify the best time to book your flight from ${departureCity} to ${arrivalCity}. Seasonal variations and holiday periods significantly impact pricing.`,
      weatherTitle: 'Weather & Climate Information',
      weatherDescription: `Plan your visit to ${arrivalCity} with current temperature data. ${arrivalCity} experiences varied weather throughout the year, with temperatures ranging from mild to warm depending on the season.`,
      rainfallTitle: `Average Rainfall in ${arrivalCity}`,
      rainfallDescription: `Stay prepared for your trip to ${arrivalCity} with rainfall information. Understanding precipitation patterns helps you pack appropriately and plan outdoor activities during your visit.`,
      placesTitle: `Places to Visit in ${arrivalCity}`,
      hotelsTitle: `Hotels in ${arrivalCity}`,
      aboutTitle: `About ${arrivalCity}`,
      airlinesTitle: `Airlines Flying from ${departureCity} to ${arrivalCity}`,
      faqTitle: 'Frequently Asked Questions'
    },
    es: {
      title: `Vuelos de ${departureCity} (${departureIata}) a ${arrivalCity} (${arrivalIata})`,
      description: `Planifica tu viaje de ${departureCity} a ${arrivalCity} con las mejores ofertas, consejos de viaje e información de vuelos.`,
      cheapDealsTitle: `Ofertas de vuelos baratos de ${departureCity} a ${arrivalCity}`,
      priceTrendsTitle: 'Tendencias y Análisis de Precios',
      weeklyTitle: 'Tendencias de Precios Semanales',
      weeklyDescription: `Rastrea las fluctuaciones de precios semanales para vuelos de ${departureCity} a ${arrivalCity}. Los precios suelen variar según el día de la semana, con vuelos de mediados de semana que a menudo ofrecen mejores ofertas.`,
      monthlyTitle: 'Tendencias de Precios Mensuales',
      monthlyDescription: `Monitorea los patrones de precios mensuales para identificar el mejor momento para reservar tu vuelo de ${departureCity} a ${arrivalCity}. Las variaciones estacionales y los períodos festivos impactan significativamente los precios.`,
      weatherTitle: 'Información del Clima y Tiempo',
      weatherDescription: `Planifica tu visita a ${arrivalCity} con datos de temperatura actuales. ${arrivalCity} experimenta clima variado durante todo el año, con temperaturas que van de suaves a cálidas dependiendo de la temporada.`,
      rainfallTitle: `Precipitación Promedio en ${arrivalCity}`,
      rainfallDescription: `Prepárate para tu viaje a ${arrivalCity} con información de precipitación. Entender los patrones de lluvia te ayuda a empacar apropiadamente y planificar actividades al aire libre durante tu visita.`,
      placesTitle: `Lugares para Visitar en ${arrivalCity}`,
      hotelsTitle: `Hoteles en ${arrivalCity}`,
      aboutTitle: `Acerca de ${arrivalCity}`,
      airlinesTitle: `Aerolíneas que Vuelan de ${departureCity} a ${arrivalCity}`,
      faqTitle: 'Preguntas Frecuentes'
    },
    ru: {
      title: `Авиабилеты из ${departureCity} (${departureIata}) в ${arrivalCity} (${arrivalIata})`,
      description: `Спланируйте свое путешествие из ${departureCity} в ${arrivalCity} с лучшими предложениями, советами по путешествиям и информацией о рейсах.`,
      cheapDealsTitle: `Дешевые авиабилеты из ${departureCity} в ${arrivalCity}`,
      priceTrendsTitle: 'Тенденции и Анализ Цен',
      weeklyTitle: 'Недельные Тенденции Цен',
      weeklyDescription: `Отслеживайте недельные колебания цен на рейсы из ${departureCity} в ${arrivalCity}. Цены обычно варьируются в зависимости от дня недели, при этом рейсы в середине недели часто предлагают лучшие предложения.`,
      monthlyTitle: 'Месячные Тенденции Цен',
      monthlyDescription: `Отслеживайте месячные ценовые паттерны, чтобы определить лучшее время для бронирования рейса из ${departureCity} в ${arrivalCity}. Сезонные колебания и праздничные периоды значительно влияют на ценообразование.`,
      weatherTitle: 'Информация о Погоде и Климате',
      weatherDescription: `Спланируйте свой визит в ${arrivalCity} с текущими данными о температуре. В ${arrivalCity} наблюдается разнообразная погода в течение года, с температурами от мягких до теплых в зависимости от сезона.`,
      rainfallTitle: `Среднее Количество Осадков в ${arrivalCity}`,
      rainfallDescription: `Подготовьтесь к поездке в ${arrivalCity} с информацией об осадках. Понимание осадочных паттернов поможет вам правильно упаковать вещи и спланировать мероприятия на свежем воздухе во время вашего визита.`,
      placesTitle: `Места для Посещения в ${arrivalCity}`,
      hotelsTitle: `Отели в ${arrivalCity}`,
      aboutTitle: `О ${arrivalCity}`,
      airlinesTitle: `Авиакомпании, Летающие из ${departureCity} в ${arrivalCity}`,
      faqTitle: 'Часто Задаваемые Вопросы'
    },
    fr: {
      title: `Vols de ${departureCity} (${departureIata}) vers ${arrivalCity} (${arrivalIata})`,
      description: `Planifiez votre voyage de ${departureCity} à ${arrivalCity} avec les meilleures offres, conseils de voyage et informations de vol.`,
      cheapDealsTitle: `Offres de vols pas chers de ${departureCity} à ${arrivalCity}`,
      priceTrendsTitle: 'Tendances et Analyse des Prix',
      weeklyTitle: 'Tendances des Prix Hebdomadaires',
      weeklyDescription: `Suivez les fluctuations de prix hebdomadaires pour les vols de ${departureCity} à ${arrivalCity}. Les prix varient généralement selon le jour de la semaine, avec les vols en milieu de semaine offrant souvent de meilleures offres.`,
      monthlyTitle: 'Tendances des Prix Mensuels',
      monthlyDescription: `Surveillez les modèles de prix mensuels pour identifier le meilleur moment pour réserver votre vol de ${departureCity} à ${arrivalCity}. Les variations saisonnières et les périodes de vacances impactent significativement les prix.`,
      weatherTitle: 'Informations Météo et Climat',
      weatherDescription: `Planifiez votre visite à ${arrivalCity} avec les données de température actuelles. ${arrivalCity} connaît un temps varié tout au long de l'année, avec des températures allant de douces à chaudes selon la saison.`,
      rainfallTitle: `Précipitations Moyennes à ${arrivalCity}`,
      rainfallDescription: `Préparez-vous pour votre voyage à ${arrivalCity} avec les informations de précipitations. Comprendre les modèles de précipitations vous aide à faire vos bagages appropriément et planifier des activités en plein air pendant votre visite.`,
      placesTitle: `Lieux à Visiter à ${arrivalCity}`,
      hotelsTitle: `Hôtels à ${arrivalCity}`,
      aboutTitle: `À Propos de ${arrivalCity}`,
      airlinesTitle: `Compagnies Aériennes Volant de ${departureCity} à ${arrivalCity}`,
      faqTitle: 'Questions Fréquemment Posées'
    }
  };

  return content[locale] || content.en;
};

const FlightTemplate = memo(function FlightTemplate({ 
  locale, 
  pageData, 
  params, 
  flightData, 
  departureCityName,
  arrivalCityName,
  departureIata,
  arrivalIata,
  onAction 
}: FlightTemplateProps) {

  // Use passed props or fallback to params
  const finalDepartureIata = departureIata || params.departureIata || params.slug;
  const finalArrivalIata = arrivalIata || params.arrivalIata || '';
  const finalDepartureCityName = departureCityName || finalDepartureIata;
  const finalArrivalCityName = arrivalCityName || finalArrivalIata;

  // Get flight data from API
  const actualFlightData = flightData || pageData || {};

  // Get city names from pageData, flightData API, or fallback to IATA lookup
  const departureCity = pageData?.departureCity || actualFlightData?.departure_city || finalDepartureCityName;
  const arrivalCity = pageData?.arrivalCity || actualFlightData?.arrival_city || finalArrivalCityName;

  // Helper function to safely render content (handles both strings and objects)
  const renderContent = (content: any): string => {
    if (typeof content === 'string') {
      return content;
    }
    if (content && typeof content === 'object') {
      return content.content || content.text || content.description || content.html || JSON.stringify(content);
    }
    return '';
  };

  // Helper function to replace IATA codes with city names in text
  const replaceIataWithCityName = (text: any): string => {
    if (!text || typeof text !== 'string') return '';
    // Replace both departure and arrival IATA codes with city names
    let result = text.replace(new RegExp(finalDepartureIata, 'g'), departureCity);
    if (arrivalIata) {
      result = result.replace(new RegExp(arrivalIata, 'g'), arrivalCity);
    }
    return result;
  };

  // Fetch city-specific data for best_time_to_visit and weather
  const [cityData, setCityData] = useState<any>(null);
  
  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const data = await fetchCityByIata(finalDepartureIata, 1, 1);
        setCityData(data);
      } catch (error) {
        console.error('Error fetching city data:', error);
      }
    };
    
    if (finalDepartureIata) {
      fetchCityData();
    }
  }, [finalDepartureIata]);

  
  const content = getFlightContent(locale, departureCity, arrivalCity, finalDepartureIata, finalArrivalIata);
  
  // Debug: Log the data being used
  console.log('FlightTemplate Data:', { 
    pageData, 
    flightData, 
    actualFlightData,
    departureCity, 
    arrivalCity,
    finalDepartureCityName,
    finalArrivalCityName
  });
  
  

  // Calculate cheapest month from months array
  const getCheapestMonth = () => {
    if (flightData?.months && Array.isArray(flightData.months) && flightData.months.length > 0) {
      const cheapest = flightData.months.reduce((min: any, month: any) => 
        (month.price || month.value) < (min.price || min.value) ? month : min
      );
      return {
        name: cheapest.month || cheapest.name || 'January',
        price: cheapest.price || cheapest.value || 0
      };
    }
    return { name: 'January', price: 0 };
  };

  const cheapestMonthData = getCheapestMonth();

  // Price cards data from API - Updated to use real API data with descriptions
  const priceCards = [
    {
      id: 1,
      type: 'average',
      price: flightData?.round_trip_start ? `$${flightData.round_trip_start}` : null,
      title: locale === 'es' ? 'Precio promedio desde:' : 
             locale === 'ru' ? 'Средняя цена от:' :
             locale === 'fr' ? 'Prix moyen à partir de:' : 'Average price start from:',
      description: flightData?.round_trip_start 
        ? `Round-trip flights from ${departureCity} to ${arrivalCity} starting at $${flightData.round_trip_start}. Book now for the best deals!`
        : (pageData?.roundtrip || `Round trip from ${departureCity} to ${arrivalCity}`),
      buttonText: locale === 'es' ? 'Buscar Ofertas' : 
                  locale === 'ru' ? 'Поиск Предложений' :
                  locale === 'fr' ? 'Rechercher des Offres' : 'Search Deals',
      buttonColor: '#10b981'
    },
    {
      id: 2,
      type: 'oneway',
      price: flightData?.oneway_trip_start ? `$${flightData.oneway_trip_start}` : null,
      title: locale === 'es' ? 'Solo ida desde:' : 
             locale === 'ru' ? 'В одну сторону от:' :
             locale === 'fr' ? 'Aller simple depuis:' : 'One-way from:',
      description: flightData?.oneway_trip_start
        ? `One-way flights from ${departureCity} to ${arrivalCity} starting at $${flightData.oneway_trip_start}. Great for flexible travel!`
        : (pageData?.oneway || `One-way from ${departureCity} to ${arrivalCity}`),
      buttonText: locale === 'es' ? 'Buscar Ofertas' : 
                  locale === 'ru' ? 'Поиск Предложений' :
                  locale === 'fr' ? 'Rechercher des Offres' : 'Search Deals',
      buttonColor: '#1e3a8a'
    },
    {
      id: 3,
      type: 'cheapest-day',
      day: flightData?.cheapest_day || (locale === 'es' ? 'Miércoles' :
             locale === 'ru' ? 'Среда' :
             locale === 'fr' ? 'Mercredi' : 'Wednesday'),
      title: locale === 'es' ? 'Día más barato:' : 
             locale === 'ru' ? 'Самый дешевый день:' :
             locale === 'fr' ? 'Jour le moins cher:' : 'Cheapest day:',
      description: flightData?.cheapest_day
        ? `${flightData.cheapest_day} is the cheapest day to fly from ${departureCity} to ${arrivalCity}. Save more by booking on this day!`
        : (pageData?.cheapest || `Find the best day to fly from ${departureCity} to ${arrivalCity}`),
      buttonText: locale === 'es' ? 'Encontrar Ofertas' : 
                  locale === 'ru' ? 'Найти Предложения' :
                  locale === 'fr' ? 'Trouver des Offres' : 'Find Deals',
      buttonColor: '#f59e0b'
    },
    {
      id: 4,
      type: 'cheapest-month',
      month: cheapestMonthData.name,
      price: cheapestMonthData.price ? `$${cheapestMonthData.price}` : null,
      title: locale === 'es' ? 'Más barato en:' : 
             locale === 'ru' ? 'Дешевле в:' :
             locale === 'fr' ? 'Moins cher en:' : 'Cheapest In:',
      description: cheapestMonthData.price
        ? `${cheapestMonthData.name} is the cheapest month to fly from ${departureCity} to ${arrivalCity} with prices starting at $${cheapestMonthData.price}.`
        : `Find the best month to travel from ${departureCity} to ${arrivalCity}`,
      buttonText: locale === 'es' ? 'Encontrar Ofertas' : 
                  locale === 'ru' ? 'Найти Предложения' :
                  locale === 'fr' ? 'Trouver des Offres' : 'Find Deals',
      buttonColor: '#ef4444'
    }
  ];

  // Transform API flight data to the expected format
  const transformApiFlightData = (apiData: any[]) => {
    if (!Array.isArray(apiData)) return [];
    
    return apiData.map((flight, index) => ({
      id: index + 1,
      iata_from: flight.iata_from,
      iata_to: flight.iata_to,
      departure_time: '09:00', // Default time since not in API
      arrival_time: '10:00', // Default time since not in API
      stops: 0, // Default non-stop
      date: new Date().toISOString().split('T')[0], // Today's date
      iso_date: new Date().toISOString(),
      duration: `${flight.common_duration || 60} min`,
      price: parseInt(flight.price) || 0,
      currency: 'USD',
      localized_price: `$${flight.price}`,
      airline: flight.airlineroutes?.[0]?.carrier_name || 'Unknown',
      airline_iata: flight.airlineroutes?.[0]?.carrier || 'XX',
      city_name_en: flight.city_name_en || flight.airport?.city_name || 'Unknown City',
      // Add normalized flight properties for FlightRouteCard
      from: flight.iata_from,
      to: flight.iata_to,
      city: flight.airport?.city_name || flight.city_name_en || 'Unknown City',
      country: flight.airport?.country || 'Unknown Country',
      country_code: flight.airport?.country_code || 'XX',
      // Add city names for display
      departure_city_name: departureCity, // Use the already fetched city name
      arrival_city_name: flight.city_name_en || flight.airport?.city_name || 'Unknown City'
    }));
  };

  // Get flight data from API and transform it
  // Handle both single airport (array) and route pair (object with flight categories) data
  let apiFlightData: any[] = [];
  let transformedFlights: any[] = [];
  
  if (Array.isArray(flightData)) {
    // Single airport data - array of flights
    apiFlightData = flightData;
    transformedFlights = transformApiFlightData(apiFlightData);
  } else if (flightData && typeof flightData === 'object') {
    // Route pair data - object with flight categories
    if (flightData.oneway_flights && Array.isArray(flightData.oneway_flights)) {
      transformedFlights = transformApiFlightData(flightData.oneway_flights);
    }
  }
  
  // Debug: Log the flight data
  console.log('FlightTemplate Flight Data Debug:', {
    flightData,
    apiFlightData,
    transformedFlights,
    hasFlights: transformedFlights.length > 0,
    isRouteData: !Array.isArray(flightData) && flightData && typeof flightData === 'object'
  });

  // Flight tabs data - Updated to use API data with proper translations
  const flightTabs = [
    {
      id: 'oneway_flights',
      label: locale === 'es' ? 'Vuelos de Ida' : 
             locale === 'ru' ? 'Рейсы в одну сторону' :
             locale === 'fr' ? 'Vols Aller Simple' : 'One-way Flights',
      flights: transformedFlights,
      description: pageData?.cheapest_flights || (locale === 'es' ? 'Vuelos baratos desde' : 
                   locale === 'ru' ? 'Дешевые рейсы из' :
                   locale === 'fr' ? 'Vols pas chers depuis' : 'Cheap flights from')
    },
    {
      id: 'last_minute_flights',
      label: locale === 'es' ? 'Vuelos de Último Minuto' : 
             locale === 'ru' ? 'Рейсы в последнюю минуту' :
             locale === 'fr' ? 'Vols de Dernière Minute' : 'Last Minute Flights',
      flights: transformedFlights,
      description: locale === 'es' ? 'Vuelos de último minuto' : 
                   locale === 'ru' ? 'Рейсы в последнюю минуту' :
                   locale === 'fr' ? 'Vols de dernière minute' : 'Last minute flights'
    },
    {
      id: 'cheap_flights',
      label: locale === 'es' ? 'Vuelos Baratos' : 
             locale === 'ru' ? 'Дешевые рейсы' :
             locale === 'fr' ? 'Vols Pas Chers' : 'Cheap Flights',
      flights: transformedFlights,
      description: locale === 'es' ? 'Los vuelos más baratos' : 
                   locale === 'ru' ? 'Самые дешевые рейсы' :
                   locale === 'fr' ? 'Les vols les moins chers' : 'The cheapest flights'
    },
    {
      id: 'best_flights',
      label: locale === 'es' ? 'Mejores Vuelos' : 
             locale === 'ru' ? 'Лучшие рейсы' :
             locale === 'fr' ? 'Meilleurs Vols' : 'Best Flights',
      flights: transformedFlights,
      description: locale === 'es' ? 'Los mejores vuelos' : 
                   locale === 'ru' ? 'Лучшие рейсы' :
                   locale === 'fr' ? 'Les meilleurs vols' : 'The best flights'
    }
  ];

  // Use API data for graphs from Real API (flightData)
  // Weekly prices from Real API (weeks array - 7 days)
  const weeklyPriceData = flightData?.weeks && Array.isArray(flightData.weeks) && flightData.weeks.length > 0
    ? flightData.weeks.map((item: any) => ({
        name: item.day || item.name || '',
        value: item.price || item.value || 0
      }))
    : (pageData?.weekly_fares_graph?.data?.map((day: any) => ({
        name: day.day || day.name,
        value: day.avg_fare || day.value
      })) || []);

  // Monthly prices from Real API (months array - 12 months)
  const monthlyPriceData = flightData?.months && Array.isArray(flightData.months)
    ? flightData.months.map((item: any) => ({
        name: item.month || item.name || '',
        value: item.price || item.value || 0
      }))
    : (pageData?.monthly_fares_graph?.data?.map((month: any) => ({
        name: month.month || month.name,
        value: month.avg_fare || month.value
      })) || []);


  // Temperature data from Real API (temperature array - 12 months)
  const weatherData = flightData?.temperature && Array.isArray(flightData.temperature)
    ? flightData.temperature.map((item: any) => ({
        name: item.month || item.name || '',
        value: Number(item.temperature || item.temp || item.value || 0)
      }))
    : (Array.isArray(pageData?.temperature) && pageData.temperature.length > 0 
        ? pageData.temperature.map((item: any, index: number) => ({
            name: item.name || item.month || item.label || `Month ${index + 1}`,
            value: Number(item.value || item.temp || item.temperature || 0)
          }))
        : []);

  // Rainfall data from Real API (rainfall array - 12 months)
  const rainfallDataTransformed = flightData?.rainfall && Array.isArray(flightData.rainfall)
    ? flightData.rainfall.map((item: any) => ({
        name: item.month || item.name || '',
        value: Number(item.rainfall || item.precipitation || item.value || 0)
      }))
    : (Array.isArray(pageData?.rainfall) && pageData.rainfall.length > 0 
        ? pageData.rainfall.map((item: any, index: number) => ({
            name: item.name || item.month || item.label || `Month ${index + 1}`,
            value: Number(item.value || item.rainfall || item.precipitation || 0)
          }))
        : []);

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      <Container 
        sx={{ 
          py: { xs: 3, sm: 4, md: 6 },
          px: { xs: 2, sm: 4, md: 6 },
          width: '100%',
          maxWidth: '100%'
        }}
      >
        {/* Main Title */}
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            fontWeight: 700,
            textAlign: 'left',
            mb: 2,
            color: '#1a1a1a'
          }}
        >
          {pageData?.title || content.title}
        </Typography>

        {/* Subtitle */}
        <Typography 
          variant="h6" 
          sx={{ 
            fontSize: '1.1rem',
            color: '#666',
            mb: 4,
            lineHeight: 1.6
          }}
          dangerouslySetInnerHTML={{ __html: pageData?.description || content.description || '' }}
        />

        {/* Airport Images Hero Section */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: 3, 
          mb: 6,
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          {/* Departure Airport */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <Box
              sx={{
                width: { xs: 80, sm: 100, md: 120 },
                height: { xs: 80, sm: 100, md: 120 },
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundImage: `url(${getAirportImageUrl(finalDepartureIata, 'medium')})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '3px solid #10b981',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
                mb: 2,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  zIndex: 1,
                }
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 0.5 }}>
              {departureCity}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {finalDepartureIata}
            </Typography>
          </Box>

          {/* Arrow */}
          <Box sx={{ 
            display: { xs: 'none', sm: 'block' },
            '&::before': {
              content: '""',
              display: 'block',
              width: 40,
              height: 2,
              backgroundColor: '#10b981',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                right: -6,
                top: -4,
                width: 0,
                height: 0,
                borderLeft: '8px solid #10b981',
                borderTop: '5px solid transparent',
                borderBottom: '5px solid transparent',
              }
            }
          }}>
            <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 700 }}>
              →
            </Typography>
          </Box>

          {/* Arrival Airport */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <Box
              sx={{
                width: { xs: 80, sm: 100, md: 120 },
                height: { xs: 80, sm: 100, md: 120 },
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundImage: `url(${getAirportImageUrl(finalArrivalIata, 'medium')})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '3px solid #3b82f6',
                boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
                mb: 2,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  zIndex: 1,
                }
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 0.5 }}>
              {arrivalCity}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {finalArrivalIata}
            </Typography>
          </Box>
        </Box>

        {/* Flight Search Box */}
        <Box sx={{ mb: 6 }}>
          <FlightSearchBox 
            locale={locale}
            defaultFrom={{ 
              code: finalDepartureIata, 
              name: `${finalDepartureIata} - ${departureCity}`, 
              city_name: departureCity,
              country_name: '',
              country_code: '',
              type: 'airport' as const
            }}
            defaultTo={{ 
              code: finalArrivalIata, 
              name: `${finalArrivalIata} - ${arrivalCity}`, 
              city_name: arrivalCity,
              country_name: '',
              country_code: '',
              type: 'airport' as const
            }}
          />
        </Box>

        {/* Cheap Flight Deals */}
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
            {content.cheapDealsTitle}
          </Typography>
          
          <Grid container spacing={3}>
            {priceCards.map((deal) => (
              <Grid item xs={12} sm={6} md={3} key={deal.id}>
                <Card sx={{ 
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #f0f0f0',
                  height: '100%',
                  '&:hover': { 
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                  }
                }}>
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mr: 1 }}>
                        {deal.title}
                      </Typography>
                      <Box sx={{ 
                        width: 16, 
                        height: 16, 
                        borderRadius: '50%', 
                        backgroundColor: '#e0e0e0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        color: '#666'
                      }}>
                        i
                      </Box>
                    </Box>
                    
                    {deal.price && (
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          fontWeight: 700, 
                          color: deal.buttonColor,
                          fontSize: '2rem',
                          mb: 1
                        }}
                      >
                        {deal.price}
                      </Typography>
                    )}
                    
                    {deal.day && (
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          fontWeight: 700, 
                          color: deal.buttonColor,
                          fontSize: '1.5rem',
                          mb: 1
                        }}
                      >
                        {deal.day}
                      </Typography>
                    )}
                    
                    {deal.month && (
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          fontWeight: 700, 
                          color: deal.buttonColor,
                          fontSize: '1.5rem',
                          mb: 1
                        }}
                      >
                        {deal.month}
                      </Typography>
                    )}
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#666',
                        mb: 3,
                        flex: 1,
                        lineHeight: 1.5
                      }}
                    >
                      {deal.description}
                    </Typography>
                    
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: deal.buttonColor,
                        color: 'white',
                        borderRadius: '4px',
                        py: 1.5,
                        fontWeight: 600,
                        '&:hover': { 
                          backgroundColor: deal.buttonColor,
                          opacity: 0.9
                        }
                      }}
                    >
                      {deal.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Flight Deals Section with Tabs */}
        {transformedFlights.length > 0 && (
          <FlightTabs 
            flightData={{
              oneway_flights: transformedFlights,
              last_minute_flights: transformedFlights,
              cheap_flights: transformedFlights,
              best_flights: transformedFlights
            }}
            departureCity={departureCity}
            arrivalCity={arrivalCity}
            departureIata={departureIata || ''}
            arrivalIata={arrivalIata || ''}
            tabDescriptions={pageData?.tab_descriptions}
            locale={locale}
          />
        )}

        {/* Price Trends & Analysis */}
        {(weeklyPriceData.length > 0 || monthlyPriceData.length > 0) && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 4,
                color: '#1a1a1a'
              }}
            >
              {content.priceTrendsTitle}
            </Typography>
            
            <Grid container spacing={3}>
              {weeklyPriceData.length > 0 && (
                <Grid item xs={12} md={6}>
                  <ClientPriceGraph
                    title={pageData?.cheapest_day ? 
                      (locale === 'es' ? `Precio más barato el ${pageData.cheapest_day}` :
                       locale === 'ru' ? `Самая дешевая цена в ${pageData.cheapest_day}` :
                       locale === 'fr' ? `Prix le moins cher le ${pageData.cheapest_day}` :
                       `Cheapest price on ${pageData.cheapest_day}`) : 
                      content.weeklyTitle}
                    description={replaceIataWithCityName(pageData?.weekly || content.weeklyDescription)}
                    data={weeklyPriceData}
                    yAxisLabel={locale === 'es' ? 'Precio (USD)' : 
                                locale === 'ru' ? 'Цена (USD)' :
                                locale === 'fr' ? 'Prix (USD)' : 'Price (USD)'}
                    showPrices={true}
                    height={300}
                  />
                </Grid>
              )}
              {monthlyPriceData.length > 0 && (
                <Grid item xs={12} md={6}>
                  <ClientPriceGraph
                    title={pageData?.cheapest_month ? 
                      (locale === 'es' ? `Precio más barato en ${pageData.cheapest_month}` :
                       locale === 'ru' ? `Самая дешевая цена в ${pageData.cheapest_month}` :
                       locale === 'fr' ? `Prix le moins cher en ${pageData.cheapest_month}` :
                       `Cheapest price in ${pageData.cheapest_month}`) : 
                      content.monthlyTitle}
                    description={replaceIataWithCityName(pageData?.monthly || content.monthlyDescription)}
                    data={monthlyPriceData}
                    yAxisLabel={locale === 'es' ? 'Precio (USD)' : 
                                locale === 'ru' ? 'Цена (USD)' :
                                locale === 'fr' ? 'Prix (USD)' : 'Price (USD)'}
                    showPrices={true}
                    height={300}
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* Weather & Climate */}
        {(weatherData.length > 0 || rainfallDataTransformed.length > 0) && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 4,
                color: '#1a1a1a'
              }}
            >
              {content.weatherTitle}
            </Typography>
            
            <Grid container spacing={3}>
              {weatherData.length > 0 && (
                <Grid item xs={12} md={6}>
                  <ClientPriceGraph
                      title={locale === 'es' ? 'Temperatura' : 
                             locale === 'ru' ? 'Температура' :
                             locale === 'fr' ? 'Température' : 'Temperature'}
                      description={replaceIataWithCityName(pageData?.temperature || content.weatherDescription)}
                    data={weatherData}
                    yAxisLabel={locale === 'es' ? 'Temperatura (°F)' : 
                                locale === 'ru' ? 'Температура (°F)' :
                                locale === 'fr' ? 'Température (°F)' : 'Temperature (°F)'}
                    showPrices={false}
                    height={300}
                  />
                </Grid>
              )}
              {rainfallDataTransformed.length > 0 && (
                <Grid item xs={12} md={6}>
                  <ClientPriceGraph
                    title={locale === 'es' ? 'Precipitación' : 
                           locale === 'ru' ? 'Осадки' :
                           locale === 'fr' ? 'Précipitations' : 'Rainfall'}
                    description={replaceIataWithCityName(pageData?.rainfall || content.rainfallDescription)}
                    data={rainfallDataTransformed}
                    yAxisLabel={locale === 'es' ? 'Precipitación (pulgadas)' : 
                                locale === 'ru' ? 'Осадки (дюймы)' :
                                locale === 'fr' ? 'Précipitations (pouces)' : 'Rainfall (inches)'}
                    showPrices={false}
                    height={300}
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* Popular Destinations */}
        {pageData?.destinations && (
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
              {locale === 'es' ? 'Destinos Populares' : 
               locale === 'ru' ? 'Популярные направления' :
               locale === 'fr' ? 'Destinations Populaires' : 'Popular Destinations'}
            </Typography>
            
            <div 
              dangerouslySetInnerHTML={{ __html: renderContent(pageData.destinations) }} 
              style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>
        )}

        {/* Destinations Links */}
        {pageData?.destinations_links && (
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
              {locale === 'es' ? 'Enlaces de Destinos' : 
               locale === 'ru' ? 'Ссылки на направления' :
               locale === 'fr' ? 'Liens de Destinations' : 'Destination Links'}
            </Typography>
            
            <div 
              dangerouslySetInnerHTML={{ __html: renderContent(pageData.destinations_links) }} 
              style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>
        )}

        {/* Places to Visit */}
        {pageData?.places_to_visit && (
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
              {locale === 'es' ? `Lugares para Visitar en ${finalArrivalCityName}` : 
               locale === 'ru' ? `Места для посещения в ${finalArrivalCityName}` :
               locale === 'fr' ? `Lieux à Visiter à ${finalArrivalCityName}` : `Places to Visit in ${finalArrivalCityName}`}
            </Typography>
            
            <div 
              dangerouslySetInnerHTML={{ __html: renderContent(pageData.places_to_visit) }} 
              style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>
        )}

        {/* Airlines at City */}
        {pageData?.airlines && (
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
              {locale === 'es' ? `Aerolíneas en ${finalArrivalCityName}` : 
               locale === 'ru' ? `Авиакомпании в ${finalArrivalCityName}` :
               locale === 'fr' ? `Compagnies Aériennes à ${finalArrivalCityName}` : `Airlines at ${finalArrivalCityName}`}
            </Typography>
            
            <div 
              dangerouslySetInnerHTML={{ __html: renderContent(pageData.airlines) }} 
              style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>
        )}

        {/* Best Time to Visit */}
        {(pageData?.best_time_visit || cityData?.best_time_to_visit) && (
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
              {locale === 'es' ? `Mejor Época para Visitar ${finalArrivalCityName}` : 
               locale === 'ru' ? `Лучшее время для посещения ${finalArrivalCityName}` :
               locale === 'fr' ? `Meilleure Période pour Visiter ${finalArrivalCityName}` : `Best Time to Visit ${finalArrivalCityName}`}
            </Typography>
            
            <div 
              dangerouslySetInnerHTML={{ 
                __html: renderContent(pageData.best_time_visit || cityData?.best_time_to_visit) 
              }} 
              style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>
        )}

        {/* Places to Visit - Legacy support */}
        {pageData?.places && (
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
              {content.placesTitle}
            </Typography>
            
            <div 
              dangerouslySetInnerHTML={{ __html: renderContent(pageData.places) }} 
              style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
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
              {content.aboutTitle}
            </Typography>
            
            <div 
              dangerouslySetInnerHTML={{ __html: renderContent(pageData.city) }} 
              style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>
        )}

        {/* Airlines Section */}
        {pageData?.airlines && (
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
              {content.airlinesTitle}
            </Typography>
            
            <div 
              dangerouslySetInnerHTML={{ __html: renderContent(pageData.airlines) }} 
              style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>
        )}

        {/* Hotels Section */}
        {pageData?.hotels && (
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
              {content.hotelsTitle}
            </Typography>
            
            <div 
              dangerouslySetInnerHTML={{ __html: renderContent(pageData.hotels) }} 
              style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>
        )}

        {/* Stats Section */}
        {pageData?.stats && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 4,
                color: '#1a1a1a'
              }}
            >
              {locale === 'es' ? 'Estadísticas del Aeropuerto' : 
               locale === 'ru' ? 'Статистика Аэропорта' :
               locale === 'fr' ? 'Statistiques de l\'Aéroport' : 'Airport Statistics'}
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
              dangerouslySetInnerHTML={{ __html: pageData.stats }}
            />
          </Box>
        )}

        {/* City Information Section */}
        {pageData?.city && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 4,
                color: '#1a1a1a'
              }}
            >
              {locale === 'es' ? `Acerca de ${arrivalCity}` : 
               locale === 'ru' ? `О ${arrivalCity}` :
               locale === 'fr' ? `À propos de ${arrivalCity}` : `About ${arrivalCity}`}
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
              dangerouslySetInnerHTML={{ __html: pageData.city }}
            />
          </Box>
        )}

        {/* Places to Visit Section */}
        {pageData?.places && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 4,
                color: '#1a1a1a'
              }}
            >
              {locale === 'es' ? `Lugares para Visitar en ${arrivalCity}` : 
               locale === 'ru' ? `Места для посещения в ${arrivalCity}` :
               locale === 'fr' ? `Lieux à Visiter à ${arrivalCity}` : `Places to Visit in ${arrivalCity}`}
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
              dangerouslySetInnerHTML={{ __html: pageData.places }}
            />
          </Box>
        )}

        {/* Hotels Section */}
        {pageData?.hotels && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 4,
                color: '#1a1a1a'
              }}
            >
              {locale === 'es' ? `Hoteles en ${arrivalCity}` : 
               locale === 'ru' ? `Отели в ${arrivalCity}` :
               locale === 'fr' ? `Hôtels à ${arrivalCity}` : `Hotels in ${arrivalCity}`}
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
              dangerouslySetInnerHTML={{ __html: pageData.hotels }}
            />
          </Box>
        )}

        {/* Airlines Section */}
        {pageData?.airlines && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 4,
                color: '#1a1a1a'
              }}
            >
              {locale === 'es' ? `Aerolíneas que Vuelan de ${departureCity} a ${arrivalCity}` : 
               locale === 'ru' ? `Авиакомпании, летающие из ${departureCity} в ${arrivalCity}` :
               locale === 'fr' ? `Compagnies Aériennes Volant de ${departureCity} à ${arrivalCity}` : `Airlines Flying from ${departureCity} to ${arrivalCity}`}
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
              dangerouslySetInnerHTML={{ __html: pageData.airlines }}
            />
          </Box>
        )}

        {/* Frequently Asked Questions */}
        {(() => {
          // Check if we have FAQs from API
          const apiFaqs = pageData?.faqs || [];
          const validFaqs = apiFaqs.filter((faq: any) => {
            // Filter out malformed FAQ entries (HTML tags as questions)
            const question = faq.q || faq.question || '';
            const answer = faq.a || faq.answer || '';
            
            // Skip if question is empty or contains HTML structure markers
            if (!question || 
                question.trim() === '' || 
                question.includes('DOCTYPE') ||
                question.includes('```html') ||
                question.includes('frequently asked questions') ||
                question.includes('formatted in HTML') ||
                question.includes('<!DOCTYPE') ||
                question.includes('<html') ||
                question.includes('<head') ||
                question.includes('<body') ||
                question.includes('<title') ||
                question.includes('<meta') ||
                question.includes('</head') ||
                question.includes('</body') ||
                question.includes('</html') ||
                question.includes('<h1>') ||
                question.includes('<h2>') ||
                question.includes('<h3>') ||
                question.includes('<h4>') ||
                question.includes('<h5>') ||
                question.includes('<h6>')) {
              return false;
            }
            
            // Skip if answer is empty or contains HTML structure markers
            if (!answer || 
                answer.trim() === '' || 
                answer.includes('DOCTYPE') ||
                answer.includes('```html') ||
                answer.includes('<!DOCTYPE') ||
                answer.includes('<html') ||
                answer.includes('<head') ||
                answer.includes('<body') ||
                answer.includes('<title') ||
                answer.includes('<meta') ||
                answer.includes('</head') ||
                answer.includes('</body') ||
                answer.includes('</html') ||
                answer.includes('<h1>') ||
                answer.includes('<h2>') ||
                answer.includes('<h3>') ||
                answer.includes('<h4>') ||
                answer.includes('<h5>') ||
                answer.includes('<h6>')) {
              return false;
            }
            
            return true;
          });

          // If no valid FAQs from API, use fallback FAQs
          const faqsToShow = validFaqs.length > 0 ? validFaqs : [
            {
              q: `What airlines fly from ${departureCity} Airport?`,
              a: `Several airlines operate flights from ${departureCity} Airport, including major international carriers and regional airlines. You can find flights to various destinations across different continents.`
            },
            {
              q: `How early should I arrive at ${departureCity} Airport?`,
              a: `We recommend arriving at least 2-3 hours before your international flight and 1-2 hours before domestic flights to allow time for check-in, security screening, and boarding.`
            },
            {
              q: `What facilities are available at ${departureCity} Airport?`,
              a: `${departureCity} Airport offers various amenities including duty-free shopping, restaurants, lounges, free Wi-Fi, and car rental services to make your travel experience comfortable.`
            },
            {
              q: `Can I find direct flights from ${departureCity}?`,
              a: `Yes, ${departureCity} Airport offers direct flights to many destinations. Check our flight search tool to find direct routes to your preferred destination.`
            },
            {
              q: `What is the best time to book flights from ${departureCity}?`,
              a: `Generally, booking flights 2-3 months in advance can help you find better deals. Mid-week flights (Tuesday-Thursday) often offer lower prices compared to weekend travel.`
            }
          ];

          // Only show FAQ section if there are FAQs to display
          if (faqsToShow.length === 0) return null;

          return (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 4,
                color: '#1a1a1a'
              }}
            >
              {content.faqTitle}
            </Typography>
            
              {faqsToShow.map((faq: any, index: number) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    mb: 1,
                    color: '#1a1a1a'
                  }}
                  dangerouslySetInnerHTML={{ __html: faq.q || faq.question || '' }}
                />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#666',
                    lineHeight: 1.6
                  }}
                  dangerouslySetInnerHTML={{ __html: faq.a || faq.answer || '' }}
                />
              </Box>
            ))}
          </Box>
          );
        })()}

        {/* Content from API */}
        {pageData?.content && (
          <Box sx={{ mb: 6 }}>
            <div 
              dangerouslySetInnerHTML={{ __html: renderContent(pageData.content) }} 
              style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>
        )}
      </Container>

      {/* JSON-LD Schemas */}
      {(() => {
        const currentYear = new Date().getFullYear();
        const pageUrl = `${process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com'}/${locale === 'en' ? '' : locale + '/'}flights/${params.slug}`;
        
        // Prepare FAQ data for schema
        const faqData = pageData?.faqs || [];
        const validFaqs = faqData.filter((faq: any) => {
          const question = renderContent(faq.q || faq.question);
          const answer = renderContent(faq.a || faq.answer);
          
          // Skip if question or answer is empty or contains HTML structure markers
          if (!question || !answer || 
              question.trim() === '' || answer.trim() === '' ||
              question.includes('DOCTYPE') || answer.includes('DOCTYPE') ||
              question.includes('```html') || answer.includes('```html') ||
              question.includes('<!DOCTYPE') || answer.includes('<!DOCTYPE') ||
              question.includes('<html') || answer.includes('<html') ||
              question.includes('<head') || answer.includes('<head') ||
              question.includes('<body') || answer.includes('<body') ||
              question.includes('<title') || answer.includes('<title') ||
              question.includes('<meta') || answer.includes('<meta') ||
              question.includes('</head') || answer.includes('</head') ||
              question.includes('</body') || answer.includes('</body') ||
              question.includes('</html') || answer.includes('</html') ||
              question.includes('<h1>') || answer.includes('<h1>') ||
              question.includes('<h2>') || answer.includes('<h2>') ||
              question.includes('<h3>') || answer.includes('<h3>') ||
              question.includes('<h4>') || answer.includes('<h4>') ||
              question.includes('<h5>') || answer.includes('<h5>') ||
              question.includes('<h6>') || answer.includes('<h6>')) {
            return false;
          }
          return true;
        });

        // Fallback FAQs if no valid ones from API
        const faqsToShow = validFaqs.length > 0 ? validFaqs : [
          {
            q: `What airlines fly from ${departureCityName} Airport?`,
            a: `Several airlines operate flights from ${departureCityName} Airport, including major international carriers and regional airlines. You can find flights to various destinations across different continents.`
          },
          {
            q: `How early should I arrive at ${departureCityName} Airport?`,
            a: `We recommend arriving at least 2-3 hours before your international flight and 1-2 hours before domestic flights to allow time for check-in, security screening, and boarding.`
          },
          {
            q: `What facilities are available at ${departureCityName} Airport?`,
            a: `${departureCityName} Airport offers various amenities including duty-free shopping, restaurants, lounges, free Wi-Fi, and car rental services to make your travel experience comfortable.`
          },
          {
            q: `Can I find direct flights from ${departureCityName}?`,
            a: `Yes, ${departureCityName} Airport offers direct flights to many destinations. Check our flight search tool to find direct routes to your preferred destination.`
          },
          {
            q: `What is the best time to book flights from ${departureCityName}?`,
            a: `Generally, booking flights 2-3 months in advance can help you find better deals. Mid-week flights (Tuesday-Thursday) often offer lower prices compared to weekend travel.`
          }
        ];

        // Generate dataset schemas for graphs using dynamic data
        const datasetSchemas = generateDatasetSchema({
          locale,
          airlineName: 'Various Airlines',
          departureCity: departureCityName || 'Unknown',
          arrivalCity: arrivalCityName || 'Various Destinations',
          pageUrl,
          monthlyPriceData: monthlyPriceData || [],
          monthlyWeatherData: weatherData || [], // Use temperature data from Real API
          monthlyRainfallData: rainfallDataTransformed || [], // Use rainfall data from Real API
          weeklyPriceData: weeklyPriceData || []
        });

        return (
          <>
            {/* FAQ Schema - Dynamic from pageData.faqs */}
            {pageData?.faqs && pageData.faqs.length > 0 && (
              <SchemaOrg data={{
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": pageData.faqs.map((faq: any) => {
                  const question = renderContent(faq.q || faq.question);
                  const answer = renderContent(faq.a || faq.answer);
                  
                  // Remove HTML tags and clean up the text
                  const cleanQuestion = question.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
                  const cleanAnswer = answer.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
                  
                  return {
                    "@type": "Question",
                    "name": cleanQuestion,
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": cleanAnswer
                    }
                  };
                })
              }} />
            )}

            {/* Fallback FAQ Schema if no dynamic FAQs */}
            {(!pageData?.faqs || pageData.faqs.length === 0) && faqsToShow && faqsToShow.length > 0 && (
              <SchemaOrg data={{
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": faqsToShow.map((faq: any) => {
                  const question = renderContent(faq.q || faq.question);
                  const answer = renderContent(faq.a || faq.answer);
                  
                  // Remove HTML tags and clean up the text
                  const cleanQuestion = question.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
                  const cleanAnswer = answer.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
                  
                  return {
                    "@type": "Question",
                    "name": cleanQuestion,
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": cleanAnswer
                    }
                  };
                })
              }} />
            )}

            {/* Airport Schema for Single Airport Pages */}
            {!arrivalIata && (
              <SchemaOrg data={{
                "@context": "https://schema.org",
                "@type": "Airport",
                "name": pageData?.title || `${departureCityName} Airport`,
                "iataCode": departureIata,
                "description": pageData?.description || `Find flights from ${departureCityName} Airport (${departureIata}) to destinations worldwide. Compare prices and book your next trip.`,
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": departureCityName,
                  "addressCountry": "Various"
                },
                "amenityFeature": [
                  {
                    "@type": "LocationFeatureSpecification",
                    "name": "Flight Services",
                    "value": "Domestic and International Flights"
                  },
                  {
                    "@type": "LocationFeatureSpecification", 
                    "name": "Airlines",
                    "value": pageData?.airlines ? renderContent(pageData.airlines).replace(/<[^>]*>/g, '').substring(0, 100) : "Multiple Airlines"
                  }
                ],
                "hasOfferCatalog": {
                  "@type": "OfferCatalog",
                  "name": pageData?.title || "Flight Deals",
                  "itemListElement": [
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service",
                        "name": "Flight Booking",
                        "description": "Book flights from this airport"
                      },
                      "price": pageData?.avragefares ? `$${pageData.avragefares}` : "Varies",
                      "priceCurrency": process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || "USD"
                    }
                  ]
                }
              }} />
            )}

            {/* Flight Schemas for Route Pairs - Individual flights */}
            {arrivalIata && transformedFlights && transformedFlights.length > 0 && transformedFlights.map((flight, index) => (
              <SchemaOrg key={`flight-${index}`} data={{
                "@context": "https://schema.org",
                "@type": "Flight",
                "flightNumber": flight.airline_iata ? `${flight.airline_iata}${Math.floor(Math.random() * 9999) + 1000}` : `FL${index + 1}`,
                "airline": {
                  "@type": "Airline",
                  "name": flight.airline || "Airline",
                  "iataCode": flight.airline_iata || "XX"
                },
                "departureAirport": {
                  "@type": "Airport",
                  "name": `${flight.departure_city_name || departureCityName} Airport`,
                  "iataCode": flight.iata_from || departureIata,
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": flight.departure_city_name || departureCityName,
                    "addressCountry": flight.country_code || "Unknown"
                  }
                },
                "arrivalAirport": {
                  "@type": "Airport",
                  "name": `${flight.arrival_city_name || arrivalCityName} Airport`,
                  "iataCode": flight.iata_to || arrivalIata,
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": flight.arrival_city_name || arrivalCityName,
                    "addressCountry": flight.country_code || "Unknown"
                  }
                },
                "departureTime": flight.departure_time || "T06:00:00",
                "arrivalTime": flight.arrival_time || "T08:00:00",
                "offers": {
                  "@type": "Offer",
                  "price": flight.price || "Varies",
                  "priceCurrency": process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || "USD",
                  "availability": "https://schema.org/InStock",
                  "validFrom": new Date().toISOString().split('T')[0],
                  "validThrough": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                }
              }} />
            ))}

            {/* Fallback Flight Schema for Route Pairs if no individual flights */}
            {arrivalIata && (!transformedFlights || transformedFlights.length === 0) && flightData && (
              <SchemaOrg data={{
                "@context": "https://schema.org",
                "@type": "Flight",
                "flightNumber": "Various",
                "airline": {
                  "@type": "Airline",
                  "name": "Multiple Airlines",
                  "iataCode": "Various"
                },
                "departureAirport": {
                  "@type": "Airport",
                  "name": `${departureCityName} Airport`,
                  "iataCode": departureIata,
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": departureCityName,
                    "addressCountry": "Various"
                  }
                },
                "arrivalAirport": {
                  "@type": "Airport",
                  "name": `${arrivalCityName} Airport`,
                  "iataCode": arrivalIata,
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": arrivalCityName,
                    "addressCountry": "Various"
                  }
                },
                "offers": {
                  "@type": "Offer",
                  "price": flightData?.average_fare ? `$${flightData.average_fare}` : "Varies",
                  "priceCurrency": process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || "USD",
                  "availability": "https://schema.org/InStock"
                }
              }} />
            )}

            {/* Product Schema for Flight Deals */}
            <SchemaOrg data={{
              "@context": "https://schema.org",
              "@type": "Product",
              "name": pageData?.title || `Flight deals from ${departureCityName} to ${arrivalCityName || 'various destinations'}`,
              "description": pageData?.description || `Find the best flight deals and prices from ${departureCityName} to ${arrivalCityName || 'various destinations'}. Compare prices across multiple airlines and book your next trip.`,
              "brand": {
                "@type": "Brand",
                "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "AirlinesMap"
              },
              "offers": transformedFlights && transformedFlights.length > 0 ? {
                "@type": "AggregateOffer",
                "priceCurrency": process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || "USD",
                "lowPrice": Math.min(...transformedFlights.map(f => typeof f.price === 'string' ? parseFloat(f.price.replace('$', '') || '0') : f.price || 0)).toString(),
                "highPrice": Math.max(...transformedFlights.map(f => typeof f.price === 'string' ? parseFloat(f.price.replace('$', '') || '0') : f.price || 0)).toString(),
                "offerCount": transformedFlights.length.toString(),
                "availability": "https://schema.org/InStock",
                "validFrom": new Date().toISOString().split('T')[0],
                "validThrough": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
              } : {
                "@type": "AggregateOffer",
                "priceCurrency": process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || "USD",
                "lowPrice": pageData?.avragefares ? Math.round(pageData.avragefares * 0.7).toString() : "Varies",
                "highPrice": pageData?.avragefares ? Math.round(pageData.avragefares * 1.3).toString() : "Varies",
                "offerCount": "Multiple",
                "availability": "https://schema.org/InStock"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": process.env.NEXT_PUBLIC_DEFAULT_RATING || "4.5",
                "reviewCount": process.env.NEXT_PUBLIC_DEFAULT_REVIEW_COUNT || "1000"
              },
              "category": "Travel",
              "additionalProperty": [
                {
                  "@type": "PropertyValue",
                  "name": "Departure City",
                  "value": departureCityName
                },
                {
                  "@type": "PropertyValue", 
                  "name": "Arrival City",
                  "value": arrivalCityName || "Various Destinations"
                },
                {
                  "@type": "PropertyValue",
                  "name": "Cheapest Day",
                  "value": pageData?.cheapest_day || "Varies"
                },
                {
                  "@type": "PropertyValue",
                  "name": "Cheapest Month", 
                  "value": pageData?.cheapest_month || "Varies"
                }
              ]
            }} />

            {/* Dataset Schemas for Graphs */}
            <SchemaOrg data={datasetSchemas.monthly} />
            <SchemaOrg data={datasetSchemas.weekly} />

            {/* Content Schema */}
            <SchemaOrg data={{
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": pageData?.title || content.title,
              "description": pageData?.description || content.description,
              "author": {
                "@type": "Organization",
                "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "AirlinesMap"
              },
              "publisher": {
                "@type": "Organization",
                "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "AirlinesMap",
                "logo": {
                  "@type": "ImageObject",
                  "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com"}/logo.png`
                }
              },
              "datePublished": new Date().toISOString(),
              "dateModified": new Date().toISOString(),
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com"}/flights/${departureIata}${arrivalIata ? `-${arrivalIata}` : ''}`
              },
              "about": {
                "@type": "Place",
                "name": arrivalCity,
                "description": pageData?.city || `Information about ${arrivalCity}`
              }
            }} />

            {/* Flight List Schema */}
            {transformedFlights && transformedFlights.length > 0 && (
              <SchemaOrg data={{
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": `Flights from ${departureCity} to ${arrivalCity}`,
                "description": `Available flights from ${departureCity} (${departureIata}) to ${arrivalCity} (${arrivalIata})`,
                "numberOfItems": transformedFlights.length,
                "itemListElement": transformedFlights.map((flight, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "item": {
                    "@type": "Flight",
                    "name": `${flight.airline || 'Airline'} Flight ${flight.airline_iata || 'XX'}${flight.id || index + 1}`,
                    "flightNumber": `${flight.airline_iata || 'XX'}${flight.id || index + 1}`,
                    "departureTime": flight.departure_time || '09:00',
                    "arrivalTime": flight.arrival_time || '11:00',
                    "duration": flight.duration || '2h 30m',
                    "price": {
                      "@type": "PriceSpecification",
                      "price": flight.price || 100,
                      "priceCurrency": flight.currency || 'USD'
                    },
                    "departureAirport": {
                      "@type": "Airport",
                      "name": `${departureCity} Airport`,
                      "iataCode": flight.iata_from || departureIata
                    },
                    "arrivalAirport": {
                      "@type": "Airport",
                      "name": `${arrivalCity} Airport`,
                      "iataCode": flight.iata_to || arrivalIata
                    }
                  }
                }))
              }} />
            )}

            {/* Price Data Schema */}
            <SchemaOrg data={{
              "@context": "https://schema.org",
              "@type": "Dataset",
              "name": `Flight Price Data - ${departureCity} to ${arrivalCity}`,
              "description": `Historical price data for flights from ${departureCity} to ${arrivalCity}`,
              "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com"}/flights/${departureIata}${arrivalIata ? `-${arrivalIata}` : ''}`,
              "creator": {
                "@type": "Organization",
                "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "AirlinesMap"
              },
              "license": "https://creativecommons.org/licenses/by/4.0/",
              "variableMeasured": [
                {
                  "@type": "PropertyValue",
                  "name": "Weekly Price Average",
                  "description": "Average flight prices by day of the week",
                  "unitText": "USD"
                },
                {
                  "@type": "PropertyValue",
                  "name": "Monthly Price Average", 
                  "description": "Average flight prices by month",
                  "unitText": "USD"
                },
                {
                  "@type": "PropertyValue",
                  "name": "Temperature Data",
                  "description": "Average temperature by month",
                  "unitText": "°F"
                },
                {
                  "@type": "PropertyValue",
                  "name": "Rainfall Data",
                  "description": "Average rainfall by month",
                  "unitText": "inches"
                }
              ],
              "distribution": {
                "@type": "DataDownload",
                "encodingFormat": "application/json",
                "contentUrl": `${process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com"}/api/flight-data?arrival_iata=${arrivalIata}&departure_iata=${departureIata}`
              }
            }} />

            {/* Place Schema for Destination */}
            <SchemaOrg data={{
              "@context": "https://schema.org",
              "@type": "Place",
              "name": arrivalCity,
              "description": pageData?.city || `Information about ${arrivalCity}`,
              "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com"}/flights/${departureIata}${arrivalIata ? `-${arrivalIata}` : ''}`,
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "0.0", // This would need to be fetched from city data
                "longitude": "0.0"
              },
              "address": {
                "@type": "PostalAddress",
                "addressLocality": arrivalCity,
                "addressCountry": "Unknown"
              }
            }} />

            {/* TravelAgency Schema */}
            <SchemaOrg data={{
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "AirlinesMap",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com",
              "description": process.env.NEXT_PUBLIC_COMPANY_DESCRIPTION || "Compare airlines and find the best flight deals",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": process.env.NEXT_PUBLIC_ADDRESS || "8th the green suite b",
                "addressLocality": process.env.NEXT_PUBLIC_CITY || "Dover",
                "addressRegion": process.env.NEXT_PUBLIC_STATE || "DE",
                "postalCode": process.env.NEXT_PUBLIC_ZIP || "19901",
                "addressCountry": process.env.NEXT_PUBLIC_COUNTRY || "US"
              },
              "telephone": process.env.NEXT_PUBLIC_PHONE || "+1-302-123-4567",
              "email": process.env.NEXT_PUBLIC_EMAIL || "info@airlinesmap.com",
              "sameAs": [
                process.env.NEXT_PUBLIC_FACEBOOK || "https://facebook.com/airlinesmap",
                process.env.NEXT_PUBLIC_TWITTER || "https://twitter.com/airlinesmap",
                process.env.NEXT_PUBLIC_INSTAGRAM || "https://instagram.com/airlinesmap"
              ]
            }} />

            {/* Breadcrumb Schema */}
            <SchemaOrg data={{
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Flights",
                  "item": `${process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com"}/flights`
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": `${departureCity} to ${arrivalCity}`,
                  "item": `${process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com"}/flights/${departureIata}${arrivalIata ? `-${arrivalIata}` : ''}`
                }
              ]
            }} />

            {/* WebPage Schema */}
            <SchemaOrg data={{
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": pageData?.title || content.title,
              "description": pageData?.description || content.description,
              "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com"}/flights/${departureIata}${arrivalIata ? `-${arrivalIata}` : ''}`,
              "mainEntity": {
                "@type": "Flight",
                "departureAirport": {
                  "@type": "Airport",
                  "name": `${departureCity} Airport`,
                  "iataCode": departureIata
                },
                "arrivalAirport": {
                  "@type": "Airport",
                  "name": `${arrivalCity} Airport`,
                  "iataCode": arrivalIata
                }
              },
              "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Flights",
                    "item": `${process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com"}/flights`
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": `${departureCity} to ${arrivalCity}`,
                    "item": `${process.env.NEXT_PUBLIC_SITE_URL || "https://airlinesmap.com"}/flights/${departureIata}${arrivalIata ? `-${arrivalIata}` : ''}`
                  }
                ]
              }
            }} />
          </>
        );
      })()}
    </Box>
  );
});

export default FlightTemplate;
