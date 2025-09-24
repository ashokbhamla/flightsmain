'use client';

import { useMemo } from 'react';
import { getTranslations } from './translations';
import { Locale } from './i18n';

interface TranslationWithFallbackOptions {
  locale: Locale;
  apiContent?: any;
  fallbackKey?: string;
  defaultText?: string;
}

/**
 * Custom hook for handling translations with API content fallbacks
 * This ensures all content is translated even when API doesn't provide language-specific data
 */
export function useTranslationWithFallback({
  locale,
  apiContent,
  fallbackKey,
  defaultText
}: TranslationWithFallbackOptions) {
  const t = getTranslations(locale);
  
  return useMemo(() => {
    // If API content is available and has the specific field, use it
    if (apiContent && typeof apiContent === 'string' && apiContent.trim()) {
      return apiContent;
    }
    
    // If API content is an object with language-specific data, try to get the right language
    if (apiContent && typeof apiContent === 'object') {
      // Try to get content for current locale
      const localeKey = locale === 'en' ? 'en' : locale;
      if (apiContent[localeKey] && apiContent[localeKey].trim()) {
        return apiContent[localeKey];
      }
      
      // Fallback to English if available
      if (apiContent.en && apiContent.en.trim()) {
        return apiContent.en;
      }
      
      // Fallback to any available language
      const availableLanguage = Object.keys(apiContent).find(key => 
        apiContent[key] && typeof apiContent[key] === 'string' && apiContent[key].trim()
      );
      if (availableLanguage) {
        return apiContent[availableLanguage];
      }
    }
    
    // Use translation fallback if provided
    if (fallbackKey) {
      const translation = getNestedTranslation(t, fallbackKey);
      if (translation && translation !== fallbackKey) {
        return translation;
      }
    }
    
    // Use default text if provided
    if (defaultText) {
      return defaultText;
    }
    
    // Final fallback
    return '';
  }, [locale, apiContent, fallbackKey, defaultText, t]);
}

/**
 * Get nested translation value using dot notation
 */
function getNestedTranslation(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => {
    return current && current[key] ? current[key] : path;
  }, obj);
}

/**
 * Hook for getting translated content with multiple fallback options
 */
export function useMultiLanguageContent({
  locale,
  apiContent,
  fallbackTranslations,
  defaultContent
}: {
  locale: Locale;
  apiContent?: any;
  fallbackTranslations?: Record<string, string>;
  defaultContent?: string;
}) {
  return useMemo(() => {
    // Priority 1: API content for current locale
    if (apiContent) {
      if (typeof apiContent === 'string' && apiContent.trim()) {
        return apiContent;
      }
      
      if (typeof apiContent === 'object') {
        const localeKey = locale === 'en' ? 'en' : locale;
        if (apiContent[localeKey] && apiContent[localeKey].trim()) {
          return apiContent[localeKey];
        }
        
        // Try other language variations
        const languageVariations = [
          locale,
          locale.split('-')[0], // e.g., 'en' from 'en-US'
          'en', // English fallback
          'es', // Spanish fallback
          'ru', // Russian fallback
          'fr'  // French fallback
        ];
        
        for (const lang of languageVariations) {
          if (apiContent[lang] && apiContent[lang].trim()) {
            return apiContent[lang];
          }
        }
        
        // Use first available non-empty content
        const availableContent = Object.values(apiContent).find((content: any) => 
          typeof content === 'string' && content.trim()
        );
        if (availableContent) {
          return availableContent as string;
        }
      }
    }
    
    // Priority 2: Fallback translations
    if (fallbackTranslations) {
      const localeKey = locale === 'en' ? 'en' : locale;
      if (fallbackTranslations[localeKey]) {
        return fallbackTranslations[localeKey];
      }
      
      // Try English fallback
      if (fallbackTranslations.en) {
        return fallbackTranslations.en;
      }
      
      // Use first available translation
      const firstTranslation = Object.values(fallbackTranslations)[0];
      if (firstTranslation) {
        return firstTranslation as string;
      }
    }
    
    // Priority 3: Default content
    return defaultContent || '';
  }, [locale, apiContent, fallbackTranslations, defaultContent]);
}

/**
 * Hook for handling HTML content with translations
 */
export function useHtmlTranslation({
  locale,
  apiContent,
  fallbackKey,
  defaultHtml
}: {
  locale: Locale;
  apiContent?: any;
  fallbackKey?: string;
  defaultHtml?: string;
}) {
  const translatedContent = useTranslationWithFallback({
    locale,
    apiContent,
    fallbackKey,
    defaultText: defaultHtml
  });
  
  return {
    __html: translatedContent
  };
}

