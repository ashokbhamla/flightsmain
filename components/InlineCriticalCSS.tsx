'use client';

import { useEffect } from 'react';

const InlineCriticalCSS = () => {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Inline critical CSS to prevent render blocking
    const criticalCSS = `
      /* Critical above-the-fold styles */
      * {
        box-sizing: border-box;
      }
      
      body {
        margin: 0;
        padding: 0;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        line-height: 1.6;
        color: #1a1a1a;
        background-color: #ffffff;
      }
      
      /* Critical layout styles */
      .MuiContainer-root {
        width: 100%;
        margin-left: auto;
        margin-right: auto;
        padding-left: 16px;
        padding-right: 16px;
      }
      
      @media (min-width: 600px) {
        .MuiContainer-root {
          padding-left: 24px;
          padding-right: 24px;
        }
      }
      
      @media (min-width: 900px) {
        .MuiContainer-root {
          padding-left: 32px;
          padding-right: 32px;
        }
      }
      
      /* Critical hero section styles */
      .hero-section {
        background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
        padding: 64px 16px;
        min-height: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .hero-title {
        color: white;
        font-weight: 700;
        font-size: 2.5rem;
        margin-bottom: 16px;
        line-height: 1.2;
      }
      
      .hero-subtitle {
        color: rgba(255, 255, 255, 0.9);
        font-weight: 400;
        font-size: 1.2rem;
        margin-bottom: 32px;
      }
      
      /* Critical button styles */
      .MuiButton-root {
        font-family: inherit;
        font-weight: 600;
        text-transform: none;
        border-radius: 8px;
        padding: 12px 24px;
        min-height: 48px;
        transition: all 0.2s ease-in-out;
      }
      
      .MuiButton-contained {
        background-color: #1e3a8a;
        color: white;
        box-shadow: none;
      }
      
      .MuiButton-contained:hover {
        background-color: #1e40af;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(30, 58, 138, 0.3);
      }
      
      /* Critical card styles */
      .MuiCard-root {
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      
      .MuiCard-root:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      }
      
      /* Critical typography */
      .MuiTypography-h1, .MuiTypography-h2, .MuiTypography-h3 {
        font-weight: 700;
        line-height: 1.2;
        margin-bottom: 16px;
      }
      
      .MuiTypography-h4, .MuiTypography-h5, .MuiTypography-h6 {
        font-weight: 600;
        line-height: 1.3;
        margin-bottom: 12px;
      }
      
      /* Critical loading state */
      .loading-skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
      }
      
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      
      /* Critical responsive styles */
      @media (max-width: 600px) {
        .hero-title {
          font-size: 2rem;
        }
        
        .hero-subtitle {
          font-size: 1rem;
        }
        
        .MuiButton-root {
          min-height: 44px;
          font-size: 16px;
        }
      }
      
      /* Critical font loading optimization */
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400 700;
        font-display: swap;
        src: url('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2') format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
    `;
    
    // Create and inject critical CSS
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    style.setAttribute('data-critical', 'true');
    document.head.insertBefore(style, document.head.firstChild);
    
    // Load non-critical CSS asynchronously
    const loadNonCriticalCSS = () => {
      const nonCriticalCSS = [
        '/_next/static/css/app/layout.css',
        '/_next/static/css/app/[locale]/layout.css'
      ];
      
      nonCriticalCSS.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.media = 'print';
        link.onload = () => {
          link.media = 'all';
        };
        document.head.appendChild(link);
      });
    };
    
    // Load non-critical CSS after initial render
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadNonCriticalCSS);
    } else {
      loadNonCriticalCSS();
    }
  }, []);
  
  return null;
};

export default InlineCriticalCSS;
