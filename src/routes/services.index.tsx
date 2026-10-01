import { createFileRoute } from "@tanstack/react-router";
import { ServicesPage } from "@/components/services-page";
import { servicesQueryOptions } from "@/hooks/use-services";
import { breadcrumbJsonLd, pageHead, servicesItemListJsonLd } from "@/lib/seo";

const title = "Product Engineering Services | Wijhan";
const description =
  "Custom software, mobile apps, portals & websites, UI/UX design, system integration, and ERP solutions, built around your business.";

export const Route = createFileRoute("/services/")({
  // An API failure surfaces as the 500 error page, not as a 200 page with an empty list.
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(servicesQueryOptions("en")),
  head: ({ loaderData }) =>
    pageHead({
      locale: "en",
      enPath: "/services",
      title,
      description,
      jsonLd: [
        breadcrumbJsonLd("en", [{ name: "Services", enPath: "/services" }]),
        servicesItemListJsonLd("en", loaderData ?? []),
      ],
    }),
  component: ServicesRoute,
});

function ServicesRoute() {
  return <ServicesPage locale="en" />;
}
