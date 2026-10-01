import type { ApiRequestError } from "@/api/client";
import type { Locale } from "@/api/types";

const ARABIC_LETTERS = /[؀-ۿ]/;
/** Markup, or anything that looks like an internal error/stack/path rather than a form message. */
const UNSAFE_MESSAGE = /[<>{}]|SQLSTATE|exception|stack trace|\.php|vendor[\\/]/i;
const MAX_FIELD_MESSAGE_LENGTH = 200;

const generic = {
  en: {
    field: "Please check this field and try again.",
    summary: "Please review your answers and try again.",
    default: "Something went wrong. Please try again.",
  },
  ar: {
    field: "يرجى التحقق من هذا الحقل وتصحيحه.",
    summary: "يرجى مراجعة إجاباتك ثم المحاولة مرة أخرى.",
    default: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
  },
} as const;

/**
 * A field message from the API is shown only when it is short, free of markup and
 * internals, and written in the page's own language (the API answers in Arabic when
 * `locale: "ar"` is sent). Anything else is replaced by a generic translated message.
 */
export function isSafeFieldMessage(locale: Locale, message: unknown): message is string {
  if (typeof message !== "string") return false;
  const text = message.trim();
  if (text === "" || text.length > MAX_FIELD_MESSAGE_LENGTH || UNSAFE_MESSAGE.test(text)) {
    return false;
  }
  return locale === "ar" ? ARABIC_LETTERS.test(text) : !ARABIC_LETTERS.test(text);
}

/** Shown above the form after a 422, so an error on a field that is not on screen is never silent. */
export function validationSummary(locale: Locale): string {
  return generic[locale].summary;
}

/**
 * Status-based message for any non-validation failure (network, 429, 5xx...).
 * The status text itself comes from our own client (never from the server body).
 */
export function localizeApiError(locale: Locale, error: ApiRequestError | null): string {
  if (locale === "en") return error?.message ?? generic.en.default;
  switch (error?.status) {
    case 0:
      return "تعذّر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.";
    case 429:
      return "عدد الطلبات كبير. يرجى الانتظار قليلًا ثم المحاولة مرة أخرى.";
    default:
      return error && error.status >= 500
        ? "حدث خطأ من جانبنا. يرجى المحاولة مرة أخرى بعد قليل."
        : generic.ar.default;
  }
}

export function localizeFieldErrors(
  locale: Locale,
  errors: Record<string, string[]>,
): Record<string, string[]> {
  return Object.fromEntries(
    Object.entries(errors).map(([field, messages]) => {
      const mapped = (Array.isArray(messages) ? messages : []).map((message) =>
        isSafeFieldMessage(locale, message) ? message.trim() : generic[locale].field,
      );
      return [field, [...new Set(mapped.length > 0 ? mapped : [generic[locale].field])]];
    }),
  );
}
