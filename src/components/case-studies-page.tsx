import { Link } from "@tanstack/react-router";
import { hubsAr } from "@/lib/plural-ar";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, FolderCheck, LayoutGrid, Star, type LucideIcon } from "lucide-react";
import { DataState, SectionLabel } from "@/components/page-elements";
import {
  EmptyProjectsState,
  ProjectCard,
  ProjectFilterTabs,
  ProjectMetricChips,
  groupProjects,
  namedGroups,
  scrollToProjects,
} from "@/components/project-listing";
import { GetStartedSection } from "@/components/get-started-section";
import { WorldMap } from "@/components/regional-map";
import { PillButton } from "@/components/ui/pill-button";
import { useCaseStudy } from "@/hooks/use-case-study";
import { workQueryOptions } from "@/hooks/use-work";
import { locations } from "@/content/about";
import { getProjectDetailContent } from "@/content/project-details";
import type { CaseStudy, CaseStudyDetail, Locale, WorkData } from "@/api/types";

/**
 * "Customer Outcomes" page. Every name, category, and outcome shown here comes from
 * the same GET /work data as /work (plus the featured project's GET /work/{slug}
 * sections). Fields the data doesn't have are hidden, never filled with placeholders.
 */

// Zoomed on Cairo so the single hub reads clearly inside the small hero card.
const HERO_PROJECTION = { center: [33, 29] as [number, number], scale: 900 };

/** The `featured` project, else the most recently published one, else the first. */
export function pickFeaturedProject(projects: CaseStudy[]): CaseStudy | null {
  const flagged = projects.find((project) => project.featured);
  if (flagged) return flagged;
  const [mostRecent] = [...projects].sort((a, b) =>
    (b.published_at ?? "").localeCompare(a.published_at ?? ""),
  );
  return mostRecent ?? null;
}

type CaseStudiesPageProps = {
  locale: Locale;
  initialWork: WorkData | null;
  initialFeaturedDetail: CaseStudyDetail | null;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
};

export function CaseStudiesPage({
  locale,
  initialWork,
  initialFeaturedDetail,
  activeCategory,
  onCategoryChange,
}: CaseStudiesPageProps) {
  const arabic = locale === "ar";
  const { data, isLoading, isError } = useQuery({
    ...workQueryOptions(locale),
    initialData: initialWork ?? undefined,
  });
  const projects = data?.case_studies ?? [];
  const featured = pickFeaturedProject(projects);
  const moreProjects = projects.filter((project) => project.id !== featured?.id);

  const heroCategories = namedGroups(groupProjects(projects));
  const gridGroups = groupProjects(moreProjects);
  const gridCategoryNames = namedGroups(gridGroups).map((group) => group.name);
  const selectedCategory = gridCategoryNames.includes(activeCategory) ? activeCategory : "all";
  const visibleProjects =
    selectedCategory === "all"
      ? moreProjects
      : moreProjects.filter(
          (project) => (project.category ?? project.industry) === selectedCategory,
        );

  function exploreCategory(category: string) {
    if (gridCategoryNames.includes(category)) {
      onCategoryChange(category);
      window.requestAnimationFrame(scrollToProjects);
      return;
    }
    // Only the featured project is in this category — take the visitor to it.
    document.getElementById("featured")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <>
      <CaseStudiesReferenceHero
        arabic={arabic}
        categories={heroCategories}
        onExploreCategory={exploreCategory}
      />
      <CaseStudiesProofIntro
        arabic={arabic}
        projectCount={projects.length}
        categoryCount={heroCategories.length}
        featuredTitle={featured?.title ?? null}
      />

      <section id="featured" className="scroll-mt-(--header-h) bg-background py-20 lg:py-28">
        <div className="page-container">
          <div className="reveal">
            <p className="text-xs font-bold uppercase tracking-widest text-hero-accent">
              {arabic ? "مميز" : "Featured"}
            </p>
            <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {arabic ? "نظرة أقرب." : "A Closer Look."}
            </h2>
          </div>

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
          {!isLoading && !isError && !featured ? <EmptyProjectsState arabic={arabic} /> : null}
          {featured ? (
            <FeaturedProject
              locale={locale}
              project={featured}
              initialDetail={
                initialFeaturedDetail?.slug === featured.slug ? initialFeaturedDetail : null
              }
            />
          ) : null}
        </div>
      </section>

      {moreProjects.length > 0 ? (
        <section id="projects" className="scroll-mt-(--header-h) bg-white py-20 lg:py-28">
          <div className="page-container">
            <div className="reveal">
              <p className="text-xs font-bold uppercase tracking-widest text-hero-accent">
                {arabic ? "قصص أخرى" : "More stories"}
              </p>
              <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
                {arabic ? "نفس المستوى، في كل مرة." : "The Same Standard, Every Time."}
              </h2>
            </div>

            {gridCategoryNames.length > 1 ? (
              <ProjectFilterTabs
                locale={locale}
                projects={moreProjects}
                groups={gridGroups}
                activeCategory={selectedCategory}
                onCategoryChange={onCategoryChange}
              />
            ) : null}

            <div key={selectedCategory} className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visibleProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  locale={locale}
                  ctaLabel={arabic ? "اقرأ المزيد" : "Read more"}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <GetStartedSection
        locale={locale}
        heading={arabic ? "لنبنِ قصة نجاحك." : "Let's Build Your Success Story."}
      />
    </>
  );
}

function CaseStudiesReferenceHero({
  arabic,
  categories,
  onExploreCategory,
}: {
  arabic: boolean;
  categories: Array<{ name: string; projects: CaseStudy[] }>;
  onExploreCategory: (category: string) => void;
}) {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="page-container grid gap-14 py-20 sm:py-24 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-20 lg:py-28">
        <div className="max-w-3xl">
          <span className="reveal inline-flex items-center gap-2 rounded-full border border-hero-accent/30 bg-primary-foreground/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-hero-accent">
            <span className="size-1.5 rounded-full bg-hero-accent" aria-hidden="true" />
            {arabic ? "دراسات الحالة" : "Case studies"}
          </span>
          <h1 className="reveal mt-7 max-w-4xl font-display text-[2.5rem] font-normal leading-[.98] tracking-[-0.045em] text-primary-foreground sm:text-6xl md:text-7xl lg:text-[5.4rem]">
            {arabic ? "منتجات حقيقية." : "Real products"}
            <br />
            <span className="font-semibold text-hero-accent">
              {arabic ? "ونتائج حقيقية." : "with real outcomes."}
            </span>
          </h1>
          <p className="reveal mt-7 max-w-2xl text-lg leading-8 text-primary-foreground/70">
            {arabic
              ? "نظرة أقرب على كيف ساعدنا المؤسسين والشركات على تحويل أفكارهم إلى منتجات تعمل فعلًا."
              : "See how founders and growing businesses trusted Wijhan to turn a real opportunity into a product people can use."}
          </p>

          {categories.length > 1 ? (
            <ul
              className="reveal mt-10 flex flex-wrap gap-3"
              aria-label={arabic ? "فئات المشاريع" : "Project categories"}
            >
              {categories.map((group) => (
                <li key={group.name}>
                  <PillButton asChild variant="outline" tone="dark" size="lg">
                    <a
                      href="#projects"
                      onClick={(event) => {
                        event.preventDefault();
                        onExploreCategory(group.name);
                      }}
                    >
                      {group.name}
                      <span className="text-hero-accent">{group.projects.length}</span>
                    </a>
                  </PillButton>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="reveal relative mx-auto aspect-[1.28] w-full max-w-[38rem] overflow-hidden rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-5 shadow-[0_28px_70px_-40px_rgba(0,0,0,.45)] sm:p-8">
          <div
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(246,243,237,.16) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-5 overflow-hidden rounded-xl border border-primary-foreground/10 bg-primary/40 sm:inset-8">
            <WorldMap locations={locations} arabic={arabic} projectionConfig={HERO_PROJECTION} />
          </div>
          <div className="absolute bottom-6 start-6 z-20 rounded-full border border-hero-accent/30 bg-hero-accent/10 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-hero-accent shadow-sm sm:bottom-9 sm:start-9">
            {arabic ? hubsAr(locations.length) : `${locations.length} delivery hub`}
          </div>
        </div>
      </div>
    </section>
  );
}

/** "Project proof" section: standard single-column intro (label, H2, paragraph) plus stat cards. */
function CaseStudiesProofIntro({
  arabic,
  projectCount,
  categoryCount,
  featuredTitle,
}: {
  arabic: boolean;
  projectCount: number;
  categoryCount: number;
  featuredTitle: string | null;
}) {
  return (
    <section className="bg-background pt-20 lg:pt-28">
      <div className="page-container">
        <div className="reveal max-w-3xl">
          <SectionLabel>{arabic ? "إثبات المشاريع" : "Project proof"}</SectionLabel>
          <h2 className="mt-5 font-display text-[1.75rem] leading-[1.1] tracking-tighter sm:text-[2.25rem] sm:leading-[1.08] md:text-[2.75rem] lg:text-[3.25rem] lg:leading-[1.05]">
            {arabic ? "منتجات بُنيت لعالم حقيقي." : "Products Built for the Real World."}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            {arabic
              ? "كل قصة مبنية على مشكلة عمل واضحة، ومنتج تم إطلاقه، والقرارات التي جعلته ينجح."
              : "Each story is grounded in a clear business problem, a shipped product, and the decisions that made it work."}
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          <StatCard
            icon={FolderCheck}
            value={projectCount}
            label={arabic ? "مشاريع منشورة" : "Published projects"}
          />
          <StatCard
            icon={LayoutGrid}
            value={categoryCount}
            label={arabic ? "فئات المشاريع" : "Project categories"}
          />
          <StatCard
            icon={Star}
            value={featuredTitle ?? "—"}
            label={arabic ? "القصة المميزة" : "Featured story"}
          />
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: number | string;
  label: string;
}) {
  return (
    <article className="reveal group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg">
      <span className="flex size-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <p className="mt-5 break-words font-display text-2xl leading-tight text-primary">{value}</p>
      <p className="mt-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
    </article>
  );
}

function FeaturedProject({
  locale,
  project,
  initialDetail,
}: {
  locale: Locale;
  project: CaseStudy;
  initialDetail: CaseStudyDetail | null;
}) {
  const arabic = locale === "ar";
  // The list endpoint has no challenge/solution text yet, so read the
  // featured project's own detail sections; nothing renders if they're empty.
  const { data: detail } = useCaseStudy(locale, project.slug, initialDetail);
  const sectionContent = (...types: string[]) =>
    types
      .map((type) => detail?.sections.find((section) => section.type === type)?.content)
      .find(Boolean) ?? null;

  const blocks = [
    {
      label: arabic ? "التحدي" : "Challenge",
      content: project.challenge || sectionContent("challenge"),
    },
    {
      label: arabic ? "الحل" : "Solution",
      content: project.solution || sectionContent("solution", "product"),
    },
    { label: arabic ? "النتيجة" : "Outcome", content: project.outcome || detail?.outcome || null },
  ].filter((block): block is { label: string; content: string } => Boolean(block.content));

  const clientName = detail?.client_name;
  const editorial = getProjectDetailContent(project.slug, locale);
  const projectLogo = detail?.logo ?? editorial?.logo;
  const projectPreview = project.cover_image_url ?? editorial?.gallery?.[0]?.src;
  const projectInitial = project.title.trim().charAt(0).toUpperCase();

  return (
    <article className="reveal mt-14 grid overflow-hidden rounded-[2rem] border border-primary/15 bg-card shadow-[0_24px_70px_-40px_rgba(15,27,61,.45)] lg:grid-cols-2">
      <div className="relative flex min-h-[26rem] items-center justify-center overflow-hidden bg-primary px-8 py-20 sm:min-h-[30rem] lg:min-h-[34rem]">
        <div
          className="absolute -end-24 -top-24 size-80 rounded-full border border-primary-foreground/10 bg-primary-foreground/5"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-28 -start-16 h-56 w-80 rounded-full bg-hero-accent/15 blur-3xl"
          aria-hidden="true"
        />
        <div className="absolute start-7 top-7 flex items-center gap-2 text-[.65rem] font-bold uppercase tracking-[.18em] text-primary-foreground/60">
          <span className="size-1.5 rounded-full bg-hero-accent" aria-hidden="true" />
          {arabic ? "مشروع مميز" : "Featured project"}
        </div>
        {projectLogo ? (
          <img
            src={projectLogo}
            alt=""
            className="absolute end-7 top-7 size-12 rounded-full border border-primary-foreground/15 bg-white p-1.5 shadow-sm"
          />
        ) : null}
        {projectPreview ? (
          <div className="relative z-10 w-[11rem] rotate-[-6deg] rounded-[2.5rem] bg-[#171719] p-1.5 shadow-[0_30px_45px_-18px_rgba(0,0,0,.7)] ring-1 ring-white/10 sm:w-[12.5rem]">
            <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2.1rem] bg-black">
              <img
                src={projectPreview}
                alt={`${project.title} app preview`}
                loading="lazy"
                className="size-full object-cover"
              />
              <span
                className="pointer-events-none absolute left-1/2 top-2.5 h-5 w-[5.6rem] -translate-x-1/2 rounded-full bg-black"
                aria-hidden="true"
              />
              <span
                className="pointer-events-none absolute bottom-2 left-1/2 h-1 w-16 -translate-x-1/2 rounded-full bg-white/90"
                aria-hidden="true"
              />
            </div>
          </div>
        ) : projectLogo ? (
          <img
            src={projectLogo}
            alt={`${project.title} logo`}
            className="relative z-10 max-h-28 w-auto rounded-3xl bg-white p-5"
          />
        ) : (
          <span className="relative z-10 flex size-32 items-center justify-center rounded-3xl bg-hero-accent/15 font-display text-7xl text-hero-accent">
            {projectInitial}
          </span>
        )}
        <span className="absolute bottom-7 start-7 text-xs font-bold uppercase tracking-[.18em] text-primary-foreground/50">
          {arabic ? "معاينة المنتج" : "Product preview"}
        </span>
      </div>

      <div className="flex flex-col bg-background p-6 sm:p-10 lg:p-12">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-widest">
          {project.category ? <span className="text-accent">{project.category}</span> : null}
          {project.industry ? (
            <span className="text-muted-foreground">{project.industry}</span>
          ) : null}
        </div>
        <h3 className="mt-4 font-display text-3xl leading-tight text-foreground sm:text-4xl">
          {project.title}
        </h3>
        {clientName ? (
          <p className="mt-3 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {arabic ? "العميل: " : "Client: "}
            </span>
            {clientName}
          </p>
        ) : null}
        <p className="mt-5 text-base leading-7 text-muted-foreground">{project.summary}</p>

        {blocks.length > 0 ? (
          <dl className="mt-8 grid gap-5 border-t border-border pt-8">
            {blocks.map((block) => (
              <div key={block.label}>
                <dt className="text-xs font-bold uppercase tracking-widest text-hero-accent">
                  {block.label}
                </dt>
                <dd className="mt-2 line-clamp-4 text-sm leading-6 text-muted-foreground">
                  {block.content}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <ProjectMetricChips project={project} max={4} className="mt-8 flex flex-wrap gap-2" />

        <div className="mt-auto pt-10">
          <PillButton asChild variant="outline" tone="light" size="lg">
            <Link to={arabic ? "/ar/work/$slug" : "/work/$slug"} params={{ slug: project.slug }}>
              {arabic ? "اقرأ القصة كاملة" : "Read full story"}
              <ArrowRight className="size-4 rtl-mirror" aria-hidden="true" />
            </Link>
          </PillButton>
        </div>
      </div>
    </article>
  );
}
