/**
 * High-Performance Sliding Window Rate Limiter
 * 
 * Provides memory-safe sliding window rate limiting for Next.js Serverless and Edge runtimes.
 * Prevents DDoS, brute-force spam, and API resource exhaustion.
 */

interface RateLimitRecord {
  timestamps: number[];
  expiresAt: number;
}

export interface RateLimitConfig {
  /** Time window in seconds */
  windowSeconds: number;
  /** Maximum allowed requests within the time window */
  maxRequests: number;
}

export interface RateLimitResult {
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

function purgeExpiredRecords(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, record] of memoryStore.entries()) {
    if (record.expiresAt <= now) memoryStore.delete(key);
  }
}

async function checkUpstashRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const key = `ratelimit:${identifier}`;
  const script = [
    "local count = redis.call('INCR', KEYS[1])",
    "if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end",
    "local ttl = redis.call('TTL', KEYS[1])",
    "return { count, ttl }",
  ].join(" ");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        "EVAL",
        script,
        "1",
        key,
        String(config.windowSeconds),
      ]),
      cache: "no-store",
      signal: AbortSignal.timeout(2_500),
    });

    if (!response.ok) return null;
    const payload = (await response.json()) as { result?: [number, number] };
    const count = payload.result?.[0];
    const ttl = payload.result?.[1];
    if (typeof count !== "number" || typeof ttl !== "number") return null;

    return {
      success: count <= config.maxRequests,
      limit: config.maxRequests,
      remaining: Math.max(0, config.maxRequests - count),
      resetSeconds: Math.max(1, ttl),
    };
  } catch {
    return null;
  }
}

/**
 * Check and record a rate limit hit for a specific identifier (e.g. IP address or User ID)
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const distributedResult = await checkUpstashRateLimit(identifier, config);
  if (distributedResult) return distributedResult;

  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  const key = `${identifier}`;

  // Purge expired records periodically
  purgeExpiredRecords(now);

  let record = memoryStore.get(key);
  if (!record) {
    record = { timestamps: [], expiresAt: now + windowMs };
    memoryStore.set(key, record);
  }

  // Filter timestamps within the current sliding window
  const windowStart = now - windowMs;
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);
  record.expiresAt = now + windowMs;

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
