import { Locale } from './i18n';
import { getTranslations } from './translations';

/**
 * Optimized translation system for SSR and performance
 * This system caches translations and provides fast lookups
 */

// Translation cache for server-side rendering
const translationCache = new Map<string, any>();

// Pre-computed translation keys for fast lookup
const translationKeys = new Map<string, string>();

/**
 * Optimized translation hook that caches results and provides fast SSR support
 */
export function useOptimizedTranslation(locale: Locale, key: string, fallback?: string): string {
  const cacheKey = `${locale}:${key}`;
  
  // Check cache first
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }
  
  const t = getTranslations(locale);
  const result = getNestedTranslation(t, key) || fallback || key;
  
  // Cache the result
  translationCache.set(cacheKey, result);
  
  return result;
}

/**
 * Optimized HTML translation hook with caching
 */
export function useOptimizedHtmlTranslation(
  locale: Locale, 
  key: string, 
  apiContent?: any, 
  fallback?: string
): { __html: string } {
  const cacheKey = `${locale}:html:${key}:${JSON.stringify(apiContent)}`;
  
  // Check cache first
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }
  
  // Priority: API content > Translation > Fallback
  let content = '';
  
  if (apiContent && typeof apiContent === 'string' && apiContent.trim()) {
    content = apiContent;
  } else if (apiContent && typeof apiContent === 'object') {
    // Try locale-specific content first
    const localeKey = locale === 'en' ? 'en' : locale;
    if (apiContent[localeKey] && apiContent[localeKey].trim()) {
      content = apiContent[localeKey];
    } else if (apiContent.en && apiContent.en.trim()) {
      content = apiContent.en;
    } else {
      // Use first available content
      const availableContent = Object.values(apiContent).find((val: any) => 
        typeof val === 'string' && val.trim()
      );
      if (availableContent) {
        content = availableContent as string;
      }
    }
  }
  
  // Fallback to translation if no API content
  if (!content) {
    content = getTranslation(locale, key) || fallback || key;
  }
  
  const result = { __html: content };
  translationCache.set(cacheKey, result);
  
  return result;
}

/**
 * Batch translation function for multiple keys at once
 * This is much faster than individual calls
 */
export function useBatchTranslations(
  locale: Locale, 
  keys: string[], 
  fallbacks?: Record<string, string>
): Record<string, string> {
  const cacheKey = `${locale}:batch:${keys.join(',')}`;
  
  // Check cache first
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }
  
  const t = getTranslations(locale);
  const results: Record<string, string> = {};
  
  for (const key of keys) {
    results[key] = getNestedTranslation(t, key) || fallbacks?.[key] || key;
  }
  
  translationCache.set(cacheKey, results);
  return results;
}

/**
 * Server-side translation function for SSR
 * This bypasses React hooks and works directly on the server
 */
export function getServerTranslation(locale: Locale, key: string, fallback?: string): string {
  const cacheKey = `server:${locale}:${key}`;
  
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }
  
  const t = getTranslations(locale);
  const result = getNestedTranslation(t, key) || fallback || key;
  
  translationCache.set(cacheKey, result);
  return result;
}

/**
 * Server-side HTML translation for SSR
 */
export function getServerHtmlTranslation(
  locale: Locale, 
  key: string, 
  apiContent?: any, 
  fallback?: string
): string {
  const cacheKey = `server:${locale}:html:${key}:${JSON.stringify(apiContent)}`;
  
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }
  
  let content = '';
  
  if (apiContent && typeof apiContent === 'string' && apiContent.trim()) {
    content = apiContent;
  } else if (apiContent && typeof apiContent === 'object') {
    const localeKey = locale === 'en' ? 'en' : locale;
    if (apiContent[localeKey] && apiContent[localeKey].trim()) {
      content = apiContent[localeKey];
    } else if (apiContent.en && apiContent.en.trim()) {
      content = apiContent.en;
    } else {
      const availableContent = Object.values(apiContent).find((val: any) => 
        typeof val === 'string' && val.trim()
      );
      if (availableContent) {
        content = availableContent as string;
      }
    }
  }
  
  if (!content) {
    content = getServerTranslation(locale, key, fallback);
  }
  
  translationCache.set(cacheKey, content);
  return content;
}

/**
 * Pre-warm translation cache for common keys
 * Call this during app initialization for better performance
 */
export function preWarmTranslationCache(locale: Locale): void {
  const commonKeys = [
    'flightPage.title',
    'flightPage.description',
    'flightPage.faqs',
    'flightPage.popularDestinations',
    'flightPage.airlines',
    'flightPage.availableFlights',
    'common.loading',
    'common.error',
    'common.bookNow',
    'common.findFlights'
  ];
  
  const t = getTranslations(locale);
  
  for (const key of commonKeys) {
    const cacheKey = `${locale}:${key}`;
    if (!translationCache.has(cacheKey)) {
      const translation = getNestedTranslation(t, key);
      translationCache.set(cacheKey, translation || key);
    }
  }
}

/**
 * Clear translation cache (useful for development)
 */
export function clearTranslationCache(): void {
  translationCache.clear();
  translationKeys.clear();
}

/**
 * Get nested translation value using dot notation
 */
function getNestedTranslation(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
}

/**
 * Translation context for React components
 * Provides optimized translations with caching
 */
export interface TranslationContextValue {
  locale: Locale;
  t: (key: string, fallback?: string) => string;
  tHtml: (key: string, apiContent?: any, fallback?: string) => { __html: string };
  tBatch: (keys: string[], fallbacks?: Record<string, string>) => Record<string, string>;
}

/**
 * Create translation context value
 */
export function createTranslationContext(locale: Locale): TranslationContextValue {
  return {
    locale,
    t: (key: string, fallback?: string) => getTranslation(locale, key) || fallback || key,
    tHtml: (key: string, apiContent?: any, fallback?: string) => {
      const content = apiContent || getTranslation(locale, key) || fallback || key;
      return { __html: content };
    },
    tBatch: (keys: string[], fallbacks?: Record<string, string>) => {
      const results: Record<string, string> = {};
      keys.forEach(key => {
        results[key] = getTranslation(locale, key) || fallbacks?.[key] || key;
      });
      return results;
    }
  };
}

/**
 * SSR-optimized translation function for page metadata
 */
export function getPageMetadata(locale: Locale, pageType: string, dynamicData?: Record<string, string>): {
  title: string;
  description: string;
} {
  const titleKey = `pages.${pageType}.title`;
  const descriptionKey = `pages.${pageType}.description`;
  
  let title = getServerTranslation(locale, titleKey);
  let description = getServerTranslation(locale, descriptionKey);
  
  // Replace dynamic placeholders
  if (dynamicData) {
    Object.entries(dynamicData).forEach(([key, value]) => {
      title = title.replace(`{${key}}`, value);
      description = description.replace(`{${key}}`, value);
    });
  }
  
  return { title, description };
}

/**
 * Performance monitoring for translations
 */
export function getTranslationStats(): {
  cacheSize: number;
  hitRate: number;
  memoryUsage: number;
} {
  return {
    cacheSize: translationCache.size,
    hitRate: 0, // Would need to implement hit tracking
    memoryUsage: process.memoryUsage().heapUsed
  };
}
