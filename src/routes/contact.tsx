import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { DirectionMark, HeroBadge } from "@/components/page-elements";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GetStartedSection } from "@/components/get-started-section";
import { RegionalPresenceSection } from "@/components/regional-presence-section";
import { contactFaqsEn } from "@/content/contact-faq";
import { breadcrumbJsonLd, faqJsonLd, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead({
      locale: "en",
      enPath: "/contact",
      title: "Start a Project | Contact Wijhan",
      description:
        "Tell Wijhan what you are trying to build, improve or solve. Start a product engineering conversation.",
      jsonLd: [
        breadcrumbJsonLd("en", [{ name: "Contact", enPath: "/contact" }]),
        faqJsonLd("en", contactFaqsEn),
      ],
    }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <section className="page-intro">
        <div className="site-container grid gap-10 lg:grid-cols-[1.35fr_.65fr] lg:items-center">
          <div className="reveal">
            <HeroBadge>Start a Project</HeroBadge>
            <h1 className="mt-6 max-w-2xl font-display text-[2.5rem] leading-[.98] text-primary-foreground sm:text-6xl lg:text-7xl">
              Let’s understand
              <br />
              <span className="text-primary-foreground/45">the problem first.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-primary-foreground/70">
              Tell us what you’re trying to build, improve, or solve. A useful conversation starts
              with context, not a sales pitch.
            </p>
          </div>
          <div className="reveal relative overflow-hidden rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 backdrop-blur sm:p-8">
            <DirectionMark className="absolute end-[-7rem] top-[-7rem] w-[min(85vw,30rem)] opacity-30" />
            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-primary-foreground/20" aria-hidden="true" />
                <p className="text-xs font-bold uppercase tracking-widest text-hero-accent">
                  Get in touch
                </p>
              </div>
              <div className="mt-7 divide-y divide-primary-foreground/10">
                <InfoRow label="Email" value="hello@wijhan.com" href="mailto:hello@wijhan.com" />
                <InfoRow
                  label="Phone"
                  value="+20 100 058 0504"
                  href="tel:+201000580504"
                  dir="ltr"
                />
                <InfoRow label="Hours" value="Sun–Thu · 9–17 EET" />
                <InfoRow label="Response" value="Within 1 business day" accent />
              </div>
            </div>
          </div>
        </div>
      </section>
      <GetStartedSection locale="en" includeOtherService eyebrow="Get in touch" />

      <RegionalPresenceSection sectionId="regional-presence" arabic={false} />

      <section className="section-pad border-t border-border">
        <div className="site-container grid gap-10 lg:grid-cols-[.6fr_1.4fr] lg:items-start">
          <div className="reveal">
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-accent">
              <span className="h-px w-8 bg-accent" aria-hidden="true" />
              FAQ
            </p>
            <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl">Frequently asked</h2>
            <p className="mt-4 max-w-xs leading-7 text-muted-foreground">
              Can't find what you're after? Reach out to us directly.
            </p>
            <a
              className="mt-3 flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-accent"
              href="mailto:hello@wijhan.com"
            >
              <Mail className="size-4" aria-hidden="true" />
              hello@wijhan.com
            </a>
          </div>
          <Accordion type="single" collapsible className="flex flex-col gap-4">
            {contactFaqsEn.map((item) => (
              <AccordionItem
                key={item.question}
                value={item.question}
                className="rounded-2xl border-b-0 bg-background px-5 shadow-md sm:px-6"
              >
                <AccordionTrigger className="font-display text-lg">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="leading-7 text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
}

function InfoRow({
  label,
  value,
  href,
  dir,
  accent = false,
}: {
  label: string;
  value: string;
  href?: string;
  dir?: "ltr" | "rtl";
  accent?: boolean;
}) {
  const valueClassName = accent
    ? "text-end text-sm font-semibold text-hero-accent"
    : "text-end text-sm font-semibold text-primary-foreground";
  // Tappable rows (mailto:/tel:) get a full-height 44px hit area on touch screens.
  const linkClassName = `${valueClassName} inline-flex min-h-11 items-center`;
  return (
    <div className="flex min-h-20 items-center justify-between gap-4 py-5 sm:gap-6">
      <span className="text-sm text-primary-foreground/55">{label}</span>
      {href ? (
        <a className={linkClassName} href={href} dir={dir}>
          {value}
        </a>
      ) : (
        <span className={valueClassName} dir={dir}>
          {value}
        </span>
      )}
    </div>
  );
}
