import { apiPost, assertSubmissionAccepted } from "./client";
import type { ApiSuccess, QuoteRequestPayload, SubmissionResult } from "./types";

/**
 * NOTE: the integration spec calls this endpoint `POST /quote`, but the
 * actual Laravel backend (verified via `php artisan route:list`) exposes it
 * at `POST /quote-requests`. Using the real, working route rather than the
 * documented-but-nonexistent one — see the integration report for details.
 */
export async function submitQuoteRequest(payload: QuoteRequestPayload): Promise<SubmissionResult> {
  const response = await apiPost<ApiSuccess<SubmissionResult>>("/quote-requests", payload);
  return assertSubmissionAccepted(response);
}
