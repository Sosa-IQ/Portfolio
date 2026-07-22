import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { projects } from "../data/site";
import { pageMetadata } from "../lib/metadata";

const root = process.cwd();
const source = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("production release contract", () => {
  it("ships an optimized transparent portrait rather than placeholder copy", async () => {
    const portrait = await source("components/HeadshotPortrait.tsx");
    expect(portrait).toContain("next/image");
    expect(portrait).toContain("/images/jancarlos-sosa-portrait.webp");
    expect(portrait).not.toMatch(/pending|placeholder/i);
    await expect(access(path.join(root, "public/images/jancarlos-sosa-portrait.webp"))).resolves.toBeUndefined();
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

  it("pins the validated Node runtime and runs all release checks in CI", async () => {
    const packageJson = JSON.parse(await source("package.json"));
    expect(packageJson.engines?.node).toBe("22.x");
    const workflow = await source(".github/workflows/ci.yml");
    for (const command of ["npm test", "npm run lint", "npx tsc --noEmit", "npm run build"]) {
      expect(workflow).toContain(command);
    }
  });
});
