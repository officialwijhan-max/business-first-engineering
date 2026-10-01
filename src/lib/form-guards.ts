import type { Locale } from "@/api/types";

/**
 * Client-side form guards. These exist for fast feedback and to cut obvious
 * spam/oversized input — the Laravel API remains the authority and must
 * re-validate everything.
 */

/** Name of the hidden honeypot field. Real users never see or fill it. */
export const HONEYPOT_FIELD = "website";

export const FIELD_LIMITS = {
  name: 100,
  company: 150,
  email: 254,
  phone: 30,
  short: 100,
  message: 5000,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[\d\s().-]{6,30}$/;

export function isHoneypotTripped(form: FormData): boolean {
  const value = form.get(HONEYPOT_FIELD);
  return typeof value === "string" && value.trim() !== "";
}

const text = {
  en: {
    required: "This field is required.",
    tooLong: (max: number) => `Please keep this under ${max} characters.`,
    email: "Please enter a valid email address.",
    phone: "Please enter a valid phone number.",
  },
  ar: {
    required: "هذا الحقل مطلوب.",
    tooLong: (max: number) => `الرجاء ألا يتجاوز هذا الحقل ${max} حرفًا.`,
    email: "الرجاء إدخال بريد إلكتروني صحيح.",
    phone: "الرجاء إدخال رقم هاتف صحيح.",
  },
} as const;

interface FormValues {
  name: string;
  email: string;
  phone?: string | undefined;
  company?: string | undefined;
  message: string;
  /** API field name the message is reported under ("message" or "description"). */
  messageKey: string;
  /** Other short optional fields, keyed by API field name. */
  extras?: Record<string, string | undefined>;
}

/**
 * Checks length/format/required rules and returns errors keyed by the same
 * field names the API uses, so they render through the existing field-error UI.
 */
export function validateFields(locale: Locale, fields: FormValues): Record<string, string[]> {
  const t = text[locale];
  const errors: Record<string, string[]> = {};
  const add = (key: string, message: string) => {
    errors[key] = [...(errors[key] ?? []), message];
  };

  const rules: { key: string; value: string | undefined; max: number; required: boolean }[] = [
    { key: "name", value: fields.name, max: FIELD_LIMITS.name, required: true },
    { key: "email", value: fields.email, max: FIELD_LIMITS.email, required: true },
    { key: "phone", value: fields.phone, max: FIELD_LIMITS.phone, required: false },
    { key: "company", value: fields.company, max: FIELD_LIMITS.company, required: false },
    { key: fields.messageKey, value: fields.message, max: FIELD_LIMITS.message, required: true },
    ...Object.entries(fields.extras ?? {}).map(([key, value]) => ({
      key,
      value,
      max: FIELD_LIMITS.short,
      required: false,
    })),
  ];

  for (const rule of rules) {
    const value = (rule.value ?? "").trim();
    if (rule.required && value === "") add(rule.key, t.required);
    else if (value.length > rule.max) add(rule.key, t.tooLong(rule.max));
  }

  const email = fields.email.trim();
  if (email !== "" && email.length <= FIELD_LIMITS.email && !EMAIL_PATTERN.test(email)) {
    add("email", t.email);
  }
  const phone = (fields.phone ?? "").trim();
  if (phone !== "" && phone.length <= FIELD_LIMITS.phone && !PHONE_PATTERN.test(phone)) {
    add("phone", t.phone);
  }

  return errors;
}
