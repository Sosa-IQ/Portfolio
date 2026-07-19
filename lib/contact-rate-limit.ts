type RateLimitEntry = { count: number; resetAt: number };
type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 3;
const globalState = globalThis as typeof globalThis & {
  __portfolioContactRateLimits?: Map<string, RateLimitEntry>;
};
const attempts = globalState.__portfolioContactRateLimits ?? new Map<string, RateLimitEntry>();
globalState.__portfolioContactRateLimits = attempts;

export function consumeContactRateLimit(key: string, now = Date.now()): RateLimitResult {
  const existing = attempts.get(key);
  if (!existing || existing.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function resetContactRateLimits() {
  attempts.clear();
}
