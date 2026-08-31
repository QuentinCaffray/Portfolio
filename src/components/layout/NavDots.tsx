import { Link } from "react-router-dom";
import { projects } from "@/content/projects";

interface NavDotsProps {
  /** slug du projet courant, ou null sur l'accueil */
  activeSlug: string | null;
}

/** Trois pastilles qui servent de raccourci entre les projets. */
export function NavDots({ activeSlug }: NavDotsProps): JSX.Element {
  return (
    <div className="flex items-center gap-2.5">
      {projects.map((project) => {
        const isActive = project.slug === activeSlug;
        return (
          <Link
            key={project.slug}
            to={`/projets/${project.slug}`}
            aria-label={`Aller à la fiche ${project.name}`}
            aria-current={isActive ? "page" : undefined}
            className="group -m-1.5 p-1.5"
          >
            <span
              className={`block h-2.5 w-2.5 rounded-full border transition-colors ${
                isActive
                  ? "border-accent bg-accent"
                  : "border-line-strong bg-transparent group-hover:border-accent"
              }`}
            />
          </Link>
        );
      })}
    </div>
  );
}
