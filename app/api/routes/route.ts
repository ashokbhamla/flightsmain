import { NextRequest, NextResponse } from 'next/server';
import { generateLocationBasedRoutes } from '@/lib/location-routes';
import { getLocationWithFallbacks } from '@/lib/server-geoip';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const country = searchParams.get('country');
    const countryCode = searchParams.get('countryCode');
    
    // Get user location from headers or parameters
    let userLocation;
    
    if (city && countryCode) {
      // Use provided parameters
      userLocation = {
        country: country || 'Unknown',
        countryCode,
        region: 'Unknown',
        regionCode: 'Unknown',
        city,
        latitude: 0,
        longitude: 0,
        timezone: 'UTC'
      };
    } else {
      // Try to get from headers
      const headers = request.headers;
      userLocation = getLocationWithFallbacks(headers);
    }
    
    // Ensure userLocation is valid
    if (!userLocation || !userLocation.city) {
      console.log('Invalid userLocation from headers, using default');
      userLocation = {
        country: 'United States',
        countryCode: 'US',
        region: 'New York',
        regionCode: 'NY',
        city: 'New York',
        latitude: 40.7128,
        longitude: -74.0060,
        timezone: 'America/New_York'
      };
    }
    
    // Generate location-based routes
    const locationRoutes = await generateLocationBasedRoutes(userLocation);
    
    return NextResponse.json({
      success: true,
      data: locationRoutes,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error in routes API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to load routes data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fromCity, toCity, fromCountry, toCountry } = body;
    
    if (!fromCity || !toCity) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required parameters: fromCity and toCity' 
        },
        { status: 400 }
      );
    }
    
    // This would typically search for specific routes
    // For now, return a placeholder response
    return NextResponse.json({
      success: true,
      data: {
        fromCity,
        toCity,
        fromCountry,
        toCountry,
        routes: [],
        message: 'Route search functionality coming soon'
      }
    });
    
  } catch (error) {
    console.error('Error in routes POST API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process route search',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
