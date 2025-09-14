'use client';

import { useEffect } from 'react';

const ResourceHints = () => {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Add resource hints for critical resources
    const addResourceHint = (href: string, as: string, rel: string = 'preload') => {
      const link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      link.as = as;
      if (as === 'font') {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    };

    // Preload critical resources
    const criticalResources = [
      { href: '/_next/static/css/app/layout.css', as: 'style' },
      { href: '/_next/static/css/app/[locale]/layout.css', as: 'style' },
      { href: '/_next/static/chunks/main-app.js', as: 'script' },
    ];

    // Add resource hints after initial render
    const addHints = () => {
      criticalResources.forEach(({ href, as }) => {
        addResourceHint(href, as);
      });
    };

    // Use requestIdleCallback for non-critical resource hints
    if ('requestIdleCallback' in window) {
      requestIdleCallback(addHints);
    } else {
      setTimeout(addHints, 100);
    }
  }, []);

  return null;
};

export default ResourceHints;
