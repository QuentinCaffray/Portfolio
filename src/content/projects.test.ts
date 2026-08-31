import { describe, expect, it } from "vitest";
import { getProject, projects } from "@/content/projects";

describe("contenu des projets", () => {
  it("expose exactement trois projets", () => {
    expect(projects).toHaveLength(3);
  });

  it("a des slugs uniques", () => {
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("renseigne les champs textuels obligatoires", () => {
    for (const project of projects) {
      expect(project.name.length).toBeGreaterThan(0);
      expect(project.summary.length).toBeGreaterThan(0);
      expect(project.intro.length).toBeGreaterThan(0);
      expect(project.technical.label.length).toBeGreaterThan(0);
      expect(project.blocks.demande.length).toBeGreaterThan(0);
      expect(project.blocks.change.length).toBeGreaterThan(0);
      expect(project.repoUrl).toMatch(/^https:\/\/github\.com\//);
    }
  });

  it("pointe toujours vers un projet suivant existant", () => {
    for (const project of projects) {
      expect(getProject(project.next)).toBeDefined();
    }
  });

  it("ne rend visible aucun chiffre sans valeur", () => {
    for (const project of projects) {
      const visible = project.figures.filter((figure) => !figure.todo);
      for (const figure of visible) {
        expect(figure.value.trim().length).toBeGreaterThan(0);
      }
    }
  });
});
