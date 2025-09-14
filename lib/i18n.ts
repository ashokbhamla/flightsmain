export type Locale = 'en' | 'es' | 'ru' | 'fr';

export function localeToLang(locale: Locale): 1 | 2 | 3 | 4 {
  const langMap: Record<Locale, 1 | 2 | 3 | 4> = {
    'en': 1,
    'es': 2,
    'ru': 3,
    'fr': 4
  };
  return langMap[locale];
}

export function localeFromParam(param?: string): Locale {
  const validLocales = ['en', 'es', 'ru', 'fr'];
  return validLocales.includes(param || '') ? param as Locale : 'en';
}
