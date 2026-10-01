import {
  Blocks,
  ClipboardCheck,
  Code2,
  Compass,
  Database,
  DraftingCompass,
  Globe,
  LayoutGrid,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * The `/services` API returns each service's icon as a lowercase Lucide icon
 * identifier (e.g. "code") rather than a component, since JSON can't carry a
 * React component reference. This maps the names seeded on the backend (see
 * backend/database/seeders/ServiceSeeder.php) back to the same lucide-react
 * components the frontend already used with static data.
 * `Sparkles` is a safe fallback for any future/unmapped icon name so one
 * unexpected value never breaks the page.
 */
const iconMap: Record<string, LucideIcon> = {
  Compass,
  DraftingCompass,
  Wrench,
  Blocks,
  ShieldCheck,
  ClipboardCheck,
  Code2,
  Smartphone,
  Globe,
  LayoutGrid,
  Workflow,
  Database,
  code: Code2,
  smartphone: Smartphone,
  globe: Globe,
  "layout-grid": LayoutGrid,
  workflow: Workflow,
  database: Database,
};

export function resolveServiceIcon(name: string): LucideIcon {
  return iconMap[name] ?? Sparkles;
}
