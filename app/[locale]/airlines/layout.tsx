import { Metadata } from 'next';
import { generateAlternateUrls } from '@/lib/canonical';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://flightsearchs.com';
  
  return {
    title: {
      template: '%s | FlightSearchs - Compare Airlines & Find Best Deals',
      default: 'Airlines - Compare US Airlines & Find Best Flight Deals | FlightSearchs'
    },
    description: 'Compare major US airlines including American Airlines, Delta, United, Southwest, and more. Find the best flight deals, routes, and airline information for domestic and international travel.',
    keywords: [
      'airlines',
      'US airlines',
      'American Airlines',
      'Delta Airlines',
      'United Airlines',
      'Southwest Airlines',
      'flight comparison',
      'airline deals',
      'domestic flights',
      'international flights',
      'flight search',
      'cheap flights',
      'airline routes',
      'flight booking'
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
      canonical: `${baseUrl}/${locale}/airlines`,
      languages: generateAlternateUrls('/airlines')
    },
    openGraph: {
      title: 'Airlines - Compare US Airlines & Find Best Flight Deals',
      description: 'Compare major US airlines including American Airlines, Delta, United, Southwest, and more. Find the best flight deals and routes.',
      url: `${baseUrl}/${locale}/airlines`,
      siteName: 'FlightSearchs',
      locale: locale,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/images/airlines-og.jpg`,
          width: 1200,
          height: 630,
          alt: 'US Airlines Comparison - FlightSearchs',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Airlines - Compare US Airlines & Find Best Flight Deals',
      description: 'Compare major US airlines including American Airlines, Delta, United, Southwest, and more. Find the best flight deals and routes.',
      images: [`${baseUrl}/images/airlines-og.jpg`],
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

export default function AirlinesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
