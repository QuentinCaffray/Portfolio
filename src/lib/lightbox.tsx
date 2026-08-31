import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { LightboxContext, type LightboxApi, type LightboxState } from "@/lib/useLightbox";
import { ScreenshotLightbox } from "@/components/common/ScreenshotLightbox";

/**
 * Fournit `useLightbox().open(...)` à toute l'app et rend l'unique overlay
 * d'agrandissement des captures.
 */
export function LightboxProvider({ children }: { children: ReactNode }): JSX.Element {
  const [state, setState] = useState<LightboxState | null>(null);

  const open = useCallback((next: LightboxState) => {
    setState(next);
  }, []);

  const close = useCallback(() => {
    setState(null);
  }, []);

  const setIndex = useCallback((index: number) => {
    setState((current) => (current ? { ...current, index } : current));
  }, []);

  const api = useMemo<LightboxApi>(() => ({ open }), [open]);

  return (
    <LightboxContext.Provider value={api}>
      {children}
      {state ? (
        <ScreenshotLightbox
          items={state.items}
          index={state.index}
          onIndexChange={setIndex}
          onClose={close}
        />
      ) : null}
    </LightboxContext.Provider>
  );
}
