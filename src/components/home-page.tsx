import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  DataState,
  DirectionMark,
  HERO_CONTAINER_CLASS,
  HERO_SECTION_CLASS,
  HeroGraphic,
  HeroBadge,
  ValueCard,
} from "@/components/page-elements";
import { cn } from "@/lib/utils";
import { GetStartedSection } from "@/components/get-started-section";
import { RegionalPresenceSection } from "@/components/regional-presence-section";
import { ServiceCard } from "@/components/service-card";
import { EmptyProjectsState, ProjectCard } from "@/components/project-listing";
import { Button } from "@/components/ui/button";
import { PillButton } from "@/components/ui/pill-button";
import { useServices } from "@/hooks/use-services";
import { useWork } from "@/hooks/use-work";
import { resolveServiceIcon } from "@/lib/icons";
import { processSteps } from "@/lib/site-data";
import { processStepsAr } from "@/lib/site-data-ar";
import type { CaseStudy, Locale } from "@/api/types";

/**
 * The homepage, shared by / and /ar (same one-component, `locale`-prop
 * pattern as about-page.tsx / services-page.tsx). Every section renders real
 * Wijhan data — services and projects from the API, process phases from
 * site-data — and nothing numeric or client-related is invented.
 */

const valueCards = {
  en: [
    ["Business-First Architecture", "Every technical decision starts from your business goals."],
    ["Arabic-First & RTL Native", "Built for the region from day one, not retrofitted."],
    ["Full-Stack Capability", "From product design to ERP, one team handles it all."],
    [
      "Direct, Responsive Delivery",
      "A small, senior team you talk to directly, not layers of account managers.",
    ],
  ],
  ar: [
    ["معمارية تبدأ من عملك", "كل قرار تقني يبدأ من أهداف عملك."],
    ["عربية أولًا ودعم أصيل للكتابة من اليمين إلى اليسار", "مبني للمنطقة من اليوم الأول، لا معدّل لاحقًا."],
    ["قدرة متكاملة من التصميم إلى ERP", "من تصميم المنتج إلى أنظمة ERP، فريق واحد يتولى كل شيء."],
    [
      "تسليم مباشر وسريع الاستجابة",
      "فريق صغير من الخبراء تتحدث معه مباشرة، دون طبقات من مديري الحسابات.",
    ],
  ],
} as const;

/** Featured-flagged projects first, then the rest in API order. */
function pickHomeProjects(projects: CaseStudy[], count: number) {
  return [
    ...projects.filter((project) => project.featured),
    ...projects.filter((project) => !project.featured),
  ].slice(0, count);
}

export function HomePage({ locale }: { locale: Locale }) {
  const arabic = locale === "ar";
  return (
    <>
      <HeroSection locale={locale} />
      <WhatWeDoSection locale={locale} />
      <HowWeWorkSection arabic={arabic} />
      <FeaturedWorkSection locale={locale} />
      <WhyWijhanSection arabic={arabic} />

      {/* FUTURE OPTIONAL SLOT: const verifiedStats = [];
          When verified figures exist, render <StatsBar /> here. Do not add
          placeholder numbers (uptime %, years, client counts). */}

      <RegionalPresenceSection sectionId="regional-presence" arabic={arabic} />
      <GetStartedSection locale={locale} includeOtherService />
    </>
  );
}

function SectionIntro({ label, title, copy }: { label: string; title: ReactNode; copy?: string }) {
  return (
    <div className="reveal grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-hero-accent">{label}</p>
        <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
          {title}
        </h2>
      </div>
      {copy ? (
        <p className="max-w-xl text-lg leading-8 text-muted-foreground lg:justify-self-end">
          {copy}
        </p>
      ) : null}
    </div>
  );
}

function HeroSection({ locale }: { locale: Locale }) {
  const arabic = locale === "ar";
  const { data: services } = useServices(locale);
  const hasServices = Boolean(services && services.length > 0);

  return (
    <section className={HERO_SECTION_CLASS}>
      {/* On desktop the HeroGraphic fallback takes over when there are no services to show. */}
      <DirectionMark
        className={cn(
          "pointer-events-none absolute end-[-10rem] top-[-10rem] w-[min(80vw,36rem)] opacity-20",
          !hasServices && "lg:hidden",
        )}
      />
      <div
        className={cn(
          "relative page-container grid gap-14 lg:grid-cols-[1.1fr_.9fr] lg:items-center",
          HERO_CONTAINER_CLASS,
        )}
      >
        <div className="reveal">
          <HeroBadge>{arabic ? "شركة هندسة منتجات" : "Product Engineering Company"}</HeroBadge>
          <h1
            className={cn(
              "mt-6 max-w-3xl font-display text-[2.75rem] sm:text-6xl md:text-7xl xl:text-8xl",
              arabic ? "leading-[1.1]" : "leading-[.98]",
            )}
          >
            {arabic ? "عملك أولًا." : "Your business first."}
            <br />
            <span className="text-hero-accent">{arabic ? "ثم الكود." : "Then the code."}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            {arabic
              ? "تساعد وجهان المؤسسين والشركات على تحويل مشكلات العمل الحقيقية إلى منتجات رقمية مصممة جيدًا وقابلة للتوسع."
              : "Wijhan helps founders and businesses turn real business problems into well-designed, scalable digital products."}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-hero-accent text-primary hover:bg-hero-accent/90"
            >
              <Link to={arabic ? "/ar/contact" : "/contact"} hash="start">
                {arabic ? "ابدأ مشروعك" : "Start a Project"}
                <ArrowRight className="rtl-mirror" aria-hidden="true" />
              </Link>
            </Button>
            <PillButton asChild variant="outline" tone="dark" size="lg">
              <Link to={arabic ? "/ar/work" : "/work"}>
                {arabic ? "شاهد أعمالنا" : "View Our Work"}
                <ArrowUpRight className="rtl-mirror" aria-hidden="true" />
              </Link>
            </PillButton>
          </div>
        </div>

        {services && services.length > 0 ? (
          <nav
            aria-label={arabic ? "خدماتنا" : "Our services"}
            className="reveal grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2"
          >
            {services.map((service) => {
              const Icon = resolveServiceIcon(service.icon);
              return (
                <Link
                  key={service.id}
                  to={arabic ? "/ar/services/$slug" : "/services/$slug"}
                  params={{ slug: service.slug }}
                  className="group flex min-h-28 min-w-0 flex-col justify-between gap-4 rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-4 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-hero-accent sm:p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-accent"
                >
                  <span className="flex size-10 items-center justify-center rounded-lg bg-hero-accent/15 text-hero-accent">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold leading-5 text-primary-foreground transition-colors group-hover:text-hero-accent">
                    {service.title}
                  </span>
                </Link>
              );
            })}
          </nav>
        ) : (
          <HeroGraphic />
        )}
      </div>
    </section>
  );
}

function WhatWeDoSection({ locale }: { locale: Locale }) {
  const arabic = locale === "ar";
  const { data: services, isLoading, isError } = useServices(locale);

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="page-container">
        <SectionIntro
          label={arabic ? "ماذا نقدم" : "What we do"}
          title={
            arabic ? "كل ما يحتاجه منتجك، بفريق واحد." : "Everything Your Product Needs, One Team."
          }
        />
        <DataState
          isLoading={isLoading}
          isError={isError}
          isEmpty={!isLoading && !isError && (services?.length ?? 0) === 0}
          loadingLabel={arabic ? "جارٍ تحميل الخدمات…" : "Loading services…"}
          errorLabel={
            arabic
              ? "تعذّر تحميل الخدمات حالًا. يرجى المحاولة مرة أخرى بعد قليل."
              : "We couldn't load our services right now. Please try again shortly."
          }
          emptyLabel={arabic ? "لا توجد خدمات منشورة بعد." : "No services are published yet."}
        />
        {services && services.length > 0 ? (
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} locale={locale} />
            ))}
          </div>
        ) : null}
        <PillButton asChild variant="outline" tone="light" size="lg" className="mt-10">
          <Link to={arabic ? "/ar/services" : "/services"}>
            {arabic ? "عرض كل الخدمات" : "View All Services"}
            <ArrowRight className="size-4 rtl-mirror" aria-hidden="true" />
          </Link>
        </PillButton>
      </div>
    </section>
  );
}

function HowWeWorkSection({ arabic }: { arabic: boolean }) {
  const steps = arabic ? processStepsAr : processSteps;
  const processPath = arabic ? "/ar/process" : "/process";

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="page-container">
        <SectionIntro
          label={arabic ? "كيف نعمل" : "How we work"}
          title={arabic ? "نفهم أولًا. ثم نبني." : "Understand First. Build Second."}
          copy={
            arabic
              ? "عملية واضحة تقلل المخاطر وتربط كل قرار بهدف عملك."
              : "A clear product process that reduces risk and keeps every decision connected to your business goals."
          }
        />
        <div className="relative mx-[calc(var(--gutter)*-1)] mt-16 overflow-x-auto px-(--gutter) pb-4 sm:mx-0 sm:overflow-visible sm:px-0">
          <div
            className="pointer-events-none absolute start-[8%] end-[8%] top-6 hidden h-px bg-border lg:block"
            aria-hidden="true"
          />
          <ol className="flex min-w-max gap-4 sm:grid sm:min-w-0 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-6">
            {steps.map(([number, title]) => (
              <li key={number} className="reveal w-32 sm:w-auto">
                <Link
                  to={processPath}
                  className="group flex flex-col items-start gap-4 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:items-center lg:text-center"
                >
                  <span className="relative z-10 flex size-12 items-center justify-center rounded-full bg-hero-accent font-display text-lg text-primary transition-transform group-hover:scale-105">
                    {number}
                  </span>
                  <span className="font-display text-2xl text-foreground transition-colors group-hover:text-accent">
                    {title}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
        <PillButton asChild variant="outline" tone="light" size="lg" className="mt-10">
          <Link to={processPath}>
            {arabic ? "اطّلع على منهجيتنا كاملة" : "See Our Full Process"}
            <ArrowRight className="size-4 rtl-mirror" aria-hidden="true" />
          </Link>
        </PillButton>
      </div>
    </section>
  );
}

function FeaturedWorkSection({ locale }: { locale: Locale }) {
  const arabic = locale === "ar";
  const { data, isLoading, isError } = useWork(locale);
  const projects = pickHomeProjects(data?.case_studies ?? [], 3);

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="page-container">
        <SectionIntro
          label={arabic ? "أعمال مميزة" : "Featured work"}
          title={arabic ? "منتجات بنيناها." : "Products We've Built."}
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
        {projects.length > 0 ? (
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} locale={locale} />
            ))}
          </div>
        ) : null}
        <PillButton asChild variant="outline" tone="light" size="lg" className="mt-10">
          <Link to={arabic ? "/ar/work" : "/work"}>
            {arabic ? "عرض كل الأعمال" : "View All Work"}
            <ArrowRight className="size-4 rtl-mirror" aria-hidden="true" />
          </Link>
        </PillButton>
      </div>
    </section>
  );
}

function WhyWijhanSection({ arabic }: { arabic: boolean }) {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="page-container">
        <SectionIntro
          label={arabic ? "لماذا وجهان" : "Why Wijhan"}
          title={arabic ? "نبني بعقلية العمل أولًا." : "Built Business First."}
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {valueCards[arabic ? "ar" : "en"].map(([title, copy], index) => (
            <ValueCard key={title} number={`0${index + 1}`} title={title} copy={copy} />
          ))}
        </div>
      </div>
    </section>
  );
}
