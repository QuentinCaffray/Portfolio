import { useEffect } from "react";

// Domaine de production : les URL canoniques et Open Graph pointent toujours
// ici, quel que soit l'hôte d'accès (domaine Railway, prévisualisation, local),
// pour consolider le référencement sur une seule adresse.
const SITE_ORIGIN = "https://www.portfolio.eslabs.fr";

interface DocumentMeta {
  title: string;
  description: string;
  /** chemin absolu depuis la racine, ex. "/projets/la-popote" */
  path: string;
}

function setMetaByName(name: string, content: string): void {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("name", name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function setMetaByProperty(property: string, content: string): void {
  const element = document.head.querySelector<HTMLMetaElement>(
    `meta[property="${property}"]`,
  );
  if (element) {
    element.setAttribute("content", content);
  }
}

function setCanonical(href: string): void {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

/**
 * Met à jour <title>, la meta description, l'URL canonique et les balises
 * Open Graph correspondantes à chaque changement de route.
 */
export function useDocumentMeta({ title, description, path }: DocumentMeta): void {
  useEffect(() => {
    const url = `${SITE_ORIGIN}${path}`;
    document.title = title;
    setMetaByName("description", description);
    setCanonical(url);
    setMetaByProperty("og:title", title);
    setMetaByProperty("og:description", description);
    setMetaByProperty("og:url", url);
    setMetaByName("twitter:title", title);
    setMetaByName("twitter:description", description);
  }, [title, description, path]);
}
