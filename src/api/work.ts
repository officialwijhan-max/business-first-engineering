import { cachedApiGet } from "./server-cache";
import type { ApiSuccess, Locale, WorkData } from "./types";

export async function fetchWork(locale: Locale): Promise<WorkData> {
  const response = await cachedApiGet<ApiSuccess<WorkData>>(`/work?locale=${locale}`);
  return response.data;
}
