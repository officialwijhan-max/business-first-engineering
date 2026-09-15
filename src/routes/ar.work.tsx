import { createFileRoute } from "@tanstack/react-router";
import { ArabicWorkPage } from "@/components/arabic-pages";
import { arabicBreadcrumbJsonLd, arabicLocaleMeta, languageAlternates } from "@/lib/seo";

export const Route = createFileRoute("/ar/work")({
  head: () => ({
    meta: [
      { title: "أعمالنا | أنظمة ERP ومنصات ومنتجات رقمية | وِجهان" },
      {
        name: "description",
        content:
          "أنواع الأنظمة والمنتجات الرقمية التي تبنيها وِجهان: أنظمة ERP، الرعاية الصحية، الزراعة، التجارة الإلكترونية، تطبيقات الجوال، منصات الحجز والتقنية المالية في الشرق الأوسط والعالم.",
      },
      {
        name: "keywords",
        content: "أعمال، دراسات حالة، أنظمة ERP، منصات رقمية، تطبيقات جوال، تجارة إلكترونية، تقنية مالية، الشرق الأوسط",
      },
      { property: "og:title", content: "أعمالنا | أنظمة ERP ومنصات ومنتجات رقمية | وِجهان" },
      { property: "og:description", content: "أعمال مختارة في هندسة المنتجات من وِجهان." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/ar/work" },
      { name: "twitter:card", content: "summary_large_image" },
      ...arabicLocaleMeta,
    ],
    links: [{ rel: "canonical", href: "/ar/work" }, ...languageAlternates("/work", "/ar/work")],
    scripts: [{ type: "application/ld+json", children: arabicBreadcrumbJsonLd("أعمالنا", "/ar/work") }],
  }),
  component: ArabicWorkPage,
});
