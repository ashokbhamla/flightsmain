import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const categories = [
      'flightsone_pages',
      'flightsround_pages',
      'airlinesround_pages',
      'airlinesone_pages',
      'airport_pages',
      'airlines_pages',
      'airport_hotels'
    ];

    const baseUrl = process.env.VERCEL_URL || 'https://airlinesmap.com';
    const statusChecks = [];

    for (const category of categories) {
      try {
        const response = await fetch(`${baseUrl}/sitemap-${category}.xml`, {
          method: 'HEAD',
          cache: 'no-store'
        });
        
        statusChecks.push({
          category,
          status: response.ok ? 'active' : 'inactive',
          statusCode: response.status,
          lastChecked: new Date().toISOString()
        });
      } catch (error) {
        statusChecks.push({
          category,
          status: 'error',
          error: error.message,
          lastChecked: new Date().toISOString()
        });
      }
    }

    const activeCount = statusChecks.filter(s => s.status === 'active').length;
    const inactiveCount = statusChecks.filter(s => s.status === 'inactive').length;
    const errorCount = statusChecks.filter(s => s.status === 'error').length;

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      summary: {
        total: statusChecks.length,
        active: activeCount,
        inactive: inactiveCount,
        errors: errorCount
      },
      sitemaps: statusChecks
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to check sitemap status',
        message: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
