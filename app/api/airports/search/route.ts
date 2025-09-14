import { NextRequest, NextResponse } from 'next/server';

// Aviasales/Travelpayouts Autocomplete API configuration
const AVISALES_AUTOCOMPLETE_API = 'https://autocomplete.travelpayouts.com/places2';

interface AviasalesPlace {
  id: string;
  type: 'airport' | 'city' | 'country';
  code: string;
  name: string;
  country_code: string;
  country_name: string;
  city_code?: string;
  city_name?: string;
  state_code?: string;
  coordinates: {
    lon: number;
    lat: number;
  };
  index_strings?: string[];
  weight?: number;
  cases?: unknown;
  city_cases?: unknown;
  country_cases?: unknown;
}

interface AirportOption {
  code: string;
  name: string;
  city_name: string;
  country_name: string;
  country_code: string;
  type: 'airport' | 'city';
  coordinates?: {
    lon: number;
    lat: number;
  };
}

// Fallback airports data
const FALLBACK_AIRPORTS: AirportOption[] = [
  {
    code: 'JFK',
    name: 'John F. Kennedy International Airport',
    city_name: 'New York',
    country_name: 'United States',
    country_code: 'US',
    type: 'airport',
    coordinates: { lon: -73.7781, lat: 40.6413 }
  },
  {
    code: 'LAX',
    name: 'Los Angeles International Airport',
    city_name: 'Los Angeles',
    country_name: 'United States',
    country_code: 'US',
    type: 'airport',
    coordinates: { lon: -118.4081, lat: 33.9425 }
  },
  {
    code: 'LHR',
    name: 'London Heathrow Airport',
    city_name: 'London',
    country_name: 'United Kingdom',
    country_code: 'GB',
    type: 'airport',
    coordinates: { lon: -0.4543, lat: 51.4700 }
  },
  {
    code: 'CDG',
    name: 'Charles de Gaulle Airport',
    city_name: 'Paris',
    country_name: 'France',
    country_code: 'FR',
    type: 'airport',
    coordinates: { lon: 2.5478, lat: 49.0097 }
  },
  {
    code: 'NRT',
    name: 'Narita International Airport',
    city_name: 'Tokyo',
    country_name: 'Japan',
    country_code: 'JP',
    type: 'airport',
    coordinates: { lon: 140.3863, lat: 35.7720 }
  },
  {
    code: 'DEL',
    name: 'Indira Gandhi International Airport',
    city_name: 'Delhi',
    country_name: 'India',
    country_code: 'IN',
    type: 'airport',
    coordinates: { lon: 77.1031, lat: 28.5562 }
  },
  {
    code: 'BOM',
    name: 'Chhatrapati Shivaji Maharaj International Airport',
    city_name: 'Mumbai',
    country_name: 'India',
    country_code: 'IN',
    type: 'airport',
    coordinates: { lon: 72.8679, lat: 19.0896 }
  },
  {
    code: 'DXB',
    name: 'Dubai International Airport',
    city_name: 'Dubai',
    country_name: 'United Arab Emirates',
    country_code: 'AE',
    type: 'airport',
    coordinates: { lon: 55.3644, lat: 25.2532 }
  },
  {
    code: 'SIN',
    name: 'Singapore Changi Airport',
    city_name: 'Singapore',
    country_name: 'Singapore',
    country_code: 'SG',
    type: 'airport',
    coordinates: { lon: 103.9886, lat: 1.3644 }
  },
  {
    code: 'HKG',
    name: 'Hong Kong International Airport',
    city_name: 'Hong Kong',
    country_name: 'Hong Kong',
    country_code: 'HK',
    type: 'airport',
    coordinates: { lon: 113.9146, lat: 22.3080 }
  }
];

function getFallbackAirports(query: string): NextResponse {
  const searchTerm = query.toLowerCase();
  const filteredAirports = FALLBACK_AIRPORTS.filter(airport =>
    airport.code.toLowerCase().includes(searchTerm) ||
    airport.name.toLowerCase().includes(searchTerm) ||
    airport.city_name.toLowerCase().includes(searchTerm) ||
    airport.country_name.toLowerCase().includes(searchTerm)
  );
  
  return NextResponse.json({ airports: filteredAirports });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const locale = searchParams.get('locale') || 'en';

    if (!query || query.length < 1) {
      return NextResponse.json({ airports: [] });
    }

    // Call Aviasales autocomplete API for airports first
    const airportUrl = new URL(AVISALES_AUTOCOMPLETE_API);
    airportUrl.searchParams.set('term', query);
    airportUrl.searchParams.set('locale', locale);
    airportUrl.searchParams.set('types[]', 'airport');

    const airportResponse = await fetch(airportUrl.toString(), {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!airportResponse.ok) {
      throw new Error(`Aviasales API error: ${airportResponse.status}`);
    }

    const airportPlaces: AviasalesPlace[] = await airportResponse.json();

    // Call Aviasales autocomplete API for cities
    const cityUrl = new URL(AVISALES_AUTOCOMPLETE_API);
    cityUrl.searchParams.set('term', query);
    cityUrl.searchParams.set('locale', locale);
    cityUrl.searchParams.set('types[]', 'city');

    const cityResponse = await fetch(cityUrl.toString(), {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!cityResponse.ok) {
      throw new Error(`Aviasales API error: ${cityResponse.status}`);
    }

    const cityPlaces: AviasalesPlace[] = await cityResponse.json();

    // Combine airports and cities, prioritizing airports
    const places = [...airportPlaces, ...cityPlaces];

    // Convert Aviasales response to our format
    const airports = places
      .filter(place => place.type === 'airport' || place.type === 'city')
      .slice(0, 20) // Limit to 20 results
      .map(place => ({
        code: place.code,
        name: place.name,
        city_name: place.city_name || place.name,
        country_name: place.country_name,
        country_code: place.country_code,
        type: place.type as 'airport' | 'city',
        coordinates: {
          lon: place.coordinates.lon,
          lat: place.coordinates.lat
        }
      }));

    return NextResponse.json({ airports });

  } catch (error) {
    console.error('Error in airport search API:', error);
    
    // Return fallback data
    const query = new URL(request.url).searchParams.get('q') || '';
    return getFallbackAirports(query);
  }
}
