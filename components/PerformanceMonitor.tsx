'use client'

import { useEffect } from 'react'

export default function PerformanceMonitor() {
  useEffect(() => {
    // Core Web Vitals monitoring
    if (typeof window !== 'undefined') {
      import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
        onCLS((metric) => {
          console.log('CLS:', metric.value);
          if (metric.value > 0.1) {
            console.warn('CLS is poor:', metric.value);
          }
        });
        
        onINP((metric) => {
          console.log('INP:', metric.value);
          if (metric.value > 200) {
            console.warn('INP is poor:', metric.value);
          }
        });
        
        onFCP((metric) => {
          console.log('FCP:', metric.value);
          if (metric.value > 1800) {
            console.warn('FCP is poor:', metric.value);
          }
        });
        
        onLCP((metric) => {
          console.log('LCP:', metric.value);
          if (metric.value > 2500) {
            console.warn('LCP is poor:', metric.value);
          }
        });
        
        onTTFB((metric) => {
          console.log('TTFB:', metric.value);
          if (metric.value > 600) {
            console.warn('TTFB is poor:', metric.value);
          }
        });
      }).catch(() => {
        // web-vitals not available, skip monitoring
      })
    }

    // Enhanced performance observer for TBT and Speed Index
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const longTasks: PerformanceEntry[] = [];
      
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) {
            longTasks.push(entry);
          }
        });
      });
      
      const paintObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            console.log('FCP (Paint):', entry.startTime);
          }
        });
      });

      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        paintObserver.observe({ entryTypes: ['paint'] });
      } catch (e) {
        // PerformanceObserver not supported
      }

      // Calculate TBT after 5 seconds
      setTimeout(() => {
        const tbt = longTasks.reduce((total, task) => total + (task.duration - 50), 0);
        console.log('TBT (calculated):', tbt);
        if (tbt > 200) {
          console.warn('TBT is high:', tbt, 'ms');
        }
      }, 5000);
    }
  }, [])

  return null
}
