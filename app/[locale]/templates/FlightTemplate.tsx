import { Locale } from '@/lib/i18n';
import { Typography, Box, Container, Grid, Card, CardContent, Button } from '@mui/material';
import FlightSearchBox from '@/components/FlightSearchBox';
import ClientPriceGraph from '@/components/ClientPriceGraph';
import FlightTabs from '@/components/FlightTabs';

interface FlightTemplateProps {
  locale: Locale;
  pageData: any;
  params: any;
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

export default function FlightTemplate({ locale, pageData, params, onAction }: FlightTemplateProps) {
  const { departureIata, arrivalIata } = params;
  
  // Helper function to get city name from IATA code
  const getCityName = (iataCode: string): string => {
    const cityMap: { [key: string]: string } = {
      'LAX': 'Los Angeles',
      'WAS': 'Washington, D.C.',
      'BWI': 'Baltimore',
      'IAD': 'Washington Dulles',
      'DCA': 'Washington Reagan',
      'JFK': 'New York',
      'ORD': 'Chicago',
      'DFW': 'Dallas',
      'ATL': 'Atlanta',
      'BOS': 'Boston',
      'MIA': 'Miami',
      'SFO': 'San Francisco',
      'SEA': 'Seattle',
      'DEN': 'Denver',
      'LAS': 'Las Vegas',
      'PHX': 'Phoenix',
      'MCO': 'Orlando',
      'CLT': 'Charlotte',
      'IAH': 'Houston',
      'DTW': 'Detroit',
      'DEL': 'Delhi',
      'BOM': 'Mumbai',
      'HYD': 'Hyderabad',
      'BLR': 'Bangalore',
      'CCU': 'Kolkata',
      'MAA': 'Chennai',
      'AMD': 'Ahmedabad',
      'PNQ': 'Pune',
      'COK': 'Kochi',
      'GOI': 'Goa',
      'IXZ': 'Port Blair'
    };
    return cityMap[iataCode] || iataCode;
  };

  const departureCity = getCityName(departureIata);
  const arrivalCity = getCityName(arrivalIata);
  const content = getFlightContent(locale, departureCity, arrivalCity, departureIata, arrivalIata);

  // Get flight data from API
  const flightData = pageData || {};
  const departureCityName = flightData.departure_city || departureCity;
  const arrivalCityName = flightData.arrival_city || arrivalCity;
  
  

  // Price cards data from API
  const priceCards = [
    {
      id: 1,
      type: 'average',
      price: flightData.oneway_trip_start || '$189',
      title: locale === 'es' ? 'Precio promedio desde:' : 
             locale === 'ru' ? 'Средняя цена от:' :
             locale === 'fr' ? 'Prix moyen à partir de:' : '🚀 UPDATED: Average price start from:',
      description: `${departureCityName} to ${arrivalCityName}`,
      buttonText: locale === 'es' ? 'Buscar Ofertas' : 
                  locale === 'ru' ? 'Поиск Предложений' :
                  locale === 'fr' ? 'Rechercher des Offres' : 'Search Deals',
      buttonColor: '#10b981'
    },
    {
      id: 2,
      type: 'oneway',
      price: flightData.oneway_trip_start || '$122',
      title: locale === 'es' ? 'Solo ida desde:' : 
             locale === 'ru' ? 'В одну сторону от:' :
             locale === 'fr' ? 'Aller simple depuis:' : '🚀 UPDATED: One-way from:',
      description: `${departureCityName} to ${arrivalCityName}`,
      buttonText: locale === 'es' ? 'Buscar Ofertas' : 
                  locale === 'ru' ? 'Поиск Предложений' :
                  locale === 'fr' ? 'Rechercher des Offres' : 'Search Deals',
      buttonColor: '#1e3a8a'
    },
    {
      id: 3,
      type: 'cheapest-day',
      month: flightData.cheapest_day || (locale === 'es' ? 'Miércoles' :
             locale === 'ru' ? 'Среда' :
             locale === 'fr' ? 'Mercredi' : 'Wednesday'),
      title: locale === 'es' ? 'Día más barato:' : 
             locale === 'ru' ? 'Самый дешевый день:' :
             locale === 'fr' ? 'Jour le moins cher:' : 'Cheapest day:',
      description: locale === 'es' ? `Vuelos más baratos a ${arrivalCityName} este día` :
                  locale === 'ru' ? `Самые дешевые рейсы в ${arrivalCityName} в этот день` :
                  locale === 'fr' ? `Vols les moins chers vers ${arrivalCityName} ce jour` :
                  `Cheapest flights to ${arrivalCityName} on this day`,
      buttonText: locale === 'es' ? 'Encontrar Ofertas' : 
                  locale === 'ru' ? 'Найти Предложения' :
                  locale === 'fr' ? 'Trouver des Offres' : 'Find Deals',
      buttonColor: '#f59e0b'
    },
    {
      id: 4,
      type: 'cheapest-month',
      month: flightData.cheapest_month || (locale === 'es' ? 'Enero' :
             locale === 'ru' ? 'Январь' :
             locale === 'fr' ? 'Janvier' : 'January'),
      title: locale === 'es' ? 'Más barato en:' : 
             locale === 'ru' ? 'Дешевле в:' :
             locale === 'fr' ? 'Moins cher en:' : 'Cheapest In:',
      description: locale === 'es' ? `Precios más baratos para vuelos a ${arrivalCityName} este mes` :
                  locale === 'ru' ? `Самые дешевые цены на рейсы в ${arrivalCityName} в этом месяце` :
                  locale === 'fr' ? `Prix les moins chers pour les vols vers ${arrivalCityName} ce mois` :
                  `Cheapest prices for flights to ${arrivalCityName} this month`,
      buttonText: locale === 'es' ? 'Encontrar Ofertas' : 
                  locale === 'ru' ? 'Найти Предложения' :
                  locale === 'fr' ? 'Trouver des Offres' : 'Find Deals',
      buttonColor: '#ef4444'
    }
  ];

  // Flight tabs data
  const flightTabs = [
    {
      id: 'oneway_flights',
      label: locale === 'es' ? 'Vuelos de Ida' : 
             locale === 'ru' ? 'Рейсы в одну сторону' :
             locale === 'fr' ? 'Vols Aller Simple' : 'One-way Flights',
      flights: flightData.oneway_flights || []
    },
    {
      id: 'last_minute_flights',
      label: locale === 'es' ? 'Vuelos de Último Minuto' : 
             locale === 'ru' ? 'Рейсы в последнюю минуту' :
             locale === 'fr' ? 'Vols de Dernière Minute' : 'Last Minute Flights',
      flights: flightData.last_minute_flights || []
    },
    {
      id: 'cheap_flights',
      label: locale === 'es' ? 'Vuelos Baratos' : 
             locale === 'ru' ? 'Дешевые рейсы' :
             locale === 'fr' ? 'Vols Pas Chers' : 'Cheap Flights',
      flights: flightData.cheap_flights || []
    },
    {
      id: 'best_flights',
      label: locale === 'es' ? 'Mejores Vuelos' : 
             locale === 'ru' ? 'Лучшие рейсы' :
             locale === 'fr' ? 'Meilleurs Vols' : 'Best Flights',
      flights: flightData.best_flights || []
    }
  ];

  // Use API data for graphs, fallback to sample data if not available
  const weeklyPriceData = pageData?.weeks?.map((week: any) => ({
    name: week.name,
    value: week.value
  })) || [
    { name: locale === 'es' ? 'Lun' : locale === 'ru' ? 'Пн' : locale === 'fr' ? 'Lun' : 'Mon', value: 245 },
    { name: locale === 'es' ? 'Mar' : locale === 'ru' ? 'Вт' : locale === 'fr' ? 'Mar' : 'Tue', value: 189 },
    { name: locale === 'es' ? 'Mié' : locale === 'ru' ? 'Ср' : locale === 'fr' ? 'Mer' : 'Wed', value: 198 },
    { name: locale === 'es' ? 'Jue' : locale === 'ru' ? 'Чт' : locale === 'fr' ? 'Jeu' : 'Thu', value: 195 },
    { name: locale === 'es' ? 'Vie' : locale === 'ru' ? 'Пт' : locale === 'fr' ? 'Ven' : 'Fri', value: 267 },
    { name: locale === 'es' ? 'Sáb' : locale === 'ru' ? 'Сб' : locale === 'fr' ? 'Sam' : 'Sat', value: 289 },
    { name: locale === 'es' ? 'Dom' : locale === 'ru' ? 'Вс' : locale === 'fr' ? 'Dim' : 'Sun', value: 312 }
  ];

  const monthlyPriceData = pageData?.months?.map((month: any) => ({
    name: month.name,
    value: month.price
  })) || [
    { name: locale === 'es' ? 'Ene' : locale === 'ru' ? 'Янв' : locale === 'fr' ? 'Jan' : 'Jan', value: 189 },
    { name: locale === 'es' ? 'Feb' : locale === 'ru' ? 'Фев' : locale === 'fr' ? 'Fév' : 'Feb', value: 198 },
    { name: locale === 'es' ? 'Mar' : locale === 'ru' ? 'Мар' : locale === 'fr' ? 'Mar' : 'Mar', value: 245 },
    { name: locale === 'es' ? 'Abr' : locale === 'ru' ? 'Апр' : locale === 'fr' ? 'Avr' : 'Apr', value: 267 },
    { name: locale === 'es' ? 'May' : locale === 'ru' ? 'Май' : locale === 'fr' ? 'Mai' : 'May', value: 289 },
    { name: locale === 'es' ? 'Jun' : locale === 'ru' ? 'Июн' : locale === 'fr' ? 'Jun' : 'Jun', value: 312 },
    { name: locale === 'es' ? 'Jul' : locale === 'ru' ? 'Июл' : locale === 'fr' ? 'Jul' : 'Jul', value: 345 },
    { name: locale === 'es' ? 'Ago' : locale === 'ru' ? 'Авг' : locale === 'fr' ? 'Aoû' : 'Aug', value: 378 },
    { name: locale === 'es' ? 'Sep' : locale === 'ru' ? 'Сен' : locale === 'fr' ? 'Sep' : 'Sep', value: 195 },
    { name: locale === 'es' ? 'Oct' : locale === 'ru' ? 'Окт' : locale === 'fr' ? 'Oct' : 'Oct', value: 198 },
    { name: locale === 'es' ? 'Nov' : locale === 'ru' ? 'Ноя' : locale === 'fr' ? 'Nov' : 'Nov', value: 245 },
    { name: locale === 'es' ? 'Dic' : locale === 'ru' ? 'Дек' : locale === 'fr' ? 'Déc' : 'Dec', value: 267 }
  ];

  // Helper function to transform weather data
  const transformWeatherData = (data: any[], fallbackData: any[]) => {
    console.log('=== TRANSFORMING WEATHER DATA ===');
    console.log('Input data:', data);
    console.log('Is array:', Array.isArray(data));
    console.log('Data length:', data?.length);
    
    if (!data || !Array.isArray(data)) {
      console.log('No data or not array, using fallback');
      return fallbackData;
    }
    
    if (data.length === 0) {
      console.log('Empty data array, using fallback');
      return fallbackData;
    }
    
    console.log('First item:', data[0]);
    console.log('First item type:', typeof data[0]);
    console.log('First item keys:', data[0] ? Object.keys(data[0]) : 'No keys');
    
    try {
      const result = data.map((item: any, index: number) => {
        console.log(`\n--- Processing item ${index} ---`);
        console.log('Item:', item);
        console.log('Item type:', typeof item);
        console.log('Item keys:', Object.keys(item || {}));
        
        // Try to extract name from various possible properties
        let name = 'Unknown';
        if (typeof item === 'string') {
          name = item;
        } else if (typeof item === 'object' && item !== null) {
          name = item.name || item.month || item.label || item.month_name || item.monthName || 
                 item.month_name || item.monthName || item.month_name || item.monthName || 
                 item.month_name || item.monthName || item.month_name || item.monthName || 
                 `Month ${index + 1}`;
        }
        
        // Try to extract value from various possible properties
        let value = 0;
        if (typeof item === 'number') {
          value = item;
        } else if (typeof item === 'string') {
          value = parseFloat(item) || 0;
        } else if (typeof item === 'object' && item !== null) {
          value = item.value || item.temp || item.temperature || item.avg_temp || item.avg_temperature || 
                  item.avg || item.avgTemp || item.avgTemperature || item.temp_value || 
                  item.temperature_value || item.avg_temp_value || item.avg_temperature_value || 0;
        }
        
        const result = { name: String(name), value: Number(value) || 0 };
        console.log('Result:', result);
        return result;
      });
      
      console.log('Final transformed data:', result);
      return result;
    } catch (error) {
      console.error('Error transforming weather data:', error);
      console.log('Using fallback data due to error');
      return fallbackData;
    }
  };

  // Fallback temperature data
  const fallbackTemperatureData = [
    { name: locale === 'es' ? 'Ene' : locale === 'ru' ? 'Янв' : locale === 'fr' ? 'Jan' : 'Jan', value: 35 },
    { name: locale === 'es' ? 'Feb' : locale === 'ru' ? 'Фев' : locale === 'fr' ? 'Fév' : 'Feb', value: 38 },
    { name: locale === 'es' ? 'Mar' : locale === 'ru' ? 'Мар' : locale === 'fr' ? 'Mar' : 'Mar', value: 47 },
    { name: locale === 'es' ? 'Abr' : locale === 'ru' ? 'Апр' : locale === 'fr' ? 'Avr' : 'Apr', value: 58 },
    { name: locale === 'es' ? 'May' : locale === 'ru' ? 'Май' : locale === 'fr' ? 'Mai' : 'May', value: 68 },
    { name: locale === 'es' ? 'Jun' : locale === 'ru' ? 'Июн' : locale === 'fr' ? 'Jun' : 'Jun', value: 77 },
    { name: locale === 'es' ? 'Jul' : locale === 'ru' ? 'Июл' : locale === 'fr' ? 'Jul' : 'Jul', value: 82 },
    { name: locale === 'es' ? 'Ago' : locale === 'ru' ? 'Авг' : locale === 'fr' ? 'Aoû' : 'Aug', value: 80 },
    { name: locale === 'es' ? 'Sep' : locale === 'ru' ? 'Сен' : locale === 'fr' ? 'Sep' : 'Sep', value: 73 },
    { name: locale === 'es' ? 'Oct' : locale === 'ru' ? 'Окт' : locale === 'fr' ? 'Oct' : 'Oct', value: 61 },
    { name: locale === 'es' ? 'Nov' : locale === 'ru' ? 'Ноя' : locale === 'fr' ? 'Nov' : 'Nov', value: 50 },
    { name: locale === 'es' ? 'Dic' : locale === 'ru' ? 'Дек' : locale === 'fr' ? 'Déc' : 'Dec', value: 40 }
  ];

  // Get temperature data from content API
  const temperatureData = pageData?.temperature || [];
  const rainfallData = pageData?.rainfall || [];
  
  console.log('Content API temperature data:', temperatureData);
  console.log('Content API rainfall data:', rainfallData);
  
  // Transform temperature data from content API
  const weatherData = Array.isArray(temperatureData) && temperatureData.length > 0 
    ? temperatureData.map((item: any, index: number) => ({
        name: item.name || item.month || item.label || `Month ${index + 1}`,
        value: Number(item.value || item.temp || item.temperature || 0)
      }))
    : [
        { name: 'Jan', value: 35 },
        { name: 'Feb', value: 38 },
        { name: 'Mar', value: 47 },
        { name: 'Apr', value: 58 },
        { name: 'May', value: 68 },
        { name: 'Jun', value: 77 },
        { name: 'Jul', value: 82 },
        { name: 'Aug', value: 80 },
        { name: 'Sep', value: 73 },
        { name: 'Oct', value: 61 },
        { name: 'Nov', value: 50 },
        { name: 'Dec', value: 40 }
      ];

  // Fallback rainfall data
  const fallbackRainfallData = [
    { name: locale === 'es' ? 'Ene' : locale === 'ru' ? 'Янв' : locale === 'fr' ? 'Jan' : 'Jan', value: 2.8 },
    { name: locale === 'es' ? 'Feb' : locale === 'ru' ? 'Фев' : locale === 'fr' ? 'Fév' : 'Feb', value: 2.6 },
    { name: locale === 'es' ? 'Mar' : locale === 'ru' ? 'Мар' : locale === 'fr' ? 'Mar' : 'Mar', value: 3.4 },
    { name: locale === 'es' ? 'Abr' : locale === 'ru' ? 'Апр' : locale === 'fr' ? 'Avr' : 'Apr', value: 3.1 },
    { name: locale === 'es' ? 'May' : locale === 'ru' ? 'Май' : locale === 'fr' ? 'Mai' : 'May', value: 3.8 },
    { name: locale === 'es' ? 'Jun' : locale === 'ru' ? 'Июн' : locale === 'fr' ? 'Jun' : 'Jun', value: 3.4 },
    { name: locale === 'es' ? 'Jul' : locale === 'ru' ? 'Июл' : locale === 'fr' ? 'Jul' : 'Jul', value: 3.7 },
    { name: locale === 'es' ? 'Ago' : locale === 'ru' ? 'Авг' : locale === 'fr' ? 'Aoû' : 'Aug', value: 3.9 },
    { name: locale === 'es' ? 'Sep' : locale === 'ru' ? 'Сен' : locale === 'fr' ? 'Sep' : 'Sep', value: 3.6 },
    { name: locale === 'es' ? 'Oct' : locale === 'ru' ? 'Окт' : locale === 'fr' ? 'Oct' : 'Oct', value: 3.2 },
    { name: locale === 'es' ? 'Nov' : locale === 'ru' ? 'Ноя' : locale === 'fr' ? 'Nov' : 'Nov', value: 2.9 },
    { name: locale === 'es' ? 'Dic' : locale === 'ru' ? 'Дек' : locale === 'fr' ? 'Déc' : 'Dec', value: 2.7 }
  ];

  // Transform rainfall data from content API
  const rainfallDataTransformed = Array.isArray(rainfallData) && rainfallData.length > 0 
    ? rainfallData.map((item: any, index: number) => ({
        name: item.name || item.month || item.label || `Month ${index + 1}`,
        value: Number(item.value || item.rainfall || item.precipitation || 0)
      }))
    : [
        { name: 'Jan', value: 2.8 },
        { name: 'Feb', value: 2.6 },
        { name: 'Mar', value: 3.4 },
        { name: 'Apr', value: 3.1 },
        { name: 'May', value: 3.8 },
        { name: 'Jun', value: 3.4 },
        { name: 'Jul', value: 3.7 },
        { name: 'Aug', value: 3.9 },
        { name: 'Sep', value: 3.6 },
        { name: 'Oct', value: 3.2 },
        { name: 'Nov', value: 2.9 },
        { name: 'Dec', value: 2.7 }
      ];

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
        >
          {pageData?.description || content.description}
        </Typography>

        {/* Flight Search Box */}
        <Box sx={{ mb: 6 }}>
          <FlightSearchBox 
            locale={locale}
            defaultFrom={{ 
              code: departureIata, 
              name: `${departureIata} - ${departureCity}`, 
              city_name: departureCity,
              country_name: '',
              country_code: '',
              type: 'airport' as const
            }}
            defaultTo={{ 
              code: arrivalIata, 
              name: `${arrivalIata} - ${arrivalCity}`, 
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
        {pageData && (
          <FlightTabs 
            flightData={pageData}
            departureCity={departureCity}
            arrivalCity={arrivalCity}
            departureIata={departureIata}
            arrivalIata={arrivalIata}
            tabDescriptions={pageData?.tab_descriptions}
            locale={locale}
          />
        )}

        {/* Price Trends & Analysis */}
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
            <Grid item xs={12} md={6}>
              <ClientPriceGraph
                title={flightData.cheapest_day ? 
                  (locale === 'es' ? `Precio más barato el ${flightData.cheapest_day}` :
                   locale === 'ru' ? `Самая дешевая цена в ${flightData.cheapest_day}` :
                   locale === 'fr' ? `Prix le moins cher le ${flightData.cheapest_day}` :
                   `Cheapest price on ${flightData.cheapest_day}`) : 
                  content.weeklyTitle}
                description={pageData?.weekly || content.weeklyDescription}
                data={weeklyPriceData}
                yAxisLabel={locale === 'es' ? 'Precio (USD)' : 
                            locale === 'ru' ? 'Цена (USD)' :
                            locale === 'fr' ? 'Prix (USD)' : 'Price (USD)'}
                showPrices={true}
                height={300}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ClientPriceGraph
                title={flightData.cheapest_month ? 
                  (locale === 'es' ? `Precio más barato en ${flightData.cheapest_month}` :
                   locale === 'ru' ? `Самая дешевая цена в ${flightData.cheapest_month}` :
                   locale === 'fr' ? `Prix le moins cher en ${flightData.cheapest_month}` :
                   `Cheapest price in ${flightData.cheapest_month}`) : 
                  content.monthlyTitle}
                description={pageData?.monthly || content.monthlyDescription}
                data={monthlyPriceData}
                yAxisLabel={locale === 'es' ? 'Precio (USD)' : 
                            locale === 'ru' ? 'Цена (USD)' :
                            locale === 'fr' ? 'Prix (USD)' : 'Price (USD)'}
                showPrices={true}
                height={300}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Weather & Climate */}
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
            <Grid item xs={12} md={6}>
                <ClientPriceGraph
                  title={locale === 'es' ? 'Temperatura' : 
                         locale === 'ru' ? 'Температура' :
                         locale === 'fr' ? 'Température' : 'Temperature'}
                  description={pageData?.temperature_description || content.weatherDescription}
                  data={weatherData}
                  yAxisLabel={locale === 'es' ? 'Temperatura (°F)' : 
                              locale === 'ru' ? 'Температура (°F)' :
                              locale === 'fr' ? 'Température (°F)' : 'Temperature (°F)'}
                  showPrices={false}
                  height={300}
                />
            </Grid>
            <Grid item xs={12} md={6}>
              <ClientPriceGraph
                title={locale === 'es' ? 'Precipitación' : 
                       locale === 'ru' ? 'Осадки' :
                       locale === 'fr' ? 'Précipitations' : 'Rainfall'}
                description={pageData?.rainfall_description || content.rainfallDescription}
                data={rainfallDataTransformed}
                yAxisLabel={locale === 'es' ? 'Precipitación (pulgadas)' : 
                            locale === 'ru' ? 'Осадки (дюймы)' :
                            locale === 'fr' ? 'Précipitations (pouces)' : 'Rainfall (inches)'}
                showPrices={false}
                height={300}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Places to Visit */}
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
              dangerouslySetInnerHTML={{ __html: pageData.places }} 
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
              dangerouslySetInnerHTML={{ __html: pageData.hotels }} 
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
              dangerouslySetInnerHTML={{ __html: pageData.city }} 
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
              dangerouslySetInnerHTML={{ __html: pageData.airlines }} 
              style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>
        )}

        {/* Frequently Asked Questions */}
        {pageData?.faqs && pageData.faqs.length > 0 && (
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
            
            {pageData.faqs.map((faq: any, index: number) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    mb: 1,
                    color: '#1a1a1a'
                  }}
                  dangerouslySetInnerHTML={{ __html: faq.question || '' }}
                />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#666',
                    lineHeight: 1.6
                  }}
                  dangerouslySetInnerHTML={{ __html: faq.answer || '' }}
                />
              </Box>
            ))}
          </Box>
        )}

        {/* Content from API */}
        {pageData?.content && (
          <Box sx={{ mb: 6 }}>
            <div 
              dangerouslySetInnerHTML={{ __html: pageData.content }} 
              style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
