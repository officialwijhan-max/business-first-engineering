import { createFileRoute } from "@tanstack/react-router";
import { ArabicWorkPage } from "@/components/arabic-pages";

export const Route = createFileRoute("/ar/work")({
  head: () => ({ meta: [
    { title: "أعمال مختارة ودراسات حالة | وِجهان" },
    { name: "description", content: "استكشف أنواع أنظمة الأعمال والمنتجات الرقمية التي تساعد وِجهان على إنشائها." },
    { property: "og:title", content: "أعمال مختارة ودراسات حالة | وِجهان" },
    { property: "og:description", content: "أعمال مختارة في هندسة المنتجات من وِجهان." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/ar/work" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/ar/work" }] }),
  component: ArabicWorkPage,
});