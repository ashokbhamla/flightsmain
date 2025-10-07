'use client';

import { useEffect, useState } from 'react';
import TriposiaSearchWidget from './TriposiaSearchWidget';
import FlightPopup from '@/components/FlightPopup';
import BookingPopup from '@/components/BookingPopup';
import { useTranslations } from '@/lib/translations';

interface HashSearchHandlerProps {
  fallbackSearchCode?: string;
  locale?: string;
}

export default function HashSearchHandler({ fallbackSearchCode, locale = 'en' }: HashSearchHandlerProps) {
  const [searchCode, setSearchCode] = useState<string | undefined>(fallbackSearchCode);
  const [isClient, setIsClient] = useState(typeof window !== 'undefined');
  const [showPopup, setShowPopup] = useState(false);
  const [showBookingPopup, setShowBookingPopup] = useState(false);
  const [popupData, setPopupData] = useState<any>(null);
  const [bookingData, setBookingData] = useState<any>(null);
  const [iframePrice, setIframePrice] = useState<string | null>(null);
  const translations = useTranslations(locale as any);

  useEffect(() => {
    // Set client-side flag
    setIsClient(true);
    
    // Listen for messages from iframe and overlay
    const handleMessage = (event: MessageEvent) => {
      // Accept messages from our own origin or Triposia
      const isValidOrigin = event.origin === window.location.origin || 
                           event.origin === 'https://search.triposia.com';
      
      if (!isValidOrigin) return;
      
      if (event.data && typeof event.data === 'object') {
        // Handle booking button click
        if (event.data.type === 'bookingButtonClick' || event.data.action === 'openBooking') {
          console.log('Booking button clicked, opening booking popup');
          
          // Extract flight data from URL hash
          const hash = window.location.hash;
          const match = hash.match(/#\/flights\/(.+)/);
          
          if (match && match[1]) {
            const code = match[1];
            const airportCodes = code.match(/[A-Z]{3}/g);
            
            if (airportCodes && airportCodes.length >= 2) {
              const from = airportCodes[0];
              const to = airportCodes[1];
              
              // Map airport codes to city names
              const cityMap: { [key: string]: string } = {
                'DEL': 'Delhi', 'BOM': 'Mumbai', 'BLR': 'Bangalore', 'HYD': 'Hyderabad',
                'CCU': 'Kolkata', 'MAA': 'Chennai', 'LAS': 'Las Vegas', 'AUS': 'Austin',
                'JFK': 'New York', 'LAX': 'Los Angeles', 'LHR': 'London', 'CDG': 'Paris',
                'FRA': 'Frankfurt', 'DXB': 'Dubai', 'SIN': 'Singapore', 'NRT': 'Tokyo',
                'ICN': 'Seoul', 'SYD': 'Sydney', 'MEL': 'Melbourne', 'YYZ': 'Toronto',
                'YVR': 'Vancouver', 'SFO': 'San Francisco', 'ORD': 'Chicago', 'MIA': 'Miami',
                'ATL': 'Atlanta', 'DEN': 'Denver', 'SEA': 'Seattle', 'BOS': 'Boston',
              };
              
              const flightInfo = {
                from,
                to,
                fromCity: cityMap[from] || from,
                toCity: cityMap[to] || to,
                price: event.data.price || iframePrice || '',
                travelers: event.data.travelers || 1,
                class: event.data.class || 'Economy',
                tripType: event.data.tripType || 'Round-Trip',
              };
              
              setBookingData(flightInfo);
              setShowBookingPopup(true);
            }
          }
          return;
        }
        
        // Look for price data in the message
        const priceFields = ['price', 'fare', 'cost', 'amount', 'total', 'cheapest', 'lowest'];
        const prices: number[] = [];
        
        for (const field of priceFields) {
          if (event.data[field]) {
            const price = parseFloat(event.data[field]);
            if (price > 0 && price < 10000) {
              prices.push(price);
            }
          }
        }
        
        // If we have prices, get the cheapest one
        if (prices.length > 0) {
          const cheapestPrice = Math.min(...prices);
          setIframePrice(cheapestPrice.toString());
        }
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Monitor for ticket action button clicks in iframe
    const monitorIframeButtons = () => {
      const iframe = document.querySelector('iframe[src*="search.triposia.com"]') as HTMLIFrameElement;
      if (iframe) {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            // Find all ticket action buttons
            const buttons = iframeDoc.querySelectorAll('[class*="ticket-action-button-deeplink"]');
            
            buttons.forEach((button) => {
              // Remove existing listeners to avoid duplicates
              const newButton = button.cloneNode(true) as HTMLElement;
              button.parentNode?.replaceChild(newButton, button);
              
              // Add click listener
              newButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('Ticket action button clicked');
                
                // Extract flight data from URL hash
                const hash = window.location.hash;
                const match = hash.match(/#\/flights\/(.+)/);
                
                if (match && match[1]) {
                  const code = match[1];
                  const airportCodes = code.match(/[A-Z]{3}/g);
                  
                  if (airportCodes && airportCodes.length >= 2) {
                    const from = airportCodes[0];
                    const to = airportCodes[1];
                    
                    // Extract price from the button or nearby elements
                    let price = iframePrice || '';
                    const priceElement = newButton.closest('[class*="ticket"]')?.querySelector('[class*="price"]');
                    if (priceElement) {
                      const priceText = priceElement.textContent || '';
                      const priceMatch = priceText.match(/\$?(\d+(?:\.\d{2})?)/);
                      if (priceMatch) {
                        price = priceMatch[1];
                      }
                    }
                    
                    // Map airport codes to city names
                    const cityMap: { [key: string]: string } = {
                      'DEL': 'Delhi', 'BOM': 'Mumbai', 'BLR': 'Bangalore', 'HYD': 'Hyderabad',
                      'CCU': 'Kolkata', 'MAA': 'Chennai', 'LAS': 'Las Vegas', 'AUS': 'Austin',
                      'JFK': 'New York', 'LAX': 'Los Angeles', 'LHR': 'London', 'CDG': 'Paris',
                      'FRA': 'Frankfurt', 'DXB': 'Dubai', 'SIN': 'Singapore', 'NRT': 'Tokyo',
                      'ICN': 'Seoul', 'SYD': 'Sydney', 'MEL': 'Melbourne', 'YYZ': 'Toronto',
                      'YVR': 'Vancouver', 'SFO': 'San Francisco', 'ORD': 'Chicago', 'MIA': 'Miami',
                      'ATL': 'Atlanta', 'DEN': 'Denver', 'SEA': 'Seattle', 'BOS': 'Boston',
                    };
                    
                    const flightInfo = {
                      from,
                      to,
                      fromCity: cityMap[from] || from,
                      toCity: cityMap[to] || to,
                      price,
                      travelers: 1,
                      class: 'Economy',
                      tripType: 'Round-Trip',
                    };
                    
                    setBookingData(flightInfo);
                    setShowBookingPopup(true);
                  }
                }
              });
            });
          }
        } catch (e) {
          // Cross-origin restrictions, ignore
        }
      }
    };
    
    // Monitor buttons every 2 seconds
    const buttonMonitorInterval = setInterval(monitorIframeButtons, 2000);
    
    // Also try to extract price from iframe DOM periodically
    const extractPriceFromIframe = () => {
      const iframe = document.querySelector('iframe[src*="search.triposia.com"]') as HTMLIFrameElement;
      if (iframe) {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            // Look for price elements in the iframe - prioritize cheapest prices
            const priceSelectors = [
              '[class*="price"]',
              '[class*="fare"]', 
              '[class*="cost"]',
              '[data-price]',
              '[class*="amount"]',
              '[class*="total"]',
              '.price',
              '.fare',
              '.cost',
              '.amount',
              '.total'
            ];
            
            const allPrices: number[] = [];
            
            for (const selector of priceSelectors) {
              const elements = iframeDoc.querySelectorAll(selector);
              for (const element of elements) {
                const text = element.textContent || '';
                // Match various price formats: $123, 123, $123.45, 123.45, etc.
                const priceMatches = text.match(/\$?(\d+(?:\.\d{2})?)/g);
                if (priceMatches) {
                  for (const match of priceMatches) {
                    const price = parseFloat(match.replace('$', ''));
                    if (price > 0 && price < 10000) {
                      allPrices.push(price);
                    }
                  }
                }
              }
            }
            
            // Sort prices and get the cheapest one
            if (allPrices.length > 0) {
              const cheapestPrice = Math.min(...allPrices);
              setIframePrice(cheapestPrice.toString());
            }
          }
        } catch (e) {
          // Cross-origin restrictions, ignore
        }
      }
    };

    // Check for price every 2 seconds initially, then every 5 seconds
    const priceInterval = setInterval(extractPriceFromIframe, 2000);
    
    // Also try to extract price immediately when iframe loads
    const iframe = document.querySelector('iframe[src*="search.triposia.com"]') as HTMLIFrameElement;
    if (iframe) {
      iframe.addEventListener('load', () => {
        setTimeout(extractPriceFromIframe, 1000);
      });
    }
    
    // Fallback: Look for prices in the main page content
    const extractPriceFromPage = () => {
      const priceElements = document.querySelectorAll('[class*="price"], [class*="fare"], [class*="cost"], [data-price]');
      const allPrices: number[] = [];
      
      for (const element of priceElements) {
        const text = element.textContent || '';
        const priceMatches = text.match(/\$?(\d+(?:\.\d{2})?)/g);
        if (priceMatches) {
          for (const match of priceMatches) {
            const price = parseFloat(match.replace('$', ''));
            if (price > 0 && price < 10000) {
              allPrices.push(price);
            }
          }
        }
      }
      
      if (allPrices.length > 0) {
        const cheapestPrice = Math.min(...allPrices);
        setIframePrice(cheapestPrice.toString());
      }
    };
    
    // Try to extract price from page content as well
    const pagePriceInterval = setInterval(extractPriceFromPage, 3000);
    
    // Extract search code from hash fragment
    const extractSearchCodeFromHash = () => {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash;
        console.log('Current hash:', hash);
        console.log('Current URL:', window.location.href);
        
        // Check if hash matches pattern #/flights/SEARCHCODE
        const match = hash.match(/#\/flights\/(.+)/);
        if (match && match[1]) {
          const extractedCode = match[1];
          console.log('Extracted search code from hash:', extractedCode);
          setSearchCode(extractedCode);
          
          // Parse search code to extract flight data
          parseSearchCodeForPopup(extractedCode);
        } else if (hash === '#/flights' || hash === '#/flights/') {
          // Handle case where hash is just #/flights without search code
          console.log('Hash is #/flights but no search code provided');
          setSearchCode(undefined);
        } else {
          console.log('No valid hash pattern found');
          setSearchCode(undefined);
        }
      }
    };

    // Parse search code to extract flight information for popup
    const parseSearchCodeForPopup = (code: string) => {
      try {
        // Example search code format: DEL1309BOM1
        // This is a simplified parser - you may need to adjust based on your actual format
        const airportCodes = code.match(/[A-Z]{3}/g);
        if (airportCodes && airportCodes.length >= 2) {
          const from = airportCodes[0];
          const to = airportCodes[1];
          
          // Map airport codes to city names
          const cityMap: { [key: string]: string } = {
            'DEL': 'Delhi',
            'BOM': 'Mumbai',
            'BLR': 'Bangalore',
            'HYD': 'Hyderabad',
            'CCU': 'Kolkata',
            'MAA': 'Chennai',
            'LAS': 'Las Vegas',
            'AUS': 'Austin',
            'JFK': 'New York',
            'LAX': 'Los Angeles',
            'LHR': 'London',
            'CDG': 'Paris',
            'FRA': 'Frankfurt',
            'DXB': 'Dubai',
            'SIN': 'Singapore',
            'NRT': 'Tokyo',
            'ICN': 'Seoul',
            'SYD': 'Sydney',
            'MEL': 'Melbourne',
            'YYZ': 'Toronto',
            'YVR': 'Vancouver',
          };

          const flightData = {
            from: from,
            to: to,
            fromCity: cityMap[from] || from,
            toCity: cityMap[to] || to,
            departureDate: 'Wed, 17 Sep',
            returnDate: 'Wed, 24 Sep',
            price: iframePrice || '134',
            originalPrice: iframePrice ? (parseFloat(iframePrice) * 1.5).toFixed(0) : '434',
            travelers: 1,
            class: 'Economy',
            tripType: 'Round-Trip',
          };

          setPopupData(flightData);
          
          // Show popup after 2 seconds
          setTimeout(() => {
            setShowPopup(true);
          }, 2000);
        }
      } catch (error) {
        console.error('Error parsing search code:', error);
      }
    };

    // Extract on mount with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      extractSearchCodeFromHash();
    }, 100);

    // Listen for hash changes
    const handleHashChange = () => {
      extractSearchCodeFromHash();
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(priceInterval);
      clearInterval(pagePriceInterval);
      clearInterval(buttonMonitorInterval);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Update popup data when iframe price changes
  useEffect(() => {
    if (iframePrice && popupData) {
      setPopupData((prev: any) => ({
        ...prev,
        price: iframePrice,
        originalPrice: (parseFloat(iframePrice) * 1.5).toFixed(0)
      }));
    }
  }, [iframePrice, popupData]);

  // Show loading state while determining search code
  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{translations.common.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <TriposiaSearchWidget searchCode={searchCode} locale={locale} />
      <FlightPopup
        open={showPopup}
        onClose={() => setShowPopup(false)}
        flightData={popupData}
      />
      <BookingPopup
        open={showBookingPopup}
        onClose={() => setShowBookingPopup(false)}
        flightData={bookingData}
      />
    </>
  );
}
