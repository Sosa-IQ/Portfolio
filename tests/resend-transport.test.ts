import { afterEach, describe, expect, it, vi } from "vitest";
import { Resend } from "resend";

describe("Resend transport options", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("forwards the abort signal and idempotency key to fetch", async () => {
    let requestInit: RequestInit | undefined;
    const fetchMock = vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
      requestInit = init;
      return new Promise<Response>((_, reject) => {
        init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const resend = new Resend("re_test_transport");
    const controller = new AbortController();
    const options = {
      idempotencyKey: "portfolio-contact/test-digest",
      signal: controller.signal,
    } as NonNullable<Parameters<typeof resend.emails.send>[1]> & { signal: AbortSignal };
    const pending = resend.emails.send({
      from: "Portfolio <portfolio@example.com>",
      to: ["owner@example.com"],
      subject: "Transport test",
      text: "Transport test body",
    }, options);

    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    expect(requestInit?.signal).toBe(controller.signal);
    expect(new Headers(requestInit?.headers).get("Idempotency-Key")).toBe(options.idempotencyKey);
    controller.abort();
    expect(requestInit?.signal?.aborted).toBe(true);
    await expect(pending).resolves.toMatchObject({
      data: null,
      error: { name: "application_error" },
    });
  });
});