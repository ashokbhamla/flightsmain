import { Locale } from './i18n';
import { getTranslations } from './translations';

/**
 * Master Translation System
 * English is the MASTER page - all changes in English automatically apply to all other languages
 * This ensures consistency across all pages and languages
 */

interface MasterContent {
  // Core page data
  title: string;
  description: string;
  
  // Content sections
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

interface TranslationContext {
  locale: Locale;
  airlineName: string;
  departureCity: string;
  arrivalCity?: string;
  departureIata: string;
  arrivalIata?: string;
}

/**
 * Get master content (English) and translate to target language
 * English is the source of truth - all changes here apply to all languages
 */
export function getMasterTranslatedContent(context: TranslationContext): MasterContent {
  const { locale, airlineName, departureCity, arrivalCity, departureIata, arrivalIata } = context;
  
  // Always start with English master content
  const masterContent = generateEnglishMasterContent(context);
  
  // If requesting English, return master content directly
  if (locale === 'en') {
    return masterContent;
  }
  
  // For other languages, translate the master content
  return translateMasterContent(masterContent, locale, context);
}

/**
 * Generate English master content (source of truth)
 * ALL changes to English content automatically apply to all other languages
 */
function generateEnglishMasterContent(context: TranslationContext): MasterContent {
  const { airlineName, departureCity, arrivalCity, departureIata, arrivalIata } = context;
  
  // English master content - this is the source of truth
  const title = arrivalCity ? 
    `${airlineName} flights from ${departureCity} to ${arrivalCity}` :
    `${airlineName} flights from ${departureCity}`;
    
  const description = arrivalCity ?
    `Plan your journey from ${departureCity} to ${arrivalCity} with ${airlineName}'s latest deals, travel tips, and flight information.` :
    `Plan your journey from ${departureCity} with ${airlineName}'s latest deals, travel tips, and flight information.`;

  const bookingSteps = `
    <h3>How to Book ${airlineName} Flights</h3>
    <ol>
      <li>Visit the airline's official website or use a reliable booking platform.</li>
      <li>Enter your travel dates, departure and arrival cities.</li>
      <li>Compare prices and schedules of available flights.</li>
      <li>Select your preferred flight and complete passenger details.</li>
      <li>Review your booking and proceed to secure payment.</li>
      <li>Receive your confirmation via email.</li>
    </ol>
  `;

  const cancellationPolicy = `
    <h3>${airlineName} Cancellation Policy</h3>
    <p>${airlineName}'s cancellation policy allows changes and cancellations based on fare type:</p>
    <ul>
      <li><strong>Basic Fare:</strong> Cancellations allowed up to 24 hours before flight with fees.</li>
      <li><strong>Standard Fare:</strong> Free changes and cancellations up to 48 hours before flight.</li>
      <li><strong>Flexible Fare:</strong> Free changes and cancellations up to 72 hours before flight.</li>
    </ul>
    <p>For more information, contact ${airlineName} customer service.</p>
  `;

  const classes = `
    <h3>${airlineName} Flight Classes</h3>
    <p>${airlineName} offers different service classes to meet your travel needs:</p>
    <ul>
      <li><strong>Economy Class:</strong> Comfortable seats with basic service and in-flight entertainment.</li>
      <li><strong>Premium Class:</strong> Seats with extra legroom and enhanced service.</li>
      <li><strong>Business Class:</strong> Reclining seats, premium meals, and VIP lounge access.</li>
    </ul>
  `;

  const destinationsOverview = `
    <h3>${airlineName} Destinations Overview</h3>
    <p>${airlineName} connects ${departureCity} to popular destinations worldwide. ${arrivalCity ? `The route from ${departureCity} to ${arrivalCity} is one of our most popular routes.` : `From ${departureCity}, we offer flights to multiple domestic and international destinations.`}</p>
    <p>Our route network includes major cities, business destinations, and popular vacation spots.</p>
  `;

  const popularDestinations = `
    <h3>Popular Destinations</h3>
    <ul>
      <li>New York</li>
      <li>London</li>
      <li>Paris</li>
      <li>Tokyo</li>
      <li>Dubai</li>
      <li>Singapore</li>
      <li>Bangkok</li>
      <li>Hong Kong</li>
    </ul>
  `;

  const placesToVisit = `
    <h3>Places to Visit in ${arrivalCity || departureCity}</h3>
    <ul>
      <li>Historic center and monuments</li>
      <li>Museums and art galleries</li>
      <li>Parks and green spaces</li>
      <li>Local markets and shops</li>
      <li>Restaurants and nightlife</li>
      <li>Cultural attractions</li>
    </ul>
  `;

  const cityInfo = `
    <h3>City Information</h3>
    <p><strong>About ${arrivalCity || departureCity}:</strong></p>
    <p>${arrivalCity || departureCity} is a vibrant city with rich history and culture. The city offers a unique blend of tradition and modernity, with attractions ranging from historic sites to modern shopping centers.</p>
    <p>Visitors can enjoy local cuisine, explore fascinating museums, and experience the city's lively nightlife.</p>
  `;

  const bestTimeVisit = `
    <h3>Best Time to Visit ${arrivalCity || departureCity}</h3>
    <p><strong>Best time to visit ${arrivalCity || departureCity}:</strong></p>
    <p>The best time to visit ${arrivalCity || departureCity} is typically during cooler, drier months for comfortable sightseeing. Spring and autumn months offer pleasant temperatures and fewer crowds.</p>
    <p>Avoid the hottest summer months if you prefer more temperate climates.</p>
  `;

  const faqs = [
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
    },
    {
      q: `How can I make a reservation with ${airlineName}?`,
      a: `Make reservations with ${airlineName} through their official booking channels, including their website, mobile app, or by calling their reservation center.`
    },
    {
      q: `What can I do near ${departureCity} Airport?`,
      a: `Top attractions near ${departureCity} Airport include historic sites, local markets, restaurants, and cultural attractions within easy reach of the terminals.`
    }
  ];

  const ui = {
    availableFlights: 'Available Flights',
    findFlights: 'Find Flights',
    bookNow: 'Book Now',
    loading: 'Loading...',
    error: 'Error',
    cheapestPrice: 'Cheapest Price',
    averagePrice: 'Average Price',
    mostExpensive: 'Most Expensive'
  };

  const seo = {
    keywords: `${airlineName}, flights, ${departureCity}, ${arrivalCity || 'destinations'}, travel, booking`,
    ogTitle: title,
    ogDescription: description
  };

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
 * Translate master content to target language
 * This ensures all languages inherit from English master
 */
function translateMasterContent(masterContent: MasterContent, locale: Locale, context: TranslationContext): MasterContent {
  const { airlineName, departureCity, arrivalCity } = context;
  
  // Get translation object for target language
  const t = getTranslations(locale);
  
  // Translate title and description
  const title = translateTitle(masterContent.title, locale, t, airlineName, departureCity, arrivalCity);
  const description = translateDescription(masterContent.description, locale, t, airlineName, departureCity, arrivalCity);
  
  // Translate content sections
  const bookingSteps = translateHtmlContent(masterContent.bookingSteps, locale, t, 'bookingSteps');
  const cancellationPolicy = translateHtmlContent(masterContent.cancellationPolicy, locale, t, 'cancellationPolicy');
  const classes = translateHtmlContent(masterContent.classes, locale, t, 'classes');
  const destinationsOverview = translateHtmlContent(masterContent.destinationsOverview, locale, t, 'destinationsOverview');
  const popularDestinations = translateHtmlContent(masterContent.popularDestinations, locale, t, 'popularDestinations');
  const placesToVisit = translateHtmlContent(masterContent.placesToVisit, locale, t, 'placesToVisit');
  const cityInfo = translateHtmlContent(masterContent.cityInfo, locale, t, 'cityInfo');
  const bestTimeVisit = translateHtmlContent(masterContent.bestTimeVisit, locale, t, 'bestTimeVisit');
  
  // Translate FAQs
  const faqs = translateFAQs(masterContent.faqs, locale, t, airlineName, departureCity, arrivalCity);
  
  // Translate UI elements
  const ui = translateUIElements(masterContent.ui, locale, t);
  
  // Translate SEO content
  const seo = {
    keywords: masterContent.seo.keywords, // Keywords stay the same for SEO
    ogTitle: title,
    ogDescription: description
  };

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
 * Translate title based on locale
 */
function translateTitle(title: string, locale: Locale, t: any, airlineName: string, departureCity: string, arrivalCity?: string): string {
  if (locale === 'en') return title;
  
  if (arrivalCity) {
    return t.flightPage.title
      .replace('{airlineName}', airlineName)
      .replace('{departureCity}', departureCity)
      .replace('{arrivalCity}', arrivalCity);
  }
  
  return `${airlineName} flights from ${departureCity}`;
}

/**
 * Translate description based on locale
 */
function translateDescription(description: string, locale: Locale, t: any, airlineName: string, departureCity: string, arrivalCity?: string): string {
  if (locale === 'en') return description;
  
  if (arrivalCity) {
    return t.flightPage.description
      .replace('{airlineName}', airlineName)
      .replace('{departureCity}', departureCity)
      .replace('{arrivalCity}', arrivalCity);
  }
  
  return `Plan your journey from ${departureCity} with ${airlineName}'s latest deals, travel tips, and flight information.`;
}

/**
 * Translate HTML content based on locale
 */
function translateHtmlContent(content: string, locale: Locale, t: any, contentType: string): string {
  if (locale === 'en') return content;
  
  // Extract the main content from HTML
  const contentMatch = content.match(/<h3>(.*?)<\/h3>(.*)/s);
  if (!contentMatch) return content;
  
  const title = contentMatch[1];
  const body = contentMatch[2];
  
  // Translate the title
  let translatedTitle = title;
  if (contentType === 'bookingSteps') {
    translatedTitle = t.flightPage.bookingSteps.replace('{airlineName}', title.match(/How to Book (.*) Flights/)?.[1] || '');
  } else if (contentType === 'cancellationPolicy') {
    translatedTitle = t.flightPage.cancellationPolicy.replace('{airlineName}', title.match(/(.*) Cancellation Policy/)?.[1] || '');
  } else if (contentType === 'classes') {
    translatedTitle = t.flightPage.classes.replace('{airlineName}', title.match(/(.*) Flight Classes/)?.[1] || '');
  } else if (contentType === 'destinationsOverview') {
    translatedTitle = t.flightPage.destinationsOverview.replace('{airlineName}', title.match(/(.*) Destinations Overview/)?.[1] || '');
  } else if (contentType === 'popularDestinations') {
    translatedTitle = t.flightPage.popularDestinations;
  } else if (contentType === 'placesToVisit') {
    const cityMatch = title.match(/Places to Visit in (.*)/);
    if (cityMatch) {
      translatedTitle = t.flightPage.placesToVisit.replace('{arrivalCity}', cityMatch[1]);
    }
  } else if (contentType === 'cityInfo') {
    translatedTitle = t.flightPage.cityInfo;
  } else if (contentType === 'bestTimeVisit') {
    const cityMatch = title.match(/Best Time to Visit (.*)/);
    if (cityMatch) {
      translatedTitle = t.flightPage.bestTimeVisit.replace('{arrivalCity}', cityMatch[1]);
    }
  }
  
  // Translate the body content
  const translatedBody = translateContentBody(body, locale, t);
  
  return `<h3>${translatedTitle}</h3>${translatedBody}`;
}

/**
 * Translate content body based on locale
 */
function translateContentBody(body: string, locale: Locale, t: any): string {
  if (locale === 'en') return body;
  
  // This is a simplified translation - in a real app, you'd use a proper translation service
  // For now, we'll return the English content as the structure is the same
  return body;
}

/**
 * Translate FAQs based on locale
 */
function translateFAQs(faqs: Array<{ q: string; a: string }>, locale: Locale, t: any, airlineName: string, departureCity: string, arrivalCity?: string): Array<{ q: string; a: string }> {
  if (locale === 'en') return faqs;
  
  // Get translated FAQs from translation system
  const translatedFAQs = getTranslatedFAQs(locale, airlineName, departureCity, arrivalCity);
  
  return translatedFAQs;
}

/**
 * Get translated FAQs for specific locale
 */
function getTranslatedFAQs(locale: Locale, airlineName: string, departureCity: string, arrivalCity?: string): Array<{ q: string; a: string }> {
  const faqs = {
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
      },
      {
        q: `¿Cómo puedo hacer una reserva con ${airlineName}?`,
        a: `Haz reservas con ${airlineName} a través de sus canales oficiales de reserva, incluyendo su sitio web, aplicación móvil, o llamando a su centro de reservas.`
      },
      {
        q: `¿Qué puedo hacer cerca del Aeropuerto de ${departureCity}?`,
        a: `Las principales atracciones cerca del Aeropuerto de ${departureCity} incluyen sitios históricos, mercados locales, restaurantes y atracciones culturales a poca distancia de las terminales.`
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
      },
      {
        q: `Как я могу сделать бронирование с ${airlineName}?`,
        a: `Делайте бронирования с ${airlineName} через их официальные каналы бронирования, включая их веб-сайт, мобильное приложение или позвонив в их центр бронирования.`
      },
      {
        q: `Что я могу делать рядом с аэропортом ${departureCity}?`,
        a: `Основные достопримечательности рядом с аэропортом ${departureCity} включают исторические места, местные рынки, рестораны и культурные достопримечательности в легкой доступности от терминалов.`
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
      },
      {
        q: `Comment puis-je faire une réservation avec ${airlineName} ?`,
        a: `Faites des réservations avec ${airlineName} par le biais de leurs canaux de réservation officiels, y compris leur site web, application mobile, ou en appelant leur centre de réservation.`
      },
      {
        q: `Que puis-je faire près de l'aéroport de ${departureCity} ?`,
        a: `Les principales attractions près de l'aéroport de ${departureCity} incluent des sites historiques, des marchés locaux, des restaurants et des attractions culturelles à portée de main des terminaux.`
      }
    ]
  };
  
  return faqs[locale] || faqs.es;
}

/**
 * Translate UI elements based on locale
 */
function translateUIElements(ui: any, locale: Locale, t: any) {
  if (locale === 'en') return ui;
  
  return {
    availableFlights: t.flightPage.availableFlights,
    findFlights: t.common.findFlights,
    bookNow: t.common.bookNow,
    loading: t.common.loading,
    error: t.common.error,
    cheapestPrice: 'Cheapest Price', // These can be translated if needed
    averagePrice: 'Average Price',
    mostExpensive: 'Most Expensive'
  };
}

/**
 * Apply this translation pattern to ALL pages in the web app
 * This ensures consistency across the entire application
 */
export function applyMasterTranslationPattern(pageType: string, context: TranslationContext): MasterContent {
  // This function can be used for any page type in the web app
  // Airlines, hotels, airports, destinations, etc.
  
  return getMasterTranslatedContent(context);
}

/**
 * Get page metadata using master translation pattern
 */
export function getMasterPageMetadata(context: TranslationContext): {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
} {
  const content = getMasterTranslatedContent(context);
  
  return {
    title: content.title,
    description: content.description,
    keywords: content.seo.keywords,
    ogTitle: content.seo.ogTitle,
    ogDescription: content.seo.ogDescription
  };
}
