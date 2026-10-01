import { createFileRoute } from "@tanstack/react-router";
import { ArabicCaseStudyPage } from "@/components/arabic-pages";
import { caseStudyQueryOptions } from "@/hooks/use-case-study";
import { rethrowAsNotFound } from "@/lib/route-data";
import {
  breadcrumbJsonLd,
  caseStudySchemaJsonLd,
  lacksArabic,
  ogImageFromCover,
  pageHead,
} from "@/lib/seo";

export const Route = createFileRoute("/ar/work/$slug")({
  loader: ({ params, context: { queryClient } }) =>
    queryClient.ensureQueryData(caseStudyQueryOptions("ar", params.slug)).catch(rethrowAsNotFound),
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const title = loaderData.category
      ? `${loaderData.title} — منصة ${loaderData.category} | وجهان`
      : `${loaderData.title} | دراسة حالة وجهان`;
    const enPath = `/work/${loaderData.slug}`;

    return pageHead({
      locale: "ar",
      enPath,
      title,
      description: loaderData.summary,
      type: "article",
      image: ogImageFromCover(loaderData.cover_image_url),
      publishedTime: loaderData.published_at,
      // The API falls back to English for a missing `_ar` field; never index that as Arabic.
      noindex: lacksArabic(loaderData.summary, loaderData.headline),
      jsonLd: [
        breadcrumbJsonLd("ar", [
          { name: "أعمالنا", enPath: "/work" },
          { name: loaderData.title, enPath },
        ]),
        caseStudySchemaJsonLd("ar", loaderData),
      ],
    });
  },
  component: ArabicCaseStudyPage,
});
