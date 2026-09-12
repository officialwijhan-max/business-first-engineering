import {
  Blocks,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  DraftingCompass,
  HeartPulse,
  Leaf,
  PanelsTopLeft,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Store,
  Users,
  WalletCards,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  number: string;
  title: string;
  summary: string;
  capabilities: string[];
  icon: LucideIcon;
};

export const services: Service[] = [
  {
    number: "01",
    title: "Product Discovery",
    summary: "Understand the business before building the product.",
    capabilities: [
      "Business understanding",
      "Requirements analysis",
      "User needs",
      "Product definition",
      "Feature prioritization",
      "MVP planning",
    ],
    icon: Compass,
  },
  {
    number: "02",
    title: "Product Design",
    summary: "Turn business requirements into clear digital experiences.",
    capabilities: ["UX", "UI", "User flows", "Prototyping", "Design systems", "Product interfaces"],
    icon: DraftingCompass,
  },
  {
    number: "03",
    title: "Software Engineering",
    summary: "Build scalable and maintainable digital products.",
    capabilities: [
      "Web applications",
      "Mobile applications",
      "Backend systems",
      "APIs",
      "Database architecture",
      "Integrations",
      "Laravel / PHP",
      "MySQL",
    ],
    icon: Wrench,
  },
  {
    number: "04",
    title: "ERP Solutions",
    summary: "Transform business operations into connected systems.",
    capabilities: [
      "ERP implementation",
      "ERP customization",
      "Inventory",
      "Sales",
      "Purchasing",
      "Accounting",
      "CRM",
      "HR & payroll",
      "Projects & reporting",
    ],
    icon: Blocks,
  },
  {
    number: "05",
    title: "Quality Assurance",
    summary: "Make sure the product works as intended.",
    capabilities: [
      "Functional testing",
      "Regression testing",
      "API testing",
      "Test cases",
      "Bug tracking",
      "Release validation",
    ],
    icon: ShieldCheck,
  },
  {
    number: "06",
    title: "Project & Delivery Management",
    summary: "Coordinate business, product, engineering and QA teams.",
    capabilities: [
      "Agile & Scrum",
      "Sprint planning",
      "Backlog management",
      "Estimation",
      "Risk management",
      "Stakeholder communication",
      "Delivery management",
    ],
    icon: ClipboardCheck,
  },
];

export const processSteps = [
  ["01", "Understand", "Understand the business, users, objectives and problems."],
  ["02", "Define", "Turn business problems into a clear product scope."],
  ["03", "Design", "Design the experience and product structure."],
  ["04", "Engineer", "Build the product using the right technology."],
  ["05", "Validate", "Test functionality, quality and real-world usability."],
  ["06", "Improve", "Learn from feedback and continuously improve the product."],
] as const;

export const values = [
  ["Understanding Before Execution", "No code should be written before understanding why it needs to exist."],
  ["Technical Honesty", "If an idea will not work technically or commercially, we say so early."],
  ["Intentional Simplicity", "The simplest solution that solves the real problem is often the better one."],
  ["Real Ownership", "We treat the product as our responsibility, not simply a list of tickets."],
  ["Transparency", "Clear progress. Clear problems. Clear expectations. No surprises at the end."],
] as const;

export const differentiators = [
  ["Business Understanding", "We understand the business before choosing the technology."],
  ["Technical Honesty", "We tell clients what they need to hear, not simply what they want to hear."],
  ["Product Thinking", "We focus on building the right product, not simply completing requirements."],
  ["Engineering Discipline", "We care about scalability, maintainability, testing and long-term product health."],
  ["Ownership", "We work as a technology partner, not an outsourced ticket machine."],
] as const;

export const industries: { name: string; icon: LucideIcon }[] = [
  { name: "Healthcare", icon: HeartPulse },
  { name: "Agriculture", icon: Leaf },
  { name: "Retail", icon: Store },
  { name: "E-commerce", icon: ShoppingBag },
  { name: "Automotive", icon: Settings2 },
  { name: "Fintech", icon: WalletCards },
  { name: "Enterprise", icon: BriefcaseBusiness },
  { name: "Digital Platforms", icon: PanelsTopLeft },
];

export const projectCategories = [
  "ERP",
  "Healthcare",
  "Agriculture",
  "E-commerce",
  "Mobile Applications",
  "Automotive",
  "Social Platforms",
  "Booking Platforms",
  "Fintech",
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

export const iconSet = { CheckCircle2, Smartphone, Sparkles, Users };