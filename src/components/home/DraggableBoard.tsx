import { projects } from "@/content/projects";
import { useDraggableCards } from "@/hooks/useDraggableCards";
import { BoardAffordance } from "@/components/home/BoardAffordance";
import { ProjectCard } from "@/components/home/ProjectCard";

const INITIAL_ROTATIONS = projects.map((project) => project.initialRotation);

/** Le « tableau » : les trois fiches projet déplaçables. */
export function DraggableBoard(): JSX.Element {
  const { getCardProps, reset, hasMoved, interactive } = useDraggableCards(INITIAL_ROTATIONS);

  return (
    <section id="projets" aria-label="Projets">
      <BoardAffordance onReset={reset} interactive={interactive} hasMoved={hasMoved} />
      <div className="mx-auto max-w-content px-5 pb-16 pt-6 sm:px-14">
        <ul className="flex flex-col gap-7 bp:flex-row bp:items-start">
          {projects.map((project, index) => (
            <li key={project.slug} className="flex bp:flex-1">
              <ProjectCard
                project={project}
                index={index}
                cardProps={getCardProps(index)}
                interactive={interactive}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
