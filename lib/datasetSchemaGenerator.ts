import { Locale } from './i18n';

interface GraphData {
  name: string;
  value: number;
}

interface DatasetSchemaOptions {
  locale: Locale;
  airlineName: string;
  departureCity: string;
  arrivalCity: string;
  pageUrl: string;
  monthlyPriceData: GraphData[];
  monthlyWeatherData: GraphData[];
  monthlyRainfallData: GraphData[];
  weeklyPriceData: GraphData[];
}

/**
 * Generate dynamic Dataset schema for graphs with multi-language support
 */
export function generateDatasetSchema({
  locale,
  airlineName,
  departureCity,
  arrivalCity,
  pageUrl,
  monthlyPriceData,
  monthlyWeatherData,
  monthlyRainfallData,
  weeklyPriceData
}: DatasetSchemaOptions) {
  const currentYear = new Date().getFullYear();
  
  const translations = {
    en: {
      monthlyDataset: {
        name: `${airlineName} Monthly Flight Data (Prices, Rainfall, Temperature) — ${currentYear}`,
        description: `Monthly ${airlineName} flight prices (USD), rainfall (inches), and temperature (°F) data from ${departureCity} for ${currentYear}. Comprehensive dataset for flight price analysis and weather planning.`
      },
      weeklyDataset: {
        name: `${airlineName} Weekly Flight Price Data — ${currentYear}`,
        description: `Weekly ${airlineName} flight price trends (USD) from ${departureCity} for ${currentYear}. Data includes price fluctuations by day of the week for optimal booking timing.`
      },
      variables: {
        price: { name: "Flight Price", description: "Average flight price", unitText: "USD" },
        rainfall: { name: "Rainfall", description: "Monthly rainfall amount", unitText: "inches" },
        temperature: { name: "Temperature", description: "Average temperature", unitText: "°F" }
      },
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    },
    es: {
      monthlyDataset: {
        name: `Datos Mensuales de Vuelos ${airlineName} (Precios, Lluvia, Temperatura) — ${currentYear}`,
        description: `Datos mensuales de precios de vuelos ${airlineName} (USD), lluvia (pulgadas) y temperatura (°F) desde ${departureCity} para ${currentYear}. Conjunto de datos completo para análisis de precios de vuelos y planificación meteorológica.`
      },
      weeklyDataset: {
        name: `Datos Semanales de Precios de Vuelos ${airlineName} — ${currentYear}`,
        description: `Tendencias de precios de vuelos ${airlineName} semanales (USD) desde ${departureCity} para ${currentYear}. Los datos incluyen fluctuaciones de precios por día de la semana para el momento óptimo de reserva.`
      },
      variables: {
        price: { name: "Precio de Vuelo", description: "Precio promedio de vuelo", unitText: "USD" },
        rainfall: { name: "Lluvia", description: "Cantidad de lluvia mensual", unitText: "pulgadas" },
        temperature: { name: "Temperatura", description: "Temperatura promedio", unitText: "°F" }
      },
      months: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
      days: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
    },
    ru: {
      monthlyDataset: {
        name: `Ежемесячные данные о рейсах ${airlineName} (Цены, Осадки, Температура) — ${currentYear}`,
        description: `Ежемесячные данные о ценах на рейсы ${airlineName} (USD), осадках (дюймы) и температуре (°F) из ${departureCity} за ${currentYear}. Полный набор данных для анализа цен на рейсы и планирования погоды.`
      },
      weeklyDataset: {
        name: `Еженедельные данные о ценах на рейсы ${airlineName} — ${currentYear}`,
        description: `Еженедельные тенденции цен на рейсы ${airlineName} (USD) из ${departureCity} за ${currentYear}. Данные включают колебания цен по дням недели для оптимального времени бронирования.`
      },
      variables: {
        price: { name: "Цена Рейса", description: "Средняя цена рейса", unitText: "USD" },
        rainfall: { name: "Осадки", description: "Количество месячных осадков", unitText: "дюймы" },
        temperature: { name: "Температура", description: "Средняя температура", unitText: "°F" }
      },
      months: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
      days: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
    },
    fr: {
      monthlyDataset: {
        name: `Données Mensuelles de Vols ${airlineName} (Prix, Pluie, Température) — ${currentYear}`,
        description: `Données mensuelles des prix de vols ${airlineName} (USD), pluie (pouces) et température (°F) depuis ${departureCity} pour ${currentYear}. Ensemble de données complet pour l'analyse des prix de vols et la planification météorologique.`
      },
      weeklyDataset: {
        name: `Données Hebdomadaires de Prix de Vols ${airlineName} — ${currentYear}`,
        description: `Tendances des prix de vols ${airlineName} hebdomadaires (USD) depuis ${departureCity} pour ${currentYear}. Les données incluent les fluctuations de prix par jour de la semaine pour le moment optimal de réservation.`
      },
      variables: {
        price: { name: "Prix de Vol", description: "Prix moyen de vol", unitText: "USD" },
        rainfall: { name: "Pluie", description: "Quantité de pluie mensuelle", unitText: "pouces" },
        temperature: { name: "Température", description: "Température moyenne", unitText: "°F" }
      },
      months: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"],
      days: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
    }
  };

  const t = translations[locale] || translations.en;

  // Generate monthly dataset schema
  const monthlyDatasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": t.monthlyDataset.name,
    "description": t.monthlyDataset.description,
    "url": pageUrl,
    "creator": {
      "@type": "Organization",
      "name": "Airlinesmap.com",
      "url": "https://airlinesmap.com"
    },
    "license": "https://creativecommons.org/licenses/by/4.0/",
    "variableMeasured": [
      { 
        "@type": "PropertyValue", 
        "name": "price", 
        "description": t.variables.price.description, 
        "unitText": t.variables.price.unitText 
      },
      { 
        "@type": "PropertyValue", 
        "name": "rainfall", 
        "description": t.variables.rainfall.description, 
        "unitText": t.variables.rainfall.unitText 
      },
      { 
        "@type": "PropertyValue", 
        "name": "temperature", 
        "description": t.variables.temperature.description, 
        "unitText": t.variables.temperature.unitText 
      }
    ],
    "itemListElement": generateMonthlyDataItems(monthlyPriceData, monthlyWeatherData, monthlyRainfallData, t.months)
  };

  // Generate weekly dataset schema
  const weeklyDatasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": t.weeklyDataset.name,
    "description": t.weeklyDataset.description,
    "url": pageUrl,
    "creator": {
      "@type": "Organization",
      "name": "Airlinesmap.com",
      "url": "https://airlinesmap.com"
    },
    "license": "https://creativecommons.org/licenses/by/4.0/",
    "variableMeasured": [
      { 
        "@type": "PropertyValue", 
        "name": "price", 
        "description": t.variables.price.description, 
        "unitText": t.variables.price.unitText 
      }
    ],
    "itemListElement": generateWeeklyDataItems(weeklyPriceData, t.days)
  };

  return {
    monthly: monthlyDatasetSchema,
    weekly: weeklyDatasetSchema
  };
}

/**
 * Generate monthly data items for schema
 */
function generateMonthlyDataItems(
  priceData: GraphData[], 
  weatherData: GraphData[], 
  rainfallData: GraphData[], 
  monthNames: string[]
) {
  const items = [];
  const currentYear = new Date().getFullYear();
  
  for (let i = 0; i < 12; i++) {
    const monthName = monthNames[i];
    const priceValue = priceData[i]?.value || 0;
    const weatherValue = weatherData[i]?.value || 0;
    const rainfallValue = rainfallData[i]?.value || 0;
    
    items.push({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "name": `${monthName} ${currentYear}`,
        "additionalProperty": [
          { 
            "@type": "PropertyValue", 
            "name": "price", 
            "value": Math.round(priceValue), 
            "unitText": "USD" 
          },
          { 
            "@type": "PropertyValue", 
            "name": "rainfall", 
            "value": Math.round(rainfallValue * 10) / 10, 
            "unitText": "inches" 
          },
          { 
            "@type": "PropertyValue", 
            "name": "temperature", 
            "value": Math.round(weatherValue * 10) / 10, 
            "unitText": "°F" 
          }
        ]
      }
    });
  }
  
  return items;
}

/**
 * Generate weekly data items for schema
 */
function generateWeeklyDataItems(priceData: GraphData[], dayNames: string[]) {
  const items = [];
  
  for (let i = 0; i < priceData.length && i < dayNames.length; i++) {
    const dayName = dayNames[i];
    const priceValue = priceData[i]?.value || 0;
    
    items.push({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "name": `${dayName}`,
        "additionalProperty": [
          { 
            "@type": "PropertyValue", 
            "name": "price", 
            "value": Math.round(priceValue), 
            "unitText": "USD" 
          }
        ]
      }
    });
  }
  
  return items;
}

/**
 * Generate combined dataset schema for all graphs
 */
export function generateCombinedDatasetSchema(options: DatasetSchemaOptions) {
  const { monthly, weekly } = generateDatasetSchema(options);
  
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": monthly.name,
    "description": monthly.description,
    "url": options.pageUrl,
    "creator": monthly.creator,
    "license": monthly.license,
    "variableMeasured": monthly.variableMeasured,
    "itemListElement": [
      ...monthly.itemListElement,
      ...weekly.itemListElement.map((item: any, index: number) => ({
        ...item,
        "position": monthly.itemListElement.length + index + 1
      }))
    ]
  };
}

