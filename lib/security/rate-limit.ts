/**
 * High-Performance Sliding Window Rate Limiter
 * 
 * Provides memory-safe sliding window rate limiting for Next.js Serverless and Edge runtimes.
 * Prevents DDoS, brute-force spam, and API resource exhaustion.
 */

interface RateLimitRecord {
  timestamps: number[];
}

interface RateLimitConfig {
  /** Time window in seconds */
  windowSeconds: number;
  /** Maximum allowed requests within the time window */
  maxRequests: number;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

// Global in-memory storage (persists across warm serverless invocations)
const memoryStore = new Map<string, RateLimitRecord>();

// Automatic garbage collection every 5 minutes to prevent memory leak
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function purgeExpiredRecords(now: number, maxWindowMs: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, record] of memoryStore.entries()) {
    const validTimestamps = record.timestamps.filter((ts) => now - ts < maxWindowMs);
    if (validTimestamps.length === 0) {
      memoryStore.delete(key);
    } else {
      record.timestamps = validTimestamps;
    }
  }
}

/**
 * Check and record a rate limit hit for a specific identifier (e.g. IP address or User ID)
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  const key = `${identifier}`;

  // Purge expired records periodically
  purgeExpiredRecords(now, windowMs);

  let record = memoryStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    memoryStore.set(key, record);
  }

  // Filter timestamps within the current sliding window
  const windowStart = now - windowMs;
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (record.timestamps.length >= config.maxRequests) {
    const oldestTimestamp = record.timestamps[0] || now;
    const resetSeconds = Math.ceil((oldestTimestamp + windowMs - now) / 1000);

    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      resetSeconds: Math.max(1, resetSeconds),
    };
  }

  // Register new hit
  record.timestamps.push(now);

  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - record.timestamps.length,
    resetSeconds: config.windowSeconds,
  };
}
