import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  DataState,
  DirectionMark,
  HERO_CONTAINER_CLASS,
  HERO_SECTION_CLASS,
  HeroBadge,
  HeroGraphic,
} from "@/components/page-elements";
import { cn } from "@/lib/utils";
import { GetStartedSection } from "@/components/get-started-section";
import { Button } from "@/components/ui/button";
import { PillButton } from "@/components/ui/pill-button";
import { useServices } from "@/hooks/use-services";
import { useWork } from "@/hooks/use-work";
import { resolveServiceIcon } from "@/lib/icons";
import {
  EmptyProjectsState,
  ProjectCard,
  ProjectFilterTabs,
  type ProjectGroup,
  formatProjectCount,
  groupProjects,
  scrollToProjects,
} from "@/components/project-listing";
import type { Locale } from "@/api/types";

type WorkPageProps = {
  locale: Locale;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
};

export function WorkPage({ locale, activeCategory, onCategoryChange }: WorkPageProps) {
  const arabic = locale === "ar";
  const { data, isLoading, isError } = useWork(locale);
  const {
    data: services,
    isLoading: servicesLoading,
    isError: servicesError,
  } = useServices(locale);
  const projects = data?.case_studies ?? [];
  const groups = groupProjects(projects);
  const categoryNames = groups.filter((group) => group.name).map((group) => group.name!);
  const selectedCategory = categoryNames.includes(activeCategory) ? activeCategory : "all";
  const visibleGroups =
    selectedCategory === "all" ? groups : groups.filter((group) => group.name === selectedCategory);
  const visibleProjects = visibleGroups.flatMap((group) => group.projects);

  function selectCategory(category: string) {
    onCategoryChange(category);
  }

  function exploreCategory(category: string) {
    selectCategory(category);
    window.requestAnimationFrame(scrollToProjects);
  }

  return (
    <>
      <section className={HERO_SECTION_CLASS}>
        <DirectionMark className="pointer-events-none absolute end-[-10rem] top-[-10rem] w-[min(80vw,36rem)] opacity-20 lg:hidden" />
        <div className={cn("relative page-container", HERO_CONTAINER_CLASS)}>
          <div className="grid gap-14 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
            <div>
              <HeroBadge>{arabic ? "أعمالنا" : "Our Work"}</HeroBadge>
              <h1 className="mt-6 font-display text-[2.5rem] leading-[.98] sm:text-6xl md:text-7xl">
                {arabic ? "منتجات بنيناها." : "Products We Built."}
                <br />
                <span className="text-hero-accent">
                  {arabic ? "وأعمال ساعدناها على النمو." : "Businesses We Helped Grow."}
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                {arabic
                  ? "مختارات من المنتجات الرقمية التي صمّمناها وبنيناها وأطلقناها، وكل منها مبني حول مشكلة عمل حقيقية."
                  : "A selection of the digital products we've designed, engineered, and shipped, each one built around a real business problem."}
              </p>
            </div>
            <HeroGraphic />
          </div>

          {categoryNames.length > 1 ? (
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {groups
                .filter((group): group is ProjectGroup & { name: string } => Boolean(group.name))
                .slice(0, 3)
                .map((group) => (
                  <article
                    key={group.name}
                    className="reveal rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 backdrop-blur"
                  >
                    <p className="text-sm font-semibold text-primary-foreground">{group.name}</p>
                    <p className="mt-2 text-2xl font-display text-hero-accent">
                      {formatProjectCount(group.projects.length, arabic)}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {group.projects.slice(0, 3).map((project) => (
                        <span
                          key={project.id}
                          className="rounded-full border border-primary-foreground/15 px-3 py-1 text-xs text-primary-foreground/70"
                        >
                          {project.title}
                        </span>
                      ))}
                    </div>
                    <a
                      href="#projects"
                      onClick={(event) => {
                        event.preventDefault();
                        exploreCategory(group.name);
                      }}
                      className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-hero-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-accent"
                    >
                      {arabic ? "استكشف الفئة" : `Explore ${group.name}`}
                      <ArrowRight className="size-4 rtl-mirror" aria-hidden="true" />
                    </a>
                  </article>
                ))}
            </div>
          ) : null}
        </div>
      </section>

      <section id="projects" className="scroll-mt-(--header-h) bg-background py-20 lg:py-28">
        <div className="page-container">
          <div className="reveal flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-hero-accent">
                {arabic ? "مشاريع مختارة" : "Selected projects"}
              </p>
              <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
                {arabic ? "منتجات حقيقية، ونتائج موثقة." : "Real products, verified work."}
              </h2>
            </div>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              {arabic
                ? "استكشف المنتجات المنشورة فعليًا، كما تعكسها بيانات المشاريع المتاحة لدينا."
                : "Explore the products that are actually published, using the project data we have verified."}
            </p>
          </div>

          <ProjectFilterTabs
            locale={locale}
            projects={projects}
            groups={groups}
            activeCategory={selectedCategory}
            onCategoryChange={selectCategory}
          />

          <DataState
            isLoading={isLoading}
            isError={isError}
            isEmpty={false}
            loadingLabel={arabic ? "جارٍ تحميل المشاريع…" : "Loading projects…"}
            errorLabel={
              arabic
                ? "تعذّر تحميل أعمالنا حالًا. يرجى المحاولة مرة أخرى بعد قليل."
                : "We couldn't load our work right now. Please try again shortly."
            }
            emptyLabel=""
          />
          {!isLoading && !isError && projects.length === 0 ? (
            <EmptyProjectsState arabic={arabic} />
          ) : null}
          {!isLoading && !isError && projects.length > 0 && visibleProjects.length === 0 ? (
            <EmptyProjectsState arabic={arabic} filtered />
          ) : null}
          {!isLoading && !isError && visibleProjects.length > 0 ? (
            <div key={selectedCategory} className="mt-14 grid gap-14">
              {visibleGroups.map((group) => (
                <div key={group.name ?? "uncategorized"} className="reveal">
                  {selectedCategory === "all" && group.name ? (
                    <div className="mb-6 flex items-center gap-3">
                      <h3 className="font-display text-2xl text-foreground">{group.name}</h3>
                      <span className="text-sm text-muted-foreground">
                        · {formatProjectCount(group.projects.length, arabic)}
                      </span>
                    </div>
                  ) : null}
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {group.projects.map((project) => (
                      <ProjectCard key={project.id} project={project} locale={locale} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="page-container">
          <div className="reveal grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-hero-accent">
                {arabic ? "القدرات" : "Capabilities"}
              </p>
              <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
                {arabic ? "خلف كل مشروع." : "Behind Every Project."}
              </h2>
            </div>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground lg:justify-self-end">
              {arabic
                ? "الخدمات التي تقف خلف المنتجات أعلاه."
                : "The services that power the products above."}
            </p>
          </div>

          <DataState
            isLoading={servicesLoading}
            isError={servicesError}
            isEmpty={!servicesLoading && !servicesError && (services?.length ?? 0) === 0}
            loadingLabel={arabic ? "جارٍ تحميل القدرات…" : "Loading capabilities…"}
            errorLabel={
              arabic ? "تعذّر تحميل القدرات حالًا." : "We couldn't load our capabilities right now."
            }
            emptyLabel={arabic ? "لا توجد قدرات منشورة بعد." : "No capabilities are published yet."}
          />
          {services && services.length > 0 ? (
            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const Icon = resolveServiceIcon(service.icon);
                return (
                  <Link
                    key={service.id}
                    to={arabic ? "/ar/services/$slug" : "/services/$slug"}
                    params={{ slug: service.slug }}
                    className="reveal group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-hero-accent hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <span className="flex size-11 items-center justify-center rounded-xl bg-primary/5 text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 font-display text-2xl text-foreground">{service.title}</h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                      {service.summary}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                      {arabic ? "استكشف" : "Explore"}
                      <ArrowRight
                        className="size-4 transition-transform group-hover:translate-x-0.5 rtl-mirror"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : null}
          <div className="mt-10">
            <PillButton asChild variant="outline" tone="light" size="lg">
              <Link to={arabic ? "/ar/services" : "/services"}>
                {arabic ? "عرض كل الخدمات" : "View All Services"}
                <ArrowUpRight className="size-4 rtl-mirror" aria-hidden="true" />
              </Link>
            </PillButton>
          </div>
        </div>
      </section>

      {/* FUTURE OPTIONAL SLOT: keep client/logo and stats config arrays empty.
          When verified entries exist, render <ClientLogos /> and <StatsBar /> here. */}

      <GetStartedSection locale={locale} variant="scoping" />
    </>
  );
}
