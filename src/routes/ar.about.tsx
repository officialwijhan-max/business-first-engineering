import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/about-page";
import {
  aboutOrganizationJsonLd,
  arabicBreadcrumbJsonLd,
  arabicLocaleMeta,
  languageAlternates,
} from "@/lib/seo";

export const Route = createFileRoute("/ar/about")({
  head: () => ({
    meta: [
      { title: "عن وجهان | شركة هندسة منتجات رقمية" },
      {
        name: "description",
        content:
          "وجهان شركة هندسة منتجات رقمية تساعد المؤسسين والشركات على تحويل مشكلاتهم الحقيقية إلى منتجات رقمية قابلة للتوسع.",
      },
      { property: "og:title", content: "عن وجهان | شركة هندسة منتجات رقمية" },
      {
        property: "og:description",
        content:
          "وجهان شركة هندسة منتجات رقمية تساعد المؤسسين والشركات على تحويل مشكلاتهم الحقيقية إلى منتجات رقمية قابلة للتوسع.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/ar/about" },
      { name: "twitter:card", content: "summary_large_image" },
      ...arabicLocaleMeta,
    ],
    links: [{ rel: "canonical", href: "/ar/about" }, ...languageAlternates("/about", "/ar/about")],
    scripts: [
      { type: "application/ld+json", children: arabicBreadcrumbJsonLd("عن وجهان", "/ar/about") },
      { type: "application/ld+json", children: aboutOrganizationJsonLd("ar") },
    ],
  }),
  component: () => <AboutPage locale="ar" />,
});
