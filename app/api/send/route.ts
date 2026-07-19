import { NextResponse } from "next/server";
import { Resend } from "resend";

import { validateContactPayload } from "@/lib/contact";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const validation = validateContactPayload(body);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.errors[0] }, { status: 400 });
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
    await resend.emails.send({
      from: `Portfolio contact <${fromEmail}>`,
      to: [toEmail],
      replyTo: email,
      subject: `Portfolio inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Message could not be delivered." }, { status: 502 });
  }
}
