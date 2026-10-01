import { createFileRoute } from "@tanstack/react-router";
import { ArabicProcessPage } from "@/components/arabic-pages";
import { breadcrumbJsonLd, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/ar/process")({
  head: () =>
    pageHead({
      locale: "ar",
      enPath: "/process",
      title: "منهجية العمل في تطوير المنتجات الرقمية | وجهان",
      description:
        "منهجية وجهان في تطوير المنتجات الرقمية: نفهم، نحدّد، نصمّم، نهندس، نتحقق، ونطوّر — منهجية واضحة لعملاء في الشرق الأوسط والأسواق العالمية.",
      keywords:
        "منهجية تطوير المنتجات، مراحل تطوير البرمجيات، Agile، Scrum، إدارة المشاريع التقنية، هندسة المنتجات",
      jsonLd: [breadcrumbJsonLd("ar", [{ name: "منهجية العمل", enPath: "/process" }])],
    }),
  component: ArabicProcessPage,
});
