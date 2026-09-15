/** Shared SEO helpers for the bilingual Wijhan site. */

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
  { property: "og:site_name", content: "وِجهان | Wijhan" },
  { name: "content-language", content: "ar" },
];

/** Locale meta shared by every English page. */
export const englishLocaleMeta = [
  { property: "og:locale", content: "en_US" },
  { property: "og:locale:alternate", content: "ar_AR" },
  { property: "og:site_name", content: "Wijhan | وِجهان" },
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
export const arabicOrganizationJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://wijhan.com/#organization",
  name: "وِجهان",
  alternateName: ["Wijhan", "وجهان"],
  url: "https://wijhan.com/ar",
  slogan: "نفهم العمل قبل كتابة الكود.",
  description:
    "وِجهان شركة هندسة منتجات رقمية تساعد الشركات ورواد الأعمال في الشرق الأوسط والعالم على فهم منتجاتهم الرقمية وتصميمها وبنائها وتطويرها.",
  knowsLanguage: ["ar", "en"],
  areaServed: serviceArea.map((name) => ({ "@type": "Place", name })),
  makesOffer: [
    "اكتشاف المنتج",
    "تصميم المنتج",
    "هندسة البرمجيات",
    "حلول تخطيط موارد المؤسسات ERP",
    "ضمان الجودة",
    "إدارة المشاريع والتسليم",
  ].map((name) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name, areaServed: serviceArea },
  })),
});

/** Professional service data used on the Arabic services page. */
export const arabicServiceJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "وِجهان لهندسة المنتجات الرقمية",
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

/** Breadcrumb trail for an Arabic inner page. */
export function arabicBreadcrumbJsonLd(name: string, path: string) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://wijhan.com/ar" },
      { "@type": "ListItem", position: 2, name, item: `https://wijhan.com${path}` },
    ],
  });
}
