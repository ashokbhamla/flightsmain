import { Locale } from './i18n';
import { getTranslations } from './translations';

/**
 * Pre-Render Translation Layer
 * Translates all content BEFORE rendering for maximum speed
 * This ensures fast loading for all pages with consistent fallback content
 */

interface TranslationContext {
  locale: Locale;
  airlineName: string;
  departureCity: string;
  arrivalCity?: string;
  departureIata: string;
  arrivalIata?: string;
}

interface TranslatedContent {
  // Page metadata
  title: string;
  description: string;
  
  // Main content sections
  bookingSteps: string;
  cancellationPolicy: string;
  classes: string;
  destinationsOverview: string;
  popularDestinations: string;
  placesToVisit: string;
  cityInfo: string;
  bestTimeVisit: string;
  
  // FAQ content
  faqs: Array<{ q: string; a: string }>;
  
  // UI elements
  ui: {
    availableFlights: string;
    findFlights: string;
    bookNow: string;
    loading: string;
    error: string;
    cheapestPrice: string;
    averagePrice: string;
    mostExpensive: string;
  };
  
  // SEO content
  seo: {
    keywords: string;
    ogTitle: string;
    ogDescription: string;
  };
}

/**
 * Pre-translate ALL content before rendering
 * This is the main function that makes pages fast
 */
export function preTranslateContent(context: TranslationContext): TranslatedContent {
  const { locale, airlineName, departureCity, arrivalCity, departureIata, arrivalIata } = context;
  
  // Get translation object
  const t = getTranslations(locale);
  
  // Pre-translate page metadata
  const title = translateTitle(locale, t, airlineName, departureCity, arrivalCity);
  const description = translateDescription(locale, t, airlineName, departureCity, arrivalCity);
  
  // Pre-translate all content sections
  const bookingSteps = translateBookingSteps(locale, t, airlineName);
  const cancellationPolicy = translateCancellationPolicy(locale, t, airlineName);
  const classes = translateFlightClasses(locale, t, airlineName);
  const destinationsOverview = translateDestinationsOverview(locale, t, airlineName, departureCity, arrivalCity);
  const popularDestinations = translatePopularDestinations(locale, t);
  const placesToVisit = translatePlacesToVisit(locale, t, arrivalCity || departureCity);
  const cityInfo = translateCityInfo(locale, t, arrivalCity || departureCity);
  const bestTimeVisit = translateBestTimeToVisit(locale, t, arrivalCity || departureCity);
  
  // Pre-translate FAQs
  const faqs = translateFAQs(locale, t, airlineName, departureCity, arrivalCity);
  
  // Pre-translate UI elements
  const ui = translateUIElements(locale, t);
  
  // Pre-translate SEO content
  const seo = translateSEOContent(locale, t, airlineName, departureCity, arrivalCity);
  
  return {
    title,
    description,
    bookingSteps,
    cancellationPolicy,
    classes,
    destinationsOverview,
    popularDestinations,
    placesToVisit,
    cityInfo,
    bestTimeVisit,
    faqs,
    ui,
    seo
  };
}

/**
 * Translate page title
 */
function translateTitle(locale: Locale, t: any, airlineName: string, departureCity: string, arrivalCity?: string): string {
  if (arrivalCity) {
    return t.flightPage.title
      .replace('{airlineName}', airlineName)
      .replace('{departureCity}', departureCity)
      .replace('{arrivalCity}', arrivalCity);
  }
  
  return `${airlineName} flights from ${departureCity}`;
}

/**
 * Translate page description
 */
function translateDescription(locale: Locale, t: any, airlineName: string, departureCity: string, arrivalCity?: string): string {
  if (arrivalCity) {
    return t.flightPage.description
      .replace('{airlineName}', airlineName)
      .replace('{departureCity}', departureCity)
      .replace('{arrivalCity}', arrivalCity);
  }
  
  return `Plan your journey from ${departureCity} with ${airlineName}'s latest deals, travel tips, and flight information.`;
}

/**
 * Translate booking steps
 */
function translateBookingSteps(locale: Locale, t: any, airlineName: string): string {
  const title = t.flightPage.bookingSteps.replace('{airlineName}', airlineName);
  
  const steps = getBookingStepsByLocale(locale);
  const stepsHtml = steps.map(step => `<li>${step}</li>`).join('');
  
  return `<h3>${title}</h3><ol>${stepsHtml}</ol>`;
}

/**
 * Translate cancellation policy
 */
function translateCancellationPolicy(locale: Locale, t: any, airlineName: string): string {
  const title = t.flightPage.cancellationPolicy.replace('{airlineName}', airlineName);
  const content = getCancellationPolicyByLocale(locale, airlineName);
  
  return `<h3>${title}</h3>${content}`;
}

/**
 * Translate flight classes
 */
function translateFlightClasses(locale: Locale, t: any, airlineName: string): string {
  const title = t.flightPage.classes.replace('{airlineName}', airlineName);
  const content = getFlightClassesByLocale(locale, airlineName);
  
  return `<h3>${title}</h3>${content}`;
}

/**
 * Translate destinations overview
 */
function translateDestinationsOverview(locale: Locale, t: any, airlineName: string, departureCity: string, arrivalCity?: string): string {
  const title = t.flightPage.destinationsOverview.replace('{airlineName}', airlineName);
  const content = getDestinationsOverviewByLocale(locale, airlineName, departureCity, arrivalCity);
  
  return `<h3>${title}</h3>${content}`;
}

/**
 * Translate popular destinations
 */
function translatePopularDestinations(locale: Locale, t: any): string {
  const title = t.flightPage.popularDestinations;
  const destinations = getPopularDestinationsByLocale(locale);
  const destinationsHtml = destinations.map(dest => `<li>${dest}</li>`).join('');
  
  return `<h3>${title}</h3><ul>${destinationsHtml}</ul>`;
}

/**
 * Translate places to visit
 */
function translatePlacesToVisit(locale: Locale, t: any, city: string): string {
  const title = t.flightPage.placesToVisit.replace('{arrivalCity}', city);
  const places = getPlacesToVisitByLocale(locale);
  const placesHtml = places.map(place => `<li>${place}</li>`).join('');
  
  return `<h3>${title}</h3><ul>${placesHtml}</ul>`;
}

/**
 * Translate city information
 */
function translateCityInfo(locale: Locale, t: any, city: string): string {
  const title = t.flightPage.cityInfo;
  const content = getCityInfoByLocale(locale, city);
  
  return `<h3>${title}</h3>${content}`;
}

/**
 * Translate best time to visit
 */
function translateBestTimeToVisit(locale: Locale, t: any, city: string): string {
  const title = t.flightPage.bestTimeVisit.replace('{arrivalCity}', city);
  const content = getBestTimeToVisitByLocale(locale, city);
  
  return `<h3>${title}</h3>${content}`;
}

/**
 * Translate FAQs
 */
function translateFAQs(locale: Locale, t: any, airlineName: string, departureCity: string, arrivalCity?: string): Array<{ q: string; a: string }> {
  return getFAQsByLocale(locale, airlineName, departureCity, arrivalCity);
}

/**
 * Translate UI elements
 */
function translateUIElements(locale: Locale, t: any) {
  return {
    availableFlights: t.flightPage.availableFlights,
    findFlights: t.common.findFlights,
    bookNow: t.common.bookNow,
    loading: t.common.loading,
    error: t.common.error,
    cheapestPrice: 'Cheapest Price',
    averagePrice: 'Average Price',
    mostExpensive: 'Most Expensive'
  };
}

/**
 * Translate SEO content
 */
function translateSEOContent(locale: Locale, t: any, airlineName: string, departureCity: string, arrivalCity?: string) {
  const title = translateTitle(locale, t, airlineName, departureCity, arrivalCity);
  const description = translateDescription(locale, t, airlineName, departureCity, arrivalCity);
  
  return {
    keywords: `${airlineName}, flights, ${departureCity}, ${arrivalCity || 'destinations'}, travel, booking`,
    ogTitle: title,
    ogDescription: description
  };
}

/**
 * Get booking steps by locale
 */
function getBookingStepsByLocale(locale: Locale): string[] {
  const steps = {
    en: [
      'Visit the airline\'s official website or use a reliable booking platform.',
      'Enter your travel dates, departure and arrival cities.',
      'Compare prices and schedules of available flights.',
      'Select your preferred flight and complete passenger details.',
      'Review your booking and proceed to secure payment.',
      'Receive your confirmation via email.'
    ],
    es: [
      'Visite el sitio web oficial de la aerolínea o use una plataforma de reservas confiable.',
      'Ingrese sus fechas de viaje, ciudades de origen y destino.',
      'Compare precios y horarios de vuelos disponibles.',
      'Seleccione su vuelo preferido y complete los detalles del pasajero.',
      'Revise su reserva y proceda al pago seguro.',
      'Reciba su confirmación por correo electrónico.'
    ],
    ru: [
      'Посетите официальный веб-сайт авиакомпании или используйте надежную платформу бронирования.',
      'Введите даты поездки, города отправления и назначения.',
      'Сравните цены и расписания доступных рейсов.',
      'Выберите предпочтительный рейс и заполните данные пассажира.',
      'Проверьте бронирование и перейдите к безопасной оплате.',
      'Получите подтверждение по электронной почте.'
    ],
    fr: [
      'Visitez le site web officiel de la compagnie aérienne ou utilisez une plateforme de réservation fiable.',
      'Saisissez vos dates de voyage, villes de départ et d\'arrivée.',
      'Comparez les prix et horaires des vols disponibles.',
      'Sélectionnez votre vol préféré et complétez les détails du passager.',
      'Vérifiez votre réservation et procédez au paiement sécurisé.',
      'Recevez votre confirmation par e-mail.'
    ]
  };
  
  return steps[locale] || steps.en;
}

/**
 * Get cancellation policy by locale
 */
function getCancellationPolicyByLocale(locale: Locale, airlineName: string): string {
  const policies = {
    en: `
      <p>${airlineName}'s cancellation policy allows changes and cancellations based on fare type:</p>
      <ul>
        <li><strong>Basic Fare:</strong> Cancellations allowed up to 24 hours before flight with fees.</li>
        <li><strong>Standard Fare:</strong> Free changes and cancellations up to 48 hours before flight.</li>
        <li><strong>Flexible Fare:</strong> Free changes and cancellations up to 72 hours before flight.</li>
      </ul>
      <p>For more information, contact ${airlineName} customer service.</p>
    `,
    es: `
      <p>La política de cancelación de ${airlineName} permite cambios y cancelaciones según el tipo de tarifa:</p>
      <ul>
        <li><strong>Tarifa Básica:</strong> Cancelaciones permitidas hasta 24 horas antes del vuelo con cargo.</li>
        <li><strong>Tarifa Estándar:</strong> Cambios y cancelaciones gratuitas hasta 48 horas antes del vuelo.</li>
        <li><strong>Tarifa Flexible:</strong> Cambios y cancelaciones gratuitas hasta 72 horas antes del vuelo.</li>
      </ul>
      <p>Para más información, contacte el servicio al cliente de ${airlineName}.</p>
    `,
    ru: `
      <p>Политика отмены ${airlineName} разрешает изменения и отмены в зависимости от типа тарифа:</p>
      <ul>
        <li><strong>Базовый тариф:</strong> Отмена разрешена до 24 часов до вылета за плату.</li>
        <li><strong>Стандартный тариф:</strong> Бесплатные изменения и отмена до 48 часов до вылета.</li>
        <li><strong>Гибкий тариф:</strong> Бесплатные изменения и отмена до 72 часов до вылета.</li>
      </ul>
      <p>Для получения дополнительной информации обратитесь в службу поддержки ${airlineName}.</p>
    `,
    fr: `
      <p>La politique d'annulation de ${airlineName} permet les modifications et annulations selon le type de tarif :</p>
      <ul>
        <li><strong>Tarif de base :</strong> Annulations autorisées jusqu'à 24 heures avant le vol avec frais.</li>
        <li><strong>Tarif standard :</strong> Modifications et annulations gratuites jusqu'à 48 heures avant le vol.</li>
        <li><strong>Tarif flexible :</strong> Modifications et annulations gratuites jusqu'à 72 heures avant le vol.</li>
      </ul>
      <p>Pour plus d'informations, contactez le service client de ${airlineName}.</p>
    `
  };
  
  return policies[locale] || policies.en;
}

/**
 * Get flight classes by locale
 */
function getFlightClassesByLocale(locale: Locale, airlineName: string): string {
  const classes = {
    en: `
      <p>${airlineName} offers different service classes to meet your travel needs:</p>
      <ul>
        <li><strong>Economy Class:</strong> Comfortable seats with basic service and in-flight entertainment.</li>
        <li><strong>Premium Class:</strong> Seats with extra legroom and enhanced service.</li>
        <li><strong>Business Class:</strong> Reclining seats, premium meals, and VIP lounge access.</li>
      </ul>
    `,
    es: `
      <p>${airlineName} ofrece diferentes clases de servicio para satisfacer sus necesidades de viaje:</p>
      <ul>
        <li><strong>Clase Económica:</strong> Asientos cómodos con servicio básico y entretenimiento a bordo.</li>
        <li><strong>Clase Premium:</strong> Asientos con más espacio para las piernas y servicio mejorado.</li>
        <li><strong>Clase Business:</strong> Asientos reclinables, comidas premium y acceso a salas VIP.</li>
      </ul>
    `,
    ru: `
      <p>${airlineName} предлагает различные классы обслуживания для удовлетворения ваших потребностей в путешествии:</p>
      <ul>
        <li><strong>Эконом-класс:</strong> Удобные места с базовым обслуживанием и развлечениями на борту.</li>
        <li><strong>Премиум-класс:</strong> Места с дополнительным пространством для ног и улучшенным обслуживанием.</li>
        <li><strong>Бизнес-класс:</strong> Раскладывающиеся кресла, премиальная еда и доступ в VIP-залы.</li>
      </ul>
    `,
    fr: `
      <p>${airlineName} offre différentes classes de service pour répondre à vos besoins de voyage :</p>
      <ul>
        <li><strong>Classe économique :</strong> Sièges confortables avec service de base et divertissement à bord.</li>
        <li><strong>Classe premium :</strong> Sièges avec plus d'espace pour les jambes et service amélioré.</li>
        <li><strong>Classe affaires :</strong> Sièges inclinables, repas premium et accès aux salons VIP.</li>
      </ul>
    `
  };
  
  return classes[locale] || classes.en;
}

/**
 * Get destinations overview by locale
 */
function getDestinationsOverviewByLocale(locale: Locale, airlineName: string, departureCity: string, arrivalCity?: string): string {
  const overviews = {
    en: `
      <p>${airlineName} connects ${departureCity} to popular destinations worldwide. ${arrivalCity ? `The route from ${departureCity} to ${arrivalCity} is one of our most popular routes.` : `From ${departureCity}, we offer flights to multiple domestic and international destinations.`}</p>
      <p>Our route network includes major cities, business destinations, and popular vacation spots.</p>
    `,
    es: `
      <p>${airlineName} conecta ${departureCity} con destinos populares en todo el mundo. ${arrivalCity ? `La ruta de ${departureCity} a ${arrivalCity} es una de nuestras rutas más populares.` : `Desde ${departureCity}, ofrecemos vuelos a múltiples destinos nacionales e internacionales.`}</p>
      <p>Nuestra red de rutas incluye ciudades principales, destinos de negocios y lugares de vacaciones populares.</p>
    `,
    ru: `
      <p>${airlineName} соединяет ${departureCity} с популярными направлениями по всему миру. ${arrivalCity ? `Маршрут из ${departureCity} в ${arrivalCity} является одним из наших самых популярных маршрутов.` : `Из ${departureCity} мы предлагаем рейсы в несколько внутренних и международных направлений.`}</p>
      <p>Наша сеть маршрутов включает основные города, деловые направления и популярные места для отпуска.</p>
    `,
    fr: `
      <p>${airlineName} connecte ${departureCity} aux destinations populaires du monde entier. ${arrivalCity ? `La route de ${departureCity} à ${arrivalCity} est l'une de nos routes les plus populaires.` : `Depuis ${departureCity}, nous proposons des vols vers plusieurs destinations nationales et internationales.`}</p>
      <p>Notre réseau de routes comprend des villes principales, des destinations d'affaires et des lieux de vacances populaires.</p>
    `
  };
  
  return overviews[locale] || overviews.en;
}

/**
 * Get popular destinations by locale
 */
function getPopularDestinationsByLocale(locale: Locale): string[] {
  const destinations = {
    en: ['New York', 'London', 'Paris', 'Tokyo', 'Dubai', 'Singapore', 'Bangkok', 'Hong Kong'],
    es: ['Nueva York', 'Londres', 'París', 'Tokio', 'Dubái', 'Singapur', 'Bangkok', 'Hong Kong'],
    ru: ['Нью-Йорк', 'Лондон', 'Париж', 'Токио', 'Дубай', 'Сингапур', 'Бангкок', 'Гонконг'],
    fr: ['New York', 'Londres', 'Paris', 'Tokyo', 'Dubaï', 'Singapour', 'Bangkok', 'Hong Kong']
  };
  
  return destinations[locale] || destinations.en;
}

/**
 * Get places to visit by locale
 */
function getPlacesToVisitByLocale(locale: Locale): string[] {
  const places = {
    en: [
      'Historic center and monuments',
      'Museums and art galleries',
      'Parks and green spaces',
      'Local markets and shops',
      'Restaurants and nightlife',
      'Cultural attractions'
    ],
    es: [
      'Centro histórico y monumentos',
      'Museos y galerías de arte',
      'Parques y espacios verdes',
      'Mercados locales y tiendas',
      'Restaurantes y vida nocturna',
      'Atracciones culturales'
    ],
    ru: [
      'Исторический центр и памятники',
      'Музеи и художественные галереи',
      'Парки и зеленые зоны',
      'Местные рынки и магазины',
      'Рестораны и ночная жизнь',
      'Культурные достопримечательности'
    ],
    fr: [
      'Centre historique et monuments',
      'Musées et galeries d\'art',
      'Parcs et espaces verts',
      'Marchés locaux et magasins',
      'Restaurants et vie nocturne',
      'Attractions culturelles'
    ]
  };
  
  return places[locale] || places.en;
}

/**
 * Get city information by locale
 */
function getCityInfoByLocale(locale: Locale, city: string): string {
  const info = {
    en: `
      <p><strong>About ${city}:</strong></p>
      <p>${city} is a vibrant city with rich history and culture. The city offers a unique blend of tradition and modernity, with attractions ranging from historic sites to modern shopping centers.</p>
      <p>Visitors can enjoy local cuisine, explore fascinating museums, and experience the city's lively nightlife.</p>
    `,
    es: `
      <p><strong>Acerca de ${city}:</strong></p>
      <p>${city} es una ciudad vibrante con una rica historia y cultura. La ciudad ofrece una mezcla única de tradición y modernidad, con atracciones que van desde sitios históricos hasta centros comerciales modernos.</p>
      <p>Los visitantes pueden disfrutar de la cocina local, explorar museos fascinantes, y experimentar la vida nocturna animada de la ciudad.</p>
    `,
    ru: `
      <p><strong>О ${city}:</strong></p>
      <p>${city} - это оживленный город с богатой историей и культурой. Город предлагает уникальное сочетание традиций и современности, с достопримечательностями от исторических мест до современных торговых центров.</p>
      <p>Посетители могут насладиться местной кухней, исследовать увлекательные музеи и испытать оживленную ночную жизнь города.</p>
    `,
    fr: `
      <p><strong>À propos de ${city} :</strong></p>
      <p>${city} est une ville dynamique avec une riche histoire et culture. La ville offre un mélange unique de tradition et de modernité, avec des attractions allant des sites historiques aux centres commerciaux modernes.</p>
      <p>Les visiteurs peuvent profiter de la cuisine locale, explorer des musées fascinants et découvrir la vie nocturne animée de la ville.</p>
    `
  };
  
  return info[locale] || info.en;
}

/**
 * Get best time to visit by locale
 */
function getBestTimeToVisitByLocale(locale: Locale, city: string): string {
  const info = {
    en: `
      <p><strong>Best time to visit ${city}:</strong></p>
      <p>The best time to visit ${city} is typically during cooler, drier months for comfortable sightseeing. Spring and autumn months offer pleasant temperatures and fewer crowds.</p>
      <p>Avoid the hottest summer months if you prefer more temperate climates.</p>
    `,
    es: `
      <p><strong>Mejor época para visitar ${city}:</strong></p>
      <p>La mejor época para visitar ${city} es típicamente durante los meses más frescos y secos para un turismo cómodo. Los meses de primavera y otoño ofrecen temperaturas agradables y menos multitudes.</p>
      <p>Evite los meses más calurosos del verano si prefiere climas más templados.</p>
    `,
    ru: `
      <p><strong>Лучшее время для посещения ${city}:</strong></p>
      <p>Лучшее время для посещения ${city} обычно в более прохладные и сухие месяцы для комфортного туризма. Весенние и осенние месяцы предлагают приятные температуры и меньше толп.</p>
      <p>Избегайте самых жарких летних месяцев, если предпочитаете более умеренный климат.</p>
    `,
    fr: `
      <p><strong>Meilleur moment pour visiter ${city} :</strong></p>
      <p>Le meilleur moment pour visiter ${city} est généralement pendant les mois les plus frais et secs pour un tourisme confortable. Les mois de printemps et d'automne offrent des températures agréables et moins de foule.</p>
      <p>Évitez les mois d'été les plus chauds si vous préférez un climat plus tempéré.</p>
    `
  };
  
  return info[locale] || info.en;
}

/**
 * Get FAQs by locale
 */
function getFAQsByLocale(locale: Locale, airlineName: string, departureCity: string, arrivalCity?: string): Array<{ q: string; a: string }> {
  const faqs = {
    en: [
      {
        q: `How much does it cost to fly ${airlineName} from ${departureCity}?`,
        a: `Flight costs with ${airlineName} from ${departureCity} ${arrivalCity ? `to ${arrivalCity}` : ''} vary by season, but typically start from $109 for one-way tickets.`
      },
      {
        q: `Where can I fly with ${airlineName} from ${departureCity}?`,
        a: `From ${departureCity}, ${airlineName} connects you to multiple domestic and international destinations, including major cities and popular spots.`
      },
      {
        q: `When are ${airlineName} flights cheapest from ${departureCity}?`,
        a: `The cheapest days to fly ${airlineName} from ${departureCity} are usually Sunday, with prices typically lower during off-season months.`
      },
      {
        q: `What's the best season for ${airlineName} deals?`,
        a: `The best season for ${airlineName} deals is typically December, when airlines offer special discounts for holidays.`
      }
    ],
    es: [
      {
        q: `¿Cuánto cuesta volar con ${airlineName} desde ${departureCity}?`,
        a: `Los costos de vuelo con ${airlineName} desde ${departureCity} ${arrivalCity ? `a ${arrivalCity}` : ''} varían según la temporada, pero generalmente comienzan desde $109 para vuelos de ida.`
      },
      {
        q: `¿A dónde puedo volar con ${airlineName} desde ${departureCity}?`,
        a: `Desde ${departureCity}, ${airlineName} te conecta con múltiples destinos nacionales e internacionales, incluyendo ciudades principales y destinos populares.`
      },
      {
        q: `¿Cuándo son más baratos los vuelos de ${airlineName} desde ${departureCity}?`,
        a: `Los días más baratos para volar con ${airlineName} desde ${departureCity} suelen ser los domingos, con precios típicamente más bajos durante los meses de temporada baja.`
      },
      {
        q: `¿Cuál es la mejor temporada para ofertas de ${airlineName}?`,
        a: `La mejor temporada para ofertas de ${airlineName} es típicamente diciembre, cuando las aerolíneas ofrecen descuentos especiales para las vacaciones.`
      }
    ],
    ru: [
      {
        q: `Сколько стоит лететь с ${airlineName} из ${departureCity}?`,
        a: `Стоимость рейсов с ${airlineName} из ${departureCity} ${arrivalCity ? `в ${arrivalCity}` : ''} варьируется в зависимости от сезона, но обычно начинается от $109 за билет в одну сторону.`
      },
      {
        q: `Куда я могу полететь с ${airlineName} из ${departureCity}?`,
        a: `Из ${departureCity} ${airlineName} соединяет вас с несколькими внутренними и международными направлениями, включая основные города и популярные места.`
      },
      {
        q: `Когда рейсы ${airlineName} из ${departureCity} самые дешевые?`,
        a: `Самые дешевые дни для полетов с ${airlineName} из ${departureCity} обычно воскресенье, с ценами, как правило, ниже в межсезонье.`
      },
      {
        q: `Какое лучшее время для предложений ${airlineName}?`,
        a: `Лучшее время для предложений ${airlineName} обычно декабрь, когда авиакомпании предлагают специальные скидки на праздники.`
      }
    ],
    fr: [
      {
        q: `Combien coûte un vol avec ${airlineName} depuis ${departureCity} ?`,
        a: `Les coûts de vol avec ${airlineName} depuis ${departureCity} ${arrivalCity ? `vers ${arrivalCity}` : ''} varient selon la saison, mais commencent généralement à partir de 109$ pour les vols aller simple.`
      },
      {
        q: `Où puis-je voler avec ${airlineName} depuis ${departureCity} ?`,
        a: `Depuis ${departureCity}, ${airlineName} vous connecte à plusieurs destinations nationales et internationales, y compris les grandes villes et destinations populaires.`
      },
      {
        q: `Quand les vols ${airlineName} depuis ${departureCity} sont-ils les moins chers ?`,
        a: `Les jours les moins chers pour voler avec ${airlineName} depuis ${departureCity} sont généralement les dimanches, avec des prix typiquement plus bas pendant les mois de basse saison.`
      },
      {
        q: `Quelle est la meilleure saison pour les offres ${airlineName} ?`,
        a: `La meilleure saison pour les offres ${airlineName} est généralement décembre, quand les compagnies aériennes offrent des réductions spéciales pour les vacances.`
      }
    ]
  };
  
  return faqs[locale] || faqs.en;
}
