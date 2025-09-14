/**
 * Server-side geo-IP detection utilities
 */

import { UserLocation, DEFAULT_LOCATION } from './geoip';

/**
 * Get user location from request headers (server-side)
 * This works with services like Cloudflare, Vercel, etc.
 */
export function getUserLocationFromHeaders(headers: Headers): UserLocation | null {
  try {
    // Cloudflare headers
    const cfCountry = headers.get('cf-ipcountry');
    const cfRegion = headers.get('cf-region');
    const cfCity = headers.get('cf-city');
    const cfLatitude = headers.get('cf-latitude');
    const cfLongitude = headers.get('cf-longitude');
    const cfTimezone = headers.get('cf-timezone');

    if (cfCountry && cfCity) {
      return {
        country: cfCountry,
        countryCode: cfCountry,
        region: cfRegion || 'Unknown',
        regionCode: cfRegion || 'Unknown',
        city: cfCity,
        latitude: cfLatitude ? parseFloat(cfLatitude) : 0,
        longitude: cfLongitude ? parseFloat(cfLongitude) : 0,
        timezone: cfTimezone || 'UTC'
      };
    }

    // Vercel headers
    const vercelCountry = headers.get('x-vercel-ip-country');
    const vercelRegion = headers.get('x-vercel-ip-region');
    const vercelCity = headers.get('x-vercel-ip-city');
    const vercelLatitude = headers.get('x-vercel-ip-latitude');
    const vercelLongitude = headers.get('x-vercel-ip-longitude');

    if (vercelCountry && vercelCity) {
      return {
        country: vercelCountry,
        countryCode: vercelCountry,
        region: vercelRegion || 'Unknown',
        regionCode: vercelRegion || 'Unknown',
        city: vercelCity,
        latitude: vercelLatitude ? parseFloat(vercelLatitude) : 0,
        longitude: vercelLongitude ? parseFloat(vercelLongitude) : 0,
        timezone: 'UTC'
      };
    }

    // Other common headers
    const xForwardedFor = headers.get('x-forwarded-for');
    const xRealIp = headers.get('x-real-ip');
    const remoteAddr = headers.get('x-remote-addr');

    // If we have IP but no location data, we could call an IP geolocation service
    // For now, return null to fall back to client-side detection
    return null;
  } catch (error) {
    console.error('Error parsing location from headers:', error);
    return null;
  }
}

/**
 * Get user location from request (Next.js App Router)
 */
export function getUserLocationFromRequest(request: Request): UserLocation | null {
  const headers = new Headers(request.headers);
  return getUserLocationFromHeaders(headers);
}

/**
 * Get user location from Next.js headers (Pages Router)
 */
export function getUserLocationFromNextHeaders(headers: any): UserLocation | null {
  try {
    // Convert Next.js headers to Headers object
    const headersObj = new Headers();
    Object.entries(headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        headersObj.set(key, value);
      } else if (Array.isArray(value)) {
        headersObj.set(key, value[0]);
      }
    });
    
    return getUserLocationFromHeaders(headersObj);
  } catch (error) {
    console.error('Error parsing location from Next.js headers:', error);
    return null;
  }
}

/**
 * Fallback location detection based on common patterns
 */
export function getFallbackLocationFromHeaders(headers: Headers): UserLocation | null {
  try {
    // Check for common location indicators in headers
    const acceptLanguage = headers.get('accept-language');
    const userAgent = headers.get('user-agent');
    
    // Simple language-based fallback
    if (acceptLanguage) {
      if (acceptLanguage.includes('en-US') || acceptLanguage.includes('en-GB')) {
        return {
          ...DEFAULT_LOCATION,
          country: 'United States',
          countryCode: 'US',
          region: 'New York',
          regionCode: 'NY',
          city: 'New York'
        };
      }
      
      if (acceptLanguage.includes('es')) {
        return {
          ...DEFAULT_LOCATION,
          country: 'United States',
          countryCode: 'US',
          region: 'California',
          regionCode: 'CA',
          city: 'Los Angeles'
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error in fallback location detection:', error);
    return null;
  }
}

/**
 * Get location with multiple fallback strategies
 */
export function getLocationWithFallbacks(headers: Headers): UserLocation {
  // Try primary detection
  const primaryLocation = getUserLocationFromHeaders(headers);
  if (primaryLocation) return primaryLocation;
  
  // Try fallback detection
  const fallbackLocation = getFallbackLocationFromHeaders(headers);
  if (fallbackLocation) return fallbackLocation;
  
  // Return default
  return DEFAULT_LOCATION;
}
