import { Metadata } from 'next';
import HashSearchHandler from './components/HashSearchHandler';
import FlightCards from './components/FlightCards';
import { localeFromParam } from '@/lib/i18n';
import { getPageTranslations } from '@/lib/translations';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = localeFromParam(params.locale);
  const pageTranslations = getPageTranslations(locale, 'search');
  
  return {
    title: pageTranslations.title,
    description: pageTranslations.description,
    keywords: 'flight search, compare flights, airline tickets, travel deals',
    openGraph: {
      title: pageTranslations.title,
      description: pageTranslations.description,
      type: 'website',
    },
    other: {
      'X-Frame-Options': 'ALLOWALL',
      'Content-Security-Policy': "frame-ancestors 'self' https://search.triposia.com https://*.triposia.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://search.triposia.com https://aswidgets.travelpayouts.com https://*.travelpayouts.com; connect-src 'self' https://search.triposia.com https://aswidgets.travelpayouts.com https://*.travelpayouts.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https:;",
    },
  };
}

interface SearchPageProps {
  params: {
    locale: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { locale } = params;
  
  // Support both legacy searchCode and explicit query params
  // Legacy URL format: /en/search?JFK2310LHR241011
  const searchCode = Object.keys(searchParams).length === 1 && !('from' in searchParams)
    ? Object.keys(searchParams)[0]
    : undefined;

  // New query param format
  const from = (searchParams.from as string) || undefined;
  const to = (searchParams.to as string) || undefined;
  const date = (searchParams.date as string) || undefined;
  const returnDate = (searchParams.returnDate as string) || undefined;
  const adults = searchParams.adults ? parseInt(searchParams.adults as string) : undefined;
  const childPax = searchParams.children ? parseInt(searchParams.children as string) : undefined;
  const infants = searchParams.infants ? parseInt(searchParams.infants as string) : undefined;
  const curr = (searchParams.curr as string) || undefined;
  const cabin = (searchParams.cabin as string) || undefined;
  
  console.log('Search page - searchParams keys:', Object.keys(searchParams));
  console.log('Search page - searchCode:', searchCode);
  
  // Try server-side Tequila fetch when explicit params present
  let initialFlights: any[] | undefined = undefined;
  try {
    if (from && to && date) {
      const TEQUILA_BASE_URL = 'https://api.tequila.kiwi.com/v2/search';
      const qs = new URLSearchParams();
      qs.set('fly_from', from);
      qs.set('fly_to', to);
      // date ISO to DD/MM/YYYY
      const toKiwiDate = (iso: string) => {
        const d = new Date(iso);
        const dd = String(d.getUTCDate()).padStart(2, '0');
        const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
        const yyyy = d.getUTCFullYear();
        return `${dd}/${mm}/${yyyy}`;
      };
      const dep = toKiwiDate(date);
      qs.set('date_from', dep);
      qs.set('date_to', dep);
      if (returnDate) {
        const ret = toKiwiDate(returnDate);
        qs.set('return_from', ret);
        qs.set('return_to', ret);
      }
      if (adults) qs.set('adults', String(adults));
      if (childPax) qs.set('children', String(childPax));
      if (curr) qs.set('curr', curr);
      if (cabin) qs.set('selected_cabins', cabin.toUpperCase());
      qs.set('limit', '30');
      qs.set('sort', 'price');
      qs.set('asc', '1');

      const apiKey = process.env.TEQUILA_API_KEY as string | undefined;
      if (apiKey) {
        const res = await fetch(`${TEQUILA_BASE_URL}?${qs.toString()}`, {
          headers: { apikey: apiKey, accept: 'application/json' },
          cache: 'no-store',
        });
        if (res.ok) {
          const json = await res.json();
          initialFlights = Array.isArray(json?.data) ? json.data : [];
        }
      }
    }
  } catch {}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="pt-16">
        {/* Search Results Container */}
        <div className="container mx-auto px-4 py-8">
          {/* Hash Search Handler with Triposia Widget (Hidden for Background) */}
          <div className="hidden">
            <HashSearchHandler fallbackSearchCode={searchCode} locale={locale} />
          </div>
          
          {/* Flight Cards - Main Results */}
          <FlightCards
            searchCode={searchCode}
            from={from}
            to={to}
            date={date}
            returnDate={returnDate}
            adults={adults}
            childPax={childPax}
            infants={infants}
            curr={curr}
            cabin={cabin}
            initialFlights={initialFlights as any}
            locale={locale}
          />
        </div>
      </main>
    </div>
  );
}
