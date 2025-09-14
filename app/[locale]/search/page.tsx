import { Metadata } from 'next';
import HashSearchHandler from './components/HashSearchHandler';
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

export default function SearchPage({ params, searchParams }: SearchPageProps) {
  const { locale } = params;
  
  // Extract search parameters from URL (fallback for query params)
  const searchCode = searchParams[Object.keys(searchParams)[0]] as string;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="pt-16">
        {/* Search Results Container */}
        <div className="container mx-auto px-4 py-8">
          {/* Hash Search Handler with Triposia Widget */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <HashSearchHandler fallbackSearchCode={searchCode} locale={locale} />
          </div>
        </div>
      </main>
    </div>
  );
}
