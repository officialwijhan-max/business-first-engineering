import { describe, expect, it, vi } from "vitest";
import { ApiRequestError, ApiValidationError } from "@/api/client";
import { runSubmission } from "@/lib/form-submit";

/**
 * The rule under test: the "Your request is in" screen is only ever reached when the
 * submission actually succeeded. Every failure — whatever the status — must come back
 * as an error with a message in the page's own language.
 */
describe("runSubmission", () => {
  it("reports success only when the request resolves", async () => {
    const send = vi.fn().mockResolvedValue({ id: 1, status: "new" });

    await expect(runSubmission("en", send)).resolves.toEqual({ kind: "success" });
    expect(send).toHaveBeenCalledOnce();
  });

  it.each([
    ["en", 429, "Too many requests. Please wait a moment and try again."],
    ["ar", 429, "عدد الطلبات كبير. يرجى الانتظار قليلًا ثم المحاولة مرة أخرى."],
    ["en", 500, "Something went wrong on our end. Please try again shortly."],
    ["ar", 500, "حدث خطأ من جانبنا. يرجى المحاولة مرة أخرى بعد قليل."],
    ["en", 0, "Unable to reach the server. Check your connection and try again."],
    ["ar", 0, "تعذّر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى."],
  ] as const)("shows an error, not success, for %s status %i", async (locale, status, message) => {
    const english = {
      0: "Unable to reach the server. Check your connection and try again.",
      429: "Too many requests. Please wait a moment and try again.",
      500: "Something went wrong on our end. Please try again shortly.",
    }[status];

    const outcome = await runSubmission(locale, () =>
      Promise.reject(new ApiRequestError(english, status)),
    );

    expect(outcome.kind).toBe("error");
    if (outcome.kind === "error") {
      expect(outcome.generalError).toBe(message);
      expect(outcome.fieldErrors).toEqual({});
    }
  });

  it("maps a 422 to field errors plus a summary, in English", async () => {
    const outcome = await runSubmission("en", () =>
      Promise.reject(
        new ApiValidationError("Validation failed.", {
          email: ["The email field must be a valid email address."],
        }),
      ),
    );

    expect(outcome).toEqual({
      kind: "error",
      fieldErrors: { email: ["The email field must be a valid email address."] },
      generalError: "Please review your answers and try again.",
    });
  });

  it("keeps safe Arabic API messages on Arabic pages and summarizes the form", async () => {
    const outcome = await runSubmission("ar", () =>
      Promise.reject(
        new ApiValidationError("x", {
          email: ["يرجى إدخال بريد إلكتروني صالح في الحقل البريد الإلكتروني."],
        }),
      ),
    );

    expect(outcome).toEqual({
      kind: "error",
      fieldErrors: { email: ["يرجى إدخال بريد إلكتروني صالح في الحقل البريد الإلكتروني."] },
      generalError: "يرجى مراجعة إجاباتك ثم المحاولة مرة أخرى.",
    });
  });

  it("replaces unsafe or wrong-language field messages with a generic translated one", async () => {
    const outcome = await runSubmission("ar", () =>
      Promise.reject(
        new ApiValidationError("x", {
          name: ["The name field is required."], // English on an Arabic page
          email: ["SQLSTATE[23000]: Integrity constraint violation"],
          message: ["<script>alert(1)</script>"],
        }),
      ),
    );

    expect(outcome.kind).toBe("error");
    if (outcome.kind === "error") {
      for (const field of ["name", "email", "message"]) {
        expect(outcome.fieldErrors[field]).toEqual(["يرجى التحقق من هذا الحقل وتصحيحه."]);
      }
    }
  });

  it("treats a non-API failure (a thrown TypeError) as an error with the default message", async () => {
    const outcome = await runSubmission("en", () => Promise.reject(new TypeError("boom")));

    expect(outcome).toEqual({
      kind: "error",
      fieldErrors: {},
      generalError: "Something went wrong. Please try again.",
    });
  });
});
