import { afterEach, describe, expect, it, vi } from "vitest";

import { withTimeout } from "../lib/with-timeout";

describe("provider timeout", () => {
  afterEach(() => vi.useRealTimers());

  it("rejects a stalled provider call after the configured deadline", async () => {
    vi.useFakeTimers();
    const stalled = new Promise<never>(() => undefined);
    const timed = withTimeout(stalled, 8_000);
    const rejection = expect(timed).rejects.toThrow("timed out");

    await vi.advanceTimersByTimeAsync(8_000);
    await rejection;
  });

  it("runs timeout cleanup before rejecting", async () => {
    vi.useFakeTimers();
    const onTimeout = vi.fn();
    const timed = withTimeout(new Promise<never>(() => undefined), 8_000, onTimeout)
      .catch((error: unknown) => error);

    await vi.advanceTimersByTimeAsync(8_000);
    expect(onTimeout).toHaveBeenCalledOnce();
    expect(await timed).toBeInstanceOf(Error);
  });
});
