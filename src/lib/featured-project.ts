import type { CaseStudy } from "@/api/types";

// Separate from the page component so route loaders can use it without pulling the whole
// case-studies page into the main JS bundle.
/** The `featured` project, else the most recently published one, else the first. */
export function pickFeaturedProject(projects: CaseStudy[]): CaseStudy | null {
  const flagged = projects.find((project) => project.featured);
  if (flagged) return flagged;
  const [mostRecent] = [...projects].sort((a, b) =>
    (b.published_at ?? "").localeCompare(a.published_at ?? ""),
  );
  return mostRecent ?? null;
}
