type HeaderGetter = Pick<Headers, "get">;

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
  now?: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitStore = Map<string, RateLimitEntry>;

declare global {
  var portfolioRateLimitStore: RateLimitStore | undefined;
}

const globalStore = globalThis as typeof globalThis & {
  portfolioRateLimitStore?: RateLimitStore;
};
const store: RateLimitStore = globalStore.portfolioRateLimitStore || new Map<string, RateLimitEntry>();

if (!globalStore.portfolioRateLimitStore) {
  globalStore.portfolioRateLimitStore = store;
}

function pruneExpiredEntries(now: number) {
  store.forEach((entry, key) => {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  });
}

export function getClientIp(headers: HeaderGetter) {
  const candidates = [
    headers.get("x-forwarded-for"),
    headers.get("x-real-ip"),
    headers.get("cf-connecting-ip"),
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const value = candidate.split(",")[0]?.trim();
    if (value) return value;
  }

  return "unknown";
}

export function consumeRateLimit({
  key,
  limit,
  windowMs,
  now = Date.now(),
}: RateLimitOptions) {
  pruneExpiredEntries(now);

  const current = store.get(key);
  const resetAt = current?.resetAt && current.resetAt > now ? current.resetAt : now + windowMs;
  const entry: RateLimitEntry =
    current && current.resetAt > now
      ? { count: current.count, resetAt: current.resetAt }
      : { count: 0, resetAt };

  if (entry.count >= limit) {
    return {
      allowed: false,
      limit,
      remaining: 0,
      resetAt: entry.resetAt,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }

  entry.count += 1;
  store.set(key, entry);

  return {
    allowed: true,
    limit,
    remaining: Math.max(0, limit - entry.count),
    resetAt: entry.resetAt,
    retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
  };
}
