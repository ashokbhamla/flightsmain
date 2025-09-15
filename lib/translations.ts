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
    popularIn: string;
    highestDemand: string;
    priceTrends: string;
    weeklyTrends: string;
    monthlyTrends: string;
    popularDestinations: string;
    airlines: string;
    faqs: string;
    availableFlights: string;
    viewFlights: string;
    from: string;
    flightsPerWeek: string;
    airline: string;
    avg: string;
    stops: string;
    stop: string;
    totalDestinations: string;
    flights: string;
    to: string;
    findBest: string;
    flightDeals: string;
    comparePricesBookTrip: string;
    destinationsWorldwide: string;
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
      popularIn: 'Popular In:',
      highestDemand: 'Highest demand for flights to {cityName} this month. Book now to get the best prices.',
      priceTrends: 'Price Trends & Analysis',
      weeklyTrends: 'Weekly Price Trends',
      monthlyTrends: 'Monthly Price Trends',
      popularDestinations: 'Popular Destinations',
      airlines: 'Airlines',
      faqs: 'Frequently Asked Questions',
      availableFlights: 'Available Flights',
      viewFlights: 'View Flights',
      from: 'From',
      flightsPerWeek: 'flights/week',
      airline: 'Airline:',
      avg: 'avg',
      stops: 'stops',
      stop: 'stop',
      totalDestinations: 'Total Destinations',
      flights: 'flights',
      to: 'to',
      findBest: 'Find the best',
      flightDeals: 'flight deals',
      comparePricesBookTrip: 'Compare prices, book your next trip',
      destinationsWorldwide: 'destinations worldwide'
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
      popularIn: 'Popular en:',
      highestDemand: 'Mayor demanda de vuelos a {cityName} este mes. Reserva ahora para obtener los mejores precios.',
      priceTrends: 'Tendencias de Precios y Análisis',
      weeklyTrends: 'Tendencias de Precios Semanales',
      monthlyTrends: 'Tendencias de Precios Mensuales',
      popularDestinations: 'Destinos Populares',
      airlines: 'Aerolíneas',
      faqs: 'Preguntas Frecuentes',
      availableFlights: 'Vuelos Disponibles',
      viewFlights: 'Ver Vuelos',
      from: 'Desde',
      flightsPerWeek: 'vuelos/semana',
      airline: 'Aerolínea:',
      avg: 'promedio',
      stops: 'escalas',
      stop: 'escala',
      totalDestinations: 'Total de Destinos',
      flights: 'vuelos',
      to: 'a',
      findBest: 'Encuentra las mejores',
      flightDeals: 'ofertas de vuelos',
      comparePricesBookTrip: 'Compara precios, reserva tu próximo viaje',
      destinationsWorldwide: 'destinos en todo el mundo'
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
      popularIn: 'Популярно в:',
      highestDemand: 'Наибольший спрос на рейсы в {cityName} в этом месяце. Забронируйте сейчас, чтобы получить лучшие цены.',
      priceTrends: 'Тенденции цен и анализ',
      weeklyTrends: 'Еженедельные тенденции цен',
      monthlyTrends: 'Ежемесячные тенденции цен',
      popularDestinations: 'Популярные направления',
      airlines: 'Авиакомпании',
      faqs: 'Часто задаваемые вопросы',
      availableFlights: 'Доступные рейсы',
      viewFlights: 'Посмотреть рейсы',
      from: 'От',
      flightsPerWeek: 'рейсов/неделя',
      airline: 'Авиакомпания:',
      avg: 'среднее',
      stops: 'остановки',
      stop: 'остановка',
      totalDestinations: 'Всего направлений',
      flights: 'рейсы',
      to: 'в',
      findBest: 'Найдите лучшие',
      flightDeals: 'предложения рейсов',
      comparePricesBookTrip: 'Сравните цены, забронируйте следующую поездку',
      destinationsWorldwide: 'направления по всему миру'
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
      popularIn: 'Populaire en:',
      highestDemand: 'Plus forte demande de vols vers {cityName} ce mois-ci. Réservez maintenant pour obtenir les meilleurs prix.',
      priceTrends: 'Tendances des Prix et Analyse',
      weeklyTrends: 'Tendances des Prix Hebdomadaires',
      monthlyTrends: 'Tendances des Prix Mensuelles',
      popularDestinations: 'Destinations Populaires',
      airlines: 'Compagnies Aériennes',
      faqs: 'Questions Fréquemment Posées',
      availableFlights: 'Vols Disponibles',
      viewFlights: 'Voir les Vols',
      from: 'De',
      flightsPerWeek: 'vols/semaine',
      airline: 'Compagnie:',
      avg: 'moyenne',
      stops: 'escales',
      stop: 'escale',
      totalDestinations: 'Total des Destinations',
      flights: 'vols',
      to: 'à',
      findBest: 'Trouvez les meilleures',
      flightDeals: 'offres de vols',
      comparePricesBookTrip: 'Comparez les prix, réservez votre prochain voyage',
      destinationsWorldwide: 'destinations dans le monde entier'
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
export function getPageTranslations(locale: Locale, page: keyof Translations['pages']) {
  const t = getTranslations(locale);
  return t.pages[page];
}

// Hook for client-side translations (requires locale context)
export function useTranslations(locale: Locale) {
  return getTranslations(locale);
}
