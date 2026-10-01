import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, CheckCircle2, FileText, Handshake, LifeBuoy, PhoneCall } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PillButton } from "@/components/ui/pill-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContactForm } from "@/hooks/use-contact-form";
import { useRestoreFormDraft } from "@/hooks/use-form-draft";
import { HoneypotField } from "@/components/ui/honeypot-field";
import { cn } from "@/lib/utils";
import { useServices } from "@/hooks/use-services";
import type { Locale, Service } from "@/api/types";

/**
 * The one "Get Started" section shared by the Service Detail template,
 * /, /about, /services, /contact, and /work. All sizing (container width, header, tabs, card,
 * field grid) lives here — callers only pick a variant and pass copy, so
 * the section renders identically (edges, widths, paddings) everywhere.
 */

const budgetOptionsEn = [
  "Under EGP 100,000",
  "EGP 100,000 – 250,000",
  "EGP 250,000 – 1,000,000",
  "EGP 1,000,000+",
  "Not sure — I need advice",
];

const budgetOptionsAr = [
  "أقل من 100,000 جنيه",
  "100,000 – 250,000 جنيه",
  "250,000 – 1,000,000 جنيه",
  "أكثر من 1,000,000 جنيه",
  "غير متأكد — أحتاج استشارة",
];

// `id` is posted as `subject` and must match ContactRequest::SUBJECTS on the backend.
const inquiryTypesEn = [
  { id: "scoping", label: "Project Scoping", icon: FileText },
  { id: "call", label: "Schedule a Call", icon: PhoneCall },
  { id: "partnership", label: "Partnership", icon: Handshake },
  { id: "support", label: "Support", icon: LifeBuoy },
] as const;

const inquiryTypesAr = [
  { id: "scoping", label: "تحديد نطاق المشروع", icon: FileText },
  { id: "call", label: "حجز مكالمة", icon: PhoneCall },
  { id: "partnership", label: "شراكة", icon: Handshake },
  { id: "support", label: "الدعم", icon: LifeBuoy },
] as const;

type InquiryService = Pick<Service, "slug" | "title">;
type InquiryTypeId = (typeof inquiryTypesEn)[number]["id"];

type GetStartedSectionProps = {
  locale: Locale;
  service?: InquiryService;
  includeOtherService?: boolean;
  variant?: "default" | "scoping";
  /** Overrides for callers with their own copy (e.g. About's "Strategic partnership" instance). Already localized by the caller. */
  eyebrow?: string;
  heading?: ReactNode;
  defaultTab?: InquiryTypeId;
  cardTitle?: string;
  cardParagraph?: string;
  submitLabel?: string;
};

/** Shared shell: id="start", bg, padding, and the 1192px-wide content box. */
function SectionShell({ children }: { children: ReactNode }) {
  return (
    <section id="start" className="scroll-mt-(--header-h) bg-primary py-12 lg:py-16">
      <div className="page-container">{children}</div>
    </section>
  );
}

/** Eyebrow (flanking rules + label) and the centered, two-line-capable H2. */
function SectionHeader({ eyebrow, heading }: { eyebrow: string; heading: ReactNode }) {
  return (
    <div className="reveal mx-auto mb-8 text-center">
      <div className="mb-5 flex items-center justify-center gap-3">
        <span aria-hidden="true" className="h-px w-8 bg-hero-accent" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-hero-accent">
          {eyebrow}
        </p>
        <span aria-hidden="true" className="h-px w-8 bg-hero-accent" />
      </div>
      <h2 className="mx-auto max-w-4xl text-balance font-display tracking-tighter text-primary-foreground text-[1.75rem] leading-[1.1] sm:text-[2.25rem] sm:leading-[1.08] md:text-[2.75rem] lg:text-[3.25rem] lg:leading-[1.05]">
        {heading}
      </h2>
    </div>
  );
}

/** Shared success state, rendered inside the card's position (not the card itself, callers handle sizing). */
function SuccessPanel({ arabic, onReset }: { arabic: boolean; onReset: () => void }) {
  return (
    <div className="reveal mx-auto flex min-h-[22rem] max-w-xl flex-col items-center justify-center rounded-xl border border-border bg-background p-6 text-center shadow-xl sm:p-10">
      <CheckCircle2 className="size-9 text-accent" />
      <h3 className="mt-6 font-display text-3xl">
        {arabic ? "طلبك وصلنا." : "Your request is in."}
      </h3>
      <p className="mt-4 max-w-md leading-7 text-muted-foreground">
        {arabic
          ? "شكرًا لك — استلمنا رسالتك وسنتواصل معك قريبًا."
          : "Thanks — we've received your message and will be in touch shortly."}
      </p>
      <PillButton className="mt-7" type="button" variant="outline" tone="light" onClick={onReset}>
        {arabic ? "إرسال رسالة أخرى" : "Send another message"}
      </PillButton>
    </div>
  );
}

export function GetStartedSection({ variant = "default", ...props }: GetStartedSectionProps) {
  return variant === "scoping" ? (
    <ScopingGetStarted locale={props.locale} />
  ) : (
    <DefaultGetStarted {...props} />
  );
}

function DefaultGetStarted({
  locale,
  service,
  includeOtherService = false,
  eyebrow,
  heading,
  defaultTab = "scoping",
  cardTitle,
  cardParagraph,
  submitLabel,
}: {
  locale: Locale;
  service?: InquiryService;
  includeOtherService?: boolean;
  eyebrow?: string;
  heading?: ReactNode;
  defaultTab?: InquiryTypeId;
  cardTitle?: string;
  cardParagraph?: string;
  submitLabel?: string;
}) {
  const arabic = locale === "ar";
  const { submitted, submitting, fieldErrors, generalError, submit, reset } =
    useContactForm(locale);
  const inquiryTypes = arabic ? inquiryTypesAr : inquiryTypesEn;
  const [inquiryType, setInquiryType] = useState<InquiryTypeId>(defaultTab);
  const { data: services } = useServices(locale);
  const formRef = useRef<HTMLFormElement>(null);
  useRestoreFormDraft(formRef, services);
  const budgetOptions = arabic ? budgetOptionsAr : budgetOptionsEn;
  const activeInquiry = inquiryTypes.find((item) => item.id === inquiryType) ?? inquiryTypes[0]!;
  const serviceOptions = [
    ...(services ?? []).map((item) => ({ value: item.slug, label: item.title })),
    ...(includeOtherService
      ? [{ value: "other", label: arabic ? "أخرى / غير متأكد" : "Other / not sure" }]
      : []),
  ];

  return (
    <SectionShell>
      <SectionHeader
        eyebrow={eyebrow ?? (arabic ? "ابدأ الآن" : "Get Started")}
        heading={
          heading ??
          (service
            ? arabic
              ? `مهتم ب${service.title}؟`
              : `Interested in ${service.title}?`
            : arabic
              ? "حوّل رؤيتك إلى منتج يعمل."
              : "Turn your vision into a working product.")
        }
      />

      <div
        className="reveal mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4"
        role="tablist"
        aria-label={arabic ? "نوع الطلب" : "Inquiry type"}
      >
        {inquiryTypes.map((item) => {
          const active = item.id === inquiryType;
          return (
            <PillButton
              key={item.id}
              type="button"
              variant="tab"
              tone="dark"
              active={active}
              icon={item.icon}
              className="whitespace-normal px-2.5 text-center leading-tight sm:px-3"
              role="tab"
              aria-selected={active}
              onClick={() => setInquiryType(item.id)}
            >
              {item.label}
            </PillButton>
          );
        })}
      </div>

      {submitted ? (
        <SuccessPanel arabic={arabic} onReset={reset} />
      ) : (
        <div className="reveal w-full rounded-xl border border-border bg-background p-5 shadow-xl sm:p-8">
          <div className="mb-6">
            <h3 className="font-display text-xl font-bold text-foreground">
              {cardTitle ?? (arabic ? "ابدأ مشروعك" : "Start Your Project")}
            </h3>
            <p className="mt-2 text-base text-muted-foreground">
              {cardParagraph ??
                (arabic
                  ? "أكمل النموذج وسيردّ عليك فريقنا خلال يوم عمل واحد."
                  : "Complete the form and our team will respond within one business day.")}
            </p>
          </div>
          <form
            ref={formRef}
            onSubmit={submit}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
            aria-label={arabic ? "نموذج طلب مشروع" : "Project enquiry form"}
          >
            <input type="hidden" name="subject" value={activeInquiry.id} />
            <HoneypotField />
            <Field label={arabic ? "الاسم بالكامل" : "Full Name"} error={fieldErrors["name"]}>
              <Input
                className="h-[46px] rounded-lg px-4"
                required
                name="name"
                autoComplete="name"
                placeholder={arabic ? "اسمك" : "Your name"}
              />
            </Field>
            <Field label={arabic ? "البريد الإلكتروني" : "Work Email"} error={fieldErrors["email"]}>
              <Input
                className="h-[46px] rounded-lg px-4"
                required
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@company.com"
              />
            </Field>
            <Field label={arabic ? "الشركة" : "Company"} error={fieldErrors["company"]}>
              <Input
                className="h-[46px] rounded-lg px-4"
                name="company"
                autoComplete="organization"
                placeholder={arabic ? "اسم الشركة" : "Company name"}
              />
            </Field>
            <Field
              label={arabic ? "الهاتف (اختياري)" : "Phone (optional)"}
              error={fieldErrors["phone"]}
            >
              <Input
                className="h-[46px] rounded-lg px-4"
                type="tel"
                name="phone"
                autoComplete="tel"
                placeholder={arabic ? "رقم هاتفك" : "Your phone number"}
              />
            </Field>
            <SelectField
              label={arabic ? "الخدمة المطلوبة" : "Service of interest"}
              name="projectType"
              required={false}
              error={fieldErrors["project_type"]}
              options={serviceOptions}
              defaultValue={service?.slug ?? ""}
              placeholder={arabic ? "اختر خدمة" : "Select a service"}
            />
            <SelectField
              label={arabic ? "الميزانية التقديرية" : "Estimated budget range"}
              name="budget"
              required={false}
              error={fieldErrors["budget_range"]}
              options={budgetOptions}
              placeholder={arabic ? "الميزانية (اختياري)" : "Approximate budget (optional)"}
            />
            <div className="md:col-span-2">
              <Field
                label={arabic ? "أخبرنا عن مشروعك" : "Tell us about your project"}
                error={fieldErrors["message"]}
              >
                <Textarea
                  required
                  name="description"
                  className="min-h-[140px] resize-y rounded-lg border-input px-4 py-3 text-base shadow-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent"
                  placeholder={
                    arabic
                      ? "ما الذي تحاول بناءه أو تحسينه أو حله؟"
                      : "What are you trying to build, improve, or solve?"
                  }
                />
              </Field>
            </div>
            {generalError ? (
              <p className="text-sm text-destructive md:col-span-2" role="alert">
                {generalError}
              </p>
            ) : null}
            <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between md:col-span-2">
              <PillButton asChild variant="outline" tone="light" size="lg">
                <Link to={arabic ? "/ar/work" : "/work"}>
                  {arabic ? "شاهد أعمالنا" : "View Our Work"}
                </Link>
              </PillButton>
              <Button
                size="lg"
                type="submit"
                disabled={submitting}
                className="w-full rounded-full py-3 font-bold sm:w-auto sm:px-8"
              >
                {submitting ? (
                  arabic ? (
                    "جارٍ الإرسال…"
                  ) : (
                    "Sending…"
                  )
                ) : (
                  <>
                    {submitLabel ?? (arabic ? "إرسال الطلب" : "Send Request")}{" "}
                    <ArrowRight className="rtl-mirror" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </SectionShell>
  );
}

const scopeGoalsEn = [
  "Launch a new product",
  "Modernize an existing system",
  "Automate operations",
  "Connect existing systems",
  "Not sure yet",
];

const scopeGoalsAr = [
  "إطلاق منتج جديد",
  "تحديث نظام قائم",
  "أتمتة العمليات",
  "ربط أنظمة قائمة",
  "لست متأكدًا بعد",
];

const companySizesEn = [
  "Just me",
  "Startup (2–10)",
  "Growing business (11–50)",
  "Established (50+)",
];
const companySizesAr = ["أنا فقط", "شركة ناشئة (2–10)", "شركة نامية (11–50)", "شركة مستقرة (50+)"];

function ScopingGetStarted({ locale }: { locale: Locale }) {
  const arabic = locale === "ar";
  const { data: services } = useServices(locale);
  const { submitted, submitting, fieldErrors, generalError, submit, reset } =
    useContactForm(locale);
  const [step, setStep] = useState<1 | 2>(1);
  const formRef = useRef<HTMLFormElement>(null);
  useRestoreFormDraft(formRef, services);
  const goals = arabic ? scopeGoalsAr : scopeGoalsEn;
  const companySizes = arabic ? companySizesAr : companySizesEn;
  const budgetOptions = arabic ? budgetOptionsAr : budgetOptionsEn;
  const serviceOptions = [
    ...(services ?? []).map((item) => ({ value: item.slug, label: item.title })),
    { value: "not-sure", label: arabic ? "لست متأكدًا بعد" : "Not sure yet" },
  ];

  // The button that switched steps becomes inert, so hand focus to the first
  // field of the step now showing (focus() also scrolls it into view on phones).
  function showStep(next: 1 | 2) {
    setStep(next);
    window.requestAnimationFrame(() => {
      formRef.current
        ?.querySelector<HTMLElement>(`[data-step="${next}"] :is(input, select, textarea)`)
        ?.focus();
    });
  }

  function continueToDetails() {
    if (!formRef.current) return;
    if (formRef.current.checkValidity()) {
      showStep(2);
      return;
    }
    formRef.current.reportValidity();
  }

  function goBack() {
    showStep(1);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const form = new FormData(event.currentTarget);
    await submit(event, buildScopeSummary(form, arabic));
  }

  function resetScope() {
    reset();
    setStep(1);
  }

  return (
    <SectionShell>
      <SectionHeader
        eyebrow={arabic ? "ابدأ مشروعك" : "Start your project"}
        heading={arabic ? "حدّد نطاق مشروعك." : "Scope Your Project."}
      />

      {submitted ? (
        <SuccessPanel arabic={arabic} onReset={resetScope} />
      ) : (
        <div className="reveal w-full rounded-xl border border-border bg-background p-5 shadow-xl sm:p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <span className={step === 1 ? "text-accent" : ""}>
                1 — {arabic ? "متطلبات المشروع" : "Project Requirements"}
              </span>
              <span className={step === 2 ? "text-accent" : ""}>
                2 — {arabic ? "بياناتك" : "Your Details"}
              </span>
            </div>
            <div
              className="mt-4 h-1.5 overflow-hidden rounded-full bg-primary/10"
              role="progressbar"
              aria-label={arabic ? "تقدم النموذج" : "Form progress"}
              aria-valuemin={1}
              aria-valuemax={2}
              aria-valuenow={step}
            >
              <span
                className="block h-full rounded-full bg-accent transition-[width] duration-300"
                style={{ width: step === 1 ? "50%" : "100%" }}
              />
            </div>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            aria-label={arabic ? "نموذج تحديد نطاق المشروع" : "Project scoping form"}
          >
            <input type="hidden" name="subject" value="scoping" />
            <HoneypotField />
            {/* Both steps share one grid cell; the inactive one is invisible + inert, so the
                card always has the taller step's height and never jumps when switching. */}
            <div className="grid grid-cols-1">
              <div
                data-step="1"
                inert={step !== 1}
                aria-hidden={step !== 1}
                className={cn(
                  "col-start-1 row-start-1 grid grid-cols-1 content-start gap-5 md:grid-cols-2",
                  step !== 1 && "invisible",
                )}
              >
                <SelectField
                  label={arabic ? "ماذا تحتاج؟" : "What do you need?"}
                  name="projectType"
                  required={step === 1}
                  error={fieldErrors["project_type"]}
                  options={serviceOptions}
                  placeholder={arabic ? "اختر الخدمة" : "Select a service"}
                />
                <SelectField
                  label={arabic ? "حجم الشركة" : "Company size"}
                  name="companySize"
                  required={step === 1}
                  options={companySizes}
                  placeholder={arabic ? "اختر حجم الشركة" : "Select company size"}
                />
                <fieldset className="grid min-w-0 gap-3 md:col-span-2">
                  <legend className="mb-1 text-sm font-semibold text-foreground">
                    {arabic ? "ما هدفك الرئيسي؟" : "What's your main goal?"}
                  </legend>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {goals.map((goal, index) => (
                      <label
                        key={goal}
                        className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-input bg-background px-4 py-3 transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
                      >
                        <input
                          type="radio"
                          name="goal"
                          value={goal}
                          required={step === 1 && index === 0}
                          className="size-4 accent-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                        <span className="text-sm text-foreground">{goal}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className="md:col-span-2">
                  <SelectField
                    label={
                      arabic ? "الميزانية التقديرية (اختياري)" : "Estimated budget range (optional)"
                    }
                    name="budget"
                    required={false}
                    error={fieldErrors["budget_range"]}
                    options={budgetOptions}
                    placeholder={arabic ? "الميزانية (اختياري)" : "Approximate budget (optional)"}
                  />
                </div>
                <Button
                  type="button"
                  size="lg"
                  className="mt-2 w-full rounded-full py-3 font-bold sm:w-auto sm:justify-self-end sm:px-8 md:col-span-2"
                  onClick={continueToDetails}
                >
                  {arabic ? "متابعة" : "Continue"}{" "}
                  <ArrowRight className="rtl-mirror" aria-hidden="true" />
                </Button>
              </div>

              <div
                data-step="2"
                inert={step !== 2}
                aria-hidden={step !== 2}
                className={cn(
                  "col-start-1 row-start-1 grid grid-cols-1 content-start gap-5 md:grid-cols-2",
                  step !== 2 && "invisible",
                )}
              >
                <Field
                  label={arabic ? "اسم الشركة" : "Company name"}
                  error={fieldErrors["company"]}
                >
                  <Input
                    className="h-[46px] rounded-lg px-4"
                    required={step === 2}
                    name="company"
                    autoComplete="organization"
                    placeholder={arabic ? "اسم الشركة" : "Company name"}
                  />
                </Field>
                <Field
                  label={arabic ? "اسمك ودورك" : "Your name & role"}
                  error={fieldErrors["name"]}
                >
                  <Input
                    className="h-[46px] rounded-lg px-4"
                    required={step === 2}
                    name="name"
                    autoComplete="name"
                    placeholder={arabic ? "الاسم والدور" : "Your name and role"}
                  />
                </Field>
                <Field
                  label={arabic ? "البريد الإلكتروني للعمل" : "Work email"}
                  error={fieldErrors["email"]}
                >
                  <Input
                    className="h-[46px] rounded-lg px-4"
                    required={step === 2}
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                  />
                </Field>
                <Field
                  label={arabic ? "الهاتف (اختياري)" : "Phone (optional)"}
                  error={fieldErrors["phone"]}
                >
                  <Input
                    className="h-[46px] rounded-lg px-4"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    placeholder={arabic ? "رقم هاتفك" : "Your phone number"}
                  />
                </Field>
                <div className="md:col-span-2">
                  <Field
                    label={arabic ? "أخبرنا عن مشروعك" : "Tell us about your project"}
                    error={fieldErrors["message"]}
                  >
                    <Textarea
                      required={step === 2}
                      name="description"
                      className="min-h-[140px] resize-y rounded-lg border-input px-4 py-3 text-base shadow-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent"
                      placeholder={
                        arabic
                          ? "ما الذي تحاول بناءه أو تحسينه أو حله؟"
                          : "What are you trying to build, improve, or solve?"
                      }
                    />
                  </Field>
                </div>
                {generalError ? (
                  <p className="text-sm text-destructive md:col-span-2" role="alert">
                    {generalError}
                  </p>
                ) : null}
                <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between md:col-span-2">
                  <PillButton
                    type="button"
                    variant="outline"
                    tone="light"
                    size="lg"
                    onClick={goBack}
                  >
                    <ArrowRight className="rotate-180 rtl-mirror" aria-hidden="true" />
                    {arabic ? "رجوع" : "Back"}
                  </PillButton>
                  <Button
                    size="lg"
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full py-3 font-bold sm:w-auto sm:px-8"
                  >
                    {submitting ? (
                      arabic ? (
                        "جارٍ الإرسال…"
                      ) : (
                        "Sending…"
                      )
                    ) : (
                      <>
                        {arabic ? "اطلب خطة للمشروع" : "Request a Project Plan"}
                        <ArrowRight className="rtl-mirror" aria-hidden="true" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </SectionShell>
  );
}

function buildScopeSummary(form: FormData, arabic: boolean) {
  const selectedService = form.get("projectType") ?? "";
  const selectedGoal = form.get("goal") ?? "";
  const companySize = form.get("companySize") ?? "";
  const budget = form.get("budget") ?? "";
  const serviceLabel = arabic ? "الخدمة المطلوبة" : "Service of interest";
  const goalLabel = arabic ? "الهدف الرئيسي" : "Main goal";
  const sizeLabel = arabic ? "حجم الشركة" : "Company size";
  const budgetLabel = arabic ? "الميزانية" : "Estimated budget";
  return [
    arabic ? "ملخص متطلبات المشروع:" : "Project requirements summary:",
    `${serviceLabel}: ${selectedService}`,
    `${goalLabel}: ${selectedGoal}`,
    `${sizeLabel}: ${companySize}`,
    budget ? `${budgetLabel}: ${budget}` : null,
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");
}

/** Label + input + a fixed-height error slot, so a validation message never shifts a neighboring column. */
function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: ReactNode;
  error?: string[] | undefined;
}) {
  return (
    <label className="grid min-w-0 gap-2">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      {children}
      <p className="min-h-[1rem] text-xs leading-4 text-destructive">{error?.[0] ?? ""}</p>
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
  error,
  required = true,
  placeholder,
  defaultValue = "",
}: {
  label: string;
  name: string;
  options: (string | { value: string; label: string })[];
  error?: string[] | undefined;
  required?: boolean;
  placeholder: string;
  defaultValue?: string;
}) {
  return (
    <label className="grid min-w-0 gap-2">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <select
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="get-started-select h-[46px] w-full min-w-0 appearance-none rounded-lg border border-input bg-background px-4 py-3 text-base focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <option value="" disabled={required}>
          {placeholder}
        </option>
        {options.map((option) => {
          const { value, label: text } =
            typeof option === "string" ? { value: option, label: option } : option;
          return (
            <option key={value} value={value}>
              {text}
            </option>
          );
        })}
      </select>
      <p className="min-h-[1rem] text-xs leading-4 text-destructive">{error?.[0] ?? ""}</p>
    </label>
  );
}
