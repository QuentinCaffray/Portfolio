import { Link } from "react-router-dom";
import type { Project } from "@/content/projects";
import type { DraggableCardProps } from "@/hooks/useDraggableCards";
import { cardBackground } from "@/lib/cardColor";
import { Screenshot } from "@/components/common/Screenshot";

const STAGGER_CLASS = ["bp:mt-0", "bp:mt-[34px]", "bp:mt-[68px]"];
const TAB_CLASS = [
  "left-[8%] w-[62px] -rotate-[7deg]",
  "left-[42%] w-[78px] rotate-[5deg]",
  "left-[30%] w-[104px] rotate-[2deg]",
];

interface ProjectCardProps {
  project: Project;
  index: number;
  cardProps: DraggableCardProps;
  interactive: boolean;
}

export function ProjectCard({
  project,
  index,
  cardProps,
  interactive,
}: ProjectCardProps): JSX.Element {
  const { ref, onPointerDown, onPointerEnter, onPointerLeave, onClickCapture, style } = cardProps;

  return (
    <Link
      ref={ref}
      to={`/projets/${project.slug}`}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onClickCapture={onClickCapture}
      style={style}
      className={`group relative flex flex-1 flex-col border border-line shadow-flat outline-offset-4 ${
        cardBackground[project.cardColor]
      } ${STAGGER_CLASS[index] ?? ""} ${
        interactive ? "cursor-grab select-none active:cursor-grabbing" : ""
      }`}
    >
      <span
        className={`absolute -top-[11px] h-5 border border-line-soft bg-[rgba(28,26,23,0.055)] ${
          TAB_CLASS[index] ?? "left-1/2 w-[72px]"
        }`}
        aria-hidden="true"
      />

      <div className="border-b border-line bg-[rgba(28,26,23,0.06)]">
        <Screenshot
          screenshot={project.screenshots.card}
          sizeClass="h-44"
          variant="bare"
          eager
        />
      </div>

      <div className="flex flex-col gap-3.5 p-5 pb-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-[26px] font-semibold leading-tight tracking-[-0.01em] text-ink">
            {project.name}
          </h3>
          <span
            className={`shrink-0 font-mono text-[11px] uppercase tracking-mono ${
              project.statusAccent ? "text-accent" : "text-mono"
            }`}
          >
            {project.statusLabel}
          </span>
        </div>

        <p className="font-sans text-[15px] leading-relaxed text-ink-muted">{project.summary}</p>

        <p className="border-l-2 border-accent/40 pl-3 font-sans text-[13px] leading-snug text-ink-soft">
          {project.technical.label}
        </p>

        <dl className="flex flex-col border-t border-line">
          {(
            [
              ["Contexte", project.cardMeta.contexte],
              ["Rôle", project.cardMeta.role],
              ["Usage", project.cardMeta.usage],
            ] as const
          ).map(([term, value], rowIndex, rows) => (
            <div
              key={term}
              className={`flex items-baseline justify-between gap-4 py-2.5 ${
                rowIndex < rows.length - 1 ? "border-b border-line-soft" : ""
              }`}
            >
              <dt className="font-mono text-[11px] uppercase tracking-mono text-mono">{term}</dt>
              <dd className="text-right font-sans text-[13px] text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        <span className="mt-1 self-end font-mono text-[12px] uppercase tracking-mono text-ink transition-colors group-hover:text-accent">
          Ouvrir la fiche →
        </span>
      </div>
    </Link>
  );
}
