import type { CaseStudy, Service } from "@/api/types";
import { absoluteUrl, arabicPath, lacksArabic } from "@/lib/seo";

/**
 * sitemap.xml generation. Pure (no I/O) so it can be unit-tested; the route in
 * src/routes/sitemap[.]xml.ts feeds it live API data, so a newly published case study or
 * service appears without a redeploy.
 */

/** English paths of the static public pages. Every one also exists under /ar. */
export const STATIC_PAGES = [
  "/",
  "/about",
  "/services",
  "/work",
  "/case-studies",
  "/process",
  "/contact",
] as const;

export interface SitemapInput {
  /** ISO timestamp of the deploy; lastmod for pages whose content lives in the code. */
  buildTime: string;
  services: {
    en: Pick<Service, "slug" | "title" | "summary">[];
    ar: Pick<Service, "slug" | "title" | "summary">[];
  };
  work: {
    en: Pick<CaseStudy, "slug" | "published_at">[];
    ar: (Pick<CaseStudy, "slug" | "summary" | "published_at"> & { headline?: string | null })[];
  };
}

export interface SitemapEntry {
  /** Absolute canonical URL. */
  loc: string;
  /** W3C date (YYYY-MM-DD). */
  lastmod: string;
  /** hreflang → absolute URL. Empty when the page has no translated counterpart. */
  alternates: { hreflang: string; href: string }[];
}

function toDate(value: string | null | undefined, fallback: string): string {
  const time = value ? Date.parse(value) : NaN;
  return new Date(Number.isNaN(time) ? Date.parse(fallback) : time).toISOString().slice(0, 10);
}

function latest(dates: string[]): string {
  return dates.reduce((max, date) => (date > max ? date : max));
}

function pair(enPath: string, lastmod: string, includeArabic = true): SitemapEntry[] {
  const en = absoluteUrl(enPath);
  const arPath = arabicPath(enPath);
  const ar = absoluteUrl(arPath);
  const alternates = includeArabic
    ? [
        { hreflang: "en", href: en },
        { hreflang: "ar", href: ar },
        { hreflang: "x-default", href: en },
      ]
    : [];
  return [
    { loc: en, lastmod, alternates },
    ...(includeArabic ? [{ loc: ar, lastmod, alternates }] : []),
  ];
}

export function buildSitemapEntries(input: SitemapInput): SitemapEntry[] {
  const build = toDate(input.buildTime, input.buildTime);
  const entries: SitemapEntry[] = [];

  const workDates = input.work.en.map((study) => toDate(study.published_at, input.buildTime));
  const listLastmod = latest([build, ...workDates]);

  for (const path of STATIC_PAGES) {
    const lastmod = path === "/work" || path === "/case-studies" ? listLastmod : build;
    entries.push(...pair(path, lastmod));
  }

  const arabicServices = new Map(input.services.ar.map((service) => [service.slug, service]));
  for (const service of input.services.en) {
    const ar = arabicServices.get(service.slug);
    const hasArabic = Boolean(ar) && !lacksArabic(ar?.title, ar?.summary);
    entries.push(...pair(`/services/${service.slug}`, build, hasArabic));
  }

  const arabicWork = new Map(input.work.ar.map((study) => [study.slug, study]));
  for (const study of input.work.en) {
    const ar = arabicWork.get(study.slug);
    const hasArabic = Boolean(ar) && !lacksArabic(ar?.summary, ar?.headline);
    entries.push(
      ...pair(`/work/${study.slug}`, toDate(study.published_at, input.buildTime), hasArabic),
    );
  }

  return entries;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function renderSitemapXml(entries: SitemapEntry[]): string {
  const urls = entries.map((entry) => {
    const links = entry.alternates
      .map(
        (alt) =>
          `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${escapeXml(alt.href)}" />`,
      )
      .join("\n");
    return [
      "  <url>",
      `    <loc>${escapeXml(entry.loc)}</loc>`,
      `    <lastmod>${entry.lastmod}</lastmod>`,
      ...(links ? [links] : []),
      "  </url>",
    ].join("\n");
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}

export function buildSitemapXml(input: SitemapInput): string {
  return renderSitemapXml(buildSitemapEntries(input));
}
