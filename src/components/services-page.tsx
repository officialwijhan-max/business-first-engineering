import { Link } from "@tanstack/react-router";
import { servicesAr } from "@/lib/plural-ar";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  DataState,
  DirectionMark,
  HERO_CONTAINER_CLASS,
  HERO_SECTION_CLASS,
  HeroBadge,
} from "@/components/page-elements";
import { cn } from "@/lib/utils";
import { GetStartedSection } from "@/components/get-started-section";
import { Button } from "@/components/ui/button";
import { PillButton } from "@/components/ui/pill-button";
import { useServices } from "@/hooks/use-services";
import { ServiceCard } from "@/components/service-card";
import type { Locale } from "@/api/types";

const deliveryStages = {
  en: [
    {
      number: "01",
      title: "Requirements",
      owner: "Product Owner",
      description: "Goals, scope, and priorities agreed before any code.",
    },
    {
      number: "02",
      title: "Design",
      owner: "Product Designer",
      description: "Flows, wireframes, and interfaces validated early.",
    },
    {
      number: "03",
      title: "Build",
      owner: "Developer",
      description: "Sprint-based engineering with code reviews.",
    },
    {
      number: "04",
      title: "Test",
      owner: "QA Engineer",
      description: "Automated and manual testing before every release.",
    },
    {
      number: "05",
      title: "Deploy",
      owner: "Developer",
      description: "Controlled release, monitoring, and handover.",
    },
  ],
  ar: [
    {
      number: "01",
      title: "المتطلبات",
      owner: "مالك المنتج",
      description: "الأهداف والنطاق والأولويات قبل أي كود.",
    },
    {
      number: "02",
      title: "التصميم",
      owner: "مصمم المنتج",
      description: "مسارات ومخططات أولية (wireframes) وواجهات يتم التحقق منها مبكرًا.",
    },
    {
      number: "03",
      title: "البناء",
      owner: "المطوّر",
      description: "هندسة بدورات سبرنت مع مراجعات كود.",
    },
    {
      number: "04",
      title: "الاختبار",
      owner: "مهندس الجودة",
      description: "اختبارات آلية ويدوية قبل كل إصدار.",
    },
    {
      number: "05",
      title: "النشر",
      owner: "المطوّر",
      description: "إطلاق مضبوط ومراقبة وتسليم.",
    },
  ],
} as const;

export function ServicesPage({ locale }: { locale: Locale }) {
  const arabic = locale === "ar";
  const { data: services, isLoading, isError } = useServices(locale);
  const stages = deliveryStages[locale];

  return (
    <>
      <section className={HERO_SECTION_CLASS}>
        <div
          className={cn(
            "page-container grid gap-14 lg:grid-cols-[1.08fr_.92fr] lg:items-center",
            HERO_CONTAINER_CLASS,
          )}
        >
          <div className="reveal">
            <HeroBadge>{arabic ? "خدماتنا" : "Our Services"}</HeroBadge>
            <h1 className="mt-6 max-w-3xl font-display text-[2.5rem] leading-[.98] sm:text-6xl md:text-7xl xl:text-8xl">
              {arabic ? "هندسة مبنية حول" : "Engineering Built Around"}
              <br />
              <span className="text-hero-accent">{arabic ? "عملك." : "Your Business."}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              {arabic
                ? "نصمّم ونبني ونربط ونطوّر المنتجات الرقمية التي تعتمد عليها الشركات النامية."
                : "We design, build, integrate, and scale the digital products that growing businesses depend on."}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-hero-accent text-primary hover:bg-hero-accent/90"
              >
                <a href="#capabilities">
                  {arabic ? "استكشف قدراتنا" : "Explore Our Capabilities"}
                  <ArrowRight className="rtl-mirror" aria-hidden="true" />
                </a>
              </Button>
              <PillButton asChild variant="outline" tone="dark" size="lg">
                <Link to={arabic ? "/ar/work" : "/work"}>
                  {arabic ? "شاهد أعمالنا" : "View Our Work"}
                  <ArrowUpRight className="rtl-mirror" aria-hidden="true" />
                </Link>
              </PillButton>
            </div>
          </div>

          <div className="reveal relative overflow-hidden rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 backdrop-blur sm:p-8">
            <DirectionMark className="absolute end-[-7rem] top-[-7rem] w-[min(85vw,30rem)] opacity-30" />
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-widest text-hero-accent">
                {arabic ? "خريطة القدرات" : "Capability map"}
              </p>
              <div className="mt-7 divide-y divide-primary-foreground/10">
                <CapabilityRow
                  label={arabic ? "مجالات القدرات" : "Capability areas"}
                  value={
                    arabic ? servicesAr(services?.length ?? 0) : `${services?.length ?? 0} services`
                  }
                />
                <CapabilityRow
                  label={arabic ? "منهجية التسليم" : "Delivery approach"}
                  value={arabic ? "منهجية Agile بدورات أسبوعين" : "Agile, 2-week sprints"}
                />
                <CapabilityRow
                  label={arabic ? "اللغات" : "Languages"}
                  value={
                    arabic ? "العربية والإنجليزية، مع دعم أصيل للكتابة من اليمين إلى اليسار" : "Arabic & English, RTL-native"
                  }
                />
                <CapabilityRow
                  label={arabic ? "بعد الإطلاق" : "After launch"}
                  value={arabic ? "صيانة ودعم مستمر" : "Ongoing maintenance & support"}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="capabilities" className="scroll-mt-(--header-h) bg-background py-20 lg:py-28">
        <div className="page-container">
          <div className="reveal max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-widest text-hero-accent">
              {arabic ? "ماذا نقدم" : "What we do"}
            </p>
            <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {arabic ? "منتجات رقمية، مبنية للنمو." : "Digital products, built for growth."}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              {arabic
                ? "مجموعة خدمات مترابطة، نصمّمها ونبنيها وندعمها بفريق واحد."
                : "A connected set of services, designed, engineered, and supported by one team."}
            </p>
          </div>

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
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="page-container">
          <div className="reveal grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-hero-accent">
                {arabic ? "نموذج التسليم" : "Delivery model"}
              </p>
              <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
                {arabic ? "مبنية لتسليم واثق." : "Built for Confident Delivery."}
              </h2>
            </div>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground lg:justify-self-end">
              {arabic
                ? "دورة هندسية واضحة تركّز على الجودة، تقلّل المخاطر وتجعل كل إصدار متوقعًا."
                : "A clear, quality-driven engineering lifecycle that reduces risk and keeps every release predictable."}
            </p>
          </div>
          <PillButton asChild variant="outline" tone="light" size="lg" className="mt-9">
            <a href="#start">
              {arabic ? "اطلب استشارة" : "Request a Consultation"}
              <ArrowRight className="size-4 rtl-mirror" aria-hidden="true" />
            </a>
          </PillButton>

          <div className="mt-16">
            <div className="relative mx-[calc(var(--gutter)*-1)] overflow-x-auto px-(--gutter) pb-4 lg:mx-0 lg:overflow-visible lg:px-0">
              <div className="pointer-events-none absolute start-[10%] end-[10%] top-6 hidden h-px bg-border lg:block" />
              <ol className="flex min-w-max snap-x snap-mandatory gap-5 lg:grid lg:min-w-0 lg:grid-cols-5 lg:gap-6">
                {stages.map((stage) => (
                  <li
                    key={stage.number}
                    className="reveal w-[min(82vw,20rem)] snap-start lg:w-auto"
                  >
                    <div className="relative z-10 flex size-12 items-center justify-center rounded-full bg-hero-accent font-display text-lg text-primary">
                      {stage.number}
                    </div>
                    <h3 className="mt-6 font-display text-2xl text-foreground">{stage.title}</h3>
                    <p className="mt-2 text-sm font-semibold text-accent">{stage.owner}</p>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {stage.description}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="mt-2 flex justify-center gap-2 lg:hidden" aria-hidden="true">
              {stages.map((stage, index) => (
                <span
                  key={stage.number}
                  className={
                    index === 0 ? "size-2 rounded-full bg-accent" : "size-2 rounded-full bg-border"
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FUTURE OPTIONAL SLOT: const futureStatsAndClients = [];
          When verified entries exist, render <StatsBar /> and <ClientLogos /> here. */}

      <GetStartedSection locale={locale} includeOtherService />
    </>
  );
}

function CapabilityRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-20 items-center justify-between gap-4 py-5 sm:gap-6">
      <span className="text-sm text-primary-foreground/55">{label}</span>
      <span className="max-w-[13rem] text-end text-sm font-semibold text-primary-foreground">
        {value}
      </span>
    </div>
  );
}
