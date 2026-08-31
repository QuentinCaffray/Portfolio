import type { Project } from "@/content/projects";
import { cardBackground } from "@/lib/cardColor";

interface ProjectHeaderProps {
  project: Project;
}

/** Fiche d'en-tête de la page projet : titre, chapô, chiffres, métadonnées. */
export function ProjectHeader({ project }: ProjectHeaderProps): JSX.Element {
  const visibleFigures = project.figures.filter((figure) => !figure.todo);

  const metaRows = [
    ["Contexte", project.meta.contexte],
    ["Rôle", project.meta.role],
    ["Stack", project.meta.stack],
    ["Statut", project.meta.statut],
  ] as const;

  return (
    <div className="mx-auto max-w-content px-5 sm:px-14">
      <div
        className={`relative grid gap-10 border border-line p-8 shadow-flat-lg bp:grid-cols-[1fr_340px] bp:gap-14 bp:p-10 ${
          cardBackground[project.cardColor]
        }`}
      >
        <span
          className="absolute -top-[13px] left-16 h-6 w-[110px] -rotate-2 border border-line-soft bg-[rgba(28,26,23,0.055)]"
          aria-hidden="true"
        />

        <div className="flex flex-col gap-5">
          <div className="flex items-baseline gap-3.5">
            <span className="font-mono text-[12px] tracking-mono text-accent">{project.order}</span>
            <h1 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-ink">
              {project.name}
            </h1>
          </div>

          <p className="max-w-[600px] font-sans text-[19px] leading-relaxed text-ink-soft">
            {project.intro}
          </p>

          {visibleFigures.length > 0 ? (
            <dl className="mt-1 flex flex-wrap gap-x-9 gap-y-3 border-t border-line-strong pt-4">
              {visibleFigures.map((figure) => (
                <div key={figure.label} className="flex flex-col gap-0.5">
                  <dt className="font-display text-[28px] font-extrabold leading-none text-ink">
                    {figure.value}
                  </dt>
                  <dd className="max-w-[170px] font-mono text-[11px] uppercase tracking-mono text-mono">
                    {figure.label}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        <dl className="flex flex-col border-t border-line-strong">
          {metaRows.map(([term, value], index) => (
            <div
              key={term}
              className={`flex flex-col gap-1 py-2.5 ${
                index < metaRows.length - 1 ? "border-b border-line-soft" : ""
              }`}
            >
              <dt className="font-mono text-[11px] uppercase tracking-mono text-mono">{term}</dt>
              <dd
                className={`font-sans text-[14px] ${
                  term === "Statut" ? "font-medium text-accent" : "text-ink"
                }`}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
