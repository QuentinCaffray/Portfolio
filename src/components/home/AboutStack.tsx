import { site } from "@/content/site";

/** Bloc « À propos » + panneau « Stack », avec les chiffres clés du parcours. */
export function AboutStack(): JSX.Element {
  return (
    <section
      id="a-propos"
      aria-labelledby="a-propos-titre"
      className="mx-auto max-w-content px-5 py-16 sm:px-14"
    >
      <div className="grid gap-10 bp:grid-cols-[1fr_380px] bp:gap-14">
        <div className="flex flex-col gap-5">
          <p
            id="a-propos-titre"
            className="font-mono text-[11px] uppercase tracking-mono-wider text-mono"
          >
            À propos
          </p>
          <p className="max-w-[600px] font-sans text-[19px] leading-relaxed text-ink-soft">
            {site.about}
          </p>
          <dl className="mt-2 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-5">
            {site.heroFigures.map((figure) => (
              <div key={figure.label} className="flex flex-col gap-1">
                <dt className="font-display text-[26px] font-extrabold leading-none text-ink">
                  {figure.value}
                </dt>
                <dd className="max-w-[190px] font-mono text-[11px] uppercase tracking-mono text-mono">
                  {figure.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="h-fit border border-line bg-panel px-6 py-5">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-mono-wider text-mono">Stack</p>
          <dl className="flex flex-col">
            {site.stack.map((row, index, rows) => (
              <div
                key={row.name}
                className={`flex items-baseline justify-between gap-4 py-2 ${
                  index < rows.length - 1 ? "border-b border-line-soft" : ""
                }`}
              >
                <dt className="font-sans text-[15px] font-medium text-ink">{row.name}</dt>
                <dd className="font-mono text-[12px] text-mono">{row.level}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
