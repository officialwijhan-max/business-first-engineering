import type { ReactNode } from "react";
import { ArrowRight, ArrowUpLeft, ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { CaseStudy, CaseStudyFeature } from "@/api/types";

export function Eyebrow({ children, inverse = false }: { children: ReactNode; inverse?: boolean }) {
  return (
    <p className={cn("eyebrow", inverse ? "text-primary-foreground/60" : "text-accent")}>
      {children}
    </p>
  );
}

/**
 * Shared classes for the navy page-header hero pattern (About, Services,
 * Service Detail, Work). `pt-(--header-h)` is applied once by the fixed site
 * header's spacer in `__root.tsx` — hero sections must not repeat it here,
 * or the CTA buttons get pushed below the fold on common viewport heights.
 */
export const HERO_SECTION_CLASS = "relative overflow-hidden bg-primary text-primary-foreground";
export const HERO_CONTAINER_CLASS = "pb-20 pt-8 sm:pt-10 lg:pb-28 lg:pt-12";

/** Pill-shaped eyebrow badge used at the top of every dark/navy page hero. */
export function HeroBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-hero-accent/30 bg-hero-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-hero-accent">
      <span className="size-1.5 rounded-full bg-hero-accent" aria-hidden="true" />
      {children}
    </span>
  );
}

/** Section label used across light sections: short accent rule + uppercase accent text. */
export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="h-px w-8 bg-hero-accent" aria-hidden="true" />
      <p className="text-xs font-bold uppercase tracking-widest text-hero-accent">{children}</p>
    </div>
  );
}

/** Numbered value card — the /about "Our Values" style, also used by the homepage "Why Wijhan". */
export function ValueCard({
  number,
  title,
  copy,
}: {
  number: string;
  title: string;
  copy: string;
}) {
  return (
    <article className="reveal group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg sm:p-8">
      <span className="font-display text-4xl text-accent/25">{number}</span>
      <h3 className="mt-4 font-display text-xl text-foreground">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p>
    </article>
  );
}

export function PageIntro({
  eyebrow,
  title,
  copy,
  breadcrumb,
}: {
  eyebrow: string;
  title: ReactNode;
  copy: string;
  breadcrumb?: ReactNode;
}) {
  return (
    <section className="page-intro">
      <div className="site-container">
        {breadcrumb ? <div className="reveal pb-10">{breadcrumb}</div> : null}
        <div className="grid gap-10 lg:grid-cols-[1.35fr_.65fr] lg:items-end">
          <div className="reveal">
            <HeroBadge>{eyebrow}</HeroBadge>
            <h1 className="mt-6 max-w-4xl font-display text-[2.5rem] leading-[.98] text-primary-foreground sm:text-6xl lg:text-7xl xl:text-8xl">
              {title}
            </h1>
          </div>
          <p className="reveal max-w-xl text-lg leading-8 text-primary-foreground/70 lg:pb-2">
            {copy}
          </p>
        </div>
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  inverse = false,
}: {
  eyebrow: string;
  title: ReactNode;
  copy?: string;
  inverse?: boolean;
}) {
  return (
    <div className="reveal grid gap-7 lg:grid-cols-[1fr_.55fr] lg:items-end">
      <div>
        <Eyebrow inverse={inverse}>{eyebrow}</Eyebrow>
        <h2 className={cn("section-title mt-5", inverse && "text-primary-foreground")}>{title}</h2>
      </div>
      {copy ? (
        <p
          className={cn(
            "max-w-xl text-base leading-7",
            inverse ? "text-primary-foreground/65" : "text-muted-foreground",
          )}
        >
          {copy}
        </p>
      ) : null}
    </div>
  );
}

export function ArrowLink({
  to,
  children,
  inverse = false,
}: {
  to: string;
  children: ReactNode;
  inverse?: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "arrow-link group",
        inverse && "border-primary-foreground/20 text-primary-foreground",
      )}
    >
      <span>{children}</span>
      <ArrowRight
        className="size-4 transition-transform group-hover:translate-x-1"
        aria-hidden="true"
      />
    </Link>
  );
}

/**
 * Loading / error / empty placeholder for API-backed sections (Services,
 * Pricing, Work). Deliberately just a small line of text using the existing
 * type scale and color tokens — no new visual component — so pages that
 * used to render static arrays instantly keep the same layout while data
 * loads, fails, or comes back empty.
 */
export function DataState({
  isLoading,
  isError,
  isEmpty,
  loadingLabel,
  errorLabel,
  emptyLabel,
}: {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  loadingLabel: string;
  errorLabel: string;
  emptyLabel: string;
}) {
  if (isLoading)
    return <p className="reveal py-10 text-sm text-muted-foreground">{loadingLabel}</p>;
  if (isError) return <p className="reveal py-10 text-sm text-destructive">{errorLabel}</p>;
  if (isEmpty) return <p className="reveal py-10 text-sm text-muted-foreground">{emptyLabel}</p>;
  return null;
}

export function DirectionMark({ className }: { className?: string }) {
  return (
    <div className={cn("direction-mark", className)} aria-hidden="true">
      <div className="direction-mark__orbit" />
      <div className="direction-mark__line" />
      <div className="direction-mark__point" />
    </div>
  );
}

/**
 * Default right-column visual for navy heroes — the DirectionMark at the
 * Service Detail size. Use it wherever the hero's second column would
 * otherwise be empty. Hidden below `lg` unless `className` overrides display.
 */
export function HeroGraphic({ className }: { className?: string }) {
  return (
    <div className={cn("hidden lg:flex lg:justify-end", className)}>
      <DirectionMark className="w-[min(70vw,22rem)]" />
    </div>
  );
}

/**
 * A Case Study detail section that renders nothing when it has no content —
 * per the flexible section model, a project may not have every section
 * (Challenge, Engineering, etc.), and empty sections must not be shown.
 */
export function CaseStudyOptionalSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  if (!children) return null;
  return (
    <section className="section-pad border-t border-border">
      <div className="site-container">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <div className="reveal mt-10 max-w-3xl leading-8 text-muted-foreground">{children}</div>
      </div>
    </section>
  );
}

/** Feature grid used on the Case Study detail page (Features section). */
export function CaseStudyFeatureGrid({ features }: { features: CaseStudyFeature[] }) {
  const visible = features.filter((feature) => feature.title);
  if (visible.length === 0) return null;

  return (
    <div className="mt-14 grid gap-10 sm:grid-cols-2">
      {visible.map((feature, index) => (
        <article className="reveal border-t border-border pt-8" key={`${feature.title}-${index}`}>
          {feature.image ? (
            <img
              src={feature.image}
              alt={feature.title}
              loading="lazy"
              className="aspect-video w-full rounded-sm object-cover"
            />
          ) : null}
          {feature.category ? (
            <span className="eyebrow mt-6 block text-muted-foreground">{feature.category}</span>
          ) : null}
          <h3 className="mt-3 font-display text-2xl">{feature.title}</h3>
          {feature.description ? (
            <p className="mt-3 leading-7 text-muted-foreground">{feature.description}</p>
          ) : null}
          {feature.secondary_image ? (
            <img
              src={feature.secondary_image}
              alt=""
              loading="lazy"
              className="mt-4 aspect-video w-full rounded-sm object-cover"
            />
          ) : null}
        </article>
      ))}
    </div>
  );
}

/** Plain tag list used for Our Role (contributions) and Technologies. */
export function CaseStudyTagList({
  items,
  className,
  itemClassName,
}: {
  items: string[];
  className?: string;
  itemClassName?: string;
}) {
  if (items.length === 0) return null;
  return (
    <ul className={className ?? "mt-10 flex flex-wrap gap-3"}>
      {items.map((item) => (
        <li
          key={item}
          className={cn(
            "rounded-full border border-border px-4 py-2 text-sm text-foreground",
            itemClassName,
          )}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Related Work grid at the bottom of a Case Study detail page. */
export function RelatedWorkGrid({
  items,
  arabic = false,
  title,
  label,
}: {
  items: CaseStudy[];
  arabic?: boolean;
  title: string;
  label: string;
}) {
  if (items.length === 0) return null;
  const Arrow = arabic ? ArrowUpLeft : ArrowUpRight;

  return (
    <section className="section-pad bg-secondary">
      <div className="site-container">
        <SectionHeading eyebrow={label} title={title} />
        <div className="mt-14 grid gap-px border-l border-t border-border sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              to={arabic ? "/ar/work/$slug" : "/work/$slug"}
              params={{ slug: item.slug }}
              className="service-tile reveal group"
              key={item.id}
            >
              {item.category ? (
                <span className="eyebrow text-muted-foreground">{item.category}</span>
              ) : null}
              <h3 className="mt-6 flex items-center justify-between gap-3 font-display text-2xl">
                {item.title}
                <Arrow className="size-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
