import { Link } from "react-router-dom";
import { getProject, type ProjectSlug } from "@/content/projects";

interface NextProjectNavProps {
  nextSlug: ProjectSlug;
}

/** Pied de navigation : mène à la fiche suivante. */
export function NextProjectNav({ nextSlug }: NextProjectNavProps): JSX.Element {
  const next = getProject(nextSlug);
  if (!next) {
    return <></>;
  }

  return (
    <nav className="border-t border-line bg-method" aria-label="Projet suivant">
      <Link
        to={`/projets/${next.slug}`}
        className="group mx-auto flex max-w-content items-center justify-between px-5 py-7 sm:px-14"
      >
        <span className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-mono-wider text-mono">
            Fiche suivante
          </span>
          <span className="font-display text-[26px] font-semibold text-ink bp:text-[30px]">
            {next.name}
          </span>
        </span>
        <span className="font-mono text-xl text-accent transition-transform group-hover:translate-x-1">
          →
        </span>
      </Link>
    </nav>
  );
}
