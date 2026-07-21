import Link from "next/link";

import { ContactForm } from "@/components/ContactForm";
import { HeadshotPortrait } from "@/components/HeadshotPortrait";
import { ProjectRow } from "@/components/ProjectRow";
import { Reveal } from "@/components/Reveal";
import { SystemDiagram } from "@/components/SystemDiagram";
import { capabilities, projects, publicExperience } from "@/data/site";
import { getAllPosts } from "@/lib/posts";

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ contact?: string }>;
}) {
  const posts = await getAllPosts();
  const contactState = (await searchParams)?.contact;
  const initialContactStatus = contactState === "sent" || contactState === "error" ? contactState : "idle";
  return (
    <main id="main-content">
      <section className="hero shell">
        <div className="hero-rail" aria-hidden="true"><span>BRIEF / 01</span><i></i><span>2026</span></div>
        <div className="hero-copy">
          <Reveal>
            <p className="eyebrow signal">AI engineer · Agent systems</p>
            <h1>I build systems that can <em>reason</em>—and know when to ask.</h1>
            <p className="hero-lede">I’m Jancarlos Sosa, an AI engineer focused on agentic workflows, applied intelligence, and the product engineering required to make them dependable.</p>
            <div className="hero-actions">
              <Link className="primary-link" href="/work">Examine the work <span>↗</span></Link>
              <Link className="quiet-link" href="/#contact">Start a conversation</Link>
            </div>
          </Reveal>
        </div>
        <Reveal className="hero-portrait" delay={0.15} direction="scale"><HeadshotPortrait /></Reveal>
        <div className="hero-status">
          <span className="status-light"></span>
          <div><strong>Current focus</strong><p>Reliable agents · human control · useful automation</p></div>
        </div>
      </section>

      <section className="thesis-section shell section-rule">
        <Reveal className="section-intro">
          <p className="eyebrow">Operating principle / 02</p>
          <h2>Capability is easy to demo.<br /><em>Judgment</em> is harder to engineer.</h2>
        </Reveal>
        <Reveal className="thesis-copy" delay={0.1} direction="right">
          <p>My work sits between model capability and operational reality: permissions, APIs, context, failure modes, and the moment a person should remain in control.</p>
          <p>The goal is not autonomous software for its own sake. It is a system that removes repetition, exposes its reasoning, and earns the right to act.</p>
        </Reveal>
        <Reveal className="diagram-wrap" direction="diagram"><SystemDiagram /></Reveal>
      </section>

      <section className="work-section shell section-rule">
        <div className="section-heading-row" data-scroll="left">
          <div><p className="eyebrow">Selected systems / 03</p><h2>Evidence over adjectives.</h2></div>
          <Link className="text-link" href="/work">All work <span>↗</span></Link>
        </div>
        <div className="project-list">
          {projects.map((project) => <ProjectRow project={project} key={project.slug} />)}
        </div>
      </section>

      <section className="experience-section shell section-rule">
        <div className="section-heading-row" data-scroll="left">
          <div><p className="eyebrow">Field record / 04</p><h2>Building across the stack.</h2></div>
          <Link className="text-link" href="/about">Full context <span>↗</span></Link>
        </div>
        <div className="experience-layout">
          <div className="experience-feature" data-scroll="scale">
            <span className="experience-year">{publicExperience[0].period}</span>
            <h3>{publicExperience[0].role}</h3>
            <p>{publicExperience[0].summary}</p>
          </div>
          <div className="capability-list">
            {capabilities.map((item, index) => (
              <Reveal className="capability-row" delay={index * 0.06} key={item.label}>
                <span>0{index + 1}</span><strong>{item.label}</strong><p>{item.detail}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="writing-section shell section-rule">
        <div className="section-heading-row" data-scroll="left">
          <div><p className="eyebrow">Working notes / 05</p><h2>Writing in public,<br />thinking in systems.</h2></div>
          <Link className="text-link" href="/blog">Open journal <span>↗</span></Link>
        </div>
        {posts.length ? (
          <div className="post-list">{posts.slice(0, 3).map((post) => <Link href={`/blog/${post.slug}`} key={post.slug}><time>{post.date}</time><strong>{post.title}</strong><span>{post.readingMinutes} min ↗</span></Link>)}</div>
        ) : (
          <div className="journal-empty" data-scroll="scale"><span className="cursor-block"></span><p>The notebook is open. The first field note is being prepared.</p><small>New writing will appear here.</small></div>
        )}
      </section>

      <section className="contact-section shell section-rule" id="contact">
        <div className="contact-heading" data-scroll="left"><p className="eyebrow">Open channel / 06</p><h2>Have a consequential problem?</h2><p>I’m interested in applied AI roles, thoughtful collaborations, and systems where reliability matters as much as novelty.</p></div>
        <ContactForm initialStatus={initialContactStatus} />
      </section>
    </main>
  );
}
