import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const source = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("progressive interaction safeguards", () => {
  it("uses native details navigation so links remain available without JavaScript", async () => {
    const menu = await source("components/MobileMenu.tsx");
    expect(menu).toContain("<details");
    expect(menu).toContain("<summary");
    expect(menu).toContain("matchMedia(\"(min-width: 721px)\")");
  });

  it("reacts when reduced-motion preference changes at runtime", async () => {
    const motion = await source("components/ScrollMotion.tsx");
    expect(motion).toContain('addEventListener("change"');
    expect(motion).toContain("motion-ready");
  });

  it("keeps directional reveals inside the viewport", async () => {
    const styles = await source("app/globals.css");
    expect(styles).toContain("overflow-x: clip");
    expect(styles).not.toContain("* 72px");
    expect(styles).not.toContain("will-change: transform");
  });

  it("keeps the portrait straight during scroll motion", async () => {
    const styles = await source("app/globals.css");
    const portraitRule = styles.match(/html\.motion-ready \.hero-portrait \.portrait-frame \{([^}]*)\}/);
    expect(portraitRule).not.toBeNull();
    expect(portraitRule?.[1]).toContain("translate3d(0, calc(var(--hero-scroll, 0) * 42px), 0)");
    expect(portraitRule?.[1]).not.toContain("rotate(");
  });

  it("fails if a private draft is ever tracked by Git", () => {
    const trackedDrafts = execFileSync("git", ["ls-files", "content/drafts/*"], {
      cwd: root,
      encoding: "utf8",
    }).trim();
    expect(trackedDrafts).toBe("");
  });
});
