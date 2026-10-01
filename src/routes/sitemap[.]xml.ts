import { createFileRoute } from "@tanstack/react-router";
import { fetchServices } from "@/api/services";
import { fetchWork } from "@/api/work";
import { buildSitemapXml } from "@/lib/sitemap";

declare const __BUILD_TIME__: string | undefined;

/** Deploy time injected by vite.config.ts; the sitemap's lastmod for code-defined pages. */
const BUILD_TIME = typeof __BUILD_TIME__ === "string" ? __BUILD_TIME__ : new Date().toISOString();

// Dynamic on purpose: case studies and services come from the API, so a new publication shows
// up here without a redeploy. If the API is unreachable we answer 503 (crawlers retry later)
// instead of serving a partial sitemap that silently drops the dynamic pages.
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const [servicesEn, servicesAr, workEn, workAr] = await Promise.all([
            fetchServices("en"),
            fetchServices("ar"),
            fetchWork("en"),
            fetchWork("ar"),
          ]);
          const xml = buildSitemapXml({
            buildTime: BUILD_TIME,
            services: { en: servicesEn, ar: servicesAr },
            work: { en: workEn.case_studies, ar: workAr.case_studies },
          });
          return new Response(xml, {
            headers: {
              "content-type": "application/xml; charset=utf-8",
              "cache-control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
            },
          });
        } catch (error) {
          console.error("sitemap.xml: API unavailable", error);
          return new Response("Sitemap temporarily unavailable", {
            status: 503,
            headers: { "retry-after": "600", "cache-control": "no-store" },
          });
        }
      },
    },
  },
});
