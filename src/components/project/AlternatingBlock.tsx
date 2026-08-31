import type { ProjectScreenshot } from "@/content/projects";
import { Screenshot } from "@/components/common/Screenshot";

interface AlternatingBlockProps {
  label: string;
  body: string;
  screenshot: ProjectScreenshot;
  /** "left" = capture à gauche du texte, "right" = capture à droite. */
  mediaSide: "left" | "right";
  rotation?: number;
  lightboxItems?: ProjectScreenshot[] | undefined;
  lightboxIndex?: number | undefined;
}

/**
 * Bloc « ce que ça a demandé » / « ce que ça a changé » : une capture et un
 * paragraphe, ordre inversé d'un bloc à l'autre. Quand la capture n'est pas
 * encore disponible, on affiche le texte seul plutôt qu'un cadre vide.
 */
export function AlternatingBlock({
  label,
  body,
  screenshot,
  mediaSide,
  rotation = 0,
  lightboxItems,
  lightboxIndex = 0,
}: AlternatingBlockProps): JSX.Element {
  const hasMedia = screenshot.placeholder !== true && screenshot.src !== "";

  const text = (
    <div
      className={`border border-line bg-panel p-6 shadow-flat-sm ${
        hasMedia ? "bp:mt-6 bp:flex-1" : "mx-auto max-w-2xl"
      }`}
    >
      <p className="mb-3.5 font-mono text-[11px] uppercase tracking-mono-wider text-mono">{label}</p>
      <p className="font-sans text-[16px] leading-[1.65] text-ink-soft">{body}</p>
    </div>
  );

  if (!hasMedia) {
    return <div className="mx-auto max-w-content px-5 sm:px-14">{text}</div>;
  }

  const media = (
    <div className="bp:flex-[1.6]">
      <Screenshot
        screenshot={screenshot}
        sizeClass="aspect-[16/10]"
        rotation={rotation}
        lightboxItems={lightboxItems}
        lightboxIndex={lightboxIndex}
      />
    </div>
  );

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8 px-5 sm:px-14 bp:flex-row bp:items-start bp:gap-10">
      {mediaSide === "left" ? (
        <>
          {media}
          {text}
        </>
      ) : (
        <>
          {text}
          {media}
        </>
      )}
    </div>
  );
}
