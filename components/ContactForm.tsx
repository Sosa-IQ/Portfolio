"use client";

import { FormEvent, useState } from "react";

type ContactStatus = "idle" | "sent" | "error";

const statusMessages: Record<ContactStatus, string> = {
  idle: "",
  sent: "Message received. I’ll respond as soon as I can.",
  error: "Message could not be sent. Please try again later.",
};

export function ContactForm({ initialStatus = "idle" }: { initialStatus?: ContactStatus }) {
  const [state, setState] = useState<ContactStatus | "sending">(initialStatus);
  const [message, setMessage] = useState(statusMessages[initialStatus]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setState("sending");
    setMessage("");
    const form = new FormData(formElement);

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          message: form.get("message"),
          company: form.get("company"),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Message could not be sent.");
      formElement.reset();
      setState("sent");
      setMessage("Message received. I’ll respond as soon as I can.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Message could not be sent.");
    }
  }

  return (
    <form action="/api/send" className="contact-form" data-scroll="right" method="post" onSubmit={submit}>
      <div className="form-row">
        <label><span>Name</span><input name="name" autoComplete="name" minLength={2} maxLength={100} required /></label>
        <label><span>Email</span><input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
      </div>
      <label className="honeypot" aria-hidden="true">Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
      <label><span>Message</span><textarea name="message" rows={5} minLength={10} maxLength={5000} required /></label>
      <div className="form-footer">
        <button className="text-link form-submit" disabled={state === "sending"} type="submit">
          {state === "sending" ? "Transmitting…" : "Send message"} <span>↗</span>
        </button>
        <p className={`form-status ${state}`} aria-live="polite">{message}</p>
      </div>
    </form>
  );
}
