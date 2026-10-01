import { lazy, Suspense, useEffect, useRef, useState, type ComponentProps } from "react";

// The map pulls in react-simple-maps + d3-geo and fetches a 108 KB TopoJSON. None of that is
// needed for first paint, so it is a separate chunk that is only requested once the map's
// container is close to the viewport.
const WorldMap = lazy(() =>
  import("@/components/world-map").then((m) => ({ default: m.WorldMap })),
);

/**
 * Drop-in replacement for <WorldMap>: same props, same absolutely-positioned fill of its
 * (relatively positioned) parent, but nothing is downloaded until the container is within
 * ~300px of the viewport. The parent already reserves the map's height, so mounting the map
 * later causes no layout shift. Without IntersectionObserver it loads immediately.
 */
export function LazyWorldMap(props: ComponentProps<typeof WorldMap>) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      {visible ? (
        <Suspense fallback={null}>
          <WorldMap {...props} />
        </Suspense>
      ) : null}
    </div>
  );
}
