import { createFileRoute } from "@tanstack/react-router";
import { ArabicContactPage } from "@/components/arabic-pages";
import { contactFaqsAr } from "@/content/contact-faq";
import { breadcrumbJsonLd, faqJsonLd, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/ar/contact")({
  head: () =>
    pageHead({
      locale: "ar",
      enPath: "/contact",
      title: "تواصل معنا | ابدأ مشروعك الرقمي مع وجهان",
      description:
        "أخبر وجهان بما تريد بناءه أو تحسينه أو حله، وابدأ محادثة حول منتجك الرقمي. نعمل مع شركات في الخليج ومصر والشرق الأوسط والأسواق العالمية.",
      keywords: "تواصل مع وجهان، ابدأ مشروع، طلب عرض سعر تطوير برمجيات، شريك تقني في الشرق الأوسط",
      jsonLd: [
        breadcrumbJsonLd("ar", [{ name: "تواصل معنا", enPath: "/contact" }]),
        faqJsonLd("ar", contactFaqsAr),
      ],
    }),
  component: ArabicContactPage,
});
