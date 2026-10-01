import { useRef, useState, type FormEvent } from "react";
import { submitContact } from "@/api/contact";
import type { Locale } from "@/api/types";
import { runSubmission } from "@/lib/form-submit";
import { isHoneypotTripped, validateFields } from "@/lib/form-guards";

type Status = "idle" | "submitting" | "success";

/**
 * Shared submit behavior for the Contact form (English and Arabic pages
 * render their own JSX/labels, both call this for the actual API logic —
 * keeps the request/validation/error handling in one place). Reads fields
 * straight off the native <form> via FormData, matching the existing
 * uncontrolled-input markup so no input needs to become controlled.
 */
export function useContactForm(locale: Locale) {
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  // React state updates are batched/async, so two synchronous clicks (e.g.
  // a fast double-click before the first re-render commits) can both read
  // `status` as "idle" and both fire a request. A ref updates immediately,
  // so it's the only reliable guard against that race.
  const submittingRef = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>, messagePrefix?: string) {
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

    const message = [messagePrefix, String(form.get("description") ?? "")]
      .filter((part): part is string => typeof part === "string" && part.trim() !== "")
      .join("\n\n");

    const clientErrors = validateFields(locale, {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: optional("phone"),
      company: optional("company"),
      message,
      messageKey: "message",
      extras: {
        subject: optional("subject"),
        project_type: optional("projectType"),
        budget_range: optional("budget"),
      },
    });
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      submittingRef.current = false;
      return;
    }

    setStatus("submitting");

    const outcome = await runSubmission(locale, () =>
      submitContact({
        name: String(form.get("name") ?? ""),
        company: optional("company"),
        email: String(form.get("email") ?? ""),
        phone: optional("phone"),
        subject: optional("subject"),
        project_type: optional("projectType"),
        budget_range: optional("budget"),
        message,
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
