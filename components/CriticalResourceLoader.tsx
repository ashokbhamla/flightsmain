'use client';

import { useEffect } from 'react';

const CriticalResourceLoader = () => {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Preload critical resources immediately with high priority
    const preloadCriticalResources = () => {
      // Preload critical CSS with high priority
      const criticalCSS = [
        '/styles/critical.css',
        '/_next/static/css/app/layout.css',
        '/_next/static/css/app/[locale]/layout.css',
      ];

      criticalCSS.forEach((href) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = 'style';
        link.setAttribute('fetchpriority', 'high');
        link.onload = () => {
          link.rel = 'stylesheet';
        };
        document.head.appendChild(link);
      });

      // Preload critical JS chunks with high priority
      const criticalJS = [
        '/_next/static/chunks/main-app.js',
      ];

      criticalJS.forEach((href) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = 'script';
        link.setAttribute('fetchpriority', 'high');
        document.head.appendChild(link);
      });

      // Preload critical fonts with high priority
      const criticalFonts = [
        'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
        'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vsZELXJgDzN6YJ8wJ4J0oR8D2Q.woff2'
      ];

      criticalFonts.forEach((href) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        link.setAttribute('fetchpriority', 'high');
        document.head.appendChild(link);
      });

      // Preload critical images
      const criticalImages = [
        '/favicon.ico',
        '/logo.png',
      ];

      criticalImages.forEach((src) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = src;
        link.as = 'image';
        link.setAttribute('fetchpriority', 'high');
        document.head.appendChild(link);
      });
    };

    // Run immediately
    preloadCriticalResources();

    // Preload additional resources on idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Preload additional CSS
        const additionalCSS = [
          '/_next/static/css/app/[locale]/page.css',
          '/_next/static/css/app/[locale]/loading.css',
        ];

        additionalCSS.forEach((resource) => {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = resource;
          link.as = 'style';
          link.setAttribute('fetchpriority', 'low');
          document.head.appendChild(link);
        });

        // Prefetch likely pages
        const likelyPages = [
          '/en/search',
          '/en/flights',
          '/en/airlines',
        ];

        likelyPages.forEach((page) => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = page;
          document.head.appendChild(link);
        });

        // Prefetch API endpoints
        const apiEndpoints = [
          '/api/airports/search',
          '/api/flight-data',
          '/api/airline-data',
        ];

        apiEndpoints.forEach((endpoint) => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = endpoint;
          document.head.appendChild(link);
        });
      });
    }
  }, []);

  return null;
};

export default CriticalResourceLoader;
