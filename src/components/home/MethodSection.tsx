import { site } from "@/content/site";

/**
 * Méthode de travail en aplat d'encre profonde (correction handoff #6) :
 * rupture visuelle forte au milieu de la page claire.
 */
export function MethodSection(): JSX.Element {
  return (
    <section id="methode" aria-labelledby="methode-titre" className="bg-ink text-paper">
      <div className="mx-auto max-w-content px-5 py-16 sm:px-14">
        <p
          id="methode-titre"
          className="mb-9 font-mono text-[11px] uppercase tracking-mono-wider text-paper-dim"
        >
          Méthode de travail
        </p>
        <div className="grid gap-8 bp:grid-cols-3 bp:gap-6">
          {site.method.map((item) => (
            <div key={item.step} className="flex flex-col gap-2.5 border-t border-paper/25 pt-5">
              <span className="font-mono text-[11px] uppercase tracking-mono-wide text-accent-ondark">
                {item.step}
              </span>
              <h3 className="font-display text-xl font-semibold text-paper">{item.title}</h3>
              <p className="font-sans text-[14px] leading-relaxed text-paper-dim">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
