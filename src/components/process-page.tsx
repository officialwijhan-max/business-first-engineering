import type { ReactNode } from "react";
import { CheckCircle2, Code2, PenTool, Search, Target, TrendingUp } from "lucide-react";
import {
  HERO_CONTAINER_CLASS,
  HERO_SECTION_CLASS,
  HeroGraphic,
  HeroBadge,
  SectionLabel,
} from "@/components/page-elements";
import { GetStartedSection } from "@/components/get-started-section";
import { cn } from "@/lib/utils";
import type { Locale } from "@/api/types";

/** One icon per phase, in order: Understand, Define, Design, Engineer, Validate, Improve. */
const PHASE_ICONS = [Search, Target, PenTool, Code2, CheckCircle2, TrendingUp];

export function ProcessPage({
  locale,
  badge,
  title,
  accent,
  copy,
  steps,
  notes,
  phaseLabel,
  principlesLabel,
  principlesTitle,
  principles,
}: {
  locale: Locale;
  badge: string;
  /** Leading lines of the H1 (before the accented phrase). */
  title: ReactNode;
  /** Final emphasized phrase of the H1, rendered in the hero accent color. */
  accent: string;
  copy: string;
  steps: readonly (readonly [string, string, string])[];
  notes: readonly string[];
  phaseLabel: string;
  principlesLabel: string;
  principlesTitle: string;
  principles: readonly (readonly [string, string])[];
}) {
  return (
    <>
      <section className={HERO_SECTION_CLASS}>
        <div className={cn("relative page-container", HERO_CONTAINER_CLASS)}>
          <div className="grid gap-14 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
            <div className="reveal">
              <HeroBadge>{badge}</HeroBadge>
              <h1 className="mt-6 max-w-4xl font-display text-[2.5rem] leading-[.98] sm:text-6xl lg:text-7xl">
                {title}
                <span className="text-hero-accent">{accent}</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{copy}</p>
            </div>
            <HeroGraphic />
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="site-container">
          <ol className="mx-auto max-w-5xl">
            {steps.map(([number, stepTitle, stepCopy], index) => {
              const Icon = PHASE_ICONS[index] ?? Search;
              const isLast = index === steps.length - 1;
              return (
                <li
                  className={cn(
                    "reveal group relative grid grid-cols-[3rem_1fr] gap-4 sm:grid-cols-[3.5rem_1fr] sm:gap-6",
                    !isLast && "pb-10 sm:pb-12",
                  )}
                  key={number}
                >
                  {/* Connector: runs from under this phase's node to the top of the next one. */}
                  {!isLast ? (
                    <span
                      className="absolute start-[calc(1.5rem-1px)] top-[4.5rem] -bottom-6 w-0.5 bg-accent sm:start-[calc(1.75rem-1px)] sm:top-[5.5rem] sm:-bottom-8"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative mt-6 flex size-12 items-center justify-center rounded-full border-2 border-accent bg-background text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground sm:mt-8 sm:size-14">
                    <Icon className="size-5 sm:size-6" aria-hidden="true" />
                    <span className="absolute -bottom-2.5 rounded-full border-2 border-background bg-accent px-1.5 text-[10px] font-semibold leading-4 text-accent-foreground">
                      {number}
                    </span>
                  </div>
                  <article className="min-w-0 rounded-2xl border border-border bg-card p-6 transition-all group-hover:-translate-y-1 group-hover:border-hero-accent group-hover:shadow-lg sm:p-8">
                    <div className="grid gap-5 lg:grid-cols-[1fr_16rem] lg:items-start lg:gap-8">
                      <div>
                        <SectionLabel>
                          {phaseLabel} {number}
                        </SectionLabel>
                        <h2 className="mt-3 font-display text-2xl sm:text-3xl">{stepTitle}</h2>
                        <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
                          {stepCopy}
                        </p>
                      </div>
                      <p className="rounded-e-lg border-s-2 border-accent bg-secondary px-4 py-3 text-sm leading-6 text-foreground/80">
                        {notes[index]}
                      </p>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="section-pad bg-secondary">
        <div className="site-container">
          <div className="reveal">
            <SectionLabel>{principlesLabel}</SectionLabel>
            <h2 className="section-title mt-5">{principlesTitle}</h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {principles.map(([principleTitle, principleCopy]) => (
              <article
                className="reveal group rounded-2xl border border-border bg-card p-6 transition-all sm:p-8 hover:-translate-y-1 hover:border-accent hover:shadow-lg"
                key={principleTitle}
              >
                <h3 className="text-xl font-semibold">{principleTitle}</h3>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{principleCopy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <GetStartedSection locale={locale} />
    </>
  );
}
