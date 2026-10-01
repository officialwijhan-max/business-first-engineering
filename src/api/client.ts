import { API_BASE_URL, API_TIMEOUT_MS } from "./config";
import type { ApiErrorBody, ApiSuccess } from "./types";

/** A 422 Laravel validation response — field-level errors, keyed by field name. */
export class ApiValidationError extends Error {
  constructor(
    message: string,
    public readonly errors: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiValidationError";
  }
}

/** Any other non-2xx response, or a network/parse failure (status 0). */
export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

function messageForStatus(status: number, fallback: string): string {
  switch (status) {
    case 0:
      return "Unable to reach the server. Check your connection and try again.";
    case 401:
      return "You need to sign in to do that.";
    case 403:
      return "You are not authorized to do that.";
    case 404:
      return "The requested resource was not found.";
    case 429:
      return "Too many requests. Please wait a moment and try again.";
    default:
      return status >= 500
        ? "Something went wrong on our end. Please try again shortly."
        : fallback;
  }
}

/**
 * Thin wrapper around fetch: resolves the base URL, sends/parses JSON, and
 * normalizes every failure mode (validation, auth, rate limiting, server
 * errors, network failure) into one of the two error types above so callers
 * never have to branch on raw status codes or leak a raw backend message.
 */
export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      // Public, cookie-less API: never attach credentials, and abort hung requests.
      credentials: "omit",
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
      headers: {
        // Only requests with a body declare a JSON content type. On a GET it would turn
        // a "simple" cross-origin request into one that needs a CORS preflight first.
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        Accept: "application/json",
        ...init?.headers,
      },
    });
  } catch {
    // Network failure or timeout — same generic message either way.
    throw new ApiRequestError(messageForStatus(0, "Network error."), 0);
  }

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    // No/invalid JSON body — fall through to status-based handling below.
  }

  if (!response.ok) {
    const errorBody = body as ApiErrorBody | null;

    if (response.status === 422 && errorBody?.errors) {
      throw new ApiValidationError(errorBody.message ?? "Validation failed.", errorBody.errors);
    }

    throw new ApiRequestError(
      // Never surface the backend's own message for non-validation errors.
      messageForStatus(response.status, "Something went wrong. Please try again."),
      response.status,
    );
  }

  return body as T;
}

export function apiGet<T>(path: string): Promise<T> {
  return apiRequest<T>(path, { method: "GET" });
}

export function apiPost<T>(path: string, payload: unknown): Promise<T> {
  return apiRequest<T>(path, { method: "POST", body: JSON.stringify(payload) });
}

/**
 * A 2xx is only a delivered submission if the body says so. An empty or foreign body
 * on a 2xx (captive portal, misconfigured proxy, truncated response) must surface as
 * an error, never as a "your request is in" screen for a message nobody received.
 */
export function assertSubmissionAccepted<T>(body: ApiSuccess<T> | null | undefined): T {
  if (!body || body.success !== true || body.data == null) {
    throw new ApiRequestError("Something went wrong on our end. Please try again shortly.", 502);
  }
  return body.data;
}
