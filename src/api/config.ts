/**
 * Base URL for the Laravel API. Configured via VITE_API_BASE_URL so it can
 * change between environments (local, staging, production) without touching
 * source code — never hardcode the API host elsewhere in the app.
 *
 * Production builds fail closed: the variable must be set and must be https,
 * so a misconfigured deploy can never silently send form data over plain HTTP
 * or to a localhost fallback.
 */
const DEV_FALLBACK = "http://127.0.0.1:8000/api/v1";

function resolveApiBaseUrl(raw: string | undefined, production: boolean): string {
  const value = (raw ?? "").trim().replace(/\/+$/, "");

  if (!production) return value || DEV_FALLBACK;

  if (!value) {
    throw new Error("VITE_API_BASE_URL must be set for production builds.");
  }
  // Plain http is tolerated only for loopback, so `vite preview` of a production
  // build still works on a developer machine; any real host must be https.
  const isLoopback = /^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?(\/|$)/.test(value);
  if (!value.startsWith("https://") && !isLoopback) {
    throw new Error("VITE_API_BASE_URL must use https:// in production.");
  }
  return value;
}

export const API_BASE_URL: string = resolveApiBaseUrl(
  import.meta.env["VITE_API_BASE_URL"] as string | undefined,
  import.meta.env.PROD,
);

/**
 * Abort API requests that take longer than this, so a hung backend can't hang the UI.
 * Much tighter on the server: SSR blocks the HTML response on these calls, and a crawler
 * (or user) should get a fast error page rather than wait out a browser-length timeout.
 */
export const API_TIMEOUT_MS = typeof window === "undefined" ? 5_000 : 15_000;
