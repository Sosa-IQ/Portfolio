import { beforeEach, describe, expect, it } from "vitest";

import {
  contactRateLimitEntryCount,
  consumeContactRateLimit,
  resetContactRateLimits,
} from "../lib/contact-rate-limit";

describe("contact rate-limit memory hygiene", () => {
  beforeEach(resetContactRateLimits);

  it("prunes expired client entries before recording a new attempt", () => {
    consumeContactRateLimit("expired-client", 0);
    consumeContactRateLimit("current-client", 10 * 60 * 1000 + 1);

    expect(contactRateLimitEntryCount()).toBe(1);
  });
});
