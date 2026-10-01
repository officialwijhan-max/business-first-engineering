import { createFileRoute } from "@tanstack/react-router";
import { ProjectDetailPage } from "@/components/project-detail-page";
import { caseStudyQueryOptions } from "@/hooks/use-case-study";
import { caseStudyBreadcrumbJsonLd, englishLocaleMeta, languageAlternates } from "@/lib/seo";

export const Route = createFileRoute("/work/$slug")({
  loader: async ({ params, context: { queryClient } }) => {
    // Failures (404, network, 5xx) are surfaced by the page's own
    // not-found/DataState branches via useCaseStudy — the loader only
    // exists to warm the cache for dynamic head() metadata.
    return queryClient.ensureQueryData(caseStudyQueryOptions("en", params.slug)).catch(() => null);
  },
  head: ({ loaderData }) => {
    const title = loaderData
      ? loaderData.category
        ? `${loaderData.title} — ${loaderData.category} Platform | Wijhan`
        : `${loaderData.title} | Wijhan Case Study`
      : "Case Study | Wijhan";
    const description = loaderData?.summary ?? "A Wijhan product engineering case study.";
    const slug = loaderData?.slug ?? "";

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/work/${slug}` },
        ...(loaderData?.cover_image_url
          ? [{ property: "og:image", content: loaderData.cover_image_url }]
          : []),
        { name: "twitter:card", content: "summary_large_image" },
        ...(loaderData ? [] : [{ name: "robots", content: "noindex" }]),
        ...englishLocaleMeta,
      ],
      links: slug
        ? [
            { rel: "canonical", href: `/work/${slug}` },
            ...languageAlternates(`/work/${slug}`, `/ar/work/${slug}`),
          ]
        : [],
      scripts: loaderData
        ? [
            {
              type: "application/ld+json",
              children: caseStudyBreadcrumbJsonLd("en", loaderData.title, loaderData.slug),
            },
          ]
        : [],
    };
  },
  component: CaseStudyDetailPage,
});

function CaseStudyDetailPage() {
  const { slug } = Route.useParams();
  const loaderData = Route.useLoaderData();
  return <ProjectDetailPage locale="en" slug={slug} initialData={loaderData} />;
}
