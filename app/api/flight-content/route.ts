import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const arrival_iata = searchParams.get('arrival_iata');
    const departure_iata = searchParams.get('departure_iata');
    const lang = searchParams.get('lang_id');
    const domain_id = searchParams.get('domain_id');

    if (!arrival_iata || !departure_iata || !lang || !domain_id) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE}/content/flights?arrival_iata=${arrival_iata}&departure_iata=${departure_iata}&lang_id=${lang}&domain_id=${domain_id}`;
    
    console.log('🔍 Fetching content from:', apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('❌ Content API error:', response.status);
      throw new Error(`API error ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    console.log('📦 Raw content API response type:', Array.isArray(data) ? 'array' : 'object');
    console.log('📦 Content API data length:', Array.isArray(data) ? data.length : 'N/A');
    
    // API returns an array, extract first object
    const contentData = Array.isArray(data) && data.length > 0 ? data[0] : data;
    console.log('✅ Extracted content data keys:', contentData ? Object.keys(contentData).join(', ') : 'null');
    
    return NextResponse.json(contentData);
  } catch (error) {
    console.error('Error in flight-content API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
