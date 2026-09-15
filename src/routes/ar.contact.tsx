import { createFileRoute } from "@tanstack/react-router";
import { ArabicContactPage } from "@/components/arabic-pages";

export const Route = createFileRoute("/ar/contact")({
  head: () => ({ meta: [
    { title: "ابدأ مشروعاً | تواصل مع وِجهان" },
    { name: "description", content: "أخبر وِجهان بما تريد بناءه أو تحسينه أو حله، وابدأ محادثة حول هندسة منتجك." },
    { property: "og:title", content: "ابدأ مشروعاً | تواصل مع وِجهان" },
    { property: "og:description", content: "لنبدأ بفهم المشكلة أولاً." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/ar/contact" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/ar/contact" }] }),
  component: ArabicContactPage,
});