import { Locale } from './i18n';
export const pathWithLocale = (locale: Locale, path: string) => {
  // For English (default), don't add locale prefix
  if (locale === 'en') {
    return path;
  }
  // For other locales, add the locale prefix
  // Ensure path starts with / for proper URL structure
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${normalizedPath}`;
};
