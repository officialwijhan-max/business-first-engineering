import { useQuery } from "@tanstack/react-query";
import { fetchServices } from "@/api/services";
import type { Locale } from "@/api/types";

export function useServices(locale: Locale) {
  return useQuery(servicesQueryOptions(locale));
}

export function servicesQueryOptions(locale: Locale) {
  return {
    queryKey: ["services", locale] as const,
    queryFn: () => fetchServices(locale),
    staleTime: 5 * 60 * 1000,
  };
}
