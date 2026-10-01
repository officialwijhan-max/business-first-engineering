import { createFileRoute } from "@tanstack/react-router";
import { ServicesPage } from "@/components/services-page";
import { servicesQueryOptions } from "@/hooks/use-services";
import { breadcrumbJsonLd, pageHead, servicesItemListJsonLd } from "@/lib/seo";

const title = "خدمات هندسة المنتجات الرقمية | وجهان";
const description =
  "حلول برمجية مخصصة، تطبيقات موبايل، بوابات ومواقع، تصميم UI/UX، تكامل الأنظمة، وحلول ERP مبنية حول عملك.";

export const Route = createFileRoute("/ar/services/")({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(servicesQueryOptions("ar")),
  head: ({ loaderData }) =>
    pageHead({
      locale: "ar",
      enPath: "/services",
      title,
      description,
      jsonLd: [
        breadcrumbJsonLd("ar", [{ name: "الخدمات", enPath: "/services" }]),
        servicesItemListJsonLd("ar", loaderData ?? []),
      ],
    }),
  component: ArabicServicesRoute,
});

function ArabicServicesRoute() {
  return <ServicesPage locale="ar" />;
}
