import { createContext, useContext } from "react";
import type { ProjectScreenshot } from "@/content/projects";

export interface LightboxState {
  items: ProjectScreenshot[];
  index: number;
}

export interface LightboxApi {
  open: (state: LightboxState) => void;
}

export const LightboxContext = createContext<LightboxApi>({
  // Repli silencieux hors provider (tests, rendus isolés) : la capture ne zoome pas.
  open: () => undefined,
});

export function useLightbox(): LightboxApi {
  return useContext(LightboxContext);
}
