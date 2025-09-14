import { NextRequest, NextResponse } from 'next/server';
import { normalizeFlights } from '@/lib/flightNormalizer';

export async function POST(request: NextRequest) {
  try {
    const rawData = await request.json();
    
    if (!Array.isArray(rawData)) {
      return NextResponse.json({ error: 'Invalid data format. Expected an array.' }, { status: 400 });
    }

    const normalizedFlights = normalizeFlights(rawData);
    
    return NextResponse.json({
      success: true,
      flights: normalizedFlights,
      count: normalizedFlights.length
    });
  } catch (error) {
    console.error('Error normalizing flights:', error);
    return NextResponse.json({ error: 'Failed to normalize flight data' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST method to normalize flight data',
    example: {
      method: 'POST',
      body: 'Array of raw flight data from API'
    }
  });
}
