import type { ProjectScreenshot } from "@/content/projects";
import { Screenshot } from "@/components/common/Screenshot";

interface ProjectGalleryProps {
  /** Captures de la galerie (extra, hors blocs demande/change). */
  screenshots: ProjectScreenshot[];
  /** Série complète de la page, pour la navigation dans la lightbox. */
  lightboxItems: ProjectScreenshot[];
}

/** Grille de captures supplémentaires, agrandissables au clic. */
export function ProjectGallery({ screenshots, lightboxItems }: ProjectGalleryProps): JSX.Element {
  const shown = screenshots.filter((shot) => shot.placeholder !== true && shot.src !== "");
  if (shown.length === 0) {
    return <></>;
  }

  return (
    <section
      aria-labelledby="galerie-titre"
      className="mx-auto max-w-content px-5 sm:px-14"
    >
      <p
        id="galerie-titre"
        className="mb-5 font-mono text-[11px] uppercase tracking-mono-wider text-mono"
      >
        L'application en images
      </p>
      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 bp:grid-cols-3">
        {shown.map((shot) => (
          <li key={shot.src}>
            <Screenshot
              screenshot={shot}
              variant="framed"
              sizeClass="aspect-[16/10]"
              lightboxItems={lightboxItems}
              lightboxIndex={lightboxItems.indexOf(shot)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
