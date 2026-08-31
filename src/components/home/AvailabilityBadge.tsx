import { site } from "@/content/site";

/** Badge de disponibilité — correction handoff #1 : cible CDI, pas freelance. */
export function AvailabilityBadge(): JSX.Element {
  return (
    <span className="inline-flex items-center gap-2 border border-line bg-paper px-3 py-1.5">
      <span className="h-[7px] w-[7px] rounded-full bg-ok" aria-hidden="true" />
      <span className="font-mono text-[11px] uppercase tracking-mono text-ink">
        {site.availability}
      </span>
    </span>
  );
}
