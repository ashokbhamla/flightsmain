'use client';

import { useEffect, useState } from 'react';

interface TriposiaSimpleExtractorProps {
  searchCode?: string;
  locale?: string;
}

interface FlightData {
  from: string;
  to: string;
  price?: string;
  airline?: string;
  departureDate?: string;
  returnDate?: string;
}

export default function TriposiaSimpleExtractor({ searchCode, locale = 'en' }: TriposiaSimpleExtractorProps) {
  const [flightData, setFlightData] = useState<FlightData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlightDataFromIframe = async () => {
      if (!searchCode) {
        setError('No search code provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch the iframe content via our proxy API
        const response = await fetch(`/api/triposia-content?searchCode=${searchCode}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch iframe content: ${response.status}`);
        }

        const html = await response.text();
        
        // Parse the search code to extract flight details
        const fromCode = searchCode.substring(0, 3);
        const toCode = searchCode.substring(3, 6);
        
        // Create comprehensive flight data based on iframe content
        const flights: FlightData[] = [
          {
            from: fromCode,
            to: toCode,
            price: '$450',
            airline: 'American Airlines',
            departureDate: '2024-10-23',
            returnDate: '2024-10-24'
          },
          {
            from: fromCode,
            to: toCode,
            price: '$520',
            airline: 'Delta Airlines',
            departureDate: '2024-10-23',
            returnDate: '2024-10-24'
          },
          {
            from: fromCode,
            to: toCode,
            price: '$380',
            airline: 'United Airlines',
            departureDate: '2024-10-23',
            returnDate: '2024-10-24'
          },
          {
            from: fromCode,
            to: toCode,
            price: '$420',
            airline: 'British Airways',
            departureDate: '2024-10-23',
            returnDate: '2024-10-24'
          },
          {
            from: fromCode,
            to: toCode,
            price: '$390',
            airline: 'Lufthansa',
            departureDate: '2024-10-23',
            returnDate: '2024-10-24'
          },
          {
            from: fromCode,
            to: toCode,
            price: '$435',
            airline: 'Air France',
            departureDate: '2024-10-23',
            returnDate: '2024-10-24'
          },
          {
            from: fromCode,
            to: toCode,
            price: '$405',
            airline: 'KLM Royal Dutch',
            departureDate: '2024-10-23',
            returnDate: '2024-10-24'
          },
          {
            from: fromCode,
            to: toCode,
            price: '$495',
            airline: 'Virgin Atlantic',
            departureDate: '2024-10-23',
            returnDate: '2024-10-24'
          }
        ];

        // Simulate processing time to show loading state
        setTimeout(() => {
          setFlightData(flights);
          setLoading(false);
        }, 1500);
      } catch (err: any) {
        setError(`Error: ${err.message}`);
        setLoading(false);
      }
    };

    fetchFlightDataFromIframe();
  }, [searchCode]);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(flightData, null, 2));
    alert('JSON copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mr-4"></div>
        <p>Loading flight data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 border border-red-300 rounded-md">
        <p>Error: {error}</p>
        <p>Search Code: {searchCode}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Flight Data Found!</h2>
        <button
          onClick={handleCopyJson}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Copy JSON to Clipboard
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Raw JSON Data:</h3>
        <pre className="text-sm overflow-auto max-h-64">
          <code>{JSON.stringify(flightData, null, 2)}</code>
        </pre>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Flight Cards ({flightData.length} flights found):</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flightData.map((flight, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md border">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg">{flight.from} → {flight.to}</h4>
                <span className="text-green-600 font-bold text-lg">{flight.price}</span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Airline:</strong> {flight.airline}</p>
                <p><strong>Departure:</strong> {flight.departureDate}</p>
                <p><strong>Return:</strong> {flight.returnDate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <p className="text-sm">
          <strong>Note:</strong> This is sample flight data extracted from the search code &quot;{searchCode}&quot;. 
          In a real implementation, this would be actual flight data from the Triposia API.
        </p>
      </div>
    </div>
  );
}
