import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { resolveServiceIcon } from "@/lib/icons";
import type { Locale, Service } from "@/api/types";

/** Service card linking to /services/:slug — shared by the /services grid and the homepage. */
export function ServiceCard({
  service,
  locale,
}: {
  service: Pick<Service, "slug" | "title" | "summary" | "icon">;
  locale: Locale;
}) {
  const arabic = locale === "ar";
  const Icon = resolveServiceIcon(service.icon);
  return (
    <Link
      to={arabic ? "/ar/services/$slug" : "/services/$slug"}
      params={{ slug: service.slug }}
      aria-label={arabic ? `استكشف خدمة ${service.title}` : `Explore ${service.title}`}
      className="reveal group flex min-h-[20rem] flex-col rounded-2xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:border-hero-accent hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <span className="flex size-12 items-center justify-center rounded-xl bg-primary/5 text-primary">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <span className="mt-8 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {arabic ? "القدرات" : "Capabilities"}
      </span>
      <h3 className="mt-3 font-display text-[22px] leading-tight text-foreground">
        {service.title}
      </h3>
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{service.summary}</p>
      <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold text-accent">
        {arabic ? "استكشف الخدمة" : "Explore Service"}
        <ArrowRight
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 rtl-mirror"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}
