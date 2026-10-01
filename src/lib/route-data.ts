import { notFound } from "@tanstack/react-router";
import { ApiRequestError } from "@/api/client";

/**
 * Loader error policy for pages that depend on one API record.
 *
 * - The API says the record doesn't exist (404): throw the router's `notFound()`, which renders
 *   the localized 404 page with a real HTTP 404 — never a 200 "not found" page, which search
 *   engines treat as a soft 404 and may index.
 * - Anything else (API down, timeout, 5xx): rethrow, so the route's error boundary renders the
 *   error page with HTTP 500. A temporary outage must not turn into an indexable empty page.
 */
export function rethrowAsNotFound(error: unknown): never {
  if (error instanceof ApiRequestError && error.status === 404) throw notFound();
  throw error;
}
