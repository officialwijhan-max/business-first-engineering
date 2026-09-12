import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageIntro, ProjectCta, SectionHeading } from "@/components/page-elements";
import { projectCategories } from "@/lib/site-data";

export const Route = createFileRoute("/work")({
  head: () => ({ meta: [
    { title: "Selected Work & Case Studies | Wijhan" },
    { name: "description", content: "Explore the kinds of business systems and digital products Wijhan helps create." },
    { property: "og:title", content: "Selected Work & Case Studies | Wijhan" },
    { property: "og:description", content: "Selected product engineering work from Wijhan." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/work" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/work" }] }), component: WorkPage,
});

function WorkPage() { return <>
  <PageIntro eyebrow="Selected work" title={<>Products are judged<br /><span className="text-primary-foreground/45">by what they change.</span></>} copy="Our case studies will show the challenge, decisions, technology and measurable outcome—without inflated claims." />
  <section className="section-pad"><div className="site-container">
    <SectionHeading eyebrow="Case studies" title="Proof, when it is ready." copy="Verified project details have not yet been supplied. We will publish full case studies here once they are approved." />
    <div className="mt-16 border-y border-border py-14 text-center reveal"><p className="font-display text-3xl text-muted-foreground sm:text-4xl">Selected work is being prepared.</p><Link to="/contact" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-accent">Discuss a relevant project privately <ArrowUpRight className="size-4" /></Link></div>
  </div></section>
  <section className="section-pad bg-secondary"><div className="site-container">
    <SectionHeading eyebrow="Project environments" title="The kinds of problems we work around." copy="These categories describe potential project types, not fabricated client claims or exclusive specializations." />
    <div className="mt-14 grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-3">{projectCategories.map((category,index)=><div className="service-tile reveal" key={category}><span className="font-mono text-xs text-muted-foreground">0{index+1}</span><h3 className="mt-12 font-display text-3xl">{category}</h3></div>)}</div>
  </div></section>
  <ProjectCta />
</>; }