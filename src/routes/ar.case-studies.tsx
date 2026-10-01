import { createFileRoute } from "@tanstack/react-router";
import { CaseStudiesPage } from "@/components/case-studies-page";
import { pickFeaturedProject } from "@/lib/featured-project";
import { useCategorySearchParam } from "@/components/project-listing";
import { caseStudyQueryOptions } from "@/hooks/use-case-study";
import { workQueryOptions } from "@/hooks/use-work";
import { breadcrumbJsonLd, pageHead, workItemListJsonLd } from "@/lib/seo";

const title = "نتائج عملائنا ودراسات الحالة | وجهان";
const description =
  "منتجات رقمية حقيقية صمّمتها وجهان وبنتها وأطلقتها للمؤسسين والشركات النامية في الشرق الأوسط والعالم.";

export const Route = createFileRoute("/ar/case-studies")({
  loader: async ({ context: { queryClient } }) => {
    const work = await queryClient.ensureQueryData(workQueryOptions("ar"));
    const featured = pickFeaturedProject(work.case_studies);
    const featuredDetail = featured
      ? await queryClient
          .ensureQueryData(caseStudyQueryOptions("ar", featured.slug))
          .catch(() => null)
      : null;
    return { work, featuredDetail };
  },
  head: ({ loaderData }) =>
    pageHead({
      locale: "ar",
      enPath: "/case-studies",
      title,
      description,
      jsonLd: [
        breadcrumbJsonLd("ar", [{ name: "دراسات الحالة", enPath: "/case-studies" }]),
        workItemListJsonLd("ar", loaderData?.work.case_studies ?? [], "دراسات حالة وجهان"),
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
