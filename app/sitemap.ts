import type { MetadataRoute } from "next";

import { projects } from "@/data/site";
import { getAllPosts } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.jancarlossosa.com";
  const posts = await getAllPosts();
  return [
    { url: base, priority: 1, changeFrequency: "monthly" },
    { url: `${base}/work`, priority: .9, changeFrequency: "monthly" },
    { url: `${base}/about`, priority: .7, changeFrequency: "yearly" },
    { url: `${base}/blog`, priority: .8, changeFrequency: "weekly" },
    ...projects.map(({ slug }) => ({ url: `${base}/work/${slug}`, priority: .8, changeFrequency: "yearly" as const })),
    ...posts.map(({ slug }) => ({ url: `${base}/blog/${slug}`, priority: .7, changeFrequency: "monthly" as const })),
  ];
}
