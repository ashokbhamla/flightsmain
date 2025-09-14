/**
 * Routes data processing and analysis utilities
 */

export interface Route {
  departure_city: string;
  arrival_city: string;
  departure_country: string;
  arrival_country: string;
  departure_iata: string;
  arrival_iata: string;
}

export interface RouteWithMetadata extends Route {
  distance?: number;
  popularity?: number;
  isDomestic?: boolean;
  isInternational?: boolean;
  region?: string;
}

export interface AirportData {
  iata: string;
  city: string;
  country: string;
  countryCode: string;
  latitude?: number;
  longitude?: number;
  routeCount: number;
  domesticRoutes: number;
  internationalRoutes: number;
}

export interface LocationBasedRoutes {
  userLocation: {
    city: string;
    country: string;
    countryCode: string;
    iata?: string;
  };
  availableRoutes: RouteWithMetadata[];
  popularDomesticRoutes: RouteWithMetadata[];
  popularInternationalRoutes: RouteWithMetadata[];
  nearbyAirports: AirportData[];
  trendingDestinations: {
    city: string;
    country: string;
    iata: string;
    routeCount: number;
    popularity: number;
  }[];
}

/**
 * Load routes data from JSON file
 * In production, this would be loaded from a database or API
 */
let routesData: Route[] = [];

export async function loadRoutesData(): Promise<Route[]> {
  if (routesData.length > 0) {
    return routesData;
  }

  try {
    // Load sample routes data for development
    const response = await fetch('/sample-routes.json');
    
    if (!response.ok) {
      throw new Error('Failed to load routes data');
    }
    
    const data = await response.json();
    routesData = data || [];
    return routesData;
  } catch (error) {
    console.error('Error loading routes data:', error);
    // Return empty array as fallback
    return [];
  }
}

/**
 * Load routes data on server side (for API routes)
 * This function is only used in API routes where Node.js fs is available
 */
export async function loadRoutesDataServer(): Promise<Route[]> {
  try {
    // For API routes, we'll use the same client-side approach
    // In production, this would load from a database
    return await loadRoutesData();
  } catch (error) {
    console.error('Error loading routes data on server:', error);
    return [];
  }
}

/**
 * Get routes from a specific city
 */
export function getRoutesFromCity(
  routes: Route[], 
  city: string, 
  countryCode?: string
): Route[] {
  return routes.filter(route => {
    const cityMatch = route.departure_city.toLowerCase() === city.toLowerCase();
    const countryMatch = !countryCode || route.departure_country === countryCode;
    return cityMatch && countryMatch;
  });
}

/**
 * Get routes to a specific city
 */
export function getRoutesToCity(
  routes: Route[], 
  city: string, 
  countryCode?: string
): Route[] {
  return routes.filter(route => {
    const cityMatch = route.arrival_city.toLowerCase() === city.toLowerCase();
    const countryMatch = !countryCode || route.arrival_country === countryCode;
    return cityMatch && countryMatch;
  });
}

/**
 * Find routes between two cities
 */
export function findRoutesBetweenCities(
  routes: Route[],
  fromCity: string,
  toCity: string,
  fromCountry?: string,
  toCountry?: string
): Route[] {
  return routes.filter(route => {
    const fromMatch = route.departure_city.toLowerCase() === fromCity.toLowerCase();
    const toMatch = route.arrival_city.toLowerCase() === toCity.toLowerCase();
    const fromCountryMatch = !fromCountry || route.departure_country === fromCountry;
    const toCountryMatch = !toCountry || route.arrival_country === toCountry;
    
    return fromMatch && toMatch && fromCountryMatch && toCountryMatch;
  });
}

/**
 * Get all unique airports from routes data
 */
export function extractAirportsFromRoutes(routes: Route[]): AirportData[] {
  const airportMap = new Map<string, AirportData>();
  
  routes.forEach(route => {
    // Process departure airport
    const depKey = route.departure_iata;
    if (!airportMap.has(depKey)) {
      airportMap.set(depKey, {
        iata: route.departure_iata,
        city: route.departure_city,
        country: route.departure_country,
        countryCode: route.departure_country,
        routeCount: 0,
        domesticRoutes: 0,
        internationalRoutes: 0
      });
    }
    
    const depAirport = airportMap.get(depKey)!;
    depAirport.routeCount++;
    
    if (route.departure_country === route.arrival_country) {
      depAirport.domesticRoutes++;
    } else {
      depAirport.internationalRoutes++;
    }
    
    // Process arrival airport
    const arrKey = route.arrival_iata;
    if (!airportMap.has(arrKey)) {
      airportMap.set(arrKey, {
        iata: route.arrival_iata,
        city: route.arrival_city,
        country: route.arrival_country,
        countryCode: route.arrival_country,
        routeCount: 0,
        domesticRoutes: 0,
        internationalRoutes: 0
      });
    }
    
    const arrAirport = airportMap.get(arrKey)!;
    arrAirport.routeCount++;
    
    if (route.departure_country === route.arrival_country) {
      arrAirport.domesticRoutes++;
    } else {
      arrAirport.internationalRoutes++;
    }
  });
  
  return Array.from(airportMap.values());
}

/**
 * Find airports near a city (by name matching)
 */
export function findAirportsNearCity(
  airports: AirportData[],
  cityName: string,
  countryCode?: string
): AirportData[] {
  return airports.filter(airport => {
    const cityMatch = airport.city.toLowerCase().includes(cityName.toLowerCase()) ||
                     cityName.toLowerCase().includes(airport.city.toLowerCase());
    const countryMatch = !countryCode || airport.countryCode === countryCode;
    return cityMatch && countryMatch;
  });
}

/**
 * Get popular destinations from a city
 */
export function getPopularDestinationsFromCity(
  routes: Route[],
  city: string,
  countryCode?: string,
  limit: number = 10
): { city: string; country: string; iata: string; routeCount: number; popularity: number }[] {
  const cityRoutes = getRoutesFromCity(routes, city, countryCode);
  const destinationCounts = new Map<string, { city: string; country: string; iata: string; routeCount: number }>();
  
  cityRoutes.forEach(route => {
    const key = `${route.arrival_city}-${route.arrival_country}`;
    if (!destinationCounts.has(key)) {
      destinationCounts.set(key, {
        city: route.arrival_city,
        country: route.arrival_country,
        iata: route.arrival_iata,
        routeCount: 0
      });
    }
    destinationCounts.get(key)!.routeCount++;
  });
  
  const destinations = Array.from(destinationCounts.values())
    .map(dest => ({
      city: dest.city,
      country: dest.country,
      iata: dest.iata,
      routeCount: dest.routeCount,
      popularity: dest.routeCount / cityRoutes.length
    }))
    .sort((a, b) => b.routeCount - a.routeCount)
    .slice(0, limit);
  
  return destinations;
}

/**
 * Categorize routes as domestic or international
 */
export function categorizeRoutes(routes: Route[]): {
  domestic: Route[];
  international: Route[];
} {
  const domestic: Route[] = [];
  const international: Route[] = [];
  
  routes.forEach(route => {
    if (route.departure_country === route.arrival_country) {
      domestic.push(route);
    } else {
      international.push(route);
    }
  });
  
  return { domestic, international };
}

/**
 * Get route statistics for a city
 */
export function getRouteStatistics(
  routes: Route[],
  city: string,
  countryCode?: string
): {
  totalRoutes: number;
  domesticRoutes: number;
  internationalRoutes: number;
  uniqueDestinations: number;
  countriesServed: number;
} {
  const cityRoutes = getRoutesFromCity(routes, city, countryCode);
  const { domestic, international } = categorizeRoutes(cityRoutes);
  
  const uniqueDestinations = new Set(cityRoutes.map(r => r.arrival_city)).size;
  const countriesServed = new Set(cityRoutes.map(r => r.arrival_country)).size;
  
  return {
    totalRoutes: cityRoutes.length,
    domesticRoutes: domestic.length,
    internationalRoutes: international.length,
    uniqueDestinations,
    countriesServed
  };
}

/**
 * Search routes by partial city name
 */
export function searchRoutesByCity(
  routes: Route[],
  searchTerm: string,
  type: 'departure' | 'arrival' | 'both' = 'both'
): Route[] {
  const term = searchTerm.toLowerCase();
  
  return routes.filter(route => {
    if (type === 'departure' || type === 'both') {
      if (route.departure_city.toLowerCase().includes(term)) return true;
    }
    if (type === 'arrival' || type === 'both') {
      if (route.arrival_city.toLowerCase().includes(term)) return true;
    }
    return false;
  });
}

/**
 * Get routes by country
 */
export function getRoutesByCountry(
  routes: Route[],
  countryCode: string,
  type: 'departure' | 'arrival' | 'both' = 'both'
): Route[] {
  return routes.filter(route => {
    if (type === 'departure' || type === 'both') {
      if (route.departure_country === countryCode) return true;
    }
    if (type === 'arrival' || type === 'both') {
      if (route.arrival_country === countryCode) return true;
    }
    return false;
  });
}
