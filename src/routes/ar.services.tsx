import { createFileRoute } from "@tanstack/react-router";
import { ArabicServicesPage } from "@/components/arabic-pages";
import { arabicLocaleMeta, arabicServiceJsonLd, languageAlternates } from "@/lib/seo";

export const Route = createFileRoute("/ar/services")({
  head: () => ({
    meta: [
      { title: "خدمات تطوير البرمجيات وأنظمة ERP | وِجهان" },
      {
        name: "description",
        content:
          "خدمات وِجهان: اكتشاف المنتج، تصميم تجربة المستخدم، تطوير تطبيقات الويب والجوال، أنظمة ERP، ضمان الجودة وإدارة التسليم — لشركات الخليج ومصر والشرق الأوسط والعالم.",
      },
      {
        name: "keywords",
        content:
          "خدمات تطوير البرمجيات، تطوير تطبيقات الجوال، تطوير تطبيقات الويب، أنظمة ERP، تخصيص أنظمة ERP، تصميم واجهات المستخدم، ضمان الجودة، برمجة Laravel، شركة برمجة في السعودية والإمارات",
      },
      { property: "og:title", content: "خدمات تطوير البرمجيات وأنظمة ERP | وِجهان" },
      { property: "og:description", content: "من فهم العمل إلى منتجات رقمية قابلة للتوسع." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/ar/services" },
      { name: "twitter:card", content: "summary_large_image" },
      ...arabicLocaleMeta,
    ],
    links: [{ rel: "canonical", href: "/ar/services" }, ...languageAlternates("/services", "/ar/services")],
    scripts: [{ type: "application/ld+json", children: arabicServiceJsonLd }],
  }),
  component: ArabicServicesPage,
});
