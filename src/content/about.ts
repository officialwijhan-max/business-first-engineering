/**
 * Data for the About page (`/about`, `/ar/about`) that isn't safe to guess
 * at in component code: team, offices, and a couple of optional company
 * facts. Nothing here is invented — a field left `undefined` or an empty
 * array simply means that section/row doesn't render (see about-page.tsx).
 * Add real values here when they're confirmed; no code changes needed.
 */

type Localized = { en: string; ar: string };

export type TeamMember = {
  name: Localized;
  role: Localized;
  initials: string;
  tier: "founder" | "lead";
  /** Optional photo URL; falls back to `initials` in an avatar circle. */
  photo?: string;
  /** Optional LinkedIn profile URL; renders a LinkedIn icon only when set. */
  linkedin?: string;
};

export type OfficeLocation = {
  country: Localized;
  city?: Localized;
  role: "headquarters" | "branch" | "presence";
  address?: Localized;
  /** Display-formatted phone number (e.g. "+20 100 058 0504"); the tel: link strips the spaces. */
  phone?: string;
  /** Flag emoji or short code shown next to the location. */
  flag?: string;
  /**
   * WGS84 coordinates for pin placement on <RegionalMap>'s
   * react-simple-maps projection (src/components/regional-map.tsx). A
   * location without lat/lng still gets a card, just no map pin.
   */
  lat?: number;
  lng?: number;
};

/** Only confirmed team members — do not add names that weren't provided. */
export const team: TeamMember[] = [
  {
    name: { en: "Abdelaziz Gamal", ar: "عبد العزيز جمال" },
    role: { en: "Co-Founder", ar: "شريك مؤسس" },
    initials: "AG",
    tier: "founder",
  },
  {
    name: { en: "Mustafa Ashraf", ar: "مصطفى أشرف" },
    role: { en: "Co-Founder", ar: "شريك مؤسس" },
    initials: "MA",
    tier: "founder",
  },
  {
    name: { en: "Hamza Mahmoud", ar: "حمزة محمود" },
    role: { en: "Backend Lead", ar: "قائد فريق الباك إند" },
    initials: "HM",
    tier: "lead",
  },
  {
    name: { en: "Abdallah Gaber", ar: "عبدالله جابر" },
    role: { en: "AI Lead", ar: "قائد الذكاء الاصطناعي" },
    initials: "AG",
    tier: "lead",
  },
  {
    name: { en: "Belal Mohamed", ar: "بلال محمد" },
    role: { en: "Flutter Lead", ar: "قائد فريق Flutter" },
    initials: "BM",
    tier: "lead",
  },
];

/**
 * Only confirmed offices — do not add cities/branches that weren't provided.
 * Address/phone below are the same contact details already published on
 * /contact and /ar/contact, reused here rather than re-entered.
 * `lat`/`lng` place the pin on <RegionalMap>'s react-simple-maps projection
 * (src/components/regional-map.tsx); add real WGS84 coordinates for any new
 * entry the same way.
 */
export const locations: OfficeLocation[] = [
  {
    country: { en: "Egypt", ar: "مصر" },
    city: { en: "Cairo", ar: "القاهرة" },
    role: "headquarters",
    flag: "🇪🇬",
    address: { en: "Beverly Hills, Sheikh Zayed, Giza", ar: "بيفرلي هيلز، الشيخ زايد، الجيزة" },
    phone: "+20 100 058 0504",
    lat: 30.0444,
    lng: 31.2357,
  },
];

/** Optional company facts for the hero's "Company at a glance" card and JSON-LD — leave `undefined` until confirmed. */
export const foundedYear: number | undefined = undefined;
export const basedIn: Localized | undefined = undefined;
