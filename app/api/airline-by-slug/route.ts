import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const lang = searchParams.get('lang_id') || '1';
  const domain = searchParams.get('domain_id') || '1';

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_CONTENT}/content/airlines?slugs=${slug}&lang_id=${lang}&domain_id=${domain}`;
    const response = await fetch(url, { 
      cache: 'no-store' // Client-side: no caching
    });
    
    if (!response.ok) {
      throw new Error(`API error ${response.status}: ${await response.text()}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data[0] || null);
  } catch (error) {
    console.error('Error fetching airline by slug:', error);
    return NextResponse.json({ error: 'Failed to fetch airline data' }, { status: 500 });
  }
}

