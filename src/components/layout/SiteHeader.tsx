import { Link } from "react-router-dom";
import { site } from "@/content/site";

const NAV_LINKS = [
  { href: "/#projets", label: "Projets" },
  { href: "/#a-propos", label: "À propos" },
  { href: "/#methode", label: "Méthode" },
  { href: "/#contact", label: "Contact" },
];

/** Bandeau discret : marque nominative + ancres de section. */
export function SiteHeader(): JSX.Element {
  return (
    <header className="mx-auto flex max-w-content items-center justify-between px-5 pt-6 sm:px-14">
      <Link to="/" className="font-mono text-[11px] uppercase tracking-mono-wide text-ink">
        {site.name}
      </Link>
      <nav aria-label="Sections" className="hidden gap-6 bp:flex">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className="font-mono text-[11px] uppercase tracking-mono text-mono transition-colors hover:text-ink"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
