'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  Button, 
  Typography, 
  Box, 
  Chip, 
  Grid,
  CircularProgress,
  Paper,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AirlinesIcon from '@mui/icons-material/Airlines';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchResultsView from './SearchResultsView';

interface FlightData {
  from: string;
  to: string;
  price?: string;
  airline?: string;
  airlineCode?: string;
  departureDate?: string;
  returnDate?: string;
  duration?: string;
  stops?: number;
  source?: string;
  deepLink?: string;
  fromCity?: string;
  toCity?: string;
  departTime?: string;
  arriveTime?: string;
  totalLayover?: string;
  cabinBagKg?: number;
  holdBagKg?: number;
  bag1Price?: number;
  bag2Price?: number;
  segments?: Array<{
    from: string;
    to: string;
    fromCity?: string;
    toCity?: string;
    dep?: string;
    arr?: string;
    airlineCode?: string;
    flightNo?: number;
    returnIdx?: number;
  }>;
}

interface FlightCardsProps {
  searchCode?: string;
  from?: string;
  to?: string;
  date?: string; // ISO yyyy-mm-dd
  returnDate?: string; // ISO yyyy-mm-dd
  adults?: number;
  childPax?: number;
  infants?: number;
  curr?: string;
  cabin?: string; // M, W, C, F
  initialFlights?: any[];
  locale?: string;
}

export default function FlightCards({ searchCode, from, to, date, returnDate, adults, childPax, infants, curr, cabin, initialFlights, locale }: FlightCardsProps) {
  const [flights, setFlights] = useState<FlightData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [extractionAttempts, setExtractionAttempts] = useState(0);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Hydrate from server-side results if available
  useEffect(() => {
    if (initialFlights && Array.isArray(initialFlights) && initialFlights.length > 0) {
      try {
        const mapped = initialFlights.map((it: any) => {
          const route = Array.isArray(it?.route) ? it.route : [];
          const first = route[0] || {};
          const last = route[route.length - 1] || {};
          const depUtc = first?.dTimeUTC ? new Date((first.dTimeUTC as number) * 1000) : null;
          const retUtc = last?.aTimeUTC ? new Date((last.aTimeUTC as number) * 1000) : null;
          const totalMins = typeof it?.duration?.total === 'number' ? it.duration.total : 0;
          const airline = Array.isArray(it?.airlines) && it.airlines.length > 0 ? it.airlines.join('/') : first?.airline || '';
          const airlineCode = Array.isArray(it?.airlines) && it.airlines.length > 0 ? it.airlines[0] : (first?.airline || '');
          let layoverTotal = 0;
          for (let i = 0; i < route.length - 1; i++) {
            const a = route[i];
            const b = route[i + 1];
            const aArr = a?.local_arrival ? new Date(a.local_arrival) : null;
            const bDep = b?.local_departure ? new Date(b.local_departure) : null;
            if (aArr && bDep) {
              const diff = Math.max(0, Math.round((bDep.getTime() - aArr.getTime()) / 60000));
              layoverTotal += diff;
            }
          }
          const baglimit = it?.baglimit || {};
          const bagsPrice = it?.bags_price || {};
          const segments = route.map((seg: any) => ({
            from: seg?.flyFrom,
            to: seg?.flyTo,
            fromCity: seg?.cityFrom,
            toCity: seg?.cityTo,
            dep: seg?.local_departure,
            arr: seg?.local_arrival,
            airlineCode: seg?.operating_carrier || seg?.airline,
            flightNo: seg?.operating_flight_no || seg?.flight_no,
            returnIdx: seg?.return
          }));
          return {
            from: first?.flyFrom || (from || ''),
            to: last?.flyTo || (to || ''),
            price: typeof it?.price === 'number' ? `$${it.price}` : undefined,
            airline,
            airlineCode,
            departureDate: depUtc ? `${depUtc.getUTCFullYear()}-${String(depUtc.getUTCMonth() + 1).padStart(2, '0')}-${String(depUtc.getUTCDate()).padStart(2, '0')}` : undefined,
            returnDate: (returnDate && retUtc) ? `${retUtc.getUTCFullYear()}-${String(retUtc.getUTCMonth() + 1).padStart(2, '0')}-${String(retUtc.getUTCDate()).padStart(2, '0')}` : undefined,
            duration: totalMins ? minutesToHhMm(totalMins) : undefined,
            stops: Math.max(0, route.length - 1),
            source: 'kiwi-tequila',
            deepLink: typeof it?.deep_link === 'string' ? it.deep_link : undefined,
            fromCity: it?.cityFrom,
            toCity: it?.cityTo,
            departTime: formatTime(first?.local_departure),
            arriveTime: formatTime(last?.local_arrival),
            totalLayover: layoverTotal ? minutesToHhMm(layoverTotal) : undefined,
            cabinBagKg: typeof baglimit?.hand_weight === 'number' ? baglimit.hand_weight : undefined,
            holdBagKg: typeof baglimit?.hold_weight === 'number' ? baglimit.hold_weight : undefined,
            bag1Price: typeof bagsPrice?.['1'] === 'number' ? bagsPrice['1'] : undefined,
            bag2Price: typeof bagsPrice?.['2'] === 'number' ? bagsPrice['2'] : undefined,
            segments
          } as FlightData;
        });
        setFlights(mapped);
        setLoading(false);
      } catch {}
    }
  }, [initialFlights]);

  const parseSearchCode = (code: string) => {
    // Format examples: JFK2310LHR241011, JFK1611LAX1711b11, DEL1309BOM1
    const airportCodes = code.match(/[A-Z]{3}/g) || [];
    const from = airportCodes[0] || '';
    const to = airportCodes[1] || '';
    const currentYear = new Date().getFullYear();

    const depMatch = code.match(new RegExp(`${from}(\\d{4})`));
    let departureDateIso: string | undefined;
    if (depMatch && depMatch[1]) {
      const day = depMatch[1].substring(0, 2);
      const month = depMatch[1].substring(2, 4);
      departureDateIso = `${currentYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    const retMatch = code.match(new RegExp(`${to}(\\d{4})`));
    let returnDateIso: string | undefined;
    if (retMatch && retMatch[1]) {
      const day = retMatch[1].substring(0, 2);
      const month = retMatch[1].substring(2, 4);
      returnDateIso = `${currentYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    // passengers at end e.g., 11 => 1 adult, 1 child
    let adults = 1;
    let children = 0;
    const pax2 = code.match(/(\d{2})$/);
    if (pax2 && pax2[1]) {
      adults = parseInt(pax2[1][0]) || 1;
      children = parseInt(pax2[1][1]) || 0;
    } else {
      const pax1 = code.match(/(\d)$/);
      if (pax1) adults = parseInt(pax1[1]) || 1;
    }

    const cabin = /[bB]/.test(code) ? 'C' : 'M'; // Business => C, else Economy M

    return { from, to, departureDateIso, returnDateIso, adults, children, cabin };
  };

  const minutesToHhMm = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const formatTime = (iso?: string) => {
    if (!iso) return undefined;
    const d = new Date(iso);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const fetchTequilaFlights = async (paramsIn?: {
    from?: string; to?: string; date?: string; returnDate?: string;
    adults?: number; children?: number; curr?: string; cabin?: string;
  }, codeFallback?: string): Promise<FlightData[]> => {
    let qFrom = paramsIn?.from;
    let qTo = paramsIn?.to;
    let qDate = paramsIn?.date;
    let qReturnDate = paramsIn?.returnDate;
    let qAdults = paramsIn?.adults ?? 1;
    let qChildren = paramsIn?.children ?? 0;
    const qCurr = paramsIn?.curr || 'USD';
    let qCabin = (paramsIn?.cabin || 'M').toUpperCase();

    if ((!qFrom || !qTo || !qDate) && codeFallback) {
      const parsed = parseSearchCode(codeFallback);
      qFrom = qFrom || parsed.from;
      qTo = qTo || parsed.to;
      qDate = qDate || parsed.departureDateIso;
      qReturnDate = qReturnDate || parsed.returnDateIso;
      qAdults = qAdults || parsed.adults;
      qChildren = qChildren || parsed.children;
      qCabin = qCabin || parsed.cabin;
    }

    if (!qFrom || !qTo || !qDate) return [];

    const params = new URLSearchParams();
    params.set('from', qFrom);
    params.set('to', qTo);
    params.set('date', qDate);
    if (qReturnDate) params.set('returnDate', qReturnDate);
    params.set('adults', String(qAdults));
    params.set('children', String(qChildren));
    params.set('curr', qCurr);
    params.set('cabin', qCabin);
    params.set('limit', '30');

    const res = await fetch(`/api/tequila/search?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    const items = Array.isArray(data?.data) ? data.data : [];

    const mapped: FlightData[] = items.map((it: any) => {
      const route = Array.isArray(it?.route) ? it.route : [];
      const outbound = route.filter((seg: any) => seg?.return === 0);
      const firstOut = outbound[0] || route[0] || {};
      const lastOut = outbound.length ? outbound[outbound.length - 1] : (route[route.length - 1] || {});
      const depUtc = firstOut?.dTimeUTC ? new Date((firstOut.dTimeUTC as number) * 1000) : null;
      const retUtc = lastOut?.aTimeUTC ? new Date((lastOut.aTimeUTC as number) * 1000) : null;
      // Kiwi duration.total is in minutes
      const totalMins = typeof it?.duration?.total === 'number' ? it.duration.total : 0;
      const airline = Array.isArray(it?.airlines) && it.airlines.length > 0 ? it.airlines.join('/') : firstOut?.airline || '';
      const airlineCode = Array.isArray(it?.airlines) && it.airlines.length > 0 ? it.airlines[0] : (firstOut?.airline || '');

      // Layover calculation
      let layoverTotal = 0;
      for (let i = 0; i < route.length - 1; i++) {
        const a = route[i];
        const b = route[i + 1];
        const aArr = a?.local_arrival ? new Date(a.local_arrival) : null;
        const bDep = b?.local_departure ? new Date(b.local_departure) : null;
        if (aArr && bDep) {
          const diff = Math.max(0, Math.round((bDep.getTime() - aArr.getTime()) / 60000));
          layoverTotal += diff;
        }
      }

      const baglimit = it?.baglimit || {};
      const bagsPrice = it?.bags_price || {};

      const segments = route.map((seg: any) => ({
        from: seg?.flyFrom,
        to: seg?.flyTo,
        fromCity: seg?.cityFrom,
        toCity: seg?.cityTo,
        dep: seg?.local_departure,
        arr: seg?.local_arrival,
        airlineCode: seg?.operating_carrier || seg?.airline,
        flightNo: seg?.operating_flight_no || seg?.flight_no,
        returnIdx: seg?.return
      }));

      return {
        from: firstOut?.flyFrom || qFrom,
        to: lastOut?.flyTo || qTo,
        price: typeof it?.price === 'number' ? `$${it.price}` : undefined,
        airline,
        airlineCode,
        departureDate: depUtc ? `${depUtc.getUTCFullYear()}-${String(depUtc.getUTCMonth() + 1).padStart(2, '0')}-${String(depUtc.getUTCDate()).padStart(2, '0')}` : undefined,
        returnDate: qReturnDate && retUtc ? `${retUtc.getUTCFullYear()}-${String(retUtc.getUTCMonth() + 1).padStart(2, '0')}-${String(retUtc.getUTCDate()).padStart(2, '0')}` : undefined,
        duration: totalMins ? minutesToHhMm(totalMins) : undefined,
        stops: Math.max(0, outbound.length ? outbound.length - 1 : route.length - 1),
        source: 'kiwi-tequila',
        deepLink: typeof it?.deep_link === 'string' ? it.deep_link : undefined,
        fromCity: it?.cityFrom,
        toCity: it?.cityTo,
        departTime: formatTime(firstOut?.local_departure),
        arriveTime: formatTime(lastOut?.local_arrival),
        totalLayover: layoverTotal ? minutesToHhMm(layoverTotal) : undefined,
        cabinBagKg: typeof baglimit?.hand_weight === 'number' ? baglimit.hand_weight : undefined,
        holdBagKg: typeof baglimit?.hold_weight === 'number' ? baglimit.hold_weight : undefined,
        bag1Price: typeof bagsPrice?.['1'] === 'number' ? bagsPrice['1'] : undefined,
        bag2Price: typeof bagsPrice?.['2'] === 'number' ? bagsPrice['2'] : undefined,
        segments
      } as FlightData;
    });

    return mapped;
  };

  // Generate comprehensive sample data with more flights
  const generateSampleFlights = (fromCode: string, toCode: string): FlightData[] => {
    const airlines = [
      'American Airlines', 'Delta Airlines', 'United Airlines', 'British Airways',
      'Lufthansa', 'Air France', 'KLM Royal Dutch', 'Virgin Atlantic',
      'Southwest Airlines', 'JetBlue Airways', 'Alaska Airlines', 'Spirit Airlines',
      'Frontier Airlines', 'Hawaiian Airlines', 'Turkish Airlines', 'Emirates',
      'Qatar Airways', 'Singapore Airlines', 'Cathay Pacific', 'Japan Airlines',
      'All Nippon Airways', 'Korean Air', 'Thai Airways', 'Malaysia Airlines'
    ];

    const durations = ['6h 30m', '7h 15m', '7h 45m', '8h 20m', '8h 45m', '9h 10m', '9h 35m', '10h 05m'];
    const basePrices = [320, 380, 420, 450, 480, 520, 560, 620, 680, 720, 780, 850];
    
    return Array.from({ length: 24 }, (_, index) => ({
      from: fromCode,
      to: toCode,
      price: `$${basePrices[index % basePrices.length]}`,
      airline: airlines[index % airlines.length],
      departureDate: '2024-10-23',
      returnDate: '2024-10-24',
      duration: durations[index % durations.length],
      stops: Math.random() > 0.4 ? 0 : Math.floor(Math.random() * 2) + 1,
      source: 'sample-data'
    }));
  };

  // Extract real data from iframe
  const extractRealFlightData = () => {
    try {
      const iframe = iframeRef.current;
      if (!iframe) return;

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) return;

      console.log('Attempting to extract real flight data from iframe...');
      const extractedFlights: FlightData[] = [];

      // Strategy 1: Look for flight cards/rows in DOM with more comprehensive selectors
      const flightSelectors = [
        '[data-flight]',
        '[class*="flight-card"]',
        '[class*="flight-row"]',
        '[class*="ticket"]',
        '[class*="route"]',
        '[class*="result"]',
        '[class*="offer"]',
        '[class*="variant"]',
        '[class*="option"]',
        '[class*="item"]',
        '.flight-item',
        '.route-item',
        '[role="listitem"]',
        '[role="article"]',
        '[class*="TPWL"]', // Triposia widget classes
        '[id*="flight"]',
        '[id*="market"]'
      ];

      for (const selector of flightSelectors) {
        const elements = iframeDoc.querySelectorAll(selector);
        
        elements.forEach((element, index) => {
          const flight: FlightData = {
            from: searchCode?.substring(0, 3) || '',
            to: searchCode?.substring(3, 6) || '',
            source: 'iframe-dom'
          };

          // Extract price
          const priceElement = element.querySelector('[class*="price"], [class*="cost"], [class*="fare"], [class*="amount"]');
          if (priceElement) {
            flight.price = priceElement.textContent?.trim() || '';
          }

          // Extract airline
          const airlineElement = element.querySelector('[class*="airline"], [class*="carrier"], [class*="company"]');
          if (airlineElement) {
            flight.airline = airlineElement.textContent?.trim() || '';
          }

          // Extract duration/time
          const timeElement = element.querySelector('[class*="time"], [class*="duration"], [class*="flight-time"]');
          if (timeElement) {
            flight.duration = timeElement.textContent?.trim() || '';
          }

          // Extract stops
          const stopsElement = element.querySelector('[class*="stop"], [class*="connection"], [class*="layover"]');
          if (stopsElement) {
            const stopsText = stopsElement.textContent?.trim() || '';
            flight.stops = stopsText.includes('Direct') || stopsText.includes('Non-stop') ? 0 : 1;
          }

          // Extract dates
          const dateElement = element.querySelector('[class*="date"], [class*="departure"], [class*="arrival"]');
          if (dateElement) {
            flight.departureDate = dateElement.textContent?.trim() || '';
          }

          // Only add if we have meaningful data
          if (flight.price || flight.airline || flight.duration) {
            extractedFlights.push(flight);
          }
        });

        // Continue collecting from all selectors - don't break early to get ALL flights
      }

      // Strategy 2: Look for JSON data in script tags
      const scripts = iframeDoc.querySelectorAll('script');
      scripts.forEach(script => {
        const content = script.textContent || script.innerHTML;
        
        if (content.includes('flight') || content.includes('route') || content.includes('price')) {
          try {
            // Look for JSON arrays containing flight data
            const jsonMatches = content.match(/\[[^\]]*\{[^}]*"(flight|price|route|airline|departure|arrival)"[^}]*\}[^\]]*\]/g);
            if (jsonMatches) {
              jsonMatches.forEach(match => {
                try {
                  const jsonArray = JSON.parse(match);
                  if (Array.isArray(jsonArray)) {
                    jsonArray.forEach((item: any) => {
                      if (item && typeof item === 'object') {
                        extractedFlights.push({
                          from: searchCode?.substring(0, 3) || '',
                          to: searchCode?.substring(3, 6) || '',
                          price: item.price || item.cost || item.fare || '',
                          airline: item.airline || item.carrier || item.company || '',
                          duration: item.duration || item.time || '',
                          stops: item.stops || item.connections || 0,
                          departureDate: item.departureDate || item.date || '',
                          source: 'iframe-json'
                        });
                      }
                    });
                  }
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

      // Strategy 3: Try to access global variables
      try {
        const iframeWindow = iframe.contentWindow as any;
        if (iframeWindow) {
          const dataKeys = ['flights', 'results', 'data', 'routes', 'tickets', 'searchResults', 'offers'];
          dataKeys.forEach(key => {
            if (iframeWindow[key] && Array.isArray(iframeWindow[key])) {
              iframeWindow[key].forEach((item: any) => {
                extractedFlights.push({
                  from: searchCode?.substring(0, 3) || '',
                  to: searchCode?.substring(3, 6) || '',
                  price: item.price || item.cost || item.fare || '',
                  airline: item.airline || item.carrier || item.company || '',
                  duration: item.duration || item.time || '',
                  stops: item.stops || item.connections || 0,
                  departureDate: item.departureDate || item.date || '',
                  source: `iframe-window-${key}`
                });
              });
            }
          });
        }
      } catch (e) {
        // Cross-origin restrictions, ignore
      }

      if (extractedFlights.length > 0) {
        console.log('✅ Extracted real flight data:', extractedFlights);
        setFlights(extractedFlights);
        setLoading(false);
        setShowSnackbar(true);
        return true;
      }

      return false;
    } catch (e) {
      console.log('Error extracting real data:', e);
      return false;
    }
  };

  useEffect(() => {
    console.log('FlightCards: searchCode =', searchCode, 'from/to/date =', from, to, date);
    
    const loadFlightData = async () => {
      if (!searchCode && !(from && to && date)) {
        console.log('FlightCards: No searchCode or direct params provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setExtractionAttempts(0);

        // First try Tequila (Kiwi) API using direct params if provided
        const tequila = await fetchTequilaFlights({ from, to, date, returnDate, adults, children: childPax, curr, cabin }, searchCode);
        console.log('FlightCards: Tequila results count =', tequila.length);
        if (tequila.length > 0) {
          setFlights(tequila);
          setLoading(false);
          setShowSnackbar(true);
          return;
        }

        // Extract ONLY real data from iframe - no sample data
        if (!searchCode) {
          // No search code available -> skip iframe path
          console.log('FlightCards: No searchCode, skipping iframe extraction');
          setFlights([]);
          setLoading(false);
          return;
        }
        let realDataExtracted = false;
        
        // Set up iframe for data extraction
        const iframe = iframeRef.current;
        if (iframe) {
          const handleIframeLoad = () => {
            console.log('Iframe loaded, extracting real flight data...');
            // Try extraction multiple times with optimized delays
            setTimeout(() => {
              if (extractRealFlightData()) {
                realDataExtracted = true;
              }
            }, 1000);
            
            setTimeout(() => {
              if (!realDataExtracted && extractRealFlightData()) {
                realDataExtracted = true;
              }
            }, 3000);
            
            setTimeout(() => {
              if (!realDataExtracted && extractRealFlightData()) {
                realDataExtracted = true;
              }
            }, 6000);
            
            setTimeout(() => {
              if (!realDataExtracted && extractRealFlightData()) {
                realDataExtracted = true;
              }
            }, 10000);
            
            // If still no data after attempts, show error
            setTimeout(() => {
              if (!realDataExtracted) {
                console.log('No real data extracted from iframe');
                setError('Unable to extract flight data. Please try again or check the search code.');
                setLoading(false);
              }
            }, 12000);
          };

          iframe.addEventListener('load', handleIframeLoad);
          
          // If iframe is already loaded
          if (iframe.contentDocument?.readyState === 'complete') {
            handleIframeLoad();
          }
        }

        // Timeout in case iframe doesn't load at all
        setTimeout(() => {
          if (!realDataExtracted && flights.length === 0 && loading) {
            console.log('Iframe did not load in time');
            setError('Unable to load flight data. Please check your connection and try again.');
            setLoading(false);
          }
        }, 15000);

      } catch (err) {
        console.error('Error loading flight data:', err);
        setError('Failed to load flight data');
        setLoading(false);
      }
    };

    loadFlightData();
  }, [searchCode, from, to, date, returnDate, adults, childPax, curr, cabin]);

  const handleBookFlight = (flight: FlightData) => {
    // Open booking in new tab
    const bookingUrl = `https://search.triposia.com/flights/${searchCode}`;
    window.open(bookingUrl, '_blank');
  };

  const handleRetryExtraction = () => {
    setLoading(true);
    setError(null);
    extractRealFlightData();
  };

  console.log('FlightCards: Render - searchCode =', searchCode, 'loading =', loading, 'flights =', flights.length);

  if (!searchCode && !(from && to && date)) {
    return (
      <Box sx={{ mt: 4, p: 3, bgcolor: '#fff3cd', borderRadius: 1 }}>
        <Typography color="warning.main">
          No search code provided. Please search for flights.
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <CircularProgress sx={{ mr: 2 }} />
        <Typography variant="body1" color="text.secondary">
          {extractionAttempts > 0 ? 'Retrying data extraction...' : 'Loading flight options...'}
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4, p: 3, bgcolor: 'error.light', borderRadius: 1 }}>
        <Typography color="error.main" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRetryExtraction}
          sx={{ mt: 1 }}
        >
          Retry Extraction
        </Button>
      </Box>
    );
  }

  if (flights.length === 0) {
    return (
      <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          No flight results found. Please try a different search.
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRetryExtraction}
        >
          Retry Extraction
        </Button>
      </Box>
    );
  }

  // If we have flights, render the new results layout matching the provided design
  if (flights.length > 0) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert 
          severity={'success'} 
          sx={{ mb: 2 }}
        >
          ✅ Live flight data from Kiwi Tequila ({flights.length} flights)
        </Alert>
        <SearchResultsView 
          flights={flights} 
          onBook={handleBookFlight}
          context={{ from, to, date, returnDate, adults, children: childPax, infants, curr, cabin }}
          locale={locale}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      {/* Data Source Indicator */}
      {flights[0]?.source && (
        <Alert 
          severity={
            flights[0].source.includes('iframe') ? 'success' :
            flights[0].source === 'kiwi-tequila' ? 'success' :
            'info'
          } 
          sx={{ mb: 3 }}
        >
          {flights[0].source.includes('iframe') && `✅ Real flight data extracted from Triposia widget (${flights.length} flights)`}
          {flights[0].source === 'kiwi-tequila' && `✅ Live flight data from Kiwi Tequila (${flights.length} flights)`}
          {!flights[0].source.includes('iframe') && flights[0].source !== 'kiwi-tequila' && `📊 Sample flight data displayed (${flights.length} flights)`}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
          Available Flights ({flights.length})
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRetryExtraction}
          size="small"
        >
          Refresh Data
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {flights.map((flight, index) => (
          <Grid item xs={12} sm={6} lg={4} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              {/* Flight Header */}
              <Box 
                sx={{ 
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  p: 3,
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <FlightTakeoffIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                      {flight.from}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                      Origin
                    </Typography>
                  </Box>
                  
                  <Typography variant="h5" sx={{ mx: 2 }}>
                    →
                  </Typography>
                  
                  <Box>
                    <FlightLandIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                      {flight.to}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                      Destination
                    </Typography>
                  </Box>
                </Box>
                
                {flight.stops === 0 && (
                  <Chip 
                    label="Direct Flight" 
                    size="small" 
                    sx={{ 
                      mt: 2, 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 600
                    }} 
                  />
                )}
                
                {flight.stops && flight.stops > 0 && (
                  <Chip 
                    label={`${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
                    size="small" 
                    sx={{ 
                      mt: 2, 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 600
                    }} 
                  />
                )}
              </Box>

              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Flight Details */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarTodayIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      Departure: {flight.departureDate}
                    </Typography>
                  </Box>
                  
                  {flight.returnDate && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarTodayIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        Return: {flight.returnDate}
                      </Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AirlinesIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {flight.airline}
                    </Typography>
                  </Box>
                  
                  {flight.duration && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Duration: {flight.duration}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Price */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Price per person
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AttachMoneyIcon sx={{ fontSize: 32, color: 'success.main', mr: 0.5 }} />
                      <Typography variant="h4" component="span" sx={{ fontWeight: 700, color: 'success.main' }}>
                        {flight.price?.replace('$', '')}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Book Button */}
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() => handleBookFlight(flight)}
                  sx={{
                    mt: 'auto',
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: '1rem',
                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    }
                  }}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

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
        title="Hidden Triposia Data Extractor"
      />

      {/* Success Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        message="Real flight data extracted successfully!"
      />
    </Box>
  );
}

