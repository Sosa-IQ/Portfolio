import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { getAllPosts, getPostBySlug } from "../lib/posts";

async function fixtureDirectory() {
  const directory = await mkdtemp(path.join(tmpdir(), "portfolio-posts-"));
  const fixtures: Record<string, string> = {
    "published.mdx": `---\ntitle: Published note\ndescription: Public description\ndate: 2026-07-10\npublished: true\ntags: [AI systems]\n---\nPublic body`,
    "private-draft.mdx": `---\ntitle: Private draft\ndescription: Not public\ndate: 2026-07-11\npublished: false\ntags: [Draft]\n---\nPrivate body`,
    "missing-state.mdx": `---\ntitle: Missing state\ndescription: Must fail closed\ndate: 2026-07-12\ntags: [Draft]\n---\nPrivate body`,
    "string-state.mdx": `---\ntitle: String state\ndescription: A string must not publish\ndate: 2026-07-13\npublished: "true"\ntags: [Draft]\n---\nPrivate body`,
    "invalid-date.mdx": `---\ntitle: Bad date\ndescription: Must not reach RSS\ndate: someday\npublished: true\ntags: [Draft]\n---\nInvalid body`,
  };
  await Promise.all(Object.entries(fixtures).map(([name, source]) => writeFile(path.join(directory, name), source)));
  return directory;
}

describe("blog publishing rules", () => {
  it("publishes only posts explicitly marked with boolean published: true", async () => {
    const contentDirectory = await fixtureDirectory();
    const posts = await getAllPosts({ contentDirectory });
    expect(posts.map((post) => post.slug)).toEqual(["published"]);
  });

  it("allows valid unpublished posts only when preview access is explicit", async () => {
    const contentDirectory = await fixtureDirectory();
    const posts = await getAllPosts({ contentDirectory, includeDrafts: true });
    expect(posts.map((post) => post.slug).sort()).toEqual([
      "missing-state",
      "private-draft",
      "published",
      "string-state",
    ]);
  });

  it("does not return unpublished or malformed posts through public lookup", async () => {
    const contentDirectory = await fixtureDirectory();
    await expect(getPostBySlug("private-draft", { contentDirectory })).resolves.toBeNull();
    await expect(getPostBySlug("missing-state", { contentDirectory })).resolves.toBeNull();
    await expect(getPostBySlug("string-state", { contentDirectory })).resolves.toBeNull();
    await expect(getPostBySlug("invalid-date", { contentDirectory })).resolves.toBeNull();
  });

  it("rejects path traversal in post slugs", async () => {
    const contentDirectory = await fixtureDirectory();
    await expect(getPostBySlug("../private-draft", { contentDirectory })).resolves.toBeNull();
  });
});
