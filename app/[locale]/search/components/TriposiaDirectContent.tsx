'use client';

import { useEffect, useState, useRef } from 'react';
import { useTranslations } from '@/lib/translations';

interface TriposiaDirectContentProps {
  searchCode?: string;
  locale?: string;
}

export default function TriposiaDirectContent({ searchCode, locale = 'en' }: TriposiaDirectContentProps) {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const translations = useTranslations(locale as 'en' | 'es' | 'ru' | 'fr');

  useEffect(() => {
    const fetchContent = async () => {
      if (!searchCode) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch HTML content from our proxy API
        const response = await fetch(`/api/triposia-content?searchCode=${encodeURIComponent(searchCode)}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch content: ${response.status}`);
        }

        const html = await response.text();
        setHtmlContent(html);
      } catch (err) {
        console.error('Error loading Triposia content:', err);
        setError('Failed to load search widget. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [searchCode]);

  // Handle clicks in the rendered content
  useEffect(() => {
    if (!contentRef.current) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if it's a booking button
      const button = target.closest('[class*="ticket-action"], [class*="book"], [class*="select"]');
      
      if (button) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Booking button clicked');
        
        // Send message to parent
        window.parent?.postMessage({
          type: 'bookingButtonClick',
          action: 'openBooking',
          timestamp: new Date().toISOString()
        }, '*');
      }
    };

    const container = contentRef.current;
    container.addEventListener('click', handleClick);

    return () => {
      container.removeEventListener('click', handleClick);
    };
  }, [htmlContent]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{translations.common.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {translations.common.refresh || 'Refresh Page'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div 
        ref={contentRef}
        className="triposia-content-wrapper"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        style={{
          minHeight: '800px',
        }}
      />
      <style jsx global>{`
        .triposia-content-wrapper {
          width: 100%;
        }
        
        .triposia-content-wrapper :global(*) {
          max-width: 100%;
        }
        
        /* Ensure images don't overflow */
        .triposia-content-wrapper :global(img) {
          max-width: 100%;
          height: auto;
        }
        
        /* Fix relative URLs */
        .triposia-content-wrapper :global([href^="/"]) {
          /* Convert relative URLs to absolute Triposia URLs */
        }
        
        /* Make sure clickable elements are visible */
        .triposia-content-wrapper :global([class*="button"], [class*="clickable"]) {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}


