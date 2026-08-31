import { Link } from "react-router-dom";
import { NavDots } from "@/components/layout/NavDots";

interface BackBarProps {
  activeSlug: string;
}

/** Barre de retour vers le tableau + pastilles de navigation entre projets. */
export function BackBar({ activeSlug }: BackBarProps): JSX.Element {
  return (
    <div className="mx-auto flex max-w-content items-center justify-between px-5 py-6 sm:px-14">
      <Link
        to="/#projets"
        className="font-mono text-[11px] uppercase tracking-mono-wide text-accent transition-colors hover:text-accent-hover"
      >
        ← Le tableau
      </Link>
      <NavDots activeSlug={activeSlug} />
    </div>
  );
}
