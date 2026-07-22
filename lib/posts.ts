import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type PostMetadata = {
  slug: string;
  title: string;
  description: string;
  date: string;
  published: boolean;
  tags: string[];
  readingMinutes: number;
};

export type Post = PostMetadata & { content: string };

type PostOptions = {
  contentDirectory?: string;
  includeDrafts?: boolean;
};

const defaultContentDirectory = path.join(process.cwd(), "content", "blog");
const safeSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function normalizedDate(value: unknown): string | null {
  const date = value instanceof Date ? value : typeof value === "string" ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function metadataFromFile(slug: string, source: string): Post | null {
  const parsed = matter(source);
  const title = typeof parsed.data.title === "string" ? parsed.data.title.trim() : "";
  const description = typeof parsed.data.description === "string" ? parsed.data.description.trim() : "";
  const date = normalizedDate(parsed.data.date);
  if (!title || !description || !date) return null;

  const words = parsed.content.trim().split(/\s+/).filter(Boolean).length;
  return {
    slug,
    title,
    description,
    date,
    published: parsed.data.published === true,
    tags: Array.isArray(parsed.data.tags) ? parsed.data.tags.filter((tag: unknown) => typeof tag === "string") : [],
    readingMinutes: Math.max(1, Math.ceil(words / 220)),
    content: parsed.content,
  };
}

export async function getAllPosts(options: PostOptions = {}): Promise<PostMetadata[]> {
  const directory = options.contentDirectory ?? defaultContentDirectory;
  let files: string[];
  try {
    files = await readdir(directory);
  } catch {
    return [];
  }

  const parsedPosts = await Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => {
        const slug = file.slice(0, -4);
        if (!safeSlug.test(slug)) return null;
        const source = await readFile(path.join(directory, file), "utf8");
        return metadataFromFile(slug, source);
      }),
  );

  return parsedPosts
    .filter((post): post is Post => Boolean(post))
    .filter((post) => options.includeDrafts || post.published)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.date,
      published: post.published,
      tags: post.tags,
      readingMinutes: post.readingMinutes,
    }));
}

export async function getPostBySlug(slug: string, options: PostOptions = {}): Promise<Post | null> {
  if (!safeSlug.test(slug)) return null;
  const directory = options.contentDirectory ?? defaultContentDirectory;
  try {
    const source = await readFile(path.join(directory, `${slug}.mdx`), "utf8");
    const post = metadataFromFile(slug, source);
    if (!post || (!post.published && !options.includeDrafts)) return null;
    return post;
  } catch {
    return null;
  }
}
