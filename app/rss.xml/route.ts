import { getAllPosts } from "@/lib/posts";

export async function GET() {
  const posts = await getAllPosts();
  const items = posts.map((post) => `<item><title><![CDATA[${post.title}]]></title><link>https://www.jancarlossosa.com/blog/${post.slug}</link><guid>https://www.jancarlossosa.com/blog/${post.slug}</guid><pubDate>${new Date(post.date).toUTCString()}</pubDate><description><![CDATA[${post.description}]]></description></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Jancarlos Sosa — Field Journal</title><link>https://www.jancarlossosa.com/blog</link><description>Notes on agentic systems, applied AI, and software engineering.</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
}
