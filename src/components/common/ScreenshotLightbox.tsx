import { useCallback, useEffect, useRef } from "react";
import type { ProjectScreenshot } from "@/content/projects";

interface ScreenshotLightboxProps {
  items: ProjectScreenshot[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

/** Overlay d'agrandissement d'une capture, avec navigation dans la série. */
export function ScreenshotLightbox({
  items,
  index,
  onIndexChange,
  onClose,
}: ScreenshotLightboxProps): JSX.Element {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const current = items[index];
  const hasSeries = items.length > 1;

  const goTo = useCallback(
    (next: number) => {
      onIndexChange((next + items.length) % items.length);
    },
    [items.length, onIndexChange],
  );

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      previouslyFocused.current?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
      } else if (hasSeries && event.key === "ArrowRight") {
        goTo(index + 1);
      } else if (hasSeries && event.key === "ArrowLeft") {
        goTo(index - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, hasSeries, index, onClose]);

  if (!current) {
    return <></>;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Capture agrandie : ${current.caption}`}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-ink/90 px-4 py-6 sm:px-10"
      onClick={onClose}
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Fermer"
        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center border border-paper/30 bg-paper/10 font-mono text-lg text-paper transition-colors hover:bg-paper/20 sm:right-8 sm:top-8"
      >
        ×
      </button>

      <figure
        className="flex max-h-full max-w-[92vw] flex-col items-center gap-3"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={current.src}
          alt={current.alt}
          className="max-h-[80vh] max-w-full border border-paper/15 object-contain shadow-lift"
        />
        <figcaption className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-mono text-paper-dim">
          <span>{current.caption}</span>
          {hasSeries ? (
            <span aria-hidden="true">
              · {index + 1} / {items.length}
            </span>
          ) : null}
        </figcaption>
      </figure>

      {hasSeries ? (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goTo(index - 1);
            }}
            aria-label="Capture précédente"
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-paper/25 bg-paper/10 font-mono text-xl text-paper transition-colors hover:bg-paper/20 sm:left-6"
          >
            ←
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goTo(index + 1);
            }}
            aria-label="Capture suivante"
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-paper/25 bg-paper/10 font-mono text-xl text-paper transition-colors hover:bg-paper/20 sm:right-6"
          >
            →
          </button>
        </>
      ) : null}
    </div>
  );
}
