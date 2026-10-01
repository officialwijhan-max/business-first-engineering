import { createFileRoute } from "@tanstack/react-router";
import { WorkPage } from "@/components/work-page";
import { useCategorySearchParam } from "@/components/project-listing";
import { workQueryOptions } from "@/hooks/use-work";
import type { CaseStudy } from "@/api/types";
import { englishLocaleMeta, languageAlternates, workItemListJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/work/")({
  loader: async ({ context: { queryClient } }) => {
    const data = await queryClient.ensureQueryData(workQueryOptions("en")).catch(() => null);
    return data?.case_studies ?? ([] as CaseStudy[]);
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: "Our Work | Wijhan" },
      {
        name: "description",
        content:
          "Selected digital products designed, engineered, and shipped by Wijhan: web platforms, mobile apps, and business systems.",
      },
      { property: "og:title", content: "Our Work | Wijhan" },
      {
        property: "og:description",
        content:
          "Selected digital products designed, engineered, and shipped by Wijhan: web platforms, mobile apps, and business systems.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/work" },
      { name: "twitter:card", content: "summary_large_image" },
      ...englishLocaleMeta,
    ],
    links: [{ rel: "canonical", href: "/work" }, ...languageAlternates("/work", "/ar/work")],
    scripts: [
      { type: "application/ld+json", children: workItemListJsonLd("en", loaderData ?? []) },
    ],
  }),
  component: WorkRoute,
});

function WorkRoute() {
  const [activeCategory, changeCategory] = useCategorySearchParam();

  return <WorkPage locale="en" activeCategory={activeCategory} onCategoryChange={changeCategory} />;
}
