import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PageIntro, ProjectCta, SectionHeading } from "@/components/page-elements";
import { englishLocaleMeta, languageAlternates } from "@/lib/seo";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing & Engagement Models | Wijhan" },
      {
        name: "description",
        content:
          "How Wijhan charges for product discovery, design and engineering: fixed-scope discovery sprints, scoped product builds and monthly partnerships. Rates are quoted per scope.",
      },
      { property: "og:title", content: "Pricing & Engagement Models | Wijhan" },
      { property: "og:description", content: "Transparent engagement models for discovery, design and engineering." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/pricing" },
      { name: "twitter:card", content: "summary_large_image" },
      ...englishLocaleMeta,
    ],
    links: [{ rel: "canonical", href: "/pricing" }, ...languageAlternates("/pricing", "/ar/pricing")],
  }),
  component: PricingPage,
});

const models = [
  {
    number: "01",
    title: "Discovery Sprint",
    tag: "Fixed scope, fixed price",
    summary:
      "A short, focused engagement that turns a business idea or problem into a validated product definition. You know the full cost before we start.",
    includes: [
      "Business and requirements analysis",
      "User needs and success criteria",
      "Product definition and feature prioritization",
      "MVP scope and delivery plan",
      "A fixed quote for the build that follows",
    ],
    best: "Founders and teams who need clarity before committing to a build.",
  },
  {
    number: "02",
    title: "Product Build",
    tag: "Scoped engagement",
    summary:
      "Design and engineering delivered against an agreed scope, timeline and price. The scope is defined together during or after discovery — never guessed.",
    includes: [
      "UX, UI and prototyping",
      "Web, mobile and backend engineering",
      "Quality assurance and release validation",
      "Milestone-based delivery with visible progress",
      "A defined price per agreed scope",
    ],
    best: "Businesses ready to build a defined product or system, including ERP.",
  },
  {
    number: "03",
    title: "Embedded Partnership",
    tag: "Monthly engagement",
    summary:
      "Ongoing product, design and engineering capacity working as part of your team, billed monthly. Scale the capacity up or down as the product evolves.",
    includes: [
      "Dedicated product and engineering capacity",
      "Continuous improvement and iteration",
      "Delivery management and stakeholder communication",
      "Priority response for your product",
      "A predictable monthly rate",
    ],
    best: "Teams with a live product that needs a long-term technology partner.",
  },
] as const;

const principles = [
  ["No hourly surprises", "We quote per scope or per month, agreed in writing before work begins."],
  ["Discovery before commitment", "If the problem is not clear yet, we start with a small fixed-price sprint — not a large contract."],
  ["Honest estimates", "If something will cost more than it is worth, we say so before you spend it."],
  ["Change is priced openly", "When scope changes, the impact on cost and timeline is stated before the work continues."],
] as const;

function PricingPage() {
  return (
    <>
      <PageIntro
        eyebrow="Pricing"
        title={
          <>
            Clear models.
            <br />
            <span className="text-primary-foreground/45">No hidden hours.</span>
          </>
        }
        copy="Every product is different, so we do not publish a generic rate card. Instead, we charge through three transparent engagement models — and quote a precise figure once we understand your scope."
      />
      <section className="section-pad">
        <div className="site-container">
          <SectionHeading
            eyebrow="Engagement models"
            title="Three ways to work with us."
            copy="Each model maps to a stage of the product journey. Many engagements move from a discovery sprint into a build, then into a partnership."
          />
          <div className="mt-20">
            {models.map((model) => (
              <article className="service-detail reveal" key={model.title}>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-accent">{model.number}</span>
                  <span className="eyebrow text-muted-foreground">{model.tag}</span>
                </div>
                <div>
                  <h2 className="font-display text-3xl sm:text-4xl">{model.title}</h2>
                  <p className="mt-4 max-w-md leading-7 text-muted-foreground">{model.summary}</p>
                  <p className="mt-6 max-w-md border-t border-border pt-5 text-sm leading-6">
                    <span className="font-semibold">Best for: </span>
                    <span className="text-muted-foreground">{model.best}</span>
                  </p>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {model.includes.map((item) => (
                    <li className="flex gap-3 text-sm" key={item}>
                      <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section-pad bg-secondary">
        <div className="site-container grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <SectionHeading eyebrow="How we charge" title="Principles behind every quote." />
          <div className="grid gap-px bg-border sm:grid-cols-2">
            {principles.map(([title, copy]) => (
              <article className="bg-background p-8 reveal" key={title}>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section-pad">
        <div className="site-container grid gap-10 border-y border-border py-14 lg:grid-cols-[1fr_.8fr] lg:items-center">
          <h2 className="font-display text-3xl leading-snug sm:text-4xl reveal">
            Rates depend on scope, team and timeline — so the honest answer starts with a short conversation, not a price list.
          </h2>
          <p className="max-w-md leading-7 text-muted-foreground reveal">
            Tell us what you are trying to build, improve or solve. We will come back with the model that fits, a clear scope, and a figure you can hold us to.
          </p>
        </div>
      </section>
      <ProjectCta />
    </>
  );
}
