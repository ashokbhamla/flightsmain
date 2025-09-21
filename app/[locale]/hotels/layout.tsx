import { Metadata } from 'next';
import { generateAlternateUrls } from '@/lib/canonical';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://flightsearchs.com';
  
  return {
    title: {
      template: `%s | ${process.env.NEXT_PUBLIC_COMPANY_NAME || 'AirlinesMap'} - Airport Hotels & Accommodations`,
      default: `Hotels Near US Airports - Find Airport Hotels in America | ${process.env.NEXT_PUBLIC_COMPANY_NAME || 'AirlinesMap'}`
    },
    description: 'Discover the best hotels near major US airports including LAX, JFK, ATL, ORD, DFW, and more. Find comfortable accommodations with airport shuttle service, great amenities, and competitive rates.',
    keywords: [
      'airport hotels',
      'US airport hotels',
      'hotels near LAX',
      'hotels near JFK',
      'hotels near ATL',
      'hotels near ORD',
      'hotels near DFW',
      'airport shuttle hotels',
      'hotel booking',
      'airport accommodation',
      'US hotels',
      'airport proximity hotels',
      'hotels near airports',
      'airport hotel deals',
      'convenient airport hotels'
    ],
    authors: [{ name: `${process.env.NEXT_PUBLIC_COMPANY_NAME || 'AirlinesMap'} Team` }],
    creator: process.env.NEXT_PUBLIC_COMPANY_NAME || 'AirlinesMap',
    publisher: process.env.NEXT_PUBLIC_COMPANY_NAME || 'AirlinesMap',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}/hotels`,
      languages: generateAlternateUrls('/hotels')
    },
    openGraph: {
      title: 'Hotels Near US Airports - Find Airport Hotels in America',
      description: 'Discover the best hotels near major US airports including LAX, JFK, ATL, ORD, DFW, and more. Find comfortable accommodations with airport shuttle service, great amenities, and competitive rates.',
      url: `${baseUrl}/${locale}/hotels`,
      siteName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'AirlinesMap',
      locale: locale,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/images/airport-hotels-og.jpg`,
          width: 1200,
          height: 630,
          alt: `US Airport Hotels - ${process.env.NEXT_PUBLIC_COMPANY_NAME || 'AirlinesMap'}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Hotels Near US Airports - Find Airport Hotels in America',
      description: 'Discover the best hotels near major US airports including LAX, JFK, ATL, ORD, DFW, and more. Find comfortable accommodations with airport shuttle service, great amenities, and competitive rates.',
      images: [`${baseUrl}/images/airport-hotels-og.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

export default function HotelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
