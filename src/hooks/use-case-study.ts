import { useQuery } from "@tanstack/react-query";
import { fetchCaseStudy } from "@/api/case-study";
import type { CaseStudyDetail, Locale } from "@/api/types";

/**
 * `initialData` seeds the client with whatever the route's loader already
 * fetched server-side. Without it, the client's query starts empty while the
 * SSR HTML already has the full page — a hydration mismatch on first paint.
 * Only a real result is passed in (never `null`, the loader's not-found/error
 * sentinel) so the 404/error path still runs its own client-side fetch.
 */
export function useCaseStudy(locale: Locale, slug: string, initialData?: CaseStudyDetail | null) {
  return useQuery({
    queryKey: ["case-study", locale, slug],
    queryFn: () => fetchCaseStudy(locale, slug),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(slug),
    initialData: initialData ?? undefined,
  });
}

export function caseStudyQueryOptions(locale: Locale, slug: string) {
  return {
    queryKey: ["case-study", locale, slug] as const,
    queryFn: () => fetchCaseStudy(locale, slug),
    staleTime: 5 * 60 * 1000,
  };
}
