import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchCode = searchParams.get('searchCode');

    if (!searchCode) {
      return NextResponse.json({ error: 'Missing searchCode parameter' }, { status: 400 });
    }

    // Fetch content from Triposia search widget
    const triposiaUrl = `https://search.triposia.com/flights/${searchCode}`;
    console.log('🔍 Fetching Triposia content from:', triposiaUrl);
    
    const response = await fetch(triposiaUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      console.error('❌ Triposia API error:', response.status);
      throw new Error(`API error ${response.status}`);
    }

    const html = await response.text();
    console.log('✅ Triposia content fetched, length:', html.length);
    
    // Return the raw HTML
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error fetching Triposia content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}


