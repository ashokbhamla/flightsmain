'use client';

import { useEffect } from 'react';

const PerformanceOptimizer = () => {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Check if PerformanceObserver is available
    if (!('PerformanceObserver' in window)) {
      console.log('PerformanceObserver not supported');
      return;
    }
    
    // Core Web Vitals monitoring with error handling
    const measureWebVitals = () => {
      try {
        // Measure LCP (Largest Contentful Paint)
        if ('PerformanceObserver' in window) {
          const lcpObserver = new PerformanceObserver((list) => {
            try {
              const entries = list.getEntries();
              const lastEntry = entries[entries.length - 1];
              if (lastEntry) {
                const lcpValue = lastEntry.startTime;
                console.log('LCP:', lcpValue);
                
                if (lcpValue > 2500) {
                  console.warn('⚠️ LCP is too high:', lcpValue, 'ms (target: <2.5s)');
                }
              }
            } catch (error) {
              console.error('LCP measurement error:', error);
            }
          });
          
          try {
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
          } catch (error) {
            console.error('LCP observer error:', error);
          }
        }

        // Measure FCP (First Contentful Paint)
        if ('PerformanceObserver' in window) {
          const fcpObserver = new PerformanceObserver((list) => {
            try {
              const entries = list.getEntries();
              entries.forEach((entry) => {
                if (entry.name === 'first-contentful-paint') {
                  const fcpValue = entry.startTime;
                  console.log('FCP:', fcpValue);
                  
                  if (fcpValue > 1500) {
                    console.warn('⚠️ FCP is too high:', fcpValue, 'ms (target: <1.5s)');
                  }
                }
              });
            } catch (error) {
              console.error('FCP measurement error:', error);
            }
          });
          
          try {
            fcpObserver.observe({ entryTypes: ['paint'] });
          } catch (error) {
            console.error('FCP observer error:', error);
          }
        }
      } catch (error) {
        console.error('Web Vitals measurement error:', error);
      }
    };

    // Run measurements after page load
    const timeoutId = setTimeout(() => {
      measureWebVitals();
    }, 1000);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return null;
};

export default PerformanceOptimizer;
