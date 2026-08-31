interface BoardAffordanceProps {
  onReset: () => void;
  interactive: boolean;
  hasMoved: boolean;
}

/** Barre d'affordance au-dessus du tableau : indique que les fiches bougent. */
export function BoardAffordance({
  onReset,
  interactive,
  hasMoved,
}: BoardAffordanceProps): JSX.Element {
  return (
    <div className="mx-auto flex max-w-content items-baseline justify-between px-5 pt-12 sm:px-14">
      <span className="font-mono text-[11px] uppercase tracking-mono-wide text-mono">
        Le tableau — 3 fiches
      </span>
      {interactive ? (
        <button
          type="button"
          onClick={onReset}
          className="border-b border-line-strong pb-0.5 font-mono text-[11px] uppercase tracking-mono text-mono transition-colors hover:text-ink disabled:opacity-40"
          disabled={!hasMoved}
        >
          {hasMoved ? "Réinitialiser les fiches" : "Fiches déplaçables"}
        </button>
      ) : null}
    </div>
  );
}
