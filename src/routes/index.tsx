import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home-page";
import { englishLocaleMeta, englishOrganizationJsonLd, languageAlternates } from "@/lib/seo";

const title = "Wijhan — Product Engineering Company";
const description =
  "Wijhan helps founders and businesses turn real business problems into well-designed, scalable digital products.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "Product Engineering, Digital Product Development, Software Engineering, ERP Solutions, Laravel Development, PHP Development, Mobile App Development, Technology Partner",
      },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      ...englishLocaleMeta,
    ],
    links: [{ rel: "canonical", href: "/" }, ...languageAlternates("/", "/ar")],
    scripts: [{ type: "application/ld+json", children: englishOrganizationJsonLd }],
  }),
  component: () => <HomePage locale="en" />,
});
