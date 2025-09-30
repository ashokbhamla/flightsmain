import { createClient } from 'redis';

// Redis client configuration
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://default:a6HDxpu1HoAfEyVFiBBplk8KlV3UPRsQ@redis-15520.c259.us-central1-2.gce.redns.redis-cloud.com:15520'
});

// Connect to Redis
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

// Initialize connection
if (!redisClient.isOpen) {
  redisClient.connect().catch(console.error);
}

// Cache utility functions
export class RedisCache {
  // Get data from cache
  static async get(key: string): Promise<any> {
    try {
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  // Set data in cache with TTL
  static async set(key: string, value: any, ttlSeconds: number = 3600): Promise<boolean> {
    try {
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }
      await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Redis SET error:', error);
      return false;
    }
  }

  // Delete data from cache
  static async del(key: string): Promise<boolean> {
    try {
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }
      await redisClient.del(key);
      return true;
    } catch (error) {
      console.error('Redis DEL error:', error);
      return false;
    }
  }

  // Check if key exists
  static async exists(key: string): Promise<boolean> {
    try {
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      return false;
    }
  }

  // Get multiple keys
  static async mget(keys: string[]): Promise<any[]> {
    try {
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }
      const data = await redisClient.mGet(keys);
      return data.map(item => item ? JSON.parse(item) : null);
    } catch (error) {
      console.error('Redis MGET error:', error);
      return [];
    }
  }

  // Set multiple key-value pairs
  static async mset(keyValuePairs: Record<string, any>, ttlSeconds: number = 3600): Promise<boolean> {
    try {
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }
      const pipeline = redisClient.multi();
      
      Object.entries(keyValuePairs).forEach(([key, value]) => {
        pipeline.setEx(key, ttlSeconds, JSON.stringify(value));
      });
      
      await pipeline.exec();
      return true;
    } catch (error) {
      console.error('Redis MSET error:', error);
      return false;
    }
  }

  // Clear all cache (use with caution)
  static async flushAll(): Promise<boolean> {
    try {
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }
      await redisClient.flushAll();
      return true;
    } catch (error) {
      console.error('Redis FLUSHALL error:', error);
      return false;
    }
  }
}

// Cache key generators
export const CacheKeys = {
  // Content API cache keys
  airlineContent: (airlineCode: string, arrivalIata: string, departureIata: string, langId: number, domainId: number) => 
    `airline:content:${airlineCode}:${departureIata}-${arrivalIata}:${langId}:${domainId}`,
  
  airlineAirportContent: (airlineCode: string, departureIata: string, langId: number, domainId: number) => 
    `airline:airport:content:${airlineCode}:${departureIata}:${langId}:${domainId}`,
  
  // Flight data cache keys
  airlineData: (airlineCode: string, arrivalIata: string, departureIata: string, langId: number, domainId: number) => 
    `airline:data:${airlineCode}:${departureIata}-${arrivalIata}:${langId}:${domainId}`,
  
  airlineAirportData: (airlineCode: string, departureIata: string, domainId: number) => 
    `airline:airport:data:${airlineCode}:${departureIata}:${domainId}`,
  
  // City data cache keys
  cityData: (cityIata: string, langId: number, domainId: number) => 
    `city:data:${cityIata}:${langId}:${domainId}`,
  
  // Contact info cache keys
  airlineContactInfo: (airlineCode: string) => 
    `airline:contact:${airlineCode}`,
  
  // Flight content cache keys
  flightContent: (arrivalIata: string, departureIata: string, langId: number, domainId: number) => 
    `flight:content:${departureIata}-${arrivalIata}:${langId}:${domainId}`,
  
  flightData: (arrivalIata: string, departureIata: string, langId: number, domainId: number) => 
    `flight:data:${departureIata}-${arrivalIata}:${langId}:${domainId}`,
  
  // Layout data cache key
  layoutData: (langId: number, domainId: number) => 
    `layout:data:${langId}:${domainId}`,
};

// Cache TTL constants (in seconds)
export const CacheTTL = {
  SHORT: 300,      // 5 minutes
  MEDIUM: 1800,    // 30 minutes
  LONG: 3600,      // 1 hour
  VERY_LONG: 7200, // 2 hours
  DAILY: 86400,    // 24 hours
};

export default redisClient;
