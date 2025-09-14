import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const iataFrom = searchParams.get('iata_from');
    const lang = searchParams.get('lang') || searchParams.get('lang_id');
    const domainId = searchParams.get('domain_id');

    if (!iataFrom || !lang || !domainId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE}/real/flights?iata_from=${iataFrom}&lang_id=${lang}&domain_id=${domainId}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching destination flight data:', error);
    return NextResponse.json({ error: 'Failed to fetch destination flight data' }, { status: 500 });
  }
}
