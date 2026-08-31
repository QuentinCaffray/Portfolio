import { Link } from "react-router-dom";
import { useDocumentMeta } from "@/lib/useDocumentMeta";

export function NotFoundPage(): JSX.Element {
  useDocumentMeta({
    title: "Page introuvable · Quentin Caffray",
    description: "Cette page n'existe pas.",
    path: "/404",
  });

  return (
    <main
      id="contenu"
      className="mx-auto flex min-h-dvh max-w-content flex-col items-start justify-center gap-4 px-5 sm:px-14"
    >
      <p className="font-mono text-[11px] uppercase tracking-mono-wider text-accent">Erreur 404</p>
      <h1 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-extrabold leading-tight text-ink">
        Cette page n'existe pas.
      </h1>
      <Link
        to="/"
        className="mt-2 rounded-sm bg-ink px-[18px] py-[11px] font-sans text-sm font-medium text-paper transition-opacity hover:opacity-90"
      >
        Retour au tableau
      </Link>
    </main>
  );
}
