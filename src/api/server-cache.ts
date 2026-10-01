import { ApiRequestError, apiGet } from "./client";

/**
 * Read-through cache for the public GET endpoints (services, work, case studies), used while
 * server-rendering. Without it every page view waits on the API (the header and footer need the
 * services and work lists on every route), and a slow or dead API turns directly into a slow or
 * dead website.
 *
 * - Fresh for 60 s: repeat views, crawlers and the sitemap never touch the API.
 * - Concurrent identical requests share one upstream call (no stampede after expiry).
 * - If the API fails (network, timeout, 5xx) and we hold a copy younger than 10 minutes, that copy
 *   is served instead, so a short backend outage does not take pages down. A 404 is never masked:
 *   a record that was deleted must disappear.
 * - Browser requests bypass all of this (per-visitor React Query cache already covers them).
 *
 * State lives in module scope, i.e. per server process / Worker isolate: best-effort by design.
 */
export const SERVER_CACHE_FRESH_MS = 60_000;
export const SERVER_CACHE_STALE_MS = 10 * 60_000;
/** After serving a stale copy because the API failed, don't hit the API again for this long. */
export const SERVER_CACHE_RETRY_MS = 30_000;

interface Entry {
  value: unknown;
  fetchedAt: number;
  /** Set when the API failed and this copy was served instead: earliest time to try again. */
  retryAt?: number;
}

const entries = new Map<string, Entry>();
const inflight = new Map<string, Promise<unknown>>();

export function clearServerCache(): void {
  entries.clear();
  inflight.clear();
}

function canServeStale(error: unknown): boolean {
  return error instanceof ApiRequestError ? error.status === 0 || error.status >= 500 : true;
}

export async function cachedApiGet<T>(path: string): Promise<T> {
  if (typeof window !== "undefined") return apiGet<T>(path);

  const now = Date.now();
  const entry = entries.get(path);
  if (entry && now - entry.fetchedAt < SERVER_CACHE_FRESH_MS) return entry.value as T;
  // The API just failed and we are riding on a stale copy: don't make every visitor wait out
  // the timeout again, keep serving it until the next retry window.
  if (entry?.retryAt && now < entry.retryAt && now - entry.fetchedAt < SERVER_CACHE_STALE_MS) {
    return entry.value as T;
  }

  let request = inflight.get(path) as Promise<T> | undefined;
  if (!request) {
    request = apiGet<T>(path)
      .then((value) => {
        entries.set(path, { value, fetchedAt: Date.now() });
        return value;
      })
      .finally(() => inflight.delete(path));
    inflight.set(path, request);
  }

  try {
    return await request;
  } catch (error) {
    if (entry && Date.now() - entry.fetchedAt < SERVER_CACHE_STALE_MS && canServeStale(error)) {
      entry.retryAt = Date.now() + SERVER_CACHE_RETRY_MS;
      return entry.value as T;
    }
    throw error;
  }
}
