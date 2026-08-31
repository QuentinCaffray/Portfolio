import { useState } from "react";
import type { ProjectScreenshot } from "@/content/projects";
import { useLightbox } from "@/lib/useLightbox";

interface ScreenshotProps {
  screenshot: ProjectScreenshot;
  /** Classe de hauteur / ratio, ex. "h-52" ou "aspect-[16/10]". */
  sizeClass?: string;
  /** "framed" = cadre clair + légende ; "bare" = image seule (vignette de fiche). */
  variant?: "framed" | "bare";
  /** "contain" = capture entière (défaut) ; "cover" = recadrée (vignettes). */
  fit?: "cover" | "contain";
  /** Légère rotation en degrés (max ±0.5 selon le handoff). */
  rotation?: number;
  /** true = charge l'image immédiatement (vignettes de fiche, au-dessus de la ligne de flottaison). */
  eager?: boolean;
  /** Série de captures à ouvrir en grand au clic ; sans, la capture n'est pas cliquable. */
  lightboxItems?: ProjectScreenshot[] | undefined;
  lightboxIndex?: number | undefined;
  className?: string;
}

/**
 * Capture d'écran encadrée d'un cadre clair (les captures des apps sont
 * sombres, le site est clair). Cliquable pour agrandir si `lightboxItems` est
 * fourni. Si la capture n'est pas disponible, on affiche une zone neutre
 * portant sa légende — jamais une image cassée.
 */
export function Screenshot({
  screenshot,
  sizeClass = "aspect-[16/10]",
  variant = "framed",
  fit = "contain",
  rotation = 0,
  eager = false,
  lightboxItems,
  lightboxIndex = 0,
  className = "",
}: ScreenshotProps): JSX.Element {
  const [failed, setFailed] = useState<boolean>(false);
  const lightbox = useLightbox();
  const showPlaceholder = screenshot.placeholder === true || screenshot.src === "" || failed;
  const effectiveFit = screenshot.fit ?? fit;
  const canZoom = !showPlaceholder && lightboxItems !== undefined && lightboxItems.length > 0;

  const objectClass =
    effectiveFit === "cover" ? "object-cover object-top" : "object-contain";

  const media = showPlaceholder ? (
    <div
      className={`flex ${sizeClass} w-full items-center justify-center bg-[rgba(28,26,23,0.07)] px-6 text-center`}
    >
      <span className="label-mono">
        {screenshot.placeholder ? `${screenshot.caption} — à venir` : screenshot.caption}
      </span>
    </div>
  ) : (
    <img
      src={screenshot.src}
      alt={screenshot.alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      style={effectiveFit === "cover" && screenshot.focus ? { objectPosition: screenshot.focus } : undefined}
      className={`${sizeClass} w-full bg-[#e9e4d8] ${objectClass}`}
    />
  );

  const clickableMedia = canZoom ? (
    <button
      type="button"
      onClick={() => lightbox.open({ items: lightboxItems, index: lightboxIndex })}
      aria-label={`Agrandir la capture : ${screenshot.caption}`}
      className="block w-full cursor-zoom-in"
    >
      {media}
    </button>
  ) : (
    media
  );

  if (variant === "bare") {
    return <div className={`overflow-hidden ${className}`}>{clickableMedia}</div>;
  }

  return (
    <figure
      className={`border border-line bg-panel p-2 shadow-flat ${className}`}
      style={rotation ? { transform: `rotate(${rotation}deg)` } : undefined}
    >
      {clickableMedia}
      <figcaption className="label-mono mt-2 block px-1 pb-1">{screenshot.caption}</figcaption>
    </figure>
  );
}
