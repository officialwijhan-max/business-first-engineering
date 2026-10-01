import { submitContact } from "./contact";
import { submitQuoteRequest } from "./quote";
import type { SubmissionResult } from "./types";
import type { InquiryRequest } from "@/lib/inquiry-request";

/** Sends a built inquiry to the endpoint its kind belongs to. */
export function submitInquiry(request: InquiryRequest): Promise<SubmissionResult> {
  return request.kind === "quote"
    ? submitQuoteRequest(request.payload)
    : submitContact(request.payload);
}
