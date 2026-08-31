import { site } from "@/content/site";
import { AvailabilityBadge } from "@/components/home/AvailabilityBadge";

/**
 * Hero volontairement compact (correction handoff #2) : le haut de la première
 * fiche doit être visible sans défiler en desktop.
 */
export function Hero(): JSX.Element {
  return (
    <section className="mx-auto flex max-w-content flex-col gap-9 px-5 pt-11 sm:px-14 bp:flex-row bp:items-start bp:justify-between">
      <div className="flex max-w-[680px] flex-col gap-5">
        <p className="font-mono text-[11px] uppercase tracking-mono-wider text-accent">
          {site.heroKicker}
        </p>
        <h1 className="font-display text-[clamp(2.25rem,5.6vw,3.9rem)] font-extrabold leading-[1.0] tracking-[-0.02em] text-ink">
          {site.heroTitle.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="max-w-[520px] font-sans text-[17px] leading-relaxed text-ink-muted">
          {site.intro}
        </p>
        <div className="flex flex-wrap gap-2.5 pt-1">
          <a
            href="#contact"
            className="rounded-sm bg-ink px-[18px] py-[11px] font-sans text-sm font-medium text-paper transition-opacity hover:opacity-90"
          >
            Me contacter
          </a>
          <a
            href={site.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm border border-line-strong px-[18px] py-[11px] font-sans text-sm font-medium text-ink transition-colors hover:border-ink"
          >
            GitHub
          </a>
        </div>
      </div>

      <aside className="hidden shrink-0 flex-col items-end gap-6 bp:flex">
        <AvailabilityBadge />
        <div className="relative w-[240px] rotate-[0.7deg] border border-line bg-editorial px-[18px] py-5 shadow-flat-sm">
          <span
            className="absolute -top-[11px] left-11 h-5 w-[72px] -rotate-[4deg] border border-line-soft bg-[rgba(28,26,23,0.055)]"
            aria-hidden="true"
          />
          <p className="font-sans text-[17px] leading-snug text-ink-soft">{site.editorialNote}</p>
        </div>
      </aside>
    </section>
  );
}
