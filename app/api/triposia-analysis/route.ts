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
    console.log('🔍 Fetching Triposia content for JSON extraction:', triposiaUrl);
    
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
    console.log('✅ Triposia content fetched for analysis, length:', html.length);
    
    // Try to extract JSON data from the HTML
    type ExtractedData = {
      searchCode: string | null;
      htmlLength: number;
      extractedAt: string;
      analysis: {
        hasScripts: number;
        hasJsonData: boolean;
        hasWidgetContent: boolean;
        hasApplicationLoader: boolean;
        hasDataLayer: boolean;
        hasConfig: boolean;
      };
      potentialData: {
        scripts: Array<{ length: number; hasJson: boolean; preview: string }>;
        configData: RegExpMatchArray | null;
        dataLayer: RegExpMatchArray | null;
        jsonMatches?: string[];
      };
    };
    const extractedData: ExtractedData = {
      searchCode,
      htmlLength: html.length,
      extractedAt: new Date().toISOString(),
      analysis: {
        hasScripts: (html.match(/<script/g) || []).length,
        hasJsonData: html.includes('"flight') || html.includes('"price') || html.includes('"route'),
        hasWidgetContent: html.includes('TPWL-wl_content'),
        hasApplicationLoader: html.includes('application_loader'),
        hasDataLayer: html.includes('dataLayer'),
        hasConfig: html.includes('TPWLCONFIG'),
      },
      potentialData: {
        scripts: (html.match(/<script[^>]*>[\s\S]*?<\/script>/g) || []).slice(0, 3).map(script => ({
          length: script.length,
          hasJson: script.includes('{') && script.includes('}'),
          preview: script.substring(0, 200) + '...'
        })),
        configData: html.match(/window\.TPWLCONFIG\s*=\s*({[\s\S]*?});/) || null,
        dataLayer: html.match(/dataLayer\s*=\s*(\[[\s\S]*?\]);/) || null,
      }
    };

    // Try to extract any JSON-like data
    const jsonMatches = html.match(/\{[^{}]*"(flight|price|route|airline|departure|arrival)"[^{}]*\}/g);
    if (jsonMatches) {
      extractedData.potentialData.jsonMatches = jsonMatches.slice(0, 5);
    }

    return NextResponse.json(extractedData);
  } catch (error) {
    console.error('Error analyzing Triposia content:', error);
    return NextResponse.json({ 
      error: 'Failed to analyze content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}


