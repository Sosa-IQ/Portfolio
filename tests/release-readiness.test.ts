import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { projects } from "../data/site";
import { pageMetadata } from "../lib/metadata";

const root = process.cwd();
const source = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

function extendedWebpMetadata(buffer: Buffer) {
  expect(buffer.subarray(0, 4).toString("ascii")).toBe("RIFF");
  expect(buffer.subarray(8, 12).toString("ascii")).toBe("WEBP");

  for (let offset = 12; offset + 8 <= buffer.length; ) {
    const type = buffer.subarray(offset, offset + 4).toString("ascii");
    const size = buffer.readUInt32LE(offset + 4);
    if (type === "VP8X") {
      const payload = offset + 8;
      return {
        hasAlpha: Boolean(buffer[payload] & 0x10),
        width: buffer.readUIntLE(payload + 4, 3) + 1,
        height: buffer.readUIntLE(payload + 7, 3) + 1,
      };
    }
    offset += 8 + size + (size % 2);
  }

  throw new Error("Expected an extended WebP portrait");
}

describe("production release contract", () => {
  it("ships an optimized transparent portrait rather than placeholder copy", async () => {
    const portrait = await source("components/HeadshotPortrait.tsx");
    const assetPath = path.join(root, "public/images/jancarlos-sosa-portrait.webp");
    const asset = extendedWebpMetadata(await readFile(assetPath));
    expect(portrait).toContain("next/image");
    expect(portrait).toContain("/images/jancarlos-sosa-portrait.webp");
    expect(portrait).not.toMatch(/pending|placeholder/i);
    expect(asset).toEqual({ width: 800, height: 1000, hasAlpha: true });
    await expect(access(assetPath)).resolves.toBeUndefined();
  });

  it("does not advertise unhealthy live project endpoints", () => {
    for (const slug of ["budgit-buddy", "psg-trades"]) {
      expect(projects.find((project) => project.slug === slug)?.live).toBeUndefined();
    }
    expect(JSON.stringify(projects)).not.toContain("Production cloud deployment");
  });

  it("requests h2 project headings on the work index", async () => {
    const [component, workPage] = await Promise.all([
      source("components/ProjectRow.tsx"),
      source("app/work/page.tsx"),
    ]);
    expect(component).toContain("const Heading = headingLevel");
    expect(component).toContain("<Heading>{project.title}</Heading>");
    expect(workPage).toContain('headingLevel="h2"');
  });

  it("keeps the complete system flow visible at tablet widths", async () => {
    const styles = await source("app/globals.css");
    expect(styles).not.toMatch(/diagram-stage:nth-of-type\(n\+4\)[^}]*display:\s*none/);
    expect(styles).toContain("grid-template-columns: repeat(7, minmax(0, auto))");
  });

  it("constrains long project titles inside the mobile grid", async () => {
    const styles = await source("app/globals.css");
    expect(styles).toContain("grid-template-columns: 32px minmax(0, 1fr)");
    expect(styles).toContain("overflow-wrap: anywhere");
  });

  it("keeps HSTS scoped to the production hostname", async () => {
    const config = await source("next.config.ts");
    const hsts = config.match(/Strict-Transport-Security[^\n]+/i)?.[0] ?? "";
    expect(hsts).toContain("max-age=63072000");
    expect(hsts).not.toMatch(/includeSubDomains|preload/i);
  });

  it("publishes consistent Open Graph and Twitter imagery", () => {
    const metadata = pageMetadata("Work", "Selected work", "/work");
    expect(metadata.openGraph?.images).toEqual(["/opengraph-image"]);
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image", images: ["/opengraph-image"] });
  });

  it("identifies the homepage as AI Engineer in link previews", async () => {
    const layout = await source("app/layout.tsx");
    const openGraph = layout.match(/openGraph:\s*{([\s\S]*?)\n\s*},\n\s*twitter:/)?.[1] ?? "";
    expect(openGraph).toContain('description: "AI Engineer"');
  });

  it("pins the validated Node runtime and runs all release checks in CI", async () => {
    const packageJson = JSON.parse(await source("package.json"));
    expect(packageJson.engines?.node).toBe("22.x");
    const workflow = await source(".github/workflows/ci.yml");
    for (const command of ["npm test", "npm run lint", "npx tsc --noEmit", "npm run build"]) {
      expect(workflow).toContain(command);
    }
  });
});
