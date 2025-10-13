import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const airline_code = searchParams.get('airline_code');
    const arrival_iata = searchParams.get('arrival_iata');
    const departure_iata = searchParams.get('departure_iata');
    const lang = searchParams.get('lang_id');
    const domain_id = searchParams.get('domain_id');

    if (!airline_code || !arrival_iata || !departure_iata || !lang || !domain_id) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE}/content/airlines?airline_code=${airline_code}&arrival_iata=${arrival_iata}&departure_iata=${departure_iata}&lang_id=${lang}&domain_id=${domain_id}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    
    // Extract first object from array if it's an array
    const extractedData = Array.isArray(data) && data.length > 0 ? data[0] : data;
    
    return NextResponse.json(extractedData);
  } catch (error) {
    console.error('Error in airline-content API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
