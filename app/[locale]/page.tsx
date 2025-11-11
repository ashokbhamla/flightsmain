import { headers } from 'next/headers';
import { localeFromParam } from '@/lib/i18n';
import { getLocationWithFallbacks } from '@/lib/server-geoip';
import HomePageContent from './components/HomePageContent';
import LeadPageContent from './components/LeadPageContent';
import ErrorBoundary from '@/components/ErrorBoundary';
import { getAdminSettings } from '@/lib/adminSettings';

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
  const adminSettings = getAdminSettings();

  if (adminSettings.leadPageEnabled) {
    return (
      <ErrorBoundary>
        <LeadPageContent 
          locale={locale}
          phoneNumber={adminSettings.phoneNumber}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <HomePageContent 
        locale={locale}
        userLocation={userLocation}
      />
    </ErrorBoundary>
  );
}