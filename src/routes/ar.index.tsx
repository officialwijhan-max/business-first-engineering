import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home-page";
import { organizationJsonLd, pageHead, websiteJsonLd } from "@/lib/seo";

const title = "وجهان — شركة هندسة منتجات رقمية";
const description =
  "تساعد وجهان المؤسسين والشركات على تحويل مشكلات العمل الحقيقية إلى منتجات رقمية مصممة جيدًا وقابلة للتوسع.";

export const Route = createFileRoute("/ar/")({
  head: () =>
    pageHead({
      locale: "ar",
      enPath: "/",
      title,
      description,
      keywords:
        "شركة تطوير برمجيات، هندسة المنتجات الرقمية، تطوير تطبيقات الجوال، تطوير تطبيقات الويب، أنظمة ERP، برمجة Laravel، تصميم تجربة المستخدم، شريك تقني، شركة برمجة في السعودية، تطوير برمجيات الإمارات، تطوير برمجيات مصر، الشرق الأوسط",
      jsonLd: [organizationJsonLd("ar"), websiteJsonLd("ar")],
    }),
  component: () => <HomePage locale="ar" />,
});
