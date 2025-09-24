import { Locale } from './i18n';
import { getServerTranslation, getServerHtmlTranslation } from './translationOptimizer';

/**
 * Optimized fallback content generator for pages without API content
 * Uses server-side translations for better SSR performance
 */

interface FallbackContentOptions {
  locale: Locale;
  airlineName: string;
  departureCity: string;
  arrivalCity?: string;
  departureIata: string;
  arrivalIata?: string;
}

interface FallbackContent {
  title: string;
  description: string;
  bookingSteps: string;
  cancellationPolicy: string;
  classes: string;
  destinationsOverview: string;
  popularDestinations: string;
  placesToVisit: string;
  cityInfo: string;
  bestTimeVisit: string;
  faqs: Array<{ q: string; a: string }>;
}

/**
 * Generate optimized fallback content using server-side translations
 */
export function generateOptimizedFallbackContent(options: FallbackContentOptions): FallbackContent {
  const { locale, airlineName, departureCity, arrivalCity, departureIata, arrivalIata } = options;
  
  // Generate title and description
  const title = arrivalCity ?
    getServerTranslation(locale, 'flightPage.title')
      .replace('{airlineName}', airlineName)
      .replace('{departureCity}', departureCity)
      .replace('{arrivalCity}', arrivalCity) :
    `${airlineName} flights from ${departureCity}`;
    
  const description = arrivalCity ?
    getServerTranslation(locale, 'flightPage.description')
      .replace('{airlineName}', airlineName)
      .replace('{departureCity}', departureCity)
      .replace('{arrivalCity}', arrivalCity) :
    `Plan your journey from ${departureCity} with ${airlineName}'s latest deals, travel tips, and flight information.`;

  // Generate booking steps
  const bookingSteps = generateBookingSteps(locale, airlineName);
  
  // Generate cancellation policy
  const cancellationPolicy = generateCancellationPolicy(locale, airlineName);
  
  // Generate flight classes information
  const classes = generateFlightClasses(locale, airlineName);
  
  // Generate destinations overview
  const destinationsOverview = generateDestinationsOverview(locale, airlineName, departureCity, arrivalCity);
  
  // Generate popular destinations
  const popularDestinations = generatePopularDestinations(locale, departureCity, arrivalCity);
  
  // Generate places to visit
  const placesToVisit = arrivalCity ? 
    generatePlacesToVisit(locale, arrivalCity) :
    generatePlacesToVisit(locale, departureCity);
  
  // Generate city information
  const cityInfo = arrivalCity ?
    generateCityInfo(locale, arrivalCity) :
    generateCityInfo(locale, departureCity);
  
  // Generate best time to visit
  const bestTimeVisit = arrivalCity ?
    generateBestTimeToVisit(locale, arrivalCity) :
    generateBestTimeToVisit(locale, departureCity);
  
  // Generate FAQs
  const faqs = generateFAQs(locale, airlineName, departureCity, arrivalCity);

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
    faqs
  };
}

/**
 * Generate booking steps content
 */
function generateBookingSteps(locale: Locale, airlineName: string): string {
  const baseContent = getServerTranslation(locale, 'flightPage.bookingSteps')
    .replace('{airlineName}', airlineName);
  
  const steps = locale === 'es' ? [
    '1. Visite el sitio web oficial de la aerolínea o use una plataforma de reservas confiable.',
    '2. Ingrese sus fechas de viaje, ciudades de origen y destino.',
    '3. Compare precios y horarios de vuelos disponibles.',
    '4. Seleccione su vuelo preferido y complete los detalles del pasajero.',
    '5. Revise su reserva y proceda al pago seguro.',
    '6. Reciba su confirmación por correo electrónico.'
  ] : locale === 'ru' ? [
    '1. Посетите официальный веб-сайт авиакомпании или используйте надежную платформу бронирования.',
    '2. Введите даты поездки, города отправления и назначения.',
    '3. Сравните цены и расписания доступных рейсов.',
    '4. Выберите предпочтительный рейс и заполните данные пассажира.',
    '5. Проверьте бронирование и перейдите к безопасной оплате.',
    '6. Получите подтверждение по электронной почте.'
  ] : locale === 'fr' ? [
    '1. Visitez le site web officiel de la compagnie aérienne ou utilisez une plateforme de réservation fiable.',
    '2. Saisissez vos dates de voyage, villes de départ et d\'arrivée.',
    '3. Comparez les prix et horaires des vols disponibles.',
    '4. Sélectionnez votre vol préféré et complétez les détails du passager.',
    '5. Vérifiez votre réservation et procédez au paiement sécurisé.',
    '6. Recevez votre confirmation par e-mail.'
  ] : [
    '1. Visit the airline\'s official website or use a reliable booking platform.',
    '2. Enter your travel dates, departure and arrival cities.',
    '3. Compare prices and schedules of available flights.',
    '4. Select your preferred flight and complete passenger details.',
    '5. Review your booking and proceed to secure payment.',
    '6. Receive your confirmation via email.'
  ];
  
  return `<h3>${baseContent}</h3><ol>${steps.map(step => `<li>${step}</li>`).join('')}</ol>`;
}

/**
 * Generate cancellation policy content
 */
function generateCancellationPolicy(locale: Locale, airlineName: string): string {
  const baseContent = getServerTranslation(locale, 'flightPage.cancellationPolicy')
    .replace('{airlineName}', airlineName);
  
  const policy = locale === 'es' ? `
    <p>La política de cancelación de ${airlineName} permite cambios y cancelaciones según el tipo de tarifa:</p>
    <ul>
      <li><strong>Tarifa Básica:</strong> Cancelaciones permitidas hasta 24 horas antes del vuelo con cargo.</li>
      <li><strong>Tarifa Estándar:</strong> Cambios y cancelaciones gratuitas hasta 48 horas antes del vuelo.</li>
      <li><strong>Tarifa Flexible:</strong> Cambios y cancelaciones gratuitas hasta 72 horas antes del vuelo.</li>
    </ul>
    <p>Para más información, contacte el servicio al cliente de ${airlineName}.</p>
  ` : locale === 'ru' ? `
    <p>Политика отмены ${airlineName} разрешает изменения и отмены в зависимости от типа тарифа:</p>
    <ul>
      <li><strong>Базовый тариф:</strong> Отмена разрешена до 24 часов до вылета за плату.</li>
      <li><strong>Стандартный тариф:</strong> Бесплатные изменения и отмена до 48 часов до вылета.</li>
      <li><strong>Гибкий тариф:</strong> Бесплатные изменения и отмена до 72 часов до вылета.</li>
    </ul>
    <p>Для получения дополнительной информации обратитесь в службу поддержки ${airlineName}.</p>
  ` : locale === 'fr' ? `
    <p>La politique d'annulation de ${airlineName} permet les modifications et annulations selon le type de tarif :</p>
    <ul>
      <li><strong>Tarif de base :</strong> Annulations autorisées jusqu'à 24 heures avant le vol avec frais.</li>
      <li><strong>Tarif standard :</strong> Modifications et annulations gratuites jusqu'à 48 heures avant le vol.</li>
      <li><strong>Tarif flexible :</strong> Modifications et annulations gratuites jusqu'à 72 heures avant le vol.</li>
    </ul>
    <p>Pour plus d'informations, contactez le service client de ${airlineName}.</p>
  ` : `
    <p>${airlineName}'s cancellation policy allows changes and cancellations based on fare type:</p>
    <ul>
      <li><strong>Basic Fare:</strong> Cancellations allowed up to 24 hours before flight with fees.</li>
      <li><strong>Standard Fare:</strong> Free changes and cancellations up to 48 hours before flight.</li>
      <li><strong>Flexible Fare:</strong> Free changes and cancellations up to 72 hours before flight.</li>
    </ul>
    <p>For more information, contact ${airlineName} customer service.</p>
  `;
  
  return `<h3>${baseContent}</h3>${policy}`;
}

/**
 * Generate flight classes content
 */
function generateFlightClasses(locale: Locale, airlineName: string): string {
  const baseContent = getServerTranslation(locale, 'flightPage.classes')
    .replace('{airlineName}', airlineName);
  
  const classes = locale === 'es' ? `
    <p>${airlineName} ofrece diferentes clases de servicio para satisfacer sus necesidades de viaje:</p>
    <ul>
      <li><strong>Clase Económica:</strong> Asientos cómodos con servicio básico y entretenimiento a bordo.</li>
      <li><strong>Clase Premium:</strong> Asientos con más espacio para las piernas y servicio mejorado.</li>
      <li><strong>Clase Business:</strong> Asientos reclinables, comidas premium y acceso a salas VIP.</li>
    </ul>
  ` : locale === 'ru' ? `
    <p>${airlineName} предлагает различные классы обслуживания для удовлетворения ваших потребностей в путешествии:</p>
    <ul>
      <li><strong>Эконом-класс:</strong> Удобные места с базовым обслуживанием и развлечениями на борту.</li>
      <li><strong>Премиум-класс:</strong> Места с дополнительным пространством для ног и улучшенным обслуживанием.</li>
      <li><strong>Бизнес-класс:</strong> Раскладывающиеся кресла, премиальная еда и доступ в VIP-залы.</li>
    </ul>
  ` : locale === 'fr' ? `
    <p>${airlineName} offre différentes classes de service pour répondre à vos besoins de voyage :</p>
    <ul>
      <li><strong>Classe économique :</strong> Sièges confortables avec service de base et divertissement à bord.</li>
      <li><strong>Classe premium :</strong> Sièges avec plus d'espace pour les jambes et service amélioré.</li>
      <li><strong>Classe affaires :</strong> Sièges inclinables, repas premium et accès aux salons VIP.</li>
    </ul>
  ` : `
    <p>${airlineName} offers different service classes to meet your travel needs:</p>
    <ul>
      <li><strong>Economy Class:</strong> Comfortable seats with basic service and in-flight entertainment.</li>
      <li><strong>Premium Class:</strong> Seats with extra legroom and enhanced service.</li>
      <li><strong>Business Class:</strong> Reclining seats, premium meals, and VIP lounge access.</li>
    </ul>
  `;
  
  return `<h3>${baseContent}</h3>${classes}`;
}

/**
 * Generate destinations overview
 */
function generateDestinationsOverview(locale: Locale, airlineName: string, departureCity: string, arrivalCity?: string): string {
  const baseContent = getServerTranslation(locale, 'flightPage.destinationsOverview')
    .replace('{airlineName}', airlineName);
  
  const overview = locale === 'es' ? `
    <p>${airlineName} conecta ${departureCity} con destinos populares en todo el mundo. ${arrivalCity ? `La ruta de ${departureCity} a ${arrivalCity} es una de nuestras rutas más populares.` : `Desde ${departureCity}, ofrecemos vuelos a múltiples destinos nacionales e internacionales.`}</p>
    <p>Nuestra red de rutas incluye ciudades principales, destinos de negocios y lugares de vacaciones populares.</p>
  ` : locale === 'ru' ? `
    <p>${airlineName} соединяет ${departureCity} с популярными направлениями по всему миру. ${arrivalCity ? `Маршрут из ${departureCity} в ${arrivalCity} является одним из наших самых популярных маршрутов.` : `Из ${departureCity} мы предлагаем рейсы в несколько внутренних и международных направлений.`}</p>
    <p>Наша сеть маршрутов включает основные города, деловые направления и популярные места для отпуска.</p>
  ` : locale === 'fr' ? `
    <p>${airlineName} connecte ${departureCity} aux destinations populaires du monde entier. ${arrivalCity ? `La route de ${departureCity} à ${arrivalCity} est l'une de nos routes les plus populaires.` : `Depuis ${departureCity}, nous proposons des vols vers plusieurs destinations nationales et internationales.`}</p>
    <p>Notre réseau de routes comprend des villes principales, des destinations d'affaires et des lieux de vacances populaires.</p>
  ` : `
    <p>${airlineName} connects ${departureCity} to popular destinations worldwide. ${arrivalCity ? `The route from ${departureCity} to ${arrivalCity} is one of our most popular routes.` : `From ${departureCity}, we offer flights to multiple domestic and international destinations.`}</p>
    <p>Our route network includes major cities, business destinations, and popular vacation spots.</p>
  `;
  
  return `<h3>${baseContent}</h3>${overview}`;
}

/**
 * Generate popular destinations
 */
function generatePopularDestinations(locale: Locale, departureCity: string, arrivalCity?: string): string {
  const destinations = locale === 'es' ? [
    'Nueva York', 'Londres', 'París', 'Tokio', 'Dubái', 'Singapur', 'Bangkok', 'Hong Kong'
  ] : locale === 'ru' ? [
    'Нью-Йорк', 'Лондон', 'Париж', 'Токио', 'Дубай', 'Сингапур', 'Бангкок', 'Гонконг'
  ] : locale === 'fr' ? [
    'New York', 'Londres', 'Paris', 'Tokyo', 'Dubaï', 'Singapour', 'Bangkok', 'Hong Kong'
  ] : [
    'New York', 'London', 'Paris', 'Tokyo', 'Dubai', 'Singapore', 'Bangkok', 'Hong Kong'
  ];
  
  const baseContent = getServerTranslation(locale, 'flightPage.popularDestinations');
  const list = destinations.map(dest => `<li>${dest}</li>`).join('');
  
  return `<h3>${baseContent}</h3><ul>${list}</ul>`;
}

/**
 * Generate places to visit
 */
function generatePlacesToVisit(locale: Locale, city: string): string {
  const baseContent = getServerTranslation(locale, 'flightPage.placesToVisit')
    .replace('{arrivalCity}', city);
  
  const places = locale === 'es' ? [
    'Centro histórico y monumentos',
    'Museos y galerías de arte',
    'Parques y espacios verdes',
    'Mercados locales y tiendas',
    'Restaurantes y vida nocturna',
    'Atracciones culturales'
  ] : locale === 'ru' ? [
    'Исторический центр и памятники',
    'Музеи и художественные галереи',
    'Парки и зеленые зоны',
    'Местные рынки и магазины',
    'Рестораны и ночная жизнь',
    'Культурные достопримечательности'
  ] : locale === 'fr' ? [
    'Centre historique et monuments',
    'Musées et galeries d\'art',
    'Parcs et espaces verts',
    'Marchés locaux et magasins',
    'Restaurants et vie nocturne',
    'Attractions culturelles'
  ] : [
    'Historic center and monuments',
    'Museums and art galleries',
    'Parks and green spaces',
    'Local markets and shops',
    'Restaurants and nightlife',
    'Cultural attractions'
  ];
  
  const list = places.map(place => `<li>${place}</li>`).join('');
  return `<h3>${baseContent}</h3><ul>${list}</ul>`;
}

/**
 * Generate city information
 */
function generateCityInfo(locale: Locale, city: string): string {
  const baseContent = getServerTranslation(locale, 'flightPage.cityInfo');
  
  const info = locale === 'es' ? `
    <p><strong>Acerca de ${city}:</strong></p>
    <p>${city} es una ciudad vibrante con una rica historia y cultura. La ciudad ofrece una mezcla única de tradición y modernidad, con atracciones que van desde sitios históricos hasta centros comerciales modernos.</p>
    <p>Los visitantes pueden disfrutar de la cocina local, explorar museos fascinantes, y experimentar la vida nocturna animada de la ciudad.</p>
  ` : locale === 'ru' ? `
    <p><strong>О ${city}:</strong></p>
    <p>${city} - это оживленный город с богатой историей и культурой. Город предлагает уникальное сочетание традиций и современности, с достопримечательностями от исторических мест до современных торговых центров.</p>
    <p>Посетители могут насладиться местной кухней, исследовать увлекательные музеи и испытать оживленную ночную жизнь города.</p>
  ` : locale === 'fr' ? `
    <p><strong>À propos de ${city} :</strong></p>
    <p>${city} est une ville dynamique avec une riche histoire et culture. La ville offre un mélange unique de tradition et de modernité, avec des attractions allant des sites historiques aux centres commerciaux modernes.</p>
    <p>Les visiteurs peuvent profiter de la cuisine locale, explorer des musées fascinants et découvrir la vie nocturne animée de la ville.</p>
  ` : `
    <p><strong>About ${city}:</strong></p>
    <p>${city} is a vibrant city with rich history and culture. The city offers a unique blend of tradition and modernity, with attractions ranging from historic sites to modern shopping centers.</p>
    <p>Visitors can enjoy local cuisine, explore fascinating museums, and experience the city's lively nightlife.</p>
  `;
  
  return `<h3>${baseContent}</h3>${info}`;
}

/**
 * Generate best time to visit
 */
function generateBestTimeToVisit(locale: Locale, city: string): string {
  const baseContent = getServerTranslation(locale, 'flightPage.bestTimeVisit')
    .replace('{arrivalCity}', city);
  
  const info = locale === 'es' ? `
    <p><strong>Mejor época para visitar ${city}:</strong></p>
    <p>La mejor época para visitar ${city} es típicamente durante los meses más frescos y secos para un turismo cómodo. Los meses de primavera y otoño ofrecen temperaturas agradables y menos multitudes.</p>
    <p>Evite los meses más calurosos del verano si prefiere climas más templados.</p>
  ` : locale === 'ru' ? `
    <p><strong>Лучшее время для посещения ${city}:</strong></p>
    <p>Лучшее время для посещения ${city} обычно в более прохладные и сухие месяцы для комфортного туризма. Весенние и осенние месяцы предлагают приятные температуры и меньше толп.</p>
    <p>Избегайте самых жарких летних месяцев, если предпочитаете более умеренный климат.</p>
  ` : locale === 'fr' ? `
    <p><strong>Meilleur moment pour visiter ${city} :</strong></p>
    <p>Le meilleur moment pour visiter ${city} est généralement pendant les mois les plus frais et secs pour un tourisme confortable. Les mois de printemps et d'automne offrent des températures agréables et moins de foule.</p>
    <p>Évitez les mois d'été les plus chauds si vous préférez un climat plus tempéré.</p>
  ` : `
    <p><strong>Best time to visit ${city}:</strong></p>
    <p>The best time to visit ${city} is typically during cooler, drier months for comfortable sightseeing. Spring and autumn months offer pleasant temperatures and fewer crowds.</p>
    <p>Avoid the hottest summer months if you prefer more temperate climates.</p>
  `;
  
  return `<h3>${baseContent}</h3>${info}`;
}

/**
 * Generate FAQs
 */
function generateFAQs(locale: Locale, airlineName: string, departureCity: string, arrivalCity?: string): Array<{ q: string; a: string }> {
  const faqs = locale === 'es' ? [
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
  ] : locale === 'ru' ? [
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
  ] : locale === 'fr' ? [
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
  ] : [
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
  ];
  
  return faqs;
}
