'use client';

import { useEffect } from 'react';

const AboveTheFoldOptimizer = () => {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Optimize above-the-fold rendering
    const optimizeAboveTheFold = () => {
      // Force layout calculation for critical elements
      const criticalElements = document.querySelectorAll(
        '.MuiAppBar-root, .MuiToolbar-root, .MuiTypography-h6, .MuiButton-root'
      );

      criticalElements.forEach((element) => {
        // Force reflow to ensure layout is calculated
        element.getBoundingClientRect();
        
        // Add critical class for immediate rendering
        element.classList.add('critical-render');
      });

      // Preload hero images and critical content
      const heroImages = document.querySelectorAll('img[data-hero]');
      heroImages.forEach((img) => {
        const imageElement = img as HTMLImageElement;
        if (imageElement.dataset.src) {
          imageElement.src = imageElement.dataset.src;
          imageElement.classList.add('loaded');
        }
      });

      // Optimize font loading
      if ('fonts' in document) {
        document.fonts.ready.then(() => {
          document.body.classList.add('fonts-loaded');
        });
      }

      // Preload critical API calls
      const criticalAPIs = [
        '/api/airports/search?q=',
        '/api/flight-data?',
      ];

      criticalAPIs.forEach((api) => {
        // Use fetch with no-cors to preload
        fetch(api, { mode: 'no-cors' }).catch(() => {
          // Ignore errors for preloading
        });
      });
    };

    // Run immediately
    optimizeAboveTheFold();

    // Run again after a short delay to catch dynamically loaded content
    setTimeout(optimizeAboveTheFold, 100);

    // Add intersection observer for above-the-fold content
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-viewport');
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50% 0px' }
      );

      const aboveFoldElements = document.querySelectorAll(
        '.MuiAppBar-root, .MuiToolbar-root, .MuiTypography-h6, .MuiButton-root'
      );

      aboveFoldElements.forEach((element) => {
        observer.observe(element);
      });

      return () => observer.disconnect();
    }
  }, []);

  return null;
};

export default AboveTheFoldOptimizer;
