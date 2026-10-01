import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetailPage } from "@/components/service-detail-page";
import { servicesQueryOptions } from "@/hooks/use-services";
import type { Service } from "@/api/types";
import { getServiceDetailContent } from "@/content/service-details";
import {
  englishLocaleMeta,
  languageAlternates,
  serviceBreadcrumbJsonLd,
  serviceSchemaJsonLd,
} from "@/lib/seo";

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params, context: { queryClient } }) => {
    const services: Service[] = await queryClient
      .ensureQueryData(servicesQueryOptions("en"))
      .catch((): Service[] => []);
    return services.find((service) => service.slug === params.slug) ?? null;
  },
  head: ({ loaderData }) => {
    const detail = loaderData?.slug ? getServiceDetailContent(loaderData.slug)?.en : undefined;
    const title =
      detail?.seoTitle ??
      (loaderData ? `${loaderData.title} | Wijhan Services` : "Service | Wijhan");
    const description =
      detail?.seoDescription ?? loaderData?.summary ?? "A Wijhan product engineering service.";
    const slug = loaderData?.slug;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: slug ? `/services/${slug}` : "/services" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(loaderData ? [] : [{ name: "robots", content: "noindex" }]),
        ...englishLocaleMeta,
      ],
      links: slug
        ? [
            { rel: "canonical", href: `/services/${slug}` },
            ...languageAlternates(`/services/${slug}`, `/ar/services/${slug}`),
          ]
        : [],
      scripts:
        loaderData && slug
          ? [
              {
                type: "application/ld+json",
                children: serviceBreadcrumbJsonLd("en", loaderData.title, slug),
              },
              {
                type: "application/ld+json",
                children: serviceSchemaJsonLd("en", loaderData.title, description, slug),
              },
            ]
          : [],
    };
  },
  component: ServiceDetailRoute,
});

function ServiceDetailRoute() {
  const { slug } = Route.useParams();
  return <ServiceDetailPage locale="en" slug={slug} />;
}
