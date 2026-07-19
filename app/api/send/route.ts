import { NextResponse } from "next/server";
import { Resend } from "resend";

import { consumeContactRateLimit } from "@/lib/contact-rate-limit";
import { validateContactPayload } from "@/lib/contact";

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

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (body && typeof body === "object" && "company" in body && String(body.company ?? "").trim()) {
    return NextResponse.json({ ok: true });
  }

  const validation = validateContactPayload(body);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.errors[0] }, { status: 400 });
  }

  const rateLimit = consumeContactRateLimit(clientAddress(request));
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many messages. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL;
  const toEmail = process.env.TO_EMAIL;
  if (!apiKey || !fromEmail || !toEmail) {
    return NextResponse.json({ error: "Contact delivery is temporarily unavailable." }, { status: 503 });
  }

  const { name, email, message } = validation.data;
  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: `Portfolio contact <${fromEmail}>`,
      to: [toEmail],
      replyTo: email,
      subject: `Portfolio inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
    if (result.error || !result.data?.id) {
      return NextResponse.json({ error: "Message could not be delivered." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Message could not be delivered." }, { status: 502 });
  }
}
