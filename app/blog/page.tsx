import type { Metadata } from "next";
import Link from "next/link";

import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = { title: "Writing", description: "Field notes on agentic systems, applied AI, and software engineering." };

export default async function BlogPage() {
  const posts = await getAllPosts();
  return (
    <main id="main-content" className="interior-page shell blog-page">
      <header className="page-masthead">
        <p className="eyebrow">Field journal / 01</p>
        <h1>Notes from the<br /><em>engineering floor.</em></h1>
        <p>Design decisions, failure modes, and practical lessons from building AI-enabled systems. Drafts stay private until the thinking holds up.</p>
      </header>
      {posts.length ? <div className="blog-index">{posts.map((post, index) => <article key={post.slug}><span>0{index + 1}</span><div><p className="eyebrow">{post.tags.join(" · ")}</p><h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2><p>{post.description}</p></div><div><time>{post.date}</time><small>{post.readingMinutes} min read</small></div></article>)}</div> : <section className="blog-empty section-rule"><div className="empty-terminal"><span>journal.status</span><strong>Preparing first transmission</strong><i></i></div><div><h2>Nothing public—yet.</h2><p>There are drafts in the workshop, but no placeholder prose on the public shelf. The first note will appear when it says something useful.</p><a className="text-link" href="/rss.xml">RSS is ready <span>↗</span></a></div></section>}
    </main>
  );
}
