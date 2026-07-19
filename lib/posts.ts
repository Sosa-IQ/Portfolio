import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type PostMetadata = {
  slug: string;
  title: string;
  description: string;
  date: string;
  draft: boolean;
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

function metadataFromFile(slug: string, source: string): Post {
  const parsed = matter(source);
  const words = parsed.content.trim().split(/\s+/).filter(Boolean).length;
  return {
    slug,
    title: String(parsed.data.title ?? "Untitled"),
    description: String(parsed.data.description ?? ""),
    date: String(parsed.data.date ?? ""),
    draft: parsed.data.draft === true,
    tags: Array.isArray(parsed.data.tags) ? parsed.data.tags.map(String) : [],
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

  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => {
        const slug = file.slice(0, -4);
        const source = await readFile(path.join(directory, file), "utf8");
        return metadataFromFile(slug, source);
      }),
  );

  return posts
    .filter((post) => options.includeDrafts || !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.date,
      draft: post.draft,
      tags: post.tags,
      readingMinutes: post.readingMinutes,
    }));
}

export async function getPostBySlug(
  slug: string,
  options: PostOptions = {},
): Promise<Post | null> {
  if (!safeSlug.test(slug)) return null;
  const directory = options.contentDirectory ?? defaultContentDirectory;
  try {
    const source = await readFile(path.join(directory, `${slug}.mdx`), "utf8");
    const post = metadataFromFile(slug, source);
    return post.draft && !options.includeDrafts ? null : post;
  } catch {
    return null;
  }
}
