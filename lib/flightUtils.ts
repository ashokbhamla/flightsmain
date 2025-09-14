import { toUSD } from '@/utils/currency';

// Helper function to normalize flight data from API
export function normalizeFlights(data: any[]) {
  const flights: any[] = [];

  data.forEach((route) => {
    const base = {
      from: route.iata_from,
      to: route.iata_to,
      city: route.city_name_en,
      duration: `${route.common_duration} min`,
      price: toUSD(Number(route.price), "USD"),
      flightsPerDay: route.flights_per_day,
      flightsPerWeek: route.flights_per_week,
    };

    if (route.airlineroutes && Array.isArray(route.airlineroutes)) {
      route.airlineroutes.forEach((air: any) => {
        flights.push({
          ...base,
          airline: air.carrier_name,
          carrier: air.carrier,
          airlineInfo: air.airline, // full profile
        });
      });
    } else {
      flights.push(base);
    }
  });

  return flights;
}

// Helper function to get city name from IATA code
export function getCityName(iataCode: string): string {
  const cityMap: { [key: string]: string } = {
    'LAX': 'Los Angeles',
    'WAS': 'Washington, D.C.',
    'BWI': 'Baltimore',
    'IAD': 'Washington Dulles',
    'DCA': 'Washington Reagan',
    'JFK': 'New York',
    'ORD': 'Chicago',
    'DFW': 'Dallas',
    'ATL': 'Atlanta',
    'BOS': 'Boston',
    'MIA': 'Miami',
    'SFO': 'San Francisco',
    'SEA': 'Seattle',
    'DEN': 'Denver',
    'LAS': 'Las Vegas',
    'PHX': 'Phoenix',
    'MCO': 'Orlando',
    'CLT': 'Charlotte',
    'IAH': 'Houston',
    'DTW': 'Detroit',
    'DEL': 'Delhi',
    'BOM': 'Mumbai',
    'HYD': 'Hyderabad',
    'BLR': 'Bangalore',
    'CCU': 'Kolkata',
    'MAA': 'Chennai',
    'AMD': 'Ahmedabad',
    'PNQ': 'Pune',
    'COK': 'Kochi',
    'GOI': 'Goa',
    'IXZ': 'Port Blair',
    'IXC': 'Chandigarh',
    'LKO': 'Lucknow',
    'VGA': 'Vijayawada',
    'TRV': 'Thiruvananthapuram',
    'BDQ': 'Vadodara',
    'JAI': 'Jaipur',
    'UDR': 'Udaipur',
    'JDH': 'Jodhpur',
    'BHO': 'Bhopal',
    'IDR': 'Indore',
    'NAG': 'Nagpur',
    'PBD': 'Porbandar',
    'RAJ': 'Rajkot',
    'SXR': 'Srinagar',
    'IXJ': 'Jammu',
    'IXL': 'Leh',
    'IXB': 'Bagdogra',
    'GAU': 'Guwahati',
    'IXA': 'Agartala',
    'IXD': 'Allahabad',
    'IXE': 'Mangalore',
    'IXG': 'Belgaum',
    'IXH': 'Kailashahar',
    'IXI': 'Lilabari',
    'IXK': 'Keshod',
    'IXM': 'Madurai',
    'IXN': 'Khowai',
    'IXP': 'Pathankot',
    'IXQ': 'Kamalpur',
    'IXR': 'Ranchi',
    'IXS': 'Silchar',
    'IXT': 'Pasighat',
    'IXV': 'Along',
    'IXW': 'Jamshedpur',
    'IXY': 'Kandla'
  };
  return cityMap[iataCode] || iataCode;
}
