import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpLeft, ArrowUpRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PillButton } from "@/components/ui/pill-button";
import {
  HeroGraphic,
  HERO_CONTAINER_CLASS,
  HERO_SECTION_CLASS,
  HeroBadge,
} from "@/components/page-elements";
import { cn } from "@/lib/utils";
import { GetStartedSection } from "@/components/get-started-section";
import { useServices } from "@/hooks/use-services";
import { resolveServiceIcon } from "@/lib/icons";
import { getServiceDetailContent, type ServiceDetailCopy } from "@/content/service-details";
import { NotFoundComponent } from "@/routes/__root";
import type { Locale } from "@/api/types";

export function ServiceDetailPage({ locale, slug }: { locale: Locale; slug: string }) {
  const arabic = locale === "ar";
  const { data: services, isLoading } = useServices(locale);
  const service = services?.find((item) => item.slug === slug);

  // Services finished loading and this slug isn't among them: unknown slug
  // falls through to the site's existing 404 page rather than a broken page.
  if (!isLoading && services && !service) {
    return <NotFoundComponent />;
  }
  if (!service) return null;

  const detail = getServiceDetailContent(slug);
  const copy = detail?.[locale];
  const otherServices = (services ?? []).filter((item) => item.slug !== slug);
  const Arrow = arabic ? ArrowUpLeft : ArrowUpRight;

  return (
    <>
      <HeroSection arabic={arabic} service={service} copy={copy} />
      {copy ? (
        <CapabilitiesSection
          arabic={arabic}
          cards={copy.capabilities}
          title={copy.capabilitiesTitle}
          subtitle={copy.capabilitiesSubtitle}
        />
      ) : null}
      {copy ? (
        <BenefitsSection
          arabic={arabic}
          cards={copy.benefits}
          title={copy.benefitsTitle}
          subtitle={copy.benefitsSubtitle}
        />
      ) : null}
      {copy ? (
        <ProcessSection arabic={arabic} steps={copy.process} title={copy.processTitle} />
      ) : null}
      <GetStartedSection locale={locale} service={service} />
      <OtherServicesSection arabic={arabic} services={otherServices} Arrow={Arrow} />
    </>
  );
}

function HeroSection({
  arabic,
  service,
  copy,
}: {
  arabic: boolean;
  service: { title: string; summary: string };
  copy: ServiceDetailCopy | undefined;
}) {
  return (
    <section className={cn("reveal", HERO_SECTION_CLASS)}>
      <div className={cn("page-container", HERO_CONTAINER_CLASS)}>
        <nav
          aria-label={arabic ? "مسار التنقل" : "Breadcrumb"}
          className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-primary-foreground/50"
        >
          <Link
            to={arabic ? "/ar" : "/"}
            className="inline-flex min-h-11 min-w-11 items-center hover:text-primary-foreground/80"
          >
            {arabic ? "الرئيسية" : "Home"}
          </Link>
          <ChevronRight className="rtl-mirror size-3.5" aria-hidden="true" />
          <Link
            to={arabic ? "/ar/services" : "/services"}
            className="inline-flex min-h-11 min-w-11 items-center hover:text-primary-foreground/80"
          >
            {arabic ? "خدماتنا" : "Services"}
          </Link>
          <ChevronRight className="rtl-mirror size-3.5" aria-hidden="true" />
          <span className="text-primary-foreground/70">{service.title}</span>
        </nav>
        <div className="mt-10 grid gap-14 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div>
            <HeroBadge>{copy?.heroLabel ?? service.title}</HeroBadge>
            <h1 className="mt-6 max-w-2xl font-display text-[2.5rem] leading-[.98] text-primary-foreground sm:text-6xl lg:text-7xl">
              {copy ? (
                <>
                  {copy.heroHeadlineLead}
                  <br />
                  <span className="text-hero-accent">{copy.heroHeadlineAccent}</span>
                </>
              ) : (
                service.title
              )}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-primary-foreground/70">
              {copy?.heroParagraph ?? service.summary}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-hero-accent text-primary hover:bg-hero-accent/90"
              >
                <Link to={arabic ? "/ar/contact" : "/contact"} hash="start">
                  {arabic ? "ابدأ مشروعك" : "Start a Project"}
                </Link>
              </Button>
              <PillButton asChild variant="outline" tone="dark" size="lg">
                <Link to={arabic ? "/ar/work" : "/work"}>
                  {arabic ? "شاهد أعمالنا" : "View Our Work"}
                </Link>
              </PillButton>
            </div>
          </div>
          <HeroGraphic className="lg:justify-center" />
        </div>
      </div>
    </section>
  );
}

function NumberedCard({
  index,
  title,
  description,
}: {
  index: number;
  title: string;
  description: string;
}) {
  return (
    <article className="reveal group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-hero-accent hover:shadow-lg sm:p-8">
      <span className="font-display text-3xl text-muted-foreground/40">
        {String(index).padStart(2, "0")}
      </span>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
    </article>
  );
}

function CapabilitiesSection({
  arabic,
  cards,
  title,
  subtitle,
}: {
  arabic: boolean;
  cards: { title: string; description: string }[];
  title?: string | undefined;
  subtitle?: string | undefined;
}) {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="page-container">
        <div className="reveal max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-hero-accent">
            {arabic ? "القدرات" : "Capabilities"}
          </p>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl">
            {title ?? (arabic ? "قدراتنا الهندسية." : "Engineering Capabilities.")}
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            {subtitle ??
              (arabic
                ? "الكفاءات الهندسية الأساسية وراء كل ما نسلّمه."
                : "The core engineering competencies behind everything we ship.")}
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <NumberedCard
              key={card.title}
              index={index + 1}
              title={card.title}
              description={card.description}
            />
          ))}
          {cards.length % 3 !== 0 ? (
            <a
              href="#start"
              className="reveal flex min-h-52 flex-col justify-between rounded-2xl bg-primary p-6 text-primary-foreground sm:p-8 transition-transform hover:-translate-y-1"
            >
              <span className="max-w-[12rem] font-display text-2xl leading-tight">
                {arabic ? "هل تحتاج إلى حل مخصص؟" : "Need something specific?"}
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-hero-accent">
                {arabic ? "تحدّث إلينا" : "Talk to us"}
                <ArrowRight className="rtl-mirror size-4" aria-hidden="true" />
              </span>
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function BenefitCard({ title, description }: { title: string; description: string }) {
  return (
    <article className="reveal group overflow-hidden rounded-2xl border border-border transition-shadow hover:shadow-lg">
      <div className="relative h-28 overflow-hidden bg-primary" aria-hidden="true">
        <svg
          viewBox="0 0 200 100"
          className="absolute inset-0 size-full text-primary-foreground/10"
        >
          <circle cx="30" cy="80" r="60" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="30" cy="80" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="20" x2="200" y2="20" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="45" x2="200" y2="45" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      <div className="bg-card p-6 sm:p-7">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    </article>
  );
}

function BenefitsSection({
  arabic,
  cards,
  title,
  subtitle,
}: {
  arabic: boolean;
  cards: { title: string; description: string }[];
  title?: string | undefined;
  subtitle?: string | undefined;
}) {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="page-container">
        <div className="reveal max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-hero-accent">
            {arabic ? "المزايا" : "Benefits"}
          </p>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl">
            {title ?? (arabic ? "لماذا تختار الشركات وجهان." : "Why Businesses Choose Wijhan.")}
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            {subtitle ??
              (arabic
                ? "لا نسلّم تطبيقات مؤقتة. نبني منتجات تبقى موثوقة كلما كبر عملك."
                : "We don't ship throwaway apps. We engineer products that stay reliable as your business grows.")}
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <BenefitCard key={card.title} title={card.title} description={card.description} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection({
  arabic,
  steps,
  title,
}: {
  arabic: boolean;
  steps: { title: string; description: string }[];
  title?: string | undefined;
}) {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="page-container">
        <h2 className="reveal font-display text-3xl sm:text-4xl lg:text-5xl">
          {title ?? (arabic ? "طريقة عملنا." : "Our Process.")}
        </h2>
        <div className="relative mt-16 grid gap-10 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4">
          <div
            className="absolute top-6 hidden h-px w-full bg-border lg:block"
            aria-hidden="true"
          />
          {steps.map((step, index) => (
            <div key={step.title} className="reveal relative">
              <div className="relative z-10 flex size-12 items-center justify-center rounded-full bg-hero-accent font-display text-lg text-primary">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OtherServicesSection({
  arabic,
  services,
  Arrow,
}: {
  arabic: boolean;
  services: { id: number; slug: string; title: string; summary: string; icon: string }[];
  Arrow: typeof ArrowUpRight;
}) {
  if (services.length === 0) return null;
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="page-container">
        <h2 className="reveal font-display text-3xl sm:text-4xl lg:text-5xl">
          {arabic ? "خدمات أخرى." : "Other Services."}
        </h2>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = resolveServiceIcon(service.icon);
            return (
              <Link
                key={service.id}
                to={arabic ? "/ar/services/$slug" : "/services/$slug"}
                params={{ slug: service.slug }}
                className="reveal group flex flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-hero-accent sm:p-7"
              >
                <span className="flex size-11 items-center justify-center rounded-lg bg-slate-100 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{service.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{service.summary}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                  {arabic ? "اكتشف المزيد" : "Explore More"}
                  <Arrow
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Optional slot for future social-proof content (trusted-by logos, stats,
// testimonials, FAQ) intentionally goes here, between Get Started and Other
// Services — left empty since none of that exists as real Wijhan content yet.
