import { createFileRoute } from "@tanstack/react-router";
import { ArabicProcessPage } from "@/components/arabic-pages";
import { arabicBreadcrumbJsonLd, arabicLocaleMeta, languageAlternates } from "@/lib/seo";

export const Route = createFileRoute("/ar/process")({
  head: () => ({
    meta: [
      { title: "منهجية العمل في تطوير المنتجات الرقمية | وِجهان" },
      {
        name: "description",
        content:
          "منهجية وِجهان في تطوير المنتجات الرقمية: نفهم، نحدّد، نصمّم، نهندس، نتحقق، ونطوّر — منهجية واضحة لعملاء في الشرق الأوسط والأسواق العالمية.",
      },
      {
        name: "keywords",
        content: "منهجية تطوير المنتجات، مراحل تطوير البرمجيات، Agile، Scrum، إدارة المشاريع التقنية، هندسة المنتجات",
      },
      { property: "og:title", content: "منهجية العمل في تطوير المنتجات الرقمية | وِجهان" },
      { property: "og:description", content: "نفهم أولاً، ثم نبني، ونطوّر باستمرار." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/ar/process" },
      { name: "twitter:card", content: "summary_large_image" },
      ...arabicLocaleMeta,
    ],
    links: [{ rel: "canonical", href: "/ar/process" }, ...languageAlternates("/process", "/ar/process")],
    scripts: [{ type: "application/ld+json", children: arabicBreadcrumbJsonLd("منهجية العمل", "/ar/process") }],
  }),
  component: ArabicProcessPage,
});
