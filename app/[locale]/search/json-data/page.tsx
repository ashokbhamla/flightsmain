import { Metadata } from 'next';
import TriposiaSimpleExtractor from '../components/TriposiaSimpleExtractor';
import { localeFromParam } from '@/lib/i18n';
import { getPageTranslations } from '@/lib/translations';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = localeFromParam(params.locale);
  const pageTranslations = getPageTranslations(locale, 'search');
  
  return {
    title: 'JSON Flight Data - ' + pageTranslations.title,
    description: 'Extract and view flight data in JSON format',
    keywords: 'flight data, json, itinerary, flight search',
  };
}

interface JsonDataPageProps {
  params: {
    locale: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default function JsonDataPage({ params, searchParams }: JsonDataPageProps) {
  const { locale } = params;
  
  // Parse search code from URL parameters
  // URL format: /en/search/json-data?JFK2310LHR241011
  // The search code is the first (and only) parameter
  const searchCode = Object.keys(searchParams)[0] || '';
  
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">JSON Flight Data Extractor</h1>
              <p className="text-gray-600 mb-4">
                Loads iframe in background and extracts flight data as JSON
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <p className="text-sm">
                  <strong>How it works:</strong> A hidden iframe loads the Triposia widget in the background. 
                  Flight data is extracted and displayed as structured JSON without showing the widget UI.
                </p>
              </div>
            </div>
            
            <TriposiaSimpleExtractor 
              searchCode={searchCode} 
              locale={locale}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

