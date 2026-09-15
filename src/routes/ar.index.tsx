import { createFileRoute } from "@tanstack/react-router";
import { ArabicHomePage } from "@/components/arabic-pages";

export const Route = createFileRoute("/ar/")({
  head: () => ({
    meta: [
      { title: "وِجهان | شركة هندسة منتجات رقمية" },
      { name: "description", content: "تساعد وِجهان الشركات على فهم المنتجات الرقمية وتصميمها وبنائها وتطويرها." },
      { name: "keywords", content: "هندسة المنتجات، تطوير المنتجات الرقمية، هندسة البرمجيات، أنظمة ERP، تطوير تطبيقات الهاتف، شريك تقني" },
      { property: "og:title", content: "وِجهان | شركة هندسة منتجات رقمية" },
      { property: "og:description", content: "فهم العمل قبل التقنية، والتفكير في المنتج قبل التطوير." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/ar" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/ar" }],
  }),
  component: ArabicHomePage,
});