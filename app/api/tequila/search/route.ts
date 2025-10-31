import { NextRequest, NextResponse } from 'next/server';

// Ensure Node.js runtime so server env vars are available
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TEQUILA_BASE_URL = 'https://api.tequila.kiwi.com/v2/search';

function toKiwiDate(dateIso: string): string {
  // Tequila expects DD/MM/YYYY
  const d = new Date(dateIso);
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = d.getUTCFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const date = searchParams.get('date'); // ISO yyyy-mm-dd
    const returnDate = searchParams.get('returnDate'); // ISO yyyy-mm-dd (optional)
    const adults = searchParams.get('adults') || '1';
    const children = searchParams.get('children') || '0';
    const infants = searchParams.get('infants') || '0';
    const curr = searchParams.get('curr') || 'USD';
    const cabin = (searchParams.get('cabin') || 'M').toUpperCase(); // M, W, C, F
    const limit = searchParams.get('limit') || '30';

    const apiKey = process.env.TEQUILA_API_KEY || process.env.NEXT_PUBLIC_TEQUILA_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Server missing TEQUILA_API_KEY' }, { status: 500 });
    }

    if (!from || !to || !date) {
      return NextResponse.json({ error: 'Missing required params: from, to, date' }, { status: 400 });
    }

    const params = new URLSearchParams();
    params.set('fly_from', from);
    params.set('fly_to', to);
    const dep = toKiwiDate(date);
    params.set('date_from', dep);
    params.set('date_to', dep);
    if (returnDate) {
      const ret = toKiwiDate(returnDate);
      params.set('return_from', ret);
      params.set('return_to', ret);
    }
    params.set('adults', adults);
    params.set('children', children);
    if (infants) params.set('infants', infants);
    params.set('curr', curr);
    params.set('selected_cabins', ['M', 'W', 'C', 'F'].includes(cabin) ? cabin : 'M');
    params.set('limit', limit);
    params.set('sort', 'price');
    params.set('asc', '1');
    params.set('one_for_city', '0');
    params.set('max_stopovers', '2');

    const url = `${TEQUILA_BASE_URL}?${params.toString()}`;

    const res = await fetch(url, {
      headers: {
        'apikey': apiKey,
        'accept': 'application/json',
      },
      // Force fresh data for search queries
      cache: 'no-store',
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: 'Tequila API error', status: res.status, body: text?.slice(0, 1000) },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to search flights' }, { status: 500 });
  }
}


