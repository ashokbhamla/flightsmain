'use client';

import { useEffect } from 'react';

const ServiceWorker = () => {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }

    // Preload critical resources
    const preloadCriticalResources = () => {
      const criticalResources = [
        '/styles/critical.css',
        '/_next/static/css/app/layout.css',
        '/_next/static/css/app/[locale]/layout.css',
        '/_next/static/chunks/main-app.js',
      ];

      criticalResources.forEach((resource) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.endsWith('.css') ? 'style' : 'script';
        document.head.appendChild(link);
      });
    };

    // Run preloading
    preloadCriticalResources();

    // Preload on idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Preload additional resources
        const additionalResources = [
          '/api/airports/search',
          '/api/flight-data',
          '/api/airline-data',
        ];

        additionalResources.forEach((resource) => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = resource;
          document.head.appendChild(link);
        });
      });
    }
  }, []);

  return null;
};

export default ServiceWorker;
