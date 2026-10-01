import { createFileRoute } from "@tanstack/react-router";
import { CaseStudiesPage, pickFeaturedProject } from "@/components/case-studies-page";
import { useCategorySearchParam } from "@/components/project-listing";
import { caseStudyQueryOptions } from "@/hooks/use-case-study";
import { workQueryOptions } from "@/hooks/use-work";
import { arabicLocaleMeta, languageAlternates, workItemListJsonLd } from "@/lib/seo";

const title = "نتائج عملائنا | وجهان";
const description = "منتجات رقمية حقيقية صمّمتها وجهان وبنتها وأطلقتها للمؤسسين والشركات النامية.";

export const Route = createFileRoute("/ar/case-studies")({
  loader: async ({ context: { queryClient } }) => {
    const work = await queryClient.ensureQueryData(workQueryOptions("ar")).catch(() => null);
    const featured = work ? pickFeaturedProject(work.case_studies) : null;
    const featuredDetail = featured
      ? await queryClient
          .ensureQueryData(caseStudyQueryOptions("ar", featured.slug))
          .catch(() => null)
      : null;
    return { work, featuredDetail };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/ar/case-studies" },
      { name: "twitter:card", content: "summary_large_image" },
      ...arabicLocaleMeta,
    ],
    links: [
      { rel: "canonical", href: "/ar/case-studies" },
      ...languageAlternates("/case-studies", "/ar/case-studies"),
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: workItemListJsonLd(
          "ar",
          loaderData?.work?.case_studies ?? [],
          "دراسات حالة وجهان",
        ),
      },
    ],
  }),
  component: ArabicCaseStudiesRoute,
});

function ArabicCaseStudiesRoute() {
  const { work, featuredDetail } = Route.useLoaderData();
  const [activeCategory, changeCategory] = useCategorySearchParam();

  return (
    <CaseStudiesPage
      locale="ar"
      initialWork={work}
      initialFeaturedDetail={featuredDetail}
      activeCategory={activeCategory}
      onCategoryChange={changeCategory}
    />
  );
}
