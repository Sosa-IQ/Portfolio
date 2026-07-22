import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const source = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("Sentry production monitoring", () => {
  it("captures client, server, edge, request, and render errors", async () => {
    const [client, server, edge, instrumentation, globalError, config] = await Promise.all([
      source("instrumentation-client.ts"),
      source("sentry.server.config.ts"),
      source("sentry.edge.config.ts"),
      source("instrumentation.ts"),
      source("app/global-error.tsx"),
      source("next.config.ts"),
    ]);

    expect(client).toContain("captureRouterTransitionStart");
    expect(instrumentation).toContain("captureRequestError");
    expect(globalError).toContain("captureException");
    expect(globalError).not.toMatch(/recorded|without losing/i);
    expect(globalError).toContain("style={errorBodyStyle}");
    expect(globalError).toContain("style={errorMainStyle}");
    expect(config).toContain("withSentryConfig");
    expect(config).toContain("process.env.VERCEL_ENV");
    for (const runtime of [client, server, edge]) {
      expect(runtime).toContain("process.env.NEXT_PUBLIC_SENTRY_DSN");
      expect(runtime).toContain("process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT");
      expect(runtime).toMatch(/environment[:,]/);
      expect(runtime).not.toContain("process.env.NODE_ENV");
      expect(runtime).not.toMatch(/dsn:\s*["']https?:\/\//);
      expect(runtime).toContain("sendDefaultPii: false");
      expect(runtime).toContain("tracesSampleRate");
      expect(runtime).not.toMatch(/replayIntegration|replaysSessionSampleRate|replaysOnErrorSampleRate/);
    }
  });

  it("keeps source-map upload credentials in environment configuration", async () => {
    const config = await source("next.config.ts");
    expect(config).toContain("process.env.SENTRY_AUTH_TOKEN");
    expect(config).not.toMatch(/authToken:\s*["'][^"']+["']/);
  });
});
