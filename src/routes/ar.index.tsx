import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home-page";
import { arabicLocaleMeta, arabicOrganizationJsonLd, languageAlternates } from "@/lib/seo";

const title = "وجهان — شركة هندسة منتجات";
const description =
  "تساعد وجهان المؤسسين والشركات على تحويل مشكلات العمل الحقيقية إلى منتجات رقمية مصممة جيدًا وقابلة للتوسع.";

export const Route = createFileRoute("/ar/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "شركة تطوير برمجيات، هندسة المنتجات الرقمية، تطوير تطبيقات الجوال، تطوير تطبيقات الويب، أنظمة ERP، برمجة Laravel، تصميم تجربة المستخدم، شريك تقني، شركة برمجة في السعودية، تطوير برمجيات الإمارات، تطوير برمجيات مصر، الشرق الأوسط",
      },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/ar" },
      { name: "twitter:card", content: "summary_large_image" },
      ...arabicLocaleMeta,
    ],
    links: [{ rel: "canonical", href: "/ar" }, ...languageAlternates("/", "/ar")],
    scripts: [{ type: "application/ld+json", children: arabicOrganizationJsonLd }],
  }),
  component: () => <HomePage locale="ar" />,
});
