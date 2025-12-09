import { headers } from 'next/headers';
import { localeFromParam } from '@/lib/i18n';
import { getLocationWithFallbacks } from '@/lib/server-geoip';
import HomePageContent from './components/HomePageContent';
import ErrorBoundary from '@/components/ErrorBoundary';

interface HomePageProps {
  params: {
    locale: string;
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const locale = localeFromParam(params.locale);

  // Get user location from server-side headers
  const headersList = await headers();
  const userLocation = getLocationWithFallbacks(headersList);

  // Always show the original home page
  return (
    <ErrorBoundary>
      <HomePageContent 
        locale={locale}
        userLocation={userLocation}
      />
    </ErrorBoundary>
  );
}