import { NextRequest, NextResponse } from 'next/server';
import { RedisCache, CacheKeys } from '@/lib/redis';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const key = searchParams.get('key');
    const pattern = searchParams.get('pattern');

    switch (action) {
      case 'status':
        // Check Redis connection status
        const isConnected = await RedisCache.exists('health_check');
        return NextResponse.json({ 
          status: 'connected', 
          connected: isConnected,
          timestamp: new Date().toISOString()
        });

      case 'get':
        if (!key) {
          return NextResponse.json({ error: 'Key is required for GET action' }, { status: 400 });
        }
        const data = await RedisCache.get(key);
        return NextResponse.json({ key, data, found: data !== null });

      case 'exists':
        if (!key) {
          return NextResponse.json({ error: 'Key is required for EXISTS action' }, { status: 400 });
        }
        const exists = await RedisCache.exists(key);
        return NextResponse.json({ key, exists });

      case 'stats':
        // Get cache statistics (this would need to be implemented in RedisCache)
        return NextResponse.json({ 
          message: 'Cache statistics not implemented yet',
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json({ 
          available_actions: ['status', 'get', 'exists', 'stats'],
          usage: {
            status: '/api/cache?action=status',
            get: '/api/cache?action=get&key=your_key',
            exists: '/api/cache?action=exists&key=your_key',
            stats: '/api/cache?action=stats'
          }
        });
    }
  } catch (error) {
    console.error('Cache API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const key = searchParams.get('key');

    switch (action) {
      case 'clear':
        if (!key) {
          return NextResponse.json({ error: 'Key is required for CLEAR action' }, { status: 400 });
        }
        const deleted = await RedisCache.del(key);
        return NextResponse.json({ 
          key, 
          deleted,
          message: deleted ? 'Key deleted successfully' : 'Key not found or already deleted'
        });

      case 'flush':
        // Clear all cache (use with caution)
        const flushed = await RedisCache.flushAll();
        return NextResponse.json({ 
          flushed,
          message: flushed ? 'All cache cleared successfully' : 'Failed to clear cache'
        });

      default:
        return NextResponse.json({ 
          available_actions: ['clear', 'flush'],
          usage: {
            clear: 'DELETE /api/cache?action=clear&key=your_key',
            flush: 'DELETE /api/cache?action=flush'
          }
        });
    }
  } catch (error) {
    console.error('Cache DELETE API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, key, value, ttl } = body;

    switch (action) {
      case 'set':
        if (!key || value === undefined) {
          return NextResponse.json({ 
            error: 'Key and value are required for SET action' 
          }, { status: 400 });
        }
        const setResult = await RedisCache.set(key, value, ttl || 3600);
        return NextResponse.json({ 
          key, 
          set: setResult,
          ttl: ttl || 3600,
          message: setResult ? 'Key set successfully' : 'Failed to set key'
        });

      case 'warm':
        // Warm up cache with common data
        const warmupKeys = [
          'layout:data:1:1',
          'airline:contact:6e',
          'airline:contact:ai',
          'airline:contact:sg'
        ];
        
        const warmupResults = await Promise.all(
          warmupKeys.map(async (warmKey) => {
            const exists = await RedisCache.exists(warmKey);
            return { key: warmKey, exists };
          })
        );
        
        return NextResponse.json({ 
          message: 'Cache warmup check completed',
          results: warmupResults,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json({ 
          available_actions: ['set', 'warm'],
          usage: {
            set: 'POST /api/cache with body: { "action": "set", "key": "your_key", "value": "your_value", "ttl": 3600 }',
            warm: 'POST /api/cache with body: { "action": "warm" }'
          }
        });
    }
  } catch (error) {
    console.error('Cache POST API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
