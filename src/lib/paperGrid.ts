/** Taille d'un carreau du fond quadrillé (aligné sur .bg-paper-grid). */
export const GRID_CELL = 26;

/** Clé de la cellule contenant le point document (docX, docY). */
export function cellKey(docX: number, docY: number, cell: number = GRID_CELL): string {
  return `${Math.floor(docX / cell)},${Math.floor(docY / cell)}`;
}

/**
 * Cellules traversées par le segment (x0,y0)→(x1,y1). Sert à ne pas « sauter »
 * de carreaux lors d'un glissé rapide.
 */
export function cellsOnSegment(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  cell: number = GRID_CELL,
): string[] {
  const keys = new Set<string>();
  const distance = Math.hypot(x1 - x0, y1 - y0);
  const steps = Math.max(1, Math.ceil(distance / (cell / 2)));
  for (let step = 0; step <= steps; step += 1) {
    const ratio = step / steps;
    keys.add(cellKey(x0 + (x1 - x0) * ratio, y0 + (y1 - y0) * ratio, cell));
  }
  return [...keys];
}
