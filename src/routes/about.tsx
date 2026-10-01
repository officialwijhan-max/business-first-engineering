import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/about-page";
import {
  aboutOrganizationJsonLd,
  englishBreadcrumbJsonLd,
  englishLocaleMeta,
  languageAlternates,
} from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Wijhan | Product Engineering Company" },
      {
        name: "description",
        content:
          "Wijhan is a product engineering company helping founders and businesses turn real problems into scalable digital products.",
      },
      { property: "og:title", content: "About Wijhan | Product Engineering Company" },
      {
        property: "og:description",
        content:
          "Wijhan is a product engineering company helping founders and businesses turn real problems into scalable digital products.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about" },
      { name: "twitter:card", content: "summary_large_image" },
      ...englishLocaleMeta,
    ],
    links: [{ rel: "canonical", href: "/about" }, ...languageAlternates("/about", "/ar/about")],
    scripts: [
      { type: "application/ld+json", children: englishBreadcrumbJsonLd("About Wijhan", "/about") },
      { type: "application/ld+json", children: aboutOrganizationJsonLd("en") },
    ],
  }),
  component: () => <AboutPage locale="en" />,
});
