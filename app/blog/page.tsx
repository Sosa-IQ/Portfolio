import Link from "next/link";

import { pageMetadata } from "@/lib/metadata";
import { getAllPosts } from "@/lib/posts";

export const metadata = pageMetadata(
  "Writing",
  "Field notes on agentic systems, applied AI, and software engineering.",
  "/blog",
);

export default async function BlogPage() {
  const posts = await getAllPosts();
  return (
    <main id="main-content" className="interior-page shell blog-page">
      <header className="page-masthead" data-scroll="rise">
        <p className="eyebrow">Field journal / 01</p>
        <h1>Notes from the<br /><em>engineering floor.</em></h1>
        <p>Design decisions, failure modes, and practical lessons from building AI-enabled systems.</p>
      </header>
      {posts.length ? (
        <div className="blog-index">
          {posts.map((post, index) => (
            <article key={post.slug} data-scroll="rise">
              <span>0{index + 1}</span>
              <div>
                <p className="eyebrow">{post.tags.join(" · ")}</p>
                <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
                <p>{post.description}</p>
              </div>
              <div><time>{post.date}</time><small>{post.readingMinutes} min read</small></div>
            </article>
          ))}
        </div>
      ) : (
        <section className="blog-empty section-rule" data-scroll="scale">
          <div className="empty-terminal"><span>journal.status</span><strong>Preparing first transmission</strong><i /></div>
          <div><h2>First note forthcoming.</h2><p>This journal will collect practical lessons from building AI systems: architecture decisions, failure modes, evaluation, and the work required to make intelligent software dependable.</p></div>
        </section>
      )}
    </main>
  );
}
