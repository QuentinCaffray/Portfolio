import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Remet le défilement en haut à chaque changement de page, ou cible l'ancre
 * (#projets, #contact...) quand il y en a une.
 */
export function ScrollManager(): null {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    // Changement de page : retour en haut, sans animation.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}
