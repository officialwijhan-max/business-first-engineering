import { apiGet } from "./client";
import type { ApiSuccess, Locale, Service } from "./types";

export async function fetchServices(locale: Locale): Promise<Service[]> {
  const response = await apiGet<ApiSuccess<Service[]>>(`/services?locale=${locale}`);
  return response.data;
}
