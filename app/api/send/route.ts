import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";

import { consumeContactRateLimit } from "@/lib/contact-rate-limit";
import { validateContactPayload, type ContactData } from "@/lib/contact";
import { withTimeout } from "@/lib/with-timeout";

const MAX_BODY_BYTES = 8 * 1024;
const PROVIDER_TIMEOUT_MS = 8_000;

type RequestMode = "json" | "form";
type ParsedBody = { mode: RequestMode; body: Record<string, unknown> };
type ParseResult = ParsedBody | { response: NextResponse };

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

function clientAddress(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("cf-connecting-ip")
    || request.headers.get("x-real-ip")
    || "unknown";
}

async function readBoundedBody(request: Request): Promise<string | null> {
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) return null;
  if (!request.body) return "";

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let received = 0;
  let body = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    body += decoder.decode(value, { stream: true });
  }

  return body + decoder.decode();
}

async function parseBody(request: Request): Promise<ParseResult> {
  const mediaType = request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
  const mode: RequestMode | null = mediaType === "application/json"
    ? "json"
    : mediaType === "application/x-www-form-urlencoded"
      ? "form"
      : null;

  if (!mode) {
    return {
      response: NextResponse.json({ error: "Unsupported request format." }, { status: 415 }),
    };
  }

  const rawBody = await readBoundedBody(request);
  if (rawBody === null) {
    return {
      response: mode === "form"
        ? formRedirect(request, "error")
        : NextResponse.json({ error: "Request body is too large." }, { status: 413 }),
    };
  }

  try {
    const body = mode === "json"
      ? JSON.parse(rawBody)
      : Object.fromEntries(new URLSearchParams(rawBody));
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Invalid body");
    return { mode, body: body as Record<string, unknown> };
  } catch {
    return {
      response: mode === "form"
        ? formRedirect(request, "error")
        : NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }),
    };
  }
}

function formRedirect(request: Request, state: "sent" | "error"): NextResponse {
  const target = new URL("/", request.url);
  target.searchParams.set("contact", state);
  target.hash = "contact";
  return NextResponse.redirect(target, 303);
}

function contactIdempotencyKey({ name, email, message }: ContactData): string {
  const digest = createHash("sha256")
    .update(JSON.stringify([name, email, message]))
    .digest("hex");
  return `portfolio-contact/${digest}`;
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  }

  const parsed = await parseBody(request);
  if ("response" in parsed) return parsed.response;
  const { body, mode } = parsed;

  if ("company" in body && String(body.company ?? "").trim()) {
    return mode === "form" ? formRedirect(request, "sent") : NextResponse.json({ ok: true });
  }

  const validation = validateContactPayload(body);
  if (!validation.ok) {
    return mode === "form"
      ? formRedirect(request, "error")
      : NextResponse.json({ error: validation.errors[0] }, { status: 400 });
  }

  const rateLimit = consumeContactRateLimit(clientAddress(request));
  if (!rateLimit.allowed) {
    if (mode === "form") return formRedirect(request, "error");
    return NextResponse.json(
      { error: "Too many messages. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL;
  const toEmail = process.env.TO_EMAIL;
  if (!apiKey || !fromEmail || !toEmail) {
    return mode === "form"
      ? formRedirect(request, "error")
      : NextResponse.json({ error: "Contact delivery is temporarily unavailable." }, { status: 503 });
  }

  const { name, email, message } = validation.data;
  try {
    const resend = new Resend(apiKey);
    const controller = new AbortController();
    const requestOptions = {
      idempotencyKey: contactIdempotencyKey(validation.data),
      signal: controller.signal,
    } as NonNullable<Parameters<typeof resend.emails.send>[1]> & { signal: AbortSignal };
    const result = await withTimeout(
      resend.emails.send({
        from: `Portfolio contact <${fromEmail}>`,
        to: [toEmail],
        replyTo: email,
        subject: `Portfolio inquiry from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }, requestOptions),
      PROVIDER_TIMEOUT_MS,
      () => controller.abort(),
    );
    if (result.error || !result.data?.id) {
      return mode === "form"
        ? formRedirect(request, "error")
        : NextResponse.json({ error: "Message could not be delivered." }, { status: 502 });
    }
    return mode === "form" ? formRedirect(request, "sent") : NextResponse.json({ ok: true });
  } catch {
    return mode === "form"
      ? formRedirect(request, "error")
      : NextResponse.json({ error: "Message could not be delivered." }, { status: 502 });
  }
}
