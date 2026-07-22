import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

function formContactRequest(body: Record<string, string>, ip = "203.0.113.11") {
  return new Request("https://www.jancarlossosa.com/api/send", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      origin: "https://www.jancarlossosa.com",
      "x-forwarded-for": ip,
    },
    body: new URLSearchParams(body),
  });
}

const validBody = {
  name: "Test Person",
  email: "test@example.com",
  message: "This is a sufficiently detailed test message.",
  company: "",
};

describe("contact route delivery and abuse controls", () => {
  afterEach(() => vi.useRealTimers());

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

  it("retains the Portfolio contact sender identity", async () => {
    sendMock.mockResolvedValue({ data: { id: "email_123" }, error: null });

    expect((await POST(contactRequest(validBody))).status).toBe(200);
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({ from: "Portfolio contact <portfolio@example.com>" }),
      expect.any(Object),
    );
  });

  it("aborts timed-out delivery and reuses the idempotency key on retry", async () => {
    vi.useFakeTimers();
    let providerSignal: AbortSignal | undefined;
    sendMock.mockImplementationOnce((_message, options) => {
      providerSignal = options.signal;
      return new Promise((_, reject) => {
        options.signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
      });
    });

    const pending = POST(contactRequest(validBody, "203.0.113.40"));
    await vi.advanceTimersByTimeAsync(8_000);
    expect((await pending).status).toBe(502);
    expect(providerSignal?.aborted).toBe(true);

    sendMock.mockResolvedValueOnce({ data: { id: "email_retry" }, error: null });
    expect((await POST(contactRequest(validBody, "203.0.113.40"))).status).toBe(200);
    expect(sendMock.mock.calls[0][1].idempotencyKey).toBe(sendMock.mock.calls[1][1].idempotencyKey);
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

  it("accepts same-origin submissions on preview hosts", async () => {
    sendMock.mockResolvedValue({ data: { id: "email_preview" }, error: null });
    const request = new Request("https://portfolio-preview.vercel.app/api/send", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://portfolio-preview.vercel.app",
        "x-forwarded-for": "203.0.113.33",
      },
      body: JSON.stringify(validBody),
    });

    expect((await POST(request)).status).toBe(200);
  });

  it("rejects cross-origin form submissions", async () => {
    const request = contactRequest(validBody);
    request.headers.set("origin", "https://attacker.example");
    expect((await POST(request)).status).toBe(403);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("delivers a no-JavaScript form submission and redirects without leaking fields", async () => {
    sendMock.mockResolvedValue({ data: { id: "email_123" }, error: null });
    const response = await POST(formContactRequest(validBody));

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("https://www.jancarlossosa.com/?contact=sent#contact");
    expect(response.headers.get("location")).not.toContain("test%40example.com");
    expect(sendMock).toHaveBeenCalledOnce();
  });

  it("rejects unsupported media types", async () => {
    const request = new Request("https://www.jancarlossosa.com/api/send", {
      method: "POST",
      headers: {
        "content-type": "text/plain",
        origin: "https://www.jancarlossosa.com",
      },
      body: "not a supported contact body",
    });

    expect((await POST(request)).status).toBe(415);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects oversized request bodies before parsing", async () => {
    const request = contactRequest({ ...validBody, message: "x".repeat(9000) });
    expect((await POST(request)).status).toBe(413);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("redirects oversized no-JavaScript forms to the privacy-safe error state", async () => {
    const request = formContactRequest({ ...validBody, message: "x".repeat(9000) });
    const response = await POST(request);
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("https://www.jancarlossosa.com/?contact=error#contact");
  });
});
