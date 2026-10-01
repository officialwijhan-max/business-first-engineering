import { describe, expect, it } from "vitest";
import {
  SITE_URL,
  absoluteUrl,
  arabicPath,
  aboutOrganizationJsonLd,
  breadcrumbJsonLd,
  caseStudySchemaJsonLd,
  faqJsonLd,
  lacksArabic,
  languageAlternates,
  organizationJsonLd,
  pageHead,
  websiteJsonLd,
} from "./seo";

type Tag = Record<string, string>;
const meta = (head: { meta: Tag[] }, key: "name" | "property", value: string) =>
  head.meta.find((tag) => tag[key] === value)?.content;

describe("URL helpers", () => {
  it("uses the https www origin with no trailing slash", () => {
    expect(SITE_URL).toBe("https://www.wijhan.com");
    expect(absoluteUrl("/")).toBe("https://www.wijhan.com");
    expect(absoluteUrl("")).toBe("https://www.wijhan.com");
    expect(absoluteUrl("/ar")).toBe("https://www.wijhan.com/ar");
    expect(absoluteUrl("work/x")).toBe("https://www.wijhan.com/work/x");
  });

  it("maps English paths to /ar paths", () => {
    expect(arabicPath("/")).toBe("/ar");
    expect(arabicPath("/services/erp-solutions")).toBe("/ar/services/erp-solutions");
  });
});

describe("pageHead", () => {
  const en = pageHead({
    locale: "en",
    enPath: "/services",
    title: "Product Engineering Services | Wijhan",
    description: "d".repeat(100),
  });
  const ar = pageHead({
    locale: "ar",
    enPath: "/services",
    title: "خدمات هندسة المنتجات الرقمية | وجهان",
    description: "د".repeat(100),
  });

  it("emits a self-referencing absolute canonical per language", () => {
    expect(en.links.find((l) => l.rel === "canonical")?.href).toBe(
      "https://www.wijhan.com/services",
    );
    expect(ar.links.find((l) => l.rel === "canonical")?.href).toBe(
      "https://www.wijhan.com/ar/services",
    );
  });

  it("emits the same reciprocal en/ar/x-default cluster on both language versions", () => {
    const cluster = (head: typeof en) =>
      head.links.filter((l) => l.rel === "alternate").map((l) => [l.hrefLang, l.href]);
    expect(cluster(en)).toEqual([
      ["en", "https://www.wijhan.com/services"],
      ["ar", "https://www.wijhan.com/ar/services"],
      ["x-default", "https://www.wijhan.com/services"],
    ]);
    expect(cluster(ar)).toEqual(cluster(en));
    expect(languageAlternates("/")[0]?.href).toBe("https://www.wijhan.com");
  });

  it("fills Open Graph and Twitter cards with absolute URLs", () => {
    expect(meta(en, "property", "og:url")).toBe("https://www.wijhan.com/services");
    expect(meta(ar, "property", "og:url")).toBe("https://www.wijhan.com/ar/services");
    expect(meta(en, "property", "og:image")).toBe("https://www.wijhan.com/og/wijhan-en.png");
    expect(meta(ar, "property", "og:image")).toBe("https://www.wijhan.com/og/wijhan-ar.png");
    expect(meta(en, "property", "og:image:width")).toBe("1200");
    expect(meta(en, "property", "og:image:height")).toBe("630");
    expect(meta(en, "property", "og:locale")).toBe("en_US");
    expect(meta(en, "property", "og:locale:alternate")).toBe("ar_AR");
    expect(meta(ar, "property", "og:locale")).toBe("ar_AR");
    expect(meta(ar, "property", "og:locale:alternate")).toBe("en_US");
    expect(meta(en, "name", "twitter:card")).toBe("summary_large_image");
    expect(meta(en, "name", "twitter:image")).toBe("https://www.wijhan.com/og/wijhan-en.png");
  });

  it("is indexable by default and noindex without hreflang when asked", () => {
    expect(meta(en, "name", "robots")).toBeUndefined();
    const hidden = pageHead({
      locale: "ar",
      enPath: "/work/x",
      title: "t".repeat(40),
      description: "d".repeat(80),
      noindex: true,
    });
    expect(meta(hidden, "name", "robots")).toBe("noindex, follow");
    expect(hidden.links.filter((l) => l.rel === "alternate")).toHaveLength(0);
  });

  it("uses a real cover image for articles and drops the generic card dimensions", () => {
    const article = pageHead({
      locale: "en",
      enPath: "/work/x",
      title: "t".repeat(40),
      description: "d".repeat(80),
      type: "article",
      image: "https://cdn.example.org/cover.jpg",
      publishedTime: "2026-09-19T15:03:59+00:00",
    });
    expect(meta(article, "property", "og:type")).toBe("article");
    expect(meta(article, "property", "og:image")).toBe("https://cdn.example.org/cover.jpg");
    expect(meta(article, "property", "og:image:width")).toBeUndefined();
    expect(meta(article, "property", "article:published_time")).toBe("2026-09-19T15:03:59+00:00");
  });
});

describe("JSON-LD", () => {
  const parse = (s: string) => JSON.parse(s) as Record<string, unknown>;

  it("never contains localhost or non-canonical origins", () => {
    const docs = [
      organizationJsonLd("en"),
      organizationJsonLd("ar"),
      websiteJsonLd("en"),
      aboutOrganizationJsonLd("en"),
      breadcrumbJsonLd("ar", [{ name: "x", enPath: "/services" }]),
    ];
    for (const doc of docs) {
      expect(doc).not.toMatch(/localhost|127\.0\.0\.1|example\.com/);
      const origins = doc.match(/https?:\/\/[^/"\\]+/g) ?? [];
      for (const origin of origins) {
        expect(["https://schema.org", "https://www.wijhan.com"]).toContain(origin);
      }
    }
  });

  it("describes the Organization with logo and contact point, and omits sameAs when empty", () => {
    const org = parse(organizationJsonLd("en"));
    expect(org["@type"]).toBe("Organization");
    expect(org["url"]).toBe("https://www.wijhan.com");
    expect(org["logo"]).toMatchObject({ url: "https://www.wijhan.com/icon-512.png" });
    expect(org["contactPoint"]).toBeTruthy();
    expect("sameAs" in org).toBe(false);
  });

  it("builds a numbered breadcrumb ending at the page, localized", () => {
    const crumbs = parse(
      breadcrumbJsonLd("ar", [
        { name: "الخدمات", enPath: "/services" },
        { name: "ERP", enPath: "/services/erp-solutions" },
      ]),
    );
    const items = crumbs["itemListElement"] as { position: number; item: string }[];
    expect(items.map((i) => i.position)).toEqual([1, 2, 3]);
    expect(items[0]?.item).toBe("https://www.wijhan.com/ar");
    expect(items[2]?.item).toBe("https://www.wijhan.com/ar/services/erp-solutions");
  });

  it("only includes a case-study image when the cover is an absolute https URL", () => {
    const base = {
      title: "T",
      headline: "H",
      summary: "S",
      slug: "t",
      category: "C",
      published_at: "2026-01-01T00:00:00Z",
    };
    expect(
      "image" in parse(caseStudySchemaJsonLd("en", { ...base, cover_image_url: "/x.png" })),
    ).toBe(false);
    expect(
      parse(caseStudySchemaJsonLd("en", { ...base, cover_image_url: "https://cdn.test/x.png" }))[
        "image"
      ],
    ).toBe("https://cdn.test/x.png");
  });

  it("builds FAQPage from the given questions only", () => {
    const faq = parse(faqJsonLd("en", [{ question: "Q?", answer: "A." }]));
    expect(faq["@type"]).toBe("FAQPage");
    expect(faq["mainEntity"]).toHaveLength(1);
  });

  it("cannot be used to break out of the script tag", () => {
    const doc = breadcrumbJsonLd("en", [
      { name: "</script><script>alert(1)</script>", enPath: "/x" },
    ]);
    expect(doc).not.toContain("</script>");
    expect(doc).not.toContain("<");
    expect(JSON.parse(doc)).toBeTruthy();
  });
});

describe("lacksArabic", () => {
  it("flags English fallback text and ignores missing values", () => {
    expect(lacksArabic("A connected sports platform")).toBe(true);
    expect(lacksArabic("منصة رياضية متكاملة", "تطبيق واحد")).toBe(false);
    expect(lacksArabic("منصة", "English fallback")).toBe(true);
    expect(lacksArabic(null, undefined, "")).toBe(false);
  });
});
