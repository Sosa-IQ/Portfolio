import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { projects } from "@/data/site";

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return project ? { title: project.title, description: project.summary } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  return (
    <main id="main-content" className={`case-study accent-${project.accent}`}>
      <header className="case-hero shell">
        <Link className="back-link" href="/work">← System archive</Link>
        <p className="eyebrow">Case file / {project.index}</p>
        <h1>{project.title}</h1>
        <p className="case-summary">{project.summary}</p>
        <div className="case-meta"><span>{project.eyebrow}</span><span>{project.stack.join(" · ")}</span></div>
      </header>
      <section className="case-body shell section-rule">
        <div className="case-impact"><p className="eyebrow">Outcome</p><h2>{project.impact}</h2></div>
        <div className="case-narrative"><p>{project.description}</p><h3>Engineering signals</h3><ul>{project.signals.map((signal) => <li key={signal}>{signal}</li>)}</ul></div>
      </section>
      <section className="case-links shell section-rule">
        <div><p className="eyebrow">Source and surface</p><h2>Inspect the artifact.</h2></div>
        <div>{project.github && <Link className="primary-link" href={project.github} target="_blank" rel="noreferrer">GitHub <span>↗</span></Link>}{project.live && <Link className="quiet-link" href={project.live} target="_blank" rel="noreferrer">Live system ↗</Link>}</div>
      </section>
    </main>
  );
}
