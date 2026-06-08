interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export function rateLimit(
  key: string,
  config: RateLimitConfig = { windowMs: 3600000, maxRequests: 5 }
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return { success: true, remaining: config.maxRequests - 1, resetAt: now + config.windowMs };
  }

  entry.count += 1;

  if (entry.count > config.maxRequests) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { success: true, remaining: config.maxRequests - entry.count, resetAt: entry.resetAt };
}

export function getClientIP(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
