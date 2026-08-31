/** Lien d'évitement : premier élément focusable, masqué jusqu'au focus clavier. */
export function SkipLink(): JSX.Element {
  return (
    <a
      href="#contenu"
      className="sr-only z-50 focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:text-paper"
    >
      Aller au contenu
    </a>
  );
}
