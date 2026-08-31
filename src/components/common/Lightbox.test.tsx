import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LightboxProvider } from "@/lib/lightbox";
import { useLightbox } from "@/lib/useLightbox";
import type { ProjectScreenshot } from "@/content/projects";

const items: ProjectScreenshot[] = [
  { src: "/a.png", alt: "Capture A", caption: "Écran A" },
  { src: "/b.png", alt: "Capture B", caption: "Écran B" },
];

function Trigger() {
  const lightbox = useLightbox();
  return (
    <button type="button" onClick={() => lightbox.open({ items, index: 0 })}>
      ouvrir
    </button>
  );
}

function setup() {
  return render(
    <LightboxProvider>
      <Trigger />
    </LightboxProvider>,
  );
}

describe("Lightbox", () => {
  it("s'ouvre sur la bonne capture", async () => {
    setup();
    await userEvent.click(screen.getByRole("button", { name: "ouvrir" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Capture A" })).toBeInTheDocument();
    expect(screen.getByText(/1\s*\/\s*2/)).toBeInTheDocument();
  });

  it("navigue avec la flèche droite", async () => {
    setup();
    await userEvent.click(screen.getByRole("button", { name: "ouvrir" }));
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("img", { name: "Capture B" })).toBeInTheDocument();
    expect(screen.getByText(/2\s*\/\s*2/)).toBeInTheDocument();
  });

  it("se ferme avec Échap", async () => {
    setup();
    await userEvent.click(screen.getByRole("button", { name: "ouvrir" }));
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
