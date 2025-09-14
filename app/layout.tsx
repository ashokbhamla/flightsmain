import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

export const metadata: Metadata = {
  title: 'AirlinesMap - Find Flights',
  description: 'Helps you find the cheapest flight deals to any destination with ease.',
  keywords: 'flights,hotels,travel,booking',
  authors: [{ name: 'AirlinesMap' }],
  creator: 'AirlinesMap',
  publisher: 'AirlinesMap',
  robots: 'index, follow',
  openGraph: {
    title: 'AirlinesMap - Find Flights',
    description: 'Helps you find the cheapest flight deals to any destination with ease.',
    url: 'https://airlinesmap.com',
    siteName: 'AirlinesMap',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AirlinesMap - Find Flights',
    description: 'Helps you find the cheapest flight deals to any destination with ease.',
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1e3a8a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="canonical" href="https://airlinesmap.com" />
        <meta name="theme-color" content="#1e3a8a" />
        <meta name="msapplication-TileColor" content="#1e3a8a" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}