import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Verify this is a Vercel cron request
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'your-secret-key';
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('🔄 Starting weekly sitemap update...');
    const startTime = Date.now();
    
    // Update sitemap cache by calling the edge functions
    const categories = [
      'flightsone_pages',
      'flightsround_pages',
      'airlinesround_pages',
      'airlinesone_pages',
      'airport_pages',
      'airlines_pages',
      'airport_hotels'
    ];

    const results = [];
    
    for (const category of categories) {
      try {
        // Trigger cache refresh by calling the sitemap endpoint
        const response = await fetch(`${process.env.VERCEL_URL || 'https://airlinesmap.com'}/sitemap-${category}.xml`, {
          cache: 'no-store',
          headers: {
            'User-Agent': 'AirlinesMap-Cron/1.0'
          }
        });
        
        if (response.ok) {
          results.push({ category, status: 'success' });
          console.log(`✅ Updated sitemap for ${category}`);
        } else {
          results.push({ category, status: 'failed', error: response.status });
          console.log(`❌ Failed to update sitemap for ${category}: ${response.status}`);
        }
      } catch (error) {
        results.push({ category, status: 'error', error: error.message });
        console.error(`❌ Error updating ${category}:`, error);
      }
    }

    const duration = Date.now() - startTime;
    const successCount = results.filter(r => r.status === 'success').length;
    
    console.log(`✅ Weekly sitemap update completed in ${duration}ms. ${successCount}/${results.length} categories updated successfully.`);
    
    return NextResponse.json({
      success: true,
      message: 'Sitemaps updated successfully',
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      results: results,
      summary: {
        total: results.length,
        successful: successCount,
        failed: results.length - successCount
      }
    });
  } catch (error) {
    console.error('❌ Error during weekly sitemap update:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update sitemaps',
        message: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request);
}
