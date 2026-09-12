import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PageIntro, ProjectCta, SectionHeading } from "@/components/page-elements";
import { services } from "@/lib/site-data";

export const Route = createFileRoute("/services")({
  head: () => ({ meta: [
    { title: "Product Engineering Services | Wijhan" },
    { name: "description", content: "Product discovery, design, software engineering, ERP, quality assurance and delivery management from Wijhan." },
    { property: "og:title", content: "Product Engineering Services | Wijhan" },
    { property: "og:description", content: "From business understanding to scalable digital products." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/services" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/services" }] }), component: ServicesPage,
});

function ServicesPage() { return <>
  <PageIntro eyebrow="Services" title={<>The right product.<br /><span className="text-primary-foreground/45">Built for the right reason.</span></>} copy="Strategy, design, engineering and delivery working as one connected discipline—not isolated handoffs." />
  <section className="section-pad"><div className="site-container">
    <SectionHeading eyebrow="Capabilities" title="One partner, from question to product." copy="Engagements are shaped around the business challenge. Not every product needs every service." />
    <div className="mt-20">
      {services.map((service) => { const Icon = service.icon; return <article className="service-detail reveal" key={service.title}>
        <div className="flex items-center gap-4"><span className="font-mono text-xs text-accent">{service.number}</span><Icon className="size-6 text-accent" /></div>
        <div><h2 className="font-display text-3xl sm:text-4xl">{service.title}</h2><p className="mt-4 max-w-md leading-7 text-muted-foreground">{service.summary}</p></div>
        <ul className="grid gap-3 sm:grid-cols-2">{service.capabilities.map(c => <li className="flex gap-3 text-sm" key={c}><Check className="mt-0.5 size-4 shrink-0 text-accent" />{c}</li>)}</ul>
      </article>; })}
    </div>
  </div></section>
  <section className="section-pad bg-secondary"><div className="site-container grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><SectionHeading eyebrow="How we engage" title="Built around the actual need." /><div className="grid gap-px bg-border sm:grid-cols-2">{[["New products","Move from an idea or business need to a validated product."],["Existing products","Improve usability, architecture, quality or delivery."],["Operations & ERP","Turn disconnected processes into practical systems."],["Embedded partnership","Add product and engineering capability to your team."]].map(([t,c])=><article className="bg-background p-8 reveal" key={t}><h3 className="text-lg font-semibold">{t}</h3><p className="mt-4 text-sm leading-6 text-muted-foreground">{c}</p></article>)}</div></div></section>
  <ProjectCta />
</>; }