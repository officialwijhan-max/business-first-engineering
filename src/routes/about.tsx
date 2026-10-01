import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/about-page";
import { aboutOrganizationJsonLd, breadcrumbJsonLd, pageHead } from "@/lib/seo";

const title = "About Wijhan | Product Engineering Company";
const description =
  "Wijhan is a product engineering company helping founders and businesses turn real problems into scalable digital products.";

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      locale: "en",
      enPath: "/about",
      title,
      description,
      jsonLd: [
        breadcrumbJsonLd("en", [{ name: "About Wijhan", enPath: "/about" }]),
        aboutOrganizationJsonLd("en"),
      ],
    }),
  component: () => <AboutPage locale="en" />,
});
