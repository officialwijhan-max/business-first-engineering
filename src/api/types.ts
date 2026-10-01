/** Shared types for the Laravel API — field names mirror the real backend
 * responses exactly (verified against the running API), not guessed. */

export type Locale = "en" | "ar";

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorBody {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

/** GET /services item */
export interface Service {
  id: number;
  number: string;
  slug: string;
  /** Lucide icon name, e.g. "Compass" — resolved via src/lib/icons.ts. */
  icon: string;
  title: string;
  summary: string;
  capabilities: string[];
}

/** GET /work item shapes */
export interface WorkCategory {
  id: number;
  name: string;
}

export interface CaseStudy {
  id: number;
  slug: string;
  category: string | null;
  industry: string | null;
  title: string;
  summary: string;
  outcome: string | null;
  cover_image_url: string | null;
  featured: boolean;
  published_at: string | null;
  /** Optional, not returned by GET /work yet. Rendered only when the backend sends real content. */
  challenge?: string | null | undefined;
  solution?: string | null | undefined;
  metrics?: CaseStudyMetric[] | undefined;
}

/** A verified, quantified project result, e.g. { value: "3x", label: "faster onboarding" }. */
export interface CaseStudyMetric {
  value: string;
  label: string;
}

export interface WorkData {
  categories: WorkCategory[];
  case_studies: CaseStudy[];
}

/** GET /work/{slug} nested item shapes. */
export interface CaseStudySection {
  type: string;
  title: string | null;
  content: string | null;
}

export interface CaseStudyFeature {
  title: string;
  description: string | null;
  image: string | null;
  secondary_image: string | null;
  category: string | null;
}

export interface CaseStudyContribution {
  name: string;
}

export interface CaseStudyTechnology {
  name: string;
  category: string | null;
}

/** GET /work/{slug} */
export interface CaseStudyDetail {
  id: number;
  slug: string;
  category: string | null;
  industry: string | null;
  title: string;
  headline: string;
  summary: string;
  hero_description: string;
  outcome: string | null;
  client_name: string | null;
  featured: boolean;
  cover_image_url: string | null;
  logo: string | null;
  published_at: string | null;
  sections: CaseStudySection[];
  features: CaseStudyFeature[];
  contributions: CaseStudyContribution[];
  technologies: CaseStudyTechnology[];
  related: CaseStudy[];
}

/** POST /contact request body */
export interface ContactPayload {
  name: string;
  company?: string | undefined;
  email: string;
  phone?: string | undefined;
  subject?: string | undefined;
  project_type?: string | undefined;
  budget_range?: string | undefined;
  message: string;
  locale: Locale;
}

/** POST /quote-requests request body */
export interface QuoteRequestPayload {
  name: string;
  company?: string | undefined;
  email: string;
  phone?: string | undefined;
  /** A service slug, a stable extra such as "not-sure", or a legacy display label. */
  project_type: string;
  budget_range?: string | undefined;
  description: string;
  locale: Locale;
}

/** Shared response shape for both submission endpoints. */
export interface SubmissionResult {
  id: number;
  status: string;
}
