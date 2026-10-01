import { apiPost, assertSubmissionAccepted } from "./client";
import type { ApiSuccess, ContactPayload, SubmissionResult } from "./types";

export async function submitContact(payload: ContactPayload): Promise<SubmissionResult> {
  const response = await apiPost<ApiSuccess<SubmissionResult>>("/contact", payload);
  return assertSubmissionAccepted(response);
}
