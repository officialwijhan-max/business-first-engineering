import type { Locale } from "@/api/types";

/**
 * <title> and meta description for each /services/:slug page, in both languages.
 *
 * Kept apart from service-details.ts on purpose: route `head()` functions live in the main JS
 * bundle, and importing the 43 KB of page copy from there shipped it to every visitor. A slug with
 * no entry falls back to a title/description built from the API record (see the routes).
 */
export interface ServiceSeo {
  title: string;
  description: string;
}

const serviceSeo: Record<string, Record<Locale, ServiceSeo>> = {
  "custom-software": {
    en: {
      title: "Custom Software Development & Platforms | Wijhan",
      description:
        "Custom software, internal platforms and workflow engines for founders and growing businesses, engineered around how your business works.",
    },
    ar: {
      title: "تطوير البرمجيات والمنصات المخصصة | وجهان",
      description:
        "برمجيات ومنصات داخلية وأنظمة سير عمل مخصصة للمؤسسين والشركات النامية، مهندسة لتناسب طريقة عمل شركتك.",
    },
  },
  "mobile-apps": {
    en: {
      title: "Mobile App Development — iOS & Android | Wijhan",
      description:
        "Native iOS and Android apps plus Flutter and React Native. Arabic RTL, offline-first, built for growing businesses.",
    },
    ar: {
      title: "تطوير تطبيقات الموبايل — iOS وAndroid | وجهان",
      description:
        "تطبيقات iOS وAndroid الأصلية، بالإضافة إلى Flutter وReact Native. دعم العربية من اليمين إلى اليسار، تعمل بدون إنترنت، ومبنية للشركات النامية.",
    },
  },
  "portals-websites": {
    en: {
      title: "Web Portals & Website Development | Wijhan",
      description:
        "Corporate websites, customer portals, e-commerce, and PWAs. Arabic RTL, SEO-optimized, accessible, and built to scale.",
    },
    ar: {
      title: "تطوير بوابات ومواقع الويب | وجهان",
      description:
        "مواقع الشركات، وبوابات العملاء، والتجارة الإلكترونية، وتطبيقات PWA. دعم العربية من اليمين إلى اليسار، محسّنة لمحركات البحث، سهلة الوصول، ومبنية للتوسع.",
    },
  },
  "ui-ux": {
    en: {
      title: "UI/UX Design & Arabic RTL Interfaces | Wijhan",
      description:
        "Research-driven product design: wireframes, prototypes, design systems, Arabic RTL, and accessibility for web and mobile.",
    },
    ar: {
      title: "تصميم UI/UX وواجهات عربية من اليمين إلى اليسار | وجهان",
      description:
        "تصميم منتجات مبني على البحث: المخططات الأولية (wireframes)، نماذج أولية، أنظمة تصميم، العربية من اليمين إلى اليسار، وإمكانية وصول للويب والموبايل.",
    },
  },
  "system-integration": {
    en: {
      title: "System Integration & Middleware Development | Wijhan",
      description:
        "Connect ERP, CRM, legacy systems, and third-party APIs with secure middleware and data pipelines.",
    },
    ar: {
      title: "تطوير تكامل الأنظمة والوسيط البرمجي (Middleware) | وجهان",
      description:
        "اربط أنظمة ERP وCRM والأنظمة القديمة وواجهات API الخارجية عبر وسيط برمجي (middleware) آمن ومسارات بيانات.",
    },
  },
  "erp-solutions": {
    en: {
      title: "Custom ERP Solutions & Implementation | Wijhan",
      description:
        "Tailored ERP systems for operations, finance, inventory, sales, and HR: built around your workflows, with training and support.",
    },
    ar: {
      title: "حلول ERP مخصصة وتنفيذها | وجهان",
      description:
        "أنظمة ERP مخصصة للعمليات والمالية والمخزون والمبيعات والموارد البشرية، مبنية حول سير عملك، مع التدريب والدعم.",
    },
  },
};

export function getServiceSeo(slug: string, locale: Locale): ServiceSeo | undefined {
  return serviceSeo[slug]?.[locale];
}
