import { apiGet } from "./client";
import type { ApiSuccess, Locale, WorkData } from "./types";

export async function fetchWork(locale: Locale): Promise<WorkData> {
  const response = await apiGet<ApiSuccess<WorkData>>(`/work?locale=${locale}`);
  return response.data;
}
