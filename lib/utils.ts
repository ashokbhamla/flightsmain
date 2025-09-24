/**
 * Utility functions for the application
 */

/**
 * Convert airline slug to airline code
 * Maps common airline slugs to their IATA codes
 */
export function getAirlineCodeFromSlug(slug: string): string {
  const airlineCodeMap: { [key: string]: string } = {
    'indigo': '6e',
    'air-india': 'ai',
    'spicejet': 'sg',
    'go-air': 'g8',
    'vistara': 'uk',
    'air-asia': 'i5',
    'jet-airways': '9w',
    'kingfisher': 'it',
    'trujet': '2t',
    'alliance-air': '9i',
    'delta': 'dl',
    'american': 'aa',
    'united': 'ua',
    'southwest': 'wn',
    'jetblue': 'b6',
    'alaska': 'as',
    'spirit': 'nk',
    'frontier': 'f9',
    'allegiant': 'g4',
    'hawaiian': 'ha',
    'lufthansa': 'lh',
    'british-airways': 'ba',
    'air-france': 'af',
    'klm': 'kl',
    'emirates': 'ek',
    'qatar': 'qr',
    'singapore': 'sq',
    'cathay-pacific': 'cx',
    'japan-airlines': 'jl',
    'ana': 'nh',
    'korean-air': 'ke',
    'thai-airways': 'tg',
    'malaysia-airlines': 'mh',
    'garuda-indonesia': 'ga',
    'philippine-airlines': 'pr',
    'vietnam-airlines': 'vn',
    'china-eastern': 'mu',
    'china-southern': 'cz',
    'air-china': 'ca',
    'turkish-airlines': 'tk',
    'egyptair': 'ms',
    'ethiopian-airlines': 'et',
    'kenya-airways': 'kq',
    'south-african-airways': 'sa',
    'aeroflot': 'su',
    'swiss': 'lx',
    'austrian': 'os',
    'sas': 'sk',
    'iberia': 'ib',
    'tap': 'tp',
    'alitalia': 'az',
    'aer-lingus': 'ei',
    'finnair': 'ay',
    'lot': 'lo',
    'czech-airlines': 'ok',
    'tarom': 'ro',
    'bulgaria-air': 'fb',
    'croatia-airlines': 'ou',
    'adria-airways': 'jp',
    'air-serbia': 'ju',
    'montenegro-airlines': 'ym',
    'balkan-airlines': 'lz'
  };
  
  return airlineCodeMap[slug.toLowerCase()] || slug.toUpperCase();
}
