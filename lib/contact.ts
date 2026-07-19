export type ContactData = {
  name: string;
  email: string;
  message: string;
};

type ValidationResult =
  | { ok: true; data: ContactData }
  | { ok: false; errors: string[] };

export function validateContactPayload(payload: unknown): ValidationResult {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { ok: false, errors: ["Invalid request body."] };
  }

  const input = payload as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim() : "";
  const message = typeof input.message === "string" ? input.message.trim() : "";
  const errors: string[] = [];

  if (name.length < 2 || name.length > 100) errors.push("Name must be 2–100 characters.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    errors.push("Enter a valid email address.");
  }
  if (message.length < 10 || message.length > 5000) {
    errors.push("Message must be 10–5000 characters.");
  }

  return errors.length
    ? { ok: false, errors }
    : { ok: true, data: { name, email, message } };
}
