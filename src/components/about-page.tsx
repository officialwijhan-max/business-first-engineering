import { Link } from "@tanstack/react-router";
import { servicesAr } from "@/lib/plural-ar";
import {
  ArrowRight,
  Building2,
  Linkedin,
  Rocket,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DirectionMark,
  HERO_CONTAINER_CLASS,
  HERO_SECTION_CLASS,
  HeroBadge,
  ValueCard,
} from "@/components/page-elements";
import { GetStartedSection } from "@/components/get-started-section";
import { RegionalPresenceSection } from "@/components/regional-presence-section";
import { Button } from "@/components/ui/button";
import { PillButton } from "@/components/ui/pill-button";
import { useServices } from "@/hooks/use-services";
import { basedIn, foundedYear, team } from "@/content/about";
import { resolveServiceIcon } from "@/lib/icons";
import type { Locale, Service } from "@/api/types";

/**
 * The About page, shared by /about and /ar/about (same pattern as
 * services-page.tsx / work-page.tsx: one component, a `locale` prop, no
 * forked EN/AR copies). Team and office data come from src/content/about.ts
 * — nothing here is invented, and optional facts simply don't render when
 * that file doesn't have them yet.
 */
export function AboutPage({ locale }: { locale: Locale }) {
  const arabic = locale === "ar";
  const { data: services } = useServices(locale);

  return (
    <>
      <HeroSection arabic={arabic} serviceCount={services?.length ?? 0} />
      <MandateSection arabic={arabic} services={services ?? []} />
      <PrinciplesSection arabic={arabic} />
      <WhoWeServeSection arabic={arabic} />
      <LeadershipSection arabic={arabic} />
      <RegionalPresenceSection sectionId="regional-presence" arabic={arabic} />

      {/* FUTURE OPTIONAL SLOT: keep client/logo and stats config arrays empty.
          When verified entries exist, render <StatsBar /> and <ClientLogos /> here. */}

      <GetStartedSection
        locale={locale}
        defaultTab="partnership"
        eyebrow={arabic ? "شراكة استراتيجية" : "Strategic partnership"}
        heading={arabic ? "لنبدأ الحوار." : "Start a Conversation."}
        cardTitle={arabic ? "لنستكشف العمل معًا" : "Let's Explore Working Together"}
        cardParagraph={
          arabic
            ? "تحدث مع فريقنا عن الشراكات والتعاون والمشاريع طويلة المدى."
            : "Talk with our team about partnerships, collaborations, and long-term projects."
        }
        submitLabel={arabic ? "ابدأ الحوار" : "Start the Conversation"}
      />
    </>
  );
}

function HeroSection({ arabic, serviceCount }: { arabic: boolean; serviceCount: number }) {
  return (
    <section className={HERO_SECTION_CLASS}>
      <div
        className={cn(
          "relative page-container grid gap-14 lg:grid-cols-[1.15fr_.85fr] lg:items-center",
          HERO_CONTAINER_CLASS,
        )}
      >
        <div className="reveal">
          <HeroBadge>{arabic ? "عن وجهان" : "About Wijhan"}</HeroBadge>
          <h1 className="mt-6 max-w-2xl font-display text-[2.5rem] leading-[.98] sm:text-6xl lg:text-7xl">
            {arabic ? (
              <>
                شريكك الهندسي لبناء المنتجات الرقمية{" "}
                <span className="text-hero-accent">للشركات الطموحة.</span>
              </>
            ) : (
              <>
                The Product Engineering Partner for{" "}
                <span className="text-hero-accent">Ambitious Businesses.</span>
              </>
            )}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            {arabic
              ? "تساعد وجهان المؤسسين والشركات على تحويل مشكلات العمل الحقيقية إلى منتجات رقمية مصممة جيدًا وقابلة للتوسع، من الفكرة الأولى إلى نظام يدير عملياتك."
              : "Wijhan helps founders and businesses turn real business problems into well-designed, scalable digital products, from the first idea to a system that runs your operations."}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-hero-accent text-primary hover:bg-hero-accent/90"
            >
              <a href="#mandate">
                {arabic ? "استكشف منهجنا" : "Explore Our Approach"}
                <ArrowRight className="rtl-mirror" aria-hidden="true" />
              </a>
            </Button>
            <PillButton asChild variant="outline" tone="dark" size="lg">
              <a href="#start">{arabic ? "اعمل معنا" : "Work With Us"}</a>
            </PillButton>
          </div>
        </div>

        <div className="reveal relative overflow-hidden rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 backdrop-blur sm:p-8">
          <DirectionMark className="absolute end-[-7rem] top-[-7rem] w-[min(85vw,30rem)] opacity-30" />
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-primary-foreground/20" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-widest text-hero-accent">
                {arabic ? "نبذة سريعة" : "Company at a glance"}
              </p>
            </div>
            <div className="mt-7 divide-y divide-primary-foreground/10">
              <GlanceRow
                label={arabic ? "الخدمات" : "Services"}
                value={arabic ? servicesAr(serviceCount) : `${serviceCount} services`}
              />
              <GlanceRow
                label={arabic ? "المنهجية" : "Approach"}
                value={arabic ? "منهجية Agile بدورات أسبوعين" : "Agile, 2-week sprints"}
              />
              <GlanceRow
                label={arabic ? "اللغات" : "Languages"}
                value={
                  arabic ? "العربية والإنجليزية مع دعم أصيل للكتابة من اليمين إلى اليسار" : "Arabic & English, RTL-native"
                }
              />
              {foundedYear ? (
                <GlanceRow label={arabic ? "التأسيس" : "Founded"} value={String(foundedYear)} />
              ) : null}
              {basedIn ? (
                <GlanceRow
                  label={arabic ? "المقر" : "Based in"}
                  value={arabic ? basedIn.ar : basedIn.en}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GlanceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-20 items-center justify-between gap-4 py-5 sm:gap-6">
      <span className="text-sm text-primary-foreground/55">{label}</span>
      <span className="max-w-[13rem] text-end text-sm font-semibold text-primary-foreground">
        {value}
      </span>
    </div>
  );
}

function MandateSection({ arabic, services }: { arabic: boolean; services: Service[] }) {
  return (
    <section id="mandate" className="scroll-mt-(--header-h) bg-background py-20 lg:py-28">
      <div
        className={cn(
          "page-container grid gap-12 md:items-center md:gap-10 lg:gap-16",
          services.length > 0 && "md:grid-cols-2",
        )}
      >
        <div className="reveal min-w-0">
          <div className="flex items-center gap-2">
            <span className="h-px w-6 bg-border" aria-hidden="true" />
            <p className="text-xs font-bold uppercase tracking-widest text-hero-accent">
              {arabic ? "رسالتنا العملية" : "Operational mandate"}
            </p>
          </div>
          <h2 className="mt-5 font-display text-[1.75rem] leading-[1.1] tracking-tighter sm:text-[2.25rem] sm:leading-[1.08] md:text-[2.75rem] lg:text-[3.25rem] lg:leading-[1.05]">
            {arabic ? "نبني بعقلية العمل أولًا." : "Built Business First."}
          </h2>
          <div className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            <p className="border-s-2 border-hero-accent ps-4 font-medium text-foreground sm:ps-5">
              {arabic
                ? "لا نبني تطبيقات مؤقتة. وجهان شركة هندسة منتجات: نبدأ من مشكلة العمل ثم نكتب الكود."
                : "We don't build throwaway apps. Wijhan is a product engineering company: we start from the business problem and only then write the code."}
            </p>
            <p className="mt-6">
              {arabic
                ? "يشمل عملنا البرمجيات المخصصة وتطبيقات الموبايل والبوابات والمواقع وتصميم واجهات وتجربة المستخدم وتكامل الأنظمة وحلول ERP، نصمّمها ونبنيها وندعمها بفريق واحد."
                : "Our work spans custom software, mobile apps, portals and websites, UI/UX design, system integration, and ERP solutions, designed, engineered, and supported by one team."}
            </p>
          </div>
          <PillButton asChild variant="outline" tone="light" size="lg" className="mt-8">
            <Link to={arabic ? "/ar/services" : "/services"}>
              {arabic ? "استكشف خدماتنا" : "Explore our services"}
              <ArrowRight className="size-4 rtl-mirror" aria-hidden="true" />
            </Link>
          </PillButton>
        </div>

        {services.length > 0 ? <ServicesPreviewCard arabic={arabic} services={services} /> : null}
      </div>
    </section>
  );
}

/** Condensed services grid — same icons and links as the header mega-menu. */
function ServicesPreviewCard({ arabic, services }: { arabic: boolean; services: Service[] }) {
  return (
    <div className="reveal min-w-0 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="flex items-center gap-2">
        <span className="h-px w-6 bg-border" aria-hidden="true" />
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {arabic ? "ما نقدّمه" : "What we do"}
        </p>
      </div>
      <ul className="mt-5 grid gap-2 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
        {services.map((service) => {
          const Icon = resolveServiceIcon(service.icon);
          return (
            <li key={service.id} className="min-w-0">
              <Link
                to={arabic ? "/ar/services/$slug" : "/services/$slug"}
                params={{ slug: service.slug }}
                className="group flex min-h-14 items-center gap-3 rounded-xl p-2 transition-colors hover:bg-accent/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-primary transition-colors group-hover:bg-accent/12 group-hover:text-accent">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1 text-[15px] font-semibold leading-snug text-primary transition-colors group-hover:text-accent">
                  {service.title}
                </span>
                <ArrowRight
                  className="size-4 shrink-0 text-muted-foreground opacity-0 rtl-mirror transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                  aria-hidden="true"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const principlesEn = [
  {
    number: "01",
    title: "Business First",
    copy: "Every technical decision starts from your business goals, so the software solves real problems instead of adding complexity.",
  },
  {
    number: "02",
    title: "Built to Scale",
    copy: "Architectures designed to grow with your users, data, and traffic without a rewrite.",
  },
  {
    number: "03",
    title: "Quality Engineering",
    copy: "Code reviews, automated and manual testing, and QA on every release, so what ships is reliable.",
  },
  {
    number: "04",
    title: "Arabic-First Expertise",
    copy: "Native Arabic and RTL experiences designed from day one, with a deep understanding of regional business realities.",
  },
];

const principlesAr = [
  {
    number: "01",
    title: "العمل أولًا",
    copy: "كل قرار تقني يبدأ من أهداف عملك، ليحل البرنامج مشكلات حقيقية بدل أن يضيف تعقيدًا.",
  },
  {
    number: "02",
    title: "مبني ليتوسع",
    copy: "معماريات تنمو مع مستخدميك وبياناتك وزياراتك دون إعادة بناء.",
  },
  {
    number: "03",
    title: "هندسة بجودة عالية",
    copy: "مراجعات كود واختبارات آلية ويدوية وضمان جودة في كل إصدار، ليكون ما نسلّمه موثوقًا.",
  },
  {
    number: "04",
    title: "خبرة عربية أصيلة",
    copy: "تجارب عربية أصيلة بالكتابة من اليمين إلى اليسار من اليوم الأول، مع فهم عميق لواقع الأعمال في المنطقة.",
  },
];

function PrinciplesSection({ arabic }: { arabic: boolean }) {
  const principles = arabic ? principlesAr : principlesEn;
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="page-container">
        <div className="reveal max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-widest text-hero-accent">
            {arabic ? "مبادئ العمل" : "Operating principles"}
          </p>
          <h2 className="mt-5 font-display text-[1.75rem] leading-[1.1] tracking-tighter sm:text-[2.25rem] sm:leading-[1.08] md:text-[2.75rem] lg:text-[3.25rem] lg:leading-[1.05]">
            {arabic ? "كيف نبني المنتجات الرقمية." : "How We Engineer Digital Products."}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            {arabic
              ? "الانضباطات التي تحكم كل مشروع نسلّمه."
              : "The disciplines behind every project we deliver."}
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          <article className="reveal rounded-2xl border border-border border-t-4 border-t-accent bg-card p-6 shadow-sm sm:p-8">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
              {arabic ? "رسالتنا" : "Mission"}
            </p>
            <p className="mt-5 font-display text-xl leading-snug text-foreground sm:text-2xl">
              {arabic
                ? "مساعدة المؤسسين والشركات على تحويل مشكلات العمل الحقيقية إلى منتجات رقمية مصممة جيدًا وقابلة للتوسع."
                : "To help founders and businesses turn real business problems into well-designed, scalable digital products."}
            </p>
          </article>
          <article className="reveal rounded-2xl border border-border border-t-4 border-t-hero-accent bg-card p-6 shadow-sm sm:p-8">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-hero-accent">
              <span className="size-1.5 rounded-full bg-hero-accent" aria-hidden="true" />
              {arabic ? "رؤيتنا" : "Vision"}
            </p>
            <p className="mt-5 font-display text-xl leading-snug text-foreground sm:text-2xl">
              {arabic
                ? "أن نكون الشريك الهندسي الأكثر ثقة للشركات في المنطقة."
                : "To be the most trusted product engineering partner for businesses across the region."}
            </p>
          </article>
        </div>

        <div className="mt-14">
          <div className="mb-6 flex items-center gap-2">
            <span className="h-px w-6 bg-border" aria-hidden="true" />
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {arabic ? "قيمنا" : "Our Values"}
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((principle) => (
              <ValueCard
                key={principle.number}
                number={principle.number}
                title={principle.title}
                copy={principle.copy}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const audiencesEn: { icon: LucideIcon; title: string; copy: string }[] = [
  {
    icon: Rocket,
    title: "Founders & Startups",
    copy: "From idea to MVP to a product ready to scale.",
  },
  {
    icon: TrendingUp,
    title: "Growing Businesses",
    copy: "Internal systems, automation, and ERP that replace spreadsheets.",
  },
  {
    icon: Building2,
    title: "Established Companies",
    copy: "Modernization, integration, and customer portals on top of existing systems.",
  },
  {
    icon: Users,
    title: "Product Teams",
    copy: "Extra engineering, design, and QA capacity for teams that need to ship faster.",
  },
];

const audiencesAr: { icon: LucideIcon; title: string; copy: string }[] = [
  {
    icon: Rocket,
    title: "المؤسسون والشركات الناشئة",
    copy: "من الفكرة إلى MVP إلى منتج جاهز للنمو.",
  },
  {
    icon: TrendingUp,
    title: "الشركات النامية",
    copy: "أنظمة داخلية وأتمتة وERP تحلّ محل الجداول.",
  },
  {
    icon: Building2,
    title: "الشركات الراسخة",
    copy: "تحديث وتكامل وبوابات عملاء فوق أنظمتك القائمة.",
  },
  {
    icon: Users,
    title: "فرق المنتجات",
    copy: "قدرة هندسية وتصميمية وجودة إضافية للفرق التي تحتاج إلى إطلاق أسرع.",
  },
];

function WhoWeServeSection({ arabic }: { arabic: boolean }) {
  const audiences = arabic ? audiencesAr : audiencesEn;
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="page-container">
        <div className="reveal max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-widest text-hero-accent">
            {arabic ? "من نخدم" : "Who we serve"}
          </p>
          <h2 className="mt-5 font-display text-[1.75rem] leading-[1.1] tracking-tighter sm:text-[2.25rem] sm:leading-[1.08] md:text-[2.75rem] lg:text-[3.25rem] lg:leading-[1.05]">
            {arabic ? "مبنية للشركات في كل مرحلة." : "Built for Businesses at Every Stage."}
          </h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((audience) => {
            const Icon = audience.icon;
            return (
              <article
                key={audience.title}
                className="reveal group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg sm:p-8"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-6 font-display text-xl text-foreground">{audience.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{audience.copy}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function LeadershipSection({ arabic }: { arabic: boolean }) {
  if (team.length === 0) return null;
  const founders = team.filter((member) => member.tier === "founder");
  const leads = team.filter((member) => member.tier === "lead");

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="page-container">
        <div className="reveal max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="h-px w-6 bg-border" aria-hidden="true" />
            <p className="text-xs font-bold uppercase tracking-widest text-hero-accent">
              {arabic ? "القيادة" : "Leadership"}
            </p>
          </div>
          <h2 className="mt-5 font-display text-[1.75rem] leading-[1.1] tracking-tighter sm:text-[2.25rem] sm:leading-[1.08] md:text-[2.75rem] lg:text-[3.25rem] lg:leading-[1.05]">
            {arabic ? "قيادة هندسية على مستوى المؤسسات" : "Enterprise Engineering Leadership"}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            {arabic
              ? "بقيادة مهندسين ذوي خبرة في هندسة البرمجيات والذكاء الاصطناعي وتطوير تطبيقات الموبايل. يدعمهم فريق هندسي متخصص مقرّه مصر."
              : "Directed by experienced engineers across software architecture, AI, and mobile development. Supported by a specialized engineering team based in Egypt."}
          </p>
        </div>

        {founders.length > 0 ? (
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {founders.map((member) => (
              <article
                key={member.name.en}
                className="reveal relative overflow-hidden rounded-2xl border-2 border-accent bg-card p-6 sm:p-10"
              >
                <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent">
                  {arabic ? "شريك مؤسس" : "Co-Founder"}
                </span>
                <div className="mt-6 flex items-center gap-4 sm:gap-5">
                  <MemberAvatar member={member} arabic={arabic} size="lg" />
                  <div className="min-w-0">
                    <p className="font-display text-xl text-foreground sm:text-2xl">
                      {arabic ? member.name.ar : member.name.en}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-accent">
                      {arabic ? member.role.ar : member.role.en}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {leads.length > 0 ? (
          <div className={cn("grid gap-5 md:grid-cols-3", founders.length > 0 ? "mt-6" : "mt-14")}>
            {leads.map((member) => (
              <article
                key={member.name.en}
                className="reveal group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg"
              >
                <MemberAvatar member={member} arabic={arabic} size="sm" />
                <p className="mt-4 font-display text-lg text-foreground">
                  {arabic ? member.name.ar : member.name.en}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {arabic ? member.role.ar : member.role.en}
                </p>
              </article>
            ))}
          </div>
        ) : null}

        {team.length > 1 ? (
          <p className="reveal mt-10 max-w-2xl text-sm leading-6 text-muted-foreground">
            {arabic
              ? "يدعمهم فريق أوسع من المهندسين والمصممين والمتخصصين خلف كل مشروع."
              : "Supported by a wider team of engineers, designers, and specialists behind every project."}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function MemberAvatar({
  member,
  arabic,
  size,
}: {
  member: { name: { en: string; ar: string }; initials: string; photo?: string; linkedin?: string };
  arabic: boolean;
  size: "sm" | "lg";
}) {
  const dimension = size === "lg" ? "size-16 text-lg sm:size-20 sm:text-xl" : "size-14 text-base";
  const name = arabic ? member.name.ar : member.name.en;
  const avatar = member.photo ? (
    <img
      src={member.photo}
      alt={name}
      loading="lazy"
      className={`${dimension} shrink-0 rounded-full object-cover`}
    />
  ) : (
    <span
      className={`flex ${dimension} shrink-0 items-center justify-center rounded-full bg-accent/10 font-display font-semibold text-accent`}
      aria-hidden="true"
    >
      {member.initials}
    </span>
  );

  if (!member.linkedin) return avatar;

  return (
    <span className="relative inline-flex shrink-0">
      {avatar}
      <a
        href={member.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={arabic ? `${name} على لينكدإن` : `${name} on LinkedIn`}
        className="absolute -end-1 -bottom-1 flex size-5 items-center justify-center rounded-full border border-border bg-background text-accent after:absolute after:-inset-3 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <Linkedin className="size-3" aria-hidden="true" />
      </a>
    </span>
  );
}
