import {
  BriefcaseBusiness,
  HeartPulse,
  Leaf,
  PanelsTopLeft,
  Settings2,
  ShoppingBag,
  Store,
  Trophy,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

export const processSteps = [
  ["01", "Understand", "Understand the business, users, objectives and problems."],
  ["02", "Define", "Turn business problems into a clear product scope."],
  ["03", "Design", "Design the experience and product structure."],
  ["04", "Engineer", "Build the product using the right technology."],
  ["05", "Validate", "Test functionality, quality and real-world usability."],
  ["06", "Improve", "Learn from feedback and continuously improve the product."],
] as const;

export const values = [
  [
    "Understanding Before Execution",
    "No code should be written before understanding why it needs to exist.",
  ],
  ["Technical Honesty", "If an idea will not work technically or commercially, we say so early."],
  [
    "Intentional Simplicity",
    "The simplest solution that solves the real problem is often the better one.",
  ],
  ["Real Ownership", "We treat the product as our responsibility, not simply a list of tickets."],
  ["Transparency", "Clear progress. Clear problems. Clear expectations. No surprises at the end."],
] as const;

export const differentiators = [
  ["Business Understanding", "We understand the business before choosing the technology."],
  [
    "Technical Honesty",
    "We tell clients what they need to hear, not simply what they want to hear.",
  ],
  [
    "Product Thinking",
    "We focus on building the right product, not simply completing requirements.",
  ],
  [
    "Engineering Discipline",
    "We care about scalability, maintainability, testing and long-term product health.",
  ],
  ["Ownership", "We work as a technology partner, not an outsourced ticket machine."],
] as const;

/**
 * `proof`, when present, is a published case study that actually
 * demonstrates work in that environment — every other entry is a
 * capability Wijhan can work in, not a claimed specialization.
 */
export const industries: {
  name: string;
  icon: LucideIcon;
  proof?: { slug: string; label: string };
}[] = [
  {
    name: "Sports & Communities",
    icon: Trophy,
    proof: { slug: "egyptian-coach", label: "Egyptian Coach" },
  },
  { name: "Healthcare", icon: HeartPulse },
  { name: "Agriculture", icon: Leaf },
  { name: "Retail", icon: Store },
  { name: "E-commerce", icon: ShoppingBag },
  { name: "Automotive", icon: Settings2 },
  { name: "Fintech", icon: WalletCards },
  { name: "Enterprise", icon: BriefcaseBusiness },
  { name: "Digital Platforms", icon: PanelsTopLeft },
];

export const approachQuestions = [
  "Who is the real customer?",
  "What problem are we solving?",
  "What does success look like?",
  "What should we build first?",
  "What should we avoid building?",
];

export const philosophyQuestions = [
  "Why does this product need to exist?",
  "Who is it for?",
  "What problem does it solve?",
  "What does success look like?",
  "What is the simplest way to solve it?",
  "What should we build now?",
  "What can wait?",
];
