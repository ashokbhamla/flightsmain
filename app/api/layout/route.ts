import { NextRequest, NextResponse } from 'next/server';
import { fetchLayout } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || '1';
    const langId = parseInt(lang) as 1 | 2;
    
    const data = await fetchLayout(langId);
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Layout API error:', error);
    
    // Return fallback data
    const fallbackData = {
      header: {
        logo: '/logo.png',
        navigation: [],
        phone: '1-800-FLIGHTS'
      },
      footer: {
        description: 'Find the best flight deals worldwide',
        links: [],
        social: []
      }
    };
    
    return NextResponse.json(fallbackData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300',
        'Content-Type': 'application/json',
      },
    });
  }
}
