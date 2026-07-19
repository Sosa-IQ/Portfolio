import { beforeEach, describe, expect, it, vi } from "vitest";

const sendMock = vi.hoisted(() => vi.fn());
vi.mock("resend", () => ({
  Resend: class MockResend {
    emails = { send: sendMock };
  },
}));

import { POST } from "../app/api/send/route";
import { resetContactRateLimits } from "../lib/contact-rate-limit";

function contactRequest(body: Record<string, unknown>, ip = "203.0.113.10") {
  return new Request("https://www.jancarlossosa.com/api/send", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://www.jancarlossosa.com",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
}

const validBody = {
  name: "Test Person",
  email: "test@example.com",
  message: "This is a sufficiently detailed test message.",
  company: "",
};

describe("contact route delivery and abuse controls", () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = "test-key";
    process.env.FROM_EMAIL = "portfolio@example.com";
    process.env.TO_EMAIL = "owner@example.com";
    sendMock.mockReset();
    resetContactRateLimits();
  });

  it("returns 502 rather than false success when Resend rejects delivery", async () => {
    sendMock.mockResolvedValue({ data: null, error: { message: "rejected" } });
    const response = await POST(contactRequest(validBody));
    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({ error: "Message could not be delivered." });
  });

  it("returns success only when Resend provides a message id", async () => {
    sendMock.mockResolvedValue({ data: { id: "email_123" }, error: null });
    const response = await POST(contactRequest(validBody));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
  });

  it("silently accepts honeypot submissions without invoking Resend", async () => {
    const response = await POST(contactRequest({ ...validBody, company: "Bot Company" }));
    expect(response.status).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rate limits repeated submissions by forwarded client address", async () => {
    sendMock.mockResolvedValue({ data: { id: "email_123" }, error: null });
    for (let attempt = 0; attempt < 3; attempt += 1) {
      expect((await POST(contactRequest(validBody, "203.0.113.20"))).status).toBe(200);
    }
    const response = await POST(contactRequest(validBody, "203.0.113.20"));
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBeTruthy();
  });

  it("rejects cross-origin form submissions", async () => {
    const request = contactRequest(validBody);
    request.headers.set("origin", "https://attacker.example");
    expect((await POST(request)).status).toBe(403);
    expect(sendMock).not.toHaveBeenCalled();
  });
});
