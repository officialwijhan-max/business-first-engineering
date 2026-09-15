import { createFileRoute } from "@tanstack/react-router";
import { ArabicAboutPage } from "@/components/arabic-pages";

export const Route = createFileRoute("/ar/about")({
  head: () => ({ meta: [
    { title: "عن وِجهان | العمل قبل التقنية" },
    { name: "description", content: "اكتشف لماذا تبدأ وِجهان بفهم العمل قبل تصميم المنتجات وهندسة البرمجيات." },
    { property: "og:title", content: "عن وِجهان | العمل قبل التقنية" },
    { property: "og:description", content: "لا نبدأ بالتقنية، بل نبدأ بالفهم." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/ar/about" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/ar/about" }] }),
  component: ArabicAboutPage,
});