import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { getAllPosts, getPostBySlug } from "../lib/posts";

async function fixtureDirectory() {
  const directory = await mkdtemp(path.join(tmpdir(), "portfolio-posts-"));
  await writeFile(
    path.join(directory, "published.mdx"),
    `---\ntitle: Published note\ndescription: Public description\ndate: 2026-07-10\ndraft: false\ntags: [AI systems]\n---\nPublic body`,
  );
  await writeFile(
    path.join(directory, "private-draft.mdx"),
    `---\ntitle: Private draft\ndescription: Not public\ndate: 2026-07-11\ndraft: true\ntags: [Draft]\n---\nPrivate body`,
  );
  return directory;
}

describe("blog publishing rules", () => {
  it("excludes drafts from the public post index", async () => {
    const contentDirectory = await fixtureDirectory();
    const posts = await getAllPosts({ contentDirectory });
    expect(posts.map((post) => post.slug)).toEqual(["published"]);
  });

  it("allows drafts only when preview access is explicit", async () => {
    const contentDirectory = await fixtureDirectory();
    const posts = await getAllPosts({ contentDirectory, includeDrafts: true });
    expect(posts.map((post) => post.slug).sort()).toEqual([
      "private-draft",
      "published",
    ]);
  });

  it("does not return a draft through the public detail lookup", async () => {
    const contentDirectory = await fixtureDirectory();
    await expect(
      getPostBySlug("private-draft", { contentDirectory }),
    ).resolves.toBeNull();
  });

  it("rejects path traversal in post slugs", async () => {
    const contentDirectory = await fixtureDirectory();
    await expect(
      getPostBySlug("../private-draft", { contentDirectory }),
    ).resolves.toBeNull();
  });
});
