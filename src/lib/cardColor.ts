import type { Project } from "@/content/projects";

/** Classes Tailwind littérales par couleur de fiche (nécessaire pour le JIT). */
export const cardBackground: Record<Project["cardColor"], string> = {
  sand: "bg-card-sand",
  sage: "bg-card-sage",
  slate: "bg-card-slate",
};

export const cardTabTint = "bg-[rgba(28,26,23,0.055)]";
