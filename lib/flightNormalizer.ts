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

  rawData.forEach((flight) => {
    // Handle direct flight objects from the API
    if (flight.iata_from && flight.iata_to) {
      flights.push({
        from: flight.iata_from,
        to: flight.iata_to,
        city: flight.city || `${flight.iata_to} City`,
        airport: `${flight.iata_to} Airport`,
        flightsPerDay: 'Multiple flights',
        flightsPerWeek: '0',
        duration: flight.duration || '2h 30m',
        price: flight.localized_price || toUSD(Number(flight.price), "USD"),
        airline: flight.airline || 'Unknown',
        airlineCode: flight.airline_iata || 'N/A',
        airlineCountry: 'Unknown',
        airlineUrl: '#'
      });
    } else if (flight.airlineroutes && Array.isArray(flight.airlineroutes)) {
      // Handle legacy structure with airlineroutes
      flight.airlineroutes.forEach((air: any) => {
        flights.push({
          from: flight.iata_from,
          to: flight.iata_to,
          city: flight.city_name_en,
          airport: flight.airport?.display_name || `${flight.city_name_en} (${flight.iata_to}), India`,
          flightsPerDay: flight.flights_per_day || 'Multiple flights',
          flightsPerWeek: flight.flights_per_week || '0',
          duration: `${flight.common_duration} min`,
          price: toUSD(Number(flight.price), "USD"),
          airline: air.carrier_name || 'Unknown',
          airlineCode: air.carrier || 'N/A',
          airlineCountry: air.airline?.country || 'Unknown',
          airlineUrl: air.airline?.url || '#'
        });
      });
    } else {
      // Fallback for routes without airline info
      flights.push({
        from: flight.iata_from,
        to: flight.iata_to,
        city: flight.city_name_en,
        airport: flight.airport?.display_name || `${flight.city_name_en} (${flight.iata_to}), India`,
        flightsPerDay: flight.flights_per_day || 'Multiple flights',
        flightsPerWeek: flight.flights_per_week || '0',
        duration: `${flight.common_duration} min`,
        price: toUSD(Number(flight.price), "USD"),
        airline: 'Unknown',
        airlineCode: 'N/A',
        airlineCountry: 'Unknown',
        airlineUrl: '#'
      });
    }
  });

  return flights;
}
