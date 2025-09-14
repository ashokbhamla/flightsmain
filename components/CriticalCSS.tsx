'use client';

import { useEffect } from 'react';

const CriticalCSS = () => {
  useEffect(() => {
    // Load non-critical CSS asynchronously
    const loadCSS = (href: string) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.media = 'print';
      link.onload = () => {
        link.media = 'all';
      };
      document.head.appendChild(link);
    };

    // Load MUI CSS asynchronously
    const muiCSS = document.querySelector('link[href*="mui"]') as HTMLLinkElement;
    if (muiCSS) {
      muiCSS.media = 'print';
      muiCSS.onload = () => {
        muiCSS.media = 'all';
      };
    }

    // Preload critical resources
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.href = '/_next/static/css/app/layout.css';
    preloadLink.as = 'style';
    document.head.appendChild(preloadLink);

    // Load CSS after critical rendering
    const loadNonCriticalCSS = () => {
      loadCSS('/_next/static/css/app/[locale]/layout.css');
    };

    // Load after initial paint
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadNonCriticalCSS);
    } else {
      loadNonCriticalCSS();
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', loadNonCriticalCSS);
    };
  }, []);

  return null;
};

export default CriticalCSS;