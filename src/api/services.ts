import { cachedApiGet } from "./server-cache";
import type { ApiSuccess, Locale, Service } from "./types";

export async function fetchServices(locale: Locale): Promise<Service[]> {
  const response = await cachedApiGet<ApiSuccess<Service[]>>(`/services?locale=${locale}`);
  return response.data;
}
