import { describe, expect, it } from "vitest";

import { navigation, projects, publicExperience } from "../data/site";

describe("public portfolio content", () => {
  it("does not expose a resume route or downloadable resume", () => {
    const serialized = JSON.stringify({ navigation, projects, publicExperience });
    expect(serialized).not.toMatch(/resume|\.pdf|download cv/i);
  });

  it("keeps client and implementation-identifying work details generalized", () => {
    const serialized = JSON.stringify(publicExperience);
    expect(serialized).not.toMatch(/oracle|jira|healthcare client|client name/i);
  });

  it("leads with current AI engineering evidence", () => {
    expect(publicExperience[0]?.role).toBe("AI Engineer");
    expect(projects.some((project) => project.slug === "budgit-buddy")).toBe(true);
    expect(projects.some((project) => project.slug === "invoice-assistant")).toBe(true);
  });
});
