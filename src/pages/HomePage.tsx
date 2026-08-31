import { useDocumentMeta } from "@/lib/useDocumentMeta";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Hero } from "@/components/home/Hero";
import { DraggableBoard } from "@/components/home/DraggableBoard";
import { MethodSection } from "@/components/home/MethodSection";
import { AboutStack } from "@/components/home/AboutStack";

export function HomePage(): JSX.Element {
  useDocumentMeta({
    title: "Quentin Caffray — Développeur full stack JavaScript / React",
    description:
      "Développeur full stack JavaScript / React. Trois applications en service : une caisse commune de brigade de gendarmerie, un pilotage de boutique, un rapport de diagnostic énergétique vulgarisé par IA.",
    path: "/",
  });

  return (
    <>
      <SiteHeader />
      <main id="contenu" className="pb-8">
        <Hero />
        <DraggableBoard />
        <MethodSection />
        <AboutStack />
      </main>
      <SiteFooter />
    </>
  );
}
