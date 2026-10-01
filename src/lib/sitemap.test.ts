import { describe, expect, it } from "vitest";
import { STATIC_PAGES, buildSitemapEntries, buildSitemapXml } from "./sitemap";

const service = (slug: string, ar = false) => ({
  slug,
  title: ar ? "عنوان الخدمة" : "Service title",
  summary: ar ? "ملخص الخدمة" : "Service summary",
});

const input = {
  buildTime: "2026-10-01T10:00:00.000Z",
  services: {
    en: [service("erp-solutions"), service("ui-ux")],
    ar: [service("erp-solutions", true), service("ui-ux")], // ui-ux fell back to English
  },
  work: {
    en: [{ slug: "egyptian-coach", published_at: "2026-09-19T15:03:59+00:00" }],
    ar: [
      { slug: "egyptian-coach", summary: "منصة رياضية", published_at: "2026-09-19T15:03:59+00:00" },
    ],
  },
};

describe("sitemap", () => {
  const entries = buildSitemapEntries(input);
  const byLoc = new Map(entries.map((e) => [e.loc, e]));

  it("lists every static page in both languages plus dynamic pages", () => {
    for (const path of STATIC_PAGES) {
      const en = path === "/" ? "https://www.wijhan.com" : `https://www.wijhan.com${path}`;
      const ar = path === "/" ? "https://www.wijhan.com/ar" : `https://www.wijhan.com/ar${path}`;
      expect(byLoc.has(en)).toBe(true);
      expect(byLoc.has(ar)).toBe(true);
    }
    expect(byLoc.has("https://www.wijhan.com/services/erp-solutions")).toBe(true);
    expect(byLoc.has("https://www.wijhan.com/ar/services/erp-solutions")).toBe(true);
    expect(byLoc.has("https://www.wijhan.com/work/egyptian-coach")).toBe(true);
    expect(byLoc.has("https://www.wijhan.com/ar/work/egyptian-coach")).toBe(true);
  });

  it("uses absolute canonical URLs only, without trailing slashes", () => {
    for (const entry of entries) {
      expect(entry.loc.startsWith("https://www.wijhan.com")).toBe(true);
      expect(entry.loc.endsWith("/")).toBe(false);
      expect(entry.loc).not.toMatch(/localhost|127\.0\.0\.1/);
    }
    expect(new Set(entries.map((e) => e.loc)).size).toBe(entries.length);
  });

  it("gives each language pair identical, reciprocal hreflang sets", () => {
    for (const entry of entries) {
      if (entry.alternates.length === 0) continue;
      expect(entry.alternates.map((a) => a.hreflang)).toEqual(["en", "ar", "x-default"]);
      for (const alt of entry.alternates) {
        expect(byLoc.get(alt.href)?.alternates).toEqual(entry.alternates);
      }
    }
  });

  it("does not publish an Arabic URL whose API text fell back to English", () => {
    expect(byLoc.has("https://www.wijhan.com/services/ui-ux")).toBe(true);
    expect(byLoc.get("https://www.wijhan.com/services/ui-ux")?.alternates).toEqual([]);
    expect(byLoc.has("https://www.wijhan.com/ar/services/ui-ux")).toBe(false);
  });

  it("uses published_at for a case study and a W3C date everywhere", () => {
    expect(byLoc.get("https://www.wijhan.com/work/egyptian-coach")?.lastmod).toBe("2026-09-19");
    for (const entry of entries) expect(entry.lastmod).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(byLoc.get("https://www.wijhan.com/about")?.lastmod).toBe("2026-10-01");
  });

  it("renders valid XML with the xhtml namespace and escapes special characters", () => {
    const xml = buildSitemapXml({
      ...input,
      work: { en: [{ slug: "a&b", published_at: null }], ar: [] },
    });
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
    expect(xml).toContain("/work/a&amp;b");
    expect(xml).not.toContain("/work/a&b");
    expect(xml.match(/<url>/g)?.length).toBe(xml.match(/<\/url>/g)?.length);
  });
});
