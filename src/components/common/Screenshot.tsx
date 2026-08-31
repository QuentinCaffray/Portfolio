import { useState } from "react";
import type { ProjectScreenshot } from "@/content/projects";

interface ScreenshotProps {
  screenshot: ProjectScreenshot;
  /** Classe de hauteur / ratio, ex. "h-52" ou "aspect-[16/10]". */
  sizeClass?: string;
  /** "framed" = cadre clair + légende ; "bare" = image seule (vignette de fiche). */
  variant?: "framed" | "bare";
  /** Légère rotation en degrés (max ±0.5 selon le handoff). */
  rotation?: number;
  /** true = charge l'image immédiatement (vignettes de fiche, au-dessus de la ligne de flottaison). */
  eager?: boolean;
  className?: string;
}

/**
 * Capture d'écran encadrée d'un cadre clair (les captures des apps sont
 * sombres, le site est clair). Si la capture n'est pas disponible, on affiche
 * une zone neutre portant sa légende — jamais une image cassée.
 */
export function Screenshot({
  screenshot,
  sizeClass = "aspect-[16/10]",
  variant = "framed",
  rotation = 0,
  eager = false,
  className = "",
}: ScreenshotProps): JSX.Element {
  const [failed, setFailed] = useState<boolean>(false);
  const showPlaceholder = screenshot.placeholder === true || screenshot.src === "" || failed;

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
      style={screenshot.focus ? { objectPosition: screenshot.focus } : undefined}
      className={`${sizeClass} w-full bg-[rgba(28,26,23,0.05)] object-cover object-top`}
    />
  );

  if (variant === "bare") {
    return <div className={`overflow-hidden ${className}`}>{media}</div>;
  }

  return (
    <figure
      className={`border border-line bg-panel p-2 shadow-flat ${className}`}
      style={rotation ? { transform: `rotate(${rotation}deg)` } : undefined}
    >
      {media}
      <figcaption className="label-mono mt-2 block px-1 pb-1">{screenshot.caption}</figcaption>
    </figure>
  );
}
