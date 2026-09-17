import { createFileRoute } from "@tanstack/react-router";
import { ArabicPricingPage } from "@/components/arabic-pages";
import { arabicBreadcrumbJsonLd, arabicLocaleMeta, languageAlternates } from "@/lib/seo";

export const Route = createFileRoute("/ar/pricing")({
  head: () => ({
    meta: [
      { title: "الأسعار ونماذج التعاون | وِجهان" },
      {
        name: "description",
        content:
          "كيف تحتسب وِجهان تكلفة اكتشاف المنتج والتصميم والهندسة: دورات اكتشاف بسعر ثابت، وبناء منتجات بنطاق محدد، وشراكات شهرية — بأسعار واضحة تُحدد حسب النطاق.",
      },
      {
        name: "keywords",
        content:
          "أسعار تطوير البرمجيات، تكلفة تطوير تطبيق، سعر تصميم منتج رقمي، تكلفة نظام ERP، أسعار شركات البرمجة في السعودية والإمارات ومصر، عقد تطوير برمجيات شهري",
      },
      { property: "og:title", content: "الأسعار ونماذج التعاون | وِجهان" },
      { property: "og:description", content: "نماذج تعاون شفافة للاكتشاف والتصميم والهندسة." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/ar/pricing" },
      { name: "twitter:card", content: "summary_large_image" },
      ...arabicLocaleMeta,
    ],
    links: [{ rel: "canonical", href: "/ar/pricing" }, ...languageAlternates("/pricing", "/ar/pricing")],
    scripts: [{ type: "application/ld+json", children: arabicBreadcrumbJsonLd("الأسعار", "/ar/pricing") }],
  }),
  component: ArabicPricingPage,
});
