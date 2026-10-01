import { createFileRoute } from "@tanstack/react-router";
import { CaseStudiesPage, pickFeaturedProject } from "@/components/case-studies-page";
import { useCategorySearchParam } from "@/components/project-listing";
import { caseStudyQueryOptions } from "@/hooks/use-case-study";
import { workQueryOptions } from "@/hooks/use-work";
import { englishLocaleMeta, languageAlternates, workItemListJsonLd } from "@/lib/seo";

const title = "Customer Outcomes | Wijhan";
const description =
  "Real digital products Wijhan has designed, engineered, and shipped for founders and growing businesses.";

export const Route = createFileRoute("/case-studies")({
  loader: async ({ context: { queryClient } }) => {
    const work = await queryClient.ensureQueryData(workQueryOptions("en")).catch(() => null);
    const featured = work ? pickFeaturedProject(work.case_studies) : null;
    const featuredDetail = featured
      ? await queryClient
          .ensureQueryData(caseStudyQueryOptions("en", featured.slug))
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
      { property: "og:url", content: "/case-studies" },
      { name: "twitter:card", content: "summary_large_image" },
      ...englishLocaleMeta,
    ],
    links: [
      { rel: "canonical", href: "/case-studies" },
      ...languageAlternates("/case-studies", "/ar/case-studies"),
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: workItemListJsonLd(
          "en",
          loaderData?.work?.case_studies ?? [],
          "Wijhan Case Studies",
        ),
      },
    ],
  }),
  component: CaseStudiesRoute,
});

function CaseStudiesRoute() {
  const { work, featuredDetail } = Route.useLoaderData();
  const [activeCategory, changeCategory] = useCategorySearchParam();

  return (
    <CaseStudiesPage
      locale="en"
      initialWork={work}
      initialFeaturedDetail={featuredDetail}
      activeCategory={activeCategory}
      onCategoryChange={changeCategory}
    />
  );
}
