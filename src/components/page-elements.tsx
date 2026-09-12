import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Eyebrow({ children, inverse = false }: { children: ReactNode; inverse?: boolean }) {
  return (
    <p className={cn("eyebrow", inverse ? "text-primary-foreground/60" : "text-accent")}>{children}</p>
  );
}

export function PageIntro({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: ReactNode;
  copy: string;
}) {
  return (
    <section className="page-intro">
      <div className="site-container grid gap-10 lg:grid-cols-[1.35fr_.65fr] lg:items-end">
        <div className="reveal">
          <Eyebrow inverse>{eyebrow}</Eyebrow>
          <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[.98] text-primary-foreground sm:text-7xl lg:text-8xl">
            {title}
          </h1>
        </div>
        <p className="reveal max-w-xl text-lg leading-8 text-primary-foreground/70 lg:pb-2">{copy}</p>
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  inverse = false,
}: {
  eyebrow: string;
  title: ReactNode;
  copy?: string;
  inverse?: boolean;
}) {
  return (
    <div className="reveal grid gap-7 lg:grid-cols-[1fr_.55fr] lg:items-end">
      <div>
        <Eyebrow inverse={inverse}>{eyebrow}</Eyebrow>
        <h2 className={cn("section-title mt-5", inverse && "text-primary-foreground")}>{title}</h2>
      </div>
      {copy ? (
        <p className={cn("max-w-xl text-base leading-7", inverse ? "text-primary-foreground/65" : "text-muted-foreground")}>
          {copy}
        </p>
      ) : null}
    </div>
  );
}

export function ArrowLink({ to, children, inverse = false }: { to: string; children: ReactNode; inverse?: boolean }) {
  return (
    <Link
      to={to}
      className={cn("arrow-link group", inverse && "border-primary-foreground/20 text-primary-foreground")}
    >
      <span>{children}</span>
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
    </Link>
  );
}

export function DirectionMark({ className }: { className?: string }) {
  return (
    <div className={cn("direction-mark", className)} aria-hidden="true">
      <div className="direction-mark__orbit" />
      <div className="direction-mark__line" />
      <div className="direction-mark__point" />
    </div>
  );
}

export function ProjectCta() {
  return (
    <section className="bg-accent text-accent-foreground">
      <div className="site-container grid gap-10 py-20 md:py-28 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="reveal max-w-3xl">
          <Eyebrow inverse>Have a challenge in mind?</Eyebrow>
          <h2 className="mt-5 font-display text-4xl leading-tight sm:text-6xl">
            Let’s understand the problem first.
          </h2>
        </div>
        <ArrowLink to="/contact" inverse>
          Start a Project
        </ArrowLink>
      </div>
    </section>
  );
}