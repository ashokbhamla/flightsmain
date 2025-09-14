'use client';

import { useEffect } from 'react';

const FontLoader = () => {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Load Google Fonts asynchronously
    const loadGoogleFonts = () => {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap';
      link.rel = 'stylesheet';
      link.media = 'print';
      link.onload = () => {
        link.media = 'all';
      };
      document.head.appendChild(link);
    };

    // Load critical CSS asynchronously
    const loadCriticalCSS = () => {
      const link = document.createElement('link');
      link.href = '/styles/critical.css';
      link.rel = 'stylesheet';
      link.media = 'print';
      link.onload = () => {
        link.media = 'all';
      };
      document.head.appendChild(link);
    };

    // Load fonts and CSS after initial render
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        loadGoogleFonts();
        loadCriticalCSS();
      });
    } else {
      loadGoogleFonts();
      loadCriticalCSS();
    }
  }, []);

  return null;
};

export default FontLoader;
