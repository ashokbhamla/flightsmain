import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const arrival_iata = searchParams.get('arrival_iata');
    const departure_iata = searchParams.get('departure_iata');
    const lang = searchParams.get('lang_id');
    const domain_id = searchParams.get('domain_id') || process.env.NEXT_PUBLIC_DOMAIN || 'airlinesmap.com';

    if (!arrival_iata || !departure_iata || !lang || !domain_id) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_REAL}/real/flights?arrival_iata=${arrival_iata}&departure_iata=${departure_iata}&lang_id=${lang}&domain_id=${domain_id}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    
    // API returns an array, extract first object if array
    const flightData = Array.isArray(data) && data.length > 0 ? data[0] : data;
    
    return NextResponse.json(flightData);
  } catch (error) {
    console.error('Error in flight-data API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
