import { createFileRoute } from "@tanstack/react-router";
import { PageIntro, ProjectCta, SectionHeading } from "@/components/page-elements";
import { processSteps } from "@/lib/site-data";
import { englishLocaleMeta, languageAlternates } from "@/lib/seo";

export const Route = createFileRoute("/process")({
  head: () => ({ meta: [
    { title: "Our Product Engineering Process | Wijhan" },
    { name: "description", content: "How Wijhan understands, defines, designs, engineers, validates and improves digital products." },
    { property: "og:title", content: "Our Product Engineering Process | Wijhan" },
    { property: "og:description", content: "Understand first. Build second. Improve continuously." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/process" }, { name: "twitter:card", content: "summary_large_image" },
      ...englishLocaleMeta,
  ], links: [{ rel: "canonical", href: "/process" }, ...languageAlternates("/process", "/ar/process")] }), component: ProcessPage,
});

function ProcessPage() { return <>
  <PageIntro eyebrow="Our process" title={<>Understand first.<br />Build second.<br /><span className="text-primary-foreground/45">Improve continuously.</span></>} copy="A clear product process reduces waste, surfaces risk early, and keeps every decision connected to the business objective." />
  <section className="section-pad"><div className="site-container">
    <div className="process-line">{processSteps.map(([number,title,copy], index)=><article className="process-step reveal" key={number}><div className="process-node">{number}</div><div><p className="eyebrow text-accent">Phase {number}</p><h2 className="mt-4 font-display text-4xl sm:text-5xl">{title}</h2><p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">{copy}</p></div><p className="hidden max-w-xs text-sm leading-6 text-muted-foreground lg:block">{["Listen before proposing. Surface assumptions and align on the real need.","Create boundaries, priorities and a shared definition of success.","Make the product tangible before engineering investment grows.","Choose technology for fit, durability and responsible delivery.","Verify the product against requirements and real use—not only technical completion.","Treat launch as the start of learning, not the end of the work."][index]}</p></article>)}</div>
  </div></section>
  <section className="section-pad bg-secondary"><div className="site-container"><SectionHeading eyebrow="Throughout the work" title="Clarity at every step." /><div className="mt-14 grid gap-px bg-border md:grid-cols-3">{[["Visible progress","The team and stakeholders know what is moving and why."],["Early truth","Risks and difficult decisions are surfaced before they become expensive."],["Shared ownership","Business, product, design and engineering move toward the same outcome."]].map(([t,c])=><article className="bg-background p-8 reveal" key={t}><h3 className="text-xl font-semibold">{t}</h3><p className="mt-4 text-sm leading-6 text-muted-foreground">{c}</p></article>)}</div></div></section>
  <ProjectCta />
</>; }