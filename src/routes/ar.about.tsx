import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/about-page";
import { aboutOrganizationJsonLd, breadcrumbJsonLd, pageHead } from "@/lib/seo";

const title = "عن وجهان | شركة هندسة منتجات رقمية";
const description =
  "وجهان شركة هندسة منتجات رقمية تساعد المؤسسين والشركات على تحويل مشكلاتهم الحقيقية إلى منتجات رقمية قابلة للتوسع.";

export const Route = createFileRoute("/ar/about")({
  head: () =>
    pageHead({
      locale: "ar",
      enPath: "/about",
      title,
      description,
      jsonLd: [
        breadcrumbJsonLd("ar", [{ name: "عن وجهان", enPath: "/about" }]),
        aboutOrganizationJsonLd("ar"),
      ],
    }),
  component: () => <AboutPage locale="ar" />,
});
