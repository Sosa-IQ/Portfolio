import { describe, expect, it } from "vitest";

import { calculateRevealProgress } from "../lib/scroll-motion";

describe("scroll reveal progress", () => {
  it("is hidden before an element enters the reveal zone", () => {
    expect(calculateRevealProgress(950, 1000)).toBe(0);
  });

  it("moves continuously through the reveal zone", () => {
    expect(calculateRevealProgress(635, 1000)).toBeCloseTo(0.5);
  });

  it("is fully revealed after crossing the completion line", () => {
    expect(calculateRevealProgress(300, 1000)).toBe(1);
  });

  it("clamps safely for unusual viewport values", () => {
    expect(calculateRevealProgress(-100, 0)).toBe(1);
  });
});
