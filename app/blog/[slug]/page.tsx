import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { getAllPosts, getPostBySlug } from "@/lib/posts";

export async function generateStaticParams() { return (await getAllPosts()).map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const post = await getPostBySlug((await params).slug); return post ? { title: post.title, description: post.description } : {}; }

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPostBySlug((await params).slug);
  if (!post) notFound();
  return (
    <main id="main-content" className="article-page shell">
      <Link className="back-link" href="/blog">← Field journal</Link>
      <header><p className="eyebrow">{post.tags.join(" · ")}</p><h1>{post.title}</h1><p>{post.description}</p><div><time>{post.date}</time><span>{post.readingMinutes} minute read</span></div></header>
      <article className="prose"><MDXRemote source={post.content} /></article>
    </main>
  );
}
