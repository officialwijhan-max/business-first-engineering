import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpLeft, ArrowUpRight, Check, ChevronRight } from "lucide-react";
import {
  CaseStudyFeatureGrid,
  CaseStudyTagList,
  DataState,
  DirectionMark,
  HeroBadge,
  PageIntro,
  RelatedWorkGrid,
  SectionHeading,
  SectionLabel,
} from "@/components/page-elements";
import { GetStartedSection } from "@/components/get-started-section";
import { useCaseStudy } from "@/hooks/use-case-study";
import { ApiRequestError } from "@/api/client";
import { cn } from "@/lib/utils";
import {
  getProjectDetailContent,
  type ProjectDetailChallenge,
  type ProjectDetailGalleryItem,
  type ProjectDetailHighlight,
  type ProjectDetailSolution,
} from "@/content/project-details";
import type { CaseStudyDetail, CaseStudyFeature, Locale } from "@/api/types";

/**
 * Shared /work/:slug and /ar/work/:slug template.
 *
 * Every section is optional: it renders only when the project has the data for it
 * (API fields, or the richer editorial layer in `content/project-details.ts`), and the
 * sticky jump-nav lists only the sections that rendered. Nothing here is filled with
 * placeholder copy.
 */

const COPY = {
  en: {
    home: "Home",
    work: "Selected Work",
    fallbackCategory: "Case study",
    loading: "Loading case study…",
    loadError: "We couldn't load this case study right now. Please try again shortly.",
    notFound: "This case study could not be found.",
    backToWork: "Back to Selected Work",
    jumpNav: "On this page",
    nav: {
      overview: "Overview",
      challenge: "Challenge",
      solution: "Solution",
      highlights: "Highlights",
      screenshots: "Screenshots",
      capabilities: "Capabilities",
      role: "Role",
      outcome: "Outcome",
    },
    overviewTitle: "Project at a glance",
    snapshot: "Project snapshot",
    category: "Category",
    industry: "Industry",
    client: "Client",
    technology: "Technology",
    ourRole: "Our role",
    appPreview: "App preview",
    challengeEyebrow: "The Challenge",
    challengeTitle: "The problem we were asked to solve",
    solutionEyebrow: "The Solution",
    solutionTitle: "What we built",
    highlightsEyebrow: "Product highlights",
    highlightsTitle: "Product Highlights",
    productExperience: "Product experience",
    screenshotsEyebrow: "Screenshots",
    screenshotsTitle: "Inside the product",
    capabilitiesEyebrow: "Capabilities",
    capabilitiesTitle: "Product capabilities",
    roleEyebrow: "Our role",
    roleTitle: "What Wijhan contributed",
    engineeringEyebrow: "Engineering",
    engineeringTitle: "How it was built",
    technologiesEyebrow: "Technologies",
    technologiesTitle: "Built to evolve",
    outcomeEyebrow: "Outcome",
    outcomeTitle: "The delivered result",
    relatedTitle: "More selected work",
    relatedLabel: "Related work",
  },
  ar: {
    home: "الرئيسية",
    work: "أعمالنا",
    fallbackCategory: "دراسة حالة",
    loading: "جارٍ تحميل دراسة الحالة…",
    loadError: "تعذّر تحميل دراسة الحالة حالًا. يرجى المحاولة مرة أخرى بعد قليل.",
    notFound: "تعذّر العثور على دراسة الحالة هذه.",
    backToWork: "العودة إلى أعمالنا",
    jumpNav: "في هذه الصفحة",
    nav: {
      overview: "نظرة عامة",
      challenge: "التحدي",
      solution: "الحل",
      highlights: "أبرز الميزات",
      screenshots: "لقطات الشاشة",
      capabilities: "القدرات",
      role: "دورنا",
      outcome: "النتيجة",
    },
    overviewTitle: "المشروع في لمحة",
    snapshot: "نبذة عن المشروع",
    category: "الفئة",
    industry: "الصناعة",
    client: "العميل",
    technology: "التقنية",
    ourRole: "دورنا",
    appPreview: "معاينة التطبيق",
    challengeEyebrow: "التحدي",
    challengeTitle: "المشكلة التي طُلب منا حلّها",
    solutionEyebrow: "الحل",
    solutionTitle: "ما الذي بنيناه",
    highlightsEyebrow: "أبرز ميزات المنتج",
    highlightsTitle: "أبرز ميزات المنتج",
    productExperience: "تجربة المنتج",
    screenshotsEyebrow: "لقطات الشاشة",
    screenshotsTitle: "داخل المنتج",
    capabilitiesEyebrow: "القدرات",
    capabilitiesTitle: "قدرات المنتج",
    roleEyebrow: "دورنا",
    roleTitle: "ما قدّمته وجهان",
    engineeringEyebrow: "الهندسة",
    engineeringTitle: "كيف تم بناؤه",
    technologiesEyebrow: "التقنيات",
    technologiesTitle: "مبني ليتطور",
    outcomeEyebrow: "النتيجة",
    outcomeTitle: "ما سلّمناه",
    relatedTitle: "المزيد من أعمالنا المختارة",
    relatedLabel: "أعمال ذات صلة",
  },
} as const;

/** Offset for in-page anchors: fixed site header + the sticky jump-nav. */
const ANCHOR_OFFSET_CLASS = "scroll-mt-20";

type SectionId =
  | "overview"
  | "challenge"
  | "solution"
  | "highlights"
  | "screenshots"
  | "capabilities"
  | "role"
  | "outcome";

type ExtendedBlock = { eyebrow: string; heading: string; paragraph: string };

export function ProjectDetailPage({
  locale,
  slug,
  initialData,
}: {
  locale: Locale;
  slug: string;
  initialData?: CaseStudyDetail | null;
}) {
  const arabic = locale === "ar";
  const t = COPY[locale];
  const { data: caseStudy, isLoading, isError, error } = useCaseStudy(locale, slug, initialData);
  const notFoundError = error instanceof ApiRequestError && error.status === 404;
  const BackArrow = arabic ? ArrowUpLeft : ArrowUpRight;

  if (notFoundError) {
    return (
      <section className="section-pad">
        <div className="site-container text-center">
          <p className="font-display text-3xl text-muted-foreground sm:text-4xl">{t.notFound}</p>
          <Link
            to={arabic ? "/ar/work" : "/work"}
            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-accent"
          >
            {t.backToWork} <BackArrow className="size-4" />
          </Link>
        </div>
      </section>
    );
  }

  if (isLoading || isError || !caseStudy) {
    return (
      <section className="section-pad">
        <div className="site-container">
          <DataState
            isLoading={isLoading}
            isError={isError}
            isEmpty={false}
            loadingLabel={t.loading}
            errorLabel={t.loadError}
            emptyLabel=""
          />
        </div>
      </section>
    );
  }

  // Editorial copy (when present) wins over the API's common case-study shape.
  const editorial = getProjectDetailContent(slug, locale);
  const findSection = (type: string) =>
    caseStudy.sections.find((section) => section.type === type && section.content);
  const challengeSection = findSection("challenge");
  const productSection = findSection("product");
  const engineeringSection = findSection("engineering");
  const customSections = caseStudy.sections.filter(
    (section) => !["challenge", "product", "engineering"].includes(section.type) && section.content,
  );

  const projectTitle = editorial?.title ?? caseStudy.title;
  const category = editorial?.category ?? caseStudy.category ?? t.fallbackCategory;
  const tagline = editorial?.tagline ?? caseStudy.headline;
  const description = editorial?.description ?? caseStudy.hero_description;
  const logo = editorial?.logo ?? caseStudy.logo;
  const gallery = editorial?.gallery ?? [];
  const technologies = editorial?.technologies ?? caseStudy.technologies.map((tech) => tech.name);

  const challengeProse = editorial?.challenge ?? challengeSection?.content;
  const challenge =
    editorial?.challengeBreakdown || challengeProse
      ? {
          title: challengeSection?.title ?? t.challengeTitle,
          breakdown: editorial?.challengeBreakdown,
          prose: challengeProse,
        }
      : null;

  const solutionProse = editorial?.solution ?? productSection?.content;
  const solution =
    editorial?.solutionSteps || solutionProse
      ? {
          title: productSection?.title ?? t.solutionTitle,
          steps: editorial?.solutionSteps,
          prose: solutionProse,
        }
      : null;

  const highlights: ProjectDetailHighlight[] =
    editorial?.productHighlights ??
    customSections.map((section) => ({
      eyebrow: t.productExperience,
      heading: section.title ?? section.type,
      paragraph: section.content ?? "",
    }));

  const features: CaseStudyFeature[] = editorial?.capabilities
    ? editorial.capabilities.map((capability) => ({
        title: capability.title,
        description: capability.paragraph,
        image: null,
        secondary_image: null,
        category: capability.label,
      }))
    : caseStudy.features;

  const roleItems = editorial?.role?.items ?? caseStudy.contributions.map((c) => c.name);
  const role: (ExtendedBlock & { items: string[] }) | null =
    roleItems.length > 0
      ? {
          eyebrow: editorial?.role?.eyebrow ?? t.roleEyebrow,
          heading: editorial?.role?.heading ?? t.roleTitle,
          paragraph: "",
          items: roleItems,
        }
      : null;
  const engineering: ExtendedBlock | null =
    editorial?.engineering ??
    (engineeringSection?.content
      ? {
          eyebrow: t.engineeringEyebrow,
          heading: engineeringSection.title ?? t.engineeringTitle,
          paragraph: engineeringSection.content,
        }
      : null);
  const outcome: ExtendedBlock | null =
    editorial?.outcome ??
    (caseStudy.outcome
      ? { eyebrow: t.outcomeEyebrow, heading: t.outcomeTitle, paragraph: caseStudy.outcome }
      : null);

  const navSections: { id: SectionId; label: string }[] = [
    { id: "overview" as const, label: t.nav.overview },
    ...(challenge ? [{ id: "challenge" as const, label: t.nav.challenge }] : []),
    ...(solution ? [{ id: "solution" as const, label: t.nav.solution }] : []),
    ...(highlights.length > 0 ? [{ id: "highlights" as const, label: t.nav.highlights }] : []),
    ...(gallery.length > 0 ? [{ id: "screenshots" as const, label: t.nav.screenshots }] : []),
    ...(features.length > 0 ? [{ id: "capabilities" as const, label: t.nav.capabilities }] : []),
    ...(role ? [{ id: "role" as const, label: t.nav.role }] : []),
    ...(outcome ? [{ id: "outcome" as const, label: t.nav.outcome }] : []),
  ];

  const hasDarkBlock = Boolean(role || engineering || technologies.length > 0 || outcome);

  return (
    <>
      <ProjectHero
        breadcrumb={
          <ProjectBreadcrumb
            homeLabel={t.home}
            homeTo={arabic ? "/ar" : "/"}
            workLabel={t.work}
            workTo={arabic ? "/ar/work" : "/work"}
            current={projectTitle}
          />
        }
        eyebrow={category}
        title={tagline}
        copy={description}
        heroImage={editorial?.cover ?? gallery[0]?.src}
        heroImageAlt={`${projectTitle} ${t.appPreview}`}
        logo={logo}
      />

      {/* One wrapper so the sticky jump-nav stays pinned only while the story is on screen. */}
      <div>
        <SectionJumpNav label={t.jumpNav} sections={navSections} />

        <OverviewSection
          copy={t}
          summary={caseStudy.summary}
          title={projectTitle}
          category={category}
          industry={caseStudy.industry}
          client={caseStudy.client_name}
          technologies={technologies}
          roleSummary={editorial?.roleSummary}
          logo={logo}
          coverImage={caseStudy.cover_image_url}
          previewImage={gallery[0]?.src}
        />

        {challenge ? (
          <ChallengeSection
            eyebrow={t.challengeEyebrow}
            title={challenge.title}
            breakdown={challenge.breakdown}
            prose={challenge.prose}
          />
        ) : null}

        {solution ? (
          <SolutionSection
            eyebrow={t.solutionEyebrow}
            title={solution.title}
            steps={solution.steps}
            prose={solution.prose}
          />
        ) : null}

        {highlights.length > 0 ? (
          <section
            id="highlights"
            className={cn("section-pad border-t border-border bg-background", ANCHOR_OFFSET_CLASS)}
          >
            <div className="site-container">
              <SectionHeading eyebrow={t.highlightsEyebrow} title={t.highlightsTitle} />
              <div className="mt-14 grid gap-x-12 gap-y-14 lg:grid-cols-2">
                {highlights.map((highlight) => (
                  <article className="reveal border-t border-border pt-8" key={highlight.heading}>
                    <p className="eyebrow text-accent">{highlight.eyebrow}</p>
                    <h3 className="mt-5 font-display text-2xl leading-tight text-foreground sm:text-3xl">
                      {highlight.heading}
                    </h3>
                    <p className="mt-5 max-w-3xl leading-8 text-muted-foreground">
                      {highlight.paragraph}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {gallery.length > 0 ? (
          <ScreenshotsSection
            eyebrow={t.screenshotsEyebrow}
            title={t.screenshotsTitle}
            items={gallery}
          />
        ) : null}

        {features.length > 0 ? (
          <section
            id="capabilities"
            className={cn("section-pad border-t border-border", ANCHOR_OFFSET_CLASS)}
          >
            <div className="site-container">
              <SectionHeading eyebrow={t.capabilitiesEyebrow} title={t.capabilitiesTitle} />
              <CaseStudyFeatureGrid features={features} />
            </div>
          </section>
        ) : null}

        {hasDarkBlock ? (
          <ExtendedBlocks
            role={role}
            engineering={engineering}
            technologies={technologies}
            technologiesEyebrow={t.technologiesEyebrow}
            technologiesTitle={t.technologiesTitle}
            outcome={outcome}
          />
        ) : null}
      </div>

      <RelatedWorkGrid
        items={caseStudy.related}
        arabic={arabic}
        title={t.relatedTitle}
        label={t.relatedLabel}
      />
      <GetStartedSection locale={locale} variant="scoping" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Sticky jump-nav                                                     */
/* ------------------------------------------------------------------ */

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function SectionJumpNav({
  label,
  sections,
}: {
  label: string;
  sections: { id: SectionId; label: string }[];
}) {
  const [active, setActive] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const ids = sections.map((section) => section.id).join(",");

  // Scroll-spy: highlight the section crossing a band near the top of the viewport.
  useEffect(() => {
    const sectionIds = ids.split(",").filter(Boolean);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0 || typeof IntersectionObserver === "undefined") return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const current = sectionIds.find((id) => visible.has(id));
        if (current) setActive(current);
        // Scrolled back above the first section (into the hero): nothing is current.
        else if ((elements[0]?.getBoundingClientRect().top ?? 0) > window.innerHeight * 0.35) {
          setActive(null);
        }
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  // Keep the active pill visible in the horizontally scrollable row (small screens).
  useEffect(() => {
    const list = listRef.current;
    const link = active ? list?.querySelector<HTMLElement>(`[data-section="${active}"]`) : null;
    if (!list || !link) return;
    const listBox = list.getBoundingClientRect();
    const linkBox = link.getBoundingClientRect();
    const delta = linkBox.left + linkBox.width / 2 - (listBox.left + listBox.width / 2);
    if (Math.abs(delta) > 1) list.scrollBy({ left: delta });
  }, [active]);

  function jumpTo(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
    setActive(id);
  }

  return (
    <nav
      aria-label={label}
      className="sticky top-(--header-h) z-30 border-b border-border bg-background/90 backdrop-blur"
    >
      <div className="site-container">
        <ul
          ref={listRef}
          className="flex gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {sections.map((section) => {
            const isActive = active === section.id;
            return (
              <li key={section.id} className="shrink-0">
                <a
                  href={`#${section.id}`}
                  data-section={section.id}
                  aria-current={isActive ? "location" : undefined}
                  onClick={(event) => jumpTo(event, section.id)}
                  className={cn(
                    "inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  {section.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Hero + breadcrumb                                                   */
/* ------------------------------------------------------------------ */

const BREADCRUMB_LINK_CLASS =
  "inline-flex min-h-11 items-center rounded-full px-3.5 text-primary-foreground/65 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground focus-visible:bg-primary-foreground/10 focus-visible:text-primary-foreground";

/** Pill-style breadcrumb: hoverable link pills, with the current page as a filled pill. */
function ProjectBreadcrumb({
  homeLabel,
  homeTo,
  workLabel,
  workTo,
  current,
}: {
  homeLabel: string;
  homeTo: string;
  workLabel: string;
  workTo: string;
  current: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm font-medium"
    >
      <Link to={homeTo} className={BREADCRUMB_LINK_CLASS}>
        {homeLabel}
      </Link>
      <ChevronRight className="size-4 text-primary-foreground/35 rtl-mirror" aria-hidden="true" />
      <Link to={workTo} className={BREADCRUMB_LINK_CLASS}>
        {workLabel}
      </Link>
      <ChevronRight className="size-4 text-primary-foreground/35 rtl-mirror" aria-hidden="true" />
      <span
        aria-current="page"
        className="inline-flex min-h-11 items-center rounded-full border border-primary-foreground/15 bg-primary-foreground/10 px-4 font-semibold text-primary-foreground"
      >
        {current}
      </span>
    </nav>
  );
}

/**
 * Project hero: category pill + tagline + description on one side and a phone mockup of the
 * app on the other. Without a screenshot it falls back to the standard text-only page intro.
 */
function ProjectHero({
  breadcrumb,
  eyebrow,
  title,
  copy,
  heroImage,
  heroImageAlt,
  logo,
}: {
  breadcrumb: ReactNode;
  eyebrow: string;
  title: string;
  copy: string;
  heroImage: string | undefined;
  heroImageAlt: string;
  logo: string | null | undefined;
}) {
  if (!heroImage) {
    return <PageIntro breadcrumb={breadcrumb} eyebrow={eyebrow} title={title} copy={copy} />;
  }

  return (
    <section className="page-intro">
      <div className="site-container">
        <div className="reveal pb-10">{breadcrumb}</div>
        <div className="grid gap-14 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div className="reveal">
            <HeroBadge>{eyebrow}</HeroBadge>
            <h1 className="mt-6 max-w-4xl font-display text-[2.5rem] leading-[.98] text-primary-foreground sm:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-primary-foreground/70">{copy}</p>
          </div>
          <div className="reveal relative flex items-center justify-center py-4">
            <div
              className="absolute size-[min(24rem,90%)] rounded-full border border-hero-accent/20 bg-hero-accent/10 blur-[1px]"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-6 size-64 rounded-full bg-hero-accent/20 blur-3xl"
              aria-hidden="true"
            />
            <PhoneFrame
              src={heroImage}
              alt={heroImageAlt}
              priority
              className="relative z-10 w-[13.5rem] rotate-3 sm:w-[15rem] lg:w-[16rem]"
            />
            {logo ? (
              <img
                src={logo}
                alt=""
                className="absolute bottom-10 start-[max(0px,calc(50%-14rem))] z-20 size-16 rounded-2xl border border-primary-foreground/15 bg-white object-contain p-2 shadow-xl"
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Overview: preview + snapshot card                                   */
/* ------------------------------------------------------------------ */

function OverviewSection({
  copy: t,
  summary,
  title,
  category,
  industry,
  client,
  technologies,
  roleSummary,
  logo,
  coverImage,
  previewImage,
}: {
  copy: (typeof COPY)[Locale];
  summary: string | null;
  title: string;
  category: string;
  industry: string | null;
  client: string | null;
  technologies: string[];
  roleSummary: string | undefined;
  logo: string | null | undefined;
  coverImage: string | null;
  previewImage: string | undefined;
}) {
  const hasVisual = Boolean(previewImage || coverImage || logo);

  return (
    <section id="overview" className={cn("section-pad bg-secondary", ANCHOR_OFFSET_CLASS)}>
      <div className="site-container">
        <SectionHeading
          eyebrow={t.nav.overview}
          title={t.overviewTitle}
          {...(summary ? { copy: summary } : {})}
        />
        <div
          className={cn(
            "mt-14 grid gap-10 lg:items-stretch",
            hasVisual && "lg:grid-cols-[.9fr_1.1fr]",
          )}
        >
          {hasVisual ? (
            <div className="reveal relative flex min-h-[25rem] items-center justify-center overflow-hidden rounded-[1.75rem] border border-border bg-[#f4f1ea] p-8 shadow-[0_18px_45px_-32px_rgba(15,23,42,.45)] sm:min-h-[28rem]">
              <div
                className="absolute -end-20 -top-24 size-80 rounded-full border border-accent/15 bg-accent/5"
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-24 -start-10 h-48 w-72 rounded-full bg-hero-accent/25 blur-3xl"
                aria-hidden="true"
              />
              <div className="absolute inset-x-7 top-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary">
                  <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
                  {t.appPreview}
                </div>
                {logo && (previewImage || coverImage) ? (
                  <img
                    src={logo}
                    alt=""
                    className="size-11 rounded-full border border-border bg-white object-contain p-1.5 shadow-sm"
                  />
                ) : null}
              </div>
              {previewImage ? (
                <PhoneFrame
                  src={previewImage}
                  alt={`${title} ${t.appPreview}`}
                  className="relative z-10 mt-5 w-[10.75rem] rotate-[-5deg] sm:w-[12rem]"
                />
              ) : coverImage ? (
                <img
                  src={coverImage}
                  alt={title}
                  className="relative z-10 mt-8 aspect-[16/9] w-full rounded-xl object-cover"
                />
              ) : logo ? (
                <img src={logo} alt={`${title} logo`} className="relative z-10 max-h-20 w-auto" />
              ) : null}
            </div>
          ) : null}

          <SnapshotCard
            title={t.snapshot}
            rows={[
              { label: t.category, value: category },
              industry ? { label: t.industry, value: industry } : null,
              client ? { label: t.client, value: client } : null,
              technologies.length > 0
                ? { label: t.technology, value: technologies.join(" · ") }
                : null,
              roleSummary ? { label: t.ourRole, value: roleSummary } : null,
            ]}
          />
        </div>
      </div>
    </section>
  );
}

/** Same label/value card as the About page's "Company at a glance". */
function SnapshotCard({
  title,
  rows,
}: {
  title: string;
  rows: ({ label: string; value: string } | null)[];
}) {
  const visibleRows = rows.filter((row): row is { label: string; value: string } => row !== null);

  return (
    <div className="reveal relative overflow-hidden rounded-2xl border border-primary-foreground/10 bg-primary p-6 text-primary-foreground sm:p-8 lg:self-center">
      <DirectionMark className="absolute end-[-7rem] top-[-7rem] w-[min(85vw,30rem)] opacity-30" />
      <div className="relative z-10">
        <div className="flex items-center gap-2">
          <span className="h-px w-6 bg-primary-foreground/20" aria-hidden="true" />
          <p className="text-xs font-bold uppercase tracking-widest text-hero-accent">{title}</p>
        </div>
        <dl className="mt-7 divide-y divide-primary-foreground/10">
          {visibleRows.map((row) => (
            <div
              key={row.label}
              className="flex min-h-20 items-center justify-between gap-4 py-5 sm:gap-6"
            >
              <dt className="text-sm text-primary-foreground/55">{row.label}</dt>
              <dd className="max-w-[16rem] text-end text-sm font-semibold text-primary-foreground">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function PhoneFrame({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  /** Above-the-fold image: load eagerly instead of lazily. */
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[2.55rem] bg-[#171719] p-1.5 shadow-[0_30px_45px_-18px_rgba(15,23,42,.65)] ring-1 ring-black/70",
        className,
      )}
    >
      <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2.15rem] bg-black">
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          {...(priority ? { fetchPriority: "high" as const } : {})}
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
  );
}

/* ------------------------------------------------------------------ */
/* Challenge                                                           */
/* ------------------------------------------------------------------ */

function ChallengeSection({
  eyebrow,
  title,
  breakdown,
  prose,
}: {
  eyebrow: string;
  title: string;
  breakdown: ProjectDetailChallenge | undefined;
  prose: string | null | undefined;
}) {
  return (
    <section
      id="challenge"
      className={cn("section-pad border-t border-border bg-background", ANCHOR_OFFSET_CLASS)}
    >
      <div className="site-container">
        {breakdown ? (
          <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
            <div className="reveal">
              <SectionLabel>{eyebrow}</SectionLabel>
              <h2 className="section-title mt-5">{title}</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                {breakdown.intro}
              </p>
            </div>
            <div className="reveal">
              <ul className="grid gap-4">
                {breakdown.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 sm:p-6"
                  >
                    <span
                      className="mt-2.5 size-2 shrink-0 rounded-full bg-hero-accent"
                      aria-hidden="true"
                    />
                    <span className="leading-7 text-foreground">{point}</span>
                  </li>
                ))}
              </ul>
              {breakdown.closing ? (
                <p className="mt-8 rounded-e-lg border-s-2 border-accent bg-secondary px-5 py-4 leading-7 text-foreground/80">
                  {breakdown.closing}
                </p>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="reveal max-w-3xl">
            <SectionLabel>{eyebrow}</SectionLabel>
            <h2 className="section-title mt-5">{title}</h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">{prose}</p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Solution: numbered steps joined by a line (Process page pattern)    */
/* ------------------------------------------------------------------ */

function SolutionSection({
  eyebrow,
  title,
  steps,
  prose,
}: {
  eyebrow: string;
  title: string;
  steps: ProjectDetailSolution | undefined;
  prose: string | null | undefined;
}) {
  return (
    <section
      id="solution"
      className={cn("section-pad border-t border-border", ANCHOR_OFFSET_CLASS)}
    >
      <div className="site-container">
        <div className="reveal max-w-3xl">
          <SectionLabel>{eyebrow}</SectionLabel>
          <h2 className="section-title mt-5">{title}</h2>
          {steps?.intro ? (
            <p className="mt-6 text-lg leading-8 text-muted-foreground">{steps.intro}</p>
          ) : null}
          {!steps ? <p className="mt-6 text-lg leading-8 text-muted-foreground">{prose}</p> : null}
        </div>

        {steps ? (
          <>
            <ol className="mt-14 max-w-4xl">
              {steps.steps.map((step, index) => {
                const isLast = index === steps.steps.length - 1;
                return (
                  <li
                    key={step.title}
                    className={cn(
                      "reveal group relative grid grid-cols-[3rem_1fr] gap-4 sm:grid-cols-[3.5rem_1fr] sm:gap-6",
                      !isLast && "pb-8 sm:pb-10",
                    )}
                  >
                    {!isLast ? (
                      <span
                        className="absolute bottom-0 start-[calc(1.5rem-1px)] top-12 w-0.5 bg-accent sm:start-[calc(1.75rem-1px)] sm:top-14"
                        aria-hidden="true"
                      />
                    ) : null}
                    <span className="relative flex size-12 items-center justify-center rounded-full border-2 border-accent bg-background font-display text-xl text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground sm:size-14 sm:text-2xl">
                      {index + 1}
                    </span>
                    <article className="min-w-0 rounded-2xl border border-border bg-card p-6 transition-all group-hover:-translate-y-1 group-hover:border-hero-accent group-hover:shadow-lg sm:p-8">
                      <h3 className="font-display text-2xl text-foreground sm:text-3xl">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-base leading-7 text-muted-foreground">
                        {step.description}
                      </p>
                    </article>
                  </li>
                );
              })}
            </ol>
            {steps.note ? (
              <p className="reveal mt-12 max-w-4xl rounded-e-lg border-s-2 border-accent bg-secondary px-5 py-4 leading-7 text-foreground/80">
                {steps.note}
              </p>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Screenshots                                                         */
/* ------------------------------------------------------------------ */

function ScreenshotsSection({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: ProjectDetailGalleryItem[];
}) {
  return (
    <section
      id="screenshots"
      className={cn("section-pad border-t border-border bg-background", ANCHOR_OFFSET_CLASS)}
    >
      <div className="site-container">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2">
          {items.map((item) => (
            <figure className="reveal" key={item.src}>
              <div className="flex justify-center rounded-3xl border border-border bg-secondary px-6 py-10 sm:px-10 sm:py-14">
                <PhoneFrame src={item.src} alt={item.alt} className="w-full max-w-[19rem]" />
              </div>
              <figcaption className="mt-5 text-center text-sm italic text-muted-foreground">
                {item.caption ?? item.alt}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Role · Engineering · Technologies · Outcome                         */
/* ------------------------------------------------------------------ */

function ExtendedBlocks({
  role,
  engineering,
  technologies,
  technologiesEyebrow,
  technologiesTitle,
  outcome,
}: {
  role: (ExtendedBlock & { items: string[] }) | null;
  engineering: ExtendedBlock | null;
  technologies: string[];
  technologiesEyebrow: string;
  technologiesTitle: string;
  outcome: ExtendedBlock | null;
}) {
  const rows: { id: string; eyebrow: string; title: string; body: ReactNode }[] = [];

  if (role) {
    rows.push({
      id: "role",
      eyebrow: role.eyebrow,
      title: role.heading,
      body: (
        <ul className="grid gap-4">
          {role.items.map((item) => (
            <li className="flex items-start gap-3 leading-7 text-primary-foreground/85" key={item}>
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-hero-accent/15 text-hero-accent">
                <Check className="size-3.5" aria-hidden="true" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ),
    });
  }
  if (engineering) {
    rows.push({
      id: "engineering",
      eyebrow: engineering.eyebrow,
      title: engineering.heading,
      body: <p className="leading-7 text-primary-foreground/70">{engineering.paragraph}</p>,
    });
  }
  if (technologies.length > 0) {
    rows.push({
      id: "technologies",
      eyebrow: technologiesEyebrow,
      title: technologiesTitle,
      body: (
        <CaseStudyTagList
          items={technologies}
          className="flex flex-wrap gap-3"
          itemClassName="border-primary-foreground/15 bg-primary-foreground/5 text-primary-foreground"
        />
      ),
    });
  }
  if (outcome) {
    rows.push({
      id: "outcome",
      eyebrow: outcome.eyebrow,
      title: outcome.heading,
      body: <p className="leading-7 text-primary-foreground/70">{outcome.paragraph}</p>,
    });
  }

  return (
    <section className="bg-primary py-20 text-primary-foreground lg:py-28">
      <div className="page-container">
        {rows.map((row, index) => (
          <article
            key={row.id}
            id={row.id}
            className={cn(
              "service-detail reveal border-primary-foreground/15",
              ANCHOR_OFFSET_CLASS,
            )}
          >
            <div className="flex items-center gap-4 lg:block">
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-hero-accent font-mono text-xs font-bold text-primary shadow-sm">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="eyebrow text-hero-accent lg:mt-4">{row.eyebrow}</p>
            </div>
            <h2 className="font-display text-3xl leading-tight text-primary-foreground sm:text-4xl">
              {row.title}
            </h2>
            <div className="text-primary-foreground/70">{row.body}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
