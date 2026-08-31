import { Navigate, useParams } from "react-router-dom";
import { getProject, type Project, type ProjectScreenshot } from "@/content/projects";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { BackBar } from "@/components/project/BackBar";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { TechnicalCallout } from "@/components/project/TechnicalCallout";
import { AlternatingBlock } from "@/components/project/AlternatingBlock";
import { ProjectGallery } from "@/components/project/ProjectGallery";
import { NextProjectNav } from "@/components/project/NextProjectNav";

export function ProjectPage(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProject(slug) : undefined;

  if (!project) {
    return <Navigate to="/" replace />;
  }

  return <ProjectView key={project.slug} project={project} />;
}

function isZoomable(shot: ProjectScreenshot): boolean {
  return shot.placeholder !== true && shot.src !== "";
}

function ProjectView({ project }: { project: Project }): JSX.Element {
  useDocumentMeta({
    title: `${project.name} — ${project.meta.contexte} · Quentin Caffray`,
    description: project.summary,
    path: `/projets/${project.slug}`,
  });

  const { demande, change } = project.screenshots;
  // Série complète parcourable dans la lightbox : blocs puis galerie.
  const lightboxItems = [demande, change, ...project.gallery].filter(isZoomable);

  return (
    <>
      <BackBar activeSlug={project.slug} />
      <main id="contenu" className="flex flex-col gap-12 pb-16 pt-2 bp:gap-16">
        <ProjectHeader project={project} />
        <TechnicalCallout technical={project.technical} />
        <AlternatingBlock
          label="Ce que ça a demandé"
          body={project.blocks.demande}
          screenshot={demande}
          mediaSide="left"
          rotation={-0.3}
          lightboxItems={lightboxItems}
          lightboxIndex={lightboxItems.indexOf(demande)}
        />
        <AlternatingBlock
          label="Ce que ça a changé"
          body={project.blocks.change}
          screenshot={change}
          mediaSide="right"
          rotation={0.35}
          lightboxItems={lightboxItems}
          lightboxIndex={lightboxItems.indexOf(change)}
        />
        <ProjectGallery screenshots={project.gallery} lightboxItems={lightboxItems} />
      </main>
      <NextProjectNav nextSlug={project.next} />
      <SiteFooter />
    </>
  );
}
