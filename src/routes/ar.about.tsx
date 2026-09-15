import { createFileRoute } from "@tanstack/react-router";
import { ArabicAboutPage } from "@/components/arabic-pages";
import { arabicBreadcrumbJsonLd, arabicLocaleMeta, languageAlternates } from "@/lib/seo";

export const Route = createFileRoute("/ar/about")({
  head: () => ({
    meta: [
      { title: "عن وِجهان | شركة هندسة منتجات رقمية في الشرق الأوسط" },
      {
        name: "description",
        content:
          "تعرّف على وِجهان: شركة هندسة منتجات رقمية تبدأ بفهم العمل قبل التصميم والبرمجة، وتعمل مع شركات في الخليج ومصر والشرق الأوسط والأسواق العالمية.",
      },
      {
        name: "keywords",
        content: "عن وِجهان، شركة هندسة منتجات، شريك تقني، شركة برمجيات في الشرق الأوسط، تطوير المنتجات الرقمية",
      },
      { property: "og:title", content: "عن وِجهان | شركة هندسة منتجات رقمية في الشرق الأوسط" },
      { property: "og:description", content: "لا نبدأ بالتقنية، بل نبدأ بالفهم." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/ar/about" },
      { name: "twitter:card", content: "summary_large_image" },
      ...arabicLocaleMeta,
    ],
    links: [{ rel: "canonical", href: "/ar/about" }, ...languageAlternates("/about", "/ar/about")],
    scripts: [
      { type: "application/ld+json", children: arabicBreadcrumbJsonLd("عن وِجهان", "/ar/about") },
    ],
  }),
  component: ArabicAboutPage,
});
