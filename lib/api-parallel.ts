/**
 * Parallel API calls for better performance
 * Reduces Vercel → GCP latency by making concurrent requests
 */

import { processApiImageUrls } from './cdn';

export interface ParallelApiOptions {
  timeout?: number;
  fallbackData?: any;
  cacheTime?: number;
}

/**
 * Execute multiple API calls in parallel
 */
export async function fetchParallel<T>(
  endpoints: Array<{ key: string; url: string; fallback?: any }>,
  options: ParallelApiOptions = {}
): Promise<Record<string, T>> {
  const { timeout = 10000, cacheTime = 3600 } = options;
  
  const results: Record<string, T> = {};
  const errors: Record<string, Error> = {};
  
  // Create promises for all endpoints
  const promises = endpoints.map(async ({ key, url, fallback }) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
        },
        cache: 'force-cache',
        next: { revalidate: cacheTime },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { key, data: processApiImageUrls(data) as T };
    } catch (error) {
      console.error(`API error for ${key}:`, error);
      errors[key] = error as Error;
      return { key, data: fallback || null };
    }
  });
  
  // Wait for all promises to resolve
  const responses = await Promise.allSettled(promises);
  
  // Process results
  responses.forEach((result) => {
    if (result.status === 'fulfilled') {
      results[result.value.key] = result.value.data;
    }
  });
  
  return results;
}

/**
 * Batch API calls for page data
 */
export async function fetchPageData(
  pageType: 'airport' | 'airline' | 'flight' | 'hotel',
  params: Record<string, string>,
  lang: 1 | 2,
  domain: 1 | 2 = 1
) {
  const isServer = typeof window === 'undefined';
  const baseUrl = process.env.NEXT_PUBLIC_API_CONTENT || 'https://api.triposia.com';
  const realUrl = process.env.NEXT_PUBLIC_API_REAL || 'https://api.triposia.com';
  
  const endpoints: Array<{ key: string; url: string; fallback?: any }> = [];
  
  switch (pageType) {
    case 'airport':
      endpoints.push(
        {
          key: 'content',
          url: `${baseUrl}/content/airports?slugs=${params.slug}&lang_id=${lang}&domain_id=${domain}`,
          fallback: null
        },
        {
          key: 'routes',
          url: `${baseUrl}/content/routes?departure_iata=${params.iata}&lang_id=${lang}&domain_id=${domain}`,
          fallback: []
        }
      );
      break;
      
    case 'airline':
      endpoints.push(
        {
          key: 'content',
          url: `${baseUrl}/content/airlines?slugs=${params.slug}&lang_id=${lang}&domain_id=${domain}`,
          fallback: null
        },
        {
          key: 'routes',
          url: `${baseUrl}/content/routes?airline_iata=${params.iata}&lang_id=${lang}&domain_id=${domain}`,
          fallback: []
        }
      );
      break;
      
    case 'flight':
      endpoints.push(
        {
          key: 'content',
          url: `${baseUrl}/content/flights?arrival_iata=${params.arrival}&departure_iata=${params.departure}&lang_id=${lang}&domain_id=${domain}`,
          fallback: null
        },
        {
          key: 'data',
          url: `${realUrl}/real/flights?arrival_iata=${params.arrival}&departure_iata=${params.departure}&lang=1&domain_id=${domain}`,
          fallback: null
        }
      );
      break;
      
    case 'hotel':
      endpoints.push(
        {
          key: 'hotels',
          url: `${baseUrl}/content/hotels?airport_code=${params.airport}&lang_id=${lang}&domain_id=${domain}`,
          fallback: []
        }
      );
      break;
  }
  
  return fetchParallel(endpoints, {
    timeout: 15000,
    cacheTime: 3600
  });
}

/**
 * Preload critical API data
 */
export async function preloadCriticalData(locale: string) {
  const isServer = typeof window === 'undefined';
  if (isServer) return; // Only preload on client
  
  const lang = locale === 'ru' ? 2 : 1;
  const baseUrl = process.env.NEXT_PUBLIC_API_CONTENT || 'https://api.triposia.com';
  
  // Preload common data in background
  const criticalEndpoints = [
    {
      key: 'layout',
      url: `${baseUrl}/web?lang=${lang}`,
      fallback: { header: null, footer: null }
    },
    {
      key: 'popular_routes',
      url: `${baseUrl}/content/routes?popular=true&lang_id=${lang}&domain_id=1`,
      fallback: []
    }
  ];
  
  // Use requestIdleCallback for non-critical preloading
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      fetchParallel(criticalEndpoints, { timeout: 5000 });
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      fetchParallel(criticalEndpoints, { timeout: 5000 });
    }, 100);
  }
}
