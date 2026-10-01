import { useQuery } from "@tanstack/react-query";
import { fetchWork } from "@/api/work";
import type { Locale } from "@/api/types";

export function useWork(locale: Locale) {
  return useQuery(workQueryOptions(locale));
}

export function workQueryOptions(locale: Locale) {
  return {
    queryKey: ["work", locale],
    queryFn: () => fetchWork(locale),
    staleTime: 5 * 60 * 1000,
  };
}
