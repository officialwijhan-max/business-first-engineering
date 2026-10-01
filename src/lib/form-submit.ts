import { ApiRequestError, ApiValidationError } from "@/api/client";
import type { Locale } from "@/api/types";
import { localizeApiError, localizeFieldErrors, validationSummary } from "@/lib/api-messages";

export type SubmissionOutcome =
  | { kind: "success" }
  | { kind: "error"; fieldErrors: Record<string, string[]>; generalError: string };

/**
 * Runs a form submission and reduces every possible result to one of two outcomes.
 * "success" is returned only when `send` resolves, i.e. the API answered 2xx with a
 * success body; a 422, 429, 5xx, network failure or malformed response is always an
 * "error" with a localized message, so a success screen can never be shown for a
 * request that did not go through.
 */
export async function runSubmission(
  locale: Locale,
  send: () => Promise<unknown>,
): Promise<SubmissionOutcome> {
  try {
    await send();
    return { kind: "success" };
  } catch (error) {
    if (error instanceof ApiValidationError) {
      return {
        kind: "error",
        fieldErrors: localizeFieldErrors(locale, error.errors),
        generalError: validationSummary(locale),
      };
    }
    return {
      kind: "error",
      fieldErrors: {},
      generalError: localizeApiError(locale, error instanceof ApiRequestError ? error : null),
    };
  }
}
