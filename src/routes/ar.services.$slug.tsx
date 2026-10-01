import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetailPage } from "@/components/service-detail-page";
import { servicesQueryOptions } from "@/hooks/use-services";
import type { Service } from "@/api/types";
import { getServiceDetailContent } from "@/content/service-details";
import {
  arabicLocaleMeta,
  languageAlternates,
  serviceBreadcrumbJsonLd,
  serviceSchemaJsonLd,
} from "@/lib/seo";

export const Route = createFileRoute("/ar/services/$slug")({
  loader: async ({ params, context: { queryClient } }) => {
    const services: Service[] = await queryClient
      .ensureQueryData(servicesQueryOptions("ar"))
      .catch((): Service[] => []);
    return services.find((service) => service.slug === params.slug) ?? null;
  },
  head: ({ loaderData }) => {
    const detail = loaderData?.slug ? getServiceDetailContent(loaderData.slug)?.ar : undefined;
    const title =
      detail?.seoTitle ?? (loaderData ? `${loaderData.title} | خدمات وجهان` : "خدمة | وجهان");
    const description =
      detail?.seoDescription ?? loaderData?.summary ?? "خدمة من خدمات هندسة المنتجات لدى وجهان.";
    const slug = loaderData?.slug;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: slug ? `/ar/services/${slug}` : "/ar/services" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(loaderData ? [] : [{ name: "robots", content: "noindex" }]),
        ...arabicLocaleMeta,
      ],
      links: slug
        ? [
            { rel: "canonical", href: `/ar/services/${slug}` },
            ...languageAlternates(`/services/${slug}`, `/ar/services/${slug}`),
          ]
        : [],
      scripts:
        loaderData && slug
          ? [
              {
                type: "application/ld+json",
                children: serviceBreadcrumbJsonLd("ar", loaderData.title, slug),
              },
              {
                type: "application/ld+json",
                children: serviceSchemaJsonLd("ar", loaderData.title, description, slug),
              },
            ]
          : [],
    };
  },
  component: ArabicServiceDetailRoute,
});

function ArabicServiceDetailRoute() {
  const { slug } = Route.useParams();
  return <ServiceDetailPage locale="ar" slug={slug} />;
}
