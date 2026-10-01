import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRight, TerminalSquare } from "lucide-react";
import { cn } from "@/lib/utils";

type TerminalLine = { kind: "command" | "output" | "success"; text: string };

const LINES_EN: TerminalLine[] = [
  { kind: "command", text: "wijhan --init your-project" },
  { kind: "output", text: "Understanding your business goals..." },
  { kind: "output", text: "Mapping requirements to a product plan..." },
  { kind: "output", text: "Assembling your engineering squad..." },
  { kind: "success", text: "Ready to build what your business needs" },
];

const LINES_AR: TerminalLine[] = [
  { kind: "command", text: "wijhan --init your-project" },
  { kind: "output", text: "نفهم أهداف عملك..." },
  { kind: "output", text: "نحوّل المتطلبات إلى خطة منتج..." },
  { kind: "output", text: "نجهّز فريقك الهندسي..." },
  { kind: "success", text: "جاهزون لبناء ما يحتاجه عملك" },
];

const LINE_STAGGER_MS = 450;

/**
 * Terminal-style CTA rendered once in the root layout, directly above the
 * footer on every route. The terminal body stays LTR in Arabic (it's styled
 * as code); lines reveal one by one when scrolled into view, or instantly
 * under prefers-reduced-motion.
 */
export function TerminalCTA() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const arabic = pathname === "/ar" || pathname.startsWith("/ar/");
  const lines = arabic ? LINES_AR : LINES_EN;
  const bodyRef = useRef<HTMLDivElement>(null);
  // "static": everything visible (SSR, no JS, reduced motion).
  // "armed": hidden, waiting to scroll into view. "playing": revealing.
  const [phase, setPhase] = useState<"static" | "armed" | "playing">("static");

  useEffect(() => {
    const node = bodyRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setPhase("armed");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setPhase("playing");
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const hidden = phase === "armed";
  const ctaDelay = phase === "playing" ? lines.length * LINE_STAGGER_MS : 0;

  return (
    <section
      className="bg-background py-16 lg:py-20"
      aria-label={arabic ? "ابدأ مشروعك" : "Start your project"}
    >
      <div className="site-container">
        <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <div
            className="flex items-center gap-2 border-b border-border bg-card px-5 py-3"
            dir="ltr"
          >
            <span className="size-3 rounded-full bg-[#FF5F57]" aria-hidden="true" />
            <span className="size-3 rounded-full bg-[#FEBC2E]" aria-hidden="true" />
            <span className="size-3 rounded-full bg-[#28C840]" aria-hidden="true" />
            <span className="terminal-code ms-3 text-xs text-muted-foreground">
              wijhan-terminal
            </span>
          </div>

          <div
            ref={bodyRef}
            dir="ltr"
            className="terminal-code px-5 py-6 text-left text-[.8rem] leading-6 sm:px-6 sm:text-sm sm:leading-7"
          >
            {lines.map((line, index) => (
              <p
                key={`${arabic}-${index}`}
                className={cn(
                  "transition-all duration-500 ease-out",
                  hidden ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100",
                  line.kind === "command" && "text-primary",
                  line.kind === "output" && "text-muted-foreground",
                  line.kind === "success" && "font-semibold text-accent",
                )}
                style={{
                  transitionDelay: phase === "playing" ? `${index * LINE_STAGGER_MS}ms` : undefined,
                }}
              >
                <span className="select-none text-hero-accent" aria-hidden="true">
                  {line.kind === "command" ? "$ " : line.kind === "success" ? "✓ " : "> "}
                </span>
                <span dir="auto">{line.text}</span>
                {line.kind === "success" && (
                  <span
                    className="terminal-caret ms-1 inline-block h-4 w-2 translate-y-0.5 bg-accent"
                    aria-hidden="true"
                  />
                )}
              </p>
            ))}

            <div
              className={cn(
                "mt-6 transition-all duration-500 ease-out",
                hidden ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100",
              )}
              style={{ transitionDelay: ctaDelay ? `${ctaDelay}ms` : undefined }}
            >
              <Link
                to={arabic ? "/ar/contact" : "/contact"}
                hash="start"
                className="group inline-flex min-h-11 items-center gap-2 rounded-md font-sans text-sm font-semibold text-accent transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                <TerminalSquare className="size-4" aria-hidden="true" />
                <span dir="auto">{arabic ? "ابدأ مشروعك" : "Start your project"}</span>
                <ChevronRight
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
