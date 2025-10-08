// Simple in-memory rate limiter to prevent spam

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 10 * 60 * 1000);

/**
 * Check if request should be rate limited
 * @param identifier - IP address or other unique identifier
 * @param maxRequests - Maximum requests allowed in time window
 * @param windowMs - Time window in milliseconds
 * @returns true if rate limit exceeded, false otherwise
 */
export function isRateLimited(
  identifier: string,
  maxRequests: number = 5, // Default: 5 requests
  windowMs: number = 15 * 60 * 1000 // Default: 15 minutes
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    // First request or window expired, create new entry
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return false;
  }

  if (entry.count >= maxRequests) {
    // Rate limit exceeded
    return true;
  }

  // Increment count
  entry.count++;
  rateLimitMap.set(identifier, entry);
  return false;
}

/**
 * Get remaining requests for an identifier
 */
export function getRemainingRequests(
  identifier: string,
  maxRequests: number = 5
): number {
  const entry = rateLimitMap.get(identifier);
  if (!entry || Date.now() > entry.resetTime) {
    return maxRequests;
  }
  return Math.max(0, maxRequests - entry.count);
}

/**
 * Get time until reset (in seconds)
 */
export function getResetTime(identifier: string): number {
  const entry = rateLimitMap.get(identifier);
  if (!entry || Date.now() > entry.resetTime) {
    return 0;
  }
  return Math.floor((entry.resetTime - Date.now()) / 1000);
}

