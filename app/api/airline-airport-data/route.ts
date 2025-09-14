import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const airline_code = searchParams.get('airline_code');
  const departure_iata = searchParams.get('departure_iata');
  const lang = searchParams.get('lang_id') || '1';
  const domain_id = searchParams.get('domain_id') || '1';

  if (!airline_code || !departure_iata) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_REAL}/real/airlines?airline_code=${airline_code}&departure_iata=${departure_iata}&lang_id=${lang}&domain_id=${domain_id}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API error ${response.status}: ${await response.text()}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching airline airport data:', error);
    return NextResponse.json({ error: 'Failed to fetch airline airport data' }, { status: 500 });
  }
}
