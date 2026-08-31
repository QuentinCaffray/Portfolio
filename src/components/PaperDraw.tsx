import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { cellKey, cellsOnSegment, GRID_CELL } from "@/lib/paperGrid";

type CrayonColorId = "terracotta" | "sauge" | "ardoise" | "ocre" | "encre";
type DrawTool = "off" | CrayonColorId | "eraser";

const CRAYON_COLORS: { id: CrayonColorId; label: string; fill: string; swatch: string }[] = [
  { id: "terracotta", label: "Terre cuite", fill: "rgba(160,74,44,0.34)", swatch: "#a04a2c" },
  { id: "sauge", label: "Vert sauge", fill: "rgba(108,140,98,0.34)", swatch: "#6c8c62" },
  { id: "ardoise", label: "Bleu ardoise", fill: "rgba(104,128,165,0.34)", swatch: "#6880a5" },
  { id: "ocre", label: "Ocre", fill: "rgba(201,150,58,0.32)", swatch: "#c9963a" },
  { id: "encre", label: "Encre", fill: "rgba(28,26,23,0.17)", swatch: "#1c1a17" },
];

const CRAYON_CURSOR =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M3 21l3.5-1 11-11-2.5-2.5-11 11z' fill='%23e8dcb8' stroke='%231c1a17' stroke-width='1.3'/%3E%3Cpath d='M14.5 5.5l2.5 2.5 2-2a1.4 1.4 0 0 0 0-2l-.5-.5a1.4 1.4 0 0 0-2 0z' fill='%238a4a2c' stroke='%231c1a17' stroke-width='1.3'/%3E%3C/svg%3E\") 3 21, crosshair";

function fillFor(tool: DrawTool): string | null {
  return CRAYON_COLORS.find((color) => color.id === tool)?.fill ?? null;
}

/**
 * Le fond est un tableau : on peut prendre un crayon et colorier les carreaux.
 * Deux couches : un canvas de rendu derrière le contenu (les carreaux coloriés
 * font partie du papier) et, quand l'outil est pris, une surface de capture
 * transparente au-dessus qui reçoit le clic-glissé. Outil éteint par défaut
 * (le site fonctionne normalement), dessin éphémère.
 */
export function PaperDraw(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cells = useRef<Map<string, string>>(new Map());
  const isDrawing = useRef<boolean>(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const [tool, setTool] = useState<DrawTool>("off");
  const [panelOpen, setPanelOpen] = useState<boolean>(false);

  const active = tool !== "off";

  const redrawAll = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cells.current.forEach((fill, key) => {
      const [column, row] = key.split(",").map(Number);
      ctx.fillStyle = fill;
      ctx.fillRect(column * GRID_CELL, row * GRID_CELL, GRID_CELL, GRID_CELL);
    });
  }, []);

  const drawCell = useCallback((key: string, currentTool: DrawTool) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) {
      return;
    }
    const [column, row] = key.split(",").map(Number);
    const x = column * GRID_CELL;
    const y = row * GRID_CELL;
    if (currentTool === "eraser") {
      cells.current.delete(key);
      ctx.clearRect(x, y, GRID_CELL, GRID_CELL);
      return;
    }
    const fill = fillFor(currentTool);
    if (!fill) {
      return;
    }
    cells.current.set(key, fill);
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, GRID_CELL, GRID_CELL);
  }, []);

  // Le canvas de rendu couvre toute la hauteur du document.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const resize = (): void => {
      const width = document.documentElement.clientWidth;
      const height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        redrawAll();
      }
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(document.body);
    window.addEventListener("resize", resize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [redrawAll]);

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
    drawCell(cellKey(point.x, point.y), tool);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (!isDrawing.current) {
      return;
    }
    const point = toDocumentPoint(event);
    const previous = lastPoint.current ?? point;
    for (const key of cellsOnSegment(previous.x, previous.y, point.x, point.y)) {
      drawCell(key, tool);
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
    redrawAll();
  };

  const togglePencil = (): void => {
    if (panelOpen) {
      setPanelOpen(false);
      setTool("off");
    } else {
      setPanelOpen(true);
      setTool((current) => (current === "off" ? "terracotta" : current));
    }
  };

  return (
    <>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-0" />

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
