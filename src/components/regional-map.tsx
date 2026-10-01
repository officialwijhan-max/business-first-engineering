import type { CSSProperties } from "react";
import { useState } from "react";
import { MapPin, Phone } from "lucide-react";
import { LazyWorldMap } from "@/components/lazy-world-map";
import {
  hasCoordinates,
  locationKey,
  locationName,
  locationSlug,
  roleColor,
  roleLabel,
  type PinnedLocation,
} from "@/components/regional-map-shared";
import { cn } from "@/lib/utils";
import type { OfficeLocation } from "@/content/about";

/**
 * Regional-presence map for the About/Contact/Home pages: a real
 * react-simple-maps world map (world-atlas's low-detail 110m TopoJSON,
 * served from /public/data) recolored to Wijhan's navy/copper/teal tokens,
 * next to a card list. Reads straight from src/content/about.ts's
 * `locations` array; a location without `lat`/`lng` still gets a card, it
 * just has no pin on the map.
 */

export function RegionalMap({
  locations,
  arabic,
}: {
  locations: OfficeLocation[];
  arabic: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const pinned = locations.filter(hasCoordinates);
  const visible = locations.slice(0, 3);
  const rest = locations.slice(3);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <MapPanel locations={pinned} arabic={arabic} />

      {/* Content-sized (top-aligned to the map) so a lone HQ card doesn't stretch
          with dead space; extra locations simply stack below it. */}
      <div className="flex flex-col gap-4 lg:self-start">
        {visible.map((location, index) => (
          <LocationCard key={locationKey(location, index)} location={location} arabic={arabic} />
        ))}

        {rest.length > 0 ? (
          <div>
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {arabic ? `+${rest.length} أخرى` : `+${rest.length} more`}
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="mt-2 flex flex-col gap-2">
                  {rest.map((location, index) => (
                    <CompactRow
                      key={locationKey(location, index + visible.length)}
                      location={location}
                      arabic={arabic}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function MapPanel({ locations, arabic }: { locations: PinnedLocation[]; arabic: boolean }) {
  return (
    <div>
      <div
        className="relative min-h-[460px] overflow-hidden rounded-2xl max-lg:min-h-[340px]"
        data-surface="dark"
        style={{
          background:
            "linear-gradient(145deg, var(--color-primary) 0%, color-mix(in oklab, var(--color-primary) 80%, white) 50%, var(--color-primary) 100%)",
        }}
      >
        {/* Subtle dot-grid texture over the whole panel, matching the reference. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, color-mix(in oklab, var(--color-primary-foreground) 8%, transparent) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <LazyWorldMap locations={locations} arabic={arabic} />

        <MapLegend
          arabic={arabic}
          className="absolute bottom-3 start-3 hidden flex-col gap-1.5 rounded-lg bg-primary/80 p-3 backdrop-blur-sm sm:flex"
        />
      </div>
      <MapLegend
        arabic={arabic}
        className="mt-3 flex flex-wrap gap-x-4 gap-y-2 rounded-lg bg-primary px-4 py-3 sm:hidden"
      />
    </div>
  );
}

function MapLegend({ arabic, className }: { arabic: boolean; className: string }) {
  return (
    <div className={className}>
      <LegendRow
        colorStyle={{ backgroundColor: "var(--color-hero-accent)" }}
        label={arabic ? roleLabel.headquarters.ar : roleLabel.headquarters.en}
      />
      <LegendRow
        colorStyle={{ backgroundColor: "var(--color-accent)" }}
        label={arabic ? roleLabel.branch.ar : roleLabel.branch.en}
      />
      <LegendRow
        colorStyle={{ backgroundColor: roleColor.presence }}
        label={arabic ? roleLabel.presence.ar : roleLabel.presence.en}
      />
    </div>
  );
}

function LegendRow({ colorStyle, label }: { colorStyle: CSSProperties; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium text-primary-foreground/80">
      <span className="size-2 shrink-0 rounded-full" style={colorStyle} aria-hidden="true" />
      {label}
    </div>
  );
}

function LocationCard({ location, arabic }: { location: OfficeLocation; arabic: boolean }) {
  const isHq = location.role === "headquarters";
  const name = locationName(location, arabic);
  const label = roleLabel[location.role];

  return (
    <article
      className={cn(
        "flex flex-col rounded-2xl p-5 shadow-sm sm:p-6",
        isHq
          ? "bg-primary text-primary-foreground"
          : "border border-border bg-card text-foreground",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        {location.flag ? (
          <span aria-hidden="true" className="text-lg leading-none">
            {location.flag}
          </span>
        ) : null}
        <p className="font-display text-lg">{name}</p>
        {location.role !== "presence" ? (
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[.7rem] font-bold uppercase tracking-widest",
              isHq ? "bg-hero-accent/20 text-hero-accent" : "bg-accent/10 text-accent",
            )}
          >
            {arabic ? label.ar : label.en}
          </span>
        ) : null}
      </div>
      <p
        className={cn(
          "mt-1 text-sm",
          isHq ? "text-primary-foreground/70" : "text-muted-foreground",
        )}
      >
        {arabic ? location.country.ar : location.country.en}
      </p>
      <div className="mt-4">
        {location.address ? (
          <p
            className={cn(
              "flex items-start gap-2 text-sm leading-6",
              isHq ? "text-primary-foreground/70" : "text-muted-foreground",
            )}
          >
            <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {arabic ? location.address.ar : location.address.en}
          </p>
        ) : null}
        {location.phone ? (
          <a
            href={`tel:${location.phone.replace(/\s+/g, "")}`}
            dir="ltr"
            className={cn(
              "mt-1 flex min-h-11 w-fit items-center gap-2 text-sm font-semibold",
              isHq ? "text-hero-accent" : "text-accent",
            )}
          >
            <Phone className="size-4" aria-hidden="true" />
            {location.phone}
          </a>
        ) : null}
      </div>
    </article>
  );
}

function CompactRow({ location, arabic }: { location: OfficeLocation; arabic: boolean }) {
  const name = locationName(location, arabic);
  const hasPin = hasCoordinates(location);

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-2.5 text-sm">
      <span className="flex items-center gap-2 font-medium text-foreground">
        {location.flag ? <span aria-hidden="true">{location.flag}</span> : null}
        {name}
      </span>
      <span className="flex items-center gap-2 text-xs text-muted-foreground">
        {arabic ? location.country.ar : location.country.en}
        {hasPin ? (
          <a
            href={`#${locationSlug(location)}`}
            aria-label={arabic ? `عرض ${name} على الخريطة` : `Show ${name} on the map`}
            className="-m-3 inline-flex size-11 items-center justify-center text-muted-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <MapPin className="size-3.5" aria-hidden="true" />
          </a>
        ) : null}
      </span>
    </div>
  );
}
