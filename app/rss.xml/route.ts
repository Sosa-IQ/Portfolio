import { getAllPosts } from "@/lib/posts";
import { escapeXml, wrapCdata } from "@/lib/xml";

const siteUrl = "https://www.jancarlossosa.com";

export async function GET() {
  const posts = await getAllPosts();
  const items = posts.map((post) => {
    const url = `${siteUrl}/blog/${encodeURIComponent(post.slug)}`;
    return `<item><title>${wrapCdata(post.title)}</title><link>${escapeXml(url)}</link><guid>${escapeXml(url)}</guid><pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate><description>${wrapCdata(post.description)}</description></item>`;
  }).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Jancarlos Sosa — Field Journal</title><link>${siteUrl}/blog</link><description>Notes on agentic systems, applied AI, and software engineering.</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
}
