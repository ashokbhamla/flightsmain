/**
 * Geo-IP detection and location-based utilities
 */

export interface UserLocation {
  country: string;
  countryCode: string;
  region: string;
  regionCode: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isp?: string;
}

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  distance?: number; // Distance from user location in km
}

export interface LocationBasedContent {
  userLocation: UserLocation;
  nearestAirports: Airport[];
  localFlights: any[];
  localHotels: any[];
  trendingDestinations: any[];
  popularRoutes: any[];
}

/**
 * Get user location using IP geolocation
 * This will work on both client and server side
 */
export async function getUserLocation(): Promise<UserLocation | null> {
  try {
    // For server-side rendering, we can use request headers
    if (typeof window === 'undefined') {
      // Server-side: This would be called from getServerSideProps or middleware
      return null;
    }

    // Client-side: Use a geolocation service
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      throw new Error('Failed to fetch location');
    }

    const data = await response.json();
    
    return {
      country: data.country_name || 'United States',
      countryCode: data.country_code || 'US',
      region: data.region || 'Unknown',
      regionCode: data.region_code || 'Unknown',
      city: data.city || 'Unknown',
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
      timezone: data.timezone || 'UTC',
      isp: data.org
    };
  } catch (error) {
    console.error('Error getting user location:', error);
    // Return default location instead of null to prevent errors
    return {
      country: 'United States',
      countryCode: 'US',
      region: 'Unknown',
      regionCode: 'Unknown',
      city: 'New York',
      latitude: 40.7128,
      longitude: -74.006,
      timezone: 'America/New_York',
      isp: 'Unknown'
    };
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Find nearest airports to user location
 */
export function findNearestAirports(
  userLocation: UserLocation, 
  airports: Airport[], 
  maxDistance: number = 500, // km
  limit: number = 5
): Airport[] {
  return airports
    .map(airport => ({
      ...airport,
      distance: calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        airport.latitude,
        airport.longitude
      )
    }))
    .filter(airport => airport.distance! <= maxDistance)
    .sort((a, b) => a.distance! - b.distance!)
    .slice(0, limit);
}

/**
 * Get popular routes from user's nearest airports
 */
export function getPopularRoutesFromAirports(
  airports: Airport[],
  allRoutes: any[]
): any[] {
  const airportCodes = airports.map(airport => airport.code);
  
  return allRoutes.filter(route => 
    airportCodes.includes(route.fromCode) || 
    airportCodes.includes(route.toCode)
  ).slice(0, 6);
}

/**
 * Get trending destinations based on user location
 */
export function getTrendingDestinationsForLocation(
  userLocation: UserLocation,
  allDestinations: any[]
): any[] {
  // Prioritize destinations in the same country, then region, then popular international
  const sameCountry = allDestinations.filter(dest => 
    dest.countryCode === userLocation.countryCode
  );
  
  const sameRegion = allDestinations.filter(dest => 
    dest.regionCode === userLocation.regionCode && 
    dest.countryCode !== userLocation.countryCode
  );
  
  const international = allDestinations.filter(dest => 
    dest.countryCode !== userLocation.countryCode && 
    dest.regionCode !== userLocation.regionCode
  );
  
  return [...sameCountry, ...sameRegion, ...international].slice(0, 6);
}

/**
 * Get local hotels based on user location
 */
export function getLocalHotels(
  userLocation: UserLocation,
  allHotels: any[]
): any[] {
  // Filter hotels in the same city or nearby cities
  return allHotels.filter(hotel => 
    hotel.city.toLowerCase().includes(userLocation.city.toLowerCase()) ||
    hotel.regionCode === userLocation.regionCode
  ).slice(0, 4);
}

/**
 * Default fallback location (New York)
 */
export const DEFAULT_LOCATION: UserLocation = {
  country: 'United States',
  countryCode: 'US',
  region: 'New York',
  regionCode: 'NY',
  city: 'New York',
  latitude: 40.7128,
  longitude: -74.0060,
  timezone: 'America/New_York'
};

/**
 * Major US airports for fallback
 */
export const MAJOR_US_AIRPORTS: Airport[] = [
  { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'United States', latitude: 40.6413, longitude: -73.7781 },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'United States', latitude: 33.9416, longitude: -118.4085 },
  { code: 'ORD', name: 'O\'Hare International', city: 'Chicago', country: 'United States', latitude: 41.9786, longitude: -87.9048 },
  { code: 'DFW', name: 'Dallas/Fort Worth International', city: 'Dallas', country: 'United States', latitude: 32.8968, longitude: -97.0380 },
  { code: 'DEN', name: 'Denver International', city: 'Denver', country: 'United States', latitude: 39.8561, longitude: -104.6737 },
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International', city: 'Atlanta', country: 'United States', latitude: 33.6407, longitude: -84.4277 },
  { code: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'United States', latitude: 37.6213, longitude: -122.3790 },
  { code: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle', country: 'United States', latitude: 47.4502, longitude: -122.3088 },
  { code: 'MIA', name: 'Miami International', city: 'Miami', country: 'United States', latitude: 25.7959, longitude: -80.2870 },
  { code: 'LAS', name: 'McCarran International', city: 'Las Vegas', country: 'United States', latitude: 36.0840, longitude: -115.1537 }
];

/**
 * Popular flight routes in the US
 */
export const POPULAR_US_ROUTES = [
  { from: 'New York', to: 'Los Angeles', fromCode: 'JFK', toCode: 'LAX', airline: 'AA', price: '$299' },
  { from: 'Chicago', to: 'Miami', fromCode: 'ORD', toCode: 'MIA', airline: 'UA', price: '$399' },
  { from: 'San Francisco', to: 'Seattle', fromCode: 'SFO', toCode: 'SEA', airline: 'AS', price: '$199' },
  { from: 'Boston', to: 'Denver', fromCode: 'BOS', toCode: 'DEN', airline: 'DL', price: '$349' },
  { from: 'Las Vegas', to: 'Phoenix', fromCode: 'LAS', toCode: 'PHX', airline: 'WN', price: '$149' },
  { from: 'Atlanta', to: 'Orlando', fromCode: 'ATL', toCode: 'MCO', airline: 'DL', price: '$179' },
  { from: 'New York', to: 'Chicago', fromCode: 'JFK', toCode: 'ORD', airline: 'AA', price: '$199' },
  { from: 'Los Angeles', to: 'Las Vegas', fromCode: 'LAX', toCode: 'LAS', airline: 'WN', price: '$99' },
  { from: 'Miami', to: 'New York', fromCode: 'MIA', toCode: 'JFK', airline: 'AA', price: '$249' },
  { from: 'Seattle', to: 'San Francisco', fromCode: 'SEA', toCode: 'SFO', airline: 'AS', price: '$179' }
];

/**
 * Popular US destinations
 */
export const POPULAR_US_DESTINATIONS = [
  { name: 'Miami', country: 'Florida', code: 'MIA', regionCode: 'FL' },
  { name: 'Las Vegas', country: 'Nevada', code: 'LAS', regionCode: 'NV' },
  { name: 'Orlando', country: 'Florida', code: 'MCO', regionCode: 'FL' },
  { name: 'San Diego', country: 'California', code: 'SAN', regionCode: 'CA' },
  { name: 'Seattle', country: 'Washington', code: 'SEA', regionCode: 'WA' },
  { name: 'Denver', country: 'Colorado', code: 'DEN', regionCode: 'CO' },
  { name: 'Boston', country: 'Massachusetts', code: 'BOS', regionCode: 'MA' },
  { name: 'Phoenix', country: 'Arizona', code: 'PHX', regionCode: 'AZ' },
  { name: 'Atlanta', country: 'Georgia', code: 'ATL', regionCode: 'GA' },
  { name: 'Dallas', country: 'Texas', code: 'DFW', regionCode: 'TX' }
];

/**
 * Popular US hotels
 */
export const POPULAR_US_HOTELS = [
  { name: 'Marriott Times Square', location: 'New York', city: 'New York', regionCode: 'NY', hotelId: 'marriott-ts', rating: 5, price: '$299' },
  { name: 'Hilton Los Angeles', location: 'Los Angeles', city: 'Los Angeles', regionCode: 'CA', hotelId: 'hilton-la', rating: 4, price: '$199' },
  { name: 'Hyatt Regency Chicago', location: 'Chicago', city: 'Chicago', regionCode: 'IL', hotelId: 'hyatt-chi', rating: 4, price: '$179' },
  { name: 'Four Seasons Miami', location: 'Miami', city: 'Miami', regionCode: 'FL', hotelId: 'fs-miami', rating: 5, price: '$399' },
  { name: 'Bellagio Las Vegas', location: 'Las Vegas', city: 'Las Vegas', regionCode: 'NV', hotelId: 'bellagio-lv', rating: 5, price: '$249' },
  { name: 'Grand Hyatt Seattle', location: 'Seattle', city: 'Seattle', regionCode: 'WA', hotelId: 'gh-seattle', rating: 4, price: '$229' }
];
