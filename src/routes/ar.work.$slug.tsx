import { createFileRoute } from "@tanstack/react-router";
import { ArabicCaseStudyPage } from "@/components/arabic-pages";
import { caseStudyQueryOptions } from "@/hooks/use-case-study";
import { arabicLocaleMeta, caseStudyBreadcrumbJsonLd, languageAlternates } from "@/lib/seo";

export const Route = createFileRoute("/ar/work/$slug")({
  loader: async ({ params, context: { queryClient } }) => {
    // Failures (404, network, 5xx) are surfaced by the page's own
    // not-found/DataState branches via useCaseStudy — the loader only
    // exists to warm the cache for dynamic head() metadata.
    return queryClient.ensureQueryData(caseStudyQueryOptions("ar", params.slug)).catch(() => null);
  },
  head: ({ loaderData }) => {
    const title = loaderData
      ? loaderData.category
        ? `${loaderData.title} — منصة ${loaderData.category} | وجهان`
        : `${loaderData.title} | دراسة حالة وجهان`
      : "دراسة حالة | وجهان";
    const description = loaderData?.summary ?? "دراسة حالة من هندسة المنتجات لدى وجهان.";
    const slug = loaderData?.slug ?? "";

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/ar/work/${slug}` },
        ...(loaderData?.cover_image_url
          ? [{ property: "og:image", content: loaderData.cover_image_url }]
          : []),
        { name: "twitter:card", content: "summary_large_image" },
        ...(loaderData ? [] : [{ name: "robots", content: "noindex" }]),
        ...arabicLocaleMeta,
      ],
      links: slug
        ? [
            { rel: "canonical", href: `/ar/work/${slug}` },
            ...languageAlternates(`/work/${slug}`, `/ar/work/${slug}`),
          ]
        : [],
      scripts: loaderData
        ? [
            {
              type: "application/ld+json",
              children: caseStudyBreadcrumbJsonLd("ar", loaderData.title, loaderData.slug),
            },
          ]
        : [],
    };
  },
  component: ArabicCaseStudyPage,
});
