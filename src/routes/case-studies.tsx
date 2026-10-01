import { createFileRoute } from "@tanstack/react-router";
import { CaseStudiesPage, pickFeaturedProject } from "@/components/case-studies-page";
import { useCategorySearchParam } from "@/components/project-listing";
import { caseStudyQueryOptions } from "@/hooks/use-case-study";
import { workQueryOptions } from "@/hooks/use-work";
import { breadcrumbJsonLd, pageHead, workItemListJsonLd } from "@/lib/seo";

const title = "Customer Outcomes & Case Studies | Wijhan";
const description =
  "Real digital products Wijhan has designed, engineered, and shipped for founders and growing businesses.";

export const Route = createFileRoute("/case-studies")({
  loader: async ({ context: { queryClient } }) => {
    // An API failure for the list surfaces as the 500 error page; the optional featured
    // detail only enriches the page, so its failure is tolerated.
    const work = await queryClient.ensureQueryData(workQueryOptions("en"));
    const featured = pickFeaturedProject(work.case_studies);
    const featuredDetail = featured
      ? await queryClient
          .ensureQueryData(caseStudyQueryOptions("en", featured.slug))
          .catch(() => null)
      : null;
    return { work, featuredDetail };
  },
  head: ({ loaderData }) =>
    pageHead({
      locale: "en",
      enPath: "/case-studies",
      title,
      description,
      jsonLd: [
        breadcrumbJsonLd("en", [{ name: "Case Studies", enPath: "/case-studies" }]),
        workItemListJsonLd("en", loaderData?.work.case_studies ?? [], "Wijhan Case Studies"),
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
