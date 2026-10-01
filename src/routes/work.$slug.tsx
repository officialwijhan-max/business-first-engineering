import { createFileRoute } from "@tanstack/react-router";
import { ProjectDetailPage } from "@/components/project-detail-page";
import { caseStudyQueryOptions } from "@/hooks/use-case-study";
import { rethrowAsNotFound } from "@/lib/route-data";
import { breadcrumbJsonLd, caseStudySchemaJsonLd, ogImageFromCover, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/work/$slug")({
  // API 404 → real HTTP 404; any other failure → HTTP 500 (see lib/route-data.ts).
  loader: ({ params, context: { queryClient } }) =>
    queryClient.ensureQueryData(caseStudyQueryOptions("en", params.slug)).catch(rethrowAsNotFound),
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const title = loaderData.category
      ? `${loaderData.title} — ${loaderData.category} Platform | Wijhan`
      : `${loaderData.title} | Wijhan Case Study`;
    const enPath = `/work/${loaderData.slug}`;

    return pageHead({
      locale: "en",
      enPath,
      title,
      description: loaderData.summary,
      type: "article",
      image: ogImageFromCover(loaderData.cover_image_url),
      publishedTime: loaderData.published_at,
      jsonLd: [
        breadcrumbJsonLd("en", [
          { name: "Selected Work", enPath: "/work" },
          { name: loaderData.title, enPath },
        ]),
        caseStudySchemaJsonLd("en", loaderData),
      ],
    });
  },
  component: CaseStudyDetailPage,
});

function CaseStudyDetailPage() {
  const { slug } = Route.useParams();
  const loaderData = Route.useLoaderData();
  return <ProjectDetailPage locale="en" slug={slug} initialData={loaderData} />;
}
