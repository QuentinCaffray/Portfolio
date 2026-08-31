import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent, PointerEvent } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/** En-deçà de ce déplacement, l'interaction est un clic, pas un glisser. */
const CLICK_THRESHOLD_PX = 4;
const BASE_Z_INDEX = 20;
const LIFT_SHADOW = "12px 16px 26px rgba(28,26,23,0.16)";
const HOVER_SHADOW = "10px 12px 22px rgba(28,26,23,0.13)";
const DROP_TRANSITION = "transform .3s cubic-bezier(.2,1.1,.35,1), box-shadow .2s ease";
const HOVER_TRANSITION = "transform .25s ease, box-shadow .25s ease";
const RESET_TRANSITION = "transform .5s cubic-bezier(.2,1.2,.3,1)";

interface Position {
  x: number;
  y: number;
}

export interface DraggableCardProps {
  ref: (element: HTMLElement | null) => void;
  onPointerDown: (event: PointerEvent<HTMLElement>) => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  onClickCapture: (event: MouseEvent<HTMLElement>) => void;
  style: CSSProperties;
}

interface DraggableCards {
  getCardProps: (index: number) => DraggableCardProps;
  reset: () => void;
  hasMoved: boolean;
  interactive: boolean;
}

/**
 * Geste signature du site : les fiches projet s'attrapent et se déposent
 * librement sur le « tableau ». Réécriture en hook React du prototype du
 * handoff (design_handoff_portfolio/Portfolio HF.dc.html §script).
 *
 * - `pointerdown/move/up`, pas de drag & drop HTML5.
 * - Déplacement cumulatif mémorisé par fiche, léger tilt aléatoire au dépôt.
 * - Sous le seuil de 4px, la navigation du <Link> est laissée passer.
 * - `prefers-reduced-motion` : glisser désactivé, fiches immobiles.
 */
export function useDraggableCards(initialRotations: readonly number[]): DraggableCards {
  const prefersReducedMotion = usePrefersReducedMotion();

  const elements = useRef<Map<number, HTMLElement>>(new Map());
  const positions = useRef<Map<number, Position>>(new Map());
  const angles = useRef<Map<number, number>>(new Map());
  const refCallbacks = useRef<Map<number, (element: HTMLElement | null) => void>>(new Map());
  const topZIndex = useRef<number>(BASE_Z_INDEX);
  const suppressNextClick = useRef<boolean>(false);
  const draggingIndex = useRef<number | null>(null);
  const teardownActiveDrag = useRef<(() => void) | null>(null);
  const [hasMoved, setHasMoved] = useState<boolean>(false);

  // Si le composant se démonte pendant un glisser, on retire les écouteurs window.
  useEffect(() => () => teardownActiveDrag.current?.(), []);

  const paint = useCallback(
    (index: number, position: Position, angle: number, dragging: boolean): void => {
      const element = elements.current.get(index);
      if (!element) {
        return;
      }
      const scale = dragging ? " scale(1.012)" : "";
      element.style.transform = `translate(${position.x}px, ${position.y}px) rotate(${angle}deg)${scale}`;
    },
    [],
  );

  const initialAngleFor = useCallback(
    (index: number): number => initialRotations[index] ?? 0,
    [initialRotations],
  );

  const getRefCallback = useCallback(
    (index: number): ((element: HTMLElement | null) => void) => {
      const cached = refCallbacks.current.get(index);
      if (cached) {
        return cached;
      }
      const callback = (element: HTMLElement | null): void => {
        if (!element) {
          elements.current.delete(index);
          return;
        }
        elements.current.set(index, element);
        if (!positions.current.has(index)) {
          positions.current.set(index, { x: 0, y: 0 });
        }
        if (!angles.current.has(index)) {
          angles.current.set(index, initialAngleFor(index));
        }
        if (!prefersReducedMotion) {
          paint(index, positions.current.get(index)!, angles.current.get(index)!, false);
        }
      };
      refCallbacks.current.set(index, callback);
      return callback;
    },
    [initialAngleFor, paint, prefersReducedMotion],
  );

  const handlePointerDown = useCallback(
    (index: number, event: PointerEvent<HTMLElement>): void => {
      if (prefersReducedMotion || event.button !== 0) {
        return;
      }
      const element = elements.current.get(index);
      if (!element) {
        return;
      }

      // Empêche la sélection de texte pendant le glisser.
      event.preventDefault();

      const startPosition = positions.current.get(index) ?? { x: 0, y: 0 };
      const startAngle = angles.current.get(index) ?? initialAngleFor(index);
      const pointerOriginX = event.clientX;
      const pointerOriginY = event.clientY;
      const tiltTarget = startAngle + (Math.random() * 1.1 - 0.55);
      let travelledDistance = 0;

      draggingIndex.current = index;
      element.style.zIndex = String((topZIndex.current += 1));
      element.style.cursor = "grabbing";
      element.style.transition = "none";
      element.style.boxShadow = LIFT_SHADOW;

      const handleMove = (moveEvent: globalThis.PointerEvent): void => {
        const deltaX = moveEvent.clientX - pointerOriginX;
        const deltaY = moveEvent.clientY - pointerOriginY;
        travelledDistance = Math.max(travelledDistance, Math.hypot(deltaX, deltaY));
        const nextPosition = { x: startPosition.x + deltaX, y: startPosition.y + deltaY };
        positions.current.set(index, nextPosition);
        paint(index, nextPosition, tiltTarget, true);
      };

      const detach = (): void => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        teardownActiveDrag.current = null;
      };

      const handleUp = (): void => {
        detach();
        draggingIndex.current = null;
        const finalPosition = positions.current.get(index) ?? startPosition;
        angles.current.set(index, tiltTarget);
        element.style.cursor = "";
        element.style.transition = DROP_TRANSITION;
        element.style.boxShadow = "";
        paint(index, finalPosition, tiltTarget, false);

        if (travelledDistance > CLICK_THRESHOLD_PX) {
          suppressNextClick.current = true;
          setHasMoved(true);
        }
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
      teardownActiveDrag.current = detach;
    },
    [initialAngleFor, paint, prefersReducedMotion],
  );

  const handleClickCapture = useCallback((event: MouseEvent<HTMLElement>): void => {
    if (suppressNextClick.current) {
      event.preventDefault();
      event.stopPropagation();
      suppressNextClick.current = false;
    }
  }, []);

  /**
   * Au survol, la fiche se redresse à 0° et l'ombre s'allonge (recommandation
   * du handoff). Neutralisé pendant un glisser.
   */
  const handleHover = useCallback(
    (index: number, hovering: boolean): void => {
      if (prefersReducedMotion || draggingIndex.current !== null) {
        return;
      }
      const element = elements.current.get(index);
      if (!element) {
        return;
      }
      const position = positions.current.get(index) ?? { x: 0, y: 0 };
      element.style.transition = HOVER_TRANSITION;
      if (hovering) {
        element.style.transform = `translate(${position.x}px, ${position.y}px) rotate(0deg)`;
        element.style.boxShadow = HOVER_SHADOW;
      } else {
        const angle = angles.current.get(index) ?? initialAngleFor(index);
        element.style.transform = `translate(${position.x}px, ${position.y}px) rotate(${angle}deg)`;
        element.style.boxShadow = "";
      }
    },
    [initialAngleFor, prefersReducedMotion],
  );

  const reset = useCallback((): void => {
    elements.current.forEach((element, index) => {
      const angle = initialAngleFor(index);
      positions.current.set(index, { x: 0, y: 0 });
      angles.current.set(index, angle);
      element.style.zIndex = "";
      element.style.transition = RESET_TRANSITION;
      paint(index, { x: 0, y: 0 }, angle, false);
    });
    setHasMoved(false);
  }, [initialAngleFor, paint]);

  const getCardProps = useCallback(
    (index: number): DraggableCardProps => ({
      ref: getRefCallback(index),
      onPointerDown: (event) => handlePointerDown(index, event),
      onPointerEnter: () => handleHover(index, true),
      onPointerLeave: () => handleHover(index, false),
      onClickCapture: handleClickCapture,
      style: prefersReducedMotion
        ? {}
        : { touchAction: "none", willChange: "transform" },
    }),
    [getRefCallback, handleClickCapture, handleHover, handlePointerDown, prefersReducedMotion],
  );

  return { getCardProps, reset, hasMoved, interactive: !prefersReducedMotion };
}
