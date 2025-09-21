import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const iataCode = searchParams.get('iata_code');
  const lang = searchParams.get('lang') || '1';
  const domainId = searchParams.get('domain_id') || '1';

  if (!iataCode) {
    return NextResponse.json({ error: 'IATA code is required' }, { status: 400 });
  }

  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_REAL || 'https://api.triposia.com'}/real/airlines?iata_code=${iataCode}&lang=${lang}&domain_id=${domainId}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data[0] || null);
  } catch (error) {
    console.error('Error fetching airline contact info:', error);
    return NextResponse.json({ error: 'Failed to fetch airline contact information' }, { status: 500 });
  }
}
