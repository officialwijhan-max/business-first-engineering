import { createFileRoute } from "@tanstack/react-router";
import { ServicesPage } from "@/components/services-page";
import { servicesQueryOptions } from "@/hooks/use-services";
import type { Service } from "@/api/types";
import { arabicLocaleMeta, languageAlternates, servicesItemListJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/ar/services/")({
  loader: async ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(servicesQueryOptions("ar")).catch((): Service[] => []),
  head: ({ loaderData }) => ({
    meta: [
      { title: "الخدمات | وجهان" },
      {
        name: "description",
        content:
          "حلول برمجية مخصصة، تطبيقات موبايل، بوابات ومواقع، تصميم UI/UX، تكامل الأنظمة، وحلول ERP مبنية حول عملك.",
      },
      { property: "og:title", content: "الخدمات | وجهان" },
      {
        property: "og:description",
        content:
          "حلول برمجية مخصصة، تطبيقات موبايل، بوابات ومواقع، تصميم UI/UX، تكامل الأنظمة، وحلول ERP مبنية حول عملك.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/ar/services" },
      { name: "twitter:card", content: "summary_large_image" },
      ...arabicLocaleMeta,
    ],
    links: [
      { rel: "canonical", href: "/ar/services" },
      ...languageAlternates("/services", "/ar/services"),
    ],
    scripts: [
      { type: "application/ld+json", children: servicesItemListJsonLd("ar", loaderData ?? []) },
    ],
  }),
  component: ArabicServicesRoute,
});

function ArabicServicesRoute() {
  return <ServicesPage locale="ar" />;
}
