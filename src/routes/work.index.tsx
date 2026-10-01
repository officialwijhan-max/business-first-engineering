import { createFileRoute } from "@tanstack/react-router";
import { WorkPage } from "@/components/work-page";
import { useCategorySearchParam } from "@/components/project-listing";
import { workQueryOptions } from "@/hooks/use-work";
import { breadcrumbJsonLd, pageHead, workItemListJsonLd } from "@/lib/seo";

const title = "Selected Work — Digital Products by Wijhan";
const description =
  "Selected digital products designed, engineered, and shipped by Wijhan: web platforms, mobile apps, and business systems.";

export const Route = createFileRoute("/work/")({
  // An API failure surfaces as the 500 error page, not as a 200 page with an empty list.
  loader: async ({ context: { queryClient } }) =>
    (await queryClient.ensureQueryData(workQueryOptions("en"))).case_studies,
  head: ({ loaderData }) =>
    pageHead({
      locale: "en",
      enPath: "/work",
      title,
      description,
      jsonLd: [
        breadcrumbJsonLd("en", [{ name: "Selected Work", enPath: "/work" }]),
        workItemListJsonLd("en", loaderData ?? []),
      ],
    }),
  component: WorkRoute,
});

function WorkRoute() {
  const [activeCategory, changeCategory] = useCategorySearchParam();

  return <WorkPage locale="en" activeCategory={activeCategory} onCategoryChange={changeCategory} />;
}
