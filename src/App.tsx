import { Route, Routes } from "react-router-dom";
import { ScrollManager } from "@/lib/ScrollManager";
import { SkipLink } from "@/components/layout/SkipLink";
import { HomePage } from "@/pages/HomePage";
import { ProjectPage } from "@/pages/ProjectPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export default function App(): JSX.Element {
  return (
    <div className="min-h-dvh bg-paper-grid">
      <SkipLink />
      <ScrollManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projets/:slug" element={<ProjectPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}
