import { createFileRoute } from "@tanstack/react-router";
import { ArabicContactPage } from "@/components/arabic-pages";
import { arabicBreadcrumbJsonLd, arabicLocaleMeta, languageAlternates } from "@/lib/seo";

export const Route = createFileRoute("/ar/contact")({
  head: () => ({
    meta: [
      { title: "تواصل معنا | ابدأ مشروعك الرقمي مع وِجهان" },
      {
        name: "description",
        content:
          "أخبر وِجهان بما تريد بناءه أو تحسينه أو حله، وابدأ محادثة حول منتجك الرقمي. نعمل مع شركات في الخليج ومصر والشرق الأوسط والأسواق العالمية.",
      },
      {
        name: "keywords",
        content: "تواصل مع وِجهان، ابدأ مشروع، طلب عرض سعر تطوير برمجيات، شريك تقني في الشرق الأوسط",
      },
      { property: "og:title", content: "تواصل معنا | ابدأ مشروعك الرقمي مع وِجهان" },
      { property: "og:description", content: "لنبدأ بفهم المشكلة أولاً." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/ar/contact" },
      { name: "twitter:card", content: "summary_large_image" },
      ...arabicLocaleMeta,
    ],
    links: [{ rel: "canonical", href: "/ar/contact" }, ...languageAlternates("/contact", "/ar/contact")],
    scripts: [{ type: "application/ld+json", children: arabicBreadcrumbJsonLd("تواصل معنا", "/ar/contact") }],
  }),
  component: ArabicContactPage,
});
