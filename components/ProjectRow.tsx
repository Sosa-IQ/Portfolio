import Link from "next/link";

import type { Project } from "@/data/site";

export function ProjectRow({ project }: { project: Project }) {
  return (
    <article className={`project-row accent-${project.accent}`} data-scroll="rise">
      <div className="project-index">{project.index}</div>
      <div className="project-copy">
        <p className="eyebrow">{project.eyebrow}</p>
        <h3>{project.title}</h3>
        <p className="project-summary">{project.summary}</p>
        <ul className="signal-list">
          {project.signals.map((signal) => <li key={signal}>{signal}</li>)}
        </ul>
      </div>
      <div className="project-side">
        <p>{project.impact}</p>
        <div className="stack-line">{project.stack.slice(0, 4).join(" · ")}</div>
        <Link className="project-arrow" href={`/work/${project.slug}`} aria-label={`Read ${project.title} case study`}>↗</Link>
      </div>
    </article>
  );
}
