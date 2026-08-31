import { Route, Routes } from "react-router-dom";
import { ScrollManager } from "@/lib/ScrollManager";
import { LightboxProvider } from "@/lib/lightbox";
import { SkipLink } from "@/components/layout/SkipLink";
import { PaperDraw } from "@/components/PaperDraw";
import { HomePage } from "@/pages/HomePage";
import { ProjectPage } from "@/pages/ProjectPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export default function App(): JSX.Element {
  return (
    <LightboxProvider>
      <div className="relative min-h-dvh overflow-x-clip bg-paper-grid">
        <SkipLink />
        <ScrollManager />
        <PaperDraw />
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projets/:slug" element={<ProjectPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </LightboxProvider>
  );
}
