import type { CaseStudy, CaseStudyDetail, Locale, Service } from "@/api/types";
import { basedIn, foundedYear, team } from "@/content/about";

/** Shared SEO helpers for the bilingual Wijhan site. */

/**
 * The one canonical origin: https, www, no trailing slash. `wijhan.com` (apex) and `http://`
 * 301 to it (see src/lib/canonical-redirect.ts and docs/hosting). Every canonical, hreflang,
 * Open Graph URL, sitemap entry and JSON-LD URL is built from this constant — never write
 * the domain inline elsewhere.
 */
export const SITE_URL = "https://www.wijhan.com";

export const CONTACT_EMAIL = "hello@wijhan.com";
/** E.164, as already published on the contact page. */
export const CONTACT_PHONE = "+201000580504";

/**
 * Public social/profile URLs for Organization `sameAs`. Left empty on purpose: none are
 * published anywhere on the site, and structured data must not claim profiles that aren't
 * confirmed. Add the real URLs here and they flow into the JSON-LD automatically.
 */
export const SOCIAL_PROFILES: readonly string[] = [];

export const OG_IMAGE = {
  en: {
    path: "/og/wijhan-en.png",
    alt: "Wijhan — We understand the business before writing the code.",
  },
  ar: { path: "/og/wijhan-ar.png", alt: "وجهان — نفهم العمل قبل كتابة الكود." },
} as const;
const OG_IMAGE_WIDTH = "1200";
const OG_IMAGE_HEIGHT = "630";

/** Absolute URL on the canonical origin. `/` (and "") is the bare origin, no trailing slash. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  if (path === "" || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** `/services` → `/ar/services`, `/` → `/ar`. */
export function arabicPath(enPath: string): string {
  return enPath === "/" || enPath === "" ? "/ar" : `/ar${enPath}`;
}

export function localizedPath(locale: Locale, enPath: string): string {
  return locale === "ar" ? arabicPath(enPath) : enPath;
}

/**
 * hreflang cluster for a page that exists in both languages. Reciprocal by construction (both
 * language versions emit the same three links) and identical to the sitemap's xhtml:link set.
 */
export function languageAlternates(enPath: string, arPath: string = arabicPath(enPath)) {
  return [
    { rel: "alternate", hrefLang: "en", href: absoluteUrl(enPath) },
    { rel: "alternate", hrefLang: "ar", href: absoluteUrl(arPath) },
    { rel: "alternate", hrefLang: "x-default", href: absoluteUrl(enPath) },
  ];
}

/**
 * Serializes structured data for an inline <script type="application/ld+json">.
 * The router injects script children as raw HTML, so any "<" in API-supplied
 * text (e.g. "</script><script>…") would break out of the tag. Escaping it as
 * a JSON unicode escape keeps the JSON identical for parsers while making breakout
 * impossible. U+2028/U+2029 are escaped too: legal in JSON, line terminators in JavaScript.
 */
const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

function jsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .split(LINE_SEPARATOR)
    .join("\\u2028")
    .split(PARAGRAPH_SEPARATOR)
    .join("\\u2029");
}

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const SITE_NAME = { en: "Wijhan | وجهان", ar: "وجهان | Wijhan" } as const;

type MetaTag = Record<string, string>;
type LinkTag = Record<string, string>;
type ScriptTag = { type: "application/ld+json"; children: string };

export interface PageHeadInput {
  locale: Locale;
  /** English path of the page, e.g. `/services/erp-solutions` (`/` for home). */
  enPath: string;
  title: string;
  description: string;
  keywords?: string;
  /** Open Graph type. Case studies use `article`. */
  type?: "website" | "article";
  /** Absolute https image URL for this page; defaults to the branded 1200×630 card. */
  image?: string | null;
  /** Serialized JSON-LD documents (already passed through `jsonLd`). */
  jsonLd?: string[];
  /** Admin/test/empty states: `noindex, follow` and no hreflang pair. */
  noindex?: boolean;
  publishedTime?: string | null;
}

/**
 * The complete <head> SEO set for one page: title, description, absolute self-referencing
 * canonical, en/ar/x-default hreflang, Open Graph + Twitter, and JSON-LD.
 */
export function pageHead({
  locale,
  enPath,
  title,
  description,
  keywords,
  type = "website",
  image,
  jsonLd: documents = [],
  noindex = false,
  publishedTime,
}: PageHeadInput) {
  const path = localizedPath(locale, enPath);
  const url = absoluteUrl(path);
  const defaultImage = OG_IMAGE[locale];
  const useDefaultImage = !image;
  const imageUrl = image ?? absoluteUrl(defaultImage.path);
  const alternateLocale = locale === "ar" ? "en_US" : "ar_AR";

  const meta: MetaTag[] = [
    { title },
    { name: "description", content: description },
    ...(keywords ? [{ name: "keywords", content: keywords }] : []),
    ...(noindex ? [{ name: "robots", content: "noindex, follow" }] : []),
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:site_name", content: SITE_NAME[locale] },
    { property: "og:locale", content: locale === "ar" ? "ar_AR" : "en_US" },
    { property: "og:locale:alternate", content: alternateLocale },
    { property: "og:image", content: imageUrl },
    ...(useDefaultImage
      ? [
          { property: "og:image:width", content: OG_IMAGE_WIDTH },
          { property: "og:image:height", content: OG_IMAGE_HEIGHT },
          { property: "og:image:type", content: "image/png" },
          { property: "og:image:alt", content: defaultImage.alt },
        ]
      : []),
    ...(type === "article" && publishedTime
      ? [{ property: "article:published_time", content: publishedTime }]
      : []),
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
  ];

  const links: LinkTag[] = [
    { rel: "canonical", href: url },
    ...(noindex ? [] : languageAlternates(enPath)),
  ];

  const scripts: ScriptTag[] = documents.map((children) => ({
    type: "application/ld+json",
    children,
  }));

  return { meta, links, scripts };
}

/** Case-study cover images can be relative to the API host; only absolute https URLs are used for OG. */
export function ogImageFromCover(coverUrl: string | null | undefined): string | null {
  return coverUrl && /^https:\/\//i.test(coverUrl) ? coverUrl : null;
}

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

const ORGANIZATION_COPY = {
  en: {
    name: "Wijhan",
    alternateName: ["وجهان"],
    slogan: "We understand the business before writing the code.",
    description:
      "Wijhan is a product engineering company that helps businesses and entrepreneurs in the Middle East and worldwide understand, design, build and evolve their digital products.",
    knowsLanguage: ["en", "ar"],
    offers: [
      "Custom Software",
      "Mobile Applications",
      "Portals & Websites",
      "UI/UX Design",
      "System Integration",
      "ERP Solutions",
    ],
  },
  ar: {
    name: "وجهان",
    alternateName: ["Wijhan"],
    slogan: "نفهم العمل قبل كتابة الكود.",
    description:
      "وجهان شركة هندسة منتجات رقمية تساعد الشركات ورواد الأعمال في الشرق الأوسط والعالم على فهم منتجاتهم الرقمية وتصميمها وبنائها وتطويرها.",
    knowsLanguage: ["ar", "en"],
    offers: [
      "الحلول والبرمجيات المخصصة",
      "تطبيقات الموبايل",
      "البوابات والمواقع",
      "تصميم واجهات وتجربة المستخدم",
      "تكامل الأنظمة",
      "حلول ERP",
    ],
  },
} as const;

/** Organization (home pages): identity, logo, contact point and the regions/services it offers. */
export function organizationJsonLd(locale: Locale) {
  const copy = ORGANIZATION_COPY[locale];
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: copy.name,
    alternateName: copy.alternateName,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/icon-512.png"),
      width: 512,
      height: 512,
    },
    slogan: copy.slogan,
    description: copy.description,
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: CONTACT_EMAIL,
        telephone: CONTACT_PHONE,
        availableLanguage: ["English", "Arabic"],
      },
    ],
    ...(SOCIAL_PROFILES.length > 0 ? { sameAs: [...SOCIAL_PROFILES] } : {}),
    knowsLanguage: copy.knowsLanguage,
    areaServed: serviceArea.map((name) => ({ "@type": "Place", name })),
    makesOffer: copy.offers.map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name, areaServed: serviceArea },
    })),
  });
}

/** WebSite (home pages). No SearchAction: the site has no search to point at. */
export function websiteJsonLd(locale: Locale) {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: ORGANIZATION_COPY[locale].name,
    alternateName: ORGANIZATION_COPY[locale].alternateName,
    inLanguage: ["en", "ar"],
    publisher: { "@id": ORGANIZATION_ID },
  });
}

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
        url: absoluteUrl(`${basePath}/${service.slug}`),
        provider: { "@id": ORGANIZATION_ID },
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
        url: absoluteUrl(`${basePath}/${project.slug}`),
        ...(project.category || project.industry
          ? { about: project.category ?? project.industry }
          : {}),
        inLanguage: locale,
      },
    })),
  });
}

export interface BreadcrumbItem {
  name: string;
  /** English path; localized automatically. `/` is the home crumb. */
  enPath: string;
}

const HOME_LABEL = { en: "Home", ar: "الرئيسية" } as const;

/** BreadcrumbList for any inner page: Home → … → current page. */
export function breadcrumbJsonLd(locale: Locale, trail: BreadcrumbItem[]) {
  const items = [{ name: HOME_LABEL[locale], enPath: "/" }, ...trail];
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(localizedPath(locale, item.enPath)),
    })),
  });
}

/** schema.org Service structured data for a Service detail page. */
export function serviceSchemaJsonLd(
  locale: Locale,
  title: string,
  description: string,
  slug: string,
) {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    description,
    url: absoluteUrl(localizedPath(locale, `/services/${slug}`)),
    provider: { "@id": ORGANIZATION_ID },
    areaServed: serviceArea,
    inLanguage: locale,
  });
}

/**
 * CreativeWork for a case study. Only fields the API actually returns are emitted: no rating,
 * review or client claims, and `image` only when the cover is an absolute https URL.
 */
export function caseStudySchemaJsonLd(
  locale: Locale,
  study: Pick<
    CaseStudyDetail,
    "title" | "headline" | "summary" | "slug" | "category" | "published_at" | "cover_image_url"
  >,
) {
  const url = absoluteUrl(localizedPath(locale, `/work/${study.slug}`));
  const image = ogImageFromCover(study.cover_image_url);
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${url}#case-study`,
    name: study.title,
    headline: study.headline || study.title,
    description: study.summary,
    url,
    mainEntityOfPage: url,
    inLanguage: locale,
    ...(study.category ? { about: study.category } : {}),
    ...(study.published_at ? { datePublished: study.published_at } : {}),
    ...(image ? { image } : {}),
    creator: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
  });
}

/** FAQPage. Pass only questions that are rendered on the page, with the exact visible answers. */
export function faqJsonLd(locale: Locale, faqs: readonly { question: string; answer: string }[]) {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  });
}

/**
 * Organization JSON-LD for the About page: the same entity as the home page (`@id`), with
 * `founder`/`address`/`foundingDate` only when those facts are actually present in
 * src/content/about.ts — never guessed.
 */
export function aboutOrganizationJsonLd(locale: Locale) {
  const arabic = locale === "ar";
  const founders = team.filter((member) => member.tier === "founder");
  const founderField =
    founders.length === 0
      ? {}
      : {
          founder: founders.map((member) => ({
            "@type": "Person",
            name: arabic ? member.name.ar : member.name.en,
          })),
        };
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: arabic ? "وجهان" : "Wijhan",
    url: SITE_URL,
    logo: absoluteUrl("/icon-512.png"),
    ...(SOCIAL_PROFILES.length > 0 ? { sameAs: [...SOCIAL_PROFILES] } : {}),
    ...founderField,
    ...(basedIn
      ? { address: { "@type": "PostalAddress", addressLocality: arabic ? basedIn.ar : basedIn.en } }
      : {}),
    ...(foundedYear ? { foundingDate: String(foundedYear) } : {}),
  });
}

/**
 * True when any given text is present but contains no Arabic letters — i.e. the API served an
 * English fallback for a missing `_ar` field. Such a record must not become an indexable
 * Arabic URL (English body under a /ar canonical = mixed-language duplicate content).
 */
export function lacksArabic(...texts: (string | null | undefined)[]): boolean {
  return texts.some((text) => Boolean(text) && !/\p{Script=Arabic}/u.test(text as string));
}
