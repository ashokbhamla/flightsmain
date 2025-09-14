import { toUSD } from '@/utils/currency';

export interface NormalizedFlight {
  from: string;
  to: string;
  city: string;
  airport: string;
  flightsPerDay: string;
  flightsPerWeek: string;
  duration: string;
  price: string;
  airline: string;
  airlineCode: string;
  airlineCountry: string;
  airlineUrl: string;
}

export function normalizeFlights(rawData: any[]): NormalizedFlight[] {
  const flights: NormalizedFlight[] = [];

  rawData.forEach((route) => {
    if (route.airlineroutes && Array.isArray(route.airlineroutes)) {
      route.airlineroutes.forEach((air: any) => {
        flights.push({
          from: route.iata_from,
          to: route.iata_to,
          city: route.city_name_en,
          airport: route.airport?.display_name || `${route.city_name_en} (${route.iata_to}), India`,
          flightsPerDay: route.flights_per_day || 'Multiple flights',
          flightsPerWeek: route.flights_per_week || '0',
          duration: `${route.common_duration} min`,
          price: toUSD(Number(route.price), "USD"),
          airline: air.carrier_name || 'Unknown',
          airlineCode: air.carrier || 'N/A',
          airlineCountry: air.airline?.country || 'Unknown',
          airlineUrl: air.airline?.url || '#'
        });
      });
    } else {
      // Fallback for routes without airline info
      flights.push({
        from: route.iata_from,
        to: route.iata_to,
        city: route.city_name_en,
        airport: route.airport?.display_name || `${route.city_name_en} (${route.iata_to}), India`,
        flightsPerDay: route.flights_per_day || 'Multiple flights',
        flightsPerWeek: route.flights_per_week || '0',
        duration: `${route.common_duration} min`,
        price: toUSD(Number(route.price), "USD"),
        airline: 'Unknown',
        airlineCode: 'N/A',
        airlineCountry: 'Unknown',
        airlineUrl: '#'
      });
    }
  });

  return flights;
}
