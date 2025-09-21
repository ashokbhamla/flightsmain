import { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
      template: `%s | ${process.env.NEXT_PUBLIC_COMPANY_NAME || 'AirlinesMap'}`,
      default: `Search Flights | ${process.env.NEXT_PUBLIC_COMPANY_NAME || 'AirlinesMap'}`,
    },
  description: 'Search and compare flights from multiple airlines to find the best deals.',
  keywords: 'flight search, compare flights, airline tickets, travel deals, flight booking',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: `Search Flights | ${process.env.NEXT_PUBLIC_COMPANY_NAME || 'AirlinesMap'}`,
    description: 'Search and compare flights from multiple airlines to find the best deals.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Search Flights | ${process.env.NEXT_PUBLIC_COMPANY_NAME || 'AirlinesMap'}`,
    description: 'Search and compare flights from multiple airlines to find the best deals.',
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
