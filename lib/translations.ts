import { Locale } from './i18n';

export interface Translations {
  header: {
    airlines: string;
    hotels: string;
    login: string;
  };
  footer: {
    about: string;
    aboutUs: string;
    androidApp: string;
    iosApp: string;
    blog: string;
    explore: string;
    flights: string;
    hotels: string;
    more: string;
    customerSupport: string;
    termsConditions: string;
    privacyPolicy: string;
    refundPolicy: string;
    sitemap: string;
    description1: string;
    description2: string;
    copyright: string;
  };
  flightSearch: {
    roundTrip: string;
    oneWay: string;
    multiCity: string;
    from: string;
    to: string;
    departure: string;
    return: string;
    passengers: string;
    adults: string;
    children: string;
    infants: string;
    search: string;
    findFlights: string;
    findFlightDeals: string;
    cheapestFlights: string;
  };
  flightTabs: {
    onewayFlights: string;
    lastMinute: string;
    cheapFlights: string;
    bestFlights: string;
    onewayDescription: string;
    lastMinuteDescription: string;
    cheapDescription: string;
    bestDescription: string;
  };
  pages: {
    aboutUs: {
      title: string;
      description: string;
      heading: string;
      content: string;
    };
    termsAndConditions: {
      title: string;
      description: string;
      heading: string;
      content: string;
    };
    privacyPolicy: {
      title: string;
      description: string;
      heading: string;
      content: string;
    };
    refundPolicy: {
      title: string;
      description: string;
      heading: string;
      content: string;
    };
    contactUs: {
      title: string;
      description: string;
      heading: string;
      content: string;
    };
    contactInfo: {
      title: string;
      customerService: string;
      bookingReservations: string;
      baggageInformation: string;
      corporateOffice: string;
      phone: string;
      email: string;
      hours: string;
      online: string;
      lostFound: string;
      headquarters: string;
      needHelp: string;
      customerServiceDesc: string;
    };
    airlines: {
      title: string;
      description: string;
      heading: string;
    };
    hotels: {
      title: string;
      description: string;
      heading: string;
    };
    search: {
      title: string;
      description: string;
      heading: string;
    };
    login: {
      title: string;
      description: string;
      heading: string;
    };
    register: {
      title: string;
      description: string;
      heading: string;
    };
    myAccount: {
      title: string;
      description: string;
      heading: string;
    };
  };
  common: {
    loading: string;
    error: string;
    notFound: string;
    searchResults: string;
    findFlights: string;
    findHotels: string;
    bookNow: string;
    learnMore: string;
    readMore: string;
    showMore: string;
    showLess: string;
    close: string;
    cancel: string;
    save: string;
    edit: string;
    delete: string;
    confirm: string;
    yes: string;
    no: string;
    back: string;
    next: string;
    previous: string;
    home: string;
    about: string;
    contact: string;
    help: string;
    support: string;
    refresh: string;
  };
  flightPage: {
    pricePrediction: string;
    roundTrip: string;
    oneWay: string;
    oneWayFlight: string;
    cheapestDay: string;
    cheapestMonth: string;
    cheapestDayDesc: string;
    cheapestMonthDesc: string;
    popularIn: string;
    highestDemand: string;
    priceTrends: string;
    weeklyTrends: string;
    monthlyTrends: string;
    weatherClimateInfo: string;
    weatherIn: string;
    averageRainfallIn: string;
    popularDestinations: string;
    airlines: string;
    faqs: string;
    availableFlights: string;
    viewFlights: string;
    from: string;
    flightsPerWeek: string;
    airline: string;
    avg: string;
    title: string;
    description: string;
    bookingSteps: string;
    cancellationPolicy: string;
    classes: string;
    destinationsOverview: string;
    placesToVisit: string;
    hotels: string;
    cityInfo: string;
    bestTimeVisit: string;
    departureTerminal: string;
    arrivalTerminal: string;
    terminalContact: string;
    stops: string;
    stop: string;
    totalDestinations: string;
    flights: string;
    to: string;
    findBest: string;
    flightDeals: string;
    comparePricesBookTrip: string;
    destinationsWorldwide: string;
    searchDeals: string;
    viewPopular: string;
    findDeals: string;
    roundTripFrom: string;
    oneWayFrom: string;
    cheapestMonthLabel: string;
    cheapestDayLabel: string;
    cheapFlightDeals: string;
    availableFlightsFrom: string;
    weatherDescriptionFallback: string;
    weatherDescriptionDetailed: string;
    rainfallDescriptionFallback: string;
    rainfallDescriptionDetailed: string;
    schemaProductName: string;
    schemaProductDescription: string;
    schemaItemListName: string;
    schemaItemListDescription: string;
    schemaFlightDescription: string;
    schemaAirportName: string;
    popularDestinationsFrom: string;
    airlineDepartureTerminal: string;
    airlineArrivalTerminal: string;
    airlinesContactAtTerminal: string;
    hotelsNear: string;
    aboutCity: string;
    departureInfo: string;
    arrivalInfo: string;
    terminalContactInfo: string;
    aboutThisRoute: string;
    morePlacesToVisit: string;
    airlinesInfo: string;
    weatherInfo: string;
    priceInfo: string;
    oneWayFlights: string;
    lastMinuteFlights: string;
    cheapFlights: string;
    bestFlights: string;
  };
}

const translations: Record<Locale, Translations> = {
  en: {
    header: {
      airlines: 'Airlines',
      hotels: 'Hotels',
      login: 'Login'
    },
    footer: {
      about: 'About',
      aboutUs: 'About Us',
      androidApp: 'Android App',
      iosApp: 'iOS App',
      blog: 'Blog',
      explore: 'Explore',
      flights: 'Flights',
      hotels: 'Hotels',
      more: 'More',
      customerSupport: 'Customer Support',
      termsConditions: 'Terms & Conditions',
      privacyPolicy: 'Privacy Policy',
      refundPolicy: 'Refund Policy',
      sitemap: 'Sitemap',
      description1: 'Helps you find the cheapest flight deals to any destination with ease.',
      description2: 'Browse through the best hotels and find exclusive deals.',
      copyright: '© 2018-2025 AirlinesMap Inc. All rights reserved.'
    },
    flightSearch: {
      roundTrip: 'ROUND TRIP',
      oneWay: 'ONE WAY',
      multiCity: 'MULTI-CITY',
      from: 'From',
      to: 'To',
      departure: 'Departure',
      return: 'Return',
      passengers: 'Passengers',
      adults: 'Adults',
      children: 'Children',
      infants: 'Infants',
      search: 'Search',
      findFlights: 'Find Flights',
      findFlightDeals: 'Find flight deals',
      cheapestFlights: 'Cheapest flights'
    },
    flightTabs: {
      onewayFlights: 'ONEWAY FLIGHTS',
      lastMinute: 'LAST MINUTE',
      cheapFlights: 'CHEAP FLIGHTS',
      bestFlights: 'BEST FLIGHTS',
      onewayDescription: 'Explore the cheapest oneway flights from {from} to {to} spotted daily.',
      lastMinuteDescription: 'Find last-minute flight deals from {from} to {to} for spontaneous travelers.',
      cheapDescription: 'Discover the most affordable flight options from {from} to {to} with great value.',
      bestDescription: 'Browse the best-rated flights from {from} to {to} with optimal schedules.'
    },
    pages: {
      aboutUs: {
        title: 'About Us - AirlinesMap',
        description: 'Learn more about AirlinesMap, your trusted partner for finding the best flight deals and travel experiences worldwide.',
        heading: 'About AirlinesMap',
        content: 'We are dedicated to helping travelers find the best flight deals and travel experiences. Our platform compares prices from multiple airlines to ensure you get the most value for your money.'
      },
      termsAndConditions: {
        title: 'Terms and Conditions - AirlinesMap',
        description: 'Read our terms and conditions to understand the rules and guidelines for using AirlinesMap platform.',
        heading: 'Terms and Conditions',
        content: 'Please read these terms and conditions carefully before using our service. By using AirlinesMap, you agree to be bound by these terms.'
      },
      privacyPolicy: {
        title: 'Privacy Policy - AirlinesMap',
        description: 'Learn how AirlinesMap protects your personal information and privacy while using our travel booking platform.',
        heading: 'Privacy Policy',
        content: 'We are committed to protecting your privacy and personal information. This policy explains how we collect, use, and safeguard your data.'
      },
      refundPolicy: {
        title: 'Refund Policy - AirlinesMap',
        description: 'Understand our refund and cancellation policies for flight bookings made through AirlinesMap.',
        heading: 'Refund Policy',
        content: 'Our refund policy outlines the conditions under which you can cancel or modify your bookings and receive refunds.'
      },
      contactUs: {
        title: 'Contact Us - AirlinesMap',
        description: 'Get in touch with AirlinesMap customer support for assistance with your travel bookings and inquiries.',
        heading: 'Contact Us',
        content: 'We are here to help you with any questions or concerns about your travel bookings. Contact our support team for assistance.'
      },
      contactInfo: {
        title: 'Contact Information',
        customerService: 'Customer Service',
        bookingReservations: 'Booking & Reservations',
        baggageInformation: 'Baggage Information',
        corporateOffice: 'Corporate Office',
        phone: 'Phone',
        email: 'Email',
        hours: 'Hours',
        online: 'Online',
        lostFound: 'Lost & Found',
        headquarters: 'Airlines Headquarters',
        needHelp: 'Need Help? Contact Us Now',
        customerServiceDesc: 'Our customer service team is available 24/7 to assist you with bookings, changes, cancellations, and any other inquiries about your flight.'
      },
      airlines: {
        title: 'Airlines - AirlinesMap',
        description: 'Browse and compare flights from major airlines worldwide. Find the best airline deals for your next trip.',
        heading: 'Airlines'
      },
      hotels: {
        title: 'Hotels - AirlinesMap',
        description: 'Find and book hotels near airports and destinations worldwide. Compare prices and amenities.',
        heading: 'Hotels'
      },
      search: {
        title: 'Search Results - AirlinesMap',
        description: 'Search results for flights and travel options. Find the best deals for your next trip.',
        heading: 'Search Results'
      },
      login: {
        title: 'Login - AirlinesMap',
        description: 'Sign in to your AirlinesMap account to manage your bookings and preferences.',
        heading: 'Sign In'
      },
      register: {
        title: 'Register - AirlinesMap',
        description: 'Create a new AirlinesMap account to start booking flights and managing your travel preferences.',
        heading: 'Create Account'
      },
      myAccount: {
        title: 'My Account - AirlinesMap',
        description: 'Manage your AirlinesMap account, view bookings, and update your travel preferences.',
        heading: 'My Account'
      }
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      notFound: 'Not Found',
      searchResults: 'Search Results',
      findFlights: 'Find Flights',
      findHotels: 'Find Hotels',
      bookNow: 'Book Now',
      learnMore: 'Learn More',
      readMore: 'Read More',
      showMore: 'Show More',
      showLess: 'Show Less',
      close: 'Close',
      cancel: 'Cancel',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      home: 'Home',
      about: 'About',
      contact: 'Contact',
      help: 'Help',
      support: 'Support',
      refresh: 'Refresh Page'
    },
    flightPage: {
      pricePrediction: 'Price prediction Flights to {cityName}',
      roundTrip: 'Round-trip from:',
      oneWay: 'One-way from:',
      oneWayFlight: 'One-way flight from {from} {code} to {to}',
      cheapestDay: 'Cheapest day:',
      cheapestMonth: 'Cheapest month:',
      cheapestDayDesc: 'Cheapest week day is {day} from {departureCity}. Maximum price drop flights to {departureCity} on {day}.',
      cheapestMonthDesc: 'Cheapest month is {month} from {departureCity}. Maximum price drop flights to {departureCity} in month of {month}.',
      popularIn: 'Popular In:',
      highestDemand: 'Highest demand for flights to {cityName} this month. Book now to get the best prices.',
      priceTrends: 'Price Trends & Analysis',
      weeklyTrends: 'Weekly Price Trends',
      monthlyTrends: 'Monthly Price Trends',
      weatherClimateInfo: 'Weather & Climate Information',
      weatherIn: 'Weather in',
      averageRainfallIn: 'Average Rainfall in',
      popularDestinations: 'Popular Destinations',
      airlines: 'Airlines',
      faqs: 'Frequently Asked Questions',
      availableFlights: 'Available Flights',
      viewFlights: 'View Flights',
      from: 'From',
      flightsPerWeek: 'flights/week',
      airline: 'Airline:',
      avg: 'avg',
      title: '{airlineName} flights from {departureCity} to {arrivalCity}',
      description: 'Plan your journey from {departureCity} to {arrivalCity} with {airlineName}\'s latest deals, travel tips, and flight information.',
      bookingSteps: 'How to Book {airlineName} Flights',
      cancellationPolicy: '{airlineName} Cancellation Policy',
      classes: '{airlineName} Flight Classes',
      destinationsOverview: '{airlineName} Destinations Overview',
      placesToVisit: 'Places to Visit in {arrivalCity}',
      hotels: 'Hotels in {arrivalCity}',
      cityInfo: 'City Information',
      bestTimeVisit: 'Best Time to Visit {arrivalCity}',
      departureTerminal: 'Departure Terminal Information',
      arrivalTerminal: 'Arrival Terminal Information',
      terminalContact: 'Terminal Contact Information',
      stops: 'stops',
      stop: 'stop',
      totalDestinations: 'Total Destinations',
      flights: 'flights',
      to: 'to',
      findBest: 'Find the best',
      flightDeals: 'flight deals',
      comparePricesBookTrip: 'Compare prices, book your next trip',
      destinationsWorldwide: 'destinations worldwide',
      searchDeals: 'Search Deals',
      viewPopular: 'View Popular',
      findDeals: 'Find Deals',
      roundTripFrom: 'Round-trip from:',
      oneWayFrom: 'One-way from:',
      cheapestMonthLabel: 'Cheapest Month:',
      cheapestDayLabel: 'Cheapest Day:',
      cheapFlightDeals: 'Cheap {airlineName} flight deals from {departureCity} to {arrivalCity}',
      availableFlightsFrom: 'Available Flights from {departureCity}',
      weatherDescriptionFallback: 'Plan your visit to {cityName} with current temperature data. {cityName} experiences varied weather throughout the year, with temperatures ranging from mild to warm depending on the season.',
      weatherDescriptionDetailed: 'Plan your visit to {cityName} with detailed temperature insights. {cityName} experiences temperatures ranging from {minTemp}°F in {coolestMonth} to {maxTemp}°F in {warmestMonth}, with an average of {avgTemp}°F. The best time to visit is during {bestMonths} when temperatures are most comfortable for sightseeing and outdoor activities.',
      rainfallDescriptionFallback: 'Stay prepared for your trip to {cityName} with current rainfall data. {cityName} receives varied rainfall throughout the year, with precipitation patterns changing by season.',
      rainfallDescriptionDetailed: 'Stay prepared for your trip to {cityName} with detailed rainfall insights. {cityName} receives rainfall ranging from {minRainfall} inches in {driestMonth} to {maxRainfall} inches in {wettestMonth}, with an average of {avgRainfall} inches annually. The best time to visit is during {bestMonths} when rainfall is minimal, ensuring clear skies for outdoor exploration and sightseeing.',
      schemaProductName: '{airlineName} flights from {departureCity} to {arrivalCity}',
      schemaProductDescription: 'Find cheap {airlineName} flights from {departureCity} to {arrivalCity}',
      schemaItemListName: '{airlineName} Flights from {departureCity}{arrivalCity}',
      schemaItemListDescription: 'Available {airlineName} flights from {departureCity}{arrivalCity}',
      schemaFlightDescription: '{airlineName} flight from {departureCity} to {arrivalCity}',
      schemaAirportName: '{cityName} Airport',
      popularDestinationsFrom: 'Popular Destinations from {departureCity}',
      airlineDepartureTerminal: '{airlineName} Departure Terminal',
      airlineArrivalTerminal: '{airlineName} Arrival Terminal',
      airlinesContactAtTerminal: 'Airlines Contact Information at {departureCity} Terminal',
      hotelsNear: 'Hotels Near {departureCity}',
      aboutCity: 'About {arrivalCity}',
      departureInfo: 'Departure Information',
      arrivalInfo: 'Arrival Information',
      terminalContactInfo: 'Terminal & Contact Information',
      aboutThisRoute: 'About This Route',
      morePlacesToVisit: 'More Places to Visit',
      airlinesInfo: 'Airlines Information',
      weatherInfo: 'Weather Information',
      priceInfo: 'Price Information',
      oneWayFlights: 'One-way Flights',
      lastMinuteFlights: 'Last Minute Flights',
      cheapFlights: 'Cheap Flights',
      bestFlights: 'Best Flights'
    }
  },
  es: {
    header: {
      airlines: 'Aerolíneas',
      hotels: 'Hoteles',
      login: 'Iniciar Sesión'
    },
    footer: {
      about: 'Acerca de',
      aboutUs: 'Acerca de Nosotros',
      androidApp: 'App Android',
      iosApp: 'App iOS',
      blog: 'Blog',
      explore: 'Explorar',
      flights: 'Vuelos',
      hotels: 'Hoteles',
      more: 'Más',
      customerSupport: 'Atención al Cliente',
      termsConditions: 'Términos y Condiciones',
      privacyPolicy: 'Política de Privacidad',
      refundPolicy: 'Política de Reembolso',
      sitemap: 'Mapa del Sitio',
      description1: 'Te ayuda a encontrar las mejores ofertas de vuelos a cualquier destino con facilidad.',
      description2: 'Navega por los mejores hoteles y encuentra ofertas exclusivas.',
      copyright: '© 2018-2025 AirlinesMap Inc. Todos los derechos reservados.'
    },
    flightSearch: {
      roundTrip: 'IDA Y VUELTA',
      oneWay: 'SOLO IDA',
      multiCity: 'MÚLTIPLES CIUDADES',
      from: 'Desde',
      to: 'Hacia',
      departure: 'Salida',
      return: 'Regreso',
      passengers: 'Pasajeros',
      adults: 'Adultos',
      children: 'Niños',
      infants: 'Bebés',
      search: 'Buscar',
      findFlights: 'Buscar Vuelos',
      findFlightDeals: 'Encuentra ofertas de vuelos',
      cheapestFlights: 'Vuelos más baratos'
    },
    flightTabs: {
      onewayFlights: 'VUELOS DE IDA',
      lastMinute: 'ÚLTIMO MINUTO',
      cheapFlights: 'VUELOS BARATOS',
      bestFlights: 'MEJORES VUELOS',
      onewayDescription: 'Explora los vuelos de ida más baratos de {from} a {to} encontrados diariamente.',
      lastMinuteDescription: 'Encuentra ofertas de vuelos de último minuto de {from} a {to} para viajeros espontáneos.',
      cheapDescription: 'Descubre las opciones de vuelo más asequibles de {from} a {to} con gran valor.',
      bestDescription: 'Navega por los vuelos mejor calificados de {from} a {to} con horarios óptimos.'
    },
    pages: {
      aboutUs: {
        title: 'Acerca de Nosotros - AirlinesMap',
        description: 'Conoce más sobre AirlinesMap, tu socio de confianza para encontrar las mejores ofertas de vuelos y experiencias de viaje en todo el mundo.',
        heading: 'Acerca de AirlinesMap',
        content: 'Estamos dedicados a ayudar a los viajeros a encontrar las mejores ofertas de vuelos y experiencias de viaje. Nuestra plataforma compara precios de múltiples aerolíneas para asegurar que obtengas el mejor valor por tu dinero.'
      },
      termsAndConditions: {
        title: 'Términos y Condiciones - AirlinesMap',
        description: 'Lee nuestros términos y condiciones para entender las reglas y pautas para usar la plataforma AirlinesMap.',
        heading: 'Términos y Condiciones',
        content: 'Por favor lee estos términos y condiciones cuidadosamente antes de usar nuestro servicio. Al usar AirlinesMap, aceptas estar sujeto a estos términos.'
      },
      privacyPolicy: {
        title: 'Política de Privacidad - AirlinesMap',
        description: 'Aprende cómo AirlinesMap protege tu información personal y privacidad mientras usas nuestra plataforma de reservas de viajes.',
        heading: 'Política de Privacidad',
        content: 'Estamos comprometidos a proteger tu privacidad e información personal. Esta política explica cómo recopilamos, usamos y protegemos tus datos.'
      },
      refundPolicy: {
        title: 'Política de Reembolso - AirlinesMap',
        description: 'Entiende nuestras políticas de reembolso y cancelación para reservas de vuelos hechas a través de AirlinesMap.',
        heading: 'Política de Reembolso',
        content: 'Nuestra política de reembolso describe las condiciones bajo las cuales puedes cancelar o modificar tus reservas y recibir reembolsos.'
      },
      contactUs: {
        title: 'Contáctanos - AirlinesMap',
        description: 'Ponte en contacto con el soporte al cliente de AirlinesMap para asistencia con tus reservas de viaje e consultas.',
        heading: 'Contáctanos',
        content: 'Estamos aquí para ayudarte con cualquier pregunta o inquietud sobre tus reservas de viaje. Contacta a nuestro equipo de soporte para asistencia.'
      },
      contactInfo: {
        title: 'Información de Contacto',
        customerService: 'Servicio al Cliente',
        bookingReservations: 'Reservas y Reservaciones',
        baggageInformation: 'Información de Equipaje',
        corporateOffice: 'Oficina Corporativa',
        phone: 'Teléfono',
        email: 'Correo Electrónico',
        hours: 'Horarios',
        online: 'En Línea',
        lostFound: 'Objetos Perdidos',
        headquarters: 'Sede de Aerolíneas',
        needHelp: '¿Necesitas Ayuda? Contáctanos Ahora',
        customerServiceDesc: 'Nuestro equipo de servicio al cliente está disponible 24/7 para asistirte con reservas, cambios, cancelaciones y cualquier otra consulta sobre tu vuelo.'
      },
      airlines: {
        title: 'Aerolíneas - AirlinesMap',
        description: 'Explora y compara vuelos de las principales aerolíneas del mundo. Encuentra las mejores ofertas de aerolíneas para tu próximo viaje.',
        heading: 'Aerolíneas'
      },
      hotels: {
        title: 'Hoteles - AirlinesMap',
        description: 'Encuentra y reserva hoteles cerca de aeropuertos y destinos en todo el mundo. Compara precios y amenidades.',
        heading: 'Hoteles'
      },
      search: {
        title: 'Resultados de Búsqueda - AirlinesMap',
        description: 'Resultados de búsqueda para vuelos y opciones de viaje. Encuentra las mejores ofertas para tu próximo viaje.',
        heading: 'Resultados de Búsqueda'
      },
      login: {
        title: 'Iniciar Sesión - AirlinesMap',
        description: 'Inicia sesión en tu cuenta de AirlinesMap para gestionar tus reservas y preferencias.',
        heading: 'Iniciar Sesión'
      },
      register: {
        title: 'Registrarse - AirlinesMap',
        description: 'Crea una nueva cuenta de AirlinesMap para comenzar a reservar vuelos y gestionar tus preferencias de viaje.',
        heading: 'Crear Cuenta'
      },
      myAccount: {
        title: 'Mi Cuenta - AirlinesMap',
        description: 'Gestiona tu cuenta de AirlinesMap, ve tus reservas y actualiza tus preferencias de viaje.',
        heading: 'Mi Cuenta'
      }
    },
    common: {
      loading: 'Cargando...',
      error: 'Error',
      notFound: 'No Encontrado',
      searchResults: 'Resultados de Búsqueda',
      findFlights: 'Buscar Vuelos',
      findHotels: 'Buscar Hoteles',
      bookNow: 'Reservar Ahora',
      learnMore: 'Saber Más',
      readMore: 'Leer Más',
      showMore: 'Mostrar Más',
      showLess: 'Mostrar Menos',
      close: 'Cerrar',
      cancel: 'Cancelar',
      save: 'Guardar',
      edit: 'Editar',
      delete: 'Eliminar',
      confirm: 'Confirmar',
      yes: 'Sí',
      no: 'No',
      back: 'Atrás',
      next: 'Siguiente',
      previous: 'Anterior',
      home: 'Inicio',
      about: 'Acerca de',
      contact: 'Contacto',
      help: 'Ayuda',
      support: 'Soporte',
      refresh: 'Actualizar Página'
    },
    flightPage: {
      pricePrediction: 'Predicción de precios Vuelos a {cityName}',
      roundTrip: 'Ida y vuelta desde:',
      oneWay: 'Solo ida desde:',
      oneWayFlight: 'Vuelo solo ida desde {from} {code} a {to}',
      cheapestDay: 'Día más barato:',
      cheapestMonth: 'Mes más barato:',
      cheapestDayDesc: 'El día más barato de la semana es {day} desde {departureCity}. Máxima caída de precios de vuelos a {departureCity} el {day}.',
      cheapestMonthDesc: 'El mes más barato es {month} desde {departureCity}. Máxima caída de precios de vuelos a {departureCity} en el mes de {month}.',
      popularIn: 'Popular en:',
      highestDemand: 'Mayor demanda de vuelos a {cityName} este mes. Reserva ahora para obtener los mejores precios.',
      priceTrends: 'Tendencias de Precios y Análisis',
      weeklyTrends: 'Tendencias de Precios Semanales',
      monthlyTrends: 'Tendencias de Precios Mensuales',
      weatherClimateInfo: 'Información del Clima y Tiempo',
      weatherIn: 'Tiempo en',
      averageRainfallIn: 'Lluvia Promedio en',
      popularDestinations: 'Destinos Populares',
      airlines: 'Aerolíneas',
      faqs: 'Preguntas Frecuentes',
      availableFlights: 'Vuelos Disponibles',
      viewFlights: 'Ver Vuelos',
      from: 'Desde',
      flightsPerWeek: 'vuelos/semana',
      airline: 'Aerolínea:',
      avg: 'promedio',
      title: 'Vuelos de {airlineName} desde {departureCity} a {arrivalCity}',
      description: 'Planifica tu viaje desde {departureCity} a {arrivalCity} con las mejores ofertas, consejos de viaje e información de vuelos de {airlineName}.',
      bookingSteps: 'Cómo Reservar Vuelos de {airlineName}',
      cancellationPolicy: 'Política de Cancelación de {airlineName}',
      classes: 'Clases de Vuelo de {airlineName}',
      destinationsOverview: 'Resumen de Destinos de {airlineName}',
      placesToVisit: 'Lugares para Visitar en {arrivalCity}',
      hotels: 'Hoteles en {arrivalCity}',
      cityInfo: 'Información de la Ciudad',
      bestTimeVisit: 'Mejor Época para Visitar {arrivalCity}',
      departureTerminal: 'Información del Terminal de Salida',
      arrivalTerminal: 'Información del Terminal de Llegada',
      terminalContact: 'Información de Contacto del Terminal',
      stops: 'escalas',
      stop: 'escala',
      totalDestinations: 'Total de Destinos',
      flights: 'vuelos',
      to: 'a',
      findBest: 'Encuentra las mejores',
      flightDeals: 'ofertas de vuelos',
      comparePricesBookTrip: 'Compara precios, reserva tu próximo viaje',
      destinationsWorldwide: 'destinos en todo el mundo',
      searchDeals: 'Buscar Ofertas',
      viewPopular: 'Ver Popular',
      findDeals: 'Encontrar Ofertas',
      roundTripFrom: 'Ida y vuelta desde:',
      oneWayFrom: 'Solo ida desde:',
      cheapestMonthLabel: 'Mes más barato:',
      cheapestDayLabel: 'Día más barato:',
      cheapFlightDeals: 'Ofertas de vuelos baratos de {airlineName} desde {departureCity} a {arrivalCity}',
      availableFlightsFrom: 'Vuelos Disponibles desde {departureCity}',
      weatherDescriptionFallback: 'Planifica tu visita a {cityName} con datos actuales de temperatura. {cityName} experimenta clima variado durante todo el año, con temperaturas que van de suaves a cálidas dependiendo de la temporada.',
      weatherDescriptionDetailed: 'Planifica tu visita a {cityName} con información detallada de temperatura. {cityName} experimenta temperaturas que van desde {minTemp}°F en {coolestMonth} hasta {maxTemp}°F en {warmestMonth}, con un promedio de {avgTemp}°F. El mejor momento para visitar es durante {bestMonths} cuando las temperaturas son más cómodas para turismo y actividades al aire libre.',
      rainfallDescriptionFallback: 'Prepárate para tu viaje a {cityName} con datos actuales de lluvia. {cityName} recibe lluvia variada durante todo el año, con patrones de precipitación que cambian según la temporada.',
      rainfallDescriptionDetailed: 'Prepárate para tu viaje a {cityName} con información detallada de lluvia. {cityName} recibe lluvia que va desde {minRainfall} pulgadas en {driestMonth} hasta {maxRainfall} pulgadas en {wettestMonth}, con un promedio de {avgRainfall} pulgadas anualmente. El mejor momento para visitar es durante {bestMonths} cuando la lluvia es mínima, asegurando cielos despejados para exploración y turismo al aire libre.',
      schemaProductName: 'Vuelos de {airlineName} desde {departureCity} a {arrivalCity}',
      schemaProductDescription: 'Encuentra vuelos baratos de {airlineName} desde {departureCity} a {arrivalCity}',
      schemaItemListName: 'Vuelos de {airlineName} desde {departureCity}{arrivalCity}',
      schemaItemListDescription: 'Vuelos disponibles de {airlineName} desde {departureCity}{arrivalCity}',
      schemaFlightDescription: 'Vuelo de {airlineName} desde {departureCity} a {arrivalCity}',
      schemaAirportName: 'Aeropuerto de {cityName}',
      popularDestinationsFrom: 'Destinos Populares desde {departureCity}',
      airlineDepartureTerminal: 'Terminal de Salida de {airlineName}',
      airlineArrivalTerminal: 'Terminal de Llegada de {airlineName}',
      airlinesContactAtTerminal: 'Información de Contacto de Aerolíneas en Terminal de {departureCity}',
      hotelsNear: 'Hoteles Cerca de {departureCity}',
      aboutCity: 'Acerca de {arrivalCity}',
      departureInfo: 'Información de Salida',
      arrivalInfo: 'Información de Llegada',
      terminalContactInfo: 'Información de Contacto del Terminal',
      aboutThisRoute: 'Acerca de Esta Ruta',
      morePlacesToVisit: 'Más Lugares para Visitar',
      airlinesInfo: 'Información de Aerolíneas',
      weatherInfo: 'Información del Clima',
      priceInfo: 'Información de Precios',
      oneWayFlights: 'Vuelos de Ida',
      lastMinuteFlights: 'Vuelos de Última Hora',
      cheapFlights: 'Vuelos Baratos',
      bestFlights: 'Mejores Vuelos'
    }
  },
  ru: {
    header: {
      airlines: 'Авиакомпании',
      hotels: 'Отели',
      login: 'Войти'
    },
    footer: {
      about: 'О нас',
      aboutUs: 'О нас',
      androidApp: 'Android Приложение',
      iosApp: 'iOS Приложение',
      blog: 'Блог',
      explore: 'Исследовать',
      flights: 'Рейсы',
      hotels: 'Отели',
      more: 'Больше',
      customerSupport: 'Поддержка Клиентов',
      termsConditions: 'Условия и Положения',
      privacyPolicy: 'Политика Конфиденциальности',
      refundPolicy: 'Политика Возврата',
      sitemap: 'Карта Сайта',
      description1: 'Помогает найти самые дешевые предложения авиабилетов в любое место назначения с легкостью.',
      description2: 'Просматривайте лучшие отели и находите эксклюзивные предложения.',
      copyright: '© 2018-2025 AirlinesMap Inc. Все права защищены.'
    },
    flightSearch: {
      roundTrip: 'ТУДА И ОБРАТНО',
      oneWay: 'В ОДНУ СТОРОНУ',
      multiCity: 'МНОЖЕСТВЕННЫЕ ГОРОДА',
      from: 'Откуда',
      to: 'Куда',
      departure: 'Отправление',
      return: 'Возвращение',
      passengers: 'Пассажиры',
      adults: 'Взрослые',
      children: 'Дети',
      infants: 'Младенцы',
      search: 'Поиск',
      findFlights: 'Найти Рейсы',
      findFlightDeals: 'Найти предложения рейсов',
      cheapestFlights: 'Самые дешевые рейсы'
    },
    flightTabs: {
      onewayFlights: 'РЕЙСЫ В ОДНУ СТОРОНУ',
      lastMinute: 'ПОСЛЕДНЯЯ МИНУТА',
      cheapFlights: 'ДЕШЕВЫЕ РЕЙСЫ',
      bestFlights: 'ЛУЧШИЕ РЕЙСЫ',
      onewayDescription: 'Исследуйте самые дешевые рейсы в одну сторону из {from} в {to}, найденные ежедневно.',
      lastMinuteDescription: 'Найдите предложения рейсов в последнюю минуту из {from} в {to} для спонтанных путешественников.',
      cheapDescription: 'Откройте для себя самые доступные варианты рейсов из {from} в {to} с отличной ценой.',
      bestDescription: 'Просматривайте рейсы с лучшими оценками из {from} в {to} с оптимальным расписанием.'
    },
    pages: {
      aboutUs: {
        title: 'О нас - AirlinesMap',
        description: 'Узнайте больше о AirlinesMap, вашем надежном партнере для поиска лучших предложений авиабилетов и путешествий по всему миру.',
        heading: 'О AirlinesMap',
        content: 'Мы посвящены помощи путешественникам в поиске лучших предложений авиабилетов и путешествий. Наша платформа сравнивает цены различных авиакомпаний, чтобы обеспечить вам максимальную ценность за ваши деньги.'
      },
      termsAndConditions: {
        title: 'Условия и положения - AirlinesMap',
        description: 'Прочитайте наши условия и положения, чтобы понять правила и руководящие принципы использования платформы AirlinesMap.',
        heading: 'Условия и положения',
        content: 'Пожалуйста, внимательно прочитайте эти условия и положения перед использованием нашего сервиса. Используя AirlinesMap, вы соглашаетесь соблюдать эти условия.'
      },
      privacyPolicy: {
        title: 'Политика конфиденциальности - AirlinesMap',
        description: 'Узнайте, как AirlinesMap защищает вашу личную информацию и конфиденциальность при использовании нашей платформы бронирования путешествий.',
        heading: 'Политика конфиденциальности',
        content: 'Мы привержены защите вашей конфиденциальности и личной информации. Эта политика объясняет, как мы собираем, используем и защищаем ваши данные.'
      },
      refundPolicy: {
        title: 'Политика возврата - AirlinesMap',
        description: 'Поймите наши политики возврата и отмены для бронирований авиабилетов, сделанных через AirlinesMap.',
        heading: 'Политика возврата',
        content: 'Наша политика возврата описывает условия, при которых вы можете отменить или изменить ваши бронирования и получить возврат средств.'
      },
      contactUs: {
        title: 'Свяжитесь с нами - AirlinesMap',
        description: 'Свяжитесь со службой поддержки AirlinesMap для получения помощи с вашими бронированиями путешествий и запросами.',
        heading: 'Свяжитесь с нами',
        content: 'Мы здесь, чтобы помочь вам с любыми вопросами или проблемами, касающимися ваших бронирований путешествий. Обратитесь к нашей команде поддержки за помощью.'
      },
      contactInfo: {
        title: 'Контактная Информация',
        customerService: 'Служба Поддержки',
        bookingReservations: 'Бронирование и Резервации',
        baggageInformation: 'Информация о Багаже',
        corporateOffice: 'Корпоративный Офис',
        phone: 'Телефон',
        email: 'Электронная Почта',
        hours: 'Часы Работы',
        online: 'Онлайн',
        lostFound: 'Потерянные Вещи',
        headquarters: 'Штаб-квартира Авиакомпании',
        needHelp: 'Нужна Помощь? Свяжитесь с Нами Сейчас',
        customerServiceDesc: 'Наша команда службы поддержки доступна 24/7, чтобы помочь вам с бронированием, изменениями, отменами и любыми другими вопросами о вашем рейсе.'
      },
      airlines: {
        title: 'Авиакомпании - AirlinesMap',
        description: 'Просматривайте и сравнивайте рейсы основных авиакомпаний мира. Найдите лучшие предложения авиакомпаний для вашей следующей поездки.',
        heading: 'Авиакомпании'
      },
      hotels: {
        title: 'Отели - AirlinesMap',
        description: 'Найдите и забронируйте отели рядом с аэропортами и направлениями по всему миру. Сравнивайте цены и удобства.',
        heading: 'Отели'
      },
      search: {
        title: 'Результаты поиска - AirlinesMap',
        description: 'Результаты поиска рейсов и вариантов путешествий. Найдите лучшие предложения для вашей следующей поездки.',
        heading: 'Результаты поиска'
      },
      login: {
        title: 'Вход - AirlinesMap',
        description: 'Войдите в свой аккаунт AirlinesMap для управления вашими бронированиями и предпочтениями.',
        heading: 'Вход'
      },
      register: {
        title: 'Регистрация - AirlinesMap',
        description: 'Создайте новый аккаунт AirlinesMap, чтобы начать бронировать рейсы и управлять вашими предпочтениями путешествий.',
        heading: 'Создать аккаунт'
      },
      myAccount: {
        title: 'Мой аккаунт - AirlinesMap',
        description: 'Управляйте своим аккаунтом AirlinesMap, просматривайте бронирования и обновляйте ваши предпочтения путешествий.',
        heading: 'Мой аккаунт'
      }
    },
    common: {
      loading: 'Загрузка...',
      error: 'Ошибка',
      notFound: 'Не найдено',
      searchResults: 'Результаты поиска',
      findFlights: 'Найти рейсы',
      findHotels: 'Найти отели',
      bookNow: 'Забронировать сейчас',
      learnMore: 'Узнать больше',
      readMore: 'Читать далее',
      showMore: 'Показать больше',
      showLess: 'Показать меньше',
      close: 'Закрыть',
      cancel: 'Отмена',
      save: 'Сохранить',
      edit: 'Редактировать',
      delete: 'Удалить',
      confirm: 'Подтвердить',
      yes: 'Да',
      no: 'Нет',
      back: 'Назад',
      next: 'Далее',
      previous: 'Предыдущий',
      home: 'Главная',
      about: 'О нас',
      contact: 'Контакты',
      help: 'Помощь',
      support: 'Поддержка',
      refresh: 'Обновить Страницу'
    },
    flightPage: {
      pricePrediction: 'Прогноз цен Рейсы в {cityName}',
      roundTrip: 'Туда и обратно от:',
      oneWay: 'В одну сторону от:',
      oneWayFlight: 'Рейс в одну сторону из {from} {code} в {to}',
      cheapestDay: 'Самый дешевый день:',
      cheapestMonth: 'Самый дешевый месяц:',
      cheapestDayDesc: 'Самый дешевый день недели - {day} из {departureCity}. Максимальное падение цен на рейсы в {departureCity} в {day}.',
      cheapestMonthDesc: 'Самый дешевый месяц - {month} из {departureCity}. Максимальное падение цен на рейсы в {departureCity} в месяце {month}.',
      popularIn: 'Популярно в:',
      highestDemand: 'Наибольший спрос на рейсы в {cityName} в этом месяце. Забронируйте сейчас, чтобы получить лучшие цены.',
      priceTrends: 'Тенденции цен и анализ',
      weeklyTrends: 'Еженедельные тенденции цен',
      monthlyTrends: 'Ежемесячные тенденции цен',
      weatherClimateInfo: 'Информация о погоде и климате',
      weatherIn: 'Погода в',
      averageRainfallIn: 'Среднее количество осадков в',
      popularDestinations: 'Популярные направления',
      airlines: 'Авиакомпании',
      faqs: 'Часто задаваемые вопросы',
      availableFlights: 'Доступные рейсы',
      viewFlights: 'Посмотреть рейсы',
      from: 'От',
      flightsPerWeek: 'рейсов/неделя',
      airline: 'Авиакомпания:',
      avg: 'среднее',
      title: 'Рейсы {airlineName} из {departureCity} в {arrivalCity}',
      description: 'Спланируйте свое путешествие из {departureCity} в {arrivalCity} с лучшими предложениями, советами по путешествиям и информацией о рейсах {airlineName}.',
      bookingSteps: 'Как забронировать рейсы {airlineName}',
      cancellationPolicy: 'Политика отмены {airlineName}',
      classes: 'Классы обслуживания {airlineName}',
      destinationsOverview: 'Обзор направлений {airlineName}',
      placesToVisit: 'Места для посещения в {arrivalCity}',
      hotels: 'Отели в {arrivalCity}',
      cityInfo: 'Информация о городе',
      bestTimeVisit: 'Лучшее время для посещения {arrivalCity}',
      departureTerminal: 'Информация о терминале отправления',
      arrivalTerminal: 'Информация о терминале прибытия',
      terminalContact: 'Контактная информация терминала',
      stops: 'остановки',
      stop: 'остановка',
      totalDestinations: 'Всего направлений',
      flights: 'рейсы',
      to: 'в',
      findBest: 'Найдите лучшие',
      flightDeals: 'предложения рейсов',
      comparePricesBookTrip: 'Сравните цены, забронируйте следующую поездку',
      destinationsWorldwide: 'направления по всему миру',
      searchDeals: 'Поиск предложений',
      viewPopular: 'Смотреть популярное',
      findDeals: 'Найти предложения',
      roundTripFrom: 'Туда и обратно от:',
      oneWayFrom: 'В одну сторону от:',
      cheapestMonthLabel: 'Самый дешевый месяц:',
      cheapestDayLabel: 'Самый дешевый день:',
      cheapFlightDeals: 'Дешевые предложения рейсов {airlineName} из {departureCity} в {arrivalCity}',
      availableFlightsFrom: 'Доступные рейсы из {departureCity}',
      weatherDescriptionFallback: 'Спланируйте свой визит в {cityName} с текущими данными о температуре. {cityName} имеет разнообразную погоду в течение года, с температурами от мягких до теплых в зависимости от сезона.',
      weatherDescriptionDetailed: 'Спланируйте свой визит в {cityName} с подробной информацией о температуре. {cityName} имеет температуры от {minTemp}°F в {coolestMonth} до {maxTemp}°F в {warmestMonth}, со средним значением {avgTemp}°F. Лучшее время для посещения - это {bestMonths}, когда температуры наиболее комфортны для осмотра достопримечательностей и активного отдыха на свежем воздухе.',
      rainfallDescriptionFallback: 'Будьте готовы к поездке в {cityName} с текущими данными о дожде. {cityName} получает разнообразные осадки в течение года, с изменяющимися по сезонам схемами осадков.',
      rainfallDescriptionDetailed: 'Будьте готовы к поездке в {cityName} с подробной информацией об осадках. {cityName} получает осадки от {minRainfall} дюймов в {driestMonth} до {maxRainfall} дюймов в {wettestMonth}, со средним значением {avgRainfall} дюймов в год. Лучшее время для посещения - это {bestMonths}, когда осадки минимальны, обеспечивая ясное небо для исследования и осмотра достопримечательностей на свежем воздухе.',
      schemaProductName: 'Рейсы {airlineName} из {departureCity} в {arrivalCity}',
      schemaProductDescription: 'Найдите дешевые рейсы {airlineName} из {departureCity} в {arrivalCity}',
      schemaItemListName: 'Рейсы {airlineName} из {departureCity}{arrivalCity}',
      schemaItemListDescription: 'Доступные рейсы {airlineName} из {departureCity}{arrivalCity}',
      schemaFlightDescription: 'Рейс {airlineName} из {departureCity} в {arrivalCity}',
      schemaAirportName: 'Аэропорт {cityName}',
      popularDestinationsFrom: 'Популярные направления из {departureCity}',
      airlineDepartureTerminal: 'Терминал отправления {airlineName}',
      airlineArrivalTerminal: 'Терминал прибытия {airlineName}',
      airlinesContactAtTerminal: 'Контактная информация авиакомпаний в терминале {departureCity}',
      hotelsNear: 'Отели рядом с {departureCity}',
      aboutCity: 'О городе {arrivalCity}',
      departureInfo: 'Информация об отправлении',
      arrivalInfo: 'Информация о прибытии',
      terminalContactInfo: 'Контактная информация терминала',
      aboutThisRoute: 'Об этом маршруте',
      morePlacesToVisit: 'Больше мест для посещения',
      airlinesInfo: 'Информация об авиакомпаниях',
      weatherInfo: 'Информация о погоде',
      priceInfo: 'Информация о ценах',
      oneWayFlights: 'Рейсы в одну сторону',
      lastMinuteFlights: 'Рейсы последней минуты',
      cheapFlights: 'Дешевые рейсы',
      bestFlights: 'Лучшие рейсы'
    }
  },
  fr: {
    header: {
      airlines: 'Compagnies Aériennes',
      hotels: 'Hôtels',
      login: 'Connexion'
    },
    footer: {
      about: 'À propos',
      aboutUs: 'À propos de nous',
      androidApp: 'App Android',
      iosApp: 'App iOS',
      blog: 'Blog',
      explore: 'Explorer',
      flights: 'Vols',
      hotels: 'Hôtels',
      more: 'Plus',
      customerSupport: 'Support Client',
      termsConditions: 'Termes et Conditions',
      privacyPolicy: 'Politique de Confidentialité',
      refundPolicy: 'Politique de Remboursement',
      sitemap: 'Plan du Site',
      description1: 'Vous aide à trouver les meilleures offres de vols vers n\'importe quelle destination avec facilité.',
      description2: 'Parcourez les meilleurs hôtels et trouvez des offres exclusives.',
      copyright: '© 2018-2025 AirlinesMap Inc. Tous droits réservés.'
    },
    flightSearch: {
      roundTrip: 'ALLER-RETOUR',
      oneWay: 'ALLER SIMPLE',
      multiCity: 'MULTI-VILLES',
      from: 'De',
      to: 'Vers',
      departure: 'Départ',
      return: 'Retour',
      passengers: 'Passagers',
      adults: 'Adultes',
      children: 'Enfants',
      infants: 'Bébés',
      search: 'Rechercher',
      findFlights: 'Trouver des Vols',
      findFlightDeals: 'Trouver des offres de vols',
      cheapestFlights: 'Vols les moins chers'
    },
    flightTabs: {
      onewayFlights: 'VOLS ALLER SIMPLE',
      lastMinute: 'DERNIÈRE MINUTE',
      cheapFlights: 'VOLS BON MARCHÉ',
      bestFlights: 'MEILLEURS VOLS',
      onewayDescription: 'Explorez les vols aller simple les moins chers de {from} à {to} trouvés quotidiennement.',
      lastMinuteDescription: 'Trouvez des offres de vols de dernière minute de {from} à {to} pour les voyageurs spontanés.',
      cheapDescription: 'Découvrez les options de vol les plus abordables de {from} à {to} avec une excellente valeur.',
      bestDescription: 'Parcourez les vols les mieux notés de {from} à {to} avec des horaires optimaux.'
    },
    pages: {
      aboutUs: {
        title: 'À propos de nous - AirlinesMap',
        description: 'En savoir plus sur AirlinesMap, votre partenaire de confiance pour trouver les meilleures offres de vols et expériences de voyage dans le monde entier.',
        heading: 'À propos de AirlinesMap',
        content: 'Nous nous consacrons à aider les voyageurs à trouver les meilleures offres de vols et expériences de voyage. Notre plateforme compare les prix de plusieurs compagnies aériennes pour vous assurer d\'obtenir le meilleur rapport qualité-prix.'
      },
      termsAndConditions: {
        title: 'Termes et conditions - AirlinesMap',
        description: 'Lisez nos termes et conditions pour comprendre les règles et directives d\'utilisation de la plateforme AirlinesMap.',
        heading: 'Termes et conditions',
        content: 'Veuillez lire attentivement ces termes et conditions avant d\'utiliser notre service. En utilisant AirlinesMap, vous acceptez d\'être lié par ces termes.'
      },
      privacyPolicy: {
        title: 'Politique de confidentialité - AirlinesMap',
        description: 'Découvrez comment AirlinesMap protège vos informations personnelles et votre vie privée lors de l\'utilisation de notre plateforme de réservation de voyages.',
        heading: 'Politique de confidentialité',
        content: 'Nous nous engageons à protéger votre vie privée et vos informations personnelles. Cette politique explique comment nous collectons, utilisons et protégeons vos données.'
      },
      refundPolicy: {
        title: 'Politique de remboursement - AirlinesMap',
        description: 'Comprenez nos politiques de remboursement et d\'annulation pour les réservations de vols effectuées via AirlinesMap.',
        heading: 'Politique de remboursement',
        content: 'Notre politique de remboursement décrit les conditions dans lesquelles vous pouvez annuler ou modifier vos réservations et recevoir des remboursements.'
      },
      contactUs: {
        title: 'Contactez-nous - AirlinesMap',
        description: 'Contactez le support client de AirlinesMap pour obtenir de l\'aide avec vos réservations de voyage et vos demandes.',
        heading: 'Contactez-nous',
        content: 'Nous sommes là pour vous aider avec toute question ou préoccupation concernant vos réservations de voyage. Contactez notre équipe de support pour obtenir de l\'aide.'
      },
      contactInfo: {
        title: 'Informations de Contact',
        customerService: 'Service Client',
        bookingReservations: 'Réservations et Réservations',
        baggageInformation: 'Informations sur les Bagages',
        corporateOffice: 'Bureau Corporatif',
        phone: 'Téléphone',
        email: 'Email',
        hours: 'Heures',
        online: 'En Ligne',
        lostFound: 'Objets Trouvés',
        headquarters: 'Siège de la Compagnie Aérienne',
        needHelp: 'Besoin d\'Aide? Contactez-nous Maintenant',
        customerServiceDesc: 'Notre équipe de service client est disponible 24/7 pour vous aider avec les réservations, les modifications, les annulations et toute autre question concernant votre vol.'
      },
      airlines: {
        title: 'Compagnies aériennes - AirlinesMap',
        description: 'Parcourez et comparez les vols des principales compagnies aériennes du monde. Trouvez les meilleures offres de compagnies aériennes pour votre prochain voyage.',
        heading: 'Compagnies aériennes'
      },
      hotels: {
        title: 'Hôtels - AirlinesMap',
        description: 'Trouvez et réservez des hôtels près des aéroports et destinations du monde entier. Comparez les prix et les équipements.',
        heading: 'Hôtels'
      },
      search: {
        title: 'Résultats de recherche - AirlinesMap',
        description: 'Résultats de recherche pour les vols et options de voyage. Trouvez les meilleures offres pour votre prochain voyage.',
        heading: 'Résultats de recherche'
      },
      login: {
        title: 'Connexion - AirlinesMap',
        description: 'Connectez-vous à votre compte AirlinesMap pour gérer vos réservations et préférences.',
        heading: 'Connexion'
      },
      register: {
        title: 'S\'inscrire - AirlinesMap',
        description: 'Créez un nouveau compte AirlinesMap pour commencer à réserver des vols et gérer vos préférences de voyage.',
        heading: 'Créer un compte'
      },
      myAccount: {
        title: 'Mon compte - AirlinesMap',
        description: 'Gérez votre compte AirlinesMap, consultez vos réservations et mettez à jour vos préférences de voyage.',
        heading: 'Mon compte'
      }
    },
    common: {
      loading: 'Chargement...',
      error: 'Erreur',
      notFound: 'Non trouvé',
      searchResults: 'Résultats de recherche',
      findFlights: 'Trouver des vols',
      findHotels: 'Trouver des hôtels',
      bookNow: 'Réserver maintenant',
      learnMore: 'En savoir plus',
      readMore: 'Lire la suite',
      showMore: 'Afficher plus',
      showLess: 'Afficher moins',
      close: 'Fermer',
      cancel: 'Annuler',
      save: 'Enregistrer',
      edit: 'Modifier',
      delete: 'Supprimer',
      confirm: 'Confirmer',
      yes: 'Oui',
      no: 'Non',
      back: 'Retour',
      next: 'Suivant',
      previous: 'Précédent',
      home: 'Accueil',
      about: 'À propos',
      contact: 'Contact',
      help: 'Aide',
      support: 'Support',
      refresh: 'Actualiser la Page'
    },
    flightPage: {
      pricePrediction: 'Prédiction de prix Vols vers {cityName}',
      roundTrip: 'Aller-retour depuis:',
      oneWay: 'Aller simple depuis:',
      oneWayFlight: 'Vol aller simple de {from} {code} à {to}',
      cheapestDay: 'Jour le moins cher:',
      cheapestMonth: 'Mois le moins cher:',
      cheapestDayDesc: 'Le jour de la semaine le moins cher est {day} depuis {departureCity}. Baisse maximale des prix des vols vers {departureCity} le {day}.',
      cheapestMonthDesc: 'Le mois le moins cher est {month} depuis {departureCity}. Baisse maximale des prix des vols vers {departureCity} au mois de {month}.',
      popularIn: 'Populaire en:',
      highestDemand: 'Plus forte demande de vols vers {cityName} ce mois-ci. Réservez maintenant pour obtenir les meilleurs prix.',
      priceTrends: 'Tendances des Prix et Analyse',
      weeklyTrends: 'Tendances des Prix Hebdomadaires',
      monthlyTrends: 'Tendances des Prix Mensuelles',
      weatherClimateInfo: 'Informations Météorologiques et Climatiques',
      weatherIn: 'Météo à',
      averageRainfallIn: 'Pluviométrie Moyenne à',
      popularDestinations: 'Destinations Populaires',
      airlines: 'Compagnies Aériennes',
      faqs: 'Questions Fréquemment Posées',
      availableFlights: 'Vols Disponibles',
      viewFlights: 'Voir les Vols',
      from: 'De',
      flightsPerWeek: 'vols/semaine',
      airline: 'Compagnie:',
      avg: 'moyenne',
      title: 'Vols {airlineName} de {departureCity} à {arrivalCity}',
      description: 'Planifiez votre voyage de {departureCity} à {arrivalCity} avec les meilleures offres, conseils de voyage et informations de vol de {airlineName}.',
      bookingSteps: 'Comment Réserver des Vols {airlineName}',
      cancellationPolicy: 'Politique d\'Annulation {airlineName}',
      classes: 'Classes de Vol {airlineName}',
      destinationsOverview: 'Aperçu des Destinations {airlineName}',
      placesToVisit: 'Lieux à Visiter à {arrivalCity}',
      hotels: 'Hôtels à {arrivalCity}',
      cityInfo: 'Informations sur la Ville',
      bestTimeVisit: 'Meilleur Moment pour Visiter {arrivalCity}',
      departureTerminal: 'Informations sur le Terminal de Départ',
      arrivalTerminal: 'Informations sur le Terminal d\'Arrivée',
      terminalContact: 'Informations de Contact du Terminal',
      stops: 'escales',
      stop: 'escale',
      totalDestinations: 'Total des Destinations',
      flights: 'vols',
      to: 'à',
      findBest: 'Trouvez les meilleures',
      flightDeals: 'offres de vols',
      comparePricesBookTrip: 'Comparez les prix, réservez votre prochain voyage',
      destinationsWorldwide: 'destinations dans le monde entier',
      searchDeals: 'Rechercher des Offres',
      viewPopular: 'Voir Populaire',
      findDeals: 'Trouver des Offres',
      roundTripFrom: 'Aller-retour depuis:',
      oneWayFrom: 'Aller simple depuis:',
      cheapestMonthLabel: 'Mois le moins cher:',
      cheapestDayLabel: 'Jour le moins cher:',
      cheapFlightDeals: 'Offres de vols pas chers {airlineName} de {departureCity} à {arrivalCity}',
      availableFlightsFrom: 'Vols Disponibles depuis {departureCity}',
      weatherDescriptionFallback: 'Planifiez votre visite à {cityName} avec les données de température actuelles. {cityName} connaît un temps varié tout au long de l\'année, avec des températures allant de douces à chaudes selon la saison.',
      weatherDescriptionDetailed: 'Planifiez votre visite à {cityName} avec des informations détaillées sur la température. {cityName} connaît des températures allant de {minTemp}°F en {coolestMonth} à {maxTemp}°F en {warmestMonth}, avec une moyenne de {avgTemp}°F. Le meilleur moment pour visiter est pendant {bestMonths} lorsque les températures sont les plus confortables pour le tourisme et les activités de plein air.',
      rainfallDescriptionFallback: 'Préparez-vous pour votre voyage à {cityName} avec les données de pluie actuelles. {cityName} reçoit des précipitations variées tout au long de l\'année, avec des modèles de précipitation qui changent selon la saison.',
      rainfallDescriptionDetailed: 'Préparez-vous pour votre voyage à {cityName} avec des informations détaillées sur les précipitations. {cityName} reçoit des précipitations allant de {minRainfall} pouces en {driestMonth} à {maxRainfall} pouces en {wettestMonth}, avec une moyenne de {avgRainfall} pouces par an. Le meilleur moment pour visiter est pendant {bestMonths} lorsque les précipitations sont minimales, assurant un ciel dégagé pour l\'exploration et le tourisme de plein air.',
      schemaProductName: 'Vols {airlineName} de {departureCity} à {arrivalCity}',
      schemaProductDescription: 'Trouvez des vols pas chers {airlineName} de {departureCity} à {arrivalCity}',
      schemaItemListName: 'Vols {airlineName} de {departureCity}{arrivalCity}',
      schemaItemListDescription: 'Vols disponibles {airlineName} de {departureCity}{arrivalCity}',
      schemaFlightDescription: 'Vol {airlineName} de {departureCity} à {arrivalCity}',
      schemaAirportName: 'Aéroport de {cityName}',
      popularDestinationsFrom: 'Destinations Populaires depuis {departureCity}',
      airlineDepartureTerminal: 'Terminal de Départ de {airlineName}',
      airlineArrivalTerminal: 'Terminal d\'Arrivée de {airlineName}',
      airlinesContactAtTerminal: 'Informations de Contact des Compagnies Aériennes au Terminal de {departureCity}',
      hotelsNear: 'Hôtels près de {departureCity}',
      aboutCity: 'À propos de {arrivalCity}',
      departureInfo: 'Informations de Départ',
      arrivalInfo: 'Informations d\'Arrivée',
      terminalContactInfo: 'Informations de Contact du Terminal',
      aboutThisRoute: 'À propos de cette Route',
      morePlacesToVisit: 'Plus de Lieux à Visiter',
      airlinesInfo: 'Informations sur les Compagnies Aériennes',
      weatherInfo: 'Informations Météorologiques',
      priceInfo: 'Informations sur les Prix',
      oneWayFlights: 'Vols Aller Simple',
      lastMinuteFlights: 'Vols de Dernière Minute',
      cheapFlights: 'Vols Pas Chers',
      bestFlights: 'Meilleurs Vols'
    }
  }
};

export function getTranslations(locale: Locale): Translations {
  return translations[locale] || translations.en;
}

// Get language ID for API calls
export function getLanguageId(locale: Locale): 1 | 2 | 3 | 4 {
  switch (locale) {
    case 'en':
      return 1;
    case 'es':
      return 2;
    case 'ru':
      return 3;
    case 'fr':
      return 4;
    default:
      return 1; // Default to English
  }
}

// Get page translations for a specific page
export function getPageTranslations(locale: Locale, page: keyof Translations['pages']): any {
  const t = getTranslations(locale);
  return t.pages[page];
}

// Hook for client-side translations (requires locale context)
export function useTranslations(locale: Locale) {
  return getTranslations(locale);
}
