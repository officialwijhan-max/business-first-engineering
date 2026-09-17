import { useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, CheckCircle2 } from "lucide-react";
import { PageIntro, ProjectCta, SectionHeading } from "@/components/page-elements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { englishLocaleMeta, languageAlternates } from "@/lib/seo";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing & Engagement Models | Wijhan" },
      {
        name: "description",
        content:
          "Wijhan pricing: Discovery Sprint from $1,000, Product Build from $1,500 and Embedded Partnership from $100 per month. Request a quote for your scope.",
      },
      { property: "og:title", content: "Pricing & Engagement Models | Wijhan" },
      { property: "og:description", content: "Transparent rates for discovery, design and engineering." },
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
    price: "$1,000",
    priceNote: "fixed price per sprint",
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
    price: "From $1,500",
    priceNote: "per agreed scope",
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
    price: "From $100",
    priceNote: "per month",
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
            Clear rates.
            <br />
            <span className="text-primary-foreground/45">No hidden hours.</span>
          </>
        }
        copy="Three engagement models, each with a published starting rate. The final figure is confirmed once we understand your scope — but you never have to guess where pricing begins."
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
                  <p className="mt-5 font-display text-4xl text-accent sm:text-5xl">{model.price}</p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">{model.priceNote}</p>
                  <p className="mt-5 max-w-md leading-7 text-muted-foreground">{model.summary}</p>
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
          <p className="mt-10 text-sm text-muted-foreground reveal">All rates are in US dollars and exclude any applicable taxes.</p>
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
      <QuoteRequest />
      <ProjectCta />
    </>
  );
}

function QuoteRequest() {
  const [submitted, setSubmitted] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }
  return (
    <section className="section-pad" id="quote">
      <div className="site-container grid gap-16 lg:grid-cols-[.65fr_1.35fr]">
        <aside className="reveal">
          <p className="eyebrow text-accent">Request a quote</p>
          <h2 className="mt-5 font-display text-4xl">Tell us the scope, get a figure.</h2>
          <p className="mt-6 leading-7 text-muted-foreground">
            Share what you are trying to build, improve or solve. We will come back with the engagement model that fits and a price you can hold us to.
          </p>
          <div className="mt-10 border-t border-border pt-6 space-y-5">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Email</p>
              <a className="mt-2 block text-lg font-semibold" href="mailto:hello@wijhan.com">hello@wijhan.com</a>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Phone</p>
              <a className="mt-2 block text-lg font-semibold" href="tel:+201000580504" dir="ltr">+20 100 058 0504</a>
            </div>
          </div>
        </aside>
        {submitted ? (
          <div className="flex min-h-96 flex-col items-start justify-center border-y border-border py-12 reveal">
            <CheckCircle2 className="size-9 text-accent" />
            <h2 className="mt-7 font-display text-4xl">Your quote request is ready.</h2>
            <p className="mt-5 max-w-lg leading-7 text-muted-foreground">
              Form delivery is not connected yet, so no message was sent. In the meantime, email the same details to hello@wijhan.com.
            </p>
            <Button className="mt-8" variant="outline" onClick={() => setSubmitted(false)}>
              Edit your request
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="grid gap-7 reveal" aria-label="Quote request form">
            <div className="grid gap-7 sm:grid-cols-2">
              <Field label="Name"><Input required name="name" autoComplete="name" placeholder="Your name" /></Field>
              <Field label="Company"><Input name="company" autoComplete="organization" placeholder="Company name" /></Field>
            </div>
            <div className="grid gap-7 sm:grid-cols-2">
              <Field label="Email"><Input required type="email" name="email" autoComplete="email" placeholder="you@company.com" /></Field>
              <Field label="Phone"><Input type="tel" name="phone" autoComplete="tel" placeholder="Your phone number" /></Field>
            </div>
            <div className="grid gap-7 sm:grid-cols-2">
              <SelectField label="Project Type" name="projectType" options={["New digital product", "Existing product improvement", "ERP solution", "Product discovery", "Design", "Engineering", "Other"]} />
              <SelectField label="Budget Range" name="budget" options={["Not decided yet", "Under $10,000", "$10,000–$25,000", "$25,000–$50,000", "$50,000+"]} />
            </div>
            <Field label="Project Description">
              <Textarea required name="description" className="min-h-44" placeholder="What are you trying to build, improve, or solve?" />
            </Field>
            <div className="flex flex-col gap-4 border-t border-border pt-7 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-md text-xs leading-5 text-muted-foreground">
                This preview validates your details but does not send them until official contact delivery is connected.
              </p>
              <Button size="lg" type="submit">Request a Quote <ArrowRight /></Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="form-field"><span>{label}</span>{children}</label>;
}

function SelectField({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <select name={name} required defaultValue="">
        <option value="" disabled>Select an option</option>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}
