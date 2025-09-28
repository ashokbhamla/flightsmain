import { processApiImageUrls } from './cdn';

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://api.triposia.com';

// Enhanced fetch with better caching and error handling
export async function fetchJSON<T>(endpoint: string, revalidate = 3600): Promise<T> {
  // Handle local API routes (starting with 'api/')
  const url = endpoint.startsWith('api/') ? `/${endpoint}` : `${API_BASE}/${endpoint}`;
  
  // Check if we're on the client side
  const isClient = typeof window !== 'undefined';
  
  const fetchOptions: RequestInit = {
    headers: {
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
    },
    // Enhanced caching strategy
    ...(isClient 
      ? { 
          cache: 'force-cache', // Client-side: aggressive caching
          next: { revalidate: 3600 } // 1 hour cache
        } 
      : { 
          next: { revalidate }, 
          cache: 'force-cache' 
        }
    ),
    // Add timeout and signal
    signal: AbortSignal.timeout(15000), // 15 second timeout
  };
    
  try {
    const res = await fetch(url, fetchOptions);
    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }
    const data = await res.json();
    return processApiImageUrls(data) as T;
  } catch (error) {
    console.error(`API fetch error for ${url}:`, error);
    throw error;
  }
}

export async function fetchLayout(lang: 1 | 2) {
  return fetchJSON<{ header: any; footer: any }>(`web?lang=${lang}`, 600);
}

export async function fetchFlightsBySlug(slug: string, lang: 1 | 2) {
  return fetchJSON<any>(`flights?slug=${slug}&lang=${lang}`);
}

export async function fetchFlightsByAirlineSlug(slug: string, airline_iata: string, lang: 1 | 2) {
  return fetchJSON<any>(`flights?slug=${slug}&airline_iata=${airline_iata}&lang=${lang}`);
}

export async function fetchAirline(iata: string, lang: 1 | 2) {
  return fetchJSON<any>(`airlines?iata=${iata}&lang=${lang}`);
}

export async function fetchAirport(slug: string, lang: 1 | 2) {
  return fetchJSON<any>(`airports?slug=${slug}&lang=${lang}`);
}

export async function fetchAirportBySlug(slug: string, lang: 1 | 2, domain: 1 | 2 = 1) {
  // Check if we're on the server side
  const isServer = typeof window === 'undefined';
  
  try {
  if (isServer) {
    // Server-side: call external API directly
    const url = `${process.env.NEXT_PUBLIC_API_CONTENT || 'https://api.triposia.com'}/content/airports?slugs=${slug}&lang_id=${lang}&domain_id=${domain}`;
    const res = await fetch(url, { 
      next: { revalidate: 300 },
      cache: 'force-cache'
    });
      if (!res.ok) {
        console.warn(`API error ${res.status}: ${await res.text()}`);
        return null;
      }
    const data = await res.json();
    return data[0] || null;
  } else {
    // Client-side: call local API route
    return fetchJSON<any>(`api/airport-by-slug?slug=${slug}&lang=${lang}&domain_id=${domain}`);
    }
  } catch (error) {
    console.warn('Error fetching airport data:', error);
    return null;
  }
}

export async function fetchAirlineBySlug(slug: string, lang: 1 | 2, domain: 1 | 2 = 1) {
  // Check if we're on the server side
  const isServer = typeof window === 'undefined';
  
  try {
  if (isServer) {
    // Server-side: call external API directly
    const url = `${process.env.NEXT_PUBLIC_API_CONTENT || 'https://api.triposia.com'}/content/airlines?slugs=${slug}&lang_id=${lang}&domain_id=${domain}`;
    const res = await fetch(url, { 
        next: { revalidate: 300 }
    });
      if (!res.ok) {
        console.warn(`API error ${res.status}: ${await res.text()}`);
        return null;
      }
    const data = await res.json();
    return data[0] || null;
  } else {
    // Client-side: call local API route
      return fetchJSON<any>(`api/airline-by-slug?slug=${slug}&lang_id=${lang}&domain_id=${domain}`);
    }
  } catch (error) {
    console.warn('Error fetching airline data:', error);
    return null;
  }
}

export async function fetchHotelsByAirport(airportCode: string, lang: 1 | 2, domain: 1 | 2 = 1) {
  // Check if we're on the server side
  const isServer = typeof window === 'undefined';
  
  try {
    if (isServer) {
      // Server-side: call external API directly
      const url = `${process.env.NEXT_PUBLIC_API_CONTENT || 'https://api.triposia.com'}/content/hotels?airport_code=${airportCode}&lang_id=${lang}&domain_id=${domain}`;
      const res = await fetch(url, { 
        next: { revalidate: 300 }
      });
      if (!res.ok) {
        console.warn(`API error ${res.status}: ${await res.text()}`);
        return null;
      }
      const data = await res.json();
      return data || [];
    } else {
      // Client-side: call local API route
      return fetchJSON<any[]>(`api/hotels-by-airport?airport_code=${airportCode}&lang_id=${lang}&domain_id=${domain}`);
    }
  } catch (error) {
    console.warn('Error fetching hotels data:', error);
    return null;
  }
}

export async function fetchDistance(slug: string, lang: 1 | 2) {
  return fetchJSON<any>(`distance?${slug}&lang=${lang}`);
}

export async function fetchPage(slug: string, lang: 1 | 2, domain: 1 | 2 = 1) {
  // Check if we're on the server side
  const isServer = typeof window === 'undefined';
  
  if (isServer) {
    // Server-side: call external API directly
    const url = `${process.env.NEXT_PUBLIC_API_CONTENT || 'https://api.triposia.com'}/pages?slug=${slug}&lang_id=${lang}&domain_id=${domain}`;
    const res = await fetch(url, { 
      next: { revalidate: 300 }
    });
    if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
    const data = await res.json() as any[];
    return data[0] || null;
  } else {
    // Client-side: use local API proxy
    const data = await fetchJSON<any[]>(`api/pages?slug=${slug}&lang_id=${lang}&domain_id=${domain}`);
    return data[0] || null;
  }
}

// New API functions for flight pages
export async function fetchFlightContent(arrivalIata: string, departureIata: string, lang_id: 1 | 2 | 3 | 4, domain_id: 1 | 2 = 1) {
  const isServer = typeof window === 'undefined';
  
  if (isServer) {
    // Fetch data for specific language
    const url = `${process.env.NEXT_PUBLIC_API_CONTENT || 'https://api.triposia.com'}/content/flights?arrival_iata=${arrivalIata}&departure_iata=${departureIata}&lang_id=${lang_id}&domain_id=${domain_id}`;
    const res = await fetch(url, { 
      next: { revalidate: 300 }
    });
    if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
    const data = await res.json() as any[];
    return data[0] || null;
  } else {
    const data = await fetchJSON<any[]>(`api/flight-content?arrival_iata=${arrivalIata}&departure_iata=${departureIata}&lang_id=${lang_id}&domain_id=${domain_id}`);
    return data[0] || null;
  }
}

export async function fetchFlightData(arrivalIata: string, departureIata: string, lang_id: 1 | 2 = 1, domain_id: 1 | 2 = 1) {
  const isServer = typeof window === 'undefined';
  
  if (isServer) {
    const url = `${process.env.NEXT_PUBLIC_API_REAL || 'https://api.triposia.com'}/real/flights?arrival_iata=${arrivalIata}&departure_iata=${departureIata}&lang_id=${lang_id}&domain_id=${domain_id}`;
    const res = await fetch(url, { 
      next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
    const data = await res.json() as any[];
    return data[0] || null;
  } else {
    const data = await fetchJSON<any[]>(`api/flight-data?arrival_iata=${arrivalIata}&departure_iata=${departureIata}&lang_id=${lang_id}&domain_id=${domain_id}`);
    return data[0] || null;
  }
}

// New API functions for destination pages (flights from specific airport)
export async function fetchDestinationFlightContent(iataFrom: string, lang_id: 1 | 2 | 3 | 4, domain_id: 1 | 2 = 1) {
  const isServer = typeof window === 'undefined';
  
  if (isServer) {
    const url = `${process.env.NEXT_PUBLIC_API_CONTENT || 'https://api.triposia.com'}/content/flights?iata_from=${iataFrom}&lang_id=${lang_id}&domain_id=${domain_id}`;
    console.log('API URL:', url);
    const res = await fetch(url, { 
      next: { revalidate: 300 }
    });
    console.log('API Response status:', res.status);
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error:', errorText);
      throw new Error(`API error ${res.status}: ${errorText}`);
    }
    const data = await res.json() as any[];
    console.log('API Data received:', data);
    return data[0] || null;
  } else {
    const data = await fetchJSON<any[]>(`api/destination-flight-content?iata_from=${iataFrom}&lang_id=${lang_id}&domain_id=${domain_id}`);
    return data[0] || null;
  }
}

export async function fetchDestinationFlightData(iataFrom: string, lang_id: 1 | 2 = 1, domain_id: 1 | 2 = 1) {
  const isServer = typeof window === 'undefined';
  
  if (isServer) {
    const url = `${process.env.NEXT_PUBLIC_API_REAL || 'https://api.triposia.com'}/real/flights?iata_from=${iataFrom}&lang_id=${lang_id}&domain_id=${domain_id}`;
    const res = await fetch(url, { 
      next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
    const data = await res.json() as any[];
    return data; // Return the full array, not just the first element
  } else {
    const data = await fetchJSON<any[]>(`api/destination-flight-data?iata_from=${iataFrom}&lang_id=${lang_id}&domain_id=${domain_id}`);
    return data; // Return the full array, not just the first element
  }
}

// New API functions for airline-specific pages
export async function fetchAirlineContent(airlineCode: string, arrivalIata: string, departureIata: string, lang_id: 1 | 2, domain_id: 1 | 2 = 1) {
  const isServer = typeof window === 'undefined';
  
  if (isServer) {
    const url = `${process.env.NEXT_PUBLIC_API_CONTENT || 'https://api.triposia.com'}/content/airlines?airline_code=${airlineCode}&departure_iata=${departureIata}&arrival_iata=${arrivalIata}&lang_id=${lang_id}&domain_id=${domain_id}`;
    const res = await fetch(url, { 
      next: { revalidate: 300 }
    });
    if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
    const data = await res.json() as any[];
    return data[0] || null;
  } else {
    const data = await fetchJSON<any[]>(`api/airline-content?airline_code=${airlineCode}&departure_iata=${departureIata}&arrival_iata=${arrivalIata}&lang_id=${lang_id}&domain_id=${domain_id}`);
    return data[0] || null;
  }
}

export async function fetchAirlineData(airlineCode: string, arrivalIata: string, departureIata: string, lang_id: 1 | 2 = 1, domain_id: 1 | 2 = 1) {
  const isServer = typeof window === 'undefined';
  
  if (isServer) {
    const url = `${process.env.NEXT_PUBLIC_API_REAL || 'https://api.triposia.com'}/real/airlines?airline_code=${airlineCode}&departure_iata=${departureIata}&arrival_iata=${arrivalIata}&lang_id=${lang_id}&domain_id=${domain_id}`;
    const res = await fetch(url, { 
      next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
    const data = await res.json() as any[];
    return data[0] || null;
  } else {
    const data = await fetchJSON<any[]>(`api/airline-data?airline_code=${airlineCode}&departure_iata=${departureIata}&arrival_iata=${arrivalIata}&lang_id=${lang_id}&domain_id=${domain_id}`);
    return data[0] || null;
  }
}

// Fetch airline content for airport pages
export async function fetchAirlineAirportContent(airlineCode: string, departureIata: string, lang_id: 1 | 2, domain_id: 1 | 2 = 1) {
  const isServer = typeof window === 'undefined';
  if (isServer) {
    const url = `${process.env.NEXT_PUBLIC_API_CONTENT || 'https://api.triposia.com'}/content/airlines?airline_code=${airlineCode}&departure_iata=${departureIata}&lang_id=${lang_id}&domain_id=${domain_id}`;
    const res = await fetch(url, { 
      next: { revalidate: 300 }
    });
    if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
    const data = await res.json() as any[];
    return data[0] || null;
  } else {
    const data = await fetchJSON<any[]>(`api/airline-airport-content?airline_code=${airlineCode}&departure_iata=${departureIata}&lang_id=${lang_id}&domain_id=${domain_id}`);
    return data[0] || null;
  }
}

// Fetch airline data for airport pages
export async function fetchAirlineAirportData(airlineCode: string, departureIata: string, lang_id: 1 | 2 = 1, domain_id: 1 | 2 = 1) {
  const isServer = typeof window === 'undefined';
  if (isServer) {
    const url = `${process.env.NEXT_PUBLIC_API_REAL || 'https://api.triposia.com'}/real/airlines?airline_code=${airlineCode}&departure_iata=${departureIata}&lang_id=${lang_id}&domain_id=${domain_id}`;
    const res = await fetch(url, { 
      next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
    const data = await res.json() as any[];
    return data; // Return the full array, not just the first element
  } else {
    const data = await fetchJSON<any[]>(`api/airline-airport-data?airline_code=${airlineCode}&departure_iata=${departureIata}&lang_id=${lang_id}&domain_id=${domain_id}`);
    return data; // Return the full array, not just the first element
  }
}

// Airport content API
export async function fetchAirportContent(slugs: string, lang_id: 1 | 2 | 3 | 4, domain_id: 1 | 2 = 1) {
  const isServer = typeof window === 'undefined';
  
  if (isServer) {
    const url = `${process.env.NEXT_PUBLIC_API_CONTENT || 'https://api.triposia.com'}/content/airports?slugs=${slugs}&lang_id=${lang_id}&domain_id=${domain_id}`;
    const res = await fetch(url, { 
      next: { revalidate: 300 }
    });
    if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
    const data = await res.json() as any[];
    return data[0] || null;
  } else {
    const data = await fetchJSON<any[]>(`api/airport-content?slugs=${slugs}&lang_id=${lang_id}&domain_id=${domain_id}`);
    return data[0] || null;
  }
}

// Airlines by slugs API
export async function fetchAirlinesBySlugs(slugs: string, lang_id: 1 | 2 | 3 | 4, domain_id: 1 | 2 = 1) {
  const isServer = typeof window === 'undefined';
  
  if (isServer) {
    const url = `${process.env.NEXT_PUBLIC_API_REAL || 'https://api.triposia.com'}/real/airlines?slugs=${slugs}&lang_id=${lang_id}&domain_id=${domain_id}`;
    const res = await fetch(url, { 
      next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
    const data = await res.json() as any[];
    return data; // Return the full array
  } else {
    const data = await fetchJSON<any[]>(`api/airlines-by-slugs?slugs=${slugs}&lang_id=${lang_id}&domain_id=${domain_id}`);
    return data; // Return the full array
  }
}

/**
 * Get homepage cards data based on user location
 */
export async function getHomepageCards(
  countryCode: string,
  country: string,
  lang: string = 'en',
  domain: string = '1'
): Promise<any> {
  const url = `${API_BASE}/homepage/cards?country_code=${countryCode}&country=${country}&lang_id=${lang}&domain_id=${domain}`;
  
  try {
    // Check if we're on the client side
    const isClient = typeof window !== 'undefined';
    
    const fetchOptions: RequestInit = isClient 
      ? { 
          cache: 'no-store', // Client-side: no caching
          signal: AbortSignal.timeout(10000) // 10 second timeout
        } 
      : { 
          next: { revalidate: 300 }, // Server-side: with caching
          signal: AbortSignal.timeout(10000) // 10 second timeout
        };
    
    const res = await fetch(url, fetchOptions);
    
    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${await res.text()}`);
    }
    
    const data = await res.json();
    return processApiImageUrls(data);
  } catch (error) {
    console.error('Error fetching homepage cards:', error);
    // Return fallback data structure
    return {
      popular_routes: [],
      customer_reviews: [],
      hotels: []
    };
  }
}

export async function fetchAirlineContactInfo(iataCode: string) {
  try {
    const data = await fetchJSON<any[]>(`real/airlines?iata_code=${iataCode}`, 3600);
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error fetching airline contact info:', error);
    return null;
  }
}

// Fetch city information by IATA code
export async function fetchCityByIata(city_iata: string, lang_id: 1 | 2 | 3 | 4, domain_id: 1 | 2 = 1) {
  const isServer = typeof window === 'undefined';
  if (isServer) {
    const url = `${process.env.NEXT_PUBLIC_API_REAL || 'https://api.triposia.com'}/real/city?city_iata=${city_iata}&lang_id=${lang_id}&domain_id=${domain_id}`;
    const res = await fetch(url, {
      next: { revalidate: 300 }
    });
    if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
    const data = await res.json() as any;
    return data;
  } else {
    const data = await fetchJSON<any>(`api/city-by-iata?city_iata=${city_iata}&lang_id=${lang_id}&domain_id=${domain_id}`);
    return data;
  }
}
