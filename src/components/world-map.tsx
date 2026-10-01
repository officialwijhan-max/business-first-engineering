import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import type { OfficeLocation } from "@/content/about";
import {
  hasCoordinates,
  locationKey,
  locationName,
  locationSlug,
  roleColor,
  roleLabel,
  type PinnedLocation,
} from "@/components/regional-map-shared";

/**
 * The interactive world map (react-simple-maps + d3-geo + the 110m TopoJSON). Heavy, so it lives
 * in its own chunk and is only imported by <LazyWorldMap> (lazy-world-map.tsx) once the map is
 * about to scroll into view.
 */
const WORLD_TOPOJSON_URL = "/data/world-countries-110m.json";

// Centered on the Eastern Mediterranean so Europe (down through Germany)
// and the Gulf both sit inside the map frame. Derived by fitting a mercator
// projection to a [-12,18]–[62,60] (lng,lat) bounding box, then reading off
// the center/scale that a react-simple-maps ComposableMap (default 800x600
// viewBox, translate defaults to the viewBox center) would need to
// reproduce that same fit.
const PROJECTION_CONFIG = { center: [25, 46] as [number, number], scale: 430 };

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
