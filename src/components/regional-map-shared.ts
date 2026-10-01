import type { OfficeLocation } from "@/content/about";

/** Labels, colours and helpers shared by the (SSR'd) location cards and the lazily loaded map. */

export const roleLabel = {
  headquarters: { en: "Headquarters", ar: "المقر الرئيسي" },
  branch: { en: "Branch Office", ar: "مكتب فرعي" },
  presence: { en: "Presence", ar: "تواجد" },
} as const;

export const roleColor: Record<OfficeLocation["role"], string> = {
  headquarters: "var(--color-hero-accent)",
  branch: "var(--color-accent)",
  presence: "color-mix(in oklab, var(--color-muted-foreground) 80%, transparent)",
};

export type PinnedLocation = OfficeLocation & { lat: number; lng: number };

export function locationName(location: OfficeLocation, arabic: boolean) {
  return arabic
    ? (location.city?.ar ?? location.country.ar)
    : (location.city?.en ?? location.country.en);
}

export function locationKey(location: OfficeLocation, index: number) {
  return `${location.country.en}-${location.city?.en ?? ""}-${index}`;
}

/** Stable, content-based id so a card in the "+N more" list can jump to its
 * pin regardless of which array (visible vs. pinned) it's rendered from. */
export function locationSlug(location: OfficeLocation) {
  return `regional-map-pin-${`${location.country.en}-${location.city?.en ?? ""}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}`;
}

export function hasCoordinates(location: OfficeLocation): location is PinnedLocation {
  return typeof location.lat === "number" && typeof location.lng === "number";
}
