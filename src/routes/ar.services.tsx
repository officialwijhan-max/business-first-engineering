import { createFileRoute } from "@tanstack/react-router";
import { ArabicServicesPage } from "@/components/arabic-pages";

export const Route = createFileRoute("/ar/services")({
  head: () => ({ meta: [
    { title: "خدمات هندسة المنتجات | وِجهان" },
    { name: "description", content: "اكتشاف المنتجات وتصميمها وهندسة البرمجيات وحلول ERP وضمان الجودة وإدارة التسليم من وِجهان." },
    { property: "og:title", content: "خدمات هندسة المنتجات | وِجهان" },
    { property: "og:description", content: "من فهم العمل إلى منتجات رقمية قابلة للتوسع." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/ar/services" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/ar/services" }] }),
  component: ArabicServicesPage,
});