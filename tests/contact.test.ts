import { describe, expect, it } from "vitest";

import { validateContactPayload } from "../lib/contact";

describe("contact payload validation", () => {
  it("accepts a concise valid message", () => {
    expect(
      validateContactPayload({
        email: "visitor@example.com",
        name: "A Visitor",
        message: "I would like to discuss an applied AI engineering role.",
      }),
    ).toEqual({
      ok: true,
      data: {
        email: "visitor@example.com",
        name: "A Visitor",
        message: "I would like to discuss an applied AI engineering role.",
      },
    });
  });

  it("rejects malformed or oversized fields", () => {
    expect(
      validateContactPayload({
        email: "not-an-email",
        name: "",
        message: "x".repeat(5001),
      }).ok,
    ).toBe(false);
  });

  it("rejects control characters that could corrupt email headers", () => {
    expect(
      validateContactPayload({
        email: "visitor@example.com",
        name: "A Visitor\r\nBcc: attacker@example.com",
        message: "This message is otherwise long enough to be accepted.",
      }).ok,
    ).toBe(false);
  });
});
