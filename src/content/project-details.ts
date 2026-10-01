/**
 * Optional, editorial detail content for /work/:slug.
 *
 * The API remains the source of truth for which projects exist and for
 * localized backend fields. This layer supplies richer English storytelling
 * when a project has more detail than the API's common case-study shape.
 */

export interface ProjectDetailHighlight {
  eyebrow: string;
  heading: string;
  paragraph: string;
}

export interface ProjectDetailCapability {
  label: string;
  title: string;
  paragraph: string;
}

export interface ProjectDetailContentBlock {
  eyebrow: string;
  heading: string;
  paragraph: string;
}

export interface ProjectDetailGalleryItem {
  src: string;
  alt: string;
  /** Short line shown under the screenshot; falls back to `alt`. */
  caption?: string;
}

/** The challenge paragraph broken into an intro, its specific pain points, and a closing line. */
export interface ProjectDetailChallenge {
  intro: string;
  points: string[];
  closing?: string;
}

/** The solution paragraph restructured into numbered steps (title + short description). */
export interface ProjectDetailSolution {
  intro?: string;
  steps: { title: string; description: string }[];
  note?: string;
}

export interface ProjectDetailRoleBlock {
  eyebrow: string;
  heading: string;
  items: string[];
}

export interface ProjectDetailCopy {
  category?: string;
  title?: string;
  tagline?: string;
  description?: string;
  logo?: string;
  /** Phone-portrait app screenshot for the hero mockup; falls back to the first gallery image. */
  cover?: string;
  gallery?: ProjectDetailGalleryItem[];
  challenge?: string;
  /** Optional structured form of `challenge`; the prose is used when absent. */
  challengeBreakdown?: ProjectDetailChallenge;
  solution?: string;
  /** Optional structured form of `solution`; the prose is used when absent. */
  solutionSteps?: ProjectDetailSolution;
  /** One short line describing Wijhan's role, shown in the project snapshot card. */
  roleSummary?: string;
  productHighlights?: ProjectDetailHighlight[];
  capabilities?: ProjectDetailCapability[];
  role?: ProjectDetailRoleBlock;
  engineering?: ProjectDetailContentBlock;
  technologies?: string[];
  outcome?: ProjectDetailContentBlock;
}

export interface ProjectDetailContent {
  en: ProjectDetailCopy;
  ar?: ProjectDetailCopy;
}

export const projectDetailContent: Record<string, ProjectDetailContent> = {
  "egyptian-coach": {
    en: {
      category: "Sports Technology",
      title: "Egyptian Coach",
      tagline: "One app for everything football.",
      description:
        "Egyptian Coach brings football news, talent discovery, training, academies, predictions, VAR voting, loyalty rewards and a sports marketplace together in a single, connected experience — built to give football fans and players a reason to open the app every day.",
      logo: "/case-studies/egyptian-coach/logo.png",
      gallery: [
        {
          src: "/case-studies/egyptian-coach/home.jpeg",
          alt: "Egyptian Coach home screen",
        },
        {
          src: "/case-studies/egyptian-coach/leagues-and-marketplace.jpeg",
          alt: "Egyptian Coach leagues and marketplace screens",
        },
        {
          src: "/case-studies/egyptian-coach/fixtures.jpeg",
          alt: "Egyptian Coach fixtures screen",
        },
        {
          src: "/case-studies/egyptian-coach/standings.jpeg",
          alt: "Egyptian Coach standings screen",
        },
      ],
      challenge:
        "Football fans and players in Egypt typically need several separate apps to follow the game: one for news and fixtures, another for finding an academy or coach, another for showcasing a talent, and separate channels for predictions or buying sports gear. Egyptian Coach was conceived as a single connected home for all of it — content, player development, fan interaction and sports commerce — so a user has one reason to open one app every day, not five.",
      solution:
        "Rather than being another football news app, Egyptian Coach organizes its scope around four connected groups: daily content (home, news, fixtures, standings and women's football), player development (talent discovery, coaching and academies), fan engagement (predictions, VAR-style voting, awards, loyalty and notifications), and sports commerce (a multi-sport marketplace). Every section can be reordered, shown or hidden from the admin panel, so the product's shape can evolve without an app store release.",
      challengeBreakdown: {
        intro:
          "Football fans and players in Egypt typically need several separate apps to follow the game:",
        points: [
          "One for news and fixtures",
          "Another for finding an academy or coach",
          "Another for showcasing a talent",
          "Separate channels for predictions or buying sports gear",
        ],
        closing:
          "Egyptian Coach was conceived as a single connected home for all of it — content, player development, fan interaction and sports commerce — so a user has one reason to open one app every day, not five.",
      },
      solutionSteps: {
        intro:
          "Rather than being another football news app, Egyptian Coach organizes its scope around four connected groups:",
        steps: [
          {
            title: "Daily content",
            description: "Home, news, fixtures, standings and women's football.",
          },
          {
            title: "Player development",
            description: "Talent discovery, coaching and academies.",
          },
          {
            title: "Fan engagement",
            description: "Predictions, VAR-style voting, awards, loyalty and notifications.",
          },
          { title: "Sports commerce", description: "A multi-sport marketplace." },
        ],
        note: "Every section can be reordered, shown or hidden from the admin panel, so the product's shape can evolve without an app store release.",
      },
      roleSummary: "Technical delivery partner",
      productHighlights: [
        {
          eyebrow: "Product experience",
          heading: "Talent & Player Development",
          paragraph:
            "One of the product's strongest ideas is turning the app into a discovery space for emerging players. Inside Talents, users browse a video feed of player profiles — filterable across All, Top/Featured and Rising Talents — and can upload their own footage for others, including coaches and academies, to find. Submitted content moves through a moderation flow (Draft, Pending, Approved, Rejected, Hidden) before it's visible publicly. Around it, You Are The Coach connects players to coaches and structured training programs by level and exercise type, and Academies lets users search, compare and reach out to football academies by location, pricing and available subscriptions — turning the app from content into a practical, actionable service.",
        },
        {
          eyebrow: "Product experience",
          heading: "Fan Engagement",
          paragraph:
            "Egyptian Coach layers several interaction loops on top of the football calendar. Predictions let users forecast match scores before a set deadline and earn points from the actual result. VAR Voting turns refereeing moments into a quick poll users can weigh in on. Awards run time-boxed competitions tied to activities like predictions or loyalty. Loyalty accumulates points from configured actions across the app, with every balance change auditable rather than user-editable. Notifications tie it together with deep links straight into the relevant news, match or product.",
        },
        {
          eyebrow: "Product experience",
          heading: "Sports Marketplace",
          paragraph:
            "The Marketplace extends Egyptian Coach beyond content into commerce. Users browse new and used sports products across categories including Football, Handball, Basketball, Volleyball, Swimming, Tennis and Fitness, filter by sport and condition, and reach sellers directly — including WhatsApp where available. Listings move through a review step before publishing, and business rules keep the catalog trustworthy: a sold product can no longer appear as available, and a discounted price can never exceed the original price.",
        },
        {
          eyebrow: "Product experience",
          heading: "Content & Football Data",
          paragraph:
            "Underneath the interactive features sits the football content that brings people back daily: News covers daily sports content with Featured, Breaking and Live states; Fixtures organizes today's, upcoming and previous matches; Standings tracks team rankings by competition and season; and Women's Football gets its own dedicated space for news, matches, teams and players rather than being folded into general coverage. Depending on the section, this football data can come from manual admin entry or an external data provider — the specification keeps that source explicit rather than assumed.",
        },
      ],
      capabilities: [
        {
          label: "Content",
          title: "Discover",
          paragraph:
            "Home, News, Fixtures, Standings and Women's Football — the daily football content that brings users back.",
        },
        {
          label: "Player Development",
          title: "Develop",
          paragraph:
            "Talents, You Are The Coach and Academies — from showcasing a player to structured training and academy access.",
        },
        {
          label: "Fan Interaction",
          title: "Engage",
          paragraph:
            "Predictions, VAR Voting, Awards, Loyalty and Notifications — interaction loops built around real football moments.",
        },
        {
          label: "Sports Commerce",
          title: "Trade",
          paragraph:
            "A multi-sport Marketplace for buying and selling new and used sports products.",
        },
      ],
      role: {
        eyebrow: "Our role",
        heading: "What Wijhan contributed",
        items: [
          "Technical Team Coordination",
          "Quality Assurance & Feature Validation",
          "Backend & Mobile Development Coordination",
          "Release & Progress Reporting",
          "Admin Systems Training",
        ],
      },
      engineering: {
        eyebrow: "Engineering",
        heading: "Product Complexity",
        paragraph:
          "Beneath a simple-looking football app, the product specification defines a genuinely complex set of rules. Most sections are configurable from an admin panel rather than hardcoded, so banners, Explore cards, categories and optional features can change without a new app release. User-submitted content — talents and marketplace listings — is designed to move through moderation states before going public. The experience is multilingual, with Arabic as the primary right-to-left language alongside English and French. Notifications and banners are designed to deep-link straight into specific screens. And the specification is explicit about time-sensitive and data-integrity rules: prediction deadlines, one active vote per user per VAR poll, awards that can't be shown as available once their period ends, sold marketplace items that must disappear from listings, discounted prices that can never exceed the original price, and loyalty balances that can only change through an audited process — never edited by the user directly.",
      },
      technologies: ["Flutter", "PHP / Laravel + Filament", "MySQL"],
      outcome: {
        eyebrow: "Outcome",
        heading: "The delivered result",
        paragraph:
          "Egyptian Coach brings football content, player development, talent discovery, fan interaction and sports commerce together within one connected digital ecosystem.",
      },
    },
    ar: {
      // Only what the API's Arabic case study lacks. The wording is taken from the API's own
      // Arabic challenge / product text, split into structure.
      logo: "/case-studies/egyptian-coach/logo.png",
      gallery: [
        { src: "/case-studies/egyptian-coach/home.jpeg", alt: "الشاشة الرئيسية في Egyptian Coach" },
        {
          src: "/case-studies/egyptian-coach/leagues-and-marketplace.jpeg",
          alt: "شاشات الدوريات والمتجر في Egyptian Coach",
        },
        {
          src: "/case-studies/egyptian-coach/fixtures.jpeg",
          alt: "شاشة المباريات في Egyptian Coach",
        },
        {
          src: "/case-studies/egyptian-coach/standings.jpeg",
          alt: "شاشة الترتيب في Egyptian Coach",
        },
      ],
      challengeBreakdown: {
        intro: "غالًا ما يحتاج عشّاق ولاعبو كرة القدم في مصر إلى عدة تطبيقات منفصلة:",
        points: [
          "تطبيق للأخبار والمباريات",
          "تطبيق آخر للبحث عن أكاديمية أو مدرب",
          "منصة أخرى لعرض المواهب",
          "قنوات منفصلة للتوقعات أو لشراء المستلزمات الرياضية",
        ],
        closing:
          "صُمم Egyptian Coach ليكون بيًا رقمًا واحًا لكل ذلك: المحتوى وتطوير اللاعبين والتفاعل الجماهيري والتجارة الرياضية، بحيث يملك المستخدم سبًا واحًا لفتح تطبيق واحد كل يوم بدًا من خمسة.",
      },
      solutionSteps: {
        intro:
          "بدًا من أن يكون مجرد تطبيق آخر للأخبار الكروية، يقوم Egyptian Coach على أربعة محاور مترابطة:",
        steps: [
          {
            title: "المحتوى اليومي",
            description: "الرئيسية والأخبار والمباريات والترتيب والكرة النسائية.",
          },
          { title: "تطوير اللاعبين", description: "اكتشاف المواهب والتدريب والأكاديميات." },
          {
            title: "التفاعل الجماهيري",
            description: "التوقعات والتصويت على الحالات التحكيمية والجوائز والولاء والإشعارات.",
          },
          { title: "التجارة الرياضية", description: "متجر متعدد الرياضات." },
        ],
        note: "يمكن التحكم في ترتيب كل قسم وإظهاره وإخفائه من لوحة الإدارة، ليتطور شكل المنتج دون الحاجة إلى إصدار جديد للتطبيق.",
      },
      roleSummary: "شريك تنفيذ تقني",
      technologies: ["Flutter", "PHP / Laravel + Filament", "MySQL"],
    },
  },
};

export function getProjectDetailContent(slug: string, locale: "en" | "ar") {
  const content = projectDetailContent[slug];
  if (!content) return undefined;
  return locale === "en" ? content.en : content.ar;
}
