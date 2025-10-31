'use client';

import { useEffect, useState, useRef } from 'react';
import { useTranslations } from '@/lib/translations';

interface FlightData {
  [key: string]: any;
}

interface TriposiaDataExtractorProps {
  searchCode?: string;
  locale?: string;
}

export default function TriposiaDataExtractor({ searchCode, locale = 'en' }: TriposiaDataExtractorProps) {
  const [flightData, setFlightData] = useState<FlightData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const translations = useTranslations(locale as 'en' | 'es' | 'ru' | 'fr');

  useEffect(() => {
    if (!searchCode) return;

    const extractFlightData = () => {
      try {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) return;

        // Try to extract flight data from various possible structures
        const flightSelectors = [
          '[data-flight]',
          '[class*="flight-card"]',
          '[class*="flight-row"]',
          '[class*="ticket"]',
          '[class*="route"]',
          '.flight-item',
          '.route-item',
          '[role="listitem"]'
        ];

        const flights: FlightData[] = [];

        for (const selector of flightSelectors) {
          const elements = iframeDoc.querySelectorAll(selector);
          
          elements.forEach((element, index) => {
            const flight: FlightData = {
              id: index + 1,
              rawHTML: element.outerHTML,
              textContent: element.textContent || '',
            };

            // Try to extract structured data
            const priceElement = element.querySelector('[class*="price"], [class*="cost"], [class*="fare"]');
            if (priceElement) {
              flight.price = priceElement.textContent?.trim();
            }

            const routeElement = element.querySelector('[class*="route"], [class*="path"], [class*="origin-destination"]');
            if (routeElement) {
              flight.route = routeElement.textContent?.trim();
            }

            const airlineElement = element.querySelector('[class*="airline"], [class*="carrier"]');
            if (airlineElement) {
              flight.airline = airlineElement.textContent?.trim();
            }

            const timeElement = element.querySelector('[class*="time"], [class*="departure"], [class*="duration"]');
            if (timeElement) {
              flight.time = timeElement.textContent?.trim();
            }

            // Extract all data attributes
            const ds = (element as HTMLElement).dataset;
            if (ds) {
              Object.assign(flight, ds);
            }

            if (flight.textContent && flight.textContent.length > 50) {
              flights.push(flight);
            }
          });

          if (flights.length > 0) break;
        }

        // Also try to find JSON data in script tags
        const scripts = iframeDoc.querySelectorAll('script');
        scripts.forEach(script => {
          const content = script.textContent || script.innerHTML;
          
          // Look for JSON data
          if (content.includes('flight') || content.includes('route') || content.includes('price')) {
            try {
              // Try to find JSON objects
              const jsonMatches = content.match(/\{[^}]*"(flight|price|route|airline|departure|arrival)"[^}]*\}/g);
              if (jsonMatches) {
                jsonMatches.forEach(match => {
                  try {
                    const json = JSON.parse(match);
                    flights.push({ ...json, source: 'script-json' });
                  } catch (e) {
                    // Not valid JSON, skip
                  }
                });
              }
            } catch (e) {
              // Skip if parsing fails
            }
          }
        });

        // Also extract from global variables in the iframe
        try {
          const iframeWindow = iframe.contentWindow as any;
          if (iframeWindow) {
            // Check for common data variable names
            const dataKeys = ['flights', 'results', 'data', 'routes', 'tickets', 'searchResults'];
            dataKeys.forEach(key => {
              if (iframeWindow[key] && Array.isArray(iframeWindow[key])) {
                flights.push(...iframeWindow[key].map((item: any, idx: number) => ({
                  ...item,
                  source: `window.${key}`,
                  extractedAt: new Date().toISOString()
                })));
              }
            });
          }
        } catch (e) {
          // Cross-origin restrictions, ignore
        }

        if (flights.length > 0) {
          setFlightData(flights);
          setIsLoading(false);
        }
      } catch (e) {
        // Cross-origin or other errors
        console.log('Extraction attempt:', e);
      }
    };

    // Try extraction when iframe loads
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', () => {
        // Wait a bit for content to load
        setTimeout(extractFlightData, 3000);
        setTimeout(extractFlightData, 5000);
        setTimeout(extractFlightData, 10000);
      });
    }

    // Periodic extraction attempts
    const intervalId = setInterval(extractFlightData, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [searchCode]);

  return (
    <div className="w-full">
      {/* Hidden iframe for data extraction */}
      <iframe
        ref={iframeRef}
        src={`https://search.triposia.com/flights/${searchCode || ''}`}
        style={{
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          width: '1px',
          height: '1px',
          border: 'none',
          visibility: 'hidden',
          pointerEvents: 'none',
        }}
        sandbox="allow-same-origin allow-scripts"
      />

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{translations.common.loading}</p>
            <p className="text-sm text-gray-500 mt-2">Extracting flight data...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <p className="text-red-600 mb-4">{error}</p>
          </div>
        </div>
      )}

      {/* Display extracted data */}
      {!isLoading && !error && flightData.length > 0 && (
        <div className="space-y-4">
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-4">
            <h2 className="text-xl font-bold text-green-800 mb-2">
              ✅ Flight Data Extracted ({flightData.length} items)
            </h2>
            <p className="text-sm text-green-700">Data extracted from hidden iframe</p>
          </div>

          {/* JSON Display */}
          <div className="bg-gray-900 rounded-lg p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Raw JSON Data</h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(flightData, null, 2));
                  alert('Copied to clipboard!');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
              >
                Copy JSON
              </button>
            </div>
            <pre className="overflow-auto max-h-96 text-xs">
              {JSON.stringify(flightData, null, 2)}
            </pre>
          </div>

          {/* Formatted Display */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Formatted Flight Data</h3>
            <div className="grid gap-4">
              {flightData.map((flight, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-blue-600">
                      Flight #{index + 1}
                    </span>
                    {flight.source && (
                      <span className="text-xs text-gray-500">
                        Source: {flight.source}
                      </span>
                    )}
                  </div>
                  
                  {flight.route && (
                    <div className="mb-2">
                      <span className="text-sm font-medium">Route: </span>
                      <span className="text-gray-700">{flight.route}</span>
                    </div>
                  )}
                  
                  {flight.airline && (
                    <div className="target-gray-700 mb-2">
                      <span className="text-sm font-medium">Airline: </span>
                      <span>{flight.airline}</span>
                    </div>
                  )}
                  
                  {flight.price && (
                    <div className="text-lg font-bold text-green-600 mb-2">
                      {flight.price}
                    </div>
                  )}
                  
                  {flight.time && (
                    <div className="text-sm text-gray-600 mb-2">
                      {flight.time}
                    </div>
                  )}
                  
                  {flight.textContent && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-gray-500">
                        Full Content
                      </summary>
                      <pre className="mt-2 text-xs text-gray-600 max-h-32 overflow-auto">
                        {flight.textContent.substring(0, 500)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No data state */}
      {!isLoading && !error && flightData.length === 0 && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-yellow-500 text-xl mb-4">⚠️</div>
            <p className="text-gray-600 mb-2">No flight data extracted yet</p>
            <p className="text-sm text-gray-500">The iframe is loading in the background...</p>
            <p className="text-xs text-gray-400 mt-2">This may take 10-30 seconds</p>
          </div>
        </div>
      )}
    </div>
  );
}


