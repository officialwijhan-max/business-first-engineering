import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowLink, DirectionMark, Eyebrow, ProjectCta, SectionHeading } from "@/components/page-elements";
import { approachQuestions, differentiators, industries, processSteps, services } from "@/lib/site-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wijhan | Product Engineering Company" },
      { name: "description", content: "Wijhan helps businesses understand, design, build and improve digital products." },
      { name: "keywords", content: "Product Engineering, Digital Product Development, Software Engineering, ERP Solutions, Laravel Development, PHP Development, Mobile App Development, Technology Partner" },
      { property: "og:title", content: "Wijhan | Product Engineering Company" },
      { property: "og:description", content: "Business understanding before technology. Product thinking before development." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <section className="hero-section">
        <div className="site-container relative grid min-h-[calc(100svh-5rem)] gap-12 py-16 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:py-20">
          <div className="relative z-10 max-w-4xl">
            <Eyebrow inverse>Product Engineering Company</Eyebrow>
            <h1 className="mt-7 font-display text-6xl leading-[.9] text-primary-foreground sm:text-8xl lg:text-[7.5rem]">
              Your business first.
              <span className="mt-2 block text-hero-accent">Then the code.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-primary-foreground/70 sm:text-xl">
              Wijhan helps founders and businesses turn real business problems into well-designed, scalable digital products.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">Start a Project <ArrowRight /></Link>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/work">Explore Our Work</Link>
              </Button>
            </div>
          </div>
          <div className="relative flex min-h-80 items-center justify-center lg:min-h-[34rem]">
            <DirectionMark />
            <p className="absolute bottom-3 right-0 max-w-52 border-l border-hero-accent pl-4 text-sm leading-6 text-primary-foreground/55">
              Direction starts with knowing why the destination matters.
            </p>
          </div>
          <ArrowDown className="absolute bottom-8 left-6 size-5 animate-bounce text-primary-foreground/40 md:left-10 lg:left-12" aria-hidden="true" />
        </div>
      </section>

      <section className="section-pad bg-background">
        <div className="site-container">
          <div className="grid gap-14 lg:grid-cols-[.75fr_1.25fr]">
            <div className="reveal">
              <Eyebrow>The principle</Eyebrow>
              <p className="mt-6 max-w-xs text-sm leading-6 text-muted-foreground">Before technology, we ask the questions that shape everything after it.</p>
            </div>
            <div className="reveal">
              <h2 className="font-display text-4xl leading-tight sm:text-6xl lg:text-7xl">
                Most projects don’t fail because of bad code.
              </h2>
              <p className="mt-7 font-display text-3xl text-accent sm:text-5xl">They fail because the wrong problem was solved.</p>
            </div>
          </div>
          <div className="mt-20 border-t border-border">
            {approachQuestions.map((question, index) => (
              <div key={question} className="reveal question-row">
                <span className="font-mono text-xs text-accent">0{index + 1}</span>
                <p>{question}</p>
                <ArrowRight className="size-5 text-muted-foreground" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-secondary">
        <div className="site-container">
          <SectionHeading eyebrow="What we do" title={<>From uncertainty to<br />a product that works.</>} copy="We connect business thinking, product design and disciplined engineering in one accountable team." />
          <div className="mt-16 grid border-l border-t border-border md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article key={service.title} className="service-tile reveal">
                  <div className="flex items-start justify-between"><span className="font-mono text-xs text-muted-foreground">{service.number}</span><Icon className="size-6 text-accent" aria-hidden="true" /></div>
                  <h3 className="mt-12 font-display text-3xl">{service.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{service.summary}</p>
                </article>
              );
            })}
          </div>
          <div className="mt-10 flex justify-end"><ArrowLink to="/services">Explore all services</ArrowLink></div>
        </div>
      </section>

      <section className="section-pad bg-primary text-primary-foreground">
        <div className="site-container">
          <SectionHeading eyebrow="Our process" inverse title={<>Understand first.<br /><span className="text-primary-foreground/45">Build second.</span><br />Improve continuously.</>} />
          <div className="mt-20 grid gap-0 border-l border-t border-primary-foreground/15 md:grid-cols-2 lg:grid-cols-3">
            {processSteps.map(([number, title, copy]) => (
              <article className="process-tile reveal" key={number}>
                <span className="font-mono text-xs text-hero-accent">{number}</span>
                <h3 className="mt-14 font-display text-3xl">{title}</h3>
                <p className="mt-4 text-sm leading-6 text-primary-foreground/55">{copy}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 flex justify-end"><ArrowLink to="/process" inverse>See how we work</ArrowLink></div>
        </div>
      </section>

      <section className="section-pad">
        <div className="site-container">
          <SectionHeading eyebrow="Why Wijhan" title="Not another software vendor." copy="The difference is not only in how we build. It is in how we think before building." />
          <div className="mt-16 lg:ml-[25%]">
            {differentiators.map(([title, copy], index) => (
              <article key={title} className="reveal grid gap-4 border-t border-border py-8 sm:grid-cols-[3rem_.7fr_1fr]">
                <span className="font-mono text-xs text-accent">0{index + 1}</span>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad border-t border-border bg-secondary">
        <div className="site-container">
          <SectionHeading eyebrow="Business environments" title="Experience across industries." copy="Wijhan works across different business environments without claiming a one-size-fits-all specialization." />
          <div className="mt-14 grid grid-cols-2 border-l border-t border-border sm:grid-cols-4">
            {industries.map(({ name, icon: Icon }) => (
              <div key={name} className="industry-cell reveal"><Icon className="size-5 text-accent" aria-hidden="true" /><span>{name}</span></div>
            ))}
          </div>
        </div>
      </section>
      <ProjectCta />
    </>
  );
}