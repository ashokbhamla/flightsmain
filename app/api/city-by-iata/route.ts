import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city_iata = searchParams.get('city_iata');
    const lang = searchParams.get('lang_id');
    const domain_id = searchParams.get('domain_id');

    if (!city_iata || !lang || !domain_id) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_REAL}/real/city?city_iata=${city_iata}&lang_id=${lang}&domain_id=${domain_id}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in city-by-iata API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
