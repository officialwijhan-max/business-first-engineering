import type { CaseStudy, Locale, Service } from "@/api/types";
import { basedIn, foundedYear, team } from "@/content/about";

/** Shared SEO helpers for the bilingual Wijhan site. */

/**
 * Serializes structured data for an inline <script type="application/ld+json">.
 * The router injects script children as raw HTML, so any "<" in API-supplied
 * text (e.g. "</script><script>…") would break out of the tag. Escaping it as
 * \u003c keeps the JSON identical for parsers while making breakout impossible.
 */
function jsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

/** Language alternates for a page pair. Relative URLs resolve against the live host. */
export function languageAlternates(enPath: string, arPath: string) {
  return [
    { rel: "alternate", hrefLang: "en", href: enPath },
    { rel: "alternate", hrefLang: "ar", href: arPath },
    { rel: "alternate", hrefLang: "ar-SA", href: arPath },
    { rel: "alternate", hrefLang: "ar-AE", href: arPath },
    { rel: "alternate", hrefLang: "ar-EG", href: arPath },
    { rel: "alternate", hrefLang: "x-default", href: enPath },
  ];
}

/** Locale meta shared by every Arabic page. */
export const arabicLocaleMeta = [
  { property: "og:locale", content: "ar_AR" },
  { property: "og:locale:alternate", content: "en_US" },
  { property: "og:site_name", content: "وجهان | Wijhan" },
  { name: "content-language", content: "ar" },
];

/** Locale meta shared by every English page. */
export const englishLocaleMeta = [
  { property: "og:locale", content: "en_US" },
  { property: "og:locale:alternate", content: "ar_AR" },
  { property: "og:site_name", content: "Wijhan | وجهان" },
];

const serviceArea = [
  "Saudi Arabia",
  "United Arab Emirates",
  "Qatar",
  "Kuwait",
  "Bahrain",
  "Oman",
  "Egypt",
  "Jordan",
  "Middle East",
  "Worldwide",
];

/** Organization data in Arabic, including the regions Wijhan serves. */
export const arabicOrganizationJsonLd = jsonLd({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://wijhan.com/#organization",
  name: "وجهان",
  alternateName: ["Wijhan", "وجهان"],
  url: "https://wijhan.com/ar",
  slogan: "نفهم العمل قبل كتابة الكود.",
  description:
    "وجهان شركة هندسة منتجات رقمية تساعد الشركات ورواد الأعمال في الشرق الأوسط والعالم على فهم منتجاتهم الرقمية وتصميمها وبنائها وتطويرها.",
  knowsLanguage: ["ar", "en"],
  areaServed: serviceArea.map((name) => ({ "@type": "Place", name })),
  makesOffer: [
    "الحلول والبرمجيات المخصصة",
    "تطبيقات الموبايل",
    "البوابات والمواقع",
    "تصميم واجهات وتجربة المستخدم",
    "تكامل الأنظمة",
    "حلول ERP",
  ].map((name) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name, areaServed: serviceArea },
  })),
});

/** Professional service data used on the Arabic services page. */
export const arabicServiceJsonLd = jsonLd({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "وجهان لهندسة المنتجات الرقمية",
  url: "https://wijhan.com/ar/services",
  inLanguage: "ar",
  areaServed: serviceArea,
  serviceType: [
    "تطوير البرمجيات",
    "تطوير تطبيقات الويب",
    "تطوير تطبيقات الجوال",
    "أنظمة ERP",
    "تصميم تجربة المستخدم",
    "ضمان الجودة",
  ],
});

/** Organization data in English, including the regions Wijhan serves. */
export const englishOrganizationJsonLd = jsonLd({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://wijhan.com/#organization",
  name: "Wijhan",
  alternateName: ["وجهان", "وجهان"],
  url: "https://wijhan.com",
  slogan: "We understand the business before writing the code.",
  description:
    "Wijhan is a product engineering company that helps businesses and entrepreneurs in the Middle East and worldwide understand, design, build and evolve their digital products.",
  knowsLanguage: ["en", "ar"],
  areaServed: serviceArea.map((name) => ({ "@type": "Place", name })),
  makesOffer: [
    "Custom Software",
    "Mobile Applications",
    "Portals & Websites",
    "UI/UX Design",
    "System Integration",
    "ERP Solutions",
  ].map((name) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name, areaServed: serviceArea },
  })),
});

/** Professional service data used on the English services page. */
export const englishServiceJsonLd = jsonLd({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Wijhan Product Engineering",
  url: "https://wijhan.com/services",
  inLanguage: "en",
  areaServed: serviceArea,
  serviceType: [
    "Software Development",
    "Web Application Development",
    "Mobile Application Development",
    "ERP Systems",
    "UX/UI Design",
    "Quality Assurance",
  ],
});

/** ItemList JSON-LD generated from the same API service records rendered by the Services page. */
export function servicesItemListJsonLd(
  locale: Locale,
  services: Pick<Service, "title" | "summary" | "slug">[],
) {
  const basePath = locale === "ar" ? "/ar/services" : "/services";
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: locale === "ar" ? "خدمات وجهان" : "Wijhan Services",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.title,
        description: service.summary,
        url: `https://wijhan.com${basePath}/${service.slug}`,
        provider: { "@id": "https://wijhan.com/#organization" },
        inLanguage: locale,
      },
    })),
  });
}

/** ItemList JSON-LD generated from the published projects shown on the Work page. */
export function workItemListJsonLd(
  locale: Locale,
  projects: Pick<CaseStudy, "title" | "summary" | "slug" | "category" | "industry">[],
  listName?: string,
) {
  const basePath = locale === "ar" ? "/ar/work" : "/work";
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName ?? (locale === "ar" ? "أعمال وجهان" : "Wijhan Work"),
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: project.title,
        description: project.summary,
        url: `https://wijhan.com${basePath}/${project.slug}`,
        ...(project.category || project.industry
          ? { about: project.category ?? project.industry }
          : {}),
        inLanguage: locale,
      },
    })),
  });
}

/** Breadcrumb trail for an Arabic inner page. */
export function arabicBreadcrumbJsonLd(name: string, path: string) {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://wijhan.com/ar" },
      { "@type": "ListItem", position: 2, name, item: `https://wijhan.com${path}` },
    ],
  });
}

/** Breadcrumb trail for an English inner page. */
export function englishBreadcrumbJsonLd(name: string, path: string) {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://wijhan.com" },
      { "@type": "ListItem", position: 2, name, item: `https://wijhan.com${path}` },
    ],
  });
}

/** Breadcrumb trail for a bilingual Service detail page (/services/:slug). */
export function serviceBreadcrumbJsonLd(locale: "en" | "ar", title: string, slug: string) {
  const path = locale === "ar" ? `/ar/services/${slug}` : `/services/${slug}`;
  const servicesLabel = locale === "ar" ? "خدماتنا" : "Services";
  const servicesPath = locale === "ar" ? "/ar/services" : "/services";
  const homeLabel = locale === "ar" ? "الرئيسية" : "Home";
  const homePath = locale === "ar" ? "/ar" : "";

  return jsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: homeLabel, item: `https://wijhan.com${homePath}` },
      {
        "@type": "ListItem",
        position: 2,
        name: servicesLabel,
        item: `https://wijhan.com${servicesPath}`,
      },
      { "@type": "ListItem", position: 3, name: title, item: `https://wijhan.com${path}` },
    ],
  });
}

/** schema.org Service structured data for a Service detail page. */
export function serviceSchemaJsonLd(
  locale: "en" | "ar",
  title: string,
  description: string,
  slug: string,
) {
  const path = locale === "ar" ? `/ar/services/${slug}` : `/services/${slug}`;
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    description,
    url: `https://wijhan.com${path}`,
    provider: { "@id": "https://wijhan.com/#organization" },
    areaServed: serviceArea,
    inLanguage: locale,
  });
}

/**
 * Minimal Organization JSON-LD for the About page (name, url, logo), adding
 * `founder`/`address` only when those facts are actually present in
 * src/content/about.ts — never guessed. Deliberately smaller than
 * {@link englishOrganizationJsonLd}/{@link arabicOrganizationJsonLd}, which
 * carry the full service catalog for the homepage.
 */
export function aboutOrganizationJsonLd(locale: Locale) {
  const arabic = locale === "ar";
  const founders = team.filter((member) => member.tier === "founder");
  const founderField =
    founders.length === 0
      ? {}
      : founders.length === 1
        ? {
            founder: {
              "@type": "Person",
              name: arabic ? founders[0]!.name.ar : founders[0]!.name.en,
            },
          }
        : {
            founder: founders.map((member) => ({
              "@type": "Person",
              name: arabic ? member.name.ar : member.name.en,
            })),
          };
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://wijhan.com/#organization",
    name: arabic ? "وجهان" : "Wijhan",
    url: arabic ? "https://wijhan.com/ar/about" : "https://wijhan.com/about",
    logo: "https://wijhan.com/favicon.png",
    ...founderField,
    ...(basedIn
      ? { address: { "@type": "PostalAddress", addressLocality: arabic ? basedIn.ar : basedIn.en } }
      : {}),
    ...(foundedYear ? { foundingDate: String(foundedYear) } : {}),
  });
}

/** Breadcrumb + Article JSON-LD for a bilingual Case Study detail page. */
export function caseStudyBreadcrumbJsonLd(locale: "en" | "ar", title: string, slug: string) {
  const path = locale === "ar" ? `/ar/work/${slug}` : `/work/${slug}`;
  const workLabel = locale === "ar" ? "أعمالنا" : "Selected Work";
  const workPath = locale === "ar" ? "/ar/work" : "/work";
  const homeLabel = locale === "ar" ? "الرئيسية" : "Home";
  const homePath = locale === "ar" ? "/ar" : "";

  return jsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: homeLabel, item: `https://wijhan.com${homePath}` },
      { "@type": "ListItem", position: 2, name: workLabel, item: `https://wijhan.com${workPath}` },
      { "@type": "ListItem", position: 3, name: title, item: `https://wijhan.com${path}` },
    ],
  });
}
