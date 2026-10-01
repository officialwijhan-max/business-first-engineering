import type { CSSProperties, RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { MapPin, Phone } from "lucide-react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
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

const WORLD_TOPOJSON_URL = "/data/world-countries-110m.json";

// Centered on the Eastern Mediterranean so Europe (down through Germany)
// and the Gulf both sit inside the map frame. Derived by fitting a mercator
// projection to a [-12,18]–[62,60] (lng,lat) bounding box, then reading off
// the center/scale that a react-simple-maps ComposableMap (default 800x600
// viewBox, translate defaults to the viewBox center) would need to
// reproduce that same fit.
const PROJECTION_CONFIG = { center: [25, 46] as [number, number], scale: 430 };

const roleLabel = {
  headquarters: { en: "Headquarters", ar: "المقر الرئيسي" },
  branch: { en: "Branch Office", ar: "مكتب فرعي" },
  presence: { en: "Presence", ar: "تواجد" },
} as const;

const roleColor: Record<OfficeLocation["role"], string> = {
  headquarters: "var(--color-hero-accent)",
  branch: "var(--color-accent)",
  presence: "color-mix(in oklab, var(--color-muted-foreground) 80%, transparent)",
};

type PinnedLocation = OfficeLocation & { lat: number; lng: number };

function locationName(location: OfficeLocation, arabic: boolean) {
  return arabic
    ? (location.city?.ar ?? location.country.ar)
    : (location.city?.en ?? location.country.en);
}

function locationKey(location: OfficeLocation, index: number) {
  return `${location.country.en}-${location.city?.en ?? ""}-${index}`;
}

/** Stable, content-based id so a card in the "+N more" list can jump to its
 * pin regardless of which array (visible vs. pinned) it's rendered from. */
function locationSlug(location: OfficeLocation) {
  return `regional-map-pin-${`${location.country.en}-${location.city?.en ?? ""}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}`;
}

function hasCoordinates(location: OfficeLocation): location is PinnedLocation {
  return typeof location.lat === "number" && typeof location.lng === "number";
}

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

/**
 * The bare real-country-borders map + pins, filling its (relatively
 * positioned) parent. Shared by the full regional panel and the smaller,
 * zoomed hero on the case studies page via `projectionConfig`.
 */
export function WorldMap({
  locations,
  arabic,
  projectionConfig = PROJECTION_CONFIG,
}: {
  locations: OfficeLocation[];
  arabic: boolean;
  projectionConfig?: { center: [number, number]; scale: number };
}) {
  // Marker positions come out of the projection as floats whose last digit differs between
  // Node (SSR) and the browser, which React reports as a hydration mismatch. Pins are
  // therefore drawn client-side only; the base map already loads client-side.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const pinned = mounted ? locations.filter(hasCoordinates) : [];
  const frameRef = useRef<HTMLDivElement>(null);
  const { width, height } = useElementSize(frameRef);
  // Render the SVG 1:1 with its container instead of letting a fixed 800x600
  // viewBox shrink to the container width — on a phone that scaling turned the
  // pins into ~1px dots and the 7.5px labels into ~2px. The projection scale
  // follows the same factor, so the framing is unchanged.
  const fit = Math.min(width / DESIGN_SIZE.width, height / DESIGN_SIZE.height);
  return (
    <div ref={frameRef} className="absolute inset-0">
      <ComposableMap
        width={width}
        height={height}
        projection="geoMercator"
        projectionConfig={{ ...projectionConfig, scale: projectionConfig.scale * fit }}
        className="h-full w-full"
        role="img"
        aria-label={
          arabic ? "خريطة تظهر مواقع مكاتب وجهان" : "Map showing Wijhan's office locations"
        }
      >
        <Geographies geography={WORLD_TOPOJSON_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="color-mix(in oklab, var(--color-primary) 84%, white)"
                stroke="color-mix(in oklab, var(--color-primary) 74%, white)"
                strokeWidth={0.6}
                style={{ outline: "none" }}
              />
            ))
          }
        </Geographies>

        {pinned.map((location, index) => (
          <LocationMarker key={locationKey(location, index)} location={location} arabic={arabic} />
        ))}
      </ComposableMap>
    </div>
  );
}

const DESIGN_SIZE = { width: 800, height: 600 };

/** Pixel size of an element, kept current with a ResizeObserver. Starts at the
 * design size so the server render and first client render agree. */
function useElementSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState(DESIGN_SIZE);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const update = () => {
      const rect = node.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setSize({ width: Math.round(rect.width), height: Math.round(rect.height) });
      }
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);
  return size;
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

        <WorldMap locations={locations} arabic={arabic} />

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

function LocationMarker({ location, arabic }: { location: PinnedLocation; arabic: boolean }) {
  const [active, setActive] = useState(false);
  const name = locationName(location, arabic);
  const label = arabic ? roleLabel[location.role].ar : roleLabel[location.role].en;
  const color = roleColor[location.role];
  const isHq = location.role === "headquarters";

  const activate = () => setActive(true);
  const deactivate = () => setActive(false);

  return (
    <Marker coordinates={[location.lng, location.lat]}>
      <g
        id={locationSlug(location)}
        role="button"
        tabIndex={0}
        aria-label={name}
        onMouseEnter={activate}
        onMouseLeave={deactivate}
        onFocus={activate}
        onBlur={deactivate}
        style={{ cursor: "pointer" }}
      >
        {/* Invisible 44px hit area so the pin is a usable touch target. */}
        <circle r={22} fill="transparent" />
        {isHq ? (
          <>
            {/* Soft glow drawing the eye to HQ; scales with the geo-projected position. */}
            <circle r={20} fill={color} fillOpacity={0.18} />
            <circle
              r={12}
              fill="none"
              stroke={color}
              strokeOpacity={0.55}
              strokeWidth={1.5}
              className="animate-ping motion-reduce:animate-none"
            />
            <circle r={7} fill={color} fillOpacity={0.16} stroke={color} strokeWidth={1.2} />
            <circle r={4} fill={color} />
            <circle r={1.5} fill="var(--color-primary)" />
          </>
        ) : (
          <>
            <circle r={9} fill="none" stroke={color} strokeOpacity={0.4} strokeWidth={1.2} />
            <circle r={4} fill={color} />
          </>
        )}

        {isHq && !active ? <PersistentLabel name={name} /> : null}
        {active ? <TooltipCard name={name} label={label} color={color} arabic={arabic} /> : null}
      </g>
    </Marker>
  );
}

function PersistentLabel({ name }: { name: string }) {
  const width = Math.max(44, name.length * 7.4 + 20);
  return (
    <g transform="translate(0,-28)" style={{ pointerEvents: "none" }}>
      <rect
        x={-width / 2}
        y={-11}
        width={width}
        height={21}
        rx={5}
        fill="color-mix(in oklab, var(--color-primary) 85%, black)"
        stroke="color-mix(in oklab, var(--color-primary-foreground) 12%, transparent)"
        strokeWidth={0.8}
      />
      <text
        textAnchor="middle"
        y={4}
        fill="color-mix(in oklab, var(--color-primary-foreground) 85%, transparent)"
        fontSize={11}
        fontWeight={700}
      >
        {name}
      </text>
    </g>
  );
}

function TooltipCard({
  name,
  label,
  color,
  arabic,
}: {
  name: string;
  label: string;
  color: string;
  arabic: boolean;
}) {
  return (
    <foreignObject
      x={-110}
      y={-64}
      width={220}
      height={40}
      style={{ overflow: "visible", pointerEvents: "none" }}
    >
      <div dir={arabic ? "rtl" : "ltr"} className="flex justify-center">
        <div className="flex w-max max-w-[210px] items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary/90 px-2.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg backdrop-blur-sm">
          <span
            className="size-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          />
          <span>{name}</span>
          <span
            className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
            style={{ backgroundColor: `color-mix(in oklab, ${color} 22%, transparent)`, color }}
          >
            {label}
          </span>
        </div>
      </div>
    </foreignObject>
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
