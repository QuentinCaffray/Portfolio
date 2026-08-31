import type { Project } from "@/content/projects";

interface TechnicalCalloutProps {
  technical: Project["technical"];
}

/** Encart « point technique notable » — correction handoff #4 (différenciation). */
export function TechnicalCallout({ technical }: TechnicalCalloutProps): JSX.Element {
  return (
    <div className="mx-auto max-w-content px-5 sm:px-14">
      <div className="border-l-2 border-accent bg-editorial/60 p-6 bp:p-8">
        <p className="mb-2.5 font-mono text-[11px] uppercase tracking-mono-wider text-accent">
          Point technique
        </p>
        <p className="mb-2 font-display text-[20px] font-semibold text-ink">{technical.label}</p>
        <p className="max-w-[720px] font-sans text-[16px] leading-[1.65] text-ink-soft">
          {technical.body}
        </p>
      </div>
    </div>
  );
}
