import { createFileRoute } from "@tanstack/react-router";
import { WorkPage } from "@/components/work-page";
import { useCategorySearchParam } from "@/components/project-listing";
import { workQueryOptions } from "@/hooks/use-work";
import type { CaseStudy } from "@/api/types";
import { arabicLocaleMeta, languageAlternates, workItemListJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/ar/work/")({
  loader: async ({ context: { queryClient } }) => {
    const data = await queryClient.ensureQueryData(workQueryOptions("ar")).catch(() => null);
    return data?.case_studies ?? ([] as CaseStudy[]);
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: "أعمالنا | وجهان" },
      {
        name: "description",
        content:
          "مختارات من المنتجات الرقمية التي صمّمتها وبنتها وأطلقتها وجهان: منصات الويب، تطبيقات الموبايل، وأنظمة الأعمال.",
      },
      { property: "og:title", content: "أعمالنا | وجهان" },
      {
        property: "og:description",
        content:
          "مختارات من المنتجات الرقمية التي صمّمتها وبنتها وأطلقتها وجهان: منصات الويب، تطبيقات الموبايل، وأنظمة الأعمال.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/ar/work" },
      { name: "twitter:card", content: "summary_large_image" },
      ...arabicLocaleMeta,
    ],
    links: [{ rel: "canonical", href: "/ar/work" }, ...languageAlternates("/work", "/ar/work")],
    scripts: [
      { type: "application/ld+json", children: workItemListJsonLd("ar", loaderData ?? []) },
    ],
  }),
  component: ArabicWorkRoute,
});

function ArabicWorkRoute() {
  const [activeCategory, changeCategory] = useCategorySearchParam();

  return <WorkPage locale="ar" activeCategory={activeCategory} onCategoryChange={changeCategory} />;
}
