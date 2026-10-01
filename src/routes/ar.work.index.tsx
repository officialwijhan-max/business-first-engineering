import { createFileRoute } from "@tanstack/react-router";
import { WorkPage } from "@/components/work-page";
import { useCategorySearchParam } from "@/components/project-listing";
import { workQueryOptions } from "@/hooks/use-work";
import { breadcrumbJsonLd, pageHead, workItemListJsonLd } from "@/lib/seo";

const title = "أعمالنا | منتجات رقمية صمّمتها وبنتها وجهان";
const description =
  "مختارات من المنتجات الرقمية التي صمّمتها وبنتها وأطلقتها وجهان: منصات الويب، تطبيقات الموبايل، وأنظمة الأعمال.";

export const Route = createFileRoute("/ar/work/")({
  loader: async ({ context: { queryClient } }) =>
    (await queryClient.ensureQueryData(workQueryOptions("ar"))).case_studies,
  head: ({ loaderData }) =>
    pageHead({
      locale: "ar",
      enPath: "/work",
      title,
      description,
      jsonLd: [
        breadcrumbJsonLd("ar", [{ name: "أعمالنا", enPath: "/work" }]),
        workItemListJsonLd("ar", loaderData ?? []),
      ],
    }),
  component: ArabicWorkRoute,
});

function ArabicWorkRoute() {
  const [activeCategory, changeCategory] = useCategorySearchParam();

  return <WorkPage locale="ar" activeCategory={activeCategory} onCategoryChange={changeCategory} />;
}
