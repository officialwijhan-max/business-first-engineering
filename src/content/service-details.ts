/**
 * Detailed body content for the /services/:slug page, keyed by the same
 * `slug` the /services API returns (single source of truth for which
 * services exist — this file only supplies the extra copy that API doesn't
 * carry: capabilities, benefits, process). A slug with no entry here still
 * renders a full page — the hero (from the API) plus Other Services and the
 * contact form — just without the Capabilities/Benefits/Process sections,
 * rather than fabricated placeholder copy.
 */

export interface ServiceDetailCard {
  title: string;
  description: string;
}

export interface ServiceDetailCopy {
  /** Small uppercase label above the H1, e.g. "CUSTOM SOFTWARE DEVELOPMENT". */
  heroLabel: string;
  /** H1 split so the last phrase can render in copper, matching the homepage hero. */
  heroHeadlineLead: string;
  heroHeadlineAccent: string;
  heroParagraph: string;
  capabilitiesTitle?: string;
  capabilitiesSubtitle?: string;
  benefitsTitle?: string;
  benefitsSubtitle?: string;
  processTitle?: string;
  seoTitle?: string;
  seoDescription?: string;
  capabilities: ServiceDetailCard[];
  benefits: ServiceDetailCard[];
  process: ServiceDetailCard[];
}

export interface ServiceDetailContent {
  en: ServiceDetailCopy;
  ar: ServiceDetailCopy;
}

export const serviceDetailContent: Record<string, ServiceDetailContent> = {
  "custom-software": {
    en: {
      heroLabel: "CUSTOM SOFTWARE DEVELOPMENT",
      heroHeadlineLead: "Custom Software,",
      heroHeadlineAccent: "Built Around Your Business.",
      heroParagraph:
        "We design, build, and scale custom software for founders and growing businesses — from internal platforms and workflow engines to customer-facing products — engineered to fit the way your business actually works.",
      seoTitle: "Custom Software Development & Platforms | Wijhan",
      seoDescription:
        "Custom software, internal platforms and workflow engines for founders and growing businesses, engineered around how your business works.",
      capabilities: [
        {
          title: "Business Web Platforms",
          description:
            "Multi-tenant SaaS platforms, admin dashboards, and client portals with role-based access, audit trails, and automated reporting.",
        },
        {
          title: "Backend Systems & APIs",
          description:
            "Scalable REST and GraphQL APIs, service-oriented architectures, and real-time data processing.",
        },
        {
          title: "Database Design & Migration",
          description: "Clean schema design, legacy data modeling, and safe, zero-loss migrations.",
        },
        {
          title: "Workflow Automation",
          description:
            "Custom rule engines, multi-step approval flows, and document automation that remove manual work.",
        },
        {
          title: "Security & Reliability",
          description:
            "Encryption in transit and at rest, secure authentication, backups, monitoring, and centralized logging.",
        },
        {
          title: "Native Arabic & RTL Support",
          description:
            "Built for the region from day one: flawless RTL interfaces, bidirectional text, and culturally aware UX.",
        },
      ],
      benefits: [
        {
          title: "Business-First Architecture",
          description:
            "Every technical decision starts from your business goals, so the software solves real problems instead of adding complexity.",
        },
        {
          title: "Seamless Integration",
          description:
            "We connect the new system to your existing tools, ERPs, and databases without risking data or interrupting operations.",
        },
        {
          title: "Built to Scale",
          description:
            "Cloud-ready architectures designed to handle growth in users, data, and traffic without a rewrite.",
        },
      ],
      process: [
        {
          title: "Discovery & Scoping",
          description:
            "Stakeholder interviews, requirements gathering, feasibility assessment, and a clear project roadmap.",
        },
        {
          title: "Architecture & Design",
          description:
            "System architecture, database design, UI/UX wireframes, and technical specifications.",
        },
        {
          title: "Agile Development",
          description:
            "Two-week sprints with continuous delivery, code reviews, automated testing, and regular demos.",
        },
        {
          title: "Launch & Support",
          description:
            "Deployment, performance tuning, training, documentation, and ongoing support.",
        },
      ],
    },
    ar: {
      heroLabel: "تطوير برمجيات مخصصة",
      heroHeadlineLead: "برمجيات مخصصة،",
      heroHeadlineAccent: "مبنية حول عملك.",
      heroParagraph:
        "نصمّم ونبني ونطوّر برمجيات مخصصة للمؤسسين والشركات النامية، من المنصات الداخلية وأنظمة سير العمل إلى المنتجات الموجهة للعملاء، مهندسة لتناسب طريقة عمل شركتك فعلًا.",
      seoTitle: "تطوير البرمجيات والمنصات المخصصة | وجهان",
      seoDescription:
        "برمجيات ومنصات داخلية وأنظمة سير عمل مخصصة للمؤسسين والشركات النامية، مهندسة لتناسب طريقة عمل شركتك.",
      capabilities: [
        {
          title: "منصات الويب للأعمال",
          description:
            "منصات SaaS متعددة المستأجرين ولوحات تحكم وبوابات عملاء بصلاحيات مبنية على الأدوار وسجلات تدقيق وتقارير آلية.",
        },
        {
          title: "الأنظمة الخلفية وواجهات API",
          description: "واجهات REST وGraphQL قابلة للتوسع، ومعماريات خدمات، ومعالجة بيانات لحظية.",
        },
        {
          title: "تصميم قواعد البيانات والترحيل",
          description: "تصميم مخططات نظيفة، ونمذجة البيانات القديمة، وترحيل آمن بدون فقدان بيانات.",
        },
        {
          title: "أتمتة سير العمل",
          description:
            "محركات قواعد مخصصة، ودورات موافقات متعددة الخطوات، وأتمتة المستندات لإزالة العمل اليدوي.",
        },
        {
          title: "الأمان والموثوقية",
          description:
            "تشفير أثناء النقل وفي التخزين، ومصادقة آمنة، ونسخ احتياطي، ومراقبة، وسجلات مركزية.",
        },
        {
          title: "دعم أصيل للعربية والكتابة من اليمين إلى اليسار",
          description:
            "مبنية للمنطقة من اليوم الأول: واجهات سليمة من اليمين إلى اليسار، ونصوص ثنائية الاتجاه، وتجربة مستخدم تراعي الثقافة.",
        },
      ],
      benefits: [
        {
          title: "معمارية تبدأ من عملك",
          description:
            "يبدأ كل قرار تقني لدينا من أهداف عملك، لكي تحلّ البرمجيات مشكلات حقيقية بدل أن تزيد التعقيد.",
        },
        {
          title: "تكامل سلس مع أنظمتك",
          description:
            "نربط النظام الجديد بأدواتك وأنظمة الـERP وقواعد البيانات لديك دون المخاطرة ببياناتك أو تعطيل عملك.",
        },
        {
          title: "مبني ليتوسع معك",
          description:
            "معماريات جاهزة للسحابة مصممة لتتحمّل نمو المستخدمين والبيانات والزيارات دون الحاجة إلى إعادة بناء النظام من الصفر.",
        },
      ],
      process: [
        {
          title: "الاستكشاف وتحديد النطاق",
          description:
            "مقابلات مع أصحاب المصلحة، وجمع المتطلبات، وتقييم الجدوى، وخريطة طريق واضحة للمشروع.",
        },
        {
          title: "المعمارية والتصميم",
          description:
            "معمارية النظام، وتصميم قاعدة البيانات، ومخططات UI/UX الأولية، والمواصفات التقنية.",
        },
        {
          title: "التطوير الرشيق",
          description: "سباقات أسبوعين بتسليم مستمر، ومراجعة كود، واختبار آلي، وعروض دورية.",
        },
        {
          title: "الإطلاق والدعم",
          description: "الإطلاق، وضبط الأداء، والتدريب، والتوثيق، والدعم المستمر.",
        },
      ],
    },
  },
  "mobile-apps": {
    en: {
      heroLabel: "MOBILE APP DEVELOPMENT",
      heroHeadlineLead: "Mobile Apps for Businesses",
      heroHeadlineAccent: "That Move Fast.",
      heroParagraph:
        "We build native and cross-platform mobile apps for iOS and Android: customer-facing apps, internal team tools, and field operations systems. Offline-ready and Arabic-first, our apps work where your users actually are.",
      capabilitiesTitle: "Mobile Engineering Capabilities.",
      capabilitiesSubtitle: "The core engineering competencies behind every app we ship.",
      benefitsTitle: "Why Businesses Choose Wijhan for Mobile.",
      benefitsSubtitle: "What sets our mobile work apart.",
      processTitle: "The Mobile Product Lifecycle.",
      seoTitle: "Mobile App Development — iOS & Android | Wijhan",
      seoDescription:
        "Native iOS and Android apps plus Flutter and React Native. Arabic RTL, offline-first, built for growing businesses.",
      capabilities: [
        {
          title: "Cross-Platform Development",
          description:
            "Flutter and React Native apps that run smoothly on iOS and Android from a single codebase, so you launch faster and maintain less.",
        },
        {
          title: "Native iOS & Android",
          description:
            "Swift and Kotlin apps for performance-critical cases that need deep hardware access, camera, sensors, or biometric security.",
        },
        {
          title: "Offline-First Architecture",
          description:
            "Apps built for weak connectivity: local caching, background sync, and smart conflict resolution so users never lose data.",
        },
        {
          title: "Push Notifications & Real-Time",
          description:
            "Custom push infrastructure, real-time chat, live updates, and secure in-app messaging.",
        },
        {
          title: "App Store & Enterprise Deployment",
          description:
            "End-to-end Google Play and App Store submission, review management, and private distribution through enterprise MDM when needed.",
        },
      ],
      benefits: [
        {
          title: "Single Codebase. Native Feel.",
          description:
            "Cross-platform frameworks let us ship to iOS and Android together, cutting timelines without giving up speed, security, or UX quality.",
        },
        {
          title: "Resilient Offline-First Engineering",
          description:
            "We build local caching and automatic background sync from day one, so your team keeps working even when the network doesn't.",
        },
        {
          title: "Arabic-First RTL & Cultural UX",
          description:
            "Every screen and gesture is designed for Arabic users from the start, not retrofitted. Proper RTL typography, mirrored layouts, and culturally aware interactions.",
        },
      ],
      process: [
        {
          title: "Product Strategy",
          description:
            "User research, feature prioritization, platform selection, and a focused MVP scope.",
        },
        {
          title: "UX/UI Design",
          description:
            "Wireframes, interactive prototypes, Arabic RTL UX mapping, and a reusable design system.",
        },
        {
          title: "Development & Testing",
          description:
            "Sprint-based engineering with automated tests, real-device verification, and beta distribution.",
        },
        {
          title: "Launch & Iterate",
          description:
            "Store or MDM deployment, crash monitoring, analytics setup, and continuous feature releases with support.",
        },
      ],
    },
    ar: {
      heroLabel: "تطوير تطبيقات الموبايل",
      heroHeadlineLead: "تطبيقات موبايل لشركات",
      heroHeadlineAccent: "تتحرك بسرعة.",
      heroParagraph:
        "نبني تطبيقات موبايل أصلية (Native) ومتعددة المنصات (Cross-platform) لنظامي iOS وAndroid، من تطبيقات العملاء إلى أدوات الفرق الداخلية وأنظمة العمل الميداني. تطبيقات تعمل بدون إنترنت ومصممة للعربية أولًا، لتعمل في الأماكن التي يوجد فيها مستخدموك فعلًا.",
      capabilitiesTitle: "قدراتنا في هندسة الموبايل.",
      capabilitiesSubtitle: "الكفاءات الهندسية الأساسية وراء كل تطبيق نسلّمه.",
      benefitsTitle: "لماذا تختار الشركات وجهان للموبايل.",
      benefitsSubtitle: "ما الذي يميّز عملنا في الموبايل.",
      processTitle: "دورة حياة منتج الموبايل.",
      seoTitle: "تطوير تطبيقات الموبايل — iOS وAndroid | وجهان",
      seoDescription:
        "تطبيقات iOS وAndroid الأصلية، بالإضافة إلى Flutter وReact Native. دعم العربية من اليمين إلى اليسار، تعمل بدون إنترنت، ومبنية للشركات النامية.",
      capabilities: [
        {
          title: "التطوير متعدد المنصات",
          description:
            "تطبيقات Flutter وReact Native تعمل بسلاسة على iOS وAndroid من كود واحد، لإطلاق أسرع وصيانة أقل.",
        },
        {
          title: "تطبيقات iOS وAndroid الأصلية",
          description:
            "تطبيقات Swift وKotlin للحالات التي تتطلب أداءً عاليًا ووصولًا عميقًا للعتاد والكاميرا والحساسات والأمان البيومتري.",
        },
        {
          title: "معمارية تعمل بدون إنترنت",
          description:
            "تطبيقات مصممة للاتصال الضعيف: تخزين محلي، ومزامنة في الخلفية، وحل ذكي للتعارضات حتى لا يفقد المستخدم بياناته.",
        },
        {
          title: "الإشعارات والتحديثات اللحظية",
          description:
            "بنية إشعارات مخصصة، ودردشة لحظية، وتحديثات مباشرة، ومراسلة آمنة داخل التطبيق.",
        },
        {
          title: "النشر على المتاجر والنشر المؤسسي",
          description:
            "نشر كامل على Google Play وApp Store، وإدارة مراجعات المتاجر، وتوزيع خاص عبر MDM عند الحاجة.",
        },
      ],
      benefits: [
        {
          title: "كود واحد. إحساس native.",
          description:
            "تتيح لنا أطر العمل متعددة المنصات إطلاق التطبيق على iOS وAndroid معًا، وتقليل المدة دون التفريط في السرعة أو الأمان أو جودة تجربة المستخدم.",
        },
        {
          title: "هندسة تعمل بدون إنترنت بثبات",
          description:
            "نبني التخزين المحلي والمزامنة التلقائية في الخلفية من اليوم الأول، حتى يستمر فريقك في العمل عندما لا تكون الشبكة متاحة.",
        },
        {
          title: "عربية أولًا بالكتابة من اليمين إلى اليسار وتجربة تراعي الثقافة",
          description:
            "نصمم كل شاشة وكل حركة للمستخدمين العرب من البداية، لا كإضافة لاحقة، مع خطوط سليمة للكتابة من اليمين إلى اليسار وتخطيطات معكوسة وتفاعلات تراعي الثقافة.",
        },
      ],
      process: [
        {
          title: "استراتيجية المنتج",
          description:
            "بحث المستخدم، وتحديد أولويات الميزات، واختيار المنصة، وتحديد نطاق مركز للنسخة الأولية.",
        },
        {
          title: "تصميم تجربة وواجهة المستخدم",
          description:
            "مخططات أولية، ونماذج تفاعلية، وتخطيط تجربة عربية من اليمين إلى اليسار، ونظام تصميم قابل لإعادة الاستخدام.",
        },
        {
          title: "التطوير والاختبار",
          description:
            "هندسة مبنية على السبرنتات مع اختبارات آلية، والتحقق على أجهزة حقيقية، وتوزيع تجريبي.",
        },
        {
          title: "الإطلاق والتطوير المستمر",
          description:
            "النشر على المتجر أو عبر MDM، ومراقبة الأعطال، وإعداد التحليلات، وإطلاق ميزات مستمرة مع الدعم.",
        },
      ],
    },
  },
  "portals-websites": {
    en: {
      heroLabel: "WEB PORTALS & WEBSITES",
      heroHeadlineLead: "Portals & Websites",
      heroHeadlineAccent: "That Work as Hard as You Do.",
      heroParagraph:
        "We build high-performance corporate websites, customer and partner portals, and e-commerce platforms — scalable, accessible, and search-optimized, with native Arabic and English experiences from day one.",
      capabilitiesTitle: "Web Engineering Capabilities.",
      capabilitiesSubtitle:
        "The core engineering competencies behind every site and portal we ship.",
      benefitsTitle: "Why Businesses Choose Wijhan for Web.",
      benefitsSubtitle: "What sets our web engineering apart.",
      processTitle: "The Web Project Lifecycle.",
      seoTitle: "Web Portals & Website Development | Wijhan",
      seoDescription:
        "Corporate websites, customer portals, e-commerce, and PWAs. Arabic RTL, SEO-optimized, accessible, and built to scale.",
      capabilities: [
        {
          title: "Business & Client Portals",
          description:
            "Secure, role-based portals for customers, partners, and employees, with SSO and integration into your existing systems.",
        },
        {
          title: "Headless E-Commerce",
          description:
            "Online stores and B2B marketplaces with multi-currency support, regional payment gateways, and inventory management.",
        },
        {
          title: "High-Performance Corporate Websites",
          description:
            "Multilingual company websites built to handle traffic spikes, with brand-aligned design, SEO optimization, and analytics.",
        },
        {
          title: "Content Management (CMS)",
          description:
            "Headless and decoupled CMS setups that let your team manage content independently across every channel.",
        },
        {
          title: "Progressive Web Apps (PWA)",
          description:
            "Installable, offline-capable web apps with native-like performance, push notifications, and background sync.",
        },
        {
          title: "Accessibility & Core Web Vitals",
          description:
            "WCAG 2.1 AA accessibility, Core Web Vitals optimization, and RTL-first responsive design for every user and device.",
        },
      ],
      benefits: [
        {
          title: "Faster Launch, Solid Foundations",
          description:
            "We start from tested, reusable building blocks and proven architectures, so you launch sooner without compromising on custom needs.",
        },
        {
          title: "Native Multilingual & RTL Support",
          description:
            "Every site and portal supports Arabic RTL and bidirectional content natively from day one, for a flawless experience across the region.",
        },
        {
          title: "Accessibility & Conversion-Focused UX",
          description:
            "Data-informed UX paired with rigorous accessibility standards means higher engagement, lower bounce rates, and frictionless user journeys.",
        },
      ],
      process: [
        {
          title: "Discovery & Strategy",
          description:
            "Stakeholder interviews, audience research, content audit, information architecture, and technical requirements.",
        },
        {
          title: "Design & Prototyping",
          description:
            "Wireframes, UI design system, interactive prototypes, and multilingual/RTL layout planning.",
        },
        {
          title: "Development & Integration",
          description:
            "Frontend and backend engineering, CMS setup, third-party integrations, and safe content migration.",
        },
        {
          title: "Launch & Growth",
          description:
            "Load and performance testing, SEO launch checklist, analytics setup, and ongoing optimization.",
        },
      ],
    },
    ar: {
      heroLabel: "البوابات والمواقع الإلكترونية",
      heroHeadlineLead: "بوابات ومواقع",
      heroHeadlineAccent: "تعمل بجدّ مثلك.",
      heroParagraph:
        "نبني مواقع شركات عالية الأداء، وبوابات للعملاء والشركاء، ومنصات تجارة إلكترونية، قابلة للتوسع وسهلة الوصول ومحسّنة لمحركات البحث، بتجربة عربية وإنجليزية أصيلة من اليوم الأول.",
      capabilitiesTitle: "قدراتنا في هندسة الويب.",
      capabilitiesSubtitle: "الكفاءات الهندسية الأساسية وراء كل موقع وبوابة نسلّمها.",
      benefitsTitle: "لماذا تختار الشركات وجهان للويب.",
      benefitsSubtitle: "ما الذي يميّز عملنا في هندسة الويب.",
      processTitle: "دورة حياة مشروع الويب.",
      seoTitle: "تطوير بوابات ومواقع الويب | وجهان",
      seoDescription:
        "مواقع الشركات، وبوابات العملاء، والتجارة الإلكترونية، وتطبيقات PWA. دعم العربية من اليمين إلى اليسار، محسّنة لمحركات البحث، سهلة الوصول، ومبنية للتوسع.",
      capabilities: [
        {
          title: "بوابات الأعمال والعملاء",
          description:
            "بوابات آمنة بصلاحيات حسب الأدوار للعملاء والشركاء والموظفين، مع تسجيل دخول موحد وتكامل مع أنظمتك الحالية.",
        },
        {
          title: "التجارة الإلكترونية Headless",
          description:
            "متاجر إلكترونية ومنصات B2B بدعم عملات متعددة وبوابات دفع إقليمية وإدارة مخزون.",
        },
        {
          title: "مواقع شركات عالية الأداء",
          description:
            "مواقع شركات متعددة اللغات مبنية لتحمّل ضغط الزيارات، بتصميم يعكس هويتك وتحسين لمحركات البحث وتحليلات.",
        },
        {
          title: "أنظمة إدارة المحتوى",
          description:
            "أنظمة CMS منفصلة (Headless) تتيح لفريقك إدارة المحتوى باستقلالية عبر كل القنوات.",
        },
        {
          title: "تطبيقات الويب التقدمية (PWA)",
          description:
            "تطبيقات ويب قابلة للتثبيت وتعمل بدون إنترنت بأداء يشبه التطبيقات الأصلية، مع إشعارات ومزامنة في الخلفية.",
        },
        {
          title: "إمكانية الوصول وCore Web Vitals",
          description:
            "التزام بمعيار WCAG 2.1 AA، وتحسين Core Web Vitals، وتصميم متجاوب يراعي الكتابة من اليمين إلى اليسار لكل مستخدم وجهاز.",
        },
      ],
      benefits: [
        {
          title: "إطلاق أسرع بأساس متين",
          description:
            "نبدأ من مكوّنات مجرّبة وقابلة لإعادة الاستخدام ومعماريات مثبتة، لنطلق منتجك أسرع من دون التنازل عن احتياجاتك الخاصة.",
        },
        {
          title: "دعم أصيل لتعدد اللغات والكتابة من اليمين إلى اليسار",
          description:
            "يدعم كل موقع وبوابة العربية بالكتابة من اليمين إلى اليسار والمحتوى ثنائي الاتجاه بشكل أصيل من اليوم الأول، لتجربة سلسة في كل أنحاء المنطقة.",
        },
        {
          title: "إمكانية وصول وتجربة تركّز على التحويل",
          description:
            "تجربة مستخدم مبنية على البيانات مع معايير صارمة لإمكانية الوصول تعني تفاعلًا أعلى، ومعدلات مغادرة أقل، ورحلات مستخدم بلا احتكاك.",
        },
      ],
      process: [
        {
          title: "الاستكشاف والاستراتيجية",
          description:
            "مقابلات أصحاب المصلحة، وبحث الجمهور، وتدقيق المحتوى، ومعمارية المعلومات، والمتطلبات التقنية.",
        },
        {
          title: "التصميم والنماذج الأولية",
          description:
            "مخططات أولية، ونظام تصميم للواجهة، ونماذج تفاعلية، وتخطيط لتخطيطات متعددة اللغات ومن اليمين إلى اليسار.",
        },
        {
          title: "التطوير والتكامل",
          description:
            "هندسة الواجهة الأمامية والخلفية، وإعداد CMS، وتكاملات الطرف الثالث، وترحيل آمن للمحتوى.",
        },
        {
          title: "الإطلاق والنمو",
          description:
            "اختبارات التحمل والأداء، وقائمة التحقق لإطلاق SEO، وإعداد التحليلات، والتحسين المستمر.",
        },
      ],
    },
  },
  "ui-ux": {
    en: {
      heroLabel: "UI/UX DESIGN",
      heroHeadlineLead: "Design That Makes Complex",
      heroHeadlineAccent: "Products Simple.",
      heroParagraph:
        "We design interfaces that simplify complexity. Our team specializes in Arabic RTL, multilingual, and accessibility-first design for web and mobile products — from research and wireframes to interactive prototypes and complete design systems.",
      capabilitiesTitle: "Design Capabilities.",
      capabilitiesSubtitle:
        "The core design competencies behind every product experience we create.",
      benefitsTitle: "Why Businesses Choose Wijhan for Design.",
      benefitsSubtitle: "What sets our design practice apart.",
      processTitle: "The UX Design Lifecycle.",
      seoTitle: "UI/UX Design & Arabic RTL Interfaces | Wijhan",
      seoDescription:
        "Research-driven product design: wireframes, prototypes, design systems, Arabic RTL, and accessibility for web and mobile.",
      capabilities: [
        {
          title: "User Research & Discovery",
          description:
            "Stakeholder interviews, user journey mapping, competitive analysis, and persona development grounded in your real users.",
        },
        {
          title: "Wireframing & Prototyping",
          description:
            "From low-fidelity wireframes to high-fidelity interactive prototypes in Figma, with fast iteration driven by real feedback.",
        },
        {
          title: "Arabic RTL Design",
          description:
            "Native right-to-left interfaces with proper bidirectional text, mirrored layouts, and culturally aware UX patterns.",
        },
        {
          title: "Design Systems",
          description:
            "Reusable component libraries, style guides, and design tokens that keep your UI consistent across every product and platform.",
        },
        {
          title: "Accessibility (a11y)",
          description:
            "WCAG 2.1 AA compliance, screen reader support, keyboard navigation, and inclusive design for diverse users.",
        },
        {
          title: "Usability Testing & Validation",
          description:
            "Moderated and unmoderated testing, A/B experiments, and data-driven iteration to keep improving the experience.",
        },
      ],
      benefits: [
        {
          title: "Arabic-First, Not Arabic-Patched",
          description:
            "We design for Arabic and RTL from the very first wireframe, not as an afterthought. Typography, layout flow, and cultural context are native to every screen.",
        },
        {
          title: "Research-Driven, Not Assumption-Driven",
          description:
            "Every design decision is backed by user research, testing, and real data — with your actual users, not theoretical personas.",
        },
        {
          title: "Design Systems That Scale with You",
          description:
            "We deliver component libraries and design tokens, not just flat mockups, so your team can build new screens consistently without starting over.",
        },
      ],
      process: [
        {
          title: "Research",
          description:
            "User interviews, competitor audits, heuristic evaluations, and design strategy workshops.",
        },
        {
          title: "Ideate",
          description:
            "Information architecture, user flows, foundational wireframes, and concept exploration.",
        },
        {
          title: "Design",
          description:
            "High-fidelity visual design, interactive prototypes, design system components, and native RTL adaptation.",
        },
        {
          title: "Validate",
          description:
            "Usability testing, accessibility audits, clean developer handoff, and ongoing collaboration with engineering.",
        },
      ],
    },
    ar: {
      heroLabel: "تصميم واجهات وتجربة المستخدم",
      heroHeadlineLead: "تصميم يجعل المنتجات",
      heroHeadlineAccent: "المعقدة بسيطة.",
      heroParagraph:
        "نصمّم واجهات تبسّط التعقيد. يتخصص فريقنا في التصميم العربي من اليمين إلى اليسار ومتعدد اللغات والذي يضع إمكانية الوصول أولًا لمنتجات الويب والموبايل، من البحث والمخططات الأولية (wireframes) إلى النماذج التفاعلية وأنظمة التصميم المتكاملة.",
      capabilitiesTitle: "قدراتنا في التصميم.",
      capabilitiesSubtitle: "الكفاءات الأساسية في التصميم وراء كل تجربة منتج نصنعها.",
      benefitsTitle: "لماذا تختار الشركات وجهان للتصميم.",
      benefitsSubtitle: "ما الذي يميّز ممارستنا في التصميم.",
      processTitle: "دورة حياة تصميم التجربة.",
      seoTitle: "تصميم UI/UX وواجهات عربية من اليمين إلى اليسار | وجهان",
      seoDescription:
        "تصميم منتجات مبني على البحث: المخططات الأولية (wireframes)، نماذج أولية، أنظمة تصميم، العربية من اليمين إلى اليسار، وإمكانية وصول للويب والموبايل.",
      capabilities: [
        {
          title: "أبحاث المستخدمين والاستكشاف",
          description:
            "مقابلات أصحاب المصلحة، ورسم رحلة المستخدم، وتحليل المنافسين، وبناء شخصيات المستخدمين المستندة إلى مستخدميك الفعليين.",
        },
        {
          title: "النماذج الأولية والـ Wireframes",
          description:
            "من المخططات الأولية البسيطة إلى النماذج التفاعلية عالية الدقة في Figma، مع تكرار سريع مبني على ملاحظات حقيقية.",
        },
        {
          title: "تصميم عربي من اليمين إلى اليسار",
          description:
            "واجهات أصيلة من اليمين لليسار مع معالجة سليمة للنصوص ثنائية الاتجاه وتخطيطات معكوسة وأنماط تجربة تراعي الثقافة.",
        },
        {
          title: "أنظمة التصميم",
          description:
            "مكتبات مكونات قابلة لإعادة الاستخدام، وأدلة أسلوب، وdesign tokens تحافظ على اتساق واجهتك عبر كل المنتجات والمنصات.",
        },
        {
          title: "إمكانية الوصول",
          description:
            "التزام بمعيار WCAG 2.1 AA، ودعم قارئات الشاشة، والتنقل بلوحة المفاتيح، وتصميم شامل لمختلف المستخدمين.",
        },
        {
          title: "اختبار وتحقق قابلية الاستخدام",
          description: "اختبارات بإشراف وبدون إشراف، وتجارب A/B، وتحسين مستمر مبني على البيانات.",
        },
      ],
      benefits: [
        {
          title: "عربي من البداية، لا ترقيعًا لاحقًا",
          description:
            "نصمم للعربية ومن اليمين إلى اليسار من أول مخطط أولي، لا كفكرة لاحقة. الطباعة وتدفق التخطيط والسياق الثقافي أصيلة في كل شاشة.",
        },
        {
          title: "مبني على البحث لا على الافتراضات",
          description:
            "كل قرار تصميم مدعوم ببحث المستخدمين والاختبار والبيانات الحقيقية — مع مستخدميك الفعليين، لا شخصيات نظرية.",
        },
        {
          title: "أنظمة تصميم تكبر معك",
          description:
            "نسلّم مكتبات مكونات وdesign tokens، لا مجرد نماذج ثابتة، حتى يتمكن فريقك من بناء شاشات جديدة باتساق دون البدء من الصفر.",
        },
      ],
      process: [
        {
          title: "البحث",
          description:
            "مقابلات المستخدمين، وتدقيق المنافسين، والتقييمات الاستكشافية، وورش استراتيجية التصميم.",
        },
        {
          title: "توليد الأفكار",
          description:
            "معمارية المعلومات، وتدفقات المستخدم، والمخططات الأولية الأساسية، واستكشاف المفاهيم.",
        },
        {
          title: "التصميم",
          description:
            "تصميم بصري عالي الدقة، ونماذج تفاعلية، ومكونات نظام التصميم، وتكييف أصيل للكتابة من اليمين إلى اليسار.",
        },
        {
          title: "التحقق",
          description:
            "اختبار قابلية الاستخدام، وتدقيق إمكانية الوصول، وتسليم واضح للمطورين، وتعاون مستمر مع فريق الهندسة.",
        },
      ],
    },
  },
  "system-integration": {
    en: {
      heroLabel: "SYSTEM INTEGRATION",
      heroHeadlineLead: "Connect Every System.",
      heroHeadlineAccent: "Remove Every Silo.",
      heroParagraph:
        "Growing businesses run on many disconnected tools — ERP, CRM, finance, HR, and internal apps. We build the integration layer that connects them: secure APIs, middleware, and data pipelines that keep information flowing without manual entry.",
      capabilitiesTitle: "Integration Capabilities.",
      capabilitiesSubtitle:
        "The core engineering competencies behind every integration we deliver.",
      benefitsTitle: "Why Businesses Choose Wijhan for Integration.",
      benefitsSubtitle: "What sets our integration work apart.",
      processTitle: "The Integration Lifecycle.",
      seoTitle: "System Integration & Middleware Development | Wijhan",
      seoDescription:
        "Connect ERP, CRM, legacy systems, and third-party APIs with secure middleware and data pipelines.",
      capabilities: [
        {
          title: "API Development & Management",
          description:
            "Secure REST and GraphQL API design, versioning, rate limiting, authentication, and clear developer documentation.",
        },
        {
          title: "Middleware & iPaaS",
          description:
            "Custom middleware and integration-platform setups that handle routing, transformation, and orchestration between your systems.",
        },
        {
          title: "Legacy System Integration",
          description:
            "Bridge modern cloud tools with on-premise databases, SOAP services, file-based systems, and proprietary protocols.",
        },
        {
          title: "ERP, CRM & Third-Party Integrations",
          description:
            "Connect your ERP, CRM, payment gateways, shipping providers, and SaaS tools into one consistent data flow.",
        },
        {
          title: "ETL & Data Pipelines",
          description:
            "Reliable Extract, Transform, Load pipelines for batch processing and real-time data sync between systems.",
        },
        {
          title: "Single Sign-On (SSO) & Identity",
          description:
            "SAML, OAuth 2.0, and OpenID Connect for unified, secure authentication across all your platforms.",
        },
      ],
      benefits: [
        {
          title: "Eliminate Data Silos",
          description:
            "We connect your ERP, CRM, finance, and internal tools into one data flow, so every team works from accurate, real-time information.",
        },
        {
          title: "Zero-Downtime Migration",
          description:
            "A parallel-run approach keeps your current systems fully operational while we migrate data and switch integrations on, with no disruption to daily operations.",
        },
        {
          title: "Secure & Observable by Design",
          description:
            "Encrypted data flow, retry logic, and real-time monitoring with automated alerts, so integrations stay reliable and issues are caught before your users notice.",
        },
      ],
      process: [
        {
          title: "System Audit",
          description:
            "Map existing systems, data flows, API dependencies, and integration pain points across your business.",
        },
        {
          title: "Integration Architecture",
          description:
            "Design the integration topology, API contracts, data transformation rules, and error-handling strategy.",
        },
        {
          title: "Build & Connect",
          description:
            "Develop connectors, deploy middleware, build APIs, and load-test with production-scale data in staging.",
        },
        {
          title: "Monitor & Maintain",
          description:
            "Real-time monitoring, automated error alerts, smart retry logic, and ongoing connector maintenance and support.",
        },
      ],
    },
    ar: {
      heroLabel: "تكامل الأنظمة",
      heroHeadlineLead: "اربط كل أنظمتك.",
      heroHeadlineAccent: "وأزل كل العزلة بينها.",
      heroParagraph:
        "الشركات النامية تعمل بأدوات كثيرة غير مترابطة: ERP وCRM والمالية والموارد البشرية وتطبيقات داخلية. نبني طبقة التكامل التي تربطها: واجهات API آمنة، والوسيط البرمجي (middleware)، ومسارات بيانات تُبقي المعلومات متدفقة دون إدخال يدوي.",
      capabilitiesTitle: "قدراتنا في التكامل.",
      capabilitiesSubtitle: "الكفاءات الهندسية الأساسية وراء كل تكامل نسلّمه.",
      benefitsTitle: "لماذا تختار الشركات وجهان للتكامل.",
      benefitsSubtitle: "ما الذي يميّز عملنا في التكامل.",
      processTitle: "دورة حياة التكامل.",
      seoTitle: "تطوير تكامل الأنظمة والوسيط البرمجي (Middleware) | وجهان",
      seoDescription:
        "اربط أنظمة ERP وCRM والأنظمة القديمة وواجهات API الخارجية عبر وسيط برمجي (middleware) آمن ومسارات بيانات.",
      capabilities: [
        {
          title: "تطوير وإدارة واجهات API",
          description:
            "تصميم واجهات REST وGraphQL آمنة، وإدارة الإصدارات، وتحديد معدل الطلبات، والمصادقة، وتوثيق واضح للمطورين.",
        },
        {
          title: "الوسيط البرمجي ومنصات التكامل",
          description:
            "حلول الوسيط البرمجي وإعدادات منصات تكامل مخصصة تتولى التوجيه والتحويل والتنسيق بين أنظمتك.",
        },
        {
          title: "تكامل الأنظمة القديمة",
          description:
            "ربط الأدوات السحابية الحديثة بقواعد البيانات المحلية وخدمات SOAP والأنظمة المعتمدة على الملفات والبروتوكولات الخاصة.",
        },
        {
          title: "تكامل ERP وCRM والخدمات الخارجية",
          description:
            "ربط نظام ERP وCRM وبوابات الدفع وشركات الشحن وأدوات SaaS في تدفق بيانات واحد متسق.",
        },
        {
          title: "مسارات البيانات وETL",
          description:
            "مسارات استخراج وتحويل وتحميل موثوقة للمعالجة الدفعية والمزامنة اللحظية للبيانات بين الأنظمة.",
        },
        {
          title: "تسجيل الدخول الموحد والهوية",
          description: "تطبيق SAML وOAuth 2.0 وOpenID Connect لمصادقة موحدة وآمنة عبر كل منصاتك.",
        },
      ],
      benefits: [
        {
          title: "إنهاء عزلة البيانات",
          description:
            "نربط ERP وCRM والمالية وأدواتك الداخلية في تدفق بيانات واحد، حتى يعمل كل فريق على معلومات دقيقة ولحظية.",
        },
        {
          title: "ترحيل دون توقف",
          description:
            "يحافظ نهج التشغيل المتوازي على عمل أنظمتك الحالية بالكامل أثناء ترحيل البيانات وتفعيل التكاملات، دون تعطيل عملياتك اليومية.",
        },
        {
          title: "آمن وقابل للمراقبة بطبيعته",
          description:
            "تدفق بيانات مشفّر، ومنطق لإعادة المحاولة، ومراقبة لحظية مع تنبيهات آلية، لتظل التكاملات موثوقة وتُكتشف المشكلات قبل أن يلاحظها المستخدمون.",
        },
      ],
      process: [
        {
          title: "تدقيق الأنظمة",
          description:
            "رسم خريطة للأنظمة الحالية، وتدفقات البيانات، واعتماديات API، ونقاط الألم في التكامل عبر عملك.",
        },
        {
          title: "معمارية التكامل",
          description:
            "تصميم طوبولوجيا التكامل، وعقود API، وقواعد تحويل البيانات، واستراتيجية التعامل مع الأخطاء.",
        },
        {
          title: "البناء والربط",
          description:
            "تطوير الموصلات، ونشر الوسيط البرمجي، وبناء واجهات API، واختبار التحمل ببيانات بحجم الإنتاج في بيئة التجربة.",
        },
        {
          title: "المراقبة والصيانة",
          description:
            "مراقبة لحظية، وتنبيهات أخطاء آلية، ومنطق ذكي لإعادة المحاولة، وصيانة ودعم مستمران للموصلات.",
        },
      ],
    },
  },
  "erp-solutions": {
    en: {
      heroLabel: "ERP SOLUTIONS",
      heroHeadlineLead: "ERP Systems Built Around How You Actually",
      heroHeadlineAccent: "Work.",
      heroParagraph:
        "We design and deliver tailored ERP systems that unite operations, finance, inventory, sales, and HR in one platform — replacing spreadsheets and disconnected tools with a single, reliable source of truth built for your business.",
      capabilitiesTitle: "ERP Capabilities.",
      capabilitiesSubtitle:
        "The core consulting and engineering competencies behind every ERP we deliver.",
      benefitsTitle: "Why Businesses Choose Wijhan for ERP.",
      benefitsSubtitle: "What sets our ERP delivery apart.",
      processTitle: "The ERP Implementation Lifecycle.",
      seoTitle: "Custom ERP Solutions & Implementation | Wijhan",
      seoDescription:
        "Tailored ERP systems for operations, finance, inventory, sales, and HR: built around your workflows, with training and support.",
      capabilities: [
        {
          title: "ERP Strategy & Requirements",
          description:
            "Stakeholder-aligned requirements, current-state assessment, and a phased roadmap that prioritizes the modules that matter most first.",
        },
        {
          title: "Process Mapping & Reengineering",
          description:
            "We map, analyze, and redesign your workflows to remove manual bottlenecks and introduce scalable automation.",
        },
        {
          title: "Custom ERP Modules",
          description:
            "Finance and accounting, inventory and procurement, sales and CRM, and HR and payroll — built as modules that fit your exact processes.",
        },
        {
          title: "Data Migration & Integration",
          description:
            "Safe migration from spreadsheets and legacy systems, plus integration with your existing tools, payment gateways, and third-party services.",
        },
        {
          title: "Reporting & Analytics",
          description:
            "Executive dashboards, real-time KPI tracking, and custom reports so decisions are based on live data, not guesswork.",
        },
        {
          title: "Training & Change Management",
          description:
            "Technology is only half the equation: role-based training, documentation, and phased adoption so your team actually uses the system.",
        },
      ],
      benefits: [
        {
          title: "Process First, Software Second",
          description:
            "We start with your business goals and operational pain points, not a product pitch. Every module is tied to a measurable outcome.",
        },
        {
          title: "Built Around Your Workflows",
          description:
            "Instead of bending your business to fit off-the-shelf software, we build the system around the way your teams already work, and evolve it as you grow.",
        },
        {
          title: "Adoption Built In",
          description:
            "Structured training, stakeholder workshops, and phased rollout are part of every project, so your team embraces the system from day one.",
        },
      ],
      process: [
        {
          title: "Assess & Map",
          description:
            "Current-state analysis, stakeholder interviews, process mapping, and requirements prioritization.",
        },
        {
          title: "Design & Plan",
          description:
            "ERP architecture, module design, data model, integration plan, and a phased delivery roadmap with budget.",
        },
        {
          title: "Build & Pilot",
          description:
            "Module development, data migration, integration, and a controlled pilot with a single team or department.",
        },
        {
          title: "Roll Out & Optimize",
          description:
            "Phased rollout, user training, go-live support, and continuous improvement based on usage data.",
        },
      ],
    },
    ar: {
      heroLabel: "حلول ERP",
      heroHeadlineLead: "أنظمة ERP مبنية حول طريقة عملك",
      heroHeadlineAccent: "الفعلية.",
      heroParagraph:
        "نصمّم ونسلّم أنظمة ERP مخصصة توحّد العمليات والمالية والمخزون والمبيعات والموارد البشرية في منصة واحدة، لتحلّ محل الجداول والأدوات المتفرقة بمصدر واحد موثوق للحقيقة مبني لعملك.",
      capabilitiesTitle: "قدراتنا في أنظمة ERP.",
      capabilitiesSubtitle: "الكفاءات الاستشارية والهندسية الأساسية وراء كل نظام ERP نسلّمه.",
      benefitsTitle: "لماذا تختار الشركات وجهان لأنظمة ERP.",
      benefitsSubtitle: "ما الذي يميّز تنفيذنا لأنظمة ERP.",
      processTitle: "دورة حياة تنفيذ ERP.",
      seoTitle: "حلول ERP مخصصة وتنفيذها | وجهان",
      seoDescription:
        "أنظمة ERP مخصصة للعمليات والمالية والمخزون والمبيعات والموارد البشرية، مبنية حول سير عملك، مع التدريب والدعم.",
      capabilities: [
        {
          title: "استراتيجية ERP وتحديد المتطلبات",
          description:
            "متطلبات متفق عليها مع أصحاب المصلحة، وتقييم للوضع الحالي، وخارطة طريق على مراحل تبدأ بالوحدات الأهم.",
        },
        {
          title: "تحليل وإعادة هندسة العمليات",
          description:
            "نرسم ونحلّل ونعيد تصميم سير العمل لإزالة الاختناقات اليدوية وإدخال أتمتة قابلة للتوسع.",
        },
        {
          title: "وحدات ERP مخصصة",
          description:
            "المالية والمحاسبة، والمخزون والمشتريات، والمبيعات وإدارة العملاء، والموارد البشرية والرواتب، كوحدات مبنية لتناسب عملياتك بالضبط.",
        },
        {
          title: "ترحيل البيانات والتكامل",
          description:
            "ترحيل آمن من الجداول والأنظمة القديمة، مع تكامل مع أدواتك الحالية وبوابات الدفع والخدمات الخارجية.",
        },
        {
          title: "التقارير والتحليلات",
          description:
            "لوحات تنفيذية، ومتابعة لحظية لمؤشرات الأداء، وتقارير مخصصة لقرارات مبنية على بيانات حيّة لا على التخمين.",
        },
        {
          title: "التدريب وإدارة التغيير",
          description:
            "التقنية نصف المعادلة فقط: تدريب حسب الدور، وتوثيق، وتبنٍّ تدريجي ليستخدم فريقك النظام فعلًا.",
        },
      ],
      benefits: [
        {
          title: "العمليات أولًا ثم البرمجيات",
          description:
            "نبدأ بأهداف عملك ونقاط الألم التشغيلية، لا بعرض منتج. كل وحدة مرتبطة بنتيجة قابلة للقياس.",
        },
        {
          title: "مبني حول سير عملك أنت",
          description:
            "بدلًا من إجبار عملك على التكيف مع برامج جاهزة، نبني النظام حول طريقة عمل فرقك الحالية ونطوره مع نموك.",
        },
        {
          title: "التبنّي جزء من المشروع",
          description:
            "التدريب المنظم، وورش أصحاب المصلحة، والإطلاق المرحلي جزء من كل مشروع، حتى يتبنى فريقك النظام من اليوم الأول.",
        },
      ],
      process: [
        {
          title: "التقييم والرسم",
          description:
            "تحليل الوضع الحالي، ومقابلات أصحاب المصلحة، ورسم العمليات، وترتيب أولويات المتطلبات.",
        },
        {
          title: "التصميم والتخطيط",
          description:
            "معمارية ERP، وتصميم الوحدات، ونموذج البيانات، وخطة التكامل، وخارطة طريق مرحلية للتسليم مع الميزانية.",
        },
        {
          title: "البناء والتجربة",
          description:
            "تطوير الوحدات، وترحيل البيانات، والتكامل، وتجربة تجريبية مضبوطة مع فريق أو قسم واحد.",
        },
        {
          title: "النشر والتحسين",
          description:
            "إطلاق مرحلي، وتدريب المستخدمين، ودعم بدء التشغيل، وتحسين مستمر مبني على بيانات الاستخدام.",
        },
      ],
    },
  },
};

export function getServiceDetailContent(slug: string): ServiceDetailContent | undefined {
  return serviceDetailContent[slug];
}
