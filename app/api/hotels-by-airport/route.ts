import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const airportCode = searchParams.get('airport_code');
  const lang = searchParams.get('lang_id') || '1';
  const domain = searchParams.get('domain_id') || '1';

  if (!airportCode) {
    return NextResponse.json({ error: 'Airport code is required' }, { status: 400 });
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/hotels?airport_code=${airportCode}&lang=${lang}&domain_id=${domain}`;
    const response = await fetch(url, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.warn(`API error ${response.status}: ${await response.text()}`);
      return NextResponse.json(null); // Return null instead of error
    }
    
    const data = await response.json();
    return NextResponse.json(data || []);
  } catch (error) {
    console.warn('Error fetching hotels by airport:', error);
    return NextResponse.json(null); // Return null instead of error
  }
}
