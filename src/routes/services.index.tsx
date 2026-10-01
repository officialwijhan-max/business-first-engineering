import { createFileRoute } from "@tanstack/react-router";
import { ServicesPage } from "@/components/services-page";
import { servicesQueryOptions } from "@/hooks/use-services";
import type { Service } from "@/api/types";
import { englishLocaleMeta, languageAlternates, servicesItemListJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/services/")({
  loader: async ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(servicesQueryOptions("en")).catch((): Service[] => []),
  head: ({ loaderData }) => ({
    meta: [
      { title: "Services | Wijhan" },
      {
        name: "description",
        content:
          "Custom software, mobile apps, portals & websites, UI/UX design, system integration, and ERP solutions, built around your business.",
      },
      { property: "og:title", content: "Services | Wijhan" },
      {
        property: "og:description",
        content:
          "Custom software, mobile apps, portals & websites, UI/UX design, system integration, and ERP solutions, built around your business.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/services" },
      { name: "twitter:card", content: "summary_large_image" },
      ...englishLocaleMeta,
    ],
    links: [
      { rel: "canonical", href: "/services" },
      ...languageAlternates("/services", "/ar/services"),
    ],
    scripts: [
      { type: "application/ld+json", children: servicesItemListJsonLd("en", loaderData ?? []) },
    ],
  }),
  component: ServicesRoute,
});

function ServicesRoute() {
  return <ServicesPage locale="en" />;
}
