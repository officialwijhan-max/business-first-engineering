import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home-page";
import { organizationJsonLd, pageHead, websiteJsonLd } from "@/lib/seo";

const title = "Wijhan — Product Engineering Company";
const description =
  "Wijhan helps founders and businesses turn real business problems into well-designed, scalable digital products.";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      locale: "en",
      enPath: "/",
      title,
      description,
      keywords:
        "Product Engineering, Digital Product Development, Software Engineering, ERP Solutions, Laravel Development, PHP Development, Mobile App Development, Technology Partner",
      jsonLd: [organizationJsonLd("en"), websiteJsonLd("en")],
    }),
  component: () => <HomePage locale="en" />,
});
