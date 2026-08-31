import { site } from "@/content/site";

/** Pied de page en aplat d'encre : disponibilité, téléphone, GitHub. */
export function SiteFooter(): JSX.Element {
  return (
    <footer id="contact" className="border-t border-line bg-ink text-paper">
      <div className="mx-auto flex max-w-content flex-col gap-6 px-5 py-9 sm:px-14 bp:flex-row bp:items-end bp:justify-between">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-mono-wide text-paper-dim">
            Contact
          </span>
          <p className="max-w-sm font-sans text-sm text-paper-dim">{site.contact.footerLine}</p>
        </div>
        <div className="flex flex-col gap-2.5 bp:items-end">
          <a
            href={site.contact.phoneHref}
            className="font-display text-2xl font-semibold text-paper transition-colors hover:text-accent"
          >
            {site.contact.phoneDisplay}
          </a>
          <a
            href={site.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[13px] text-paper-dim transition-colors hover:text-paper"
          >
            {site.contact.githubLabel}
          </a>
        </div>
      </div>
    </footer>
  );
}
