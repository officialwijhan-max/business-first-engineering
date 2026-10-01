import { createFileRoute, notFound } from "@tanstack/react-router";
import { ServiceDetailPage } from "@/components/service-detail-page";
import { servicesQueryOptions } from "@/hooks/use-services";
import { getServiceSeo } from "@/content/service-seo";
import { breadcrumbJsonLd, pageHead, serviceSchemaJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/services/$slug")({
  // Unknown slug → real HTTP 404 (not a 200 "not found" page); API failure → HTTP 500.
  loader: async ({ params, context: { queryClient } }) => {
    const services = await queryClient.ensureQueryData(servicesQueryOptions("en"));
    const service = services.find((item) => item.slug === params.slug);
    if (!service) throw notFound();
    return service;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const seo = getServiceSeo(loaderData.slug, "en");
    const title = seo?.title ?? `${loaderData.title} | Wijhan Services`;
    const description =
      seo?.description ?? `${loaderData.summary}. A Wijhan product engineering service.`;
    const enPath = `/services/${loaderData.slug}`;

    return pageHead({
      locale: "en",
      enPath,
      title,
      description,
      jsonLd: [
        breadcrumbJsonLd("en", [
          { name: "Services", enPath: "/services" },
          { name: loaderData.title, enPath },
        ]),
        serviceSchemaJsonLd("en", loaderData.title, description, loaderData.slug),
      ],
    });
  },
  component: ServiceDetailRoute,
});

function ServiceDetailRoute() {
  const { slug } = Route.useParams();
  return <ServiceDetailPage locale="en" slug={slug} />;
}
