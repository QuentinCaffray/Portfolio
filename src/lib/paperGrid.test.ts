import { describe, expect, it } from "vitest";
import { cellKey, cellsOnSegment, GRID_CELL } from "@/lib/paperGrid";

describe("paperGrid", () => {
  it("mappe un point vers la bonne cellule", () => {
    expect(cellKey(0, 0)).toBe("0,0");
    expect(cellKey(GRID_CELL - 1, GRID_CELL - 1)).toBe("0,0");
    expect(cellKey(GRID_CELL, GRID_CELL)).toBe("1,1");
    expect(cellKey(3 * GRID_CELL + 5, 60)).toBe(`3,${Math.floor(60 / GRID_CELL)}`);
  });

  it("couvre toutes les cellules d'un segment horizontal", () => {
    const keys = cellsOnSegment(0, 0, 5 * GRID_CELL, 0);
    expect(keys).toContain("0,0");
    expect(keys).toContain("5,0");
    expect(keys.length).toBeGreaterThanOrEqual(6);
  });

  it("ne saute pas de cellule sur une diagonale", () => {
    const keys = new Set(cellsOnSegment(0, 0, 4 * GRID_CELL, 4 * GRID_CELL));
    expect(keys.has("0,0")).toBe(true);
    expect(keys.has("4,4")).toBe(true);
  });
});
