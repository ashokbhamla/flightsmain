/**
 * Location-based route recommendations using real routes data
 */

import { Route, RouteWithMetadata, LocationBasedRoutes } from './routes-data';
import { UserLocation } from './geoip';
import { loadRoutesData, getRoutesFromCity, getPopularDestinationsFromCity, extractAirportsFromRoutes, findAirportsNearCity, categorizeRoutes } from './routes-data';

/**
 * Generate location-based route recommendations
 */
export async function generateLocationBasedRoutes(
  userLocation: UserLocation
): Promise<LocationBasedRoutes> {
  try {
    // Validate userLocation
    if (!userLocation || !userLocation.city) {
      console.log('Invalid userLocation, using default location');
      const defaultLocation: UserLocation = {
        country: 'United States',
        countryCode: 'US',
        region: 'New York',
        regionCode: 'NY',
        city: 'New York',
        latitude: 40.7128,
        longitude: -74.0060,
        timezone: 'America/New_York'
      };
      return getDefaultLocationRoutes(defaultLocation);
    }

    // Load routes data
    const routes = await loadRoutesData();
    
    if (!routes || routes.length === 0) {
      console.log('No routes data available, using default routes');
      return getDefaultLocationRoutes(userLocation);
    }
    
    // Find airports near user location
    const airports = extractAirportsFromRoutes(routes);
    const nearbyAirports = findAirportsNearCity(airports, userLocation.city, userLocation.countryCode);
    
    // Get all routes from user's city
    const cityRoutes = getRoutesFromCity(routes, userLocation.city, userLocation.countryCode);
    
    // Categorize routes
    const { domestic, international } = categorizeRoutes(cityRoutes);
    
    // Get popular destinations
    const popularDestinations = getPopularDestinationsFromCity(routes, userLocation.city, userLocation.countryCode, 20);
    
    // Add metadata to routes
    const routesWithMetadata: RouteWithMetadata[] = cityRoutes.map(route => {
      if (!route) return null;
      return {
        ...route,
        isDomestic: route.departure_country === route.arrival_country,
        isInternational: route.departure_country !== route.arrival_country,
        popularity: calculateRoutePopularity(route, cityRoutes)
      };
    }).filter(Boolean) as RouteWithMetadata[];
    
    // Sort by popularity
    const popularDomesticRoutes = domestic
      .filter(route => route) // Filter out null/undefined routes
      .map(route => ({
        ...route,
        isDomestic: true,
        isInternational: false,
        popularity: calculateRoutePopularity(route, cityRoutes)
      }))
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 10);
    
    const popularInternationalRoutes = international
      .filter(route => route) // Filter out null/undefined routes
      .map(route => ({
        ...route,
        isDomestic: false,
        isInternational: true,
        popularity: calculateRoutePopularity(route, cityRoutes)
      }))
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 10);
    
    return {
      userLocation: {
        city: userLocation.city,
        country: userLocation.country,
        countryCode: userLocation.countryCode,
        iata: nearbyAirports[0]?.iata
      },
      availableRoutes: routesWithMetadata,
      popularDomesticRoutes,
      popularInternationalRoutes,
      nearbyAirports: nearbyAirports.slice(0, 5),
      trendingDestinations: popularDestinations
    };
  } catch (error) {
    console.error('Error generating location-based routes:', error);
    return getDefaultLocationRoutes(userLocation);
  }
}

/**
 * Calculate route popularity based on frequency and patterns
 */
function calculateRoutePopularity(route: Route, allRoutes: Route[]): number {
  // Safety checks
  if (!route || !allRoutes || !Array.isArray(allRoutes) || allRoutes.length === 0) {
    return 0;
  }
  
  // Count how many times this route appears
  const routeCount = allRoutes.filter(r => 
    r && r.departure_city === route.departure_city &&
    r.arrival_city === route.arrival_city
  ).length;
  
  // Calculate popularity as percentage of total routes from this city
  return routeCount / allRoutes.length;
}

/**
 * Get route recommendations for a specific search
 */
export async function getRouteRecommendations(
  fromCity: string,
  toCity: string,
  fromCountry?: string,
  toCountry?: string
): Promise<Route[]> {
  try {
    const routes = await loadRoutesData();
    
    // Find direct routes
    const directRoutes = routes.filter(route => 
      route.departure_city.toLowerCase() === fromCity.toLowerCase() &&
      route.arrival_city.toLowerCase() === toCity.toLowerCase() &&
      (!fromCountry || route.departure_country === fromCountry) &&
      (!toCountry || route.arrival_country === toCountry)
    );
    
    return directRoutes;
  } catch (error) {
    console.error('Error getting route recommendations:', error);
    return [];
  }
}

/**
 * Search for alternative routes (connecting flights)
 */
export async function findAlternativeRoutes(
  fromCity: string,
  toCity: string,
  fromCountry?: string,
  toCountry?: string
): Promise<{
  directRoutes: Route[];
  oneStopRoutes: Route[][];
  twoStopRoutes: Route[][];
}> {
  try {
    const routes = await loadRoutesData();
    
    // Find direct routes
    const directRoutes = routes.filter(route => 
      route.departure_city.toLowerCase() === fromCity.toLowerCase() &&
      route.arrival_city.toLowerCase() === toCity.toLowerCase() &&
      (!fromCountry || route.departure_country === fromCountry) &&
      (!toCountry || route.arrival_country === toCountry)
    );
    
    // Find one-stop routes
    const oneStopRoutes: Route[][] = [];
    const fromRoutes = routes.filter(route => 
      route.departure_city.toLowerCase() === fromCity.toLowerCase() &&
      (!fromCountry || route.departure_country === fromCountry)
    );
    
    fromRoutes.forEach(firstLeg => {
      const secondLeg = routes.find(route => 
        route.departure_city === firstLeg.arrival_city &&
        route.arrival_city.toLowerCase() === toCity.toLowerCase() &&
        (!toCountry || route.arrival_country === toCountry)
      );
      
      if (secondLeg) {
        oneStopRoutes.push([firstLeg, secondLeg]);
      }
    });
    
    // Limit results to prevent overwhelming response
    return {
      directRoutes,
      oneStopRoutes: oneStopRoutes.slice(0, 20),
      twoStopRoutes: [] // Could be implemented for more complex routing
    };
  } catch (error) {
    console.error('Error finding alternative routes:', error);
    return { directRoutes: [], oneStopRoutes: [], twoStopRoutes: [] };
  }
}

/**
 * Get trending routes from user location
 */
export async function getTrendingRoutesFromLocation(
  userLocation: UserLocation,
  limit: number = 10
): Promise<RouteWithMetadata[]> {
  try {
    const routes = await loadRoutesData();
    const cityRoutes = getRoutesFromCity(routes, userLocation.city, userLocation.countryCode);
    
    // Group routes by destination and count frequency
    const destinationCounts = new Map<string, { route: Route; count: number }>();
    
    cityRoutes.forEach(route => {
      const key = `${route.arrival_city}-${route.arrival_country}`;
      if (!destinationCounts.has(key)) {
        destinationCounts.set(key, { route, count: 0 });
      }
      destinationCounts.get(key)!.count++;
    });
    
    // Convert to array and sort by frequency
    const trendingRoutes = Array.from(destinationCounts.values())
      .map(({ route, count }) => ({
        ...route,
        popularity: count / cityRoutes.length,
        isDomestic: route.departure_country === route.arrival_country,
        isInternational: route.departure_country !== route.arrival_country
      }))
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, limit);
    
    return trendingRoutes;
  } catch (error) {
    console.error('Error getting trending routes:', error);
    return [];
  }
}

/**
 * Get international routes from user location
 */
export async function getInternationalRoutesFromLocation(
  userLocation: UserLocation,
  limit: number = 10
): Promise<RouteWithMetadata[]> {
  try {
    const routes = await loadRoutesData();
    const cityRoutes = getRoutesFromCity(routes, userLocation.city, userLocation.countryCode);
    
    // Filter international routes only
    const internationalRoutes = cityRoutes
      .filter(route => route.departure_country !== route.arrival_country)
      .map(route => ({
        ...route,
        isDomestic: false,
        isInternational: true,
        popularity: calculateRoutePopularity(route, cityRoutes)
      }))
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, limit);
    
    return internationalRoutes;
  } catch (error) {
    console.error('Error getting international routes:', error);
    return [];
  }
}

/**
 * Get domestic routes from user location
 */
export async function getDomesticRoutesFromLocation(
  userLocation: UserLocation,
  limit: number = 10
): Promise<RouteWithMetadata[]> {
  try {
    const routes = await loadRoutesData();
    const cityRoutes = getRoutesFromCity(routes, userLocation.city, userLocation.countryCode);
    
    // Filter domestic routes only
    const domesticRoutes = cityRoutes
      .filter(route => route.departure_country === route.arrival_country)
      .map(route => ({
        ...route,
        isDomestic: true,
        isInternational: false,
        popularity: calculateRoutePopularity(route, cityRoutes)
      }))
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, limit);
    
    return domesticRoutes;
  } catch (error) {
    console.error('Error getting domestic routes:', error);
    return [];
  }
}

/**
 * Search routes by destination country
 */
export async function getRoutesByDestinationCountry(
  userLocation: UserLocation,
  destinationCountry: string,
  limit: number = 10
): Promise<RouteWithMetadata[]> {
  try {
    const routes = await loadRoutesData();
    const cityRoutes = getRoutesFromCity(routes, userLocation.city, userLocation.countryCode);
    
    const countryRoutes = cityRoutes
      .filter(route => route.arrival_country === destinationCountry)
      .map(route => ({
        ...route,
        isDomestic: route.departure_country === route.arrival_country,
        isInternational: route.departure_country !== route.arrival_country,
        popularity: calculateRoutePopularity(route, cityRoutes)
      }))
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, limit);
    
    return countryRoutes;
  } catch (error) {
    console.error('Error getting routes by destination country:', error);
    return [];
  }
}

/**
 * Get default location routes when real data is not available
 */
function getDefaultLocationRoutes(userLocation: UserLocation): LocationBasedRoutes {
  // Default sample routes based on common destinations
  const defaultRoutes: Route[] = [
    {
      departure_city: userLocation.city,
      arrival_city: 'New York',
      departure_country: userLocation.countryCode,
      arrival_country: 'US',
      departure_iata: 'XXX',
      arrival_iata: 'JFK'
    },
    {
      departure_city: userLocation.city,
      arrival_city: 'Los Angeles',
      departure_country: userLocation.countryCode,
      arrival_country: 'US',
      departure_iata: 'XXX',
      arrival_iata: 'LAX'
    },
    {
      departure_city: userLocation.city,
      arrival_city: 'London',
      departure_country: userLocation.countryCode,
      arrival_country: 'GB',
      departure_iata: 'XXX',
      arrival_iata: 'LHR'
    },
    {
      departure_city: userLocation.city,
      arrival_city: 'Paris',
      departure_country: userLocation.countryCode,
      arrival_country: 'FR',
      departure_iata: 'XXX',
      arrival_iata: 'CDG'
    },
    {
      departure_city: userLocation.city,
      arrival_city: 'Tokyo',
      departure_country: userLocation.countryCode,
      arrival_country: 'JP',
      departure_iata: 'XXX',
      arrival_iata: 'NRT'
    }
  ];

  const routesWithMetadata: RouteWithMetadata[] = defaultRoutes.map(route => ({
    ...route,
    isDomestic: route.departure_country === route.arrival_country,
    isInternational: route.departure_country !== route.arrival_country,
    popularity: 0.1 // Default popularity
  }));

  return {
    userLocation: {
      city: userLocation.city,
      country: userLocation.country,
      countryCode: userLocation.countryCode,
      iata: 'XXX'
    },
    availableRoutes: routesWithMetadata,
    popularDomesticRoutes: routesWithMetadata.filter(r => r.isDomestic).slice(0, 5),
    popularInternationalRoutes: routesWithMetadata.filter(r => r.isInternational).slice(0, 5),
    nearbyAirports: [{
      iata: 'XXX',
      city: userLocation.city,
      country: userLocation.country,
      countryCode: userLocation.countryCode,
      routeCount: 0,
      domesticRoutes: 0,
      internationalRoutes: 0
    }],
    trendingDestinations: [
      {
        city: 'New York',
        country: 'United States',
        iata: 'NYC',
        routeCount: 1,
        popularity: 0.2
      },
      {
        city: 'London',
        country: 'United Kingdom',
        iata: 'LON',
        routeCount: 1,
        popularity: 0.2
      },
      {
        city: 'Paris',
        country: 'France',
        iata: 'PAR',
        routeCount: 1,
        popularity: 0.2
      }
    ]
  };
}
