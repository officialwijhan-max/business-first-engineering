import { cachedApiGet } from "./server-cache";
import type { ApiSuccess, CaseStudyDetail, Locale } from "./types";

export async function fetchCaseStudy(locale: Locale, slug: string): Promise<CaseStudyDetail> {
  const response = await cachedApiGet<ApiSuccess<CaseStudyDetail>>(
    `/work/${encodeURIComponent(slug)}?locale=${locale}`,
  );
  return response.data;
}
