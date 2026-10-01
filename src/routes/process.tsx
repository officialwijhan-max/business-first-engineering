import { createFileRoute } from "@tanstack/react-router";
import { ProcessPage } from "@/components/process-page";
import { processSteps } from "@/lib/site-data";
import { englishLocaleMeta, languageAlternates } from "@/lib/seo";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title: "Our Product Engineering Process | Wijhan" },
      {
        name: "description",
        content:
          "How Wijhan understands, defines, designs, engineers, validates and improves digital products.",
      },
      { property: "og:title", content: "Our Product Engineering Process | Wijhan" },
      {
        property: "og:description",
        content: "Understand first. Build second. Improve continuously.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/process" },
      { name: "twitter:card", content: "summary_large_image" },
      ...englishLocaleMeta,
    ],
    links: [
      { rel: "canonical", href: "/process" },
      ...languageAlternates("/process", "/ar/process"),
    ],
  }),
  component: ProcessRoute,
});

function ProcessRoute() {
  return (
    <ProcessPage
      locale="en"
      badge="Our process"
      title={
        <>
          Understand first.
          <br />
          Build second.
          <br />
        </>
      }
      accent="Improve continuously."
      copy="A clear product process reduces waste, surfaces risk early, and keeps every decision connected to the business objective."
      steps={processSteps}
      notes={[
        "Listen before proposing. Surface assumptions and align on the real need.",
        "Create boundaries, priorities and a shared definition of success.",
        "Make the product tangible before engineering investment grows.",
        "Choose technology for fit, durability and responsible delivery.",
        "Verify the product against requirements and real use—not only technical completion.",
        "Treat launch as the start of learning, not the end of the work.",
      ]}
      phaseLabel="Phase"
      principlesLabel="Throughout the work"
      principlesTitle="Clarity at every step."
      principles={[
        ["Visible progress", "The team and stakeholders know what is moving and why."],
        ["Early truth", "Risks and difficult decisions are surfaced before they become expensive."],
        [
          "Shared ownership",
          "Business, product, design and engineering move toward the same outcome.",
        ],
      ]}
    />
  );
}
