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
const SEED_FILL = "rgba(190,46,38,0.32)";

/** Un carreau isolé, utilisé comme accent ponctuel. */
function dot(x: number, y: number): number[] {
  return [x, y, x, y];
}

/**
 * Amorce du tableau : une composition abstraite de traits rouges dans les marges
 * de l'accueil. Vocabulaire orthogonal (colonnes, tirets, angles, carreaux
 * isolés) + une seule grande diagonale comme accent — net à la maille de 26px,
 * là où un faisceau de diagonales se souderait en aplat. Chaque élément reste
 * détaché. Tout tient dans les marges (coordonnées document) ; rien si la marge
 * est trop étroite (petit écran).
 */
function seedStrokes(viewportWidth: number): number[][] {
  const contentWidth = Math.min(1180, viewportWidth - 40);
  const sideMargin = (viewportWidth - contentWidth) / 2;
  if (sideMargin < 80) {
    return [];
  }

  const band = Math.min(sideMargin - 12, 210); // largeur exploitable de marge
  const left = 16; // origine dans la marge gauche
  const right = viewportWidth - 16 - band; // origine dans la marge droite

  return [
    // ————— marge gauche : colonne + tirets, angle, accents —————
    [left + band * 0.5, 150, left + band * 0.5, 452],
    [left + band * 0.16, 178, left + band * 0.5, 178],
    [left + band * 0.5, 426, left + band * 0.9, 426],
    [left + band * 0.12, 648, left + band * 0.12, 726],
    [left + band * 0.12, 726, left + band * 0.56, 726],
    dot(left + band * 0.82, 258),
    dot(left + band * 0.36, 556),
    dot(left + band * 0.66, 832),
    // ————— marge droite : diagonale accent, colonne + tiret, angle, accents —————
    [right + band * 0.9, 150, right + band * 0.06, 470],
    [right + band * 0.34, 566, right + band * 0.34, 858],
    [right + band * 0.34, 592, right + band * 0.82, 592],
    [right + band * 0.5, 1044, right + band, 1044],
    [right + band * 0.5, 1044, right + band * 0.5, 1120],
    dot(right + band * 0.68, 320),
    dot(right + band * 0.14, 700),
    dot(right + band * 0.86, 1180),
    // ————— bas, en marge de « à propos » —————
    [right + band * 0.36, 1712, right + band * 0.36, 1900],
    [right + band * 0.36, 1900, right + band * 0.82, 1900],
    dot(right + band * 0.14, 1788),
  ];
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

  // Amorce : quelques traits de crayon rouge sur l'accueil, au montage, pour
  // donner du relief. Idempotent (mêmes carreaux) donc sans garde. Éphémère :
  // repart vierge au rechargement.
  useEffect(() => {
    if (window.location.pathname !== "/") {
      return;
    }
    for (const [x0, y0, x1, y1] of seedStrokes(window.innerWidth)) {
      for (const key of cellsOnSegment(x0, y0, x1, y1)) {
        cells.current.set(key, SEED_FILL);
      }
    }
    redraw();
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
          <div className="flex items-center gap-1.5 border border-line bg-paper px-2 py-1.5 shadow-flat">
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
          className={`flex h-10 w-10 items-center justify-center border shadow-flat transition-colors ${
            active ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink hover:border-ink"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 20l3.2-.9L18 8.3 15.7 6 4.9 16.8 4 20z"
              fill="currentColor"
              fillOpacity="0.25"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M15.7 6l2.3 2.3 1.6-1.6a1.3 1.3 0 000-1.8l-.5-.5a1.3 1.3 0 00-1.8 0L15.7 6z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
