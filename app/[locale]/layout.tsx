import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SchemaOrg from '@/components/SchemaOrg';
import CriticalCSS from '@/components/CriticalCSS';
import InlineCriticalCSS from '@/components/InlineCriticalCSS';
import ResourceHints from '@/components/ResourceHints';
import ServerCriticalCSS from '@/components/ServerCriticalCSS';
import FontLoader from '@/components/FontLoader';
import PerformanceOptimizer from '@/components/PerformanceOptimizer';
import CriticalResourceLoader from '@/components/CriticalResourceLoader';
import AboveTheFoldOptimizer from '@/components/AboveTheFoldOptimizer';
import ServiceWorker from '@/components/ServiceWorker';
import { Locale, localeFromParam } from '@/lib/i18n';
import { orgSchema, websiteSchema } from '@/lib/schema';
import ClientThemeProvider from '@/components/ClientThemeProvider';
import GoogleAnalytics from '@/components/GoogleAnalytics';
// Removed unused imports for performance
import { envConfig } from '@/lib/envConfig';
import { getTranslations } from '@/lib/translations';
import '@/styles/globals.css';
import '@/styles/components.css';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5 minutes
export const runtime = 'nodejs';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = localeFromParam(params.locale);
  const translations = getTranslations(locale);
  const header = envConfig.header;
  
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com';
  const localePath = locale === 'en' ? '' : `/${locale}`;
  const canonicalUrl = `${baseUrl}${localePath}`;

  // Use translated company name based on locale
  const companyName = locale === 'en' ? 'AirlinesMap' : 
                     locale === 'es' ? 'AirlinesMap' :
                     locale === 'ru' ? 'AirlinesMap' :
                     locale === 'fr' ? 'AirlinesMap' : 'AirlinesMap';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: `${companyName} - ${translations.common.findFlights}`,
      template: `%s | ${companyName}`
    },
    description: translations.footer.description1,
    keywords: ['flights', 'hotels', 'travel', 'booking'],
    openGraph: {
      type: 'website',
      locale: locale === 'es' ? 'es_ES' : locale === 'ru' ? 'ru_RU' : locale === 'fr' ? 'fr_FR' : 'en_US',
      url: canonicalUrl,
      siteName: companyName,
      title: `${companyName} - ${translations.common.findFlights}`,
      description: translations.footer.description1,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${companyName} - ${translations.common.findFlights}`,
      description: translations.footer.description1,
    },
    alternates: { 
      canonical: canonicalUrl,
      languages: { 
        'en': '/', 
        'es': '/es',
        'ru': '/ru',
        'fr': '/fr'
      } 
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
  };
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1e3a8a',
};

export default async function RootLayout({
  children,
  params,
}: { children: React.ReactNode; params: { locale: string } }) {
  const locale: Locale = localeFromParam(params.locale);
  const header = envConfig.header;
  const footer = envConfig.footer;

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="preload"
          as="style"
        />
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
            rel="stylesheet"
          />
        </noscript>
        <link rel="preload" href="/fonts/playfair-display.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/styles/critical.css" as="style" />
        <noscript><link rel="stylesheet" href="/styles/critical.css" /></noscript>
        <link rel="stylesheet" href="/styles/critical.css" />
        <ServerCriticalCSS />
        <meta name="theme-color" content="#1e3a8a" />
        <meta name="msapplication-TileColor" content="#1e3a8a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>
        <GoogleAnalytics />
        <ClientThemeProvider>
          <FontLoader />
          <InlineCriticalCSS />
          <ResourceHints />
          <CriticalCSS />
          <PerformanceOptimizer />
          <CriticalResourceLoader />
          <AboveTheFoldOptimizer />
          <ServiceWorker />
          <Header locale={locale} />
          {children}
          <Footer data={footer} locale={locale} />
          <SchemaOrg data={[orgSchema(header), websiteSchema(header)].filter(Boolean)} />
        </ClientThemeProvider>
      </body>
    </html>
  );
}
