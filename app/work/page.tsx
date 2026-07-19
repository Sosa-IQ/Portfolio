import { ProjectRow } from "@/components/ProjectRow";
import { projects } from "@/data/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Work",
  "Selected AI systems and software engineering case studies by Jancarlos Sosa.",
  "/work",
);

export default function WorkPage() {
  return (
    <main id="main-content" className="interior-page shell">
      <header className="page-masthead">
        <p className="eyebrow">System archive / 01</p>
        <h1>Selected work,<br /><em>opened up.</em></h1>
        <p>Not a wall of logos. A closer look at the constraints, architecture, and control points behind the systems I build.</p>
      </header>
      <div className="project-list expanded-project-list">
        {projects.map((project) => <ProjectRow project={project} key={project.slug} />)}
      </div>
    </main>
  );
}
