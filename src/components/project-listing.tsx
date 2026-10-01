import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { getProjectDetailContent } from "@/content/project-details";
import type { CaseStudy, Locale } from "@/api/types";
import { screenshotImage } from "@/lib/images";

/**
 * Project grouping, category filter tabs, and project card shared by /work
 * and /case-studies, so both listings filter and render projects identically.
 */

export type ProjectGroup = { name: string | null; projects: CaseStudy[] };

export function groupProjects(projects: CaseStudy[]): ProjectGroup[] {
  const grouped = new Map<string | null, CaseStudy[]>();
  for (const project of projects) {
    const name = project.category ?? project.industry ?? null;
    const items = grouped.get(name) ?? [];
    items.push(project);
    grouped.set(name, items);
  }
  return [...grouped.entries()].map(([name, groupedProjects]) => ({
    name,
    projects: groupedProjects,
  }));
}

export function namedGroups(groups: ProjectGroup[]) {
  return groups.filter((group): group is ProjectGroup & { name: string } => Boolean(group.name));
}

import { projectsAr } from "@/lib/plural-ar";

export function formatProjectCount(count: number, arabic: boolean) {
  return arabic ? projectsAr(count) : `${count} ${count === 1 ? "project" : "projects"}`;
}

export function scrollToProjects() {
  const target = document.getElementById("projects");
  if (!target) return;
  target.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start",
  });
}

/** Active category kept in `?category=` so filtered views are linkable and survive back/forward. */
export function useCategorySearchParam() {
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const syncCategory = () => {
      setActiveCategory(new URLSearchParams(window.location.search).get("category") ?? "all");
    };
    syncCategory();
    window.addEventListener("popstate", syncCategory);
    return () => window.removeEventListener("popstate", syncCategory);
  }, []);

  function changeCategory(category: string) {
    const url = new URL(window.location.href);
    if (category === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", category);
    window.history.pushState({}, "", url);
    setActiveCategory(category);
  }

  return [activeCategory, changeCategory] as const;
}

export function ProjectFilterTabs({
  locale,
  projects,
  groups,
  activeCategory,
  onCategoryChange,
}: {
  locale: Locale;
  projects: CaseStudy[];
  groups: ProjectGroup[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}) {
  const arabic = locale === "ar";
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const tabs = [
    { name: "all", label: arabic ? `الكل ${projects.length}` : `All ${projects.length}` },
    ...namedGroups(groups).map((group) => ({
      name: group.name,
      label: `${group.name} ${group.projects.length}`,
    })),
  ];

  function focusTab(index: number) {
    const target = tabRefs.current[(index + tabs.length) % tabs.length];
    target?.focus();
  }

  return (
    <div className="mt-12 overflow-x-auto pb-2">
      <div
        className="flex min-w-max gap-2"
        role="tablist"
        aria-label={arabic ? "تصفية المشاريع" : "Filter projects"}
      >
        {tabs.map((tab, index) => (
          <PillButton
            key={tab.name}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            variant="tab"
            active={activeCategory === tab.name}
            size="lg"
            role="tab"
            aria-selected={activeCategory === tab.name}
            tabIndex={activeCategory === tab.name ? 0 : -1}
            onClick={() => onCategoryChange(tab.name)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") {
                event.preventDefault();
                focusTab(index + (arabic ? -1 : 1));
              }
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                focusTab(index + (arabic ? 1 : -1));
              }
              if (event.key === "Home") {
                event.preventDefault();
                focusTab(0);
              }
              if (event.key === "End") {
                event.preventDefault();
                focusTab(tabs.length - 1);
              }
            }}
          >
            {tab.label}
          </PillButton>
        ))}
      </div>
    </div>
  );
}

/** Metric chips — rendered only from real `metrics` data, never placeholders. */
export function ProjectMetricChips({
  project,
  max,
  className,
}: {
  project: CaseStudy;
  max: number;
  className?: string;
}) {
  const metrics = (project.metrics ?? []).filter((metric) => metric.value && metric.label);
  if (metrics.length === 0) return null;
  return (
    <ul className={className ?? "mt-5 flex flex-wrap gap-2"}>
      {metrics.slice(0, max).map((metric) => (
        <li
          key={`${metric.value}-${metric.label}`}
          className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground"
        >
          <span className="font-bold text-foreground">{metric.value}</span> {metric.label}
        </li>
      ))}
    </ul>
  );
}

export function ProjectCard({
  project,
  locale,
  ctaLabel,
}: {
  project: CaseStudy;
  locale: Locale;
  ctaLabel?: string;
}) {
  const arabic = locale === "ar";
  const editorial = getProjectDetailContent(project.slug, locale);
  const projectLogo = project.cover_image_url ?? editorial?.logo;
  const projectPreview = editorial?.gallery?.[0]?.src;
  const projectInitial = project.title.trim().charAt(0).toUpperCase();
  return (
    <Link
      to={arabic ? "/ar/work/$slug" : "/work/$slug"}
      params={{ slug: project.slug }}
      aria-label={arabic ? `عرض مشروع ${project.title}` : `View ${project.title} project`}
      className="reveal group flex min-h-[28rem] flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-hero-accent hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="relative flex h-60 items-center justify-center overflow-hidden bg-primary p-8">
        <div
          className="absolute -end-12 -top-16 size-48 rounded-full border border-primary-foreground/10 bg-primary-foreground/5"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-16 -start-10 size-40 rounded-full bg-hero-accent/15 blur-2xl"
          aria-hidden="true"
        />
        {projectPreview ? (
          <div className="relative z-10 h-[13rem] w-[7.25rem] rotate-[-6deg] rounded-[1.7rem] bg-[#171719] p-1 shadow-[0_22px_30px_-14px_rgba(0,0,0,.7)] ring-1 ring-white/10">
            <div className="relative size-full overflow-hidden rounded-[1.4rem] bg-black">
              <img
                {...screenshotImage(projectPreview, "116px")}
                alt={arabic ? `معاينة تطبيق ${project.title}` : `${project.title} app preview`}
                loading="lazy"
                className="size-full object-cover"
              />
              <span
                className="pointer-events-none absolute left-1/2 top-1.5 h-3 w-12 -translate-x-1/2 rounded-full bg-black"
                aria-hidden="true"
              />
            </div>
          </div>
        ) : projectLogo ? (
          <img
            src={projectLogo}
            alt={arabic ? `شعار ${project.title}` : `${project.title} logo`}
            loading="lazy"
            className="relative z-10 size-24 rounded-2xl bg-white object-contain p-3"
          />
        ) : (
          <span className="relative z-10 flex size-24 items-center justify-center rounded-2xl bg-hero-accent/15 font-display text-5xl text-hero-accent">
            {projectInitial}
          </span>
        )}
        {projectPreview ? null : (
          <span className="absolute bottom-4 start-5 text-[.6rem] font-bold uppercase tracking-[.18em] text-primary-foreground/55">
            {arabic ? "معاينة" : "App preview"}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-7">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-widest">
          {project.category ? <span className="text-accent">{project.category}</span> : null}
          {project.industry ? (
            <span className="text-muted-foreground">{project.industry}</span>
          ) : null}
        </div>
        <h3 className="mt-4 font-display text-[22px] leading-tight text-foreground">
          {project.title}
        </h3>
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{project.summary}</p>
        <ProjectMetricChips project={project} max={3} />
        <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold text-accent">
          {ctaLabel ?? (arabic ? "عرض المشروع" : "View Project")}
          <ArrowRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 rtl-mirror"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}

export function EmptyProjectsState({
  arabic,
  filtered = false,
}: {
  arabic: boolean;
  filtered?: boolean;
}) {
  return (
    <div className="reveal mt-14 rounded-2xl border border-border bg-card p-10 text-center">
      <p className="font-display text-3xl text-muted-foreground sm:text-4xl">
        {filtered
          ? arabic
            ? "لا توجد مشاريع في هذه الفئة بعد."
            : "There are no projects in this category yet."
          : arabic
            ? "نجهّز نماذج من أعمالنا."
            : "Selected work is being prepared."}
      </p>
      <Link
        to={arabic ? "/ar/contact" : "/contact"}
        hash="start"
        className="mt-7 inline-flex items-center justify-center rounded-full bg-hero-accent px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-hero-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {arabic ? "ابدأ مشروعك" : "Start a Project"}
      </Link>
    </div>
  );
}
