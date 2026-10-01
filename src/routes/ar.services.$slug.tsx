import { createFileRoute, notFound } from "@tanstack/react-router";
import { ServiceDetailPage } from "@/components/service-detail-page";
import { servicesQueryOptions } from "@/hooks/use-services";
import { getServiceSeo } from "@/content/service-seo";
import { breadcrumbJsonLd, lacksArabic, pageHead, serviceSchemaJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/ar/services/$slug")({
  loader: async ({ params, context: { queryClient } }) => {
    const services = await queryClient.ensureQueryData(servicesQueryOptions("ar"));
    const service = services.find((item) => item.slug === params.slug);
    if (!service) throw notFound();
    return service;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const seo = getServiceSeo(loaderData.slug, "ar");
    const title = seo?.title ?? `${loaderData.title} | خدمات وجهان`;
    const description =
      seo?.description ?? `${loaderData.summary}. خدمة هندسة منتجات رقمية من وجهان.`;
    const enPath = `/services/${loaderData.slug}`;

    return pageHead({
      locale: "ar",
      enPath,
      title,
      description,
      // The API falls back to English for a missing `_ar` field; never index that as Arabic.
      noindex: lacksArabic(loaderData.title, loaderData.summary),
      jsonLd: [
        breadcrumbJsonLd("ar", [
          { name: "الخدمات", enPath: "/services" },
          { name: loaderData.title, enPath },
        ]),
        serviceSchemaJsonLd("ar", loaderData.title, description, loaderData.slug),
      ],
    });
  },
  component: ArabicServiceDetailRoute,
});

function ArabicServiceDetailRoute() {
  const { slug } = Route.useParams();
  return <ServiceDetailPage locale="ar" slug={slug} />;
}
