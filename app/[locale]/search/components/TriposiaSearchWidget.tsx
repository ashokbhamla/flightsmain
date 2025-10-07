'use client';

import { useEffect, useState, useRef } from 'react';
import { useTranslations } from '@/lib/translations';

interface TriposiaSearchWidgetProps {
  searchCode?: string;
  locale?: string;
}

export default function TriposiaSearchWidget({ searchCode, locale = 'en' }: TriposiaSearchWidgetProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSearchCode, setCurrentSearchCode] = useState<string | undefined>(searchCode);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const translations = useTranslations(locale as 'en' | 'es' | 'ru' | 'fr');

  // Update currentSearchCode when searchCode prop changes
  useEffect(() => {
    setCurrentSearchCode(searchCode);
  }, [searchCode]);

  // Handle postMessage communication with iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from Triposia domain
      if (event.origin !== 'https://search.triposia.com') {
        return;
      }

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        
        // Handle URL changes from iframe
        if (data.type === 'urlChange' && data.url) {
          console.log('Received URL change from iframe:', data.url);
          
          // Extract search code from URL (handle hash, direct URL, and query formats)
          const hashMatch = data.url.match(/#\/flights\/(.+)/);
          const directMatch = data.url.match(/\/flights\/(.+)/);
          const queryMatch = data.url.match(/[?&]q=([^&]+)/);
          
          let newSearchCode = null;
          if (hashMatch && hashMatch[1]) {
            newSearchCode = hashMatch[1];
          } else if (directMatch && directMatch[1]) {
            newSearchCode = directMatch[1];
          } else if (queryMatch && queryMatch[1]) {
            newSearchCode = decodeURIComponent(queryMatch[1]);
          }
          
          if (newSearchCode) {
            console.log('Extracted search code:', newSearchCode);
            
            // Update the parent window URL
            const newUrl = `${window.location.pathname}#/flights/${newSearchCode}`;
            window.history.replaceState(null, '', newUrl);
            
            // Update local state
            setCurrentSearchCode(newSearchCode);
          }
        }
      } catch (err) {
        console.error('Error parsing iframe message:', err);
      }
    };

    // Listen for messages from iframe
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Fallback: Periodically check iframe URL and sync with parent
  useEffect(() => {
    if (!iframeRef.current) return;

    const checkIframeUrl = () => {
      try {
        if (iframeRef.current?.contentWindow) {
          // Try to access iframe URL (this might fail due to CORS)
          const iframeUrl = iframeRef.current.contentWindow.location.href;
          console.log('Checking iframe URL:', iframeUrl);
          
          // Extract search code from iframe URL (handle hash, direct URL, and query formats)
          const hashMatch = iframeUrl.match(/#\/flights\/(.+)/);
          const directMatch = iframeUrl.match(/\/flights\/(.+)/);
          const queryMatch = iframeUrl.match(/[?&]q=([^&]+)/);
          
          let newSearchCode = null;
          if (hashMatch && hashMatch[1]) {
            newSearchCode = hashMatch[1];
          } else if (directMatch && directMatch[1]) {
            newSearchCode = directMatch[1];
          } else if (queryMatch && queryMatch[1]) {
            newSearchCode = decodeURIComponent(queryMatch[1]);
          }
          
          if (newSearchCode && newSearchCode !== currentSearchCode) {
            console.log('Iframe URL changed, updating parent URL');
            
            // Update the parent window URL
            const newUrl = `${window.location.pathname}#/flights/${newSearchCode}`;
            window.history.replaceState(null, '', newUrl);
            
            // Update local state
            setCurrentSearchCode(newSearchCode);
          }
        }
      } catch (err) {
        // CORS error is expected, this is just a fallback
        console.log('Cannot access iframe URL due to CORS (expected)');
      }
    };

    // Check every 2 seconds as a fallback
    const intervalId = setInterval(checkIframeUrl, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [currentSearchCode]);

  useEffect(() => {
    let isMounted = true;
    
    const loadTriposiaWidget = async () => {
      try {
        if (!isMounted) return;
        
        console.log('Loading Triposia widget with searchCode:', currentSearchCode);
        setIsLoading(true);
        setError(null);

        // Set a timeout in case iframe doesn't load
        timeoutRef.current = setTimeout(() => {
          if (!isMounted) return;
          console.log('Timeout reached, setting error');
          setError('Search widget failed to load. Please refresh the page.');
          setIsLoading(false);
        }, 15000); // Increased timeout to 15 seconds

        // Load the iframe immediately
        console.log('Loading completed, setting isLoading to false');
        setIsLoading(false);

      } catch (err) {
        if (!isMounted) return;
        console.error('Error loading Triposia widget:', err);
        setError('Failed to load search widget. Please try again.');
        setIsLoading(false);
      }
    };

    loadTriposiaWidget();

    // Cleanup function
    return () => {
      isMounted = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [currentSearchCode]);

  return (
    <div className="w-full">
      <div 
        id="triposia-search-widget" 
        className="min-h-[600px] w-full"
        data-search-code={searchCode}
      >
        {isLoading && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">{translations.common.loading}</p>
            </div>
          </div>
        )}
        
        {error && (
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
        )}

        {!isLoading && !error && (
          <div className="w-full relative" style={{ minHeight: '600px' }}>
            {/* Iframe for display only */}
            <iframe
              ref={iframeRef}
              src={`https://search.triposia.com/flights/${currentSearchCode || ''}`}
              width="100%"
              height="600"
              frameBorder="0"
              scrolling="no"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              loading="lazy"
              className="w-full border-0"
              style={{ 
                border: 'none', 
                outline: 'none',
                minHeight: '600px',
                width: '100%',
                pointerEvents: 'none', // Disable all interactions with iframe
              }}
              sandbox="allow-same-origin allow-scripts"
              onLoad={() => {
                console.log('Triposia iframe loaded successfully');
                // Clear timeout on successful load
                if (timeoutRef.current) {
                  clearTimeout(timeoutRef.current);
                  timeoutRef.current = null;
                }
                
                // Send initial message to iframe to enable communication
                if (iframeRef.current?.contentWindow) {
                  iframeRef.current.contentWindow.postMessage({
                    type: 'parentReady',
                    origin: window.location.origin
                  }, 'https://search.triposia.com');
                  
                  // Also try to inject a script to monitor URL changes and button clicks
                  try {
                    const script = document.createElement('script');
                    script.textContent = `
                      (function() {
                        // Monitor URL changes
                        let lastUrl = location.href;
                        new MutationObserver(() => {
                          const url = location.href;
                          if (url !== lastUrl) {
                            lastUrl = url;
                            window.parent.postMessage({
                              type: 'urlChange',
                              url: url
                            }, '*');
                          }
                        }).observe(document, { subtree: true, childList: true });
                        
                        // Listen for popstate events
                        window.addEventListener('popstate', function() {
                          window.parent.postMessage({
                            type: 'urlChange',
                            url: location.href
                          }, '*');
                        });
                        
                        // Monitor for ticket action button clicks
                        document.addEventListener('click', function(e) {
                          const target = e.target;
                          
                          // Check if clicked element or its parent is a ticket action button
                          let button = target;
                          let depth = 0;
                          while (button && depth < 5) {
                            const className = button.className || '';
                            if (className.includes && (
                              className.includes('ticket-action-button-deeplink') ||
                              className.includes('ticket-action-button') ||
                              className.includes('book-button') ||
                              className.includes('select-button')
                            )) {
                              e.preventDefault();
                              e.stopPropagation();
                              
                              // Extract flight data from the page
                              const hash = location.hash || window.location.hash;
                              const match = hash.match(/#\\/flights\\/(.+)/);
                              
                              if (match && match[1]) {
                                const code = match[1];
                                const airportCodes = code.match(/[A-Z]{3}/g);
                                
                                if (airportCodes && airportCodes.length >= 2) {
                                  // Try to find price from nearby elements
                                  let price = '';
                                  let priceElement = button.querySelector('[class*="price"]');
                                  if (!priceElement) {
                                    priceElement = button.closest('[class*="ticket"]')?.querySelector('[class*="price"]');
                                  }
                                  if (priceElement) {
                                    const priceText = priceElement.textContent || '';
                                    const priceMatch = priceText.match(/\\$?(\\d+(?:\\.\\d{2})?)/);
                                    if (priceMatch) {
                                      price = priceMatch[1];
                                    }
                                  }
                                  
                                  window.parent.postMessage({
                                    type: 'bookingButtonClick',
                                    action: 'openBooking',
                                    from: airportCodes[0],
                                    to: airportCodes[1],
                                    price: price,
                                    timestamp: new Date().toISOString()
                                  }, '*');
                                  
                                  console.log('Booking button clicked, message sent to parent');
                                }
                              }
                              return false;
                            }
                            button = button.parentElement;
                            depth++;
                          }
                        }, true);
                      })();
                    `;
                    
                    iframeRef.current.contentDocument?.head?.appendChild(script);
                  } catch (err) {
                    console.log('Cannot inject script into iframe due to CORS (expected)');
                  }
                }
              }}
              onError={(e) => {
                console.error('Failed to load Triposia iframe:', e);
                setError('Failed to load search widget. Please try again.');
              }}
            />
            
            {/* Transparent clickable overlay that sends message to parent */}
            <div
              onClick={() => {
                // Send message to parent to open booking popup
                window.parent.postMessage({
                  type: 'bookingButtonClick',
                  action: 'openBooking',
                  timestamp: new Date().toISOString()
                }, '*');
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'transparent',
                cursor: 'pointer',
                zIndex: 10,
              }}
              title="Click anywhere to book this flight"
            />
          </div>
        )}
      </div>
    </div>
  );
}
