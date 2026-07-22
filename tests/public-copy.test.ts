import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

async function source(relativePath: string) {
  return readFile(path.join(root, relativePath), "utf8");
}

describe("public-facing copy", () => {
  it("does not publish personal location labels", async () => {
    const copy = await Promise.all([
      source("app/page.tsx"),
      source("app/about/page.tsx"),
      source("components/SiteFooter.tsx"),
    ]);
    const combined = copy.join("\n");
    expect(combined).not.toMatch(/Bridgeport/i);
    expect(combined).not.toMatch(/AI engineer\s*(?:·|in)\s*Connecticut/i);
  });

  it("does not expose internal draft language or an RSS callout", async () => {
    const copy = await Promise.all([source("app/page.tsx"), source("app/blog/page.tsx")]);
    const combined = copy.join("\n");
    expect(combined).not.toMatch(/drafts? (?:remain|stay|in the workshop)/i);
    expect(combined).not.toContain("/rss.xml");
  });

  it("does not ship an RSS endpoint when the feature is not offered", async () => {
    await expect(access(path.join(root, "app/rss.xml/route.ts"))).rejects.toThrow();
  });
});
