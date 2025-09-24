import { Locale } from './i18n';

interface FlightData {
  total_flights?: number;
  cheapest_day?: string;
  best_deal?: number;
  round_trip_start?: number;
  oneway_trip_start?: number;
  average_temperature?: number;
  average_rainfall?: number;
  departure_city?: string;
  arrival_city?: string;
  cheapest_month?: string;
  [key: string]: any;
}

interface ContentData {
  title?: string;
  description?: string;
  faqs?: Array<{ q: string; a: string }>;
  [key: string]: any;
}

/**
 * Generate fallback content when API content is not available
 */
export function generateFallbackContent({
  locale,
  airlineName,
  departureCity,
  arrivalCity,
  flightData,
  contentData
}: {
  locale: Locale;
  airlineName: string;
  departureCity: string;
  arrivalCity: string;
  flightData: FlightData | null;
  contentData: ContentData | null;
}) {
  const totalFlights = flightData?.total_flights || 0;
  const cheapestDay = flightData?.cheapest_day || 'Monday';
  const bestDeal = flightData?.best_deal || 0;
  const onewayPrice = flightData?.oneway_trip_start || 0;
  const roundTripPrice = flightData?.round_trip_start || 0;
  const cheapestMonth = flightData?.cheapest_month || 'April';
  const avgTemp = flightData?.average_temperature || 0;
  const avgRainfall = flightData?.average_rainfall || 0;

  // Generate title with price
  const title = `${airlineName} flights from ${departureCity} @ $${onewayPrice}`;

  // Generate description using multiple data points
  const description = generateDynamicDescription({
    locale,
    airlineName,
    departureCity,
    arrivalCity,
    totalFlights,
    cheapestDay,
    bestDeal,
    onewayPrice,
    roundTripPrice,
    cheapestMonth,
    avgTemp,
    avgRainfall
  });

  // Generate page content
  const pageContent = generatePageContent({
    locale,
    airlineName,
    departureCity,
    arrivalCity,
    totalFlights,
    cheapestDay,
    bestDeal,
    onewayPrice,
    roundTripPrice,
    cheapestMonth,
    avgTemp,
    avgRainfall
  });

  // Generate FAQ content
  const faqs = generateFAQContent({
    locale,
    airlineName,
    departureCity,
    arrivalCity,
    onewayPrice,
    roundTripPrice,
    cheapestDay,
    cheapestMonth,
    avgTemp,
    avgRainfall
  });

  // Generate price cards data
  const priceCards = generatePriceCards({
    locale,
    airlineName,
    departureCity,
    arrivalCity,
    onewayPrice,
    roundTripPrice,
    cheapestDay,
    cheapestMonth
  });

  return {
    title,
    description,
    pageContent,
    faqs,
    priceCards
  };
}

/**
 * Generate dynamic description using flight data
 */
function generateDynamicDescription({
  locale,
  airlineName,
  departureCity,
  arrivalCity,
  totalFlights,
  cheapestDay,
  bestDeal,
  onewayPrice,
  roundTripPrice,
  cheapestMonth,
  avgTemp,
  avgRainfall
}: {
  locale: Locale;
  airlineName: string;
  departureCity: string;
  arrivalCity: string;
  totalFlights: number;
  cheapestDay: string;
  bestDeal: number;
  onewayPrice: number;
  roundTripPrice: number;
  cheapestMonth: string;
  avgTemp: number;
  avgRainfall: number;
}): string {
  const translations = {
    en: {
      description: `Discover ${totalFlights} ${airlineName} flights from ${departureCity} with prices starting from $${onewayPrice} one-way and $${roundTripPrice} round-trip. Best deal available at $${bestDeal} on ${cheapestDay}s. Average temperature ${avgTemp}°F with ${avgRainfall} inches of rainfall.`,
      cheapestDay: `Cheapest day to fly is ${cheapestDay}`,
      cheapestMonth: `Best month to book is ${cheapestMonth}`,
      weather: `Enjoy pleasant weather with ${avgTemp}°F average temperature`,
      rainfall: `Expect ${avgRainfall} inches of rainfall annually`,
      totalFlights: `${totalFlights} total flights available`,
      bestDeal: `Best deal starts from $${bestDeal}`
    },
    es: {
      description: `Descubre ${totalFlights} vuelos de ${airlineName} desde ${departureCity} con precios desde $${onewayPrice} ida y $${roundTripPrice} ida y vuelta. Mejor oferta disponible a $${bestDeal} los ${cheapestDay}s. Temperatura promedio ${avgTemp}°F con ${avgRainfall} pulgadas de lluvia.`,
      cheapestDay: `El día más barato para volar es el ${cheapestDay}`,
      cheapestMonth: `El mejor mes para reservar es ${cheapestMonth}`,
      weather: `Disfruta del clima agradable con ${avgTemp}°F de temperatura promedio`,
      rainfall: `Espera ${avgRainfall} pulgadas de lluvia anualmente`,
      totalFlights: `${totalFlights} vuelos totales disponibles`,
      bestDeal: `Mejor oferta desde $${bestDeal}`
    },
    ru: {
      description: `Откройте для себя ${totalFlights} рейсов ${airlineName} из ${departureCity} с ценами от $${onewayPrice} в одну сторону и $${roundTripPrice} туда и обратно. Лучшее предложение доступно за $${bestDeal} по ${cheapestDay}. Средняя температура ${avgTemp}°F с ${avgRainfall} дюймов осадков.`,
      cheapestDay: `Самый дешевый день для полета - ${cheapestDay}`,
      cheapestMonth: `Лучший месяц для бронирования - ${cheapestMonth}`,
      weather: `Наслаждайтесь приятной погодой со средней температурой ${avgTemp}°F`,
      rainfall: `Ожидайте ${avgRainfall} дюймов осадков в год`,
      totalFlights: `${totalFlights} всего рейсов доступно`,
      bestDeal: `Лучшее предложение от $${bestDeal}`
    },
    fr: {
      description: `Découvrez ${totalFlights} vols ${airlineName} depuis ${departureCity} avec des prix à partir de $${onewayPrice} aller simple et $${roundTripPrice} aller-retour. Meilleure offre disponible à $${bestDeal} le ${cheapestDay}. Température moyenne ${avgTemp}°F avec ${avgRainfall} pouces de pluie.`,
      cheapestDay: `Le jour le moins cher pour voler est le ${cheapestDay}`,
      cheapestMonth: `Le meilleur mois pour réserver est ${cheapestMonth}`,
      weather: `Profitez du temps agréable avec une température moyenne de ${avgTemp}°F`,
      rainfall: `Attendez-vous à ${avgRainfall} pouces de pluie par an`,
      totalFlights: `${totalFlights} vols totaux disponibles`,
      bestDeal: `Meilleure offre à partir de $${bestDeal}`
    }
  };

  return translations[locale]?.description || translations.en.description;
}

/**
 * Generate comprehensive page content
 */
function generatePageContent({
  locale,
  airlineName,
  departureCity,
  arrivalCity,
  totalFlights,
  cheapestDay,
  bestDeal,
  onewayPrice,
  roundTripPrice,
  cheapestMonth,
  avgTemp,
  avgRainfall
}: {
  locale: Locale;
  airlineName: string;
  departureCity: string;
  arrivalCity: string;
  totalFlights: number;
  cheapestDay: string;
  bestDeal: number;
  onewayPrice: number;
  roundTripPrice: number;
  cheapestMonth: string;
  avgTemp: number;
  avgRainfall: number;
}): string {
  const translations = {
    en: {
      content: `
        <h2>About ${airlineName} Flights from ${departureCity}</h2>
        <p>Discover ${totalFlights} ${airlineName} flight options from ${departureCity} with prices starting from $${onewayPrice} for one-way tickets and $${roundTripPrice} for round-trip flights. Our best deal starts from $${bestDeal}, providing excellent value for your travel needs.</p>
        
        <h3>Flight Availability</h3>
        <p>With ${totalFlights} total flights available, ${airlineName} offers extensive options from ${departureCity}. The best deal currently available is $${bestDeal}, making it an excellent choice for budget-conscious travelers.</p>
        
        <h3>Best Time to Book</h3>
        <p>The cheapest day to book ${airlineName} flights from ${departureCity} is typically ${cheapestDay}, while ${cheapestMonth} offers the best overall deals. Book in advance to secure the lowest fares and avoid peak travel periods.</p>
        
        <h3>Weather Information</h3>
        <p>When planning your trip from ${departureCity}, expect average temperatures around ${avgTemp}°F with approximately ${avgRainfall} inches of annual rainfall. This climate data helps you pack appropriately and plan your activities.</p>
        
        <h3>Flight Options</h3>
        <p>${airlineName} offers both one-way and round-trip flights from ${departureCity}. One-way flights start from $${onewayPrice}, while round-trip options begin at $${roundTripPrice}, providing flexibility for all types of travelers.</p>
        
        <h3>Booking Tips</h3>
        <p>For the best ${airlineName} deals from ${departureCity}, book your flights on ${cheapestDay}s and consider traveling in ${cheapestMonth}. Monitor price trends and set up alerts to catch price drops and special promotions.</p>
      `,
      destinations: `
        <h3>Popular Destinations from ${departureCity}</h3>
        <p>${airlineName} connects ${departureCity} to numerous destinations worldwide. Whether you're traveling for business or leisure, you'll find convenient flight options with competitive pricing starting from $${onewayPrice}.</p>
      `,
      hotels: `
        <h3>Hotels Near ${departureCity}</h3>
        <p>Find comfortable accommodations near ${departureCity} airport for your ${airlineName} flight. Many hotels offer shuttle services and early check-in options for early morning departures.</p>
      `
    },
    es: {
      content: `
        <h2>Acerca de los vuelos de ${airlineName} desde ${departureCity}</h2>
        <p>Descubre las mejores ofertas de vuelos de ${airlineName} desde ${departureCity} con precios desde $${onewayPrice} para boletos de ida y $${roundTripPrice} para vuelos de ida y vuelta. Nuestra guía completa te ayuda a encontrar las opciones más asequibles para tus necesidades de viaje.</p>
        
        <h3>Mejor Momento para Reservar</h3>
        <p>El día más barato para reservar vuelos de ${airlineName} desde ${departureCity} es típicamente el ${cheapestDay}, mientras que ${cheapestMonth} ofrece las mejores ofertas en general. Reserva con anticipación para asegurar las tarifas más bajas y evitar los períodos de viaje pico.</p>
        
        <h3>Información del Clima</h3>
        <p>Al planificar tu viaje desde ${departureCity}, espera temperaturas promedio alrededor de ${avgTemp}°F con aproximadamente ${avgRainfall} pulgadas de lluvia anual. Esta información climática te ayuda a empacar apropiadamente y planificar tus actividades.</p>
      `,
      destinations: `
        <h3>Destinos Populares desde ${departureCity}</h3>
        <p>${airlineName} conecta ${departureCity} con numerosos destinos en todo el mundo. Ya sea que viajes por negocios o placer, encontrarás opciones de vuelo convenientes con precios competitivos desde $${onewayPrice}.</p>
      `,
      hotels: `
        <h3>Hoteles cerca de ${departureCity}</h3>
        <p>Encuentra alojamientos cómodos cerca del aeropuerto de ${departureCity} para tu vuelo de ${airlineName}. Muchos hoteles ofrecen servicios de transporte y opciones de check-in temprano para salidas tempranas.</p>
      `
    },
    ru: {
      content: `
        <h2>О рейсах ${airlineName} из ${departureCity}</h2>
        <p>Откройте для себя лучшие предложения рейсов ${airlineName} из ${departureCity} с ценами от $${onewayPrice} за билеты в одну сторону и $${roundTripPrice} за рейсы туда и обратно. Наше полное руководство поможет вам найти самые доступные варианты для ваших потребностей в путешествии.</p>
        
        <h3>Лучшее время для бронирования</h3>
        <p>Самый дешевый день для бронирования рейсов ${airlineName} из ${departureCity} обычно ${cheapestDay}, в то время как ${cheapestMonth} предлагает лучшие общие предложения. Бронируйте заранее, чтобы зафиксировать самые низкие тарифы и избежать пиковых периодов путешествий.</p>
        
        <h3>Информация о погоде</h3>
        <p>Планируя поездку из ${departureCity}, ожидайте средние температуры около ${avgTemp}°F с приблизительно ${avgRainfall} дюймов годовых осадков. Эта климатическая информация поможет вам правильно упаковаться и спланировать свои активности.</p>
      `,
      destinations: `
        <h3>Популярные направления из ${departureCity}</h3>
        <p>${airlineName} соединяет ${departureCity} с многочисленными направлениями по всему миру. Путешествуете ли вы по делам или для удовольствия, вы найдете удобные варианты рейсов с конкурентоспособными ценами от $${onewayPrice}.</p>
      `,
      hotels: `
        <h3>Отели рядом с ${departureCity}</h3>
        <p>Найдите комфортабельные варианты размещения рядом с аэропортом ${departureCity} для вашего рейса ${airlineName}. Многие отели предлагают трансферы и варианты раннего заселения для утренних вылетов.</p>
      `
    },
    fr: {
      content: `
        <h2>À propos des vols ${airlineName} depuis ${departureCity}</h2>
        <p>Découvrez les meilleures offres de vols ${airlineName} depuis ${departureCity} avec des prix à partir de $${onewayPrice} pour les billets aller simple et $${roundTripPrice} pour les vols aller-retour. Notre guide complet vous aide à trouver les options les plus abordables pour vos besoins de voyage.</p>
        
        <h3>Meilleur moment pour réserver</h3>
        <p>Le jour le moins cher pour réserver les vols ${airlineName} depuis ${departureCity} est généralement le ${cheapestDay}, tandis que ${cheapestMonth} offre les meilleures offres globales. Réservez à l'avance pour sécuriser les tarifs les plus bas et éviter les périodes de voyage de pointe.</p>
        
        <h3>Informations météorologiques</h3>
        <p>Lors de la planification de votre voyage depuis ${departureCity}, attendez-vous à des températures moyennes autour de ${avgTemp}°F avec environ ${avgRainfall} pouces de pluie annuelle. Ces données climatiques vous aident à faire vos bagages de manière appropriée et à planifier vos activités.</p>
      `,
      destinations: `
        <h3>Destinations populaires depuis ${departureCity}</h3>
        <p>${airlineName} connecte ${departureCity} à de nombreuses destinations dans le monde entier. Que vous voyagiez pour les affaires ou les loisirs, vous trouverez des options de vol pratiques avec des prix compétitifs à partir de $${onewayPrice}.</p>
      `,
      hotels: `
        <h3>Hôtels près de ${departureCity}</h3>
        <p>Trouvez des hébergements confortables près de l'aéroport de ${departureCity} pour votre vol ${airlineName}. De nombreux hôtels offrent des services de navette et des options d'enregistrement anticipé pour les départs matinaux.</p>
      `
    }
  };

  return translations[locale]?.content || translations.en.content;
}

/**
 * Generate FAQ content using flight data
 */
function generateFAQContent({
  locale,
  airlineName,
  departureCity,
  arrivalCity,
  onewayPrice,
  roundTripPrice,
  cheapestDay,
  cheapestMonth,
  avgTemp,
  avgRainfall
}: {
  locale: Locale;
  airlineName: string;
  departureCity: string;
  arrivalCity: string;
  onewayPrice: number;
  roundTripPrice: number;
  cheapestDay: string;
  cheapestMonth: string;
  avgTemp: number;
  avgRainfall: number;
}): Array<{ q: string; a: string }> {
  const translations = {
    en: [
      {
        q: `What is the cheapest day to book ${airlineName} flights from ${departureCity}?`,
        a: `The cheapest day to book ${airlineName} flights from ${departureCity} is typically ${cheapestDay}. Booking on this day can save you up to 20% on your flight costs compared to other days of the week.`
      },
      {
        q: `What are the current ${airlineName} flight prices from ${departureCity}?`,
        a: `Current ${airlineName} flight prices from ${departureCity} start from $${onewayPrice} for one-way tickets and $${roundTripPrice} for round-trip flights. Prices may vary based on travel dates, demand, and booking time.`
      },
      {
        q: `What is the best month to book ${airlineName} flights from ${departureCity}?`,
        a: `${cheapestMonth} is typically the best month to book ${airlineName} flights from ${departureCity}. This month often offers the lowest prices and best availability for travelers.`
      },
      {
        q: `What should I know about the weather when flying from ${departureCity}?`,
        a: `When flying from ${departureCity}, expect average temperatures around ${avgTemp}°F with approximately ${avgRainfall} inches of annual rainfall. Plan your packing and activities accordingly for the best travel experience.`
      },
      {
        q: `How far in advance should I book ${airlineName} flights from ${departureCity}?`,
        a: `For the best ${airlineName} deals from ${departureCity}, book 2-3 months in advance. However, last-minute deals can sometimes be found, especially if you're flexible with your travel dates.`
      }
    ],
    es: [
      {
        q: `¿Cuál es el día más barato para reservar vuelos de ${airlineName} desde ${departureCity}?`,
        a: `El día más barato para reservar vuelos de ${airlineName} desde ${departureCity} es típicamente el ${cheapestDay}. Reservar en este día puede ahorrarte hasta un 20% en los costos de tu vuelo comparado con otros días de la semana.`
      },
      {
        q: `¿Cuáles son los precios actuales de vuelos de ${airlineName} desde ${departureCity}?`,
        a: `Los precios actuales de vuelos de ${airlineName} desde ${departureCity} comienzan desde $${onewayPrice} para boletos de ida y $${roundTripPrice} para vuelos de ida y vuelta. Los precios pueden variar según las fechas de viaje, demanda y tiempo de reserva.`
      }
    ],
    ru: [
      {
        q: `Какой самый дешевый день для бронирования рейсов ${airlineName} из ${departureCity}?`,
        a: `Самый дешевый день для бронирования рейсов ${airlineName} из ${departureCity} обычно ${cheapestDay}. Бронирование в этот день может сэкономить вам до 20% стоимости рейса по сравнению с другими днями недели.`
      },
      {
        q: `Какие текущие цены на рейсы ${airlineName} из ${departureCity}?`,
        a: `Текущие цены на рейсы ${airlineName} из ${departureCity} начинаются от $${onewayPrice} за билеты в одну сторону и $${roundTripPrice} за рейсы туда и обратно. Цены могут варьироваться в зависимости от дат поездки, спроса и времени бронирования.`
      }
    ],
    fr: [
      {
        q: `Quel est le jour le moins cher pour réserver les vols ${airlineName} depuis ${departureCity}?`,
        a: `Le jour le moins cher pour réserver les vols ${airlineName} depuis ${departureCity} est généralement le ${cheapestDay}. Réserver ce jour peut vous faire économiser jusqu'à 20% sur vos coûts de vol par rapport aux autres jours de la semaine.`
      },
      {
        q: `Quels sont les prix actuels des vols ${airlineName} depuis ${departureCity}?`,
        a: `Les prix actuels des vols ${airlineName} depuis ${departureCity} commencent à partir de $${onewayPrice} pour les billets aller simple et $${roundTripPrice} pour les vols aller-retour. Les prix peuvent varier selon les dates de voyage, la demande et le moment de la réservation.`
      }
    ]
  };

  return translations[locale] || translations.en;
}

/**
 * Generate price cards data
 */
function generatePriceCards({
  locale,
  airlineName,
  departureCity,
  arrivalCity,
  onewayPrice,
  roundTripPrice,
  cheapestDay,
  cheapestMonth
}: {
  locale: Locale;
  airlineName: string;
  departureCity: string;
  arrivalCity: string;
  onewayPrice: number;
  roundTripPrice: number;
  cheapestDay: string;
  cheapestMonth: string;
}) {
  const translations = {
    en: {
      roundTrip: {
        title: 'Round-trip from:',
        description: `Round-trip ${airlineName} flights from ${departureCity} to Various Destinations`
      },
      oneWay: {
        title: 'One-way from:',
        description: `One-way ${airlineName} flight from ${departureCity} to Various Destinations`
      },
      cheapestMonth: {
        title: 'Cheapest Month:',
        description: `Cheapest month is ${cheapestMonth} from ${departureCity}. Maximum price drop flights to ${departureCity} in month of ${cheapestMonth}.`
      },
      cheapestDay: {
        title: 'Cheapest Day:',
        description: `Cheapest week day is ${cheapestDay} from ${departureCity}. Maximum price drop flights to ${departureCity} on ${cheapestDay}.`
      }
    },
    es: {
      roundTrip: {
        title: 'Ida y vuelta desde:',
        description: `Vuelos de ida y vuelta de ${airlineName} desde ${departureCity} a Varios Destinos`
      },
      oneWay: {
        title: 'Ida desde:',
        description: `Vuelo de ida de ${airlineName} desde ${departureCity} a Varios Destinos`
      },
      cheapestMonth: {
        title: 'Mes más barato:',
        description: `El mes más barato es ${cheapestMonth} desde ${departureCity}. Máxima caída de precios de vuelos a ${departureCity} en el mes de ${cheapestMonth}.`
      },
      cheapestDay: {
        title: 'Día más barato:',
        description: `El día de la semana más barato es ${cheapestDay} desde ${departureCity}. Máxima caída de precios de vuelos a ${departureCity} el ${cheapestDay}.`
      }
    },
    ru: {
      roundTrip: {
        title: 'Туда и обратно от:',
        description: `Рейсы туда и обратно ${airlineName} из ${departureCity} в Различные Направления`
      },
      oneWay: {
        title: 'В одну сторону от:',
        description: `Рейс в одну сторону ${airlineName} из ${departureCity} в Различные Направления`
      },
      cheapestMonth: {
        title: 'Самый дешевый месяц:',
        description: `Самый дешевый месяц - ${cheapestMonth} из ${departureCity}. Максимальное падение цен на рейсы в ${departureCity} в месяце ${cheapestMonth}.`
      },
      cheapestDay: {
        title: 'Самый дешевый день:',
        description: `Самый дешевый день недели - ${cheapestDay} из ${departureCity}. Максимальное падение цен на рейсы в ${departureCity} в ${cheapestDay}.`
      }
    },
    fr: {
      roundTrip: {
        title: 'Aller-retour depuis:',
        description: `Vols aller-retour ${airlineName} depuis ${departureCity} vers Diverses Destinations`
      },
      oneWay: {
        title: 'Aller simple depuis:',
        description: `Vol aller simple ${airlineName} depuis ${departureCity} vers Diverses Destinations`
      },
      cheapestMonth: {
        title: 'Mois le moins cher:',
        description: `Le mois le moins cher est ${cheapestMonth} depuis ${departureCity}. Baisse maximale des prix des vols vers ${departureCity} au mois de ${cheapestMonth}.`
      },
      cheapestDay: {
        title: 'Jour le moins cher:',
        description: `Le jour de la semaine le moins cher est ${cheapestDay} depuis ${departureCity}. Baisse maximale des prix des vols vers ${departureCity} le ${cheapestDay}.`
      }
    }
  };

  const t = translations[locale] || translations.en;

  return [
    {
      id: 1,
      type: 'round-trip',
      price: `$${roundTripPrice}`,
      description: t.roundTrip.description,
      buttonText: 'Search Deals',
      buttonColor: '#10b981'
    },
    {
      id: 2,
      type: 'one-way',
      price: `$${onewayPrice}`,
      description: t.oneWay.description,
      buttonText: 'Search Deals',
      buttonColor: '#1e3a8a'
    },
    {
      id: 3,
      type: 'popular',
      month: cheapestMonth,
      description: t.cheapestMonth.description,
      buttonText: 'View Popular',
      buttonColor: '#ff6b35'
    },
    {
      id: 4,
      type: 'cheapest',
      month: cheapestDay,
      description: t.cheapestDay.description,
      buttonText: 'Find Deals',
      buttonColor: '#10b981'
    }
  ];
}
