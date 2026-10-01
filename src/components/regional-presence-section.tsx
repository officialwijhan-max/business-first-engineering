import { RegionalMap } from "@/components/regional-map";
import { locations } from "@/content/about";

type Localized = { en: string; ar: string };

const label: Localized = { en: "Regional Presence", ar: "التواجد الإقليمي" };
const headingLine1: Localized = { en: "Localized Support.", ar: "دعم محلي." };
const headingLine2: Localized = {
  en: "Reliable Delivery, Everywhere.",
  ar: "تسليم موثوق، في كل مكان.",
};

/**
 * Shared "Regional presence" section — label + heading + data-driven
 * paragraph, the RegionalMap panel, and the location cards list. Mounted on
 * About, Home, and Contact so all three stay in lockstep with a single
 * implementation; `locations` (src/content/about.ts) is the single source of
 * truth for both the map pins and the paragraph's hub count. Copy is fixed
 * here on purpose — there are no per-page overrides, so every page renders
 * the identical section.
 */
export function RegionalPresenceSection({
  sectionId,
  arabic,
}: {
  sectionId?: string;
  arabic: boolean;
}) {
  if (locations.length === 0) return null;

  const count = locations.length;
  const paragraph =
    count > 1
      ? arabic
        ? `نعمل عبر ${count} مراكز إقليمية لضمان تكامل سريع على الأرض وتسليم موثوق ومحلي.`
        : `Operating across ${count} regional hubs to ensure rapid on-site integration and reliable, localized delivery.`
      : arabic
        ? "تسليم مرن عن بُعد مع فريق يفهم واقع الأعمال في المنطقة ويعمل بالعربية والإنجليزية."
        : "Remote-friendly delivery with a team that understands regional business realities and works in Arabic and English.";

  return (
    <section id={sectionId} className="bg-background py-20 lg:py-28">
      <div className="page-container">
        {/* Same two-column, vertically centered header as About's Operational
            Mandate section, so the paragraph reads as the heading's lead-in. */}
        <div className="reveal grid gap-6 md:grid-cols-2 md:items-center md:gap-10 lg:gap-16">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-border" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-widest text-hero-accent">
                {arabic ? label.ar : label.en}
              </p>
            </div>
            <h2 className="mt-5 font-display text-[1.75rem] leading-[1.1] tracking-tighter sm:text-[2.25rem] sm:leading-[1.08] md:text-[2.75rem] lg:text-[3.25rem] lg:leading-[1.05]">
              <span className="block text-foreground">
                {arabic ? headingLine1.ar : headingLine1.en}
              </span>
              <span className="block text-hero-accent">
                {arabic ? headingLine2.ar : headingLine2.en}
              </span>
            </h2>
          </div>
          <p className="max-w-xl border-s-2 border-hero-accent ps-4 text-base leading-7 text-muted-foreground sm:ps-5 sm:text-lg sm:leading-8">
            {paragraph}
          </p>
        </div>

        <div className="reveal mt-14">
          <RegionalMap locations={locations} arabic={arabic} />
        </div>
      </div>
    </section>
  );
}
