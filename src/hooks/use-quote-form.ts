import { useRef, useState, type FormEvent } from "react";
import { submitQuoteRequest } from "@/api/quote";
import type { Locale } from "@/api/types";
import { runSubmission } from "@/lib/form-submit";
import { isHoneypotTripped, validateFields } from "@/lib/form-guards";

type Status = "idle" | "submitting" | "success";

/** Shared submit behavior for the Quote Request form — see use-contact-form.ts. */
export function useQuoteForm(locale: Locale) {
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  // See use-contact-form.ts: a ref (not state) is required to reliably block
  // two synchronous submit clicks before React's first re-render commits.
  const submittingRef = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submittingRef.current) return;
    submittingRef.current = true;

    const form = new FormData(event.currentTarget);

    // A bot filled the hidden field: pretend success and send nothing.
    if (isHoneypotTripped(form)) {
      setStatus("success");
      return;
    }

    setFieldErrors({});
    setGeneralError(null);
    const optional = (key: string) => {
      const value = form.get(key);
      return typeof value === "string" && value.trim() !== "" ? value : undefined;
    };

    const clientErrors = validateFields(locale, {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: optional("phone"),
      company: optional("company"),
      message: String(form.get("description") ?? ""),
      messageKey: "description",
      extras: {
        project_type: String(form.get("projectType") ?? ""),
        budget_range: String(form.get("budget") ?? ""),
      },
    });
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      submittingRef.current = false;
      return;
    }

    setStatus("submitting");

    const outcome = await runSubmission(locale, () =>
      submitQuoteRequest({
        name: String(form.get("name") ?? ""),
        company: optional("company"),
        email: String(form.get("email") ?? ""),
        phone: optional("phone"),
        project_type: String(form.get("projectType") ?? ""),
        budget_range: String(form.get("budget") ?? ""),
        description: String(form.get("description") ?? ""),
        locale,
      }),
    );

    if (outcome.kind === "success") {
      setStatus("success");
      return;
    }

    setFieldErrors(outcome.fieldErrors);
    setGeneralError(outcome.generalError);
    setStatus("idle");
    submittingRef.current = false;
  }

  function reset() {
    setStatus("idle");
    setFieldErrors({});
    setGeneralError(null);
    submittingRef.current = false;
  }

  return {
    submitted: status === "success",
    submitting: status === "submitting",
    fieldErrors,
    generalError,
    submit,
    reset,
  };
}
