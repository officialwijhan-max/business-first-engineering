import type { ContactPayload, Locale, QuoteRequestPayload } from "@/api/types";

/**
 * Decides where a "Get Started" submission goes and builds its payload.
 *
 * The Project Scoping tab / form (hidden `subject=scoping`) is a quote
 * request and goes to POST /quote-requests; every other inquiry type
 * (Schedule a Call, Partnership, Support) is a contact message and goes to
 * POST /contact. Pure functions on FormData so the routing can be unit tested.
 */
export type InquiryRequest =
  { kind: "quote"; payload: QuoteRequestPayload } | { kind: "contact"; payload: ContactPayload };

export const SCOPING_SUBJECT = "scoping";

/** The backend's stable "no service picked" key (EngagementOptions::PROJECT_TYPE_EXTRAS). */
const NO_SERVICE_PROJECT_TYPE = "not-sure";

export function isScopingInquiry(form: FormData): boolean {
  return form.get("subject") === SCOPING_SUBJECT;
}

export function buildInquiryRequest(
  form: FormData,
  locale: Locale,
  messagePrefix?: string,
): InquiryRequest {
  const text = (key: string) => String(form.get(key) ?? "");
  const optional = (key: string) => {
    const value = form.get(key);
    return typeof value === "string" && value.trim() !== "" ? value : undefined;
  };

  const message = [messagePrefix, text("description")]
    .filter((part): part is string => typeof part === "string" && part.trim() !== "")
    .join("\n\n");

  if (isScopingInquiry(form)) {
    return {
      kind: "quote",
      payload: {
        name: text("name"),
        company: optional("company"),
        email: text("email"),
        phone: optional("phone"),
        // Quote requests require a project type; the service select is optional in the UI.
        project_type: optional("projectType") ?? NO_SERVICE_PROJECT_TYPE,
        budget_range: optional("budget"),
        description: message,
        locale,
      },
    };
  }

  return {
    kind: "contact",
    payload: {
      name: text("name"),
      company: optional("company"),
      email: text("email"),
      phone: optional("phone"),
      subject: optional("subject"),
      project_type: optional("projectType"),
      budget_range: optional("budget"),
      message,
      locale,
    },
  };
}

/**
 * The form shows the message/description textarea's error under `message`
 * for both endpoints, so the quote endpoint's `description` errors are
 * re-keyed to it.
 */
export function toFormFieldErrors(
  kind: InquiryRequest["kind"],
  errors: Record<string, string[]>,
): Record<string, string[]> {
  if (kind !== "quote" || !("description" in errors)) return errors;
  const { description, ...rest } = errors;
  return { ...rest, message: [...(rest["message"] ?? []), ...(description ?? [])] };
}
