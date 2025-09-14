import { Metadata } from 'next';
import { generateAlternateUrls } from '@/lib/canonical';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://flightsearchs.com';
  
  return {
    title: {
      template: '%s | FlightSearchs - My Account',
      default: 'My Account - Manage Your Travel Profile | FlightSearchs'
    },
    description: 'Manage your FlightSearchs account, view booking history, update travel preferences, and access exclusive member benefits.',
    keywords: [
      'my account',
      'user dashboard',
      'travel profile',
      'booking history',
      'travel preferences',
      'member benefits',
      'flight bookings',
      'hotel bookings',
      'travel management'
    ],
    authors: [{ name: 'FlightSearchs Team' }],
    creator: 'FlightSearchs',
    publisher: 'FlightSearchs',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}/my-account`,
      languages: generateAlternateUrls('/my-account')
    },
    openGraph: {
      title: 'My Account - Manage Your Travel Profile',
      description: 'Manage your FlightSearchs account, view booking history, update travel preferences, and access exclusive member benefits.',
      url: `${baseUrl}/${locale}/my-account`,
      siteName: 'FlightSearchs',
      locale: locale,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/images/account-dashboard-og.jpg`,
          width: 1200,
          height: 630,
          alt: 'My Account Dashboard - FlightSearchs',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'My Account - Manage Your Travel Profile',
      description: 'Manage your FlightSearchs account, view booking history, update travel preferences, and access exclusive member benefits.',
      images: [`${baseUrl}/images/account-dashboard-og.jpg`],
    },
    robots: {
      index: false, // Private page, don't index
      follow: true,
    },
  };
}

export default function MyAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
