import { createFileRoute } from "@tanstack/react-router";
import { ArabicHomePage } from "@/components/arabic-pages";
import { arabicLocaleMeta, arabicOrganizationJsonLd, languageAlternates } from "@/lib/seo";

export const Route = createFileRoute("/ar/")({
  head: () => ({
    meta: [
      { title: "وِجهان | شركة هندسة منتجات رقمية وتطوير برمجيات" },
      {
        name: "description",
        content:
          "وِجهان شركة هندسة منتجات رقمية تساعد الشركات ورواد الأعمال في السعودية والإمارات ومصر والشرق الأوسط والعالم على فهم منتجاتهم الرقمية وتصميمها وبنائها وتطويرها.",
      },
      {
        name: "keywords",
        content:
          "شركة تطوير برمجيات، هندسة المنتجات الرقمية، تطوير تطبيقات الجوال، تطوير تطبيقات الويب، أنظمة ERP، برمجة Laravel، تصميم تجربة المستخدم، شريك تقني، شركة برمجة في السعودية، تطوير برمجيات الإمارات، تطوير برمجيات مصر، الشرق الأوسط",
      },
      { property: "og:title", content: "وِجهان | شركة هندسة منتجات رقمية وتطوير برمجيات" },
      {
        property: "og:description",
        content: "فهم العمل قبل التقنية، والتفكير في المنتج قبل التطوير — لعملاء في الشرق الأوسط والعالم.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/ar" },
      { name: "twitter:card", content: "summary_large_image" },
      ...arabicLocaleMeta,
    ],
    links: [{ rel: "canonical", href: "/ar" }, ...languageAlternates("/", "/ar")],
    scripts: [{ type: "application/ld+json", children: arabicOrganizationJsonLd }],
  }),
  component: ArabicHomePage,
});
