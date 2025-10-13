import { RedisCache, CacheKeys, CacheTTL } from './redis';
import { 
  fetchAirlineContactInfo,
  fetchLayout
} from './api';

// Cached API functions with Redis integration

export async function getCachedAirlineContent(
  airlineCode: string, 
  arrivalIata: string, 
  departureIata: string, 
  langId: number, 
  domainId: number
) {
  // TEMPORARY: Disable Redis cache for testing
  const DISABLE_CACHE = true;
  
  const cacheKey = CacheKeys.airlineContent(airlineCode, arrivalIata, departureIata, langId, domainId);
  
  // Try to get from cache first
  let data = DISABLE_CACHE ? null : await RedisCache.get(cacheKey);
  
  if (!data) {
    // Call external API directly (SSR-compatible)
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE}/content/airlines?airline_code=${airlineCode}&arrival_iata=${arrivalIata}&departure_iata=${departureIata}&lang_id=${langId}&domain_id=${domainId}`;
    const response = await fetch(apiUrl);
    
    if (response.ok) {
      const rawData = await response.json();
      // Extract first object from array if it's an array
      data = Array.isArray(rawData) && rawData.length > 0 ? rawData[0] : rawData;
      
      // Cache the result for 1 hour
      if (data && !DISABLE_CACHE) {
        await RedisCache.set(cacheKey, data, CacheTTL.LONG);
      }
    }
  }
  
  return data;
}

export async function getCachedAirlineAirportContent(
  airlineCode: string, 
  departureIata: string, 
  langId: number, 
  domainId: number
) {
  // TEMPORARY: Disable Redis cache for testing
  const DISABLE_CACHE = true;
  
  const cacheKey = CacheKeys.airlineAirportContent(airlineCode, departureIata, langId, domainId);
  
  let data = DISABLE_CACHE ? null : await RedisCache.get(cacheKey);
  
  if (!data) {
    // Call external API directly (SSR-compatible)
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE}/content/airlines?airline_code=${airlineCode}&departure_iata=${departureIata}&lang_id=${langId}&domain_id=${domainId}`;
    const response = await fetch(apiUrl);
    
    if (response.ok) {
      const rawData = await response.json();
      // Extract first object from array if it's an array
      data = Array.isArray(rawData) && rawData.length > 0 ? rawData[0] : rawData;
      
      if (data && !DISABLE_CACHE) {
        await RedisCache.set(cacheKey, data, CacheTTL.LONG);
      }
    }
  }
  
  return data;
}

export async function getCachedAirlineData(
  airlineCode: string, 
  arrivalIata: string, 
  departureIata: string, 
  langId: number, 
  domainId: number
) {
  // TEMPORARY: Disable Redis cache for testing
  const DISABLE_CACHE = true;
  
  const cacheKey = CacheKeys.airlineData(airlineCode, arrivalIata, departureIata, langId, domainId);
  
  let data = DISABLE_CACHE ? null : await RedisCache.get(cacheKey);
  
  if (!data) {
    // Call external API directly (SSR-compatible)
    const apiUrl = `${process.env.NEXT_PUBLIC_API_REAL}/real/airlines?airline_code=${airlineCode}&arrival_iata=${arrivalIata}&departure_iata=${departureIata}&lang_id=${langId}&domain_id=${domainId}`;
    const response = await fetch(apiUrl);
    
    if (response.ok) {
      const rawData = await response.json();
      // Extract first object from array if it's an array
      data = Array.isArray(rawData) && rawData.length > 0 ? rawData[0] : rawData;
      
      // If no data for this language, fallback to English
      if ((!data || (Array.isArray(rawData) && rawData.length === 0)) && langId !== 1) {
        const fallbackUrl = `${process.env.NEXT_PUBLIC_API_REAL}/real/airlines?airline_code=${airlineCode}&arrival_iata=${arrivalIata}&departure_iata=${departureIata}&lang_id=1&domain_id=${domainId}`;
        const fallbackResponse = await fetch(fallbackUrl);
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          data = Array.isArray(fallbackData) && fallbackData.length > 0 ? fallbackData[0] : fallbackData;
        }
      }
      
      if (data && !DISABLE_CACHE) {
        await RedisCache.set(cacheKey, data, CacheTTL.MEDIUM);
      }
    }
  }
  
  return data;
}

export async function getCachedAirlineAirportData(
  airlineCode: string, 
  departureIata: string, 
  domainId: number
) {
  // TEMPORARY: Disable Redis cache for testing
  const DISABLE_CACHE = true;
  
  const cacheKey = CacheKeys.airlineAirportData(airlineCode, departureIata, domainId);
  
  let data = DISABLE_CACHE ? null : await RedisCache.get(cacheKey);
  
  if (!data) {
    // Call external API directly (SSR-compatible) - needs lang_id parameter
    const apiUrl = `${process.env.NEXT_PUBLIC_API_REAL}/real/airlines?airline_code=${airlineCode}&departure_iata=${departureIata}&lang_id=1&domain_id=${domainId}`;
    const response = await fetch(apiUrl);
    
    if (response.ok) {
      const rawData = await response.json();
      // Keep full array for airline airport data (multiple routes)
      data = rawData;
      
      if (data && !DISABLE_CACHE) {
        await RedisCache.set(cacheKey, data, CacheTTL.MEDIUM);
      }
    }
  }
  
  return data;
}

export async function getCachedAirlineContactInfo(airlineCode: string) {
  const cacheKey = CacheKeys.airlineContactInfo(airlineCode);
  
  let data = await RedisCache.get(cacheKey);
  
  if (!data) {
    data = await fetchAirlineContactInfo(airlineCode);
    
    if (data) {
      // Contact info changes less frequently, cache for 24 hours
      await RedisCache.set(cacheKey, data, CacheTTL.DAILY);
    }
  }
  
  return data;
}

export async function getCachedCityData(
  cityIata: string, 
  langId: number, 
  domainId: number
) {
  const cacheKey = CacheKeys.cityData(cityIata, langId, domainId);
  
  let data = await RedisCache.get(cacheKey);
  
  if (!data) {
    // Call internal API endpoint instead of external API
    const apiUrl = `/api/city-by-iata?city_iata=${cityIata}&lang_id=${langId}&domain_id=${domainId}`;
    const response = await fetch(apiUrl);
    
    if (response.ok) {
      data = await response.json();
      
      if (data) {
        // City data is relatively static, cache for 2 hours
        await RedisCache.set(cacheKey, data, CacheTTL.VERY_LONG);
      }
    }
  }
  
  return data;
}

export async function getCachedFlightContent(
  arrivalIata: string, 
  departureIata: string, 
  langId: number, 
  domainId: number
) {
  const cacheKey = CacheKeys.flightContent(arrivalIata, departureIata, langId, domainId);
  
  let data = await RedisCache.get(cacheKey);
  
  if (!data) {
    // Call external API directly
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE}/content/flights?arrival_iata=${arrivalIata}&departure_iata=${departureIata}&lang_id=${langId}&domain_id=${domainId}`;
    const response = await fetch(apiUrl);
    
    if (response.ok) {
      const rawData = await response.json();
      // API returns an array, extract first object
      data = Array.isArray(rawData) && rawData.length > 0 ? rawData[0] : rawData;
      
      if (data) {
        await RedisCache.set(cacheKey, data, CacheTTL.LONG);
      }
    }
  }
  
  return data;
}

export async function getCachedFlightData(
  arrivalIata: string, 
  departureIata: string, 
  langId: number, 
  domainId: number
) {
  const cacheKey = CacheKeys.flightData(arrivalIata, departureIata, langId, domainId);
  
  let data = await RedisCache.get(cacheKey);
  
  if (!data) {
    // Call external API directly
    const apiUrl = `${process.env.NEXT_PUBLIC_API_REAL}/real/flights?arrival_iata=${arrivalIata}&departure_iata=${departureIata}&lang_id=${langId}&domain_id=${domainId}`;
    const response = await fetch(apiUrl);
    
    if (response.ok) {
      const rawData = await response.json();
      // API returns an array, extract first object
      data = Array.isArray(rawData) && rawData.length > 0 ? rawData[0] : rawData;
      
      // If no data for this language, fallback to English
      if ((!data || (Array.isArray(rawData) && rawData.length === 0)) && langId !== 1) {
        const fallbackUrl = `${process.env.NEXT_PUBLIC_API_REAL}/real/flights?arrival_iata=${arrivalIata}&departure_iata=${departureIata}&lang_id=1&domain_id=${domainId}`;
        const fallbackResponse = await fetch(fallbackUrl);
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          data = Array.isArray(fallbackData) && fallbackData.length > 0 ? fallbackData[0] : fallbackData;
        }
      }
      
      if (data) {
        await RedisCache.set(cacheKey, data, CacheTTL.MEDIUM);
      }
    }
  }
  
  return data;
}

export async function getCachedLayoutData(langId: number, domainId: number) {
  const cacheKey = CacheKeys.layoutData(langId, domainId);
  
  let data = await RedisCache.get(cacheKey);
  
  if (!data) {
    data = await fetchLayout(langId as 1 | 2);
    
    if (data) {
      // Layout data is very static, cache for 24 hours
      await RedisCache.set(cacheKey, data, CacheTTL.DAILY);
    }
  }
  
  return data;
}

// Batch cache operations for better performance
export async function getCachedMultipleCityData(
  cityIatas: string[], 
  langId: number, 
  domainId: number
) {
  const cacheKeys = cityIatas.map(cityIata => 
    CacheKeys.cityData(cityIata, langId, domainId)
  );
  
  // Try to get all from cache first
  const cachedData = await RedisCache.mget(cacheKeys);
  const results: any[] = [];
  const missingIndices: number[] = [];
  
  cachedData.forEach((data, index) => {
    if (data) {
      results[index] = data;
    } else {
      missingIndices.push(index);
    }
  });
  
  // Fetch missing data from API
  if (missingIndices.length > 0) {
    const fetchPromises = missingIndices.map(async (index) => {
      const cityIata = cityIatas[index];
      const apiUrl = `/api/city-by-iata?city_iata=${cityIata}&lang_id=${langId}&domain_id=${domainId}`;
      const response = await fetch(apiUrl);
      const data = response.ok ? await response.json() : null;
      
      if (data) {
        const cacheKey = CacheKeys.cityData(cityIata, langId, domainId);
        await RedisCache.set(cacheKey, data, CacheTTL.VERY_LONG);
        results[index] = data;
      }
    });
    
    await Promise.all(fetchPromises);
  }
  
  return results;
}

// Cache invalidation functions
export async function invalidateAirlineCache(airlineCode: string) {
  const patterns = [
    `airline:content:${airlineCode}:*`,
    `airline:data:${airlineCode}:*`,
    `airline:airport:content:${airlineCode}:*`,
    `airline:airport:data:${airlineCode}:*`,
    `airline:contact:${airlineCode}`
  ];
  
  // Note: Redis doesn't support pattern deletion directly
  // You would need to implement this with SCAN and DEL commands
  console.log(`Cache invalidation requested for airline: ${airlineCode}`);
}

export async function invalidateCityCache(cityIata: string) {
  const patterns = [
    `city:data:${cityIata}:*`
  ];
  
  console.log(`Cache invalidation requested for city: ${cityIata}`);
}

export async function invalidateFlightCache(departureIata: string, arrivalIata: string) {
  const patterns = [
    `flight:content:${departureIata}-${arrivalIata}:*`,
    `flight:data:${departureIata}-${arrivalIata}:*`
  ];
  
  console.log(`Cache invalidation requested for flight: ${departureIata}-${arrivalIata}`);
}
