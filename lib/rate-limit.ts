interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;

/**
 * Fixed-window rate limiter.
 *
 * ⚠ IN-MEMORY, AND THEREFORE PER-INSTANCE. It resets on deploy and does not
 * coordinate across serverless instances or regions, so the effective limit is
 * `limit × instances`. That is the correct trade for V1 — it stops casual
 * scripted abuse with no infrastructure — but it is NOT a defence against a
 * determined attacker.
 *
 * When abuse actually appears, swap the body of this function for Redis
 * (Upstash `INCR` + `EXPIRE` is a direct replacement). Nothing outside this
 * file needs to change: that is why the signature returns a plain verdict
 * rather than exposing any storage detail.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();

  // Opportunistic prune. Buckets are tiny, but an unbounded Map on a
  // long-lived instance is a slow memory leak.
  if (buckets.size > MAX_BUCKETS) {
    for (const [bucketKey, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(bucketKey);
    }
  }

  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return {
    ok: true,
    remaining: limit - existing.count,
    retryAfterSeconds: 0,
  };
}

/**
 * Best-effort client identity from proxy headers.
 *
 * These headers are attacker-controlled unless a trusted proxy overwrites them,
 * which is exactly why the limiter above is described as a speed bump. Takes
 * the FIRST entry of x-forwarded-for (the original client) rather than the
 * last, and falls back to a shared bucket so a request with no usable header is
 * still counted rather than exempt.
 */
export function clientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    headers.get("x-real-ip")?.trim() ||
    "unknown";

  return ip;
}
