import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { cellKey, cellsOnSegment, GRID_CELL } from "@/lib/paperGrid";

type CrayonColorId = "rouge" | "terracotta" | "sauge" | "ardoise" | "ocre" | "encre";
type DrawTool = "off" | CrayonColorId | "eraser";

const CRAYON_COLORS: { id: CrayonColorId; label: string; fill: string; swatch: string }[] = [
  { id: "rouge", label: "Rouge", fill: "rgba(190,46,38,0.36)", swatch: "#be2e26" },
  { id: "terracotta", label: "Terre cuite", fill: "rgba(160,74,44,0.34)", swatch: "#a04a2c" },
  { id: "sauge", label: "Vert sauge", fill: "rgba(108,140,98,0.34)", swatch: "#6c8c62" },
  { id: "ardoise", label: "Bleu ardoise", fill: "rgba(104,128,165,0.34)", swatch: "#6880a5" },
  { id: "ocre", label: "Ocre", fill: "rgba(201,150,58,0.32)", swatch: "#c9963a" },
  { id: "encre", label: "Encre", fill: "rgba(28,26,23,0.17)", swatch: "#1c1a17" },
];

/** Couleur des traits d'amorce laissés sur le tableau au chargement. */
const SEED_FILL = "rgba(190,46,38,0.30)";

interface Box {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
}

/** Boîte d'un élément, en coordonnées document. */
function boxOf(element: Element): Box {
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
    right: rect.right + window.scrollX,
    bottom: rect.bottom + window.scrollY,
    width: rect.width,
  };
}

/** Boîte du texte contenu (et non de la boîte de l'élément), en doc. */
function textBoxOf(element: Element): Box {
  const range = document.createRange();
  range.selectNodeContents(element);
  const rect = range.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
    right: rect.right + window.scrollX,
    bottom: rect.bottom + window.scrollY,
    width: rect.width,
  };
}

/** Trait horizontal en pointillé (segments + interstices). */
function dashedRule(x0: number, x1: number, y: number): number[][] {
  const DASH = 50;
  const GAP = 48;
  const segments: number[][] = [];
  for (let x = x0; x < x1 - 6; x += DASH + GAP) {
    segments.push([x, y, Math.min(x + DASH, x1), y]);
  }
  return segments;
}

/** Souligné rouge sous le texte d'un élément (mesuré, pas la boîte). */
function underlineOf(element: Element | null): number[][] {
  if (!element) {
    return [];
  }
  const text = textBoxOf(element);
  if (text.width < 6) {
    return [];
  }
  return [[text.left - 3, text.bottom + 7, text.right + 3, text.bottom + 7]];
}

/** Crochet d'angle en L ; `hx`/`hy` orientent les deux branches. */
function cornerBracket(x: number, y: number, size: number, hx: 1 | -1, hy: 1 | -1): number[][] {
  return [
    [x, y, x + hx * size, y],
    [x, y, x, y + hy * size],
  ];
}

/**
 * Amorce du tableau : des annotations rouges qui commentent la page plutôt que
 * de la décorer au hasard. Mesurées sur le DOM réel (donc justes à toute
 * largeur) : la ligne qui sépare le hero des fiches, le soulignage des libellés
 * de section, des crochets qui cadrent le badge de dispo et la rangée de fiches.
 * Éphémère : repart vierge au rechargement.
 */
function seedStrokes(): number[][] {
  const hero = document.querySelector("main > section");
  const heading = document.querySelector("h1");
  if (!hero || !heading) {
    return [];
  }

  const heroBox = boxOf(hero);
  const headingBox = boxOf(heading);
  const inset = headingBox.left - heroBox.left; // marge intérieure de la section
  const contentLeft = heroBox.left + inset;
  const contentRight = heroBox.right - inset;

  const tableauLabel = document.querySelector("#projets span");
  const aboutLabel = document.querySelector("#a-propos-titre");
  const deck = document.querySelector("#projets ul");
  const badge = document.querySelector("main > section aside > span");

  const strokes: number[][] = [];

  // 1. la ligne (pointillé) qui sépare le texte des fiches, avec crochets aux bouts
  const labelTop = tableauLabel ? boxOf(tableauLabel).top : heroBox.bottom + 44;
  const separatorY = Math.round((heroBox.bottom + labelTop) / 2);
  strokes.push(...dashedRule(contentLeft, contentRight, separatorY));
  strokes.push([contentLeft, separatorY, contentLeft, separatorY + 13]);
  strokes.push([contentRight, separatorY, contentRight, separatorY + 13]);

  // 2. crochet dans la gouttière, au niveau du titre (le cadre)
  if (inset > 40) {
    strokes.push(...cornerBracket(heroBox.left + 8, headingBox.top, 30, 1, 1));
  }

  // 3. soulignage de « À propos » (donne à lire la structure de la page)
  strokes.push(...underlineOf(aboutLabel));

  // 4. crochet bas-droite qui signe la rangée de fiches
  if (deck) {
    const d = boxOf(deck);
    strokes.push(...cornerBracket(d.right + 16, d.bottom + 16, 32, -1, -1));
  }

  // 5. crochets autour du badge de disponibilité (repère pour l'œil du recruteur)
  if (badge) {
    const b = boxOf(badge);
    if (b.width > 0) {
      strokes.push(...cornerBracket(b.left - 11, b.top - 11, 24, 1, 1));
      strokes.push(...cornerBracket(b.right + 11, b.bottom + 11, 24, -1, -1));
    }
  }

  return strokes;
}

const CRAYON_CURSOR =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M3 21l3.5-1 11-11-2.5-2.5-11 11z' fill='%23e8dcb8' stroke='%231c1a17' stroke-width='1.3'/%3E%3Cpath d='M14.5 5.5l2.5 2.5 2-2a1.4 1.4 0 0 0 0-2l-.5-.5a1.4 1.4 0 0 0-2 0z' fill='%238a4a2c' stroke='%231c1a17' stroke-width='1.3'/%3E%3C/svg%3E\") 3 21, crosshair";

function fillFor(tool: DrawTool): string | null {
  return CRAYON_COLORS.find((color) => color.id === tool)?.fill ?? null;
}

/**
 * Le fond est un tableau : on peut prendre un crayon et colorier les carreaux.
 * Le canvas est `fixed` (jamais dans le flux, n'affecte pas la hauteur de page)
 * et se repeint au scroll ; les carreaux sont mémorisés en coordonnées document.
 * Outil éteint par défaut, couche de capture séparée quand actif, dessin éphémère.
 */
export function PaperDraw(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cells = useRef<Map<string, string>>(new Map());
  const isDrawing = useRef<boolean>(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const rafId = useRef<number | null>(null);
  const [tool, setTool] = useState<DrawTool>("off");
  const [panelOpen, setPanelOpen] = useState<boolean>(false);

  const active = tool !== "off";

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const offsetX = window.scrollX;
    const offsetY = window.scrollY;
    cells.current.forEach((fill, key) => {
      const [column, row] = key.split(",").map(Number);
      const x = column * GRID_CELL - offsetX;
      const y = row * GRID_CELL - offsetY;
      if (x > canvas.width || y > canvas.height || x + GRID_CELL < 0 || y + GRID_CELL < 0) {
        return;
      }
      ctx.fillStyle = fill;
      ctx.fillRect(x, y, GRID_CELL, GRID_CELL);
    });
  }, []);

  const scheduleRedraw = useCallback(() => {
    if (rafId.current !== null) {
      return;
    }
    rafId.current = window.requestAnimationFrame(() => {
      rafId.current = null;
      redraw();
    });
  }, [redraw]);

  const applyCell = useCallback(
    (key: string, currentTool: DrawTool) => {
      if (currentTool === "eraser") {
        cells.current.delete(key);
      } else {
        const fill = fillFor(currentTool);
        if (!fill) {
          return;
        }
        cells.current.set(key, fill);
      }
      scheduleRedraw();
    },
    [scheduleRedraw],
  );

  // Canvas fixe, dimensionné sur le viewport.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const resize = (): void => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      redraw();
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", scheduleRedraw, { passive: true });
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", scheduleRedraw);
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [redraw, scheduleRedraw]);

  // Amorce : annotations rouges mesurées sur le DOM de l'accueil. On attend le
  // chargement des polices pour que les soulignés tombent juste. Idempotent
  // (mêmes carreaux) donc sans garde ; éphémère (repart vierge au rechargement).
  useEffect(() => {
    if (window.location.pathname !== "/") {
      return;
    }
    let cancelled = false;
    const applySeed = (): void => {
      if (cancelled) {
        return;
      }
      for (const [x0, y0, x1, y1] of seedStrokes()) {
        for (const key of cellsOnSegment(x0, y0, x1, y1)) {
          cells.current.set(key, SEED_FILL);
        }
      }
      redraw();
    };
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    const timeout = new Promise<void>((resolve) => window.setTimeout(resolve, 600));
    void Promise.race([fontsReady, timeout]).then(applySeed);
    return () => {
      cancelled = true;
    };
  }, [redraw]);

  const toDocumentPoint = (event: ReactPointerEvent): { x: number; y: number } => ({
    x: event.clientX + window.scrollX,
    y: event.clientY + window.scrollY,
  });

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (!active) {
      return;
    }
    event.preventDefault();
    isDrawing.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = toDocumentPoint(event);
    lastPoint.current = point;
    applyCell(cellKey(point.x, point.y), tool);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (!isDrawing.current) {
      return;
    }
    const point = toDocumentPoint(event);
    const previous = lastPoint.current ?? point;
    for (const key of cellsOnSegment(previous.x, previous.y, point.x, point.y)) {
      applyCell(key, tool);
    }
    lastPoint.current = point;
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>): void => {
    isDrawing.current = false;
    lastPoint.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const clearAll = (): void => {
    cells.current.clear();
    redraw();
  };

  const togglePencil = (): void => {
    if (panelOpen) {
      setPanelOpen(false);
      setTool("off");
    } else {
      setPanelOpen(true);
      setTool((current) => (current === "off" ? "rouge" : current));
    }
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-0"
      />

      {active ? (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-30 touch-none select-none"
          style={{ cursor: CRAYON_CURSOR }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      ) : null}

      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
        {panelOpen ? (
          <div className="flex items-center gap-1.5 border border-line bg-paper px-2 py-1.5 shadow-flat-lg">
            {CRAYON_COLORS.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => setTool(color.id)}
                aria-label={`Crayon ${color.label}`}
                aria-pressed={tool === color.id}
                className={`h-6 w-6 rounded-full border transition-transform hover:scale-110 ${
                  tool === color.id ? "ring-2 ring-ink ring-offset-1 ring-offset-paper" : "border-line"
                }`}
                style={{ background: color.swatch }}
              />
            ))}
            <span className="mx-0.5 h-5 w-px bg-line" aria-hidden="true" />
            <button
              type="button"
              onClick={() => setTool("eraser")}
              aria-label="Gomme"
              aria-pressed={tool === "eraser"}
              className={`flex h-6 w-6 items-center justify-center border font-mono text-[11px] ${
                tool === "eraser" ? "border-ink bg-ink text-paper" : "border-line text-mono"
              }`}
            >
              G
            </button>
            <button
              type="button"
              onClick={clearAll}
              aria-label="Tout effacer"
              className="flex h-6 w-6 items-center justify-center border border-line font-mono text-[11px] text-mono hover:border-ink hover:text-ink"
            >
              ↺
            </button>
          </div>
        ) : null}

        <button
          type="button"
          onClick={togglePencil}
          aria-pressed={active}
          aria-label={active ? "Ranger le crayon" : "Prendre un crayon pour colorier le tableau"}
          className={`flex items-center gap-2 border px-3.5 py-2.5 font-mono text-[12px] uppercase tracking-mono shadow-flat-lg transition-colors ${
            active
              ? "border-ink bg-ink text-paper"
              : "border-accent bg-accent text-paper hover:bg-accent-hover"
          }`}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 20l3.2-.9L18 8.3 15.7 6 4.9 16.8 4 20z"
              fill="currentColor"
              fillOpacity="0.25"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
            <path
              d="M15.7 6l2.3 2.3 1.6-1.6a1.3 1.3 0 000-1.8l-.5-.5a1.3 1.3 0 00-1.8 0L15.7 6z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
          </svg>
          {active ? "Ranger" : "Crayon"}
        </button>
      </div>
    </>
  );
}
