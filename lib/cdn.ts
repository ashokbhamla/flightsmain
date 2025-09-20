/**
 * CDN utility functions for handling image URLs
 */

// CDN base URL - can be overridden by environment variable
export const CDN_BASE = process.env.NEXT_PUBLIC_CDN_BASE || 'https://storage.googleapis.com/web-unified-atom-469911-j9';

/**
 * Generate CDN URL for airport images
 * @param airportCode - IATA airport code (e.g., 'JFK', 'LAX')
 * @param size - Image size (optional, defaults to 'medium')
 * @returns Full CDN URL for airport image
 */
export function getAirportImageUrl(airportCode: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
  return `${CDN_BASE}/airports/${airportCode.toLowerCase()}_${size}.jpg`;
}

/**
 * Generate CDN URL for city images
 * @param cityName - City name (e.g., 'New York', 'Los Angeles')
 * @param size - Image size (optional, defaults to 'medium')
 * @returns Full CDN URL for city image
 */
export function getCityImageUrl(cityName: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
  // Convert city name to URL-friendly format
  const citySlug = cityName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return `${CDN_BASE}/cities/${citySlug}_${size}.jpg`;
}

/**
 * Generate CDN URL for airline logos
 * @param airlineCode - IATA airline code (e.g., 'AA', 'DL', 'UA')
 * @param size - Image size (optional, defaults to 'medium')
 * @returns Full CDN URL for airline logo
 */
export function getAirlineLogoUrl(airlineCode: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
  return `${CDN_BASE}/airlines/${airlineCode.toLowerCase()}_${size}.jpg`;
}

/**
 * Generate CDN URL for hotel images
 * @param hotelId - Hotel identifier
 * @param size - Image size (optional, defaults to 'medium')
 * @returns Full CDN URL for hotel image
 */
export function getHotelImageUrl(hotelId: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
  return `${CDN_BASE}/hotels/${hotelId}_${size}.jpg`;
}

/**
 * Generate CDN URL for destination images
 * @param destinationName - Destination name
 * @param size - Image size (optional, defaults to 'medium')
 * @returns Full CDN URL for destination image
 */
export function getDestinationImageUrl(destinationName: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
  const destinationSlug = destinationName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return `${CDN_BASE}/destinations/${destinationSlug}_${size}.jpg`;
}

/**
 * Generate CDN URL for generic images
 * @param category - Image category (e.g., 'heroes', 'banners', 'icons')
 * @param filename - Image filename
 * @returns Full CDN URL for generic image
 */
export function getGenericImageUrl(category: string, filename: string): string {
  return `${CDN_BASE}/${category}/${filename}`;
}

/**
 * Check if an image URL is from our CDN
 * @param url - Image URL to check
 * @returns True if URL is from our CDN
 */
export function isCdnUrl(url: string): boolean {
  return url.startsWith(CDN_BASE);
}

/**
 * Get fallback image URL for when CDN image is not available
 * @param type - Type of fallback image needed
 * @returns Fallback image URL
 */
export function getFallbackImageUrl(type: 'airport' | 'airline' | 'city' | 'hotel' | 'destination'): string {
  return `${CDN_BASE}/fallbacks/${type}_placeholder.jpg`;
}

/**
 * Convert old CDN URLs to new Google Cloud Storage URLs
 * @param url - Image URL that might contain old CDN domain
 * @returns Updated URL with new CDN domain
 */
export function convertToNewCdnUrl(url: string): string {
  if (!url) return url;
  
  // Replace old CDN domain with new Google Cloud Storage domain
  const oldCdnPattern = /https:\/\/cdn\.triposia\.com\/images\//g;
  if (oldCdnPattern.test(url)) {
    return url.replace(oldCdnPattern, `${CDN_BASE}/`);
  }
  
  return url;
}

/**
 * Process API response data to convert all image URLs to new CDN
 * @param data - API response data object
 * @returns Data with converted image URLs
 */
export function processApiImageUrls(data: any): any {
  if (!data || typeof data !== 'object') return data;
  
  if (Array.isArray(data)) {
    return data.map(item => processApiImageUrls(item));
  }
  
  const processed = { ...data };
  
  // Convert image_url fields
  if (processed.image_url) {
    processed.image_url = convertToNewCdnUrl(processed.image_url);
  }
  
  // Convert avatar fields
  if (processed.avatar) {
    processed.avatar = convertToNewCdnUrl(processed.avatar);
  }
  
  // Recursively process nested objects
  for (const key in processed) {
    if (processed[key] && typeof processed[key] === 'object') {
      processed[key] = processApiImageUrls(processed[key]);
    }
  }
  
  return processed;
}
