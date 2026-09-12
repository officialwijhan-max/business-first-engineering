import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageIntro, ProjectCta, SectionHeading } from "@/components/page-elements";
import { philosophyQuestions, values } from "@/lib/site-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Wijhan | Business Before Technology" },
      { name: "description", content: "Discover why Wijhan starts with business understanding before product design and software engineering." },
      { property: "og:title", content: "About Wijhan | Business Before Technology" },
      { property: "og:description", content: "We do not start with technology. We start with understanding." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return <>
    <PageIntro eyebrow="About Wijhan" title={<>We don’t start with technology.<br /><span className="text-primary-foreground/45">We start with understanding.</span></>} copy="Wijhan is a product engineering company for founders and businesses that need a thinking partner—not simply a team that takes orders." />
    <section className="section-pad">
      <div className="site-container grid gap-14 lg:grid-cols-2">
        <div className="reveal"><SectionHeading eyebrow="Our name" title="Direction with intent." /></div>
        <div className="reveal space-y-6 text-lg leading-8 text-muted-foreground">
          <p>The name <strong className="text-foreground">Wijhan</strong> is inspired by the Arabic concept of <span className="font-arabic text-xl text-foreground" lang="ar" dir="rtl">وِجهة</span>—direction, destination, and the path toward a goal.</p>
          <p>But our defining question is not simply “Where are we going?” It is “Why are we going there in the first place?”</p>
          <p>That question changes what gets built, what waits, and how technology supports the business.</p>
        </div>
      </div>
    </section>
    <section className="section-pad bg-secondary">
      <div className="site-container">
        <SectionHeading eyebrow="A different model" title="From requirements to responsibility." copy="The distinction is not semantic. It changes the decisions made throughout the life of the product." />
        <div className="mt-16 grid gap-px bg-border lg:grid-cols-2">
          <article className="comparison-panel reveal">
            <p className="eyebrow text-muted-foreground">Traditional Software House</p><h3 className="mt-7 font-display text-3xl">Execute the request.</h3>
            <div className="mt-12 flex flex-wrap items-center gap-3 text-sm"><span>Requirements</span><ArrowRight /><span>Development</span><ArrowRight /><span>Delivery</span></div>
          </article>
          <article className="comparison-panel comparison-panel--active reveal">
            <p className="eyebrow text-hero-accent">Wijhan</p><h3 className="mt-7 font-display text-3xl">Understand the outcome.</h3>
            <div className="mt-12 flex flex-wrap items-center gap-3 text-sm text-primary-foreground/70">{["Business","Problem","Product","Design","Engineering","Validation","Improvement"].map((item, index, list) => <span className="contents" key={item}><span>{item}</span>{index < list.length - 1 ? <ArrowRight className="size-4" /> : null}</span>)}</div>
          </article>
        </div>
      </div>
    </section>
    <section className="section-pad">
      <div className="site-container">
        <SectionHeading eyebrow="Our philosophy" title="Good engineering starts with good questions." />
        <div className="mt-16 lg:ml-[32%]">{philosophyQuestions.map((q, i) => <div className="question-row reveal" key={q}><span className="font-mono text-xs text-accent">0{i+1}</span><p>{q}</p><span className="font-display text-2xl text-muted-foreground">?</span></div>)}</div>
      </div>
    </section>
    <section className="section-pad bg-primary text-primary-foreground">
      <div className="site-container">
        <SectionHeading eyebrow="What guides us" inverse title="Principles that hold under pressure." />
        <div className="mt-16 grid border-l border-t border-primary-foreground/15 md:grid-cols-2 lg:grid-cols-5">{values.map(([title, copy], i) => <article className="process-tile reveal" key={title}><span className="font-mono text-xs text-hero-accent">0{i+1}</span><h3 className="mt-10 text-lg font-semibold">{title}</h3><p className="mt-4 text-sm leading-6 text-primary-foreground/55">{copy}</p></article>)}</div>
      </div>
    </section>
    <section className="section-pad"><div className="site-container grid gap-14 lg:grid-cols-2"><div><p className="eyebrow text-accent">Mission</p><p className="mt-6 font-display text-3xl leading-snug">We turn deep business understanding into real digital products and engineering decisions rooted in purpose from day one.</p></div><div><p className="eyebrow text-accent">Vision</p><p className="mt-6 font-display text-3xl leading-snug">To become the first destination founders think of when they need a technical partner who understands the business before the code.</p></div></div></section>
    <ProjectCta />
  </>;
}