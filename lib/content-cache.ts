/**
 * Content loaders read, parse and validate every MDX file in a collection.
 * That used to happen once at build time. Since the CSP nonce made every route
 * dynamic (spec §13), it happens on every request instead — measured at roughly
 * 1.5ms per file, so a 200-piece Lab would spend ~300ms in the loader before
 * sending a byte.
 *
 * Content is immutable within a deployment: the MDX files ship inside the build
 * and nothing writes to them at runtime. So in production the first request pays
 * for the read and every later one is free.
 *
 * Development is deliberately left uncached, so editing a file still shows up
 * on reload.
 */
export function memoizeInProduction<T>(load: () => Promise<T>): () => Promise<T> {
  if (process.env.NODE_ENV !== "production") return load;

  let inFlight: Promise<T> | null = null;

  return () => {
    // Caching the promise rather than the value also collapses concurrent
    // requests during a cold start into a single read.
    inFlight ??= load().catch((error) => {
      // Never cache a failure — a transient read error would otherwise poison
      // the collection for the life of the instance.
      inFlight = null;
      throw error;
    });
    return inFlight;
  };
}
