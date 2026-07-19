import { HeadshotPlaceholder } from "@/components/HeadshotPlaceholder";
import { capabilities, publicExperience } from "@/data/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "About",
  "Background, engineering principles, and experience of AI engineer Jancarlos Sosa.",
  "/about",
);

export default function AboutPage() {
  return (
    <main id="main-content" className="interior-page shell">
      <header className="about-masthead" data-scroll="rise">
        <div><p className="eyebrow">Profile / 01</p><h1>Engineer by training.<br /><em>Systems thinker</em> by habit.</h1><p className="page-lede">I’m an AI engineer building at the intersection of models, software, and operational reality.</p></div>
        <HeadshotPlaceholder />
      </header>
      <section className="about-principles section-rule" data-scroll="left">
        <p className="eyebrow">How I work / 02</p>
        <div className="principle-grid"><h2>Useful before impressive.</h2><p>I prefer a clear workflow with measurable value over a clever demonstration looking for a problem. That means understanding the human process before selecting the model.</p><h2>Control is a feature.</h2><p>Agentic systems should expose consequential decisions, require approval where appropriate, and leave enough evidence to understand what happened.</p><h2>Full stack means full context.</h2><p>Reliable AI depends on more than inference: data models, APIs, authentication, interfaces, deployment, monitoring, and the quality of every boundary between them.</p></div>
      </section>
      <section className="timeline section-rule">
        <p className="eyebrow">Experience / 03</p>
        {publicExperience.map((item) => <article className="timeline-row" data-scroll="rise" key={`${item.period}-${item.role}`}><time>{item.period}</time><div><h2>{item.role}</h2><span>{item.organization}</span></div><div><p>{item.summary}</p><ul>{item.details.map((detail) => <li key={detail}>{detail}</li>)}</ul></div></article>)}
      </section>
      <section className="toolkit section-rule"><p className="eyebrow">Working range / 04</p><div>{capabilities.map((item) => <article key={item.label}><h2>{item.label}</h2><p>{item.detail}</p></article>)}</div></section>
      <section className="education-note section-rule"><p className="eyebrow">Foundation / 05</p><div><h2>B.S. Computer Science</h2><p>University of Connecticut · 2025<br />Concentration in Software Design and Development</p></div></section>
    </main>
  );
}
