import { createFileRoute } from "@tanstack/react-router";
import { ArabicProcessPage } from "@/components/arabic-pages";

export const Route = createFileRoute("/ar/process")({
  head: () => ({ meta: [
    { title: "منهجية هندسة المنتجات | وِجهان" },
    { name: "description", content: "كيف تفهم وِجهان المنتجات الرقمية وتحددها وتصممها وتهندسها وتتحقق منها وتطورها." },
    { property: "og:title", content: "منهجية هندسة المنتجات | وِجهان" },
    { property: "og:description", content: "نفهم أولاً، ثم نبني، ونطوّر باستمرار." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/ar/process" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/ar/process" }] }),
  component: ArabicProcessPage,
});