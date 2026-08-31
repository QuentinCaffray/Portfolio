import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { projects } from "@/content/projects";

function renderHome() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
}

describe("HomePage", () => {
  it("affiche l'accroche principale", () => {
    renderHome();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Je construis des outils que des gens utilisent tous les jours/i,
      }),
    ).toBeInTheDocument();
  });

  it("liste les trois fiches projet avec un lien vers leur page", () => {
    renderHome();
    for (const project of projects) {
      const link = screen.getByRole("link", { name: new RegExp(project.name, "i") });
      expect(link).toHaveAttribute("href", `/projets/${project.slug}`);
    }
  });

  it("affiche le badge de disponibilité orienté CDI", () => {
    renderHome();
    expect(screen.getByText(/opportunités CDI/i)).toBeInTheDocument();
  });

  it("affiche le numéro de contact", () => {
    renderHome();
    expect(screen.getByRole("link", { name: /06 09 97 52 44/ })).toHaveAttribute(
      "href",
      "tel:+33609975244",
    );
  });
});
